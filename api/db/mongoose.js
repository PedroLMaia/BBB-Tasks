//Esses arquivo server para fazer a conexção com o MongoDB.

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/BBBtask', { useNewUrlParser: true}).then(() =>{
    console.log("Conectado ao MongoDB com sucesso!")
}).catch((e)=>{
    console.log("Não foi possivel conectar ao MongoDB, verifique se o servidor está a rodar.");
    console.log(e)
});

module.exports = {
  mongoose
};