import {Builder, By} from 'selenium-webdriver';
import 'chromedriver';
import DefaultPage from '../Page-Object-Model/default-page.mjs';
import {assert} from "chai";

let driver;
let page;

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

describe('Create Album Without a Name Test', function () {
    it('should log', async () => {
        await page.login('GalicIvan', 'Abc12345');
    });

    it('should create an album', async () => {
        await page.createAlbum(
            '',
            '',
        );

        const saveAlbumBtn = await driver.findElement(By.css('button[type="submit"][disabled]'));
        const isDisabled = await saveAlbumBtn.getAttribute('disabled');

        assert.isNotNull(
            isDisabled,
            'Expected the upload button to be disabled when no file is selected.'
        );

        const initialUrl = await driver.getCurrentUrl();
        await saveAlbumBtn.click();
        await driver.sleep(1000);
        const currentUrl = await driver.getCurrentUrl();

        assert.equal(
            currentUrl,
            initialUrl,
            'Expected to stay on the same page after attempting to save album without a name.'
        );

    });

    it('should logout', async () => {
        await driver.sleep(1000);
        await page.logout();
    });
});
