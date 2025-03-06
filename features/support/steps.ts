import { Given, When, Then, AfterAll } from "@cucumber/cucumber";
import { Browser, Builder } from "selenium-webdriver";
import { expect } from 'chai';

const driver = await new Builder().forBrowser(Browser.CHROME).build();

AfterAll(async function () {
  await driver.quit();
});

Given('there are no users in the system', function () {
});

When('an annonymous user navigates to {string} page', async function (path: string) {
  await driver.get("http://localhost:5173" + path);
});

When('the form is submitted:', function (dataTable) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('the annonymous user is redirected to {string} page', async function (string) {
  // Write code here that turns the phrase above into concrete actions
  const currentUrl = await driver.getCurrentUrl();
  expect(currentUrl).to.equal('http://localhost:5173/setup');
});

Then('the user is redirected to `\\/` page', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('the {string} link is visible', function (string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('the validation error message is displayed', function (dataTable) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

