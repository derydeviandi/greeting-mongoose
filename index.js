const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const userRouter = require('./routers/userRouters')
const taskRouter = require('./routers/taskRouters')

// const bcrypt = require('bcrypt')

const app = express()
const port = process.env.PORT || 2019 // Port heroku atau localhost
const URL_HEROKU = 'mongodb+srv://derydev:pothead420@bdg-mongoose-1yoog.mongodb.net/bdg-mongoose?retryWrites=true&w=majority'
const URL_LOCAL = 'mongodb://127.0.0.1:27017/bdg-mongoose'
mongoose.connect(
    URL_LOCAL,
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
app.use(cors())
app.use(userRouter)
app.use(taskRouter)

app.get('/', (req, res) => {
    res.send(`<h1>API Running at ${port}</h1>`)
})

app.listen(port, () => { console.log(`Running at ${port}`) })