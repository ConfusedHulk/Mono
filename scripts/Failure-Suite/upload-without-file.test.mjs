import {Builder, By} from 'selenium-webdriver';
import 'chromedriver';
import DefaultPage from '../Page-Object-Model/default-page.mjs';
import {assert} from "chai";

let driver;
let page;
const albumName = 'Album Test';

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

describe('Upload Without Selecting a File Test', function () {
    it('should log', async () => {
        await page.login('GalicIvan', 'Abc12345');
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
