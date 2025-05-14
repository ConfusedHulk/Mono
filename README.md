# Mono Automated Tests

This repo contains automated tests for the [Photo Gallery Starter Kit](http://demo.baasic.com/angular/starterkit-photo-gallery/main)

The tests are written using **Selenium WebDriver** and **JavaScript** (Node.js)

## Requirements

- Node.js v18 or newer
- Chrome v136.0.0 or newer

## Project Structure
```bash
AutomatedTests/
├── images/
│   └──  test-images/
│      └── CreateAlbumTestPic.jpg
│      └── PhotoSearchTestPic.jpg
│      └── UnsupportedFile.png
│      └── UploadPhotoAlbumTestPic.jpg.test.js
│      └── UploadPhotoTestPic.jpg.test.js
│   └── failures/
├── scripts/
│   └── Failure-Suite/
│       └── create-album-noname.test.mjs
│       └── empty-input-search.test.mjs
│       └── login-failure.test.mjs
│       └── upload-unsupported-file.test.mjs
│       └── upload-without-file.test.mjs
│       └── whitespace-only-search.test.mjs
│   └── Gallery-Suite/
│       └── create-album.test.mjs
│       └── photo-search.test.mjs
│       └── upload-photo.test.mjs
│   └── Login-Suite/
│       └── login-logout.test.mjs
│       └── logout-session-persistence.test.mjs
│   └── Page-Object-Modal/
│       └── default-page.mjs
├── .gitignore
├── .mocharc.json/
├── index.js
├── ENV.js
├── package.json
├── package-lock.json
└── README.md
```
## Setup

```bash
npm install
```
## Running Tests
To run all tests, use the following command:

```bash
npm run testAll
```
To run tests in a specific suite, use the following commands

```bash
npm run failureSuite
npm run gallerySuite
npm run loginSuite
```

To run a specific test, use the following commands:

```bash
npm run loginLogout
npm run loginFailure
npm run loginPersistance
npm run createAlbum
npm run uploadPhoto
npm run photoSearch
npm run emptySearch
npm run noFileUpload
npm run whitespaceOnlySearch
npm run createAlbumWithoutName
npm run unsupportedFile
```
## Test Descriptions

### Login Suite

- **`loginLogout`**  
  User logs in and logs out. Simple UI validation to ensure the login/logout process works as expected.

- **`loginPersistance`**  
  Checks if user is still logged in after a page refresh. UI validation to ensure that user is logged in after refresh. User is logged out after the test.

---

### Gallery Suite

- **`createAlbum`**  
  Creates a new album. Also deletes the album. User is logged out after the test.

- **`uploadPhoto`**  
  Uploads a valid photo to a newly created album. Cleans up after itself. UI validation on each step. User is logged out after the test.

- **`photoSearch`**  
  Searches for a cover photo of the album. UI validation after search. Album is deleted after the test. User is logged out after the test.

---

### Failure Suite

- **`createAlbumWithoutName`**  
  Attempts to create an album without entering a name. Verifies if save button is disabled. User is logged out after the test.

- **`emptySearch`**  
  Tries to search with an empty input field. UI verification.

- **`uploadWithoutFile`**  
  Tries to upload without selecting a file. Verifies if the upload button is disabled. User is logged out after the test.

- **`uploadUnsupportedFile`**  
  Attempts to upload a file type that is not supported. Verifies if error message is showing. User is logged out after the test.

- **`loginFailure`**  
  Verifies errors when logging in with incorrect credentials.

- **`whitespaceOnlySearch`**  
  Enters only whitespace characters in the search bar. The test ensures that no search is performed. UI verification.
  This test will fail on purpose.





