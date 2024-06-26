const express = require('express');
const router = express.Router();
//const fs = require('fs');
const userController = require('./../controllers/userController')

//router.param('id', tourController.checkID);

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)
    .delete(userController.deleteAllUsers);

module.exports = router;