const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        set: (val) => { return val.replace(/ /g, '') }, // val = data dari user, menghapus semua spasi
        validate(val) {
            // val = 123
            val = parseInt(val)
            // val = 123

            // akan bernilai true jika inputan dari user merupakan sebuah angka
            if (!isNaN(val)) {
                throw new Error("Username harus merupakan sebuah string")
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(val) {
            // validasi apakah inputan dari user merupakan sebuah email
            // string@string.domain
            // isEmail akan return antara true atau false, dilihat dari val tersebut apakah email atau bukan
            let result = validator.isEmail(val)

            if (!result) {
                throw new Error("Format email tidak dikenali")
            }
        }
    },
    name: {
        type: String,
        required: true, // wajib diisi
        trim: true, // menghapus spasi di awal dan akhir kalimat
        validate(val) {
            // val = 123
            val = parseInt(val)
            // val = 123

            // akan bernilai true jika inputan dari user merupakan sebuah angka
            if (!isNaN(val)) {
                throw new Error("Name harus merupakan sebuah string")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7, //Minimal 7 karakter
    },
    age: {
        type: Number,
        set: val => parseInt(val),
        default: 0, // karena tidak wajib diisi, maka harus punya nilai default, default disini di set menjadi 0
    },
})

const User = mongoose.model('User', userSchema)

module.exports = User