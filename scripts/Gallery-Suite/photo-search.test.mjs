import {Builder, By, Key, until} from 'selenium-webdriver';
import 'chromedriver';
import DefaultPage from '../Page-Object-Model/default-page.mjs';
import {assert} from "chai";

let driver;
let page;
const albumName = 'Album Test';
const albumPicture = 'PhotoSearchTestPic';

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
