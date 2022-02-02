const passport = require('passport');
// const mongoose = require('mongoose');
// const Vacancy = mongoose.model('Vacancy')
const Vacancy = require('../models/Vacancies')

exports.authUser = passport.authenticate('local', {
    successRedirect: '/admin-user',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Both fields are required'
})

// check if user is authenticated
exports.checkUser = (req, res, next) => {
    // Checks user
    if ( req.isAuthenticated() ) return next();

    // Redirect
    res.redirect('/login')
}

exports.showAdminPanel = async (req, res) => {
    const vacancies = await Vacancy.find( { author: req.user._id } ).lean()
    res.render('admin-user', {
        pageName: 'Admin Panel',
        tagline: 'Create and improve your vacancies from here',
        logOut: true,
        name: req.user.name,
        vacancies
    })
}

//log Out

exports.logOut = (req, res) => {
    req.logout();
    req.flash('correct', 'You are logged out');
    return res.redirect('/login');
}