const express = require('express');
const router = express.Router();
const {requireAuth} = require('../../utils/auth');
const {EventImage,Attendance, Group, Membership, GroupImage,User,Venue, Sequelize, Event} = require('../../db/models');
const Op = Sequelize.Op;

router.get('/', async (req, res) =>    {
    const events = await Event.findAll({
        include: [{
            model:EventImage,
            where:{preview:true},
            attributes: ['url'],
            required:false
        },{
            model:Group,
            attributes: ['id','name','city','state']
        },{
            model:Venue,
            attributes: ['id','city','state']
        }],
        attributes: {
            exclude: ['createdAt','updatedAt','description','price','capacity']
        }
    });
    let arr = [];
    for (let event of events) {
        const numAttending = await Attendance.count({
            where: {
                eventId: event.id,
                status: {[Op.in]: ['Attending']}
            }
        })
        let {url} = event.EventImages[0] ? event.EventImages[0]: {url:null};
        let pojo = event.toJSON();
        pojo.previewImage = url;
        pojo.numAttending = numAttending;
        delete pojo.EventImages;
        arr.push(pojo)
    }
    res.json({Events:arr})
})



module.exports = router;
