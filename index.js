const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routers/userRouters')
const taskRouter = require('./routers/taskRouters')

// const bcrypt = require('bcrypt')

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

// Agar API dapat memproses 
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => { console.log(`Running at ${port}`) })