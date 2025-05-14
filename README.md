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

