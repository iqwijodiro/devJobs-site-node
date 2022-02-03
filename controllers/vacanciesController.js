// const mongoose = require('mongoose');
// const Vacancy = mongoose.model('Vacancy')
const Vacancy = require('../models/Vacancies')
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const shortid = require('shortid');

exports.formNewVacancy = (req, res) => {
    res.render('new-vacancy', {
        pageName: 'New Vacancy',
        tagline: 'Fill the form and post your vacancy',
        logOut: true,
        name: req.user.name,
        image: req.user.image,
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
    const vacancy = await Vacancy.findOne({ url: req.params.url }).populate('author').lean();
    // console.log(vacancy);
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
        name: req.user.name,
        image: req.user.image
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
            image: req.user.image,
            messages: req.flash('correct', 'Ready to post')
        });
        return;
    }
    next();
};

exports.deleteVacancy = async (req, res) => {
    const { id } = req.params;
    const vacancy = await Vacancy.findById(id)

    if (checkAuthor(vacancy, req.user)) {
        vacancy.remove();
        res.status(200).send('Vacancy deleted succesfully')
    } else {
        res.status(403).send('Error to delete')
    }

}

const checkAuthor = (vacancy = {}, user = {}) => {
    if (!vacancy.author.equals(user._id)) {
        return false;
    }
    return true;
}


exports.uploadResume = (req, res, next) => {
    upload(req, res, function(error) {
        if (error) {
            if (error instanceof multer.MulterError) {
                if (error.code === "LIMIT_FILE_SIZE") {
                    req.flash('error', 'File it´s too large: don´t exceed 1 Mb')
                } else {
                    req.flash('error', error.message)
                }
            } else {
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
        } else {
            return next();
        }
    });
    
}
// Multer configuration

const configMulter = {
    limits: { fileSize: 1000000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname+'../../public/uploads/resumes');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter( req, file, cb) {
        if (file.mimetype === 'application/pdf' ) {
            cb(null, true)
        } else {
            cb(new Error('File extension not supported'))
        }
    }
}

const upload = multer( configMulter ).single('resume');

exports.contactJob = async (req, res, next) => {
    const vacancy = await Vacancy.findOne( { url: req.params.url });

    // If there´s no vacancy
    if (!vacancy) return next();

    // Everything is right
    const newApplicant = {
        name: req.body.name,
        email: req.body.email,
        resume: req.file.filename
    }
    // console.log(newApplicant);
    // Store vacancy
    vacancy.applicants.push(newApplicant);
    await vacancy.save();

    req.flash('correct', 'Your resume has been sent successfully');
    res.redirect('/');


}