const express = require('express')
const ruter = express.Router()

const pool = require('../DB')
const request = require('request')

ruter.route('/dohvati').post((req, res) => {

    pool.query('SELECT proizvod.*, idNar, narudzbina.status AS narStatus, narudzbina.kolicina AS narKolicina, narudzbina.datum, username AS narucilac, count(*) as kolicina FROM narudzbina JOIN proizvod USING (idPro) left outer join sadnica using (idPro) left outer join preparat using (idPro) JOIN rasadnik ON (rasadnik.idRas = narudzbina.rasadnik) JOIN korisnik USING (idKor) JOIN poljoprivrednik ON (korisnik.idKor = poljoprivrednik.idPolj) WHERE proizvod.proizvodjac = ? AND (sadnica.vlasnik IS NULL AND preparat.vlasnik = ? OR preparat.vlasnik IS NULL AND sadnica.vlasnik = ?) AND (status = 0 OR status = 2) group by idNar, idPro', [req.body.idPre, req.body.idPre, req.body.idPre],
        (err, results) => {
            if (err) {
                console.log(err)
                res.json({ message: 'Greska' })
                return
            }

            res.json({ message: 'ok', narudzbine: results })
        })
})

ruter.route('').get((req, res) => {
    const now = new Date()
    now.setDate(now.getDate() - 30)
    now.setHours(0, 0, 0)

    pool.query('SELECT datum FROM narudzbina WHERE datum >= ? AND status = 3', now, (err, results) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Greska' })
            return
        }

        narudzbine = new Array(30)
        narudzbine.fill(0)

        now.setDate(now.getDate() + 1)

        results = JSON.parse(JSON.stringify(results))

        for (let i = 0; i < 30; ++i) {
            results.forEach(r => {
                if (r.datum.substring(0, 10) == JSON.stringify(now).substring(1, 11))
                    narudzbine[i]++
            })
            now.setDate(now.getDate() + 1)
        }

        res.json({ message: 'ok', rezultati: narudzbine })
    })
})

ruter.route('/odbij').post((req, res) => {
    pool.query('DELETE FROM narudzbina WHERE idNar = ?', req.body.idNar, err => {
        if (err) {
            console.log(err)
            res.json({ message: 'Greska' })
            return
        }
        res.json({ message: 'ok' });
    })
})

function proveriNarudzbineNaCekanju(req, origin, key) {
    pool.query('UPDATE narudzbina SET status = 3 WHERE idNar = ?', req.body.idNar, err => {
        if (err) {
            console.log(err)
            return
        }

        let query = ''
        let tip = 'sadnica'

        pool.query('SELECT idSad FROM sadnica JOIN narudzbina USING (idPro) WHERE idNar = ?', req.body.idNar, (err, results) => {
            if (err) {
                console.log(err)
                return
            }

            if (results.length == 0) tip = 'preparat'

            if (tip == 'sadnica')
                query = `SELECT idSad, rasadnik FROM sadnica JOIN narudzbina USING (idPro) WHERE idNar = ${req.body.idNar} AND vlasnik = ${req.body.proizvodjac} LIMIT ${req.body.kolicina}`
            else
                query = `SELECT idPre, rasadnik FROM preparat JOIN narudzbina USING (idPro) WHERE idNar = ${req.body.idNar} AND vlasnik = ${req.body.proizvodjac} LIMIT ${req.body.kolicina}`

            pool.query(query, (err, results) => {
                if (err) {
                    console.log(err)
                    return
                }

                if(results.length == 0) return
                
                const rasadnik = results[0]['rasadnik']

                if (tip == 'sadnica') {
                    query = `UPDATE sadnica set vlasnik = (SELECT idKor FROM korisnik WHERE username = '${req.body.narucilac}'), idRas = ${rasadnik} WHERE idSad = `
                    query += JSON.parse(JSON.stringify(results)).map(res => res['idSad']).join(' OR idSad = ')
                }
                else {
                    query = `UPDATE preparat SET vlasnik = (SELECT idKor FROM korisnik WHERE username = '${req.body.narucilac}'), idRas = ${rasadnik} WHERE idPre = `
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

        pool.query('SELECT idNar, kolicina FROM narudzbina WHERE status = 2 ORDER BY idNar', (err, results) => {
            if (err) {
                console.log(err)
                return
            }

            if (results[0]) {
                const idNar = results[0]['idNar']
                const kolicina = results[0]['kolicina']

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
                                pool.query('UPDATE preduzece SET brojSlobodnihKurira = brojSlobodnihKurira + 1 WHERE idPre = ?', req.body.proizvodjac,
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

                                req.body.idNar = idNar
                                req.body.kolicina = kolicina
                                setTimeout(() => proveriNarudzbineNaCekanju(req, origin, key), deliveryTime)
                            })
                        })
                    })
            } else {
                pool.query('UPDATE preduzece SET brojSlobodnihKurira = brojSlobodnihKurira + 1 WHERE idPre = ?', req.body.proizvodjac,
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

function isporuciNarudzbinu(req, res, conn, origin, destination) {
    const key = ''

    origin = origin.split(' ').filter(a => a.length > 0).join('+')
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${key}`

    request(url, (err, response, body) => {
        if (err) {
            console.log(err)
            conn.rollback()
            res.json({ message: 'Greska' })
            pool.releaseConnection(conn)
            return
        }

        body = JSON.parse(body)
        if (body.status != 'OK') {
            conn.rollback();
            res.json({ message: 'Greska' })
            pool.releaseConnection(conn)
            return
        }

        conn.query('UPDATE narudzbina SET status = 1 WHERE idNar = ?', req.body.idNar, err => {
            if (err) {
                console.log(err)
                res.json({ message: 'Greska' })
                conn.rollback()
                pool.releaseConnection(conn)
                return
            }

            conn.commit(err => {
                if (err) {
                    console.log(err)
                    res.json({ message: 'Greska' })
                    conn.rollback()
                    pool.releaseConnection(conn)
                    return
                }

                pool.releaseConnection(conn)
                const deliveryTime = body.rows[0].elements[0].duration.value * 1000

                setTimeout(() => proveriNarudzbineNaCekanju(req, origin, key), deliveryTime)

                res.json({ message: 'ok', status: 'ISPORUCUJE SE', vremeDostave: body.rows[0].elements[0].duration.text, destinacija: body.destination_addresses })
            })
        })
    })
}

ruter.route('/prihvati').post((req, res) => {
    pool.getConnection((err, conn) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Greska' })
            return
        }

        conn.query('UPDATE preduzece SET brojSlobodnihKurira = brojSlobodnihKurira - 1 WHERE idPre = ? AND brojSlobodnihKurira > 0', req.body.proizvodjac,
            (err, results) => {
                if (err) {
                    console.log(err)
                    res.json({ message: 'Greska' })
                    pool.releaseConnection(conn)
                    return
                }

                if (results.changedRows == 0) {
                    conn.query('UPDATE narudzbina SET status = 2 WHERE idNar = ?', req.body.idNar, err => {
                        if (err) {
                            console.log(err)
                            res.json({ message: 'Greska' })
                            conn.rollback()
                            pool.releaseConnection(conn)
                            return
                        }

                        conn.commit(err => {
                            if (err) {
                                console.log(err)
                                res.json({ message: 'Greska' })
                                conn.rollback()
                                pool.releaseConnection(conn)
                                return
                            }

                            res.json({ message: 'ok', status: 'NA CEKANJU' })
                            pool.releaseConnection(conn)
                        })
                    })
                } else if (results.changedRows == 1) {
                    conn.query('SELECT mesto FROM rasadnik JOIN narudzbina ON (rasadnik.idRas = narudzbina.rasadnik) WHERE idNar = ?', req.body.idNar,
                        (err, results) => {
                            if (err) {
                                console.log(err)
                                res.json({ message: 'Greska' })
                                conn.rollback()
                                pool.releaseConnection(conn)
                                return
                            }

                            const origin = req.body.origin.split(' ').filter(a => a.length > 0).join('+')
                            const destination = results[0]['mesto'].split(' ').filter(a => a.length > 0).join('+')

                            isporuciNarudzbinu(req, res, conn, origin, destination)
                        }
                    )
                }
            }
        )
    })
})

module.exports = ruter
