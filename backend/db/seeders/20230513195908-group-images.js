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
        url:'pic',
        preview:true
      },
      {
        groupId:1,
        url:'pic',
        preview:false
      },
      {
        groupId:2,
        url:'pic',
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
