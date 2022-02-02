// const mongoose = require('mongoose');
// const Vacancy = mongoose.model('Vacancy')
const Vacancy = require('../models/Vacancies')
const { body, validationResult } = require('express-validator');

exports.formNewVacancy = (req, res) => {
    res.render('new-vacancy', {
        pageName: 'New Vacancy',
        tagline: 'Fill the form and post your vacancy',
        logOut: true,
        name: req.user.name
    })
}

// Add the vacancies to DataBase

exports.addVacancy = async (req, res) => {
    const vacancy = new Vacancy(req.body);

    // User who create the vacancy
    vacancy.author = req.user._id;

    // Create a Skills Array
    vacancy.skills = req.body.skills.split(',');
    // console.log(vacancy);

    // Store in the DB
    const newVacancy = await vacancy.save();

    //Redirect
    res.redirect(`/vacancies/${newVacancy.url}`);
}

// Show the vacancy selected
exports.showVacancy = async (req, res, next) => {
    const vacancy = await Vacancy.findOne({ url: req.params.url }).lean();

    // If there´s no results
    if (!vacancy) return next();

    res.render('vacancy', {
        vacancy,
        pageName: vacancy.title,
        bar: true
    })
}

//Edit Vacancy

exports.formEditVacancy = async (req, res, next) => {
    const vacancy = await Vacancy.findOne({ url: req.params.url }).lean();

    if (!vacancy) {
        return next();
    }

    res.render('edit-vacancy', {
        vacancy,
        pageName: `Editar -${vacancy.title}`,
        logOut: true,
        name: req.user.name
    })
}

exports.editVacancy = async (req, res) => {
    const updatedVacancy = req.body;

    updatedVacancy.skills = req.body.skills.split(',');

    const vacancy = await Vacancy.findOneAndUpdate({ url: req.params.url }, updatedVacancy, {
        new: true,
        runValidators: true
    } ).lean();

    res.redirect(`/vacancies/${vacancy.url}`);
}

// Validate fields

exports.validateVacancy = async (req, res, next) => {
    const rules = [
        body('title').not().isEmpty().withMessage('Add a title to the vacancy').escape(),
        body('company').not().isEmpty().withMessage('Add a company').escape(),
        body('location').not().isEmpty().withMessage('Add a location').escape(),
        body('contract').not().isEmpty().withMessage('Select a contract type').escape(),
        body('skills').not().isEmpty().withMessage('Add one skill at least').escape()
    ]

    await Promise.all(rules.map( (validation) => validation.run(req) ) );
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('error', errors.array().map( (error) => error.msg ));
        res.render('new-vacancy', {
            pageName: 'New Vacancy',
            tagline: 'Fill the form and post your vacancy',
            logOut: true,
            name: req.user.name,
            messages: req.flash('correct', 'Ready to post')
        });
        return;
    }
    next();
};
