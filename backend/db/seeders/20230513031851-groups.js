'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
        organizerId:1,
        name:'Ballers',
        about: 'We ball 24/7 and do nothing but win',
        type: 'In-person',
        private: true,
        city:'Vegas',
        state:'NV'
      },
      {
        organizerId:2,
        name:'Techs',
        about: 'We do tech stuff',
        type: 'Online',
        private: false,
        city:'L.A',
        state:'CA'
      },
      {
        organizerId:2,
        name:'Cars',
        about: 'We do car stuff',
        type: 'In-person',
        private: false,
        city:'Austin',
        state:'TX'
      }
    ],{})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options, {
      name: {[Op.in]:['Ballers','Cars','Techs']}
    }, {});
  }
};
