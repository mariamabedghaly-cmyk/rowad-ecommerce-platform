const { body } = require('express-validator');

const updateUserValidation = [
    body('name')
        .optional()
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('email')
        .optional()
        .isEmail().withMessage('Please enter a valid email'),
    body('password')
        .optional()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

module.exports = { updateUserValidation };
