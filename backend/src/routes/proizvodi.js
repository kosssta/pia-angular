const express = require('express')
const ruter = express.Router()

const pool = require('../DB')

ruter.route('').get((req, res) => {
    pool.query('SELECT proizvod.idPro, naziv, username AS proizvodjac, cena, count(*) as kolicina, avg(ocena) as ocena FROM proizvod left outer join sadnica using (idPro) left outer join preparat using (idPro) left outer join komentar using (idPro) join korisnik ON (korisnik.idKor = proizvod.proizvodjac) group by idPro',
        (err, results) => {
            if (err) {
                console.log(err)
                res.json({ message: 'Greska' })
                return
            }
            res.json({ message: 'ok', proizvodi: results })
        })
})

ruter.route('').post((req, res) => {
    pool.query('SELECT proizvod.idPro, naziv, username AS proizvodjac, cena, count(*) as kolicina, avg(ocena) as ocena FROM proizvod left outer join sadnica using (idPro) left outer join preparat using (idPro) left outer join komentar using (idPro) join korisnik on (proizvod.proizvodjac = korisnik.idKor) where idPro = ? and (preparat.vlasnik is null and sadnica.vlasnik = proizvodjac or sadnica.vlasnik is null and preparat.vlasnik = proizvodjac) group by idPro', req.body.idPro,
        (err, results) => {
            if (err) {
                console.log(err)
                res.json({ message: 'Greska' })
                return
            }
            res.json({ message: 'ok', proizvod: results[0] })
        })
})

ruter.route('/sadnice').get((req, res) => {
    pool.query('with bzv (idPro, naziv, proizvodjac, cena, ogranicenja, ocena, kolicina) as (select idPro, naziv, proizvodjac, cena, ogranicenja, avg(ocena), count(distinct idSad) from rasadnici.proizvod join rasadnici.sadnica using(idPro) left outer join rasadnici.komentar using (idPro) join rasadnici.korisnik on (proizvod.proizvodjac = korisnik.idKor) join preduzece on (preduzece.idPre = korisnik.idKor) where preduzece.idPre = vlasnik group by idPro) select * from rasadnici.sadnica join bzv using(idPro) join korisnik on (bzv.proizvodjac = korisnik.idKor) where vlasnik in (select idPre from preduzece) group by(idPro)',
        (err, results) => {
            if (err) {
                console.log(err)
                res.json({ message: 'Greska' })
                return
            }
            res.json({ message: 'ok', sadnice: results })
        })
})

ruter.route('/sadnice').post((req, res) => {
    let query = 'with bzv (idPro, naziv, proizvodjac, cena, ogranicenja, ocena, kolicina) as (select proizvod.idPro, naziv, proizvodjac, cena, ogranicenja, avg(ocena), count(distinct idSad) from rasadnici.proizvod join rasadnici.sadnica using(idPro) left outer join rasadnici.komentar using (idPro) join rasadnici.korisnik on (proizvod.proizvodjac = korisnik.idKor) left outer join narudzbina on (proizvod.idPro = narudzbina.idPro) where vlasnik = ? AND (narudzbina.status is null or (narudzbina.status != 1 AND narudzbina.status != 2)) group by proizvod.idPro) select * from rasadnici.sadnica join bzv using(idPro) join korisnik on (bzv.proizvodjac = korisnik.idKor) where vlasnik = ? '
    if (req.body.idRas != null) query += 'AND idRas = ? group by idPro, x, y'
    else query += 'group by idPro'

    pool.query(query, [req.body.idKor, req.body.idKor, req.body.idRas], (err, results) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Greska' })
            return
        }

        res.json({ message: 'ok', sadnice: results })
    })
})

ruter.route('/preparati').get((req, res) => {
    pool.query('with bzv (idPro, naziv, proizvodjac, cena, ocena, kolicina) as (select proizvod.idPro, naziv, proizvodjac, cena, avg(ocena), count(distinct preparat.idPre) from rasadnici.proizvod join rasadnici.preparat using(idPro) left outer join rasadnici.komentar using (idPro) join rasadnici.korisnik on (proizvod.proizvodjac = korisnik.idKor) join preduzece on (preduzece.idPre = korisnik.idKor) where preduzece.idPre = vlasnik group by idPro) select * from rasadnici.preparat join bzv using(idPro) join korisnik on(bzv.proizvodjac = korisnik.idKor) group by idPro',
        (err, results) => {
            if (err) {
                console.log(err)
                res.json({ message: 'Greska' })
                return
            }
            res.json({ message: 'ok', preparati: results })
        })
})

ruter.route('/preparati').post((req, res) => {
    let query = 'with bzv (idPro, naziv, proizvodjac, cena, ocena, kolicina) as (select proizvod.idPro, naziv, proizvodjac, cena, avg(ocena), count(distinct idPre) from rasadnici.proizvod join rasadnici.preparat using(idPro) left outer join rasadnici.komentar using (idPro) join rasadnici.korisnik on (proizvod.proizvodjac = korisnik.idKor) left outer join narudzbina on (proizvod.idPro = narudzbina.idPro) where vlasnik = ? AND (narudzbina.status is null or (narudzbina.status != 1 AND narudzbina.status != 2)) group by proizvod.idPro) select * from rasadnici.preparat join bzv using(idPro) join korisnik on (bzv.proizvodjac = korisnik.idKor) where vlasnik = ? '
    if (req.body.idRas != null) query += 'AND preparat.idRas = ? '
    query += 'group by idPro'

    pool.query(query, [req.body.idKor, req.body.idKor, req.body.idRas],
        (err, results) => {
            if (err) {
                console.log(err)
                res.json({ message: 'Greska' })
                return
            }

            res.json({ message: 'ok', preparati: results })
        })
})

ruter.route('/naruci').post((req, res) => {
    now = new Date(Date.now())

    pool.query('INSERT INTO narudzbina (idPro, narucilac, rasadnik, kolicina, datum) VALUES (?, ?, ?, ?, ?)', [req.body.idPro, req.body.idKor, req.body.idRas, req.body.kolicina, now],
        err => {
            if (err) {
                console.log(err);
                res.json({ message: 'Greska' })
                return
            }
            res.json({ message: 'ok' })
        })
})

ruter.route('/narudzbine').post((req, res) => {
    pool.query('SELECT idNar, narucilac, rasadnik, narudzbina.kolicina AS narKolicina, narudzbina.status AS status, datum, proizvod.idPro, naziv, username AS proizvodjac, cena, count(*) as kolicina, avg(ocena) as ocena FROM rasadnici.narudzbina join proizvod using(idPro) left outer join sadnica using (idPro) left outer join preparat using (idPro) left outer join komentar using (idPro) join korisnik ON (korisnik.idKor = proizvodjac) where narucilac = ? and status != 3 AND rasadnik = ? group by idNar, narudzbina.idPro', [req.body.idKor, req.body.idRas], (err, results) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Greska' })
            return
        }
        res.json({ message: 'ok', narudzbine: results })
    })
})

ruter.route('/povuci').post((req, res) => {
    pool.query('DELETE FROM proizvod WHERE idPro = ?', req.body.idPro, err => {
        if (err) {
            console.log(err)
            res.json({ message: 'Greska' })
            return
        }
        res.json({ message: 'ok' })
    })
})

ruter.route('/zasadi').post((req, res) => {
    pool.query('SELECT * FROM sadnica WHERE idRas = ? AND x is not null AND y is not null and izvadjena = 0', [req.body.idRas], (err, results) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Greska' })
            return
        }

        let mozeZasadi = true
        const x = req.body.x + 1
        const y = req.body.y + 1

        results.forEach(r => {
            if (Math.abs(r['x'] - x) <= 1 && Math.abs(r['y'] - y) <= 1) {

                const ogranicenja = r['ogranicenja'].split(',').filter(o => o.length > 0)
                ogranicenja.forEach(o => {
                    if (req.body.idPro == o) {
                        mozeZasadi = false
                    }
                })
            }
        })

        if (!mozeZasadi) {
            res.json({ message: 'Na ovo mesto se ne moze zasadati ta sadnica' })
            return
        }

        pool.query('SELECT MIN(idSad) AS idSad FROM sadnica WHERE idPro = ? AND vlasnik = ? AND idRas = ? AND x is null and y is null', [req.body.idPro, req.body.vlasnik, req.body.idRas], (err, results) => {
            if (err) {
                console.log(err)
                res.json({ message: 'Greska' })
                return
            }

            if (results.length == 0) {
                res.json({ message: 'Greska' })
                return
            }

            pool.query('UPDATE sadnica SET x = ?, y = ? WHERE idSad = ?', [req.body.x + 1, req.body.y + 1, results[0]['idSad']],
                err => {
                    if (err) {
                        console.log(err)
                        res.json({ message: 'Greska' })
                        return
                    }

                    pool.query('UPDATE rasadnik SET brojZasadjenihSadnica = brojZasadjenihSadnica + 1 WHERE idRas = ?', req.body.idRas,
                        err => {
                            if (err) {
                                console.log(err)
                                res.json({ message: 'Greska' })
                                return
                            }

                            res.json({ message: 'ok' })
                        }
                    )
                }
            )
        })
    })
})

ruter.route('/dodaj_preparat').post((req, res) => {
    pool.getConnection((err, conn) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Greska' })
            return
        }

        conn.beginTransaction(err => {
            if (err) {
                res.json({ message: 'Greska' })
                pool.releaseConnection(conn)
                return
            }

            conn.query('SELECT MIN(idPre) AS idPre FROM preparat WHERE idPro = ? AND vlasnik = ? AND idRas = ?', [req.body.preparat.idPro, req.body.vlasnik, req.body.idRas],
                (err, results) => {
                    if (err) {
                        console.log(err)
                        res.json({ message: 'Greska' })
                        conn.rollback()
                        pool.releaseConnection(conn)
                        return
                    }

                    if (results.length == 0) {
                        res.json({ message: 'Greska' })
                        conn.rollback()
                        pool.releaseConnection(conn)
                        return
                    }

                    conn.query('DELETE FROM preparat WHERE idPre = ?', results[0]['idPre'], err => {
                        if (err) {
                            console.log(err)
                            res.json({ message: 'Greska' })
                            conn.rollback()
                            pool.releaseConnection(conn)
                            return
                        }

                        conn.query('SELECT * FROM sadnica WHERE idSad = ?', req.body.idSad, (err, results) => {
                            if (err) {
                                console.log(err)
                                res.json({ message: 'Greska' })
                                conn.rollback()
                                pool.releaseConnection(conn)
                                return
                            }

                            if (results.length == 0) {
                                res.json({ message: 'Greska' })
                                conn.rollback()
                                pool.releaseConnection(conn)
                                return
                            }

                            let query = ''
                            let values = []
                            if (results[0]['starost'] + req.body.preparat.ubrzanje <= results[0]['trajanjeSazrevanja']) {
                                query = 'UPDATE sadnica SET starost = starost + ? WHERE idSad = ?'
                                values = [req.body.preparat.ubrzanje, req.body.idSad]
                            }
                            else {
                                query = 'UPDATE sadnica SET starost = trajanjeSazrevanja WHERE idSad = ?'
                                values = [req.body.idSad]
                            }

                            conn.query(query, values, err => {
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

                                    res.json({ message: 'ok' })
                                    pool.releaseConnection(conn)
                                })
                            })
                        })
                    })
                }
            )
        })
    })
})

ruter.route('/izvadi').post((req, res) => {
    pool.query('UPDATE sadnica SET izvadjena = 1 WHERE idSad = ?', req.body.idSad, err => {
        if (err) {
            console.log(err)
            res.json({ message: 'Greska' })
            return
        }

        pool.query('UPDATE rasadnik SET brojZasadjenihSadnica = brojZasadjenihSadnica - 1 WHERE idRas = ?', req.body.idRas,
            err => {
                if (err) {
                    console.log(err)
                    res.json({ message: 'Greska' })
                    return
                }

                res.json({ message: 'ok' })
            })
    })
})

ruter.route('/proveri').post((req, res) => {
    pool.query('SELECT izvadjena FROM sadnica WHERE idRas = ? AND x = ? AND y = ?', [req.body.x, req.body.y, req.body.idRas], (err, results) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Greska' })
            return
        }

        if (results.length == 0 || results[0]['izvadjena']) res.json({ message: 'ok', izvadjena: false })
        else res.json({ message: 'ok', izvadjena: true })
    })
})

function dodajProizvod(req, res, ogranicenja) {
    const proizvod = req.body.proizvod

    pool.query('SELECT idPro FROM proizvod WHERE proizvodjac = ? AND naziv = ?', [proizvod.proizvodjac, proizvod.naziv], (err, results) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Greska' })
            return
        }

        if (results.length > 0) {
            let query = ''
            let values = []

            if (req.body.tip == 'sadnica') {
                query = 'CALL dodajSadnice(?, ?, ?, ?, ?)'
                values = [results[0]['idPro'], proizvod.proizvodjac, req.body.trajanjeSazrevanja, proizvod.kolicina, ogranicenja.length > 0 ? ogranicenja.join(',') : null]
            } else {
                query = 'CALL dodajPreparate(?, ?, ?, ?)'
                values = [results[0]['idKor'], proizvod.proizvodjac, req.body.ubrzanje, proizvod.kolicina]
            }

            pool.query(query, values, err => {
                if (err) {
                    console.log(err)
                    res.json({ mesage: 'Greska' })
                    return
                }

                res.json({ message: 'ok' })
            })
        } else {
            pool.getConnection((err, conn) => {
                if (err) {
                    console.log(err)
                    res.json({ message: 'Greska' })
                    return
                }

                conn.beginTransaction(err => {
                    if (err) {
                        console.log(err)
                        res.json({ message: 'Greska' })
                        pool.releaseConnection(conn)
                        return
                    }

                    conn.query('INSERT INTO proizvod (naziv, proizvodjac, cena) VALUES (?, ?, ?)', [proizvod.naziv, proizvod.proizvodjac, proizvod.cena],
                        (err, results) => {
                            if (err) {
                                console.log(err)
                                res.json({ message: 'Greska' })
                                conn.rollback()
                                pool.releaseConnection(conn)
                                return
                            }

                            let query = ''
                            let values = []

                            if (req.body.tip == 'sadnica') {
                                query = 'CALL dodajSadnice(?, ?, ?, ?, ?)'
                                values = [results.insertId, proizvod.proizvodjac, req.body.trajanjeSazrevanja, proizvod.kolicina, ogranicenja.length > 0 ? ogranicenja.join(',') : null]
                            } else {
                                query = 'CALL dodajPreparate(?, ?, ?, ?)'
                                values = [results.insertId, proizvod.proizvodjac, req.body.ubrzanje, proizvod.kolicina]
                            }

                            conn.query(query, values, err => {
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

                                    res.json({ message: 'ok' })
                                    pool.releaseConnection(conn)
                                })
                            })
                        })
                })
            })
        }
    })
}

ruter.route('/dodaj').post((req, res) => {
    let ogranicenjaQuery = ''

    let ogranicenja = []

    if (req.body.ogranicenja && req.body.ogranicenja.length > 0) {
        const nazivi = req.body.ogranicenja.map(o => {
            const index = o.indexOf('(')
            return '\'' + o.substring(0, index - 1) + '\''
        })
        const proizvodjaci = req.body.ogranicenja.map(o => {
            const index = o.indexOf('(')
            return '\'' + o.substring(index + 1, o.length - 1) + '\''
        })

        nazivi.forEach((n, index) => {
            ogranicenjaQuery += '(naziv = ' + n + ' AND username = ' + proizvodjaci[index] + ')'
            if (index != proizvodjaci.length - 1) ogranicenjaQuery += ' OR '
        })

        pool.query('SELECT idPro FROM proizvod JOIN korisnik ON (proizvod.proizvodjac = korisnik.idKor) WHERE ' + ogranicenjaQuery, (err, results) => {
            if (err) {
                console.log(err)
                res.json({ message: 'Greska' })
                return
            }

            ogranicenja = results.map(r => r['idPro'])

            dodajProizvod(req, res, ogranicenja)
        })
    } else
        dodajProizvod(req, res, [])
})

ruter.route('/azurirajOgranicenja').post((req, res) => {
    let ogranicenjaQuery = ''

    let ogranicenja = []

    if (req.body.ogranicenja && req.body.ogranicenja.length > 0) {
        const nazivi = req.body.ogranicenja.map(o => {
            const index = o.indexOf('(')
            return '\'' + o.substring(0, index - 1) + '\''
        })
        const proizvodjaci = req.body.ogranicenja.map(o => {
            const index = o.indexOf('(')
            return '\'' + o.substring(index + 1, o.length - 1) + '\''
        })

        nazivi.forEach((n, index) => {
            ogranicenjaQuery += '(naziv = ' + n + ' AND username = ' + proizvodjaci[index] + ')'
            if (index != proizvodjaci.length - 1) ogranicenjaQuery += ' OR '
        })

        pool.query('SELECT idPro FROM proizvod JOIN korisnik ON (proizvod.proizvodjac = korisnik.idKor) WHERE ' + ogranicenjaQuery, (err, results) => {
            if (err) {
                console.log(err)
                res.json({ message: 'Greska' })
                return
            }

            ogranicenja = results.map(r => r['idPro'])

            pool.query('SELECT idPro, ogranicenja FROM proizvod JOIN sadnica USING (idPro) WHERE naziv = ? AND proizvodjac = ?', [req.body.proizvod.naziv, req.body.proizvod.proizvodjac],
                (err, results) => {
                    if (err) {
                        console.log(err)
                        res.json({ message: 'Greska' })
                        return
                    }

                    ogranicenjaQuery = 'idPro = ' + ogranicenja.join(' OR idPro = ')
                    pool.query('UPDATE sadnica SET ogranicenja = concat(concat(ogranicenja, \',\'), \'?\') WHERE ' + ogranicenjaQuery, results[0]['idPro'], err => {
                        if (err) {
                            console.log(err)
                            res.json({ message: 'Greska' })
                            return
                        }

                        res.json({ message: 'ok' })
                    })
                }
            )
        })
    }
})


ruter.route('/dohvatiNeposadjene').post((req, res) => {
    pool.query('with bzv (idPro, naziv, proizvodjac, cena, ocena, kolicina) as (select proizvod.idPro, naziv, proizvodjac, cena, avg(ocena), count(distinct idSad) from rasadnici.proizvod join rasadnici.sadnica using(idPro) left outer join rasadnici.komentar using (idPro) join rasadnici.korisnik on (proizvod.proizvodjac = korisnik.idKor) left outer join rasadnici.narudzbina on (proizvod.idPro = narudzbina.idPro) where vlasnik = ? and x is null and y is null and (narudzbina.status is null or (narudzbina.status != 1 and narudzbina.status != 2))  group by proizvod.idPro) select * from rasadnici.sadnica join bzv using(idPro) join rasadnici.korisnik on (bzv.proizvodjac = korisnik.idKor) where vlasnik = ? AND idRas = ? and x is null and y is null group by idPro, x, y', [req.body.idKor, req.body.idKor, req.body.idRas],
        (err, results) => {
            if (err) {
                console.log(err)
                res.json({ message: 'Greska' })
                return
            }

            res.json({ message: 'ok', sadnice: results })
        })
})

module.exports = ruter
