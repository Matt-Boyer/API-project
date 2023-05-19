const express = require('express');
const router = express.Router();
const {requireAuth} = require('../../utils/auth');
const {Attendance, EventImage,Group, Membership, GroupImage,User,Venue, Sequelize,Event} = require('../../db/models');
const Op = Sequelize.Op;

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
                groupId: group.id,
                status: {[Op.in]: ['Co-host', 'Member']}
            }
        });
        let {url} = group.GroupImages[0] ? group.GroupImages[0]: {url:null};
        let member = group.toJSON();
        member.previewImage = url;
        member.numMembers = num +1;
        delete member.GroupImages;
        arr.push(member);
    }
    return res.json({Groups:arr})
})

router.get('/current',requireAuth,async (req, res) => {
    const userId = req.user.id;
    let groups = await Group.findAll({
        include: {
            model:GroupImage,
            where: {preview:true},
            attributes:['url'],
            required:false
        },
        where: {
            organizerId: userId,
        }
    });
    let member = await Group.findAll({
        include: [{
            model:Membership,
            where:{
                userId,
            },
            attributes: []
        },
        {
            model:GroupImage,
            where:{preview:true},
            attributes:['url']
        }]
    })
    let result = [];
    let arr = [...groups,...member];
    for (let group of arr) {
        let num = await Membership.count({
            where: {
                groupId: group.id,
                status: {[Op.in]: ['Co-host', 'Member']}
            }
        });
        let {url} = group.GroupImages[0] ? group.GroupImages[0] : {url:null}
        let pojo = group.toJSON();
        pojo.numMembers = num +1;
        pojo.previewImage = url;
        delete pojo.GroupImages;
        result.push(pojo)
    };

    return res.json({Groups:result})
})

router.get('/:groupId', async (req, res) =>    {
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId,{
        include: [{
            model: GroupImage,
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'groupId']
            }
        },{
            model: User,
            attributes: ['id','firstName','lastName'],
        },{
            model: Venue,
            attributes: {
                exclude: ['createdAt','updatedAt']
            }
        }]
    });
    if (group === null) {
        res.status(404)
        return res.json({message:"Group couldn't be found"})
    }
    const num = await Membership.count({
        where: {
            groupId,
            status: {[Op.in]: ['Co-host', 'Member']}
        }
    });
    let pojo = group.toJSON();
    if (pojo.Users[0])  {
        let {id, firstName, lastName} = pojo.Users[0];
        pojo.Organizer = {id,firstName,lastName}
    }
    delete pojo.Users;
    pojo.numMembers = num + 1
    return res.json(pojo)
})

const validate = (name, about, type, private, city, state) => {
    let error = {};
    if (name.length > 60)   {
        error.name = "Name must be 60 characters or less"
    }
    if (about < 50)  {
        error.about = "About must be 50 characters or more"
    }
    if (type !== 'Online' && type !== 'In-person')   {
        error.type = "Type must be 'Online' or 'In-person'"
    }
    if (private !== true && private !== false)  {
        error.private = 'Private must be a boolean'
    }
    if (city === ''|| city === null || city === undefined)    {
        error.city = 'City is required'
    }
    if (state === '' || state === null || state === undefined)  {
        error.state = "State is required"
    }
    if (Object.values(error).length > 0)   {
        return error
    }
}

router.post('/', requireAuth, async(req,res) =>   {
    const organizerId = req.user.id;
    const {name, about, type, private, city, state} = req.body;
    const error = validate(name, about, type, private, city, state)
    const group = await Group.create({
        organizerId,
        name,
        about,
        type,
        private,
        city,
        state
    });
    if (error)  {
        res.status(400)
        return res.json(error)
    }
    res.status(201);
    return res.json(group)
});

router.post('/:groupId/images', requireAuth, async(req, res) =>   {
    const groupId = parseInt(req.params.groupId);
    const {url, preview} = req.body;
    const group = await Group.findByPk(groupId);
    if (!group) {
        res.status(404);
        return res.json({message:"Group couldn't be found"})
    }
    if (req.user.id !== group.organizerId)    {
        res.status(403)
        return res.json({message:"Forbidden"})
    }
    const image = await GroupImage.create({
        groupId,
        url,
        preview
    })
    let pojo = image.toJSON();
    delete pojo.createdAt,
    delete pojo.updatedAt,
    delete pojo.groupId
    return res.json(pojo)
});

router.put('/:groupId', requireAuth, async(req,res) =>  {
    const userId = req.user.id;
    const {name, about, type, private, city, state} = req.body;
    const groupId = parseInt(req.params.groupId);
    let error = validate(name, about, type, private, city, state);
    if (error)  {
        res.status(400);
        return res.json(error)
    }
    let group = await Group.findByPk(groupId);
    if (!group) {
        res.status(404);
        return res.json({message:"Group couldn't be found"})
    };
    if (userId !== group.organizerId)   {
        res.status(403)
        return res.json({message:"Forbidden"})
    }
    if (name)   {group.name = name};
    if (about)  {group.about = about};
    if (type)   {group.type = type};
    if (private)    {group.private = private};
    if (city)   {group.city = city};
    if (state)  {group.state = state};

    await group.save()
    return res.json(group)
})

router.delete('/:groupId', requireAuth, async(req, res) =>     {
    const userId = req.user.id;
    const groupId = parseInt(req.params.groupId);
    let group = await Group.findByPk(groupId);
    if (!group)   {
        res.status(404);
        return res.json({message:"Group couldn't be found"})
    };
    if (userId !== group.organizerId)   {
        res.status(403)
        return res.json({message:"Forbidden"})
    };
    await group.destroy();
    return res.json({message: "Successfully deleted"})
})

router.get('/:groupId/venues', requireAuth, async (req,res) =>  {
    const userId = req.user.id;
    const groupId = parseInt(req.params.groupId);
    const group = await Group.findByPk(groupId,{
        include: [{
            model: Membership,
            where: {groupId,userId},
            required:false
        }]
    });
    if (!group)   {
        res.status(404);
        return res.json({message:"Group couldn't be found"})
    };
    let {status} = group.Memberships[0] ? group.Memberships[0] : {status:null}
    if (userId !== group.organizerId && status !== 'Co-host')   {
        res.status(403)
        return res.json({message:"Forbidden"})
    }
    const venues = await Venue.findAll({
        where: {
            groupId,
        },
        attributes: {
            exclude:['createdAt','updatedAt']
        }
    });
    return res.json({Venues:venues})
});

const validateVenue = (address, city, state, lat, lng) => {
    let error = {};
    if (address === '' || address === null || address === undefined)   {
        error.address = "Street address is required"
    }
    if (Number.isNaN(lat))  {
        error.lat = "Latitude is not valid"
    }
    if (Number.isNaN(lng))   {
        error.lng = "Longitude is not valid"
    }
    if (city === ''|| city === null || city === undefined)    {
        error.city = 'City is required'
    }
    if (state === '' || state === null || state === undefined)  {
        error.state = "State is required"
    }
    if (Object.values(error).length > 0)   {
        return error
    }
}


router.post('/:groupId/venues', requireAuth, async(req, res) =>  {
    const userId = req.user.id;
    const groupId = parseInt(req.params.groupId);
    const {address, city, state, lat, lng} = req.body
    let error = validateVenue(address, city, state, lat, lng);
    if (error)  {
        res.status(400);
        return res.json(error)
    }
    const group = await Group.findByPk(groupId,{
        include: [{
            model: Membership,
            where: {groupId,userId},
            required:false
        }]
    });
    if (!group)   {
        res.status(404);
        return res.json({message:"Group couldn't be found"})
    };
    let {status} = group.Memberships[0] ? group.Memberships[0] : {status:null}
    if (userId !== group.organizerId && status !== 'Co-host')   {
        res.status(403)
        return res.json({message:"Forbidden"})
    };
    let venue = await Venue.create({
        groupId,address,city,state,lat,lng
    });
    await venue.save();
    res.json(venue)
});

router.get('/:groupId/events', async (req, res) =>    {
    const groupId = parseInt(req.params.groupId);
    const group = await Group.findByPk(groupId);
    if (!group)   {
        res.status(404);
        return res.json({message:"Group couldn't be found"})
    };
    let arr = [];
    const events = await Event.findAll({
        where: {
            groupId
        },
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
    if (Number.isNaN(price) || validPrice[1].length > 2)  {
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

router.post('/:groupId/events', requireAuth, async(req,res) =>   {
    const userId = req.user.id;
    const groupId = parseInt(req.params.groupId);
    const {venueId,name,type,capacity,price,description,startDate,endDate} = req.body;
    let error = await validateEvent(venueId,name,type,capacity,price,description,startDate,endDate);
    const group = await Group.findByPk(groupId,{
        include: [{
            model: Membership,
            where: {groupId,userId},
            required:false
        }]
    })
    if (!group)   {
        res.status(404);
        return res.json({message:"Group couldn't be found"})
    };
    let {status} = group.Memberships[0] ? group.Memberships[0] : {status:null}
    if (userId !== group.organizerId && status !== 'Co-host')   {
        res.status(403)
        return res.json({message:"Forbidden"})
    };
    if (error)  {
        res.status(400);
        return res.json(error)
    }
    let event = await Event.create({
        groupId,venueId,name,type,capacity,price,description,startDate,endDate
    });
    await event.save();
    let pojo = event.toJSON()
    delete pojo.createdAt;
    delete pojo.updatedAt
    res.json(pojo)
})

router.get('/:groupId/members', async(req,res) =>   {
    const userId = req.user.id;
    const groupId = parseInt(req.params.groupId);
    const group = await Group.findByPk(groupId,{
        include: [{
            model: Membership,
            where: {groupId,userId},
            required:false
        }]
    })
    if (!group)   {
        res.status(404);
        return res.json({message:"Group couldn't be found"})
    };
    let {status} = group.Memberships[0] ? group.Memberships[0] : {status:null}
    if (userId === group.organizerId || status === 'Co-host')   {
        const members = await User.findAll({
            include: {
                model:Membership,
                attributes:['status'],
                where: {groupId}
            }
        })
        return res.json({Members:members})
    };
    const members1 = await User.findAll({
        include: {
            model:Membership,
            where: {groupId, status:{[Op.in]:['Member', 'Co-host']}},
            attributes:['status']
        }
    })
    return res.json({Members:members1})
})

router.post('/:groupId/membership', requireAuth, async(req,res) => {
    const userId = req.user.id;
    const groupId = parseInt(req.params.groupId);
    const group = await Group.findByPk(groupId)
    if (!group)   {
        res.status(404);
        return res.json({message:"Group couldn't be found"})
    };
    const membership = await Membership.findOne({
        where:{groupId,userId}
    })
    if (!membership)    {
        const pendingMember = await Membership.create({
            userId,
            groupId,
            status:'Pending'
        })
        pendingMember.save()
        return res.json({memberId:userId,status:'Pending'})
    }
    if (membership.status === 'Pending')    {
        res.status(400)
        return res.json({message: "Membership has already been requested"})
    }
    if (membership.status === 'Co-host' || membership.status === 'Member')  {
        res.status(400)
        return res.json({message: "User is already a member of the group"})
    }
})

router.put('/:groupId/membership', requireAuth, async(req,res) =>   {
    const userId = req.user.id;
    const groupId = parseInt(req.params.groupId);
    const group = await Group.findByPk(groupId,{
        include: [{
            model: Membership,
            where: {groupId,userId},
            required:false
        }]
    })
    if (!group)   {
        res.status(404);
        return res.json({message:"Group couldn't be found"})
    };
    const user = await User.findByPk(req.body.memberId);
    if (!user)  {
        res.status(400)
        return res.json({message: "Validations Error",errors: {memberId: "User couldn't be found"}})
    }
    if (req.body.status === 'Pending')  {
        res.status(400)
        return res.json({message: "Validations Error",errors: {status : "Cannot change a membership status to pending" }})
    }
    let {status} = group.Memberships[0] ? group.Memberships[0] : {status:null}
    let member = await Membership.findOne({
        where: {
            groupId,
            userId:req.body.memberId,
        },
        attributes:['id','groupId','userId','status']
    })
    if (!member)    {
        res.status(400)
        return res.json({message: "Membership between the user and the group does not exist"})
    }
    if (userId === group.organizerId)   {
        member.status = req.body.status
        await member.save()
        let pojo = member.toJSON()
        delete pojo.updatedAt
        return res.json(pojo)
    };
    if (status === 'Co-host' && req.body.status === 'Member' && member.status === 'Pending')  {
        member.status = req.body.status
        await member.save()
        let pojo = member.toJSON()
        delete pojo.updatedAt
        return res.json(pojo)
    }
    res.status(403)
    res.json({message:'Forbidden'})
})

router.delete('/:groupId/membership', requireAuth, async(req,res) =>    {
    const userId = req.user.id;
    const groupId = parseInt(req.params.groupId);
    const group = await Group.findByPk(groupId)
    if (!group)   {
        res.status(404);
        return res.json({message:"Group couldn't be found"})
    };
    if (userId !== group.oragnizerId && userId !== req.body.memberId)   {
        res.status(403)
        return res.json({message:'Forbidden'})
    }
    const user = await User.findByPk(req.body.memberId)
    if (!user)  {
        res.status(400)
        return res.json({message:"Validation Error",errors:{memberId:"User couldn't be found"}})
    }
    const membership = await Membership.findOne({
        where: {
            userId:req.body.memberId,
            groupId
        }
    })
    if (!membership)    {
        res.status(404)
        return res.json({message:"Membership does not exist for this User"})
    }
    await membership.destroy()
    res.json({message:"Successfully deleted membership from group"})
})

module.exports = router;
