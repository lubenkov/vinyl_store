'use strict';

// Cover art from Discogs for the static demo catalog. The release id is kept
// for traceability: https://www.discogs.com/release/<releaseId>
const DEMO_COVERS = [
    {
        author: 'Miles Davis',
        name: 'Kind of Blue',
        releaseId: 1353040,
        image: 'https://i.discogs.com/dkxa2jVrsp5HSq67cflBYKmWddIB0iDUQEoTWCf-mxs/rs:fit/g:sm/q:90/h:595/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEzNTMw/NDAtMTI1MjEzOTQ2/NC5qcGVn.jpeg',
    },
    {
        author: 'The Beatles',
        name: 'Abbey Road',
        releaseId: 24502013,
        image: 'https://i.discogs.com/fmcWF1KDgW-J1okOW8M8Bk3ywOrO7eugUUTOQdW6K04/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI0NTAy/MDEzLTE2NjMwODA2/MzctNTQ1Mi5qcGVn.jpeg',
    },
    {
        author: 'Pink Floyd',
        name: 'The Dark Side of the Moon',
        releaseId: 929153,
        image: 'https://i.discogs.com/PaTQ70mJ4D-3hEygLRKp5ZmxCxcXxmggGv69E-dF2v8/rs:fit/g:sm/q:90/h:595/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTkyOTE1/My0xNzQwOTM4Mjc3/LTY2ODQuanBlZw.jpeg',
    },
    {
        author: 'Fleetwood Mac',
        name: 'Rumours',
        releaseId: 8115306,
        image: 'https://i.discogs.com/kgMoar1HolCZKuA19mYTOiXgwr68fnR6qpTaAGuPIrA/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTgxMTUz/MDYtMTQ1NTQyMzY0/My05NDI5LmpwZWc.jpeg',
    },
    {
        author: 'John Coltrane',
        name: 'Blue Train',
        releaseId: 2997953,
        image: 'https://i.discogs.com/n4ULipGxEO7mjqeZQtZHoO3arSrGg3IwDnWQJHz52Vw/rs:fit/g:sm/q:90/h:593/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI5OTc5/NTMtMTY2MzE1ODkx/MC0zMzYyLmpwZWc.jpeg',
    },
    {
        author: 'Nirvana',
        name: 'Nevermind',
        releaseId: 4485245,
        image: 'https://i.discogs.com/2KT2yljoksF7lj8jkfeJGwXdS4H6ip5ytIGqRMoZ-oE/rs:fit/g:sm/q:90/h:600/w:594/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQ0ODUy/NDUtMTQ1MDQ4NTkz/OC0xMDMwLmpwZWc.jpeg',
    },
    {
        author: 'Michael Jackson',
        name: 'Thriller',
        releaseId: 6832812,
        image: 'https://i.discogs.com/2tNPIf31AJWgZynn0coNOwlQqck2V1F91uGWkzq3MKY/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTY4MzI4/MTItMTU3Mzg0ODIw/Ni00MDUxLmpwZWc.jpeg',
    },
    {
        author: 'The Smiths',
        name: 'The Queen Is Dead',
        releaseId: 23069945,
        image: 'https://i.discogs.com/9KF0hvsjQtsUNBjHhKKDZSH41JzIJ4N0vO5km1ppTPQ/rs:fit/g:sm/q:90/h:600/w:597/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIzMDY5/OTQ1LTE2NTEzNjI4/NDktOTM2NC5qcGVn.jpeg',
    },
    {
        author: 'Björk',
        name: 'Homogenic',
        releaseId: 21577147,
        image: 'https://i.discogs.com/Eiw2LhkuyIWy6UELfFUG2m-fQxZ9j4N2mN4BVdsUaCA/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIxNTc3/MTQ3LTE3Nzk0MTQx/NjMtNDM5NC5wbmc.jpeg',
    },
    {
        author: 'Radiohead',
        name: 'In Rainbows',
        releaseId: 1174296,
        image: 'https://i.discogs.com/7y0jjFTZp88uBO380fsYcO36I3ex_er3lZn8COq90Vc/rs:fit/g:sm/q:90/h:594/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTExNzQy/OTYtMTY5NzMyNzQ3/Ny0yMzQ1LmpwZWc.jpeg',
    },
    {
        author: 'Daft Punk',
        name: 'Discovery',
        releaseId: 5835447,
        image: 'https://i.discogs.com/5u5pA22wJ5rf3rKXXlq69zRLb_-OX2KQdOfxMm5U9xk/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTU4MzU0/NDctMTQxMDAwNzg0/NC0yNjgxLmpwZWc.jpeg',
    },
    {
        author: 'Aphex Twin',
        name: 'Selected Ambient Works 85-92',
        releaseId: 1790544,
        image: 'https://i.discogs.com/A6GG5s9QTJ51gflae_j6-51AxCCTVcwToLg_7dp4C78/rs:fit/g:sm/q:90/h:585/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE3OTA1/NDQtMTU1NjM4Njc2/Ny02NjcxLmpwZWc.jpeg',
    },
    {
        author: 'Dr. Dre',
        name: 'The Chronic',
        releaseId: 321364,
        image: 'https://i.discogs.com/QagaIEZ18JQ6y891U8MjRMjEiESdje5wb2T_yWJYpeI/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTMyMTM2/NC0xNTc2MDY3ODQw/LTE3MzAucG5n.jpeg',
    },
    {
        author: 'Nas',
        name: 'Illmatic',
        releaseId: 17110080,
        image: 'https://i.discogs.com/091qsRmnJNVbb9juuK-1wqG3xiCwZXy4i8g-Mxv_9mY/rs:fit/g:sm/q:90/h:597/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE3MTEw/MDgwLTE2MTE2NzQx/NDYtNTAzOS5qcGVn.jpeg',
    },
    {
        author: 'Amy Winehouse',
        name: 'Back to Black',
        releaseId: 30010036,
        image: 'https://i.discogs.com/v3Buqdk6tjjvH9404y_8xp85_PByLHnBDa6O-A77izg/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTMwMDEw/MDM2LTE3MTA5NDU3/NDctNTkzNS5qcGVn.jpeg',
    },
    {
        author: 'Jeff Buckley',
        name: 'Grace',
        releaseId: 15063434,
        image: 'https://i.discogs.com/pX4KAXuQLHuBWHeju1xiZkztJnyL2MPI0CFrZi5S7nU/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE1MDYz/NDM0LTE3MTI1ODYz/NTEtMjkxNi5qcGVn.jpeg',
    },
    {
        author: 'The Clash',
        name: 'London Calling',
        releaseId: 7855687,
        image: 'https://i.discogs.com/qOAFUR8h0MfOOOOP_u7KmKVfg35Cgi_f4yI2aUfOG8A/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTc4NTU2/ODctMTU2MzA1NTUx/OC01MDcwLmpwZWc.jpeg',
    },
    {
        author: 'Prince',
        name: 'Purple Rain',
        releaseId: 1445712,
        image: 'https://i.discogs.com/8x5_p4nHAMu41Rt5FZ1ZN8mEptmue8wvkNR_orMMoNc/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE0NDU3/MTItMTcyMjcyODE5/OS03OTIwLmpwZWc.jpeg',
    },
    {
        author: 'Arcade Fire',
        name: 'The Suburbs',
        releaseId: 2399813,
        image: 'https://i.discogs.com/waUPyCMObDgQesWT_4llTemG5XqS2ep5x9WyUrBgzoQ/rs:fit/g:sm/q:90/h:600/w:599/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIzOTk4/MTMtMTI4MTg3OTA2/MC5qcGVn.jpeg',
    },
    {
        author: 'Tame Impala',
        name: 'Currents',
        releaseId: 26047705,
        image: 'https://i.discogs.com/kFfduRKfzZ7UKGmAdP9gE2eBsEPkOAl0QI6aGzkEvpQ/rs:fit/g:sm/q:90/h:600/w:596/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI2MDQ3/NzA1LTE2NzU5NzUw/OTgtODkzMy5qcGVn.jpeg',
    },
    {
        author: 'Frank Ocean',
        name: 'Blonde',
        releaseId: 25500877,
        image: 'https://i.discogs.com/zMe1fzwVZTbfBimS0hONvRN8D0T5GgNXJ4lfxbIm8rI/rs:fit/g:sm/q:90/h:566/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI1NTAw/ODc3LTE2NzQ3Nzgy/MzgtMjgxMi5qcGVn.jpeg',
    },
    {
        author: 'Radiohead',
        name: 'OK Computer',
        releaseId: 20904106,
        image: 'https://i.discogs.com/1WFr4ZyvnMnGLRIDKb8GtC823dYeZMnzBaonDmYu-Vw/rs:fit/g:sm/q:90/h:582/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIwOTA0/MTA2LTE2MzY0NTU0/OTYtMzU4MC5qcGVn.jpeg',
    },
    {
        author: 'Miles Davis',
        name: 'Bitches Brew',
        releaseId: 13316725,
        image: 'https://i.discogs.com/7ssDZHLBlTI0n6RlcVi_WcE2fHU31lPhNvUBX_bTYxw/rs:fit/g:sm/q:90/h:600/w:590/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEzMzE2/NzI1LTE1NTE5NjIy/MzgtOTEzNi5qcGVn.jpeg',
    },
    {
        author: 'Keith Jarrett',
        name: 'The Köln Concert',
        releaseId: 38834409,
        image: 'https://i.discogs.com/YMU7oJDn57vXmdo0HvxFDz_xh2kqZXvRXYsa1y-v8Dc/rs:fit/g:sm/q:90/h:590/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM4ODM0/NDA5LTE3OTMwMzYz/MTgtNzQ3OC5qcGVn.jpeg',
    },
];

function findDemoCover(author, name) {
    const cover = DEMO_COVERS.find(
        (item) => item.author === author && item.name === name
    );
    return cover ? cover.image : undefined;
}

module.exports = { DEMO_COVERS, findDemoCover };
