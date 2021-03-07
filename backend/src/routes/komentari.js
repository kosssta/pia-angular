const express = require('express')
const ruter = express.Router()

const pool = require('../DB')

ruter.route('').post((req, res) => {

    pool.query('SELECT komentar.*, korisnik.username FROM komentar JOIN proizvod USING (idPro) JOIN korisnik ON (korisnik.idKor = komentar.idKor) WHERE idPro = ? AND komentar.idKor != ?', [req.body.idPro, req.body.idKor],
        (err, results) => {
            if (err) {
                console.log(err)
                res.json({ message: 'Greska' })
                return
            }
            res.json({ message: 'ok', komentari: results })
        })
})

ruter.route('').put((req, res) => {

    pool.query('SELECT * FROM narudzbina WHERE idPro = ? AND narucilac = ? AND status = 3', [req.body.idPro, req.body.idKor], (err, results) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Greska' })
            return
        }

        if (results.length == 0) {
            res.json({ message: 'Morate prvo poruciti proizvod da biste mogli dati ocenu i komentar' });
            return
        }

        pool.query('SELECT * FROM komentar WHERE idPro = ? AND idKor = ?', [req.body.idPro, req.body.idKor], (err, results) => {
            if (err) {
                console.log(err)
                res.json({ message: 'Greska' })
                return
            }

            if (results.length == 0) {
                res.json({ message: 'empty' });
                return
            }

            res.json({ message: 'ok', komentar: results[0] })
        })
    })
})

ruter.route('/dodavanje').post((req, res) => {

    const komentar = req.body.komentar
    pool.query('SELECT idKor FROM korisnik WHERE username = ?', komentar.username, (err, results) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Greska' })
            return
        }

        if (results.length == 0) {
            res.json({ message: 'Greska' })
            return
        }

        pool.query('INSERT INTO komentar (komentar, ocena, idKor, idPro) VALUES (?, ?, ?, ?)', [komentar.komentar, komentar.ocena, results[0]['idKor'], komentar.idPro],
            (err, results) => {
                if (err) {
                    console.log(err)
                    res.json({ message: 'Greska' })
                    return
                }
                res.json({ message: 'ok' })
            })
    })
})

module.exports = ruter
