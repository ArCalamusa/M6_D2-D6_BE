import express from 'express'
import UsersModel from '../models/users.js'
const router = express.Router()
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

//POST
router.post('/login', async (req, res) => {

    const user = await UsersModel.findOne({
        email: req.body.email
    })
    if (!user) {
        return res.status(404).send({
            message: 'Email non trovata',
            stausCode: 404
        })
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
        return res.status(400).send({
            message: 'Password non valida', //messaggio solo per debug sviluppo
            statusCode: 400
        })
    }
    const token = jwt.sign({email: user.email}, process.env.SECRET_JWT_KEY, {
        expiresIn: '24h'
    })
    res.header('auth', token).status(200).send({
        message: 'login effettuato con successo',
        statusCode: 200,
        token
    })
    //metodo preToken
    // return res.status(200).send({  
    //     message: 'Login effettuato con successo',
    //     stausCode: 200,
    //     payload: user,
    // })
})

export default router