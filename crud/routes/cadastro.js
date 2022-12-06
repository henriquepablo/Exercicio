const express = require('express');

const router = express.Router();

const path = require('path');

router.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'cadastro', 'cadastro.html'));
});

module.exports = router;