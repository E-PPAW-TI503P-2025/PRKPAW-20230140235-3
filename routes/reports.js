const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { addUserData, isAdmin } = require('../middleware/permissionMiddleware');

console.log('addUserData:', typeof addUserData);
console.log('isAdmin:', typeof isAdmin);
console.log('getDailyReport:', typeof reportController.getDailyReport);

router.get('/', reportController.getDailyReport);

module.exports = router;
