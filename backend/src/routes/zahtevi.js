const express = require('express')
const pool = require('../DB')
const { createPoolCluster } = require('mysql')
const ruter = express.Router()

ruter.route('').get((req, res) => {
    pool.query('SELECT username, tip, status FROM zahtev JOIN korisnik USING(idKor)', (err, results) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Greska' })
            return
        }
        res.json(results)
    })
})

ruter.route('').post((req, res) => {
    const tip = req.body.tip.toLowerCase()
    const username = req.body.username
    const id = tip == 'poljoprivrednik' ? 'idPolj' : 'idPre'

    pool.query(`SELECT * FROM korisnik JOIN ${tip} ON (idKor = ${id}) WHERE username = ?`, username, (err, results) => {
        if (err) {
            res.json({ message: 'Error' })
            return
        }
        const korisnik = results[0]
        if (!korisnik) {
            res.json({ message: 'Korisnik nije pronadjen' })
            return
        }

        if (!req.body.proveraZahteva) {
            res.json({ message: 'ok', korisnik: korisnik })
            return
        }

        pool.query(`SELECT * FROM zahtev WHERE idKor = ?`, korisnik.idKor, (err, results) => {
            if (err) {
                console.log(err)
                res.json({ message: 'Error' })
                return false
            }
            if (results.length == 0 || results[0]['status'] == 1) res.json({ message: 'ok', korisnik: korisnik })
            else res.json({ message: 'Ceka se odobrenje administratora' })
        })
    })
})

ruter.route('').delete((req, res) => {
    pool.query('DELETE FROM zahtev WHERE status != 0', (err) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Error' })
            return
        }
        res.json({ message: 'ok' })
    })
})

ruter.route('/odobri').patch((req, res) => {
    pool.query('UPDATE zahtev SET status = 1 WHERE idKor = (SELECT idKor FROM korisnik WHERE username = ?)', req.body.username, (err) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Greska' })
            return
        }
        res.json({ message: 'ok' })
    })
})

ruter.route('/odbij').patch((req, res) => {
    pool.query('UPDATE zahtev SET status = 2 WHERE idKor = (SELECT idKor FROM korisnik WHERE username = ?)', req.body.username, (err) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Greska' })
            return
        }
        res.json({ message: 'ok' })
    })
})

module.exports = ruter
