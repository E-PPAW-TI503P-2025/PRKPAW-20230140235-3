'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Presensis', 'checkOut', { // <-- huruf O besar
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Presensis', 'checkOut'); // <-- huruf O besar juga
  }
};
