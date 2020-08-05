var express = require('express');
var router = express.Router();
const fs = require('fs')
const { find, findOne } = require('../models/get')
const { Todos } = require('../models/todoSchema')
const uploadsMiddleware = require("../middlewares/uploads");
const path = require('path');
let photoPath = path.join(__dirname, './../public/images/uploads/');

router.post("/create", uploadsMiddleware.single("photo"), async(req, res) => {
    const todo = new Todos({ name: req.body.todo, description: req.body.deskripsi, photo: req.file.filename });
    try {
        await todo.save((err, todo) => {
            console.log("saved");
        });
        res.redirect("/");
    } catch (err) {
        console.log(err)
        console.log('Kesalahan, data gagal ditambahkan')
        res.redirect("/todo/false");
    }

});

router.get("/delete/:id", async(req, res) => {
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
});

router.get("/list", async(req, res) => {
    const todolist = await find(Todos)
        .then((response) => {
            res.render("./partials/list", { todo: response, list: true });
        })
        .catch((err) => console.log(err));
});

router.get("/doneundone/:id", async(req, res) => {
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
});

router.route('/edit/:id')
    .get(async function(req, res) {
        const todolist = await findOne(Todos, { _id: req.params.id })
            .then((response) => {
                console.log(response);
                res.render("./partials/todo", { todoId: response });
            })
            .catch((err) => console.log(err));
    })
    .post(uploadsMiddleware.single("photo"), async function(req, res) {
        let val = undefined;
        try {
            if (req.file) {
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
    })

module.exports = router;