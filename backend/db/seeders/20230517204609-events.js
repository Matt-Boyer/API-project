'use strict';

const { sequelize } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        venueId:1,
        groupId:2,
        name:'Happy time',
        description:'Go have a great time',
        type:'Online',
        capacity:150,
        price:20.50,
        startDate:'2024-11-19 20:00:00',
        endDate:'2024-12-19 20:00:00'
      },
      {
        venueId:null,
        groupId:1,
        name:'Sad times',
        description:'You are going to have a sad time',
        type:'Online',
        capacity:12,
        price:350.00,
        startDate:'2023-06-19 20:00:00',
        endDate:'2023-06-28 20:00:00'
      },
      {
        venueId:2,
        groupId:3,
        name:'Who knows what is going to happen',
        description:'This event is completely random',
        type:'In-person',
        capacity:43,
        price:18.00,
        startDate:'2023-09-01 20:00:00',
        endDate:'2023-09-06 20:00:00'
      },
      {
        venueId:1,
        groupId:2,
        name:'Super tall day',
        description:'All tall people, all day',
        type:'In-person',
        capacity:1503,
        price:203.50,
        startDate:'2024-02-19 20:00:00',
        endDate:'2024-02-21 20:00:00'
      }
    ],{})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options, {
      groupId: {[Op.in]:[1,2,3]}
    }, {});
  }
};
