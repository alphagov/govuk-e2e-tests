# GOV.UK End-to-End Tests

This repository contains the end-to-end (E2E) test suite for GOV.UK, built using the [Playwright](https://playwright.dev/) framework.

## Running the tests

### Setup

Clone and navigate to the root folder.

Install the dependencies:

```bash
yarn install
yarn playwright install --with-deps chromium
```

### Set environment variables

Create a `.env` file in the root of the project with the following content:

```bash
cat <<EOF > .env
PUBLISHING_DOMAIN=integration.publishing.service.gov.uk
PUBLIC_DOMAIN=www.integration.publishing.service.gov.uk
SIGNON_EMAIL=<email>
SIGNON_PASSWORD=<password>
EOF
```

Replace placeholders with appropriate values.

### Run

```bash
yarn playwright test
```
