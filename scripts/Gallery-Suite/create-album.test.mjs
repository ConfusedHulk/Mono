import {Builder} from 'selenium-webdriver';
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
const albumPicture = 'CreateAlbumTestPic';

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

describe('Create Album Test', function () {
    it('should log', async () => {
        await page.login(ENV.LOGIN_USERNAME, ENV.LOGIN_PASSWORD);
    });

    it('should create an album', async () => {
        await page.createAlbum(
            albumName,
            'This is a test album description',
            true
        );

        await page.waitAndClick(page.uploadImagePlaceholder);
    });

    it ('should upload album photo', async () => {
        await page.uploadPhoto(albumPicture, true);

        const albumNameText = await page.waitAndFind(page.albumNameText);
        const displayedText = await albumNameText.getText();
        assert.include(
            displayedText,
            albumName,
            `Expected "${albumName}" text to appear, found "${displayedText}" instead.`
        );
    });

    it('should delete album', async () => {
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
