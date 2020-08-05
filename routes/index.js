var express = require('express');
var router = express.Router();
const { find } = require('../models/get')
const { Todos } = require('../models/todoSchema')
const path = require('path');

/* GET home page. */

router.get("/", async(req, res) => {
    // console.log(path.join(__dirname, './../public/images/uploads/'));
    const todolist = await find(Todos)
        .then((response) => {
            console.log(response)
            res.render("./partials/todo", { todo: response });
        })
        .catch((err) => console.log(err));
});


module.exports = router;