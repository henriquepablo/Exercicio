const express = require('express');

const router = express.Router();

const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'tela-login', 'login.html'));
});

module.exports = router;