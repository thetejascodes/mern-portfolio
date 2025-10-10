const express = require('express');
const router = express.Router();
const {createContact, getContacts} = require('../controllers/contactController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/',createContact);
router.get('/',protect,authorizeRoles('admin'),getContacts);

module.exports = router;