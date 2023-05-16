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
        res.status = 404
        res.json({message:"Group couldn't be found"})
    }
    const num = await Membership.count({
        where: {
            groupId
        }
    });
    let pojo = group.toJSON();
    let {id, firstName, lastName} = pojo.Users[0];
    delete pojo.Users;
    pojo.Organizer = {id,firstName,lastName}
    pojo.numMembers = num
    res.json(pojo)
})

module.exports = router;
