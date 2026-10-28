const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { protect, authorizeAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const { updateUserValidation } = require('../validations/user.validation');

router.get('/', protect, getUsers);
router.get('/:id', protect, getUserById);
router.post('/', protect, authorizeAdmin, createUser);
router.put('/:id', protect, updateUserValidation, validate, updateUser);
router.delete('/:id', protect, authorizeAdmin, deleteUser);

module.exports = router;
