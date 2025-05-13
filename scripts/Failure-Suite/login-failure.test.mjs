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

describe('Failed Login Test', function () {
    it('should log in', async () => {
        await page.login('FailedLogin', 'Failed12345', false, true);
    });
});
