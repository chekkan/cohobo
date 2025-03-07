import { expect, test } from 'vitest';
import { action } from './setup';

test("action redirects to / page", async function () {
  const response = action();

  expect(response.status).to.equal(302);
  expect(response.headers.get('Location')).to.equal('/');
})

