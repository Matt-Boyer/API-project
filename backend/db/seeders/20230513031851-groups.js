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
        name:'Ballers',
        about: 'We ball 24/7 and do nothing but win',
        type: 'placeholder',
        private: true,
        city:'Vegas',
        state:'NV'
      },
      {
        name:'Techs',
        about: 'We do tech stuff',
        type: 'placeholder1',
        private: false,
        city:'L.A',
        state:'CA'
      },
      {
        name:'Cars',
        about: 'We do car stuff',
        type: 'placeholder',
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
