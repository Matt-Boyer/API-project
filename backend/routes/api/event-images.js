const express = require('express');
const router = express.Router();
const {requireAuth} = require('../../utils/auth');
const {Attendance, EventImage,Group, Membership, GroupImage,User,Venue, Sequelize,Event} = require('../../db/models');
const Op = Sequelize.Op;

router.delete('/:imageId', requireAuth, async(req,res) =>   {
    const userId = req.user.id;
    const imageId = parseInt(req.params.imageId);
    const eventImage = await EventImage.findByPk(imageId)
    if (!eventImage)   {
        res.status(404);
        return res.json({message:"Event Image couldn't be found"})
    };
    const event = await Event.findByPk(eventImage.eventId)
    if (!event) {
        res.status(404);
        return res.json({message:"Event couldn't be found"})
    }
    const group = await Group.findByPk(event.groupId,{
        include: [{
            model: Membership,
            where: {groupId:event.groupId,userId},
            required:false
        }]
    })
    let {status} = group.Memberships[0] ? group.Memberships[0] : {status:null};
    if (userId !== group.organizerId && status !== 'Co-host')    {
        res.status(403)
        res.json({message:'Forbidden'})
    }
    await eventImage.destroy()
    res.json({message:"Successfully deleted"})
})

module.exports = router;
