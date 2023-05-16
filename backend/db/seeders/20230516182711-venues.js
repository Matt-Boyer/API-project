'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        address: '123 Strawberry ln',
        city:'Las Vegas',
        state:'NV',
        lat:37.12341,
        lng:-147.1232345
      },
      {
        groupId: 2,
        address: '53 Jack Blvd',
        city:'L.A.',
        state:'CA',
        lat:87.23441,
        lng:-57.85453
      },
      {
        groupId: 3,
        address: '99 Bird St',
        city:'Austin',
        state:'TX',
        lat:98.48678,
        lng:58.9365
      },
      {
        groupId: 1,
        address: '76 Happy Ln',
        city:'Miami',
        state:'FL',
        lat:245.73632,
        lng:-21.45732457
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
