import {Builder, By, Key, until} from 'selenium-webdriver';
import 'chromedriver';
import DefaultPage from '../Page-Object-Model/default-page.mjs';
import {assert} from "chai";
import {ENV} from "../../ENV.js";
import {fileURLToPath} from "url";
import path from "path";
import fs from "node:fs";

let driver;
let page;
const albumName = 'Album Test';
const albumPicture = 'PhotoSearchTestPic';

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

describe('Photo Search Test', function () {
    it('should log', async () => {
        await page.login(ENV.LOGIN_USERNAME, ENV.LOGIN_PASSWORD);
    });

    it('should create an album', async () => {
        await page.createAlbum(
            albumName,
            'This is a test album description',
        );

        await page.waitAndClick(page.uploadImagePlaceholder);
    });

    it ('should upload album photo', async () => {
        await page.uploadPhoto(albumPicture);

        const albumNameText = await page.waitAndFind(page.albumNameText);
        const displayedText = await albumNameText.getText();
        assert.include(
            displayedText,
            albumName,
            `Expected "${albumName}" text to appear, found "${displayedText}" instead.`
        );
    });

    it('should search for photo', async () => {
        await page.waitAndClick(page.menu, 10000);
        await page.waitAndClick(page.menuLink, 10000);

        const menuContent = await driver.wait(
            until.elementLocated(By.css('.nav__content')),
            10000
        );
        await driver.wait(until.elementIsVisible(menuContent), 10000);

        const searchInput = await page.getSearchInput();
        await searchInput.sendKeys(albumPicture, Key.ENTER);
    });

    it('should validate if photo is found', async () => {
        await driver.wait(until.elementLocated(By.css('.thumbnail')), 10000);

        const items = await driver.findElements(By.css('.thumbnail'));
        let found = false;

        for (const item of items) {
            const imgDiv = await item.findElement(By.css('.thumbnail__img'));
            const style = await imgDiv.getAttribute('style');

            if (style.includes(albumPicture)) {
                found = true;
                break;
            }
        }

        assert.isTrue(
            found,
            `Expected image with identifier "${albumPicture}" to be present after search, but it was not found.`
        );
    });

    it('should click on picture', async () => {
        await driver.wait(until.elementLocated(By.css('.thumbnail')), 10000);

        const items = await driver.findElements(By.css('.thumbnail'));

        let clicked = false;

        for (const item of items) {
            const imgDiv = await item.findElement(By.css('.thumbnail__img'));
            const style = await imgDiv.getAttribute('style');

            if (style.includes(albumPicture)) {
                const actions = driver.actions({ async: true });
                await actions.move({ origin: item }).perform();
                await item.click();
                clicked = true;
                break;
            }
        }
    });

    it('should validate photo', async () => {
        const heading = await driver.wait(
            until.elementLocated(By.css('h2.type--med')),
            10000
        );
        const headingText = await heading.getText();

        assert.include(
            headingText,
            albumPicture,
            `Expected heading to include "${albumPicture}", but found "${headingText}" instead.`
        );
    });

    it('should go back to albums and delete album', async () => {
        await page.waitAndClick(page.menu, 10000);
        await page.waitAndClick(page.menuLink, 10000);

        const menuContent = await driver.wait(
            until.elementLocated(By.css('.nav__content')),
            10000
        );

        await driver.wait(until.elementIsVisible(menuContent), 10000);

        await page.waitAndClick(page.profileButton, 10000);

        await page.deleteItemByName(
            albumPicture,
            'album'
        );
    });

    it('should logout', async () => {
        await driver.sleep(1000);
        await page.logout();
    });
});
