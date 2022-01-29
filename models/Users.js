const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const bcrypt = require('bcrypt');

const usersSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true //'Add your name'
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: String, 
    expire: Date
});

// Password Hash Method
usersSchema.pre('save', async function (next) {
    // If password it´s hashed
    if (!this.isModified('password')) return next();

    // If password hasn´t been hashed
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash;
    next();

})

module.exports = mongoose.model('Users', usersSchema);