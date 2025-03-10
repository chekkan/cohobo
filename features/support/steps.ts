import { Given, When, Then, AfterAll, DataTable } from "@cucumber/cucumber";
import { Browser, Builder, By, until } from "selenium-webdriver";
import { expect } from 'chai';
import { PrismaClient } from "@prisma/client";

const driver = await new Builder().forBrowser(Browser.CHROME).build();

AfterAll(async function () {
  await driver.quit();
});

Given('there are no users in the system', async function () {
  const prisma = new PrismaClient();
  await prisma.user.deleteMany();
});

Given('the user', async function (dataTable: DataTable) {
  const prisma = new PrismaClient();
  const data = dataTable.rowsHash();
  await prisma.user.create({ data: { email: data["Email"], password: data["Password"] } });
});

When('a(n) (annonymous )user navigates to {string} page', async function (path: string) {
  await driver.get("http://localhost:5173" + path);
});

When('the initial setup form is submitted:', async function (dataTable: DataTable) {
  const data = dataTable.rowsHash();
  const currentUrl = await driver.getCurrentUrl();
  const form = await driver.findElement(By.css("form"));
  const emailField = form.findElement(By.name("email"));
  await emailField.sendKeys(data["Email"]);
  const passwordField = form.findElement(By.name("password"));
  await passwordField.sendKeys(data["Password"]);
  const confirmPasswordField = form.findElement(By.name("confirm_password"));
  await confirmPasswordField.sendKeys(data["Confirm Password"]);
  const submitButton = await form.findElement(By.css('button[type="submit"]'));
  await submitButton.click();
  // wait for either the URL to change or a validation error message
  await driver.wait(async function () {
    const newUrl = await driver.getCurrentUrl();
    if (newUrl !== currentUrl) {
      return true;
    }
    const errors = await driver.findElements(By.css("[role='alert']"));
    if (errors.length > 0) {
      return true;
    }
    return false; // keep waiting, no error message or redirection
  }, 2000)
});

Then('the (annonymous )user is redirected to {string} page', async function (path: string) {
  const currentUrl = await driver.getCurrentUrl();
  expect(currentUrl).to.equal('http://localhost:5173' + path);
});

Then('the {string} link is visible', async function (text: string) {
  await driver.findElement(By.linkText(text));
});

Then('the validation error messages are displayed', async function (dataTable: DataTable) {
  const errors = await driver.findElements(By.css("[role='alert']"));
  const messages = await Promise.all(errors.map(async function (elem) {
    return await elem.getText();
  }));
  const expected = dataTable.raw().map(function (c) { return c[0] });
  expect(messages).to.deep.equal(expected);
});

Then('response is 404 - not found', async function () {
  const pageTitle = await driver.findElement(By.css("main h1"));
  expect(await pageTitle.getText()).to.equal("404");
  const text = await driver.findElement(By.css("main p"));
  expect(await text.getText()).to.equal("The requested page could not be found.");
});
