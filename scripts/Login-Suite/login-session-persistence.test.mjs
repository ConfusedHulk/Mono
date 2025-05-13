import {Builder} from 'selenium-webdriver';
import 'chromedriver';
import DefaultPage from '../Page-Object-Model/default-page.mjs';
import {assert} from 'chai';

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

describe('Login Session Persistence Test', function () {
    it('should log in', async () => {
        await page.login('GalicIvan', 'Abc12345');
    });

    it('should refresh the page', async () => {
        await driver.sleep(1000)
        await driver.navigate().refresh();
    });

    it('should check if the user is still logged in', async () => {
        const usernameDisplay = await page.usernameDisplay();
        const text = await usernameDisplay.getText();
        assert.strictEqual(text, 'GalicIvan');
    });

    it('should log out', async () => {
        await page.logout();
    });
});
