const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authenticateToken = require('../middleware/auth');

router.post('/create', authenticateToken, postController.create);
router.put('/edit/:id', authenticateToken, postController.edit);
router.delete('/delete/:id', authenticateToken, postController.delete);
router.get('/user', authenticateToken, postController.getUserPosts);
router.get('/', postController.getAll);
router.get('/:id', postController.get);

module.exports = router;