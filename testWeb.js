const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");
const { sensitiveHeaders } = require("http2");

describe("Automated Test Cases", function () {
  this.timeout(60000);

  let driver;

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async function () {
    await driver.quit();
  });

  it("Test Case 1 - {value} = fashion", async function () {
    const email = "bilulautomationtest1@gmail.com";
    const value = "fashion";
    await performRegistrationTest(email, value);
    await validateDashboardApps([
      "Transactions",
      "Checkout",
      "Connect",
      "Products",
      "Shop",
      "Message",
      "Settings",
    ]);
  }, 3000);

  it("Test Case 2 - {value} = santander", async function () {
    const email = "bilulautomationtest2@gmail.com";
    const value = "santander";
    await performRegistrationTest(email, value);
    await validateDashboardApps([
      "Transactions",
      "Checkout",
      "Connect",
      "Point of Sale",
      "Settings",
    ]);
  }, 3000);

  async function performRegistrationTest(email, value) {
    await driver.get(`https://commerceos.staging.devpayever.com/registration/${value}`);
    await driver.wait(until.elementLocated(By.css(".two-column-form-wrapper > peb-form-field-input:nth-of-type(1) .label-text")), 10000);

    // fill information user
    await driver.findElement(By.css(".two-column-form-wrapper > peb-form-field-input:nth-of-type(1) .label-text")).click();
    await driver.findElement(By.css("[formcontrolname='firstName']")).sendKeys("Muhammad");
    await driver.findElement(By.className("label-text ng-tns-c170-2 ng-trigger ng-trigger-isFocusedLabel ng-star-inserted")).click();
    await driver.findElement(By.css("[formcontrolname='lastName']")).sendKeys("Bilal");
    await driver.findElement(By.className("ng-tns-c170-3 label-input-content-wrapper")).click();
    await driver.findElement(By.css("[type='email']")).sendKeys(email);
    await driver.findElement(By.className("label-text ng-tns-c170-4 ng-trigger ng-trigger-isFocusedLabel ng-star-inserted")).click();
    await driver.findElement(By.css("[formcontrolname='password']")).sendKeys("Sulit123?");
    await driver.findElement(By.className("label-text ng-tns-c170-5 ng-trigger ng-trigger-isFocusedLabel ng-star-inserted")).click();
    await driver.findElement(By.css("[formcontrolname='confirmPass']")).sendKeys("Sulit123?");

    // click 'next'
    await driver.findElement(By.css("[type='submit']")).click();
    await driver.wait(until.elementLocated(By.xpath("//peb-form-field-input[@class='ng-tns-c170-8 ng-star-inserted']")), 10000);

    // fill information business
    if (value === "fashion") {
      // for fashion
      await driver.findElement(By.xpath("//peb-form-field-input[@class='ng-tns-c170-8 ng-star-inserted']")).click();
      await driver.findElement(By.css("[formcontrolname='name']")).sendKeys("My Fashion Business");
      await driver.findElement(By.css("[formcontrolname='countryPhoneCode'] .select-text")).click();
      await driver.findElement(By.css("peb-select-option:nth-of-type(98)")).click();
      await driver.findElement(By.css(".two-column-form-wrapper .label-input-content-wrapper .label-text")).click();
      await driver.findElement(By.css("[formcontrolname='phoneNumber']")).sendKeys("6657567576");
    } else if (value === "santander") {
      // for santander
      await driver.wait(until.elementLocated(By.css(".form-background-wrapper > peb-form-field-input:nth-of-type(1) .label-text")), 10000);
      await driver.findElement(By.css(".form-background-wrapper > peb-form-field-input:nth-of-type(1) .label-text")).click();
      await driver.findElement(By.xpath("//input[@class='ng-tns-c170-8 ng-untouched ng-pristine ng-invalid']")).sendKeys("My Santander Business");
      await driver.findElement(By.className("label-container ng-tns-c170-11 form-label")).click();
      await driver.findElement(By.css("mat-option:nth-of-type(6)")).click();
      await driver.findElement(By.className("label-container ng-tns-c212-12 ng-star-inserted")).click();
      await driver.findElement(By.css("peb-select-option:nth-of-type(98)")).click();
      await driver.findElement(By.className("label-text ng-tns-c170-13 ng-trigger ng-trigger-isFocusedLabel ng-star-inserted")).click();
      await driver.findElement(By.css("[pephoneinputfilter]")).sendKeys("1234567890");
      await driver.findElement(By.className("label-text ng-tns-c170-14 ng-trigger ng-trigger-isFocusedLabel ng-star-inserted")).click();
      // await driver.sleep(2000);
      // await driver.findElement(By.css("ng-tns-c170-14 ng-touched ng-dirty ng-invalid")).sendKeys("787987877899");
    }

    // register account
    await driver.findElement(By.css(".signup-button")).click();
    await driver.wait(until.elementLocated(By.xpath("//button[@class='welcome-screen-content-button']")), 30000);


    // Click 'Get Started'
    await driver.sleep(5000);
    await driver.findElement(By.xpath("//button[@class='welcome-screen-content-button']")).click();
    await driver.wait(until.elementLocated(By.css(".icons__image")), 10000);
  }


  // View Dashboard and Validate
async function validateDashboardApps(apps) {
  try {
    await driver.wait(until.elementsLocated(By.css(".icons__title")), 10000);
    const dashboardApps = await driver.findElements(By.css(".icons__title"));
  const appNames = await Promise.all(dashboardApps.map((el) => el.getText()));

  for (const app of apps) {
    if (appNames.includes(app)) {
      console.log(`The ${app} field is present on the dashboard`);
    } else {
      console.log(`The ${app} field is not present on the dashboard`);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

    assert.deepStrictEqual(appNames, apps);
    console.log(`Validation successful: All expected apps are present.`);
  } catch (error) {
    console.error("Error occurred during validation:", error);
    console.log(`Validation failed: Not all expected apps are present.`);
  }
}
});