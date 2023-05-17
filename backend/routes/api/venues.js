const express = require('express');
const router = express.Router();
const {requireAuth} = require('../../utils/auth');
const {Group, Membership, GroupImage,User,Venue, Sequelize} = require('../../db/models');

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

router.put('/:venueId', requireAuth, async (req, res) => {
    const {address, city, state, lat, lng} = req.body;
    let error = validateVenue(address, city, state, lat, lng);
    if (error) {
        res.status(400);
        return res.json(error)
    }
    const venueId = parseInt(req.params.venueId);
    const userId = req.user.id;
    const venue = await Venue.findByPk(venueId,{
        attributes: {
            exclude:['createdAt','updatedAt']
        }
    });
    const group = await Group.findByPk(venue.groupId,{
        include: [{
            model: Membership,
            where: {
                groupId: venue.groupId,
                userId
            },
            required:false
        }]
    })
    let {status} = group.Memberships[0] ? group.Memberships[0] : {status:null}
    if (userId !== group.organizerId && status !== 'Co-host') {
        res.status(403)
        return res.json({message:"Forbidden"})
    };
    if (address)    {venue.address = address};
    if (city)   {venue.city = city};
    if (state) {venue.state = state};
    if (lat) {venue.lat = lat};
    if (lng) {venue.lng = lng};
    await venue.save()
    res.json(venue)
})


module.exports = router;
