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

router.get('/:eventId', async (req, res) =>   {
    const eventId = parseInt(req.params.eventId);
    const event = await Event.findByPk(eventId,{
        attributes: {
            exclude:['createdAt', 'updatedAt']
        },
        include: [{
            model:Group,
            attributes:['id','name','private','city','state']
        },{
            model:Venue,
            attributes:['id','address','city','state','lat','lng']
        },{
            model:EventImage,
            attributes:['id','url','preview']
        }]
    });
    if (!event)   {
        res.status(404);
        return res.json({message:"Event couldn't be found"})
    };
    const numAttending = await Attendance.count({
        where: {
            eventId,
            status: {[Op.in]: ['Attending']}
        }
    });
    let pojo = event.toJSON();
    pojo.numAttending = numAttending;

    res.json(pojo)
})

const validateEvent = async (venueId,name,type,capacity,price,description,startDate,endDate) => {
    let error = {};
    const venue = await Venue.findByPk(venueId)
    if (!venue)   {
        error.venue = "Venue does not exist"
    }
    if (name.length < 5)  {
        error.name = "Name must be at least 5 characters"
    }
    if (type !== 'Online' && type !== 'In-person')   {
        error.type = "Type must be Online or In person"
    }
    if (Number.isNaN(capacity))    {
        error.capacity = 'Capacity must be an integer'
    }
    let validPrice = price.toString().split('.')
    if (Number.isNaN(price) || validPrice[1].length > 2 || price < 0)  {
        error.price = "Price is invalid"
    }
    if (description === '' || description === null || description === undefined)    {
        error.description = "Description is required"
    }
    let currentDate = new Date();
    // let startDateSplit = startDate.split(' ')
    // let thierDate =  new Date(startDateSplit[0])
    let theirDate = new Date(startDate)
    if (currentDate >= theirDate)   {
        error.startDate = "Start date must be in the future"
    }
    let endDateModified = new Date(endDate)
    if (endDateModified < theirDate) {
        error.endDateModified = "End date is less than start date"
    }
    if (Object.values(error).length > 0)   {
        return error
    }
}

router.put('/:eventId', requireAuth, async(req,res) =>  {
    const userId = req.user.id;
    const eventId = parseInt(req.params.eventId);
    const {venueId,name,type,capacity,price,description,startDate,endDate} = req.body;
    const event = await Event.findByPk(eventId,{
        attributes: {
            exclude:['createdAt', 'updatedAt']
        }
    })
    if (!event)   {
        res.status(404);
        return res.json({message:"Event couldn't be found"})
    };
    const group = await Group.findByPk(event.groupId,{
        include: [{
            model: Membership,
            where: {groupId:event.groupId,userId},
            required:false
        }]
    });
    let {status} = group.Memberships[0] ? group.Memberships[0] : {status:null}
    if (userId !== group.organizerId && status !== 'Co-host')   {
        res.status(403)
        return res.json({message:"Forbidden"})
    }
    let error = await validateEvent(venueId,name,type,capacity,price,description,startDate,endDate)
    if (error)  {
        res.status(400);
        return res.json(error)
    }
    if (venueId)    {event.venueId = venueId};
    if (name) {event.name = name};
    if (type) {event.type = type};
    if (capacity) {event.capacity = capacity}
    if (price)  {event.price = price}
    if (description)    {event.description = description}
    if (startDate)  {event.startDate = startDate}
    if (endDate)    {event.endDate = endDate}
    await event.save()
    res.json(event)
})

router.delete('/:eventId', requireAuth, async(req,res) =>   {
    const userId = req.user.id;
    const eventId = parseInt(req.params.eventId);
    const event = await Event.findByPk(eventId)
    if (!event)   {
        res.status(404);
        return res.json({message:"Event couldn't be found"})
    };
    const group = await Group.findByPk(event.groupId,{
        include: [{
            model: Membership,
            where: {groupId:event.groupId,userId},
            required:false
        }]
    });
    let {status} = group.Memberships[0] ? group.Memberships[0] : {status:null}
    if (userId !== group.organizerId && status !== 'Co-host')   {
        res.status(403)
        return res.json({message:"Forbidden"})
    }
    await event.destroy()
    res.json({message: "Successfully deleted"})
})

router.get('/:eventId/attendees', async(req,res) => {
    const userId = req.user.id;
    const eventId = parseInt(req.params.eventId);
    const event = await Event.findByPk(eventId)
    if (!event)   {
        res.status(404);
        return res.json({message:"Event couldn't be found"})
    };
    const group = await Group.findByPk(event.groupId,{
        include: [{
            model: Membership,
            where: {groupId:event.groupId,userId},
            required:false
        }]
    })
    let {status} = group.Memberships[0] ? group.Memberships[0] : {status:null};
    if (userId === group.organizerId || status === 'Co-host')   {
        let attendees = await User.findAll({
            include: {
                model:Attendance,
                attributes:['status'],
                where: {
                    eventId
                }
            }
        })
        return res.json({Attendees:attendees})
    }
    let attendees = await User.findAll({
        include: {
            model:Attendance,
            attributes:['status'],
            where: {
                eventId,
                status:{[Op.in]:['Waitlist','Attending']}
            }
        }
    })
    res.json({Attendees:attendees})
})

router.post('/:eventId/attendance', requireAuth, async(req,res) =>  {
    const userId = req.user.id;
    const eventId = parseInt(req.params.eventId);
    const event = await Event.findByPk(eventId)
    if (!event)   {
        res.status(404);
        return res.json({message:"Event couldn't be found"})
    };
    res.json('test')
})

module.exports = router;
