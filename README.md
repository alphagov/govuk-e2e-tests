# GOV.UK End-to-End Tests

This repository contains the end-to-end (E2E) test suite for GOV.UK, built using the [Playwright](https://playwright.dev/) framework.

## Deployment and operations

The test suite is automatically deployed to GOV.UK's Kubernetes infrastructure on merge, just like any of our continuously deployed applications. Test traffic therefore originates from one of our three [static NAT gateway IPs](https://eu-west-1.console.aws.amazon.com/vpcconsole/home?region=eu-west-1#NatGateways:sort=tag:Name) (there are no other identifiers, e.g. custom UA string, for test traffic at present).

The scheduled runs of the test suite are currently [suspended](https://github.com/alphagov/govuk-helm-charts/blob/b9b111c03d1d3cd76a38ed13c098444167c4f5fe/charts/app-config/values-production.yaml#L1718-L1721).
Failures are not currently reported anywhere. Results can be seen [in Argo](https://argo.eks.production.govuk.digital/applications/cluster-services/govuk-e2e-tests?view=tree&orphaned=false&resource=).

### Running the tests manually

1. Assuming you have configured your shell, obtain credentials to access the cluster in relevant environment using the `developer` role, as described in [the Kubernetes/EKS cheatsheet](https://docs.publishing.service.gov.uk/kubernetes/cheatsheet.html#prerequisites).

2. Create a job with a unique name

```
JOB_NAME="govuk-e2e-tests-manual-$(date +%Y%m%d-%H%M%S)"
kubectl create job $JOB_NAME --from=cronjob/govuk-e2e-tests
```

3. View the test results

- To view the results in the CLI, run:

```
kubectl logs job.batch/$JOB_NAME
```

- You can also view the results [in Argo](https://argo.eks.production.govuk.digital/applications/cluster-services/govuk-e2e-tests?view=tree&orphaned=false&resource=).

## Running the tests locally

### Setup

Clone and navigate to the root folder.

Install the dependencies:

```bash
yarn install
yarn playwright install --with-deps chromium
```

### Running a simple test locally

If you're adding a simple new test and just want to check that it will pass, you can do the following:

1. Comment out the authentication setup steps in `tests/auth.setup.js` (lines 8-11)
2. In the file that your test is in, comment out all the other tests so that your new ones are the only ones that will run.
3. If your test has a relative path such as `page.goto("/contact/govuk");`, change it to absolute an absolute path, for example: `page.goto("https://www.gov.uk/contact/govuk");`
4. Run `npx playwright test` but scope it to your test file. For example, if your tests are in `feedback.spec.js` you would run `npx playwright test tests/feedback.spec.js`
5. If you want to test against integration, you can add the auth credentials directly in your `page.goto` statement, for example `await page.goto("https://yourusername:yourpassword@www.integration.publishing.service.gov.uk/contact/govuk");`

### Setting environment variables (for running the full test suite or more complex tests)

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

## Screenshot tests

By default, Playwright namespaces screenshots by operating system architecture (e.g. `-darwin.png` if running on a Mac, or `-linux.png` on Linux.) This would mean we would have to maintain multiple different screenshots. Therefore we have modified `playwright.config.js` to just maintain one version of each screenshot. Screenshot tests currently only run against Google Chrome as well (you can see this in the projects section of `playwright.config.js`). This greatly simplifies the implementation, as we only need to maintain a screenshot of the expected visual design for Chrome. Adding other browsers may be complicated, as they render our page with subtle pixel differences which causes the tests to fail. For example, the difference between our footer in Chrome and Firefox is as varied as 1500 pixels. Also, maintaining multiple browser screenshots would likely involve reenabling the operating system specific screenshots too, meaning we'd have to maintain `-darwin.png` screenshots to make tests run on local machines, and `-linux.png` screenshots to make the tests run on the server.

See the Playwright docs for more information: https://playwright.dev/docs/test-snapshots
