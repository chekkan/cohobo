/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, expect, test } from 'vitest';
import { default as Setup, action, loader } from './setup';
import { PrismaClient } from '@prisma/client';
import { createRoutesStub } from 'react-router';
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let mockRequest: Request;

beforeEach(function () {
  mockRequest = new Request("http://localhost/setup", {
    method: "POST",
    body: new FormData()
  });
})

afterEach(cleanup);

test("action redirects to / page", async function () {
  const response = await action({ request: mockRequest, params: {} });
  expect(response).to.be.an.instanceOf(Response);
  const redirect = response as Response;
  expect(redirect.status).to.equal(302);
  expect(redirect.headers.get('Location')).to.equal('/');
})

test("action creates new user", async function () {
  await action({ request: mockRequest, params: {} });
  const prisma = new PrismaClient();
  const allUsers = await prisma.user.findMany();
  expect(allUsers.length).toBeGreaterThan(0);
});

test("loader returns 404 - not found", async function () {
  const prisma = new PrismaClient();
  await prisma.user.create({ data: { email: "jack@cohobo.test", password: "secure_password" } })
  expect(loader()).rejects.toMatchObject({ status: 404, statusText: "Not Found" });
})

test.each([['John Cena'], ['Daniel Craig']])("invalid email '%s' validation error on form submission", async function (email) {
  const App = createRoutesStub([{ path: "/setup", Component: Setup, action }])
  render(<App initialEntries={["/setup"]} />);
  const emailField = await screen.findByLabelText(/email/i);
  await userEvent.type(emailField, email);
  const passwordField = await screen.findByLabelText(/^password$/i);
  await userEvent.type(passwordField, "secure_password");
  const confirmField = await screen.findByLabelText(/confirm\ password/i);
  await userEvent.type(confirmField, "secure_password");
  const submitButton = await screen.findByRole('button', { name: /submit/i });
  await userEvent.click(submitButton);

  const validationErrors = await screen.findAllByRole("alert");
  expect(validationErrors).to.toHaveLength(1);
  expect(validationErrors[0].textContent).to.equal("Not a valid email.");
})

test.todo("email is required");

test("passwords not matching", async function () {
  const App = createRoutesStub([{ path: "/setup", Component: Setup, action }]);
  render(<App initialEntries={["/setup"]} />);
  const emailField = await screen.findByLabelText(/email/i);
  await userEvent.type(emailField, "garfield@cohobo.test");
  const passwordField = await screen.findByLabelText(/^password$/i);
  await userEvent.type(passwordField, "secure_password");
  const confirmField = await screen.findByLabelText(/confirm\ password/i);
  await userEvent.type(confirmField, "something_different");
  const submitButton = await screen.findByRole('button', { name: /submit/i });
  await userEvent.click(submitButton);

  const validationErrors = await screen.findAllByRole("alert");
  expect(validationErrors).to.toHaveLength(1);
  expect(validationErrors[0].textContent).to.equal("Passwords don't match.");
});
