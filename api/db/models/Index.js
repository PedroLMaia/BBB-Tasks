//Arquivo somente para fazer os exports.

const{ Categoria } = require('./categoria.model')
const{ Task } = require('./task.model')
const{ User } = require('./user.model')

module.exports = {
    Categoria,
    Task,
    User
}
