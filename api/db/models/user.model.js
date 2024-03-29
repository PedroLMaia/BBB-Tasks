const mongoose = require('mongoose');
const _ = require('lodash');
// const { reject } = require('lodash');
const jwt = require('jsonwebtoken');
const { reject, has } = require('lodash');
const crypto = require('crypto');
const bcrypt = require('bcryptjs/dist/bcrypt');

const jwtSecret = "738883684733812850273381285027ajkshdjkshdjahdjlashdl9962259338";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    sessions: [{
        token: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Number,
            required: true
        }
    }]
});




// Metodos de instanciamento
UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    //retornar o documento menos o password e as sessoes.
    return _.omit(userObject, ['password', 'sessions']);
}

UserSchema.methods.generateAccessAuthToken = function () {
    const user = this;
    return new Promise((resolve, reject) => {
        //Cria o JSON web token e retornar ele.
        jwt.sign({ _id: user._id.toHexString() }, jwtSecret, { expiresIn: "20m" }, (err, token) => {
            if (!err) {
                resolve(token);
            } else {
                reject();
            }
        })
    })
}

UserSchema.methods.generateRefreshAuthToken = function () {
    //Esse metodo gera uma string hex de 64 byte. Esse metodo não salva no banco, o metodo saveSessionToDatabase() que salva.
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (!err) {
                let token = buf.toString('hex');

                return resolve(token);
            }
        })
    })
}

UserSchema.methods.createSession = function () {
    let user = this;

    return user.generateRefreshAuthToken().then((refreshToken) => {
        return saveSessionToDatabase(user, refreshToken);
    }).then((refreshToken) => {
        return refreshToken;
    }).catch((e) => {
        return Promise.reject('Falha ao salvar a sessão no database. \n' + e)
    })
}


//Metodos models(metodos estaticos)

UserSchema.statics.getJWTSecret = () => {
    return jwtSecret;
}

UserSchema.statics.findByIdAndToken = function (_id, token) {
    const User = this;
    return User.findOne({
        _id,
        'sessions.token': token
    });
}

UserSchema.statics.findByCredentials = function (email, password) {
    let User = this;
    return User.findOne({ email }).then((user) => {
        if (!user) return Promise.reject();

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                }
                else {
                    reject();
                }
            })
        })
    })
}

UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
    let secondsSinceEpoch = Date.now() / 1000;
    if(expiresAt > secondsSinceEpoch) {
        return false;
    }else{
        return true;
    }
}

//Midelware
UserSchema.pre('save', function (next) {
    let user = this;
    let costFactor = 10;

    if(user.isModified('password')){
        //se o campo do password for editado entao rode esse codigo.

        bcrypt.genSalt(costFactor, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password =  hash;
                next();
            })
        })
    }else{
        next();
    }
});



//Metodos de ajudas
let saveSessionToDatabase = (user, refreshToken) => {
    return new Promise((resolve, reject) => {
        let expiresAt = gererateRefreshTokenExpiryTime();

        user.sessions.push({ 'token': refreshToken, expiresAt })

        user.save().then(() => {
            //Sessão salva com sucesso.
            return resolve(refreshToken);
        }).catch((e) => {
            reject(e);
        });
    })
}

let gererateRefreshTokenExpiryTime = () => {
    let daysUntilExpire = "10";
    let secondsUntilExpire = ((daysUntilExpire * 24) * 60) * 60;
    return ((Date.now() / 1000) + secondsUntilExpire);
}

const User = mongoose.model('User', UserSchema);
const secret = jwtSecret
module.exports = {User, secret};