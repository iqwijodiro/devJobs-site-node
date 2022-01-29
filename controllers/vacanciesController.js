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
    console.log(vacancy);

    // Store in the DB

    const newVacancy = await vacancy.save();

    //Redirect

    res.redirect(`/vacancies/${newVacancy.url}`);
}