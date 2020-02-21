'use strict';

const http = require('http');
const path = require('path');
const express = require('express');

const app = express();

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

const palvelin = http.createServer(app);

const Tietovarasto = require('./tietokanta/tietovarasto.js');
const tietokoneet = new Tietovarasto();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'sivut'));
app.use(express.static(path.join(__dirname, 'public')));

const valikko = path.join(__dirname, 'public', 'valikko.html');
//tarvitaan formeja varten, tekee request-bodyn
app.use(express.urlencoded({ extended: false }));

//kun tullaan hakemiston juureen, näytetään valikko.html
app.get('/', (req, res) => res.sendFile(valikko));

//kun tullaan polkuun haeKaikki, haetaan tietokannasta kaikki ja lähetetään tulos oliona kaikkiKoneet-sivulle
app.get('/haeKaikki', (req, res) =>
    tietokoneet.haeKaikki()
        .then(tulos => res.render('kaikkiKoneet', { tulos }))
        .catch(virhe => lahetaVirheviesti(res, virhe.message))
);

//kun tullaan polkuun haeTietokone, lähetetään hakulomake-sivu
app.get('/haeTietokone', (req, res) =>
    res.render('hakulomake', { paaotsikko: 'Tietokoneen haku', otsikko: 'Haku', toiminto: '/haeTietokone' })
);

//kun hakusivulta lähetetään tunniste, haetaan tietokannasta kone tunnisteella ja näytetään yhden koneen tiedot hakusivulla
app.post('/haeTietokone', (req, res) => {
    if (!req.body || req.body.koneenTunniste === '') {
        lahetaVirheviesti(res, 'Ei löytynyt');
    } else {
        const tietokoneTunniste = req.body.koneenTunniste;
        tietokoneet.haeYksi(tietokoneTunniste)
            .then(tietokone => res.render('tietokoneSivu', { tietokone }))
            .catch(virhe => lahetaVirheviesti(res, virhe.message));
    }
});

app.get('/lisayslomake', (req, res) => {
    //Tähän lomakkeen lähetys
    res.render('lomake', {
        paaotsikko: 'Lisää tietokone',
        otsikko: 'Syötä uuden tietokoneen tiedot',
        toiminto: '/lisaa',
        tunniste: { arvo: '', readonly: '' },
        nimi: { arvo: '', readonly: '' },
        tyyppi: { arvo: '', readonly: '' },
        hinta: { arvo: '', readonly: '' },
        lukumaara: { arvo: '', readonly: '' }
    });
});
app.post('/lisaa', (req, res) => {
    if (!req.body || req.body.tunniste === '') {
        lahetaVirheviesti(res, 'Ei onnistunut');
    } else {
        tietokoneet.lisaa(req.body)
            .then(viesti => lahetaTilatieto(res, viesti))
            .catch(virhe => lahetaVirheviesti(res, virhe.message));
    }
});

app.get('/paivityslomake', (req, res) => {
    res.render('lomake', {
        paaotsikko: 'Muuta tietoja',
        otsikko: 'Muuta tietokoneen tietoja',
        toiminto: '/paivitakone',
        tunniste: { arvo: '', readonly: '' },
        nimi: { arvo: '', readonly: "readonly" },
        tyyppi: { arvo: '', readonly: 'readonly' },
        hinta: { arvo: '', readonly: 'readonly' },
        lukumaara: { arvo: '', readonly: 'readonly' }
    });
});

app.post('/paivitakone', async (req, res) => {
    if (!req.body || req.body.tunniste === '') {
        lahetaVirheviesti(res, 'Ei onnistunut');
    } else {
        try {
            const tunniste = req.body.tunniste;
            const kone = await tietokoneet.haeYksi(tunniste);
            res.render('lomake', {
                paaotsikko: 'Tietojen päivitys',
                otsikko: 'Päivitä tietokoneen tiedot',
                toiminto: '/muutatiedot',
                tunniste: { arvo: kone.tunniste, readonly: 'readonly' },
                nimi: { arvo: kone.nimi, readonly: '' },
                tyyppi: { arvo: kone.tyyppi, readonly: '' },
                hinta: { arvo: kone.hinta, readonly: '' },
                lukumaara: { arvo: kone.lukumaara, readonly: '' }
            });
        }
        catch (virhe) {
            lahetaVirheviesti(res, virhe.message);
        }
    }
});

app.post('/muutatiedot', (req, res) => {
    if (!req.body) lahetaVirheviesti(res, 'Ei löytynyt');
    tietokoneet.muutaTiedot(req.body)
        .then(viesti => lahetaTilatieto(res, viesti))
        .catch(virhe => lahetaVirheviesti(res, virhe.message));
});

app.get('/poista', (req, res) => {
    res.render('hakulomake', {
        paaotsikko: 'Poista tiedot',
        otsikko: 'Poista tietokone tunnisteella',
        toiminto: '/poistatietokone'
    });
});

app.post('/poistatietokone', (req, res) => {
    if (!req.body || req.body.koneenTunniste === '') {
        lahetaVirheviesti(res, 'Ei löytynyt');
    } else {
        tietokoneet.poista(req.body.koneenTunniste)
            .then(viesti => lahetaTilatieto(res, viesti))
            .catch(virhe => lahetaVirheviesti(res, virhe.message));
    }
});


palvelin.listen(port, host, () => console.log(`Palvelin ${host} portissa ${port}.`));

function lahetaVirheviesti(res, viesti) {
    //sivun nimi + olio, jossa data sivun tekemiseen, muuttujat, jotka ejs-sivulla ja niiden arvot
    res.render('statussivu', {
        paaotsikko: 'Virhe',
        otsikko: 'Virhe',
        viesti: viesti
    });
};

function lahetaTilatieto(res, viesti) {
    res.render('statussivu', {
        paaotsikko: 'Tilanne',
        otsikko: 'Tila',
        viesti: viesti
    });
};









