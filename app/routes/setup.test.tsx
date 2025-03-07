import { expect, test } from 'vitest';
import { action } from './setup';
import { PrismaClient } from '@prisma/client';

test("action redirects to / page", async function () {
  const response = await action();
  expect(response.status).to.equal(302);
  expect(response.headers.get('Location')).to.equal('/');
})

test("action creates new user", async function () {
  await action();
  const prisma = new PrismaClient();
  const allUsers = await prisma.user.findMany();
  expect(allUsers.length).toBeGreaterThan(0);
})
