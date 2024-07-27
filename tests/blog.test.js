// const Page = require('./helpers/page');

const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');

// let page;
let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });

    page = await browser.newPage();

    // page = await Page.build();

    await page.goto('http://localhost:3000/');
});

afterEach(async () => {
    await browser.close();
    // await page.close();
});

// test('When logged in, Can see blog creation form', async () => {
//     const user = await userFactory();
//     const { session, sig } = sessionFactory(user);

//     await page.setCookie({ name: 'session', value: session });
//     await page.setCookie({ name: 'session.sig', value: sig });

//     await page.goto('http://localhost:3000/blogs');

//     await page.click('a.btn-floating');

//     // const label = await page.getContentsOf('form label');
//     const label = await page.$eval('form label', el => el.innerHTML);
//     expect(label).toEqual('Blog Title');
// });

describe('When logged in', () => {
    beforeEach(async () => {
        const user = await userFactory();
        const { session, sig } = sessionFactory(user);

        await page.setCookie({ name: 'session', value: session });
        await page.setCookie({ name: 'session.sig', value: sig });

        await page.goto('http://localhost:3000/blogs');

        await page.click('a.btn-floating');
    });

    test('Can see blog creation form', async () => {
        const label = await page.$eval('form label', el => el.innerHTML);
        expect(label).toEqual('Blog Title');
    });

    describe('Using valid inputs', () => {
        beforeEach(async () => {
            await page.type('.title input', 'Automated testing');
            await page.type('.content input', 'Typing automatically !');

            await page.click('form button');
        });

        test('Takes users to review screen, After submitting', async () => {
            const text = await page.$eval('h5', el => el.innerHTML);

            expect(text).toEqual('Please confirm your entries');
        });

        test('Submitting, Then add blogs to index page', async () => {
            await page.click('button.green');
            await page.waitForSelector('.card');

            const title = await page.$eval('.card-title', el => el.innerHTML);
            const content = await page.$eval('p', el => el.innerHTML);

            expect(title).toEqual('Automated testing');
            expect(content).toEqual('Typing automatically !');
        });
    });

    describe('Using invalid inputs', () => {
        beforeEach(async () => {
            await page.click('form button');
        });

        test('Form shows an error', async () => {
            const titleError = await page.$eval('.title .red-text', el => el.innerHTML);
            const contentError = await page.$eval('.content .red-text', el => el.innerHTML);

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');
        });
    });
});

// describe('User not logged in', () => {
//     test('Users can not create blog posts', async () => {
//         const result = await page.evaluate(() => {
//             return fetch('/api/blogs', {
//                 method: 'POST',
//                 credentials: 'same-origin',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ title: 'Automated API Testing ...', content: 'API testing automatically to call direct API' })
//             }).then(res => res.json());
//         });

//         expect(result).toEqual({ error: 'You must log in!' });
//     });

//     test('Users can not get a list of blog posts', async () => {
//         const result = await page.evaluate(() => {
//             return fetch('/api/blogs', {
//                 method: 'GET',
//                 credentials: 'same-origin',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             }).then(res => res.json());
//         });

//         expect(result).toEqual({ error: 'You must log in!' });
//     });
// });