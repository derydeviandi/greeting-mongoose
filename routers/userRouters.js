const express = require('express')
const router = new express.Router()

const User = require('../models/userModel')

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