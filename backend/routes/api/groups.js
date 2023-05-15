const express = require('express');
const router = express.Router();
const {requireAuth} = require('../../utils/auth');
const {Group, Membership, GroupImage} = require('../../db/models');

router.get('/', async (req,res) => {
    let arr = [];
    const groups = await Group.findAll({
        include: {
            model: GroupImage,
            where: {preview : true},
            attributes: ['url'],
            required:false
        }
    });
    for (let group of groups) {
        let num = await Membership.count({
            where: {
                groupId: group.id
            }
        });
        let {url} = group.GroupImages[0] ? group.GroupImages[0]: {url:null};
        let member = group.toJSON();
        member.previewImage = url;
        member.numMembers = num;
        delete member.GroupImages;
        arr.push(member);
    }
    res.json(arr)
})

router.get('/current',requireAuth,async (req, res) => {
    const userId = req.user.id;
    let groups = await Group.findAll({
        where: {
            organizerId: userId
        }
    })
})

module.exports = router;
