// const mongoose = require('mongoose');
// const Users = mongoose.model('Users');
const Users = require('../models/Users');
// import Users from "../models/Users";
const { body, validationResult } = require('express-validator')
const multer = require('multer');
const shortid = require('shortid');

exports.uploadImage = (req, res, next) => {
    upload(req, res, function(error) {
        if (error) {
            if (error instanceof multer.MulterError) {
                if (error.code === "LIMIT_FILE_SIZE") {
                    req.flash('error', 'File it´s too large: don´t exceed 100kb')
                } else {
                    req.flash('error', error.message)
                }
            } else {
                req.flash('error', error.message);
            }
            res.redirect('/edit-profile');
            return;
        } else {
            return next();
        }
    });
}

// Multer configuration

const configMulter = {
    limits: { fileSize: 100000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname+'../../public/uploads/profiles');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter( req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
            cb(null, true)
        } else {
            cb(new Error('File extension not supported'))
        }
    }
}

const upload = multer( configMulter ).single('image');

exports.validateRegister = async (req, res, next) => {
    // Cleaning fields
    const rules = [
        body('name').not().isEmpty().withMessage('Please register your name correctly').escape(),
        body('email').isEmail().withMessage('Email is required').normalizeEmail(),
        body('password').not().isEmpty().withMessage('Password is required').escape(),
        body('confirm').not().isEmpty().withMessage('Please confirm the password').escape(),
        body('confirm').equals(req.body.password).withMessage('Passwords don´t match').escape(),
    ]

    await Promise.all(rules.map(validation => validation.run(req)));

    const errors = validationResult(req);
    // console.log(errors);

    if (!errors.isEmpty()) {
        req.flash('error', errors.array().map(error => error.msg));
        res.render('create-account', {
            pageName: 'Create a devJobs account',
            tagline: 'Start posting your dream job vacancies for free!',
            messages: req.flash()
        })
        return;
    }
    next();
}
exports.formCreateAccount = (req, res) => {
    res.render('create-account', {
        pageName: 'Create a devJobs account',
        tagline: 'Start posting your dream job vacancies for free!'
    })
}

exports.createUser = async (req, res, next) => {
    const user = new Users(req.body);
    
    try {
        await user.save();
        res.redirect('/login');
    } catch (error) {
        req.flash('error', 'That email is already registered')
        res.redirect('/create-account');
    }
}

exports.formLogin = (req, res) => {
    res.render('login', {
        pageName: 'Login devJobs'
    })
}

exports.formEditProfile = (req, res) => {
    res.render('edit-profile', {
        pageName: 'Edit your profile',
        user: req.user,
        logOut: true,
        name: req.user.name,
        image: req.user.image
    })
}

//Save changes from edit profile

exports.updateProfile = async (req, res) => {
    const user = await Users.findById( req.user._id)

    user.name = req.body.name;
    user.email = req.body.email;
    if (req.body.password) {
        user.password = req.body.password
    }

    if (req.file) {
        user.image = req.file.filename;
    };
    await user.save();

    req.flash('correct', 'Saved succesfully');

    //redirect
    res.redirect('/admin-user')
}

// Validate & clean Edit Profile form

exports.validateProfile = async (req, res, next) => {
    
    if (req.body.name === '' && req.body.email === '') {
        const rules = [
            body('name').not().isEmpty().withMessage('The name is required').escape(),
            body('email').isEmail().withMessage('Email is required').normalizeEmail(),
            body('password').not().isEmpty().withMessage('Password is required').escape()
        ]
        await Promise.all(rules.map( validation => validation.run(req)));
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map( error => error.msg ))
            res.render('edit-profile', {
                pageName: 'Edit your profile',
                user: req.user,
                logOut: true,
                name: req.user.name,
                image: req.user.image,
                messages: req.flash()
            })
            return;
        }
        next();
    } 
}