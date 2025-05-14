import { Builder, By } from 'selenium-webdriver';
import 'chromedriver';
import DefaultPage from '../Page-Object-Model/default-page.mjs';
import { assert } from "chai";
import path from "path";
import {fileURLToPath} from "url";
import {ENV} from "../../ENV.js";
import fs from "node:fs";

let driver;
let page;
const albumName = 'Album Test';

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

describe('Upload Unsupported File Test', function () {
    it('should login', async () => {
        await page.login(ENV.LOGIN_USERNAME, ENV.LOGIN_PASSWORD);
    });

    it('should create an album', async () => {
        await page.createAlbum(
            albumName,
            'This is a test album description',
        );

        await page.waitAndClick(page.uploadImagePlaceholder);
    });

    it ('should upload unsupported album photo and validate', async () => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const imagePath = path.resolve(`${__dirname}/../../images/test-images/UnsupportedFile.png`);

        const fileInput = await driver.findElement(By.css('input[type="file"]'));
        await fileInput.sendKeys(imagePath);

        await driver.sleep(1000);

        const errorMessage = await driver.findElement(By.css('.alert.alert--warning.type--center'));
        const errorMessageText = await errorMessage.getText();

        assert.include(
            errorMessageText,
            'Allowed file types are: .jpeg / .jpg',
            `Expected the error message to mention allowed file types for the image upload but found ${errorMessageText} instead.`
        );
    });

    it('should logout', async () => {
        await driver.sleep(1000);
        await page.logout();
    });
});
