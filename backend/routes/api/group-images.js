const express = require('express');
const router = express.Router();
const {requireAuth} = require('../../utils/auth');
const {Attendance, EventImage,Group, Membership, GroupImage,User,Venue, Sequelize,Event} = require('../../db/models');
const Op = Sequelize.Op;

router.delete('/:imageId', requireAuth, async(req,res) =>   {
    const userId = req.user.id;
    const imageId = parseInt(req.params.imageId);
    const groupImage = await GroupImage.findByPk(imageId)
    if (!groupImage)   {
        res.status(404);
        return res.json({message:"Group Image couldn't be found"})
    };
    const group = await Group.findByPk(groupImage.groupId,{
        include: [{
            model: Membership,
            where: {groupId:groupImage.groupId,userId},
            required:false
        }]
    })
    let {status} = group.Memberships[0] ? group.Memberships[0] : {status:null};
    if (userId !== group.organizerId && status !== 'Co-host')    {
        res.status(403)
        res.json({message:'Forbidden'})
    }
    await groupImage.destroy()
    res.json({message:"Successfully deleted"})
})

module.exports = router;
