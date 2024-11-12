'use strict';
const axios = require('axios');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const vinylRecords = [];
        const baseUrl = 'https://api.discogs.com/releases/';
        const apiKey = 'GXXHJbjzFzfXAdcrOWHv';
        const apiSecret = 'WQLRWZsRIykVmAvoEQUrQcouAYqeElap';

        let attempts = 0;

        for (let i = 1; vinylRecords.length < 50 && attempts < 1000; i++) {
            try {
                const response = await axios.get(
                    `${baseUrl}${i}?key=${apiKey}&secret=${apiSecret}`
                );
                const data = response.data;

                if (data.lowest_price && data.lowest_price < 0.5) {
                    console.log(
                        `Vinyl ${i} skipped due to low price: ${data.lowest_price}`
                    );
                    continue;
                }
                vinylRecords.push({
                    name: data.title || `Vinyl ${i}`,
                    author: data.artists
                        ? data.artists.map((artist) => artist.name).join(', ')
                        : `Artist ${i}`,
                    description: data.notes || `Description for Vinyl ${i}.`,
                    price:
                        data.lowest_price ||
                        parseFloat((20 + Math.random() * 20).toFixed(2)),
                    image:
                        data.images && data.images.length > 0
                            ? data.images[0].uri
                            : `vinyl-${i}.jpg`,
                });
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log(`Vinyl ${i} not found (404). Skipping...`);
                } else {
                    console.error(`Error fetching data for Vinyl ${i}:`, error);
                }
            }
            attempts++;
        }
        await queryInterface.bulkInsert('vinyls', vinylRecords);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('vinyls', null, {});
    },
};
