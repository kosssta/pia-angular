const express = require('express')
const request = require('request')
const ruter = express.Router()

ruter.route('').post((req, res) => {
    const token = req.body.captcha
    const secretKey = '6Le--agZAAAAAKbthkifcqappdUW9UIR_3whZikk'

    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`

    if (!token) {
        res.json({ message: 'Token is empty' })
        return
    }

    request(url, (err, response, body) => {
        body = JSON.parse(body)

        if (body.success !== undefined && !body.success) {
            res.send({ message: 'ReCaptcha je pogresan' })
            return
        }
        res.send({ message: 'ok' })
    })
})

module.exports = ruter
