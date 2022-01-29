const mongoose = require('mongoose');
const Users = mongoose.model('Users');

exports.formCreateAccount = (req, res) => {
    res.render('create-account', {
        pageName: 'Create a devJobs account',
        tagline: 'Start posting your dream job vacancies for free!'
    })
}

exports.createUser = async (req, res, next) => {
    const user = new User(req.body)
    console.log(user);
}