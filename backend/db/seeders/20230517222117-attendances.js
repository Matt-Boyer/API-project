'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    return queryInterface.bulkInsert(options, [
      {
        eventId:1,
        userId:1,
        status:'Attending'
      },
      {
        eventId:2,
        userId:3,
        status:'Waitlist'
      },{
        eventId:3,
        userId:1,
        status:'Pending'
      },{
        eventId:2,
        userId:2,
        status:'Attending'
      }
    ],{})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options, {
      userId: {[Op.in]:[1,2,3]}
    }, {});
  }
};
