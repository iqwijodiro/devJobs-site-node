const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacanciesController = require('../controllers/vacanciesController');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

module.exports = () => {
  router.get('/', homeController.showJobs);

  // Create Vacancies
  router.get('/vacancies/new', 
        authController.checkUser, 
        vacanciesController.formNewVacancy)

  router.post('/vacancies/new', 
        authController.checkUser, 
        vacanciesController.validateVacancy, 
        vacanciesController.addVacancy)

  //Show vacancy (one)
  router.get('/vacancies/:url', vacanciesController.showVacancy)

  // Edit Vacancy
  router.get('/vacancies/edit-vacancy/:url', 
        authController.checkUser, 
        vacanciesController.formEditVacancy);
  router.post('/vacancies/edit-vacancy/:url', 
        authController.checkUser, 
        vacanciesController.validateVacancy, 
        vacanciesController.editVacancy);

  // Create an Account
  router.get('/create-account', usersController.formCreateAccount);
  router.post('/create-account',
        usersController.validateRegister,
        usersController.createUser);

  // Auth
  router.get('/login', usersController.formLogin);
  router.post('/login', authController.authUser);

  // Log Out
  router.get('/logout', authController.checkUser, authController.logOut)

  // Admin Panel
  router.get('/admin-user',
        authController.checkUser, 
        authController.showAdminPanel)

  // Edit-profile
  router.get('/edit-profile', 
        authController.checkUser, 
        usersController.formEditProfile)
  router.post('/edit-profile', 
        authController.checkUser, 
        usersController.validateProfile, 
        usersController.updateProfile)

  return router;
};
