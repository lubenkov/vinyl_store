'use strict';

const { DEMO_COVERS } = require('../config/demo-covers');

module.exports = {
    async up(queryInterface) {
        let updated = 0;
        let skipped = 0;

        for (const cover of DEMO_COVERS) {
            const [rows] = await queryInterface.sequelize.query(
                `SELECT COUNT(*) AS count
                   FROM vinyls
                  WHERE name = :name
                    AND author = :author
                    AND (image IS NULL OR image = '')`,
                {
                    replacements: {
                        name: cover.name,
                        author: cover.author,
                    },
                }
            );

            if (Number(rows[0].count) === 0) {
                skipped += 1;
                continue;
            }

            await queryInterface.sequelize.query(
                `UPDATE vinyls
                    SET image = :image
                  WHERE name = :name
                    AND author = :author
                    AND (image IS NULL OR image = '')`,
                {
                    replacements: {
                        image: cover.image,
                        name: cover.name,
                        author: cover.author,
                    },
                }
            );

            updated += 1;
        }

        console.log(
            `Backfilled covers for ${updated} demo vinyls; skipped ${skipped}.`
        );
    },

    async down(queryInterface) {
        for (const cover of DEMO_COVERS) {
            await queryInterface.sequelize.query(
                `UPDATE vinyls
                    SET image = ''
                  WHERE name = :name
                    AND author = :author
                    AND image = :image`,
                {
                    replacements: {
                        image: cover.image,
                        name: cover.name,
                        author: cover.author,
                    },
                }
            );
        }
    },
};
