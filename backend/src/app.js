const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const registracijaRoute = require('./routes/registracija')
app.use('/registracija', registracijaRoute)

const loginRoute = require('./routes/login')
app.use('/login', loginRoute)
app.use('/', loginRoute)

const tokenValidateRoute = require('./routes/token-validate')
app.use('/token-validate', tokenValidateRoute)

const rasadniciRoute = require('./routes/rasadnici')
app.use('/rasadnici', rasadniciRoute)

const proizvodiRoute = require('./routes/proizvodi')
app.use('/proizvodi', proizvodiRoute)

const komentariRoute = require('./routes/komentari')
app.use('/komentari', komentariRoute)

const narudzbineRoute = require('./routes/narudzbine')
app.use('/narudzbine', narudzbineRoute)

const pool = require('./DB')
const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: 'rasadnici.pia@gmail.com',
            pass: 'jaka.lozinka.'
        }
    }
)

function proveriNarudzbine(origin, kolicina, idNar, idPre, narucilac, key) {
    pool.query('UPDATE narudzbina SET status = 3 WHERE idNar = ?', idNar, err => {
        if (err) {
            console.log(err)
            return
        }

        let query = ''
        let tip = 'sadnica'

        pool.query('SELECT idSad FROM sadnica JOIN narudzbina USING (idPro) WHERE idNar = ?', idNar, (err, results) => {
            if (err) {
                console.log(err)
                return
            }

            if (results.length == 0) tip = 'preparat'

            if (tip == 'sadnica')
                query = `SELECT idSad, rasadnik FROM sadnica JOIN narudzbina USING (idPro) WHERE idNar = ${idNar} AND vlasnik = ${idPre} LIMIT ${kolicina}`
            else
                query = `SELECT idPre, rasadnik FROM preparat JOIN narudzbina USING (idPro) WHERE idNar = ${idNar} AND vlasnik = ${idPre} LIMIT ${kolicina}`


            pool.query(query, (err, results) => {
                if (err) {
                    console.log(err)
                    return
                }

                if (results.length == 0) return

                const rasadnik = results[0]['rasadnik']

                if (tip == 'sadnica') {
                    query = `UPDATE sadnica set vlasnik = '${narucilac}', idRas = ${rasadnik} WHERE idSad = `
                    query += JSON.parse(JSON.stringify(results)).map(res => res['idSad']).join(' OR idSad = ')
                }
                else {
                    query = `UPDATE preparat SET vlasnik = '${narucilac}', idRas = ${rasadnik} WHERE idPre = `
                    query += JSON.parse(JSON.stringify(results)).map(res => res['idPre']).join(' OR idPre = ')
                }

                pool.query(query, err => {
                    if (err) {
                        console.log(err)
                        return
                    }
                })
            })
        })

        pool.query('SELECT idNar, kolicina, narucilac FROM narudzbina WHERE status = 2 ORDER BY idNar', (err, results) => {
            if (err) {
                console.log(err)
                return
            }

            if (results[0]) {
                const idNar = results[0]['idNar']
                const kolicina = results[0]['kolicina']
                const narucilac = results[0]['narucilac']

                pool.query('SELECT mesto FROM rasadnik JOIN narudzbina ON (rasadnik.idRas = narudzbina.rasadnik) WHERE idNar = ?', idNar,
                    (err, results) => {
                        if (err) {
                            console.log(err)
                            return
                        }

                        destination = results[0]['mesto'].split(' ').filter(o => o.length > 0).join('+')

                        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${key}`

                        request(url, (err, response, body) => {
                            if (err) console.log(err)

                            body = JSON.parse(body)

                            if (body.status != 'OK') {
                                pool.query('UPDATE preduzece SET brojSlobodnihKurira = brojSlobodnihKurira + 1 WHERE idPre = ?', idPre,
                                    err => {
                                        if (err) {
                                            console.log(err)
                                        }
                                    }
                                )
                            }

                            const deliveryTime = body.rows[0].elements[0].duration.value * 1000
                            pool.query('UPDATE narudzbina SET status = 1 WHERE idNar = ?', idNar, err => {
                                if (err) {
                                    console.log(err)
                                    return
                                }

                                setTimeout(() => proveriNarudzbine(origin, kolicina, idNar, idPre, narucilac, key), deliveryTime)
                            })
                        })
                    })
            } else {
                pool.query('UPDATE preduzece SET brojSlobodnihKurira = brojSlobodnihKurira + 1 WHERE idPre = ?', idPre,
                    err => {
                        if (err) {
                            console.log(err)
                        }
                    }
                )
            }
        })
    })
}

const request = require('request')

function isporuciNarudzbinu(origin, destination, idNar, idPre, narucilac) {
    const key = 'AIzaSyAKA2zt5deYnG2ciga0d9mKigCkbTtsNs0'

    origin = origin.split(' ').filter(a => a.length > 0).join('+')
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${key}`

    request(url, (err, response, body) => {
        if (err) {
            console.log(err)
            return
        }

        body = JSON.parse(body)
        if (body.status != 'OK') return

        pool.query('UPDATE narudzbina SET status = 1 WHERE idNar = ?', idNar, err => {
            if (err) {
                console.log(err)
                return
            }

            const deliveryTime = body.rows[0].elements[0].duration.value * 1000
            setTimeout(() => proveriNarudzbine(origin, 1, idNar, idPre, narucilac, key), deliveryTime)
        })
    })
}

function poklonPreparat() {
    setTimeout(() => poklonPreparat, 604800000)

    console.log('Salju se pokloni...')

    pool.query('SELECT idPre, mesto FROM preduzece left outer join zahtev on (idPre = idKor) WHERE status is null or status = 1', (err, results) => {
        if (err) {
            console.log(err)
            return
        }

        const preduzeca = results.map(r => r['idPre'])
        const mesta = results.map(r => r['mesto'])
        preduzeca.forEach((preduzece, index) => {
            pool.query('WITH brojSadnicaPoPoljoprivredniku (idPolj, idRas, mesto, brSadnica) AS (SELECT idPolj, sadnica.idRas, mesto, count(distinct idPro) AS kolicina FROM rasadnici.poljoprivrednik JOIN rasadnici.sadnica ON (poljoprivrednik.idPolj = sadnica.vlasnik) JOIN rasadnici.proizvod USING (idPro) JOIN rasadnici.rasadnik ON (sadnica.idRas = rasadnik.idRas) WHERE proizvodjac = ? GROUP BY idPolj, sadnica.idRas) SELECT idPolj, idRas, mesto FROM brojSadnicaPoPoljoprivredniku WHERE brSadnica > 10', preduzece,
                (err, results) => {
                    if (err) {
                        console.log(err)
                        return
                    }

                    if (results.length > 0) {
                        const rasadnici = results.map(r => r['idRas'])
                        const poljoprivrednici = results.map(r => r['idPolj'])
                        const mestaRasadnika = results.map(r => r['mesto'])

                        pool.query('select idPro from preparat where vlasnik = ?', preduzece, (err, results) => {
                            if (err) {
                                console.log(err)
                                return
                            }

                            const preparati = results.map(r => r['idPro'])
                            rasadnici.forEach((rasadnik, index2) => {
                                if (preparati.length > 0) {
                                    const izvucenPreparat = Math.floor(Math.random() * preparati.length)
                                    const preparat = preparati[izvucenPreparat]
                                    preparati.splice(izvucenPreparat, 1)

                                    pool.query('UPDATE preduzece SET brojSlobodnihKurira = brojSlobodnihKurira - 1 WHERE idPre = ? AND brojSlobodnihKurira > 0', preduzece,
                                        (err, results) => {
                                            if (err) {
                                                console.log(err)
                                                return
                                            }

                                            if (results.changedRows == 0) {
                                                pool.query('INSERT INTO narudzbina (idPro, narucilac, rasadnik, kolicina, status, datum) VALUES(?, ?, ?, ?, ?, ?)', [preparat, poljoprivrednici[index2], rasadnik, 1, 2, new Date()],
                                                    err => {
                                                        if (err) {
                                                            console.log(err)
                                                            return
                                                        }

                                                    })
                                            } else {
                                                pool.query('INSERT INTO narudzbina (idPro, narucilac, rasadnik, kolicina, status, datum) VALUES(?, ?, ?, ?, ?, ?)', [preparat, poljoprivrednici[index2], rasadnik, 1, 1, new Date()],
                                                    (err, results) => {
                                                        if (err) {
                                                            console.log(err)
                                                            return
                                                        }

                                                        const idNar = results.insertId

                                                        const origin = mesta[index].split(' ').filter(a => a.length > 0).join('+')
                                                        const destination = mestaRasadnika[index2].split(' ').filter(a => a.length > 0).join('+')

                                                        isporuciNarudzbinu(origin, destination, idNar, preduzece, poljoprivrednici[index2])
                                                    }
                                                )
                                            }
                                        })
                                }
                            })
                        })
                    }
                }
            )
        })
    })
}

setInterval(() => {
    pool.query('UPDATE rasadnik SET voda = voda - 1 WHERE voda > 0', err => {
        if (err) console.log(err)

        pool.query('UPDATE rasadnik SET temperatura = temperatura - 0.5 WHERE temperatura > -20', err => {
            if (err) console.log(err)

            pool.query('SELECT ime, username, email, naziv, voda, temperatura FROM rasadnik join korisnik USING (idKor) join poljoprivrednik on (korisnik.idKor = poljoprivrednik.idPolj) WHERE poslatMail = 0 AND (temperatura < 12 OR voda < 75) ORDER BY idKor', (err, results) => {
                if (err) {
                    console.log(err)
                    return
                }

                pool.query('UPDATE rasadnik SET poslatMail = 1 WHERE voda < 75 OR temperatura < 12', err => {
                    if (err) console.log(err)
                })

                let text = ''
                let br = 0
                results.forEach((rasadnik, index, rasadnici) => {
                    text += '<li>' + rasadnik.naziv + '</li>'
                    ++br

                    if (index + 1 == rasadnici.length || rasadnici[index + 1].username != rasadnik.username && br > 0) {
                        transporter.sendMail({
                            from: 'rasadnici.pia@gmail.com',
                            to: rasadnik.email,
                            subject: rasadnik.ime + ', ' + (br > 1 ? 'tvojim rasadnicima je potrebno odrzavanje!' : 'tvome rasadniku je potrebno odrzavanje!'),
                            html: `<h3>Sledecim rasadnicima je potrebno odrzavanje:</h3><ul>${text}</ul>Klikni <a href="http://localhost:4200/poljoprivrednik">ovde</a> da im odmah pristupis`
                        }, (err, info) => {
                            if (err) console.log(err)
                            else console.log('Email sent: ' + info.response)
                        })
                        text = ''
                        br = 0
                    }
                })
            })
        })
    })

}, 3600000)

setInterval(() => {
    pool.query('UPDATE sadnica SET starost = starost + 1 WHERE x IS NOT NULL AND y IS NOT NULL AND starost < trajanjeSazrevanja', err => {
        if (err) console.log(err)

        pool.query('DELETE FROM sadnica WHERE izvadjena = 1', err => {
            if (err) console.log(err)
        })
    })
}, 86400000)

today = new Date()

nextMonday = new Date()
nextMonday.setHours(12, 0, 0, 0)

while (nextMonday.getDay() != 1) {
    nextMonday.setDate(nextMonday.getDate() + 1)
}

setTimeout(() => poklonPreparat(), nextMonday.getTime() - today.getTime())

const port = 3000
app.listen(port, () => console.log('Server started at port ' + port))
