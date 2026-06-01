const { validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formatted = errors.array().flatMap((error) => {
            switch (error.type) {
                case 'field':
                    return [{ field: error.path, message: error.msg }];
                case 'alternative':
                    return error.nestedErrors.map((e) => ({ field: e.path, message: e.msg }));
                case 'alternative_grouped':
                    return error.nestedErrors.flat().map((e) => ({ field: e.path, message: e.msg }));
                case 'unknown_fields':
                    return error.fields.map((f) => ({ field: f.path, message: error.msg }));
                default:
                    return [];
            }
        });
        return sendError(res, 422, 'Validation failed', formatted);
    }
    next();
};

module.exports = handleValidation;