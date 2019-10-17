const express = require('express')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')

const User = require('../models/userModel')

// MULTER CONF
const upload = multer({
    limits: {
        fileSize: 1000000 // max 1 MegaBytes
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            callback(new Error('Format file harus jpg / png / jpeg'))
        }
        callback(null, true)
    }
})

// UPLOAD AVATAR
router.post('/users/avatar/:userid', upload.single('avatar'), async (req, res) => {
    // file gambar nanti akan ada di 'req.file.buffer'

    try {
        // resize lebar gambar : 250px, extention file .png
        let buffer = await sharp(req.file.buffer).resize({ width: 250 }).png().toBuffer()
        let user = await User.findById(req.params.userid)
        // user {obj, name , ... , avatar}
        user.avatar = buffer

        await user.save()
        res.send("Upload Success")
    } catch (error) {
        res.send(error)
    }

})

// READ AVATAR
router.get('/users/avatar/:userid', async (req, res) => {

    try {
        let user = await User.findById(req.params.userid)

        // Secara default content-type adalah json, kita ubah menjadi iamge karena akan mengirim sebuah gambar
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.send(error)
    }


})

// USER ROUTER

// CREATE ONE USER
router.post('/users', (req, res) => {

    const user = new User(req.body)
    // user = {password: "hello123"}

    // ubah property password(hashing)

    // disimpan ke database

    user.save()
        .then((resp) => { res.send(resp) })
        .catch((err) => { res.send(err) })

})

// READ ALL USER

router.get('/users', async (req, res) => {
    try {
        const resp = await User.find({})
        res.send(resp)

    } catch (error) {
        res.send(err)
    }
})

// READ ONE USER BY ID
router.get('/users/:userid', async (req, res) => {

    try {
        const resp = await User.findById(req.params.userid)

        res.send(resp)
    } catch (err) {
        res.send(err)
    }

    // User.findById(req.params.userid)
    //     .then((user) => { res.send(user) })
    //     .catch((error) => { res.send(error) })
})

// UPDATE PROFIE
router.patch('/users/:userid', async (req, res) => {
    // filtering
    let updates = Object.keys(req.body) // didalam req.body ada {name, email, ..}

    // req.body = {name, email, age}
    let allowedUpdates = ['name', 'email', 'password', 'age']

    let result = updates.every(updates => { return allowedUpdates.includes(updates) })

    // Jika ada field yg akan diedit selain [ 'name', 'email', 'password', 'age']
    if (!result) {
        return res.send({ err: 'Invalid Request' })
    }

    try {
        let user = await User.findById(req.params.userid)
        // update user
        user.name = req.body.name
        user.email = req.body.email
        user.password = req.body.password
        user.age = req.body.age

        // updates = ['name, email. password, 'age']
        // user = {name, email, password, age}
        updates.forEach((val) => { user[val] = req.body[val] })

        /* 
            val = 'name'

            user['name'] = req.body['name']
        
        
        */
        await user.save()

        res.send(user)

    } catch (error) {
        res.send(error)
    }

})

// DELETE ONE BY ID
router.delete('/users/:userid', async (req, res) => {

    try {
        let resp = await User.deleteOne({ _id: req.params.userid })
        res.send(resp)

    } catch (error) {
        res.send(error)
    }
})

// LOGIN USER WITH EMAIL DAN PASSWORD
router.post('/users/login', (req, res) => {

    try {
        let user = User.login(req.body.email, req.body.password)
        res.send(user)
    } catch (error) {
        res.send(error.message)
    }

    // User.login(req.body.email, req.body.password)
    //     .then(resp => {
    //         res.send({
    //             condition: Success,
    //             pesan: resp
    //         })
    //     }).catch(err => {
    //         res.send({
    //             condition: "Can't Login",
    //             pesan: error.message
    //         })
    //     })

})

// UPDATE BY ID
router.delete('/users/:userid', async (req, res) => {
    try {
        let resp = await User.deleteOne({ _id: req.params.userid })
        res.send(resp)
    } catch (error) {
        res.send(error)
    }
})

module.exports = router