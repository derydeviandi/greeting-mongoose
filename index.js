const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/userModel')
const bcrypt = require('bcrypt')

const app = express()
const port = 2019
const URL = 'mongodb://127.0.0.1:27017/bdg-mongoose'

mongoose.connect(
    URL,
    {
        // Menggunakan url parser yang baru
        useNewUrlParser: true,
        // Menggunakan method baru 'CreateIndex' untuk membuat index stiap kali kita input sebuah data
        useCreateIndex: true,
        // Menggunakan method baru untuk proses findOneAndUpdate()
        useFindAndModify: true,
        // Menggunakan engine mongoDB baru
        useUnifiedTopology: true

    }
)

// Agar API dapat memproses json
app.use(express.json())

// CREATE ONE USER
app.post('/users', (req, res) => {

    const user = new User(req.body)
    // user = {password: "hello123"}

    // ubah property password(hashing)

    // disimpan ke database

    user.save()
        .then((resp) => { res.send(resp) })
        .catch((err) => { res.send(err) })

})

// READ ALL USER

app.get('/users', async (req, res) => {
    try {
        const resp = await User.find({})
        res.send(resp)

    } catch (error) {
        res.send(err)
    }
})

// READ ONE USER BY ID
app.get('/users/:userid', async (req, res) => {

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
app.delete('/users/:userid', async (req, res) => {

    try {
        let resp = await User.deleteOne({ _id: req.params.userid })
        res.send(resp)

    } catch (error) {
        res.send(err)
    }
})

// UPDATE BY ID

app.listen(port, () => { console.log(`Running at ${port}`) })