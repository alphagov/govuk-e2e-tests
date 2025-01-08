# GOV.UK End-to-End Tests

This repository contains the end-to-end (E2E) test suite for GOV.UK, built using the [Playwright](https://playwright.dev/) framework.

## Deployment & Operations

The test suite is automatically deployed to GOV.UK's Kubernetes infrastructure on merge, just like any of our continuously deployed applications. Test traffic therefore originates from one of our three [static NAT gateway IPs](https://eu-west-1.console.aws.amazon.com/vpcconsole/home?region=eu-west-1#NatGateways:sort=tag:Name) (there are no other identifiers, e.g. custom UA string, for test traffic at present).

The test suite is run regularly on weekdays only, [as per the cron schedule](https://github.com/alphagov/govuk-helm-charts/blob/bf5d180b110a16a36af4b4dac2812442a5a298f4/charts/govuk-e2e-tests/values.yaml#L8).
Failures are not currently reported anywhere. Results can be seen [in Argo](https://argo.eks.production.govuk.digital/applications/cluster-services/govuk-e2e-tests?view=tree&orphaned=false&resource=).

## Running the tests locally

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
DGU_DOMAIN=www.integration.data.gov.uk
SIGNON_EMAIL=<email>
SIGNON_PASSWORD=<password>
EOF
```

Replace placeholders with appropriate values.

### Run

```bash
yarn playwright test
```
