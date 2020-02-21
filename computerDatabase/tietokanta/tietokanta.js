'use strict';

const mariadb=require('mariadb');

module.exports=class Tietokanta{
    constructor(optiot) {
        this.optiot = optiot;
    }
    //sql: sql lause
    //parametrit: taulukko arvoja ? merkkien tilalle
    suoritaKysely(sql, parametrit) {
        return new Promise(async (resolve, reject) => {
            let yhteys;
            try{
                yhteys = await mariadb.createConnection(this.optiot);
                let kyselynTulos = await yhteys.query(sql, parametrit);
                if (typeof kyselynTulos === 'undefined') {
                    reject(new Error('Kyselyvirhe'));
                }
                //Mariadb-spesifinen kohta
                else if(typeof kyselynTulos.affectedRows === 'undefined') {
                    //tulee tulos, poistetaan metatieto
                    delete kyselynTulos.meta;
                    resolve({kyselynTulos, tulosjoukko:true});

                }
                else {
                    resolve({
                        kyselynTulos: {
                            muutetutRivitLkm:kyselynTulos.affectedRows,
                            lisattyNro:kyselynTulos.insertId,
                            status:kyselynTulos.warningStatus
                        },
                        tulosjoukko:false
                    });
                }
            }
            catch(virhe) {
                reject(new Error('SQL-virhe:' + virhe.message));
            }
            finally{
                if (yhteys) yhteys.end();
            }
        });

    }
}