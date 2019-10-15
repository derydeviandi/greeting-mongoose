const bcrypt = require('bcrypt')

let password = 'Hello123'

let hash = '$2b$08$fYsJaj1UXgI6K1GDseABnO.ozeIkQ6zNaGYZSwFUIDOomRF5q97xK'

// // HASHING
// bcrypt.hash(password, 8)
//     .then(res => {
//         console.log({
//             password, res
//         })
//     }

// COMPARE
bcrypt.compare(password, hash)
    .then(res => {
        console.log(res)
    })