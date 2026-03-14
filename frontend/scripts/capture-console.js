const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', (msg) => {
    console.log('[PAGE]', msg.type(), msg.text());
    for (const arg of msg.args()) {
      arg.jsonValue().then((v) => {
        if (typeof v === 'object') {
          console.log('   ', JSON.stringify(v, null, 2));
        }
      });
    }
  });

  page.on('pageerror', (err) => {
    console.error('[PAGE ERROR]', err);
  });

  page.on('requestfailed', (req) => {
    console.warn('[REQUEST FAILED]', req.url(), req.failure()?.errorText);
  });

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    // wait to allow any runtime errors to surface
    await page.waitForTimeout(2000);
  } catch (err) {
    console.error('Navigation error', err);
  } finally {
    await browser.close();
  }
})();
