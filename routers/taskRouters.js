const express = require('express')
const router = express.Router()

const Task = require('../models/taskModel')
const User = require('../models/userModel')

// CREATE TASK
router.post('/tasks/:userid', async (req, res) => {

    try {
        let user = await User.findById(req.params.userid)
        let task = new Task({
            description: req.body.description,
            owner: user._id
        })

        // task = {_id, description, completed}

        // Simpan id task yang baru ke array tasks pada user
        user.tasks.push(task._id)

        // Simpan user dan task ke database
        await user.save()
        await task.save()

        res.send({
            owner: {
                name: user.name,
                id: user._id
            },
            createdTask: {
                description: task.description,
                id: task._id,
                owner: task.owner
            }
        })

    } catch (error) {


    }

})

// READ ALL OWN TASK
router.get('/tasks/:userid', async (req, res) => {
    try {
        // user = {-id, name, ... , tasks}
        let resp = await User.find({ _id: req.params.userid }).populate({ path: 'tasks' }).exec()

        res.send(resp[0].tasks)
    } catch (error) {
        res.send(error)
    }
})
// UPDATE TASK
router.patch('/tasks/:taskid', async (req, res) => {
    try {
        // Cari task berdasarkan id
        let task = await Task.findById(req.params.taskid)
        // task = {description, completed}
        // Update completed menjadi true
        task.completed = true
        // Simpan task yang sudah di update
        await task.save()
        // Kirim respon
        res.send({ updatedTask: task })

    } catch (error) {
        res.send(error)
    }

})


// DELETE TASK
router.delete('/tasks/:taskid', async (req, res) => {

    try {
        // Delete task
        let task = await Task.findByIdAndDelete(req.params.taskid)
        // task = {_id, description, completed,owner}

        // Delete deletedTask id, menghapus id task yg sudah dihapus di collection tasks
        let user = await User.findById(task.owner)
        // Mencari posisi index dari task g sudah di hapus
        let index = user.tasks.indexOf(task._id)
        // Hapus _id task berdasarkan index
        user.tasks.splice(index, 1)
        // Simpan perubahan user (Karena data pada tasks berubah / terhapus)
        await user.save()
        // Kirim respon berupa object dengan property berisi task yang berhasil di hapus
        res.send({ deletedTask: task })
    } catch (error) {
        res.send(error)
    }

})

module.exports = router