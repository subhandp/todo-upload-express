var express = require('express');
var router = express.Router();
const uploadsMiddleware = require("../middlewares/uploads");

const TodosControllers = require("../controllers/todos");

router.post("/create", uploadsMiddleware.single("photo"), TodosControllers.create);

router.get("/delete/:id", TodosControllers.delete);

router.get("/list", TodosControllers.list);

router.get("/doneundone/:id", TodosControllers.doneUndone);

router.route('/edit/:id')
    .get(TodosControllers.getEdit)
    .post(uploadsMiddleware.single("photo"), TodosControllers.setEdit)

module.exports = router;