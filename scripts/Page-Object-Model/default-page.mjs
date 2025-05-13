import { By, until } from 'selenium-webdriver';
import { assert } from 'chai';
import { fileURLToPath } from 'url';
import path from 'path';

export default class DefaultPage {
    constructor(driver) {
        this.driver = driver;
    }

    async menu() {
        return await this.driver.findElement(By.css('.menu'));
    }

    async menuLink() {
        return await this.driver.findElement(By.css('a.menu__title'));
    }

    async loginButton() {
        return await this.driver.findElement(By.xpath('//span[text()="Login"]'));
    }

    async profileButton() {
        return await this.driver.wait(
            until.elementLocated(By.xpath('//span[text()="Profile"]')),
            10000
        );
    }

    async logoutButton() {
        return await this.driver.wait(
            until.elementLocated(By.xpath('//span[text()="Log out"]')),
            10000
        );
    }

    async usernameField() {
        return await this.driver.findElement(By.css('input[formcontrolname="username"]'));
    }

    async passwordField() {
        return await this.driver.findElement(By.css('input[formcontrolname="password"]'));
    }

    async albumNameField() {
        return await this.driver.findElement(By.css('input[formcontrolname="albumName"]'));
    }

    async albumDescriptionField() {
        return await this.driver.findElement(By.css('textarea[formcontrolname="albumDescription"]'));
    }

    async photoNameField() {
        return await this.driver.findElement(By.css('input[formcontrolname="photoName"]'));
    }

    async photoDescriptionField() {
        return await this.driver.findElement(By.css('textarea[formcontrolname="photoDescription"]'));
    }

    async submitButton() {
        return await this.driver.wait(until.elementLocated(By.css('button[type="submit"]')), 5000);
    }

    async usernameDisplay() {
        return await this.driver.wait(until.elementLocated(By.css('.container h2')), 10000);
    }

    async almostDoneTextDisplay() {
        return await this.driver.wait(until.elementLocated(By.css('.container h2')), 10000);
    }

    async uploadImageTextDisplay() {
        return await this.driver.wait(until.elementLocated(By.css('.upload')), 10000);
    }

    async createAlbumButton() {
        return await this.driver.wait(
            until.elementLocated(By.css('button.btn.btn--med.btn--primary.spc--left--custom--to-1525')),
            10000
        );
    }

    async clickGoBackButton() {
        const goBackBtn = await this.driver.wait(
            until.elementLocated(By.xpath("//button[contains(text(), 'Go back to albums')]")),
            5000
        );
        await goBackBtn.click();
    }

    async getSearchInput() {
        return await this.driver.wait(
            until.elementLocated(By.css('input[placeholder="Search..."]')),
            5000
        );
    }

    async saveAlbumButton() {
        return await this.driver.wait(
            until.elementLocated(By.css('button.btn.btn--primary.btn--med[type="submit"]')),
            10000
        );
    }

    async uploadImagePlaceholder() {
        return await this.driver.wait(
            until.elementLocated(By.css('.placeholder.cur--pointer')),
            10000
        );
    }

    async uploadImageButton() {
        return await this.driver.wait(
            until.elementLocated(By.css('button.btn.btn--primary.btn--med[type="submit"]')),
            10000
        );
    }

    async uploadPhotoButton() {
        return await this.driver.wait(
            until.elementLocated(By.css('button.btn.btn--primary.btn--med.spc--top--sml.spc--bottom--sml')),
            10000
        );
    }

    async createAlbumTextDisplay() {
        return await this.driver.wait(until.elementLocated(By.css('.container h3')), 10000);
    }

    async albumNameText() {
        return await this.driver.wait(
            until.elementLocated(By.css('.type--base strong')),
            10000
        );
    }

    async waitAndFind(selectorFn, timeout = 5000) {
        const el = await selectorFn.call(this);
        await this.driver.wait(until.elementIsVisible(el), timeout);
        return el;
    }

    async waitAndClick(selectorFn, timeout = 5000) {
        const el = await this.waitAndFind(selectorFn, timeout);
        await el.click();
        return el;
    }

    async waitAndType(selectorFn, text, timeout = 5000) {
        const el = await this.waitAndFind(selectorFn, timeout);
        await el.sendKeys(text);
        return el;
    }

    async login(username, password, validate = false, failedLogin = false) {
        await this.waitAndClick(this.menu, 10000);

        await this.waitAndClick(this.menuLink);
        await this.waitAndClick(this.loginButton);

        await this.waitAndType(this.usernameField, username);
        await this.waitAndType(this.passwordField, password);

        await this.waitAndClick(this.submitButton);

        if (validate) {
            const usernameEl = await this.waitAndFind(this.usernameDisplay);
            const displayedText = await usernameEl.getText();
            assert.include(displayedText, username, `Expected username "${username}" to appear, found "${displayedText}" instead.`);
        }

        if (failedLogin) {
            const errorMessage = await this.driver.wait(
                until.elementLocated(By.css('.alert')),
                5000
            );
            const errorText = await errorMessage.getText();

            assert.include(
                errorText,
                'Invalid email, username or password',
                `Expected error message to include "Invalid email, username or password", but found "${errorText}" instead.`
            );
        }
    }

    async logout(validate = false) {
        await this.waitAndClick(this.menu, 10000);
        await this.waitAndClick(this.menuLink);
        await this.waitAndClick(this.logoutButton);

        if (validate) {
            const loginEl = await this.waitAndFind(this.submitButton);
            const isDisplayed = await loginEl.isDisplayed();
            assert.isTrue(isDisplayed, 'Expected to see the Login button after logout.');
        }
    }

    async createAlbum(albumName, albumDescription, validate = false) {
        await this.waitAndClick(this.createAlbumButton);

        if (validate) {
            const createAlbumText = await this.waitAndFind(this.createAlbumTextDisplay);
            const displayedText = await createAlbumText.getText();
            assert.include(displayedText, 'Create new album', `Expected "Create new album" text to appear, found "${displayedText}" instead.`);
        }

        await this.waitAndType(this.albumNameField, albumName);
        await this.waitAndType(this.albumDescriptionField, albumDescription);
        await this.waitAndClick(this.submitButton);

        if (validate) {
            const almostDone = await this.waitAndFind(this.almostDoneTextDisplay);
            const displayedText = await almostDone.getText();
            assert.include(displayedText, 'Almost done!', `Expected "Almost done!" text to appear, found "${displayedText}" instead.`);
        }
    }


    async uploadPhoto(photoName, validate = false) {
        if (validate) {
            const uploadImageText = await this.waitAndFind(this.uploadImageTextDisplay);
            const displayedText = await uploadImageText.getText();
            assert.include(displayedText, 'UPLOAD IMAGE', `Expected "Upload image" text to appear, found "${displayedText}" instead.`);
        }

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const imagePath = path.resolve(`${__dirname}/../../images/${photoName}.jpg`);
        const fileInput = await this.driver.findElement(By.css('input[type="file"]'));
        await fileInput.sendKeys(imagePath);

        if (validate) {
            const photoNameText = await this.waitAndFind(this.photoNameField);
            const displayedText = await photoNameText.getAttribute('value');
            assert.include(displayedText, photoName, `Expected ${photoName} text to appear, found "${displayedText}" instead.`);
        }

        await this.waitAndType(this.photoDescriptionField, `Description of the photo name: ${photoName}`);
        await this.waitAndClick(this.uploadImageButton);
    }

    async deleteItemByName(itemName, itemType, validate = false, albumName = itemName) {
        await this.driver.wait(until.elementLocated(By.css('.thumbnail')), 10000);

        const items = await this.driver.findElements(By.css('.thumbnail'));

        for (const item of items) {
            const imgDiv = await item.findElement(By.css('.thumbnail__img'));
            const style = await imgDiv.getAttribute('style');

            if (style.includes(itemName)) {
                const actions = this.driver.actions({ async: true });
                await actions.move({ origin: item }).perform();
                break;
            }
        }

        const deleteButton = await this.driver.wait(
            until.elementLocated(By.css('.thumbnail__info__delete')),
            10000
        );

        await deleteButton.click();

        if (validate) {
            const modalContent = await this.driver.wait(
                until.elementLocated(By.css('.modal__dialog--content')),
                5000
            );
            const displayedText = await modalContent.getText();
            assert.include(
                displayedText,
                `Are you sure you want to delete ${itemType} ${albumName}`,
                `Expected modal text to include "Are you sure you want to delete ${itemType} ${albumName}", but found "${displayedText}".`
            );
        }

        const confirmButton = await this.driver.wait(
            until.elementLocated(By.css('.btn.btn--warning')),
            10000
        );

        await confirmButton.click();
    }
}