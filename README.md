# SwiftTranslator Sinhala Transliteration – Playwright Test Automation Suite

This repository contains **Playwright** end-to-end automated tests for the website **SwiftTranslator** that converts **Singlish / Romanized Sinhala** input into **Sinhala script** output.

🌐 Website under test: https://www.swifttranslator.com/

---

## ✅ Test Coverage

This test suite includes:

- ✅ Positive Functional Test Cases  
- ✅ Negative Functional Test Cases  
- ✅ UI Test Cases (real-time Sinhala output update)

📌 Total automated tests: **35**

---

## 🧰 Prerequisites

Make sure the following are installed:

- **Node.js 18+** (recommended)
- **npm** (comes with Node.js)

Check versions:

```bash
node -v
npm -v
npm install
npx playwright install
npx playwright test
npx playwright test --headed
npx playwright test --project=chromium
npx playwright test --headed --project=chromium --workers=1 --retries=0
npx playwright test --project=chromium 2>&1


Run This File : npx playwright test --headed --workers=1
.
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── tests/
│   └── example.spec.ts
└── README.md
👨‍🎓 Student Details

Name: Chandula Jeewantha
IT Number: IT23543164
Module: ITPM Assignment 1

