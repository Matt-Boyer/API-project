const express = require('express');
const router = express.Router();
const {requireAuth} = require('../../utils/auth');
const {Group, Membership, GroupImage,User,Venue} = require('../../db/models');

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
                groupId: group.id
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
        res.json({message:"Group couldn't be found"})
    }
    const num = await Membership.count({
        where: {
            groupId
        }
    });
    let pojo = group.toJSON();
    if (pojo.Users[0])  {
        let {id, firstName, lastName} = pojo.Users[0];
        pojo.Organizer = {id,firstName,lastName}
    }
    delete pojo.Users;
    pojo.numMembers = num
    res.json(pojo)
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
    res.json(group)
});

router.post('/:groupId/images', (req, res) =>   {
    
})

module.exports = router;
