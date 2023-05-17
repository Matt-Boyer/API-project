'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Membership.belongsTo(models.Group, {
        foreignKey:'groupId',
        onDelete:'CASCADE'
      })
    }
  }
  Membership.init({
    userId: {
      type:DataTypes.INTEGER,
      onDelete:'CASCADE'
    },
    groupId: {
      type:DataTypes.INTEGER,
      onDelete:'CASCADE'
    },
    status: DataTypes.ENUM('Co-host','Member','Pending')
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};
