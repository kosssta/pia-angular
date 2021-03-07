const express = require('express')
const ruter = express.Router()

const pool = require('../DB')

const SELECT_QUERIES = {
  'poljoprivrednik': 'SELECT * FROM poljoprivrednik WHERE idPolj = ?',
  'preduzece': 'SELECT * FROM preduzece WHERE idPre = ?',
  'administrator': 'SELECT * FROM administrator WHERE idAdm = ?'
}

const UPDATE_QUERIES = {
  'poljoprivrednik': 'UPDATE poljoprivrednik SET ime = ?, prezime = ?, datum_rodjenja = ?, mesto_rodjenja = ?, kontakt_telefon = ?, email = ? WHERE idPolj = ?',
  'preduzece': 'UPDATE preduzece SET punNaziv = ?, datumOsnivanja = ?, mesto = ?, email = ? WHERE idPre = ?'
}

const zahteviRoute = require('./zahtevi')
ruter.use('/login/zahtevi', zahteviRoute)

ruter.route('').post((req, res) => {

  pool.query('SELECT * FROM korisnik WHERE username = ? AND password = ?',
    [req.body.korisnik.username, req.body.korisnik.password],
    (err, results) => {
      if (err) {
        res.json({ message: 'Error prvi' })
        return
      }
      if (results.length == 0) {
        res.json({ message: 'Pogresni kredencijali' })
        return
      }

      const idKor = results[0]['idKor']
      const username = results[0]['username']
      const password = results[0]['password']
      const tip = req.body.tip.toLowerCase()

      pool.query('SELECT idKor, status FROM Zahtev WHERE idKor = ?', idKor, (err, results) => {
        if (err) {
          console.log(err)
          res.json({ message: 'Error zahtevi' })
          return
        }

        if (results.length > 0) {
          switch (results[0]['status']) {
            case 0: res.json({ message: 'Ceka se odobrenje administratora' })
              return
            case 1: break
            case 2: res.json({ message: 'Zahtev za registraciju je odbijen' })
              return
            default: res.json({ message: 'Error nista' })
              return
          }
        }
        pool.query(SELECT_QUERIES[tip], idKor, (err, results) => {
          if (err) {
            console.log(err)
            res.json({ message: 'Error u drugoj bazi' })
            return
          }
          if (results.length == 0) {
            res.json({ message: 'Pogresan tip korisnika' })
            return
          }

          let korisnik = results[0];
          korisnik['username'] = username
          korisnik['password'] = password
          korisnik['tip'] = tip
          res.json({ message: 'ok', korisnik: korisnik, idKor: idKor })
        })
      })
    })
})

ruter.route('').patch((req, res) => {

  pool.query('UPDATE korisnik SET password = ? WHERE idKor = ?', [req.body.password, req.body.idKor], (err) => {
    if (err) {
      console.log(err)
      res.json({ message: 'Greska' })
      return
    }
    res.json({ message: 'ok' })
  })
})

ruter.route('/brisanje').post((req, res) => {
  pool.query('DELETE FROM korisnik WHERE username = ?', req.body.username, (err, results) => {
    if (err) {
      console.log(err)
      res.json({ message: 'Error' })
      return
    }
    res.json({ message: 'ok' })
  })
})

function azurirajKorisnika(connection, query, values, res) {
  connection.query(query, values, (err, results) => {
    if (err) {
      console.log(err)
      connection.rollback(() => res.json({ message: 'Greska' }))
      pool.releaseConnection(connection)
      return
    }
    connection.commit(err => {
      if (err) {
        console.log(err)
        connection.rollback(() => res.json({ message: 'Greska' }))
        pool.releaseConnection(connection)
        return
      }
      pool.releaseConnection(connection)
      res.json({ message: 'ok' })
    })
  })
}

ruter.route('/azuriraj').post((req, res) => {
  const korisnik = req.body.korisnik
  const tip = req.body.tip
  const oldUsername = req.body.oldUsername

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err)
      connection.rollback(() => res.json({ message: 'Greska' }))
      pool.releaseConnection(connection)
      return
    }
    connection.beginTransaction(err => {
      if (err) {
        console.log(err)
        connection.rollback(() => res.json({ message: 'Greska' }))
        pool.releaseConnection(connection)
        return
      }
      connection.query('UPDATE korisnik SET username = ?, password = ? WHERE username = ?', [korisnik.username, korisnik.password, oldUsername],
        (err) => {
          if (err) {
            console.log(err)
            connection.rollback(() => res.json({ message: 'Greska' }))
            pool.releaseConnection(connection)
            return
          }

          connection.query('SELECT idKor FROM korisnik WHERE username = ?', korisnik.username, (err, results) => {
            if (err) {
              console.log(err)
              connection.rollback(() => res.json({ message: 'Greska' }))
              pool.releaseConnection(connection)
              return
            }

            if (results.length == 0) {
              connection.rollback(() => res.json({ message: 'Unexpected error' }))
              pool.releaseConnection(connection)
              return
            }

            const idKor = results[0]['idKor']

            switch (tip) {
              case 'poljoprivrednik': azurirajKorisnika(connection, UPDATE_QUERIES[tip], [korisnik.ime, korisnik.prezime, korisnik.datumRodjenja.substring(0, 10), korisnik.mestoRodjenja, korisnik.telefon, korisnik.email, idKor], res)
                break
              case 'preduzece': azurirajKorisnika(connection, UPDATE_QUERIES[tip], [korisnik.punNaziv, korisnik.datumOsnivanja.substring(0, 10), korisnik.mesto, korisnik.email, idKor], res)
                break
              case 'administrator': break
              default: connection.rollback(() => res.json({ message: 'Nepostojeci tip korisnika' }))
                pool.releaseConnection(connection)
                return
            }
          })
        })
    })
  })
})

module.exports = ruter
