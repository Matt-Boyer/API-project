const express = require('express');
const router = express.Router();
const requireAuth = require('../../utils/auth');
const {Group} = require('../../db/models');

router.get('/', async (req,res) => {
    const groups = await Group.findAll()
    res.json(groups)
})

router.get('/current', async (req, res) => {
    requireAuth()
    res.json("test")
})

module.exports = router;
