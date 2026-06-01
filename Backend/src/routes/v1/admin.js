const router = require('express').Router();
const { getAllUsers, toggleUserStatus } = require('../../controllers/adminController');
const { protect, authorize } = require('../../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.patch('/users/:id/toggle', toggleUserStatus);

module.exports = router;