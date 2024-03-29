'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    return queryInterface.bulkInsert(options, [
      {
        userId:1,
        groupId:2,
        status:'Co-host'
      },
      {
        userId:1,
        groupId:1,
        status:'Member'
      },
      {
        userId:3,
        groupId:2,
        status:"Pending"
      },
      {
        userId:3,
        groupId:3,
        status:"Co-host"
      }
    ],{})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options, {
      userId: {[Op.in]:[1,2,3]}
    }, {});
  }
};
