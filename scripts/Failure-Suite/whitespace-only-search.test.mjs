import {Builder, By, Key, until} from 'selenium-webdriver';
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

describe('Search Pictures With Whitespace Only Test', function () {
    it('should stay on same page after whitespace-only search', async () => {
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
        await searchInput.sendKeys('   ', Key.ENTER);

        await driver.sleep(1000);

        const currentUrl = await driver.getCurrentUrl();
        assert.equal(
            currentUrl,
            initialUrl,
            'Expected to stay on the same page after whitespace-only search.'
        );
    });
});
