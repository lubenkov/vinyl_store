'use strict';

module.exports = {
    async up(queryInterface) {
        const apiKey = process.env.DISCOGS_KEY;
        const apiSecret = process.env.DISCOGS_SECRET;

        if (!apiKey || !apiSecret) {
            throw new Error(
                'DISCOGS_KEY and DISCOGS_SECRET environment variables are required to run this seeder'
            );
        }

        const vinylRecords = [];
        const baseUrl = 'https://api.discogs.com/releases/';

        let attempts = 0;

        for (let i = 1; vinylRecords.length < 50 && attempts < 1000; i++) {
            try {
                const response = await fetch(
                    `${baseUrl}${i}?key=${apiKey}&secret=${apiSecret}`
                );

                if (response.status === 404) {
                    console.log(`Vinyl ${i} not found (404). Skipping...`);
                    attempts++;
                    continue;
                }
                if (!response.ok) {
                    console.error(
                        `Error fetching data for Vinyl ${i}: HTTP ${response.status}`
                    );
                    attempts++;
                    continue;
                }

                const data = await response.json();

                if (data.lowest_price && data.lowest_price < 0.5) {
                    console.log(
                        `Vinyl ${i} skipped due to low price: ${data.lowest_price}`
                    );
                    attempts++;
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
                console.error(`Error fetching data for Vinyl ${i}:`, error);
            }
            attempts++;
        }
        await queryInterface.bulkInsert('vinyls', vinylRecords);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete('vinyls', null, {});
    },
};
