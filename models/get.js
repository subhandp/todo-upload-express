var { Todos } = require('./todoSchema')

const find = async(model, params = {}) => {
    return await model.find(params);
}

const findOne = async(model, params) => {
    return await model.findOne(params);
}
module.exports = { find, findOne }