import { expect, test } from 'vitest';
import { loader } from './home';

test("loader redirects to /setup page", async function () {
  const response = loader();

  expect(response.status).to.equal(302);
  expect(response.headers.get('Location')).to.equal('/setup');
})
