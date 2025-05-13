import {Builder} from 'selenium-webdriver';
import 'chromedriver';
import DefaultPage from '../Page-Object-Model/default-page.mjs';
import {assert} from "chai";

let driver;
let page;
const albumName = 'Album Test';
const albumPicture = 'CreateAlbumTestPic';

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

describe('Create Album Test', function () {
    it('should log', async () => {
        await page.login('GalicIvan', 'Abc12345');
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
