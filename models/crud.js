const save = async(model, params) => {
    const create = new model(params);
    try {
        return await create.save();
    } catch (err) {
        return await err;
    }

}
module.exports = { save }