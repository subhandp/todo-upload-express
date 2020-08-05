const fs = require('fs')
const { find, findOne } = require('../models/get')
const { save } = require('../models/crud')
const { Todos } = require('../models/todoSchema')
const path = require('path');
let photoPath = path.join(__dirname, './../public/images/uploads/');

class TodosController {

    static async create(req, res) {
        const result = await save(Todos, { name: req.body.todo, description: req.body.deskripsi, photo: req.file.filename })
        if (result)
            res.redirect('back')
        else {
            console.log('Kesalahan, data gagal ditambahkan')
            console.log(result)
        }

    }

    static async delete(req, res) {
        try {
            const todos = await findOne(Todos, { _id: req.params.id });
            photoPath = photoPath + todos.photo
            try {
                await Todos.deleteOne({ _id: req.params.id });
                fs.unlinkSync(photoPath)
                console.log('<Berhasil hapus data>')
            } catch (err) {
                console.error(err)
                console.log('<Gagal hapus data>')
            }
            res.redirect("/");

        } catch (err) {
            console.log('Kesalahan, data gagal di hapus')
        }
    }

    static async list(req, res) {
        const todolist = await find(Todos)
            .then((response) => {
                res.render("./partials/list", { todo: response, list: true });
            })
            .catch((err) => console.log(err));
    }

    static async doneUndone(req, res) {
        const todos = await findOne(Todos, { _id: req.params.id });
        if (todos === null) {
            console.log('Todo Not found!');
        } else {
            let status = !todos.status;
            try {
                await Todos.findByIdAndUpdate(req.params.id, { status: status }).exec();
                console.log("<Data berhasil di update>");
                res.redirect('back')
            } catch (err) {
                console.log(err)
                console.log('Kesalahan, data gagal di update');
            }
        }
    }

    static async getEdit(req, res) {
        const todolist = await findOne(Todos, { _id: req.params.id })
            .then((response) => {
                console.log(response);
                res.render("./partials/todo", { todoId: response });
            })
            .catch((err) => console.log(err));
    }

    static async setEdit(req, res) {
        let val = undefined;
        try {
            if (req.file) {
                const todos = await findOne(Todos, { _id: req.params.id });
                photoPath = photoPath + todos.photo
                fs.unlinkSync(photoPath)
                val = { name: req.body.todo, description: req.body.deskripsi, photo: req.file.filename };
            } else {
                val = { name: req.body.todo, description: req.body.deskripsi };
            }
            await Todos.findByIdAndUpdate(req.params.id, val).exec();
            console.log("<Data berhasil di update>");
            res.redirect("/todo/edit/" + req.params.id);
        } catch (err) {
            console.log(err)
            console.log('Kesalahan, data gagal di update');
            res.redirect("/todo/edit/" + req.params.id);
        }
    }

}


module.exports = TodosController;