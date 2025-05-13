import {Builder, By, until} from 'selenium-webdriver';
import 'chromedriver';
import DefaultPage from '../Page-Object-Model/default-page.mjs';
import {assert} from "chai";

let driver;
let page;
const albumName = 'Album Test';
const albumPicture = 'UploadPhotoAlbumTestPic';
const pictureInAlbum = 'UploadPhotoTestPic';

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

describe('Upload Photo Test', function () {
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

    it('should click on album', async () => {
        const items = await driver.findElements(By.css('.thumbnail'));

        for (const item of items) {
            const imgDiv = await item.findElement(By.css('.thumbnail__img'));
            const style = await imgDiv.getAttribute('style');

            if (style.includes(albumPicture)) {
                const actions = driver.actions({ async: true });
                await actions.move({ origin: item }).perform();
                await item.click();
                break;
            }
        }

        await page.waitAndClick(page.uploadPhotoButton);
    });

    it('should upload photo into album', async () => {
        await page.uploadPhoto(pictureInAlbum, true);
    });

    it('should validate if photo is in album', async () => {
        await driver.wait(until.elementLocated(By.css('.thumbnail')), 10000);

        const items = await driver.findElements(By.css('.thumbnail'));
        let found = false;

        for (const item of items) {
            const imgDiv = await item.findElement(By.css('.thumbnail__img'));
            const style = await imgDiv.getAttribute('style');

            if (style.includes(pictureInAlbum)) {
                found = true;
                break;
            }
        }

        assert.isTrue(
            found,
            `Expected image with identifier "${pictureInAlbum}" to be present in album, but it was not found.`
        );
    });

    it('should delete photo from album', async () => {
        await page.deleteItemByName(
            pictureInAlbum,
            'photo',
            true
        );
    });

   it('should go back to albums and delete album', async () => {
       await driver.sleep(1000);
       await page.clickGoBackButton();

       await page.deleteItemByName(
           albumPicture,
           'album',
           true,
           albumName
       );
   });

    it('should logout', async () => {
        await driver.sleep(1000);
        await page.logout();
    });
});
