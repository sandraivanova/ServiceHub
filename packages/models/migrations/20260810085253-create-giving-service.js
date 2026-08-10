'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('giving_services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      providerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        },
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false
      },

      priceFrom: {
        type: Sequelize.FLOAT,
        allowNull: false
      },

      priceUnit: {
        type: Sequelize.ENUM('hour', 'project', 'square_meter', 'day'),
        allowNull: false
      },

      category: {
        type: Sequelize.ENUM('electrician', 'plumber', 'cleaning', 'painting', 'carpentry', 'other'),
        allowNull: false
      },

      location: {
        type: Sequelize.STRING,
        allowNull: false
      },

      description: {
        type: Sequelize.STRING,
        allowNull: false
      },

      yearsOfExperience: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      rating: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0
      },

      bookingCount: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },

      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },

      availability: {
        type: Sequelize.STRING,
        allowNull: true
      },

    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('giving_services');
  }
};