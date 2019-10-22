const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const uniqueValidator = require('mongoose-unique-validator')

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
    avatar: { // Menyimpan image dalam bentuk binary
        type: Buffer
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
}, {
    timestamps: true
})

// toJSON adalah function yg akan runnng sebelum function 'send()' pada object 'res'
userSchema.method.toJson = function () {
    // Untuk mengakses user
    let user = this.toObject()

    delete user.password
    delete user.avatar
    delete user.tasks

    return user

}

// MEMBUAT FUNCTION YG AKAN DIJALANKAN SEBELUM PROSES SAVE()
// Harus dibuat dibawah schema, dan ti atas mongoose.model

userSchema.pre('save', async function (next) {
    // Mengubah password yg diinput dari user kedalam bentuk lain
    let user = this

    // Hash password
    let hash = await bcrypt.hash(user.password, 8)

    user.password = hash

    // Untuk kemudian menjalankan save
    next()

})

// Create Login Function
userSchema.statics.login = async (email, password) => {

    // Mencari user berdasarkan email
    let user = await User.findOne({ email })

    // Jika user tidak ditemukan
    // Akan ada di catch()
    if (!user) {
        throw new Error(`User dengan email ${email} tidak ditemukan`)
    }

    // Bandingkan password input dari input user dengan yg ada di database
    // param1 inputan user, param2 yg ada di database
    // result = true or false
    let result = await bcrypt.compare(password, user.password)

    if (!result) {
        throw new Error("Password belum benar")
    }

    // Akan ada di then(). resp
    return user
}

userSchema.plugin(uniqueValidator, { message: "{PATH} '{VALUE}'sudah digunakan" })
// username : derydeviandi
// username = {PATH}, derydeviandi = {VALUE}
// {PATH} adalah field yg mengalami duplikat data
// {VALUE} adalah data yg dikirim oleh user

const User = mongoose.model('User', userSchema)

module.exports = User