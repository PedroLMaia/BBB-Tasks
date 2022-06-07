const express = require('express');
const app = express();
const nodemailer = require('nodemailer')

const { mongoose } = require('./db/mongoose');

const bodyParser = require('body-parser')

//======================================= Carregar os modelos do Mongo ========================================//

const { Categoria, Task, User } = require('./db/models/Index');

const jwt = require('jsonwebtoken');

const res = require('express/lib/response');
const { JsonWebTokenError } = require('jsonwebtoken');
// const { User } = require('./db/models/user.model');

var EmailDeEnvio = "lilpeepdowntown@gmail.com";

//================================================= Mediador ==================================================//


//Checar se a requisição tem um token JWT valido.
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');

    // verifica o JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            res.status(401).send(err);
        } else {
            req.user_id = decoded._id;
            next();
        }
    });
}

//Mediador para verificar o refreshToken, que ira verificar a sessão
let verifySession = (req, res, next) => {
    let refreshToken = req.header('x-refresh-token');

    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            return Promise.reject({
                'error': 'Usuario não encontrado.'
            });
        }



        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {

                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {

            next();
        } else {
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}


//Body Parser.
app.use(bodyParser.json());


//Cors mediador.
app.use(function (req, res, next) {
    //Habilitando o CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,HEAD,OPTIONS,PUT,PATCH,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin,x-access-token, _id, x-refresh-token, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    res.header('Access-Control-Expose-Headers', 'x-access-token, x-refresh-token,');


    next();
});



//=========================================== MANIPULADORES DE ROTA ===========================================//
//=============================================== LISTA DE ROTAS ==============================================//



//================================================= CATEGORIAS ================================================//

//GET /categorias
//Proposito: Pegar todas as categorias.
app.get('/categorias', authenticate, (req, res) => {
    //Queremos retornar um array de categorias do banco de dados que pertence ao usuario autenticado.
    Categoria.find({
        _userId: req.user_id
    }).then((categorias) => {
        res.send(categorias);
    }).catch((e) => {
        res.send(e);
    })
});

//POST /categorias
//Proposito: Criar uma categoria.
app.post('/categorias', authenticate, (req, res) => {
    //Queremos criar uma nova categoria e retornar o documento de nova categoria para o usuario(Que inclue o id).
    //As categorias de informacoes(campos) serão passadas por JSON request body.
    let title = req.body.title;

    let newCategoria = new Categoria({
        title,
        _userId: req.user_id
    });
    newCategoria.save().then((categoriaDoc) => {
        //A categoria de documento cheia é retornada(incluindo o id)
        res.send(categoriaDoc);
    });
});

//PATCH /categorias/:id 
//Proposito: Atualizar a categoria especificada por id.
app.patch('/categorias/:id', authenticate, (req, res) => {
    //Queremos atualizar a categoria especificada com os novos valores expecificados no JSON body de requisição.
    Categoria.findOneAndUpdate({ _id: req.params.id, _userId: req.user_id }, {
        $set: req.body
    }).then(() => {
        res.send({'message': 'Atualizado com sucesso!!'});
    });
});

//DELETE /categorias/:id
//Proposito: Deletar uma categoria pelo id.
app.delete('/categorias/:id', authenticate, (req, res) => {
    //Queremos deletar uma categoria especifica pelo seu id.
    Categoria.findByIdAndRemove({
        _id: req.params.id,
        _userId: req.user_id
    }).then((removeCategoriaDoc) => {
        res.send(removeCategoriaDoc);

        deleteTaskFromCategoria(removeCategoriaDoc._id);
    });
});

//=================================================== TASKS ===================================================//

//GET /categorias/:listasId/tasks
//Proposito: Pegar todas as tasks de uma categoria.
app.get('/categorias/:categoriaId/tasks', authenticate, (req, res) => {
    //Queremos retornar todas as tasks que pertecem a uma categoria expecifica.
    Task.find({
        _categoriaId: req.params.categoriaId
    }).then((tasks) => {
        res.send(tasks);
    });
});

//POST /categorias/:categoriaId/tasks
//Proposito: Criar uma nova tasks na categoria especificada.
app.post('/categorias/:categoriaId/tasks', authenticate, (req, res) => {
    //Queremos criar uma nova tasks na categoria especificada pelo categoriaId.

    Categoria.findOne({
        _id: req.params.categoriaId,
        _userId: req.user_id
    }).then((categoria) => {
        if (categoria) {
            //Objeto user é valido
            //o user atualmente autenticado pode criar novas tasks
            return true;
        }
        //else - O objeto user é undefined
        return false;
    }).then((canCreateTask) => {
        if (canCreateTask) {
            let newTask = new Task({
                title: req.body.title,
                data: req.body.data,
                _categoriaId: req.params.categoriaId,
            });
            //envio de email
            let transporter = nodemailer.createTransport({ 
                service: 'gmail', 
                auth: { 
                   user: 'lilpeepdowntown@gmail.com', 
                   pass: 'aott snos uaoc iwln' 
                 } 
                });
            
                var message = {
                from: "lilpeepdowntown@gmail.com",
                to: EmailDeEnvio,
                subject: "BBB Tasks [" + req.body.title + "]",
                text: req.body.title,
                html: "<p>A atividade [" + req.body.title +"] na data [" + req.body.data + "] foi adicionada a sua agenda com sucesso!! Fique atento as datas!"
              };
              console.log('Email enviado com sucesso!!! Destinatario: ' + EmailDeEnvio + ', mensagem: ' + "A atividade [" + req.body.title +"] na data [" + req.body.data + "] foi adicionada a sua agenda com sucesso!! Fique atento as datas!" + '.')
              transporter.sendMail(message)

            //fim do envio de email 
            newTask.save().then((newTaskDoc) => {
                res.send(newTaskDoc);
            })
        } else {
            res.sendStatus(404);
        }
    })
});

//PATCH /categorias/:categoriaId/taskId
//Proposito: Atualizar uma task pelo seu ID.
app.patch('/categorias/:categoriaId/tasks/:taskId', authenticate, (req, res) => {
    //Queremos atualizar uma task existente por meio do taskId.

    Categoria.findOne({
        _id: req.params.categoriaId,
        _userId: req.user_id
    }).then((categoria) => {
        if (categoria) {
            //Objeto user é valido
            //o user atualmente autenticado pode atualizar a task especificada
            return true;
        }
        //else - O objeto user é undefined
        return false;
    }).then((canUpdateTasks) => {
        if (canUpdateTasks) {
            // O atual autenticado user pode fazer update nas tasks
            Task.findOneAndUpdate({
                _id: req.params.taskId,
                _categoriaId: req.params.categoriaId
            }, {
                $set: req.body
            }).then(() => {
                res.send({ message: 'Atualizado com sucesso!' })
            });
        } else {
            res.sendStatus(404);
        }
    })
});

//DELETE /categorias/:categoriaId/tasks/:taskId
//Proposito: Deletar uma task pelo seu id.
app.delete('/categorias/:categoriaId/tasks/:taskId', authenticate, (req, res) => {
    //Queremos deletar uma task especifica pelo seu id.

    Categoria.findOne({
        _id: req.params.categoriaId,
        _userId: req.user_id
    }).then((categoria) => {
        if (categoria) {
            //Objeto user é valido
            //o user atualmente autenticado pode atualizar a task especificada
            return true;
        }
        //else - O objeto user é undefined
        return false;
    }).then((canDeleteTasks) => {

        if (canDeleteTasks) {
            Task.findByIdAndRemove({
                _id: req.params.taskId,
                _categoriaId: req.params.categoriaId
            }).then((removeTaskDoc) => {
                res.send(removeTaskDoc);
            })
        } else{
            res.sendStatus(401);
        }
    });
});

//================================================= USER ROUTES ================================================//

//POST /users
//Proposito: sing up

app.post('/users', (req, res) => {
    //User sing up
    let body = req.body;
    EmailDeEnvio = req.body.email;
    let newUser = new User(body);

    newUser.save().then(() => {
        console.log(EmailDeEnvio)
        return newUser.createSession();
    }).then((refreshToken) => {
        return newUser.generateAccessAuthToken().then((accessToken) => {
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send("Erro, algo aconteceu!");
    })
})

//POST /users/login
//Proposito: login

app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    EmailDeEnvio = email;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Sessão criada com sucesso - refreshToken retornado.
            // agora geramos um token de autenticação de acesso para o usuário

            return user.generateAccessAuthToken().then((accessToken) => {
                // token de autenticação de acesso gerado com sucesso, agora retornamos um objeto contendo os tokens de autenticação
                console.log("Email connectado com sucesso " + EmailDeEnvio)
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // Agora construímos e enviamos a resposta ao usuário com seus tokens de autenticação no cabeçalho e o objeto do usuário no corpo
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})

//GET /users/me/access-token
//Proposito: gerar e retornar o token de acesso.

app.get('/users/me/access-token', verifySession, (req, res) => {
    // we know that the user/caller is authenticated and we have the user_id and user object available to us
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})

app.get('/user/:id/tasks', async (req, res) => {
    const userId = req.params.id
    let taskList = []

    const categorias = await Categoria.find({
        _userId: userId
    })
    
    for (const cat of categorias) {
        const categoriaId = await cat._id.toString()
        const tasks = await Task.find({_categoriaId: categoriaId})

        if (tasks.length > 0) {
            taskList = taskList.concat(tasks)
        }
    }

    return res.status(200).send(taskList)
})


//============================================== METODOS DE AJUDA =============================================//

let deleteTaskFromCategoria = (_categoriaId) => {
    Task.deleteMany({
        _categoriaId
    }).then(() => {
        console.log("As tasks da " + _categoriaId + " foram apagadas!");
    })

}


//=================================================== SERVER ==================================================//

app.listen(3000, () => {
    console.log("Server escutando a porta 3000");
})