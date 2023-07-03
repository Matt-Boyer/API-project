'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    return queryInterface.bulkInsert(options, [
      {
        groupId:1,
        url:'https://images.squarespace-cdn.com/content/v1/58d3c8dd46c3c41b05ec3064/1614436768432-JQ0O4Y1AAIRRHO1I4GYQ/Dark+Ride.jpg?format=2500w',
        preview:true
      },
      {
        groupId:1,
        url:'https://nationaltoday.com/wp-content/uploads/2020/01/Fun-at-Work-1.jpg',
        preview:false
      },
      {
        groupId:2,
        url:'https://bullwinkles.com/content/uploads/2023/01/Bullwinkles108_small.jpg',
        preview:true
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options, {
      groupId: {[Op.in]: [1,2]}
    },{})
  }
};
