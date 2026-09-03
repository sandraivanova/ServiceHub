'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user', 'resetPasswordToken', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('user', 'resetPasswordExpires', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user', 'resetPasswordToken');
    await queryInterface.removeColumn('user', 'resetPasswordExpires');
  }
};