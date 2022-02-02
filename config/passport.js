const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const mongoose = require('mongoose');
// const Users = mongoose.model('Users')
const Users = require('../models/Users');

passport.use( new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
    }, 
    async (email, password, done) => {
        const user = await Users.findOne({ email });

        if (!user) {
            return done(null, false, {
                message: 'User doesn´t exist'
            })
        }
        // console.log(Users.usersSchema.comparePassword);
        const checkPassword = user.comparePassword(password);

        if (!checkPassword) return done(null, false, 
            { message: 'Wrong Password'})

        // If user data is correct
        return done( null, user);
    })
);

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser( async (id, done) => {
    const user = await Users.findById(id).lean();
    return done(null, user);
})

module.exports = passport;