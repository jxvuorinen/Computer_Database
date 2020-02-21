'use strict';

const Tietokanta = require('./tietokanta.js');
const kohtalokasVirhe = virhe => new Error('Anteeksi! ' + virhe.message);

const haeKaikkiSql = 'select tunniste,nimi,tyyppi,hinta,lukumaara from tietokone';
const haeYksiSql = 'select tunniste,nimi,tyyppi,hinta,lukumaara from tietokone where tunniste=?';
const lisaaKoneSql = 'insert into tietokone(tunniste, nimi, tyyppi, hinta, lukumaara) values(?,?,?,?,?)';
const muutosSql = 'update tietokone set nimi=?, tyyppi=?, hinta=?, lukumaara=? where tunniste=?';
const poistaSql = 'delete from tietokone where tunniste=?';

const lisattavaKone = tietokone => [
    tietokone.tunniste, tietokone.nimi, tietokone.tyyppi, tietokone.hinta, tietokone.lukumaara];

const muutettavaKone = tietokone => [
    tietokone.nimi, tietokone.tyyppi, tietokone.hinta, tietokone.lukumaara, tietokone.tunniste];

module.exports = class Tietokonekanta {
    constructor() {
        this.koneDb = new Tietokanta({
            host: 'localhost',
            port: 3306,
            user: 'eevi',
            password: 'rRt3Yfcn',
            database: 'tietokonetietokanta'
        });
    }
    haeKaikki() {
        //palauttaa Promisen
        return new Promise(async (resolve, reject) => {
            try {
                const tulos = await this.koneDb.suoritaKysely(haeKaikkiSql);
                resolve(tulos.kyselynTulos);
            }
            catch (virhe) {
                reject(kohtalokasVirhe(virhe));
            }
        });
    }

    haeYksi(tunnisteId) {
        return new Promise(async (resolve, reject) => {
            try {
                const tulos = await this.koneDb.suoritaKysely(haeYksiSql, tunnisteId);
                if (tulos.kyselynTulos.length === 0) {
                    reject(new Error('Yhtään tietokonetta ei löytynyt antamallasi tunnisteella.'));
                }
                else {
                    resolve(tulos.kyselynTulos[0]);
                }
            }
            catch (virhe) {
                reject(kohtalokasVirhe(virhe));
            }
        });
    };

    lisaa(uusiKone) {
        return new Promise(async (resolve, reject) => {
            try {
                const tulos = await this.koneDb.suoritaKysely(lisaaKoneSql, lisattavaKone(uusiKone));
                if (tulos.kyselynTulos.muutetutRivitLkm === 0) {
                    reject(new Error('Tietokonetta ei lisätty.'));
                }
                else {
                    resolve(`Lisättiin tietokone numerolla ${uusiKone.tunniste}.`);
                }
            }
            catch(virhe) {
                reject(kohtalokasVirhe(virhe.message));
            }
        });
    };

    muutaTiedot(muutettava) {
        return new Promise(async (resolve, reject) => {
            try {
                const tulos = await this.koneDb.suoritaKysely(muutosSql, muutettavaKone(muutettava));
                if (tulos.kyselynTulos.muutetutRivitLkm === 0) {
                    reject(new Error('Tietoja ei muutettu.'));
                }
                else {
                    resolve(`Muutettu tietokoneen ${muutettava.tunniste} tiedot.`);
                }
            }
            catch(virhe) {
                reject(kohtalokasVirhe(virhe.message));
            }
        });
    };
    //poistetaan tietokannasta kone id:llä, joka syötetään lomakkeessa ja lähetetään sql-kyselyn parametrina.
    //Lähetetään vahvistus- tai virheviestiin promisen tulos
    poista(poistettavaId) {
        return new Promise(async (resolve, reject) => {
            try {
                const tulos = await this.koneDb.suoritaKysely(poistaSql, poistettavaId);
                if (tulos.kyselynTulos.muutetutRivitLkm === 0) {
                    resolve(`Antamallasi tunnisteella ei löydy tietokoneita.`);
                }
                else {
                    resolve(`Tietokone tunnisteella ${poistettavaId} poistettu.`);
                }
            }
            catch(virhe) {
                reject(kohtalokasVirhe(virhe.message));
            }
        });
    };
};//Luokan loppu

