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

When('an annonymous user navigates to {string} page', async function (path: string) {
  await driver.get("http://localhost:5173" + path);
});

When('the initial setup form is submitted:', async function (dataTable: DataTable) {
  const form = await driver.findElement(By.css("form"));
  const emailField = form.findElement(By.name("email"));
  await emailField.sendKeys(dataTable.rowsHash()["Email"]);
  const passwordField = form.findElement(By.name("password"));
  await passwordField.sendKeys(dataTable.rowsHash()["Password"]);
  const confirmPasswordField = form.findElement(By.name("confirm_password"));
  await confirmPasswordField.sendKeys(dataTable.rowsHash()["Confirm Password"]);
  const submitButton = await form.findElement(By.css('button[type="submit"]'));
  await submitButton.click();
  await driver.wait(until.urlIs("http://localhost:5173/"), 2000); // Wait for redirection
});

Then('the annonymous user is redirected to {string} page', async function (string) {
  // Write code here that turns the phrase above into concrete actions
  const currentUrl = await driver.getCurrentUrl();
  expect(currentUrl).to.equal('http://localhost:5173/setup');
});

Then('the user is redirected to {string} page', async function (path: string) {
  const currentUrl = await driver.getCurrentUrl();
  expect(currentUrl).to.equal('http://localhost:5173' + path);
});

Then('the {string} link is visible', async function (text: string) {
  await driver.findElement(By.linkText(text));
});

Then('the validation error message is displayed', function (dataTable) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

