const mongoose = require('mongoose');
const Vacancy = mongoose.model('Vacancy')

exports.formNewVacancy = (req, res) => {
    res.render('new-vacancy', {
        pageName: 'New Vacancy',
        tagline: 'Fill the form and post your vacancy',
    })
}

// Add the vacancies to DataBase

exports.addVacancy = async (req, res) => {
    const vacancy = new Vacancy(req.body);

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
        pageName: `Editar -${vacancy.title}`
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