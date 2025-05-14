import {Builder, By, Key, until} from 'selenium-webdriver';
import 'chromedriver';
import DefaultPage from '../Page-Object-Model/default-page.mjs';
import {assert} from "chai";
import {fileURLToPath} from "url";
import path from "path";
import fs from "node:fs";
import {ENV} from "../../ENV.js";

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

describe('Search Pictures With Empty Field Test', function () {
    it('should stay on same page after empty search', async () => {
        await page.waitAndClick(page.menu, 10000);
        await page.waitAndClick(page.menuLink, 10000);

        const menuContent = await driver.wait(
            until.elementLocated(By.css('.nav__content')),
            10000
        );
        await driver.wait(until.elementIsVisible(menuContent), 10000);

        const initialUrl = await driver.getCurrentUrl();

        const searchInput = await page.getSearchInput();
        await searchInput.clear();
        await searchInput.sendKeys('', Key.ENTER);

        await driver.sleep(1000);

        const currentUrl = await driver.getCurrentUrl();
        assert.equal(currentUrl, initialUrl, 'Expected to stay on the same page after empty search.');
    });
});
