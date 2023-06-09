'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    return queryInterface.bulkInsert(options, [
      {
        eventId:1,
        url:'https://example.com',
        preview:true
      },
      {
        eventId:2,
        url:'https://example.com',
        preview:true
      },
      {
        eventId:3,
        url:'https://example.com',
        preview:true
      },
      {
        eventId:3,
        url:'https://example.com',
        preview:false
      },
      {
        eventId:1,
        url:'https://example.com',
        preview:false
      }
    ],{})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options, {
      eventId: {[Op.in]:[1,2,3]}
    }, {});
  }
};
