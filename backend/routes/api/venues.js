const express = require('express');
const router = express.Router();
const {requireAuth} = require('../../utils/auth');
const {Group, Membership, GroupImage,User,Venue, Sequelize} = require('../../db/models');

router.put('/:venueId', requireAuth, async (req, res) => {
    res.json('test')
})


module.exports = router;
