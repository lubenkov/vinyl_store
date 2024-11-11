'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const vinylRecords = [];

        for (let i = 1; i <= 50; i++) {
            vinylRecords.push({
                name: `Vinyl ${i}`,
                author: `Artist ${i}`,
                description: `Description for Vinyl ${i}.`,
                price: parseFloat((20 + Math.random() * 20).toFixed(2)),
                image: `vinyl-${i}.jpg`,
            });
        }

        await queryInterface.bulkInsert('vinyls', vinylRecords);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('vinyls', null, {});
    },
};
