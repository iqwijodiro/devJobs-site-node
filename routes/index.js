const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacanciesController = require('../controllers/vacanciesController');
const usersController = require('../controllers/usersController');

module.exports = () => {
  router.get('/', homeController.showJobs);

  // Create Vacancies
  router.get('/vacancies/new', vacanciesController.formNewVacancy)
  router.post('/vacancies/new', vacanciesController.addVacancy)

  //Show vacancy (one)
  router.get('/vacancies/:url', vacanciesController.showVacancy)

  // Edit Vacancy
  router.get('/vacancies/edit-vacancy/:url', vacanciesController.formEditVacancy);
  router.post('/vacancies/edit-vacancy/:url', vacanciesController.editVacancy);

  // Create an Account
  router.get('/create-account', usersController.formCreateAccount);
  router.post('/create-account', usersController.createUser);

  return router;
};
