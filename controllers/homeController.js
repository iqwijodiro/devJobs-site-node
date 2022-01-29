const mongoose = require('mongoose');
const Vacancy = mongoose.model('Vacancy')

exports.showJobs = async (req, res, next) => {

    const vacancies = await Vacancy.find().lean();

    if (!vacancies) return next();

    res.render('home', {
        pageName: 'devJobs',
        tagline: 'Find and post your dream job',
        bar: true,
        btn: true,
        vacancies
    })
}