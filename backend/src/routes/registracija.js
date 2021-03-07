const express = require('express')
const ruter = express.Router()

const pool = require('../DB')

const DODAJ_POLJOPRIVREDNIKA_QUERY = 'INSERT INTO poljoprivrednik (idPolj, ime, prezime, datum_rodjenja, mesto_rodjenja, kontakt_telefon, email) VALUES (?, ?, ?, ?, ?, ?, ?)'
const DODAJ_PREDUZECE_QUERY = 'INSERT INTO preduzece (idPre, punNaziv, datumOsnivanja, mesto, email) VALUES (?, ?, ?, ?, ?)'

function dodajKorisnika(connection, query, values, res) {
    connection.query(query, values, (err) => {
        if (err) {
            console.log(err)
            connection.rollback(() => res.json({ message: 'Greska pri dodavanju u drugu bazu' }))
            pool.releaseConnection(connection)
            return
        }
        connection.commit((err) => {
            if (err) {
                console.log(err)
                connection.rollback(() => res.json({ message: 'Error' }))
                pool.releaseConnection(connection)
                return
            }
            pool.releaseConnection(connection)
            res.json({ message: 'ok' })
        })
    })
}

ruter.route('').post((req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Error' })
            return
        }

        connection.beginTransaction(err => {
            if (err) {
                console.log(err)
                pool.releaseConnection(connection)
                res.json({ message: 'Error' })
                return
            }
            connection.query('INSERT INTO korisnik (username, password) VALUES (?, ?)',
                [req.body.username, req.body.password],
                (err, results) => {
                    if (err) {
                        console.log(err)
                        const tip = req.body.tip.toLowerCase()
                        connection.rollback(() => res.json({ message: tip == 'preduzece' ? 'Skraceni naziv je zauzet' : 'Korisnicko ime je zauzeto' }))
                        pool.releaseConnection(connection)
                        return
                    }

                    const idKor = results.insertId
                    const tip = req.body.tip.toLowerCase()
                    connection.query('INSERT INTO zahtev (idKor, tip, status) VALUES (?, ?, ?)', [idKor, tip, req.body.status], err => {
                        if (err) {
                            console.log(err)
                            console.rollback(() => { res.json({ message: 'Greska' }) })
                            pool.releaseConnection(connection)
                            return
                        }
                        switch (tip) {
                            case 'poljoprivrednik':
                                dodajKorisnika(connection, DODAJ_POLJOPRIVREDNIKA_QUERY, [results.insertId, req.body.ime, req.body.prezime, req.body.datumRodjenja, req.body.mestoRodjenja, req.body.telefon, req.body.email], res)
                                break
                            case 'preduzece':
                                dodajKorisnika(connection, DODAJ_PREDUZECE_QUERY, [results.insertId, req.body.punNaziv, req.body.datumOsnivanja, req.body.mesto, req.body.email], res)
                                break
                        }
                    })
                }
            )
        })
    })
})

module.exports = ruter
