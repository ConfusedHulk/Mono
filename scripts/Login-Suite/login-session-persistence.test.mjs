import {Builder} from 'selenium-webdriver';
import 'chromedriver';
import DefaultPage from '../Page-Object-Model/default-page.mjs';
import {assert} from 'chai';
import {ENV} from "../../ENV.js";
import {fileURLToPath} from "url";
import path from "path";
import fs from "node:fs";

let driver;
let page;

before(async function () {
    this.timeout(30000);
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
    await driver.get(ENV.BASE_URL);
    page = new DefaultPage(driver);
});

after(async () => {
    if (driver) await driver.quit();
});

afterEach(async function () {
    if (this.currentTest.state === 'failed') {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const timestamp = new Date().toISOString().split('T')[0];
        const testName = this.currentTest.title.replace(/\s+/g, '-');

        const dir = path.resolve(__dirname, '../../images/failures');
        const fileName = `${testName}-${timestamp}.jpg`;
        const filePath = path.join(dir, fileName);

        const screenshot = await driver.takeScreenshot();
        fs.writeFileSync(filePath, screenshot, 'base64');
    }
});

describe('Login Session Persistence Test', function () {
    it('should log in', async () => {
        await page.login(ENV.LOGIN_USERNAME, ENV.LOGIN_PASSWORD);
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
