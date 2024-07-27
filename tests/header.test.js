const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');

const Page = require('./helpers/page');

let browser, page;
// let page;

// beforeEach(async () => {
//     browser = await puppeteer.launch({
//         headless: true,
//         args: ['--no-sandbox']   
//     });

//     page = await browser.newPage();

//     // page = await Page.build();

//     await page.goto('http://localhost:3000/');
// });

// afterEach(async () => {
//     await browser.close();
//     // await page.close();
// });


test('add two number', () => {
    const sum = 1+1;
    expect(sum).toEqual(2);
})


// test('the header has the correct text', async () => {
//     const text = await page.$eval('a.brand-logo', el => el.innerHTML);
//     // const text = await page.getContentsOf('a.brand-logo');

//     expect(text).toEqual('Blogster');
// });


// test('clicking on login to starts oAuth flow', async () => {
//     await page.click('.right a');

//     const url = await page.url();
//     // console.log(url)

//     expect(url).toMatch(/accounts\.google\.com/)
// });


// test('when signed in, shows logout button', async () => {
//     // const id = '65fe822e76ad619708e312fb';

//     const user = await userFactory();
//     const { session, sig } = sessionFactory(user);

//     await page.setCookie({ name: 'session', value: session });
//     await page.setCookie({ name: 'session.sig', value: sig });

//     await page.goto('http://localhost:3000/');
//     // await page.waitFor('a[href="/auth/logout"]');

//     // await page.login();

//     const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
//     expect(text).toEqual('Logout');
// });

