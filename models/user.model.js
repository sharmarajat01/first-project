const { model, Schema } = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const joi = require('joi');
const config = require('config');

const SALT_FACTOR = 10;

const userSchema = new Schema({
    name: {
        type: String,
        maxlength: 30,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 40
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    id: {
        type: String
    },
    token: {
        type: String
    },
    provider: {
        type: String
    },
    profileImage: {
        type: String
    }
});

userSchema.methods.setPassword = async function (password) {
    this.salt = await bcrypt.genSalt(SALT_FACTOR);
    this.password = await bcrypt.hash(password, this.salt);
}

userSchema.methods.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

userSchema.methods.generateJWT = function () {
    return jwt.sign({
        email: this.email
    },
        config.get('JWT_SECRET'),
        { expiresIn: config.get('JWT_EXP') }
    );
}

const validateLoginUser = user => {
    const schema = {
        email: joi.string()
            .required()
            .min(7)
            .max(40)
            .email(),

        password: joi.string()
            .required()
    }
    return joi.validate(user, schema);
}

const validateRegisterUser = user => {
    const schema = {
        name: joi.string()
            .required()
            .min(3)
            .max(30),

        email: joi.string()
            .min(7)
            .max(40)
            .required()
            .email(),

        password: joi.string()
            .required()
            .min(5)
            .max(40),

        confirmPassword: joi.string()
            .required()
            .valid(joi.ref('password'))
            .options({language: {any: {allowOnly: 'must be match with password'}}})
    }
    return joi.validate(user, schema)
}

const User = model('users', userSchema, 'users');

module.exports = { User, validateRegisterUser , validateLoginUser }