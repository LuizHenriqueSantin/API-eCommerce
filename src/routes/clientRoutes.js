const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

router.post('/create-user', clientController.createUser);
router.post('/login', clientController.login);

module.exports = router;