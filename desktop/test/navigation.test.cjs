const { test } = require('node:test');
const assert = require('node:assert/strict');
const { APP_URL, isAppUrl } = require('../navigation.cjs');
test('team pages stay inside the authenticated HTTPS origin', () => {
  assert.equal(isAppUrl(APP_URL), true);
  assert.equal(isAppUrl(new URL('/api/videos/example', APP_URL).href), true);
  for (const value of ['http://acrobatic-clubmanagement.acrobatic-kaist.workers.dev/', 'https://acrobatic-clubmanagement.acrobatic-kaist.workers.dev.evil.example/', 'https://user:password@acrobatic-clubmanagement.acrobatic-kaist.workers.dev/', 'file:///C:/Windows/system.ini', 'javascript:alert(1)', 'not a URL']) {
    assert.equal(isAppUrl(value), false, value);
  }
});
