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
        url:'https://assets.cyllenius.com/media/gVWCpe0hLXDkYYuk.webp',
        preview:true
      },
      {
        eventId:2,
        url:'https://eventective-media.azureedge.net/3149776_lg.jpg',
        preview:true
      },
      {
        eventId:3,
        url:'https://www.eventbrite.co.uk/blog/wp-content/uploads/2022/09/dance-event.jpg',
        preview:true
      },
      {
        eventId:3,
        url:'https://www.aleitevents.com/wp-content/uploads/2019/02/Zeits-Ocular-100-scaled.jpg',
        preview:false
      },
      {
        eventId:1,
        url:'https://www.downtownknoxville.org/lib/image/thumbs/DowntownKnoxvilleEvents_2022_KnoxAsianFestival_10000_512_fill.jpg',
        preview:true
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
