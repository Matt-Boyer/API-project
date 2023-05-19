const express = require('express');
const router = express.Router();
const {requireAuth} = require('../../utils/auth');
const {EventImage,Attendance, Group, Membership, GroupImage,User,Venue, Sequelize, Event} = require('../../db/models');
const Op = Sequelize.Op;

let validateParams = (page,size,name,type,startDate)  =>  {
    size = parseInt(size)
    page = parseInt(page)
    let error = {};
    if (page < 1)   {
        error.page = "Page must be greater than or equal to 1"
    }
    if (size < 1)   {
        error.size = "Size must be greater than or equal to 1"
    }
    if (name && typeof name !== 'string')   {
        error.name = "Name must be a string"
    }
    if (type && type !== 'Online' && type !== 'In-person')  {
        error.type = "Type must be 'Online' or 'In-person'"
    }
    // let date = new Date(startDate)
    // if (date) {
    //     error.startDate = "Start date must be a valid datetime"
    // }
    if (Object.values(error).length > 0)   {
        return error
    }
}


router.get('/', async (req, res) =>    {
    let {page,size,name,type,startDate} = req.query
    let error = validateParams(page,size,name,type,startDate)
    if (error)  {
        res.status(400)
        return res.json(error)
    }
    let where = {};
    if (name) {where.name = name}
    if (type) {where.type = type}
    if (startDate) {where.startDate = startDate}
    if (!page)  {page = 1}
    if (!size)  {size = 20}
    size = Number(size);
    page = Number(page);

    size = size > 10 ? 10 : size
    page = page > 20 ? 20 : page
    let limit = Number(size);
    let offset = (page - 1) * size;
    let pagination = {limit,offset};

    const events = await Event.findAll({
        where,
        ...pagination,
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
    if (typeof capacity !== 'number')    {
        error.capacity = 'Capacity must be an integer'
    }
    let validPrice = price.toString().split('.')
    if (typeof price !== 'number' || validPrice[1].length > 2 || price < 0)  {
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

router.post('/:eventId/images', requireAuth, async (req,res) => {
    const {url, preview} = req.body;
    const eventId = parseInt(req.params.eventId);
    const userId = req.user.id;
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
    const attendee = await Attendance.findOne({
        where: {
            userId,
            eventId
        }
    })
    let {status} = group.Memberships[0] ? group.Memberships[0] : {status:null}
    if (userId === group.organizerId || status === 'Co-host' || (attendee && attendee.status === 'Attending'))    {
        let image = await EventImage.create({
            url,
            preview
        })
        await image.save()
        let pojo = image.toJSON()
        delete pojo.createdAt;
        delete pojo.updatedAt
        res.json(pojo)
    }
})

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
        let arr = [];
        let attendees = await User.findAll({
            include: {
                model:Attendance,
                attributes:['status'],
                where: {
                    eventId
                }
            }
        })
        for (let user of attendees)  {
            user.dataValues["Attendance"] = user.dataValues["Attendances"][0];
            delete  user.dataValues["Attendances"]
        }
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
    for (let user of attendees)  {
        user.dataValues["Attendance"] = user.dataValues["Attendances"][0];
        delete  user.dataValues["Attendances"]
    }
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
    const group = await Group.findByPk(event.groupId,{
        include: [{
            model: Membership,
            where: {groupId:event.groupId,userId},
            required:false
        }]
    })
    let {status} = group.Memberships[0] ? group.Memberships[0] : {status:null};
    if (userId !== group.organizerId && status !== 'Member' && status !== 'Co-host')    {
        res.status(403)
        res.json({message:'Forbidden'})
    }
    const attendance = await Attendance.findOne({
        where: {
            eventId,
            userId
        }
    })
    if (!attendance)    {
        const attending = await Attendance.create({
            eventId,
            userId,
            status:'Pending'
        })
        let pojo = attending.toJSON();
        delete pojo.createdAt
        delete pojo.updatedAt
        delete pojo.eventId
        return res.json(pojo)
    }
    if (attendance.status === 'Pending')    {
        res.status(400)
        return res.json({message:"Attendance has already been requested"})
    }
    if (attendance.status === 'Attending')  {
        res.status(400)
        return res.json({message:"User is already an attendee of the event"})
    }
    if (attendance.status === 'Waitlist')   {
        res.status(400)
        return res.json({message:"User is already on the waitlist of the event"})
    }
})

router.put('/:eventId/attendance', requireAuth, async(req,res) =>   {
    const userId = req.user.id;
    const eventId = parseInt(req.params.eventId);
    const event = await Event.findByPk(eventId)
    if (!event)   {
        res.status(404);
        return res.json({message:"Event couldn't be found"})
    };
    if (req.body.status === 'Pending')  {
        res.status(400);
        return res.json({message:"Cannot change an attendance status to pending"})
    }
    const attendance = await Attendance.findOne({
        where:{
            userId:req.body.userId,
            eventId
        },
        attributes:['id','eventId','userId','status']
    })
    if (!attendance)    {
        res.status(404)
        return res.json({message:"Attendance between the user and the event does not exist"})
    }
    const group = await Group.findByPk(event.groupId,{
        include: [{
            model: Membership,
            where: {groupId:event.groupId,userId},
            required:false
        }]
    })
    let {status} = group.Memberships[0] ? group.Memberships[0] : {status:null};
    if (userId === group.organizerId || status === 'Co-host')    {
        attendance.status = req.body.status
        await attendance.save()
        let pojo = attendance.toJSON()
        delete pojo.updatedAt
        res.json(pojo)
    }
})

router.delete('/:eventId/attendance', requireAuth, async(req,res) =>    {
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
    const attendance = await Attendance.findOne({
        where:{
            userId,
            eventId
        }
    })
    if (!attendance)    {
        res.status(404)
        return res.json({message:"Attendance does not exist for this User"})
    }
    if (userId === group.organizerId || userId === req.body.userId)    {
        await attendance.destroy()
        return res.json({messgae:"Successfully deleted attendance from event"})
    }
    res.status(403)
    return res.json({message:"Only the User or organizer may delete an Attendance"})
})

module.exports = router;
