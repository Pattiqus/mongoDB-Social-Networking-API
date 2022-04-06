
const router = require('express').Router();
const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtsRoutes.js');

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;