'use strict';
const APP_URL = 'https://acrobatic-clubmanagement.acrobatic-kaist.workers.dev/';
const APP_ORIGIN = new URL(APP_URL).origin;
function isAppUrl(value) {
  try { const url = new URL(value); return url.origin === APP_ORIGIN && !url.username && !url.password; }
  catch { return false; }
}
module.exports = { APP_URL, isAppUrl };
