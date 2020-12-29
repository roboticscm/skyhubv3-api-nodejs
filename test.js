const puppeteer = require('puppeteer');

const open = async () => {
    try {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto('http://127.0.0.1:3000/report-doctor-list');
        setTimeout( async () => {
          await browser.close();
        }, 5000);
    } catch (err) {
        console.log(err);
    };
}

for(let i = 0; i < 2; i++) {
    open();
}