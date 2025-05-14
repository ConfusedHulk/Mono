import {Builder, By} from 'selenium-webdriver';
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

describe('Upload Without Selecting a File Test', function () {
    it('should log', async () => {
        await page.login(ENV.LOGIN_USERNAME, ENV.LOGIN_PASSWORD);
    });

    it('should create an album', async () => {
        await page.createAlbum(
            albumName,
            'This is a test album description',
            true
        );
    });

    it('should not allow upload when no image is selected', async () => {
        await page.waitAndClick(page.uploadImagePlaceholder);

        const uploadButton = await driver.findElement(By.css('button[type="submit"][disabled]'));

        const isDisabled = await uploadButton.getAttribute('disabled');

        assert.isNotNull(
            isDisabled,
            'Expected the upload button to be disabled when no file is selected.'
        );

        const initialUrl = await driver.getCurrentUrl();
        await uploadButton.click();
        await driver.sleep(1000);
        const currentUrl = await driver.getCurrentUrl();

        assert.equal(
            currentUrl,
            initialUrl,
            'Expected to stay on the same page after attempting to upload with no file.'
        );
    });

    it('should logout', async () => {
        await driver.sleep(1000);
        await page.logout();
    });
});
