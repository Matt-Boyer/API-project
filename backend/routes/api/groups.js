const express = require('express');
const router = express.Router();
const {requireAuth} = require('../../utils/auth');
const {Group, Membership, GroupImage,User,Venue, Sequelize} = require('../../db/models');

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
        const Op = Sequelize.Op;
        let num = await Membership.count({
            where: {
                groupId: group.id,
                status: {[Op.in]: ['Co-host', 'Member']}
            }
        });
        let {url} = group.GroupImages[0] ? group.GroupImages[0]: {url:null};
        let member = group.toJSON();
        member.previewImage = url;
        member.numMembers = num;
        delete member.GroupImages;
        arr.push(member);
    }
    return res.json(arr)
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
        pojo.numMembers = num;
        pojo.previewImage = url;
        delete pojo.GroupImages;
        result.push(pojo)
    };

    return res.json(result)
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
    pojo.numMembers = num
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
    return res.json(venues)
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

router.get('/"groupId/events', async (req, res) =>    {
    const groupId = parseInt(req.params.groupId);
    const group = await Group.findByPk(groupId);
    if (!group)   {
        res.status(404);
        return res.json({message:"Group couldn't be found"})
    };
    res.json(group)
})

module.exports = router;
