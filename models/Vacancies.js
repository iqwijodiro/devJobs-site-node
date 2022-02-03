const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const slug = require('slug');
const shortid = require('shortid');

const vacanciesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Please name the vacancy properly...',
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true,
        required: 'Please share with us the location'
    },
    salary: {
        type: String,
        default: 0,
        trim: true
    },
    contract: {
        type: String
    },
    description: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        lowercase: true
    },
    skills: [String],
    applicants: [{
        name: String,
        email: String,
        cv: String
    }],
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: 'Vacancy\'s author is required'
    }
})
vacanciesSchema.pre('save', function (next) {
    const url = slug(this.title);
    this.url = `${url}-${shortid.generate()}`
    next();
})

vacanciesSchema.index( { title: 'text'})

module.exports = mongoose.model('Vacancy', vacanciesSchema);