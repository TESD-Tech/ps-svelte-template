import puppeteer from 'puppeteer';

const ports = [5173, 5174];
let success = false;
let lastError = null;

for (const port of ports) {
  const url = `http://localhost:${port}/ps-svelte-template/minimal.html`;
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });

    // Wait for the custom element to be defined and rendered
    await page.waitForSelector('svelte-minimal', { timeout: 5000 });

    // Find the button inside the shadow DOM of <svelte-minimal>
    const buttonText = await page.evaluate(() => {
      const el = document.querySelector('svelte-minimal');
      if (!el) return null;
      const shadow = el.shadowRoot;
      if (!shadow) return null;
      const button = shadow.querySelector('button');
      return button ? button.textContent : null;
    });

    if (buttonText) {
      console.log('PASS: Button found with text:', buttonText);
      await browser.close();
      success = true;
      process.exit(0);
    } else {
      console.error('FAIL: Button not found in <svelte-minimal>');
      await browser.close();
      process.exit(1);
    }
  } catch (err) {
    lastError = err;
    // Try next port
  }
}

console.error('FAIL: Could not connect to dev server or find button.', lastError);
process.exit(1);