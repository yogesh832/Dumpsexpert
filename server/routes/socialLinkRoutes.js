const express = require('express');
const router = express.Router();
const controller = require('../controllers/socialLinkController');

router.get('/', controller.getLinks);
router.post('/', controller.addLink);
router.delete('/:id', controller.deleteLink);
router.put('/:id', controller.updateLink);

module.exports = router;
