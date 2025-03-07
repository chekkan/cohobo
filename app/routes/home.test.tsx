import { expect, test } from 'vitest';
import { loader } from './home';
import { PrismaClient } from '@prisma/client';

test("loader redirects to /setup page", async function () {
  const response = await loader();

  expect(response).to.not.be.null;
  expect(response!.status).to.equal(302);
  expect(response!.headers.get('Location')).to.equal('/setup');
})

test("loader doesn't redirect when there are users", async function () {
  const prisma = new PrismaClient();
  await prisma.user.create({ data: { email: 'John', password: 'random_pwd' } });
  const response = await loader();
  expect(response).to.be.null;
});
