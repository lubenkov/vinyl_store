'use strict';

const DEMO_VINYLS = [
    {
        name: 'Kind of Blue',
        author: 'Miles Davis',
        description:
            'Эталонный модальный джаз 1959 года: спокойные, воздухастые импровизации и идеальный состав.',
        price: 29.99,
        image: '',
    },
    {
        name: 'Abbey Road',
        author: 'The Beatles',
        description:
            'Последний студийный альбом группы с легендарным попурри на второй стороне.',
        price: 34.99,
        image: '',
    },
    {
        name: 'The Dark Side of the Moon',
        author: 'Pink Floyd',
        description:
            'Концептуальная классика о времени, деньгах и безумии; один из самых продаваемых альбомов в истории.',
        price: 32.99,
        image: '',
    },
    {
        name: 'Rumours',
        author: 'Fleetwood Mac',
        description:
            'Мягкий калифорнийский рок с безупречными вокальными гармониями и хитами на каждой стороне.',
        price: 27.99,
        image: '',
    },
    {
        name: 'Blue Train',
        author: 'John Coltrane',
        description:
            'Хард-боп шедевр: мощный тенор-саксофон, блюзовая энергия и запоминающиеся темы.',
        price: 31.5,
        image: '',
    },
    {
        name: 'Nevermind',
        author: 'Nirvana',
        description:
            'Альбом, который вывел гранж в мейнстрим и изменил звучание рок-музыки девяностых.',
        price: 28.99,
        image: '',
    },
    {
        name: 'Thriller',
        author: 'Michael Jackson',
        description:
            'Поп-пластинка эпохи: танцевальные хиты, безупречный продакшн и влияние на десятилетия вперёд.',
        price: 26.99,
        image: '',
    },
    {
        name: 'The Queen Is Dead',
        author: 'The Smiths',
        description:
            'Остроумный и меланхоличный инди-рок с гитарными линиями Джонни Марра.',
        price: 24.99,
        image: '',
    },
    {
        name: 'Homogenic',
        author: 'Björk',
        description:
            'Электроника, струнные и вокал, сплетённые в холодный и эмоциональный звуковой ландшафт.',
        price: 33.5,
        image: '',
    },
    {
        name: 'In Rainbows',
        author: 'Radiohead',
        description:
            'Тёплый, интимный и ритмически сложный альбом, один из самых доступных у группы.',
        price: 30,
        image: '',
    },
    {
        name: 'Discovery',
        author: 'Daft Punk',
        description:
            'Французский хаус и диско, собранные в яркий, ностальгический и танцевальный опус.',
        price: 29.99,
        image: '',
    },
    {
        name: 'Selected Ambient Works 85-92',
        author: 'Aphex Twin',
        description:
            'Ранний эмбиент-техно манифест: мягкие пульсации и мечтательные мелодии.',
        price: 35,
        image: '',
    },
    {
        name: 'The Chronic',
        author: 'Dr. Dre',
        description:
            'Западный хип-хоп с фирменным G-funk-звучанием и плотной работой продюсера.',
        price: 27.5,
        image: '',
    },
    {
        name: 'Illmatic',
        author: 'Nas',
        description:
            'Классика нью-йоркского хип-хопа: точные тексты, сэмплы и атмосфера Куинса.',
        price: 29,
        image: '',
    },
    {
        name: 'Back to Black',
        author: 'Amy Winehouse',
        description:
            'Душевный соул с ретро-аранжировками и пронзительным вокалом.',
        price: 26.5,
        image: '',
    },
    {
        name: 'Grace',
        author: 'Jeff Buckley',
        description:
            'Единственный прижизненный студийный альбом: хрупкий вокал, рок и эмоциональная глубина.',
        price: 28,
        image: '',
    },
    {
        name: 'London Calling',
        author: 'The Clash',
        description:
            'Панк, ска, регги и рок-н-ролл в одном энергичном двойном альбоме.',
        price: 31,
        image: '',
    },
    {
        name: 'Purple Rain',
        author: 'Prince',
        description:
            'Поп, фанк и рок с кинематографичным размахом и одним из самых узнаваемых саундтреков.',
        price: 25.99,
        image: '',
    },
    {
        name: 'The Suburbs',
        author: 'Arcade Fire',
        description:
            'Ностальгический инди-рок о взрослении, пригороде и потере привычного мира.',
        price: 27,
        image: '',
    },
    {
        name: 'Currents',
        author: 'Tame Impala',
        description:
            'Психоделический поп с грувовыми басами, синтезаторами и меланхоличной атмосферой.',
        price: 32,
        image: '',
    },
    {
        name: 'Blonde',
        author: 'Frank Ocean',
        description:
            'Минималистичный R&B с воздушными аранжировками и очень личным настроением.',
        price: 38,
        image: '',
    },
    {
        name: 'OK Computer',
        author: 'Radiohead',
        description:
            'Альтернативный рок конца девяностых: тревога, гитарные текстуры и большие мелодии.',
        price: 30,
        image: '',
    },
    {
        name: 'Bitches Brew',
        author: 'Miles Davis',
        description:
            'Электрический джаз-фьюжн с плотными грувами и свободной импровизацией.',
        price: 34,
        image: '',
    },
    {
        name: 'The Köln Concert',
        author: 'Keith Jarrett',
        description:
            'Импровизационный сольный фортепианный концерт, записанный в Кёльне в 1975 году.',
        price: 36,
        image: '',
    },
];

module.exports = {
    async up(queryInterface) {
        const [rows] = await queryInterface.sequelize.query(
            'SELECT COUNT(*) AS count FROM vinyls'
        );

        if (Number(rows[0].count) > 0) {
            console.log('Vinyls already exist, skipping static demo seed.');
            return;
        }

        await queryInterface.bulkInsert('vinyls', DEMO_VINYLS);
        console.log(`Inserted ${DEMO_VINYLS.length} static demo vinyls.`);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('vinyls', null, {});
    },
};
