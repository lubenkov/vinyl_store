'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            firstName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            lastName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            role: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'user',
            },
            birthdate: {
                type: Sequelize.DATE,
            },
            avatar: {
                type: Sequelize.STRING,
            },
        });

        await queryInterface.createTable('vinyls', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            author: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            image: {
                type: Sequelize.STRING,
            },
        });

        await queryInterface.createTable('purchases', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            vinylId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'vinyls',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            status: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        });

        await queryInterface.createTable('reviews', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            score: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            vinylId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'vinyls',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        });

        await queryInterface.createTable('logs', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            action: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            timestamp: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('reviews');
        await queryInterface.dropTable('purchases');
        await queryInterface.dropTable('vinyls');
        await queryInterface.dropTable('users');
        await queryInterface.dropTable('logs');
    },
};
