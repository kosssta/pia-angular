const express = require('express')
const ruter = express.Router()

const pool = require('../DB')

ruter.route('').post((req, res) => {
    pool.query('SELECT idKor FROM Korisnik WHERE username = ?', req.body.username, (err, results) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Error' })
            return
        }

        pool.query('SELECT * FROM rasadnik WHERE idKor = ?', results[0]['idKor'], (err, results) => {
            if (err) {
                console.log(err)
                res.json({ message: 'Error' })
                return
            }

            res.json({ message: 'ok', rasadnici: results })
        })
    })
})

ruter.route('/dodavanje').post((req, res) => {
    pool.query('SELECT idKor FROM Korisnik WHERE username = ?', req.body.username, (err, results) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Error' })
            return
        }

        const rasadnik = req.body.rasadnik

        pool.query('INSERT INTO rasadnik (naziv, mesto, duzina, sirina, idKor) VALUES (?, ?, ?, ?, ?)',
            [rasadnik.naziv, rasadnik.mesto, rasadnik.duzina, rasadnik.sirina, results[0]['idKor']],
            (err, results) => {
                if (err) {
                    console.log(err)
                    res.json({ message: 'Error' })
                    return
                }

                res.json({ message: 'ok', idRasadnika: results.insertId })
            })
    })
})

ruter.route('/dohvati').post((req, res) => {
    pool.query('SELECT * FROM rasadnik WHERE idRas = ?', req.body.idRas, (err, results) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Error' })
            return
        }

        res.json({ message: 'ok', rasadnik: results[0] })
    })
})

ruter.route('').patch((req, res) => {
    pool.query('UPDATE rasadnik SET voda = ?, temperatura = ?, poslatMail = 0 WHERE idRas = ?', [req.body.rasadnik.voda, req.body.rasadnik.temperatura, req.body.rasadnik.idRas], (err, results) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Greska' })
            return
        }

        res.json({ message: 'ok' })
    })
})

ruter.route('/odrzavanje').post((req, res) => {
    pool.query('SELECT rasadnik.* FROM rasadnik WHERE idKor = ? AND (voda < 75 OR temperatura < 12)', req.body.idKor, (err, results) => {
        if(err) {
            console.log(err)
            res.json({message: 'Greska'})
            return
        }

        res.json({message: 'ok', rasadnici: results})
    })
})

module.exports = ruter
