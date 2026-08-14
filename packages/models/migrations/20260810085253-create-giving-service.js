'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('giving_service', {
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

      price: {
        type: Sequelize.FLOAT,
        allowNull: false
      },

      priceUnit: {
        type: Sequelize.ENUM(
            'HOUR',
            'PROJECT',
            'SQUARE_METER',
            'DAY',
            'WEEK',
            'MONTH',
            'PIECE',
            'LINEAR_METER',
            'SESSION',
            'PER_KM'
        ),
        allowNull: false
      },

      category: {
        type: Sequelize.ENUM(
            'ELECTRICIAN',
            'PLUMBER',
            'CLEANING',
            'PAINTING',
            'CARPENTRY',
            'CONSTRUCTION',
            'HVAC',
            'APPLIANCE_REPAIR',
            'GARDENING',
            'TAILORING',
            'TRANSPORT',
            'LOCKSMITH',
            'EDUCATION',
            'IT_SERVICES',
            'OTHER'
        ),
        allowNull: false
      },

      location: {
        type: Sequelize.ENUM(
            'BEROVO',
            'BITOLA',
            'BOGDANCI',
            'DELCEVO',
            'DEMIR_HISAR',
            'DEMIR_KAPIJA',
            'DEBAR',
            'DOJRAN',
            'GEVGELIJA',
            'GOSTIVAR',
            'KAVADARCI',
            'KICEVO',
            'KOCANI',
            'KRATOVO',
            'KRIVA_PALANKA',
            'KRUSEVO',
            'KUMANOVO',
            'MAKEDONSKA_KAMENICA',
            'MAKEDONSKI_BROD',
            'OHRID',
            'OTHER',
            'PEHCEVO',
            'PRILEP',
            'PROBISTIP',
            'RADOVIS',
            'RESEN',
            'SKOPJE',
            'STIP',
            'STRUMICA',
            'STRUGA',
            'TETOVO',
            'VALANDOVO',
            'VELES',
            'VINICA'
        ),
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
    await queryInterface.dropTable('giving_service');
  }
};