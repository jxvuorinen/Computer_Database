'use strict';

const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 4000;
const host = process.env.HOST || 'localhost';

const palvelin = http.createServer(app);
const Tietovarasto = require('./tietokanta/tietovarasto.js');
const tietokoneet = new Tietovarasto();

app.use(express.json());
app.use(cors());

//Polut
//Juureen, localhost 4000:
app.get('/', (req, res) => res.json({ virhe: "Komento puuttuu." }));

//polku /api/tietokoneet
app.get('/api/tietokoneet', (req, res) =>
    tietokoneet.haeKaikki()
        .then(tulos => res.json(tulos))
        .catch(virhe => res.json({ virhe: virhe.message }))
);

//polku: /api/tietokoneet/tunniste
app.route('/api/tietokoneet/:tunniste')
    .get((req, res) => {
        const tunniste = req.params.tunniste;
        tietokoneet.haeYksi(tunniste)
            .then(tulos => res.json(tulos))
            .catch(virhe => res.json({ virhe: virhe.message }))
    })
    .delete((req, res) => {
        const tunniste = req.params.tunniste;
        tietokoneet.poista(tunniste)
            .then(tulos => res.json(tulos))
            .catch(virhe => res.json({ virhe: virhe.message }))
    })
    .post((req, res) => {
        if (!req.body) res.json({ virhe: 'ei löydy' });
        tietokoneet.muutaTiedot(req.body)
            .then(tulos => res.json(tulos))
            .catch(virhe => res.json({ virhe: virhe.message }))
    })
    .put((req, res) => {
        if (!req.body) res.json({ virhe: "Ei löydy" });
        tietokoneet.lisaa(req.body)
            .then(tulos => res.json(tulos))
            .catch(virhe => res.json({ virhe: virhe.message }))
    });
app.all('*', (req, res) =>
    res.json('resurssia ei löydy tai yksilöivä numero puuttuu')
);

palvelin.listen(port, host, () =>
    console.log(`Palvelin ${host} portissa ${port}`)
);
