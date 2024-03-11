# Tax API Extensions Starter Kit

This is a starter kit for using adding a custom tax integration in Kibo.

## Getting Started

The starter kit contains a basic tax implementation that adds a 10% flat tax. You can use this as a starting point to add your own tax implementation that either calls out to a tax service or adds custom VAT logic. See [Developer Tools](https://docs.kibocommerce.com/help/developer-tools) in the Kibo documentation for information on getting started with applications.

You will need to first upload the code to a new application, modify the code to your needs, install, and then test.

## Install

First install the dependencies with: `npm install`

Then create a mozu.config.json


```json
{
  "baseUrl": "https://home.mozu.com",
  "developerAccountId": 0,
  "developerAccount": {
    "emailAddress": "email@example.com"
  },
  "workingApplicationKey": "Namespace.AppKey.1.0.0.Release"
}
```

Then build with `grunt`. It will run through eslint and Typescript checks, compile the code into the assets folder, and then upload to your application using mozusync as usual.

Then go to your application in Dev Center, and click Install on your tenant. This will automaticaly add the API Extensions in the Action Management JSON Editor. You can then go to the Payment Types screen, add your credentials, enable, and then Save.

## Development

First, go to `src/taxController.ts` and you can modify the base implementation from there. Note the helper functions in `src/utils.ts` which you can use to distribute totals onto line items and fix rounding issues.

Then, create a new order in the Kibo Admin interface and add some items. You will see tax in the order line items. Then you can use the API, e.g. GET `{{baseUrl}}/commerce/orders/16ef50de03bcc000010abb6e00009af4`, to verify that the `itemTaxTotal` and `shippingTaxTotal` looks correct.

