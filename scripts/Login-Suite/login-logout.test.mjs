import {Builder} from 'selenium-webdriver';
import 'chromedriver';
import DefaultPage from '../Page-Object-Model/default-page.mjs';

let driver;
let page;

before(async function () {
    this.timeout(30000);
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
    await driver.get('http://demo.baasic.com/angular/starterkit-photo-gallery/main');
    page = new DefaultPage(driver);
});

after(async () => {
    if (driver) await driver.quit();
});

describe('Login and Logout Test', function () {
    it('should log in and validate', async () => {
        await page.login('GalicIvan', 'Abc12345', true);
    });

    it('should logout and validate', async () => {
        await page.logout(true);
    });
});
