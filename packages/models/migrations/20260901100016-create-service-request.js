'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('request-service', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: true
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
        allowNull: true
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
        type: Sequelize.TEXT,
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
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      urgency: {
        type: Sequelize.ENUM(
            'LOW',
            'NORMAL',
            'URGENT',
        ),
        allowNull: false
      },
      serviceMode: {
        type: Sequelize.ENUM(
            'online',
            'in_person',
            'both'
        ),
        allowNull: false
      },
      timePreference: {
        type: Sequelize.ENUM(
            'morning',
            'afternoon',
            'evening',
            'flexible'
        ),
        allowNull: true
      },
      deadline: {
        type: Sequelize.DATE,
        allowNull: true
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: true
      },
      clientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('request-service');
  }
};