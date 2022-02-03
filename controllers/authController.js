const passport = require('passport');
// const mongoose = require('mongoose');
// const Vacancy = mongoose.model('Vacancy')
const Vacancy = require('../models/Vacancies');
const Users = require('../models/Users');
const crypto = require('crypto');
const sendEmail =require('../handlers/email');

exports.authUser = passport.authenticate('local', {
    successRedirect: '/admin-user',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Unable to connect'
})

// check if user is authenticated
exports.checkUser = (req, res, next) => {
    // Checks user
    if ( req.isAuthenticated() ) return next();

    // Redirect
    res.redirect('/login')
}

exports.showAdminPanel = async (req, res) => {
    const vacancies = await Vacancy.find( { author: req.user._id } ).lean();
    
    res.render('admin-user', {
        pageName: 'Admin Panel',
        tagline: 'Create and improve your vacancies from here',
        logOut: true,
        name: req.user.name,
        image: req.user.image,
        vacancies
    })
}

//log Out

exports.logOut = (req, res) => {
    req.logout();
    req.flash('correct', 'You are logged out');
    return res.redirect('/login');
}

// Form to reset password

exports.formResetPassword = (req, res) => {
    res.render('reset-password', {
        pageName: 'Reset your password',
        tagline: 'Don´t mention it, all of us have forgotten a password at some time or another.'
    })
}

// Generates token on user´s table

exports.sendToken = async (req, res) => {
    const user = await Users.findOne( {email: req.body.email} );

    if (!user) {
        req.flash('error', 'We don´t know that email')
        return res.redirect('/login')
    }

    user.token = crypto.randomBytes(20).toString('hex');
    user.expire = Date.now() + 3600000;

    await user.save();

    const resetUrl = `http://${req.headers.host}/reset-password/${user.token}`;

    // console.log(resetUrl);

    await sendEmail.send({
        user,
        subject: 'Reset your password',
        resetUrl,
        file: 'reset'
    })
    req.flash('correct', 'Check your email to reclaim your password')
    res.redirect('/login');
}

exports.resetPassword = async (req, res) => {
    const user = await Users.findOne({
        token: req.params.token,
        expire: {
            $gt: Date.now()
        }
    });

    if (!user) {
        req.flash( 'error', 'This token isn´t valid');
        return res.redirect('/reset-password');
    }

    res.render('new-password', {
        pageName: 'Set your new password'
    })
}

exports.updatePassword = async (req, res) => {
    const user = await Users.findOne({
        token: req.params.token
    });

    // If user doesn´t exist
    if (!user) {
        req.flash( 'error', 'This token isn´t valid anymore');
        return res.redirect('/reset-password');
    }

    user.password = req.body.password;
    user.token = undefined;
    user.expire = undefined;

    await user.save();

    req.flash('correct', 'The new password has been saved correctly');
    res.redirect('/login')
}