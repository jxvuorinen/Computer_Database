'use strict';

const Tietovarasto = require('./tietokanta/tietovarasto.js');
const tietokoneet = new Tietovarasto();

async function hae() {
    try {
        const tulos = await tietokoneet.haeKaikki();
        console.log(tulos);
    }
    catch(virhe) {
        console.log(virhe.message);
        
    }
}

async function haeYksi(tunnisteId) {
    try {
        const tulos = await tietokoneet.haeYksi(tunnisteId);
        console.log(tulos);
    }
    catch(virhe) {
        console.log(virhe.message);
        
    }
}

async function lisaa(lisattavaKone) {
    try{
        const tulos = await tietokoneet.lisaa(lisattavaKone);
        console.log(tulos);       
    }
    catch(virhe) {
        console.log(virhe.message);
        
    }
}

async function muuta(muutettavaObjekti) {
    try{
        const tulos = await tietokoneet.muutaTiedot(muutettavaObjekti);
        console.log(tulos);
    }
    catch(virhe) {
        console.log(virhe.message);
        
    }
}

async function poista(poistettavaTunniste) {
    try {
        const tulos = await tietokoneet.poista(poistettavaTunniste);
        console.log(tulos);
    }
    catch(virhe) {
        console.log(virhe-message);
    }
}

async function aja() {
    await hae();
    console.log('*********');
    
    await haeYksi(2);
    console.log('*********');

    await lisaa({tunniste:4, nimi:"GameDelux2", tyyppi:"pöytäkone", hinta:1500, lukumaara:5});
    console.log('*********');

    await muuta({tunniste:4, nimi:"GameDelux1", tyyppi:"pöytäkone", hinta:1500, lukumaara:5});
    console.log('*********');

    await hae();
    console.log('*********');
    await poista(4);
}
aja();

