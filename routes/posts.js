import express from "express"
import PostModel from "../models/post.js"
import { body, validationResult } from 'express-validator'
import multer from 'multer'

const post = express.Router()

//D4 Caricamento File
//oggetto standard che permette di salvare sulla cartella upload (va creata prima)
const internalStorange = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileExt = file.originalname.split('.').pop()
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`)
        //nome del file - stringa univoca - estensione file
    }
})

const internalUpload = multer({ storage: internalStorange })

//creazione endpoint (moongose non salva i file)
post.post('/posts/uploadImg', internalUpload.single('img'), async (req, res) => {
    //protocol = http o https + :// + indirizzo del server in questo caso localhost: 5050
    const url = req.protocol + '://' + req.get('host')

    try {
        const imgUrl = req.file.filename
        res.status(200).json({
            img: `${url}/uploads/${imgUrl}`
        })
    } catch (error) {
        console.error('Upload fallito: ', error)
        res.status(500).send({
            message: 'File upload error',
            statusCode: 500
        })
    }
})

//GET
post.get('/posts', async (req, res) => {
    const { page = 1, pageSize = 6 } = req.query
    try {
        const posts = await PostModel.find()
            .limit(pageSize)
            .skip((page - 1) * pageSize)

        const totalPosts = await PostModel.count()
        res.status(200).send({
            message: 'Operazione eseguita correttamente',
            statusCode: 200,
            count: totalPosts,
            totalPages: Math.ceil(totalPosts / pageSize),
            currentPage: +page,
            posts //array dei posts risultato query
        })
    } catch (error) {
        res.status(500).send({
            message: 'Errore interno del server',
            stausCode: 500
        })
    }
})

//GET
post.get('/posts/bytitle/:title', async (req, res) => {
    try {
        const { title } = req.params
        const postByTitle = await PostModel.find({
            title: {
                $regex: '.*' + title + '.*', //controlla all'interno del titolo la query
                $options: 'i' //insensitive non fa distinzione tra maiusc e minusc 
            }
        })
        if (!postByTitle || postByTitle.length === 0) {
            return res.status(404).send({
                message: "Non esiste un post con questo titolo",
                stausCode: 404
            })
        }
        res.status(200).send({
            message: "Post trovato",
            statusCode: 200,
            postByTitle
        })
    } catch (error) {
        res.status(500).send({
            message: "Errore interno del server",
            statusCode: 500
        })
    }
})

//POST
post.post('/posts', async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array(),
            statusCode: 400
        })
    }
    const posts = new PostModel({
        title: req.body.title,
        content: req.body.content,
        img: req.body.img,
        author: req.body.author,
        rate: req.body.rate
    })
    try {
        const postExist = await PostModel.findOne({ title: req.body.title })
        if (postExist) {
            return res.status(409).send({
                message: 'Esiste già un post con questo titolo',
                statusCode: 409
            })
        }
        const newPost = await posts.save()
        res.status(201).send({
            message: 'Post salvato con successo',
            statusCode: 201,
            newPost
        })
    } catch (error) {
        res.status(500).send({
            message: "Errore interno del server",
            stausCode: 500
        })
    }
})

//PATCH
post.patch('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const postExist = await PostModel.findById(id)
    if (!postExist) {
        return res.status(404).send({
            message: "Post inesistente",
            statusCode: 404
        })
    }
    try {
        const postID = id;
        const dataUpdated = req.body;
        const options = { new: true }
        const result = await PostModel.findByIdAndUpdate(postID, dataUpdated, options)
        res.status(200).send({
            message: "Post modificato",
            statusCode: 200,
            result
        })
    } catch (error) {
        res.status(500).send({
            message: "Errore interno del server"
        })
    }
})

//DELETE
post.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const postExist = await PostModel.findByIdAndDelete(id)
        if (!postExist) {
            return res.status(404).send({
                message: "Post non trovato",
                statusCode: 404
            })
        }
        res.status(200).send({
            message: `Post con id ${id} rimosso dal DB`,
            statusCode: 200
        })
    } catch (error) {
        res.status(500).send({
            message: "Errore interno del server",
            stausCode: 500
        })
    }
})

export default post