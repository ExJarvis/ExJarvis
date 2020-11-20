import puppeteer, { Page } from 'puppeteer-core';

const getBrowser = async () => {
  const browser = await puppeteer.launch({
    executablePath: require('chrome-location'),
    // devtools: true,
    // headless: false,
  });
  return browser;
};

export const scrape = async () => {
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  await page.screenshot({ path: '/Users/pulkitsingh/dev/chaakar/dist/example.png' });

  await browser.close();
};

const log = async (page: Page) => {
  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  await page.evaluate(() => console.log(`url is ${location.href}`));
};

export const search = async () => {
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto('https://duckduckgo.com/?q=sdf', { waitUntil: 'networkidle2' });
  // await page.type('#search_form_input_homepage', 'Puppeteer');
  // await page.click('#search_button_homepage');
  const selector = '//*/div/h2';
  await page.waitForXPath(selector);
  const searchValue = await page.$x(selector);
  await page.screenshot({ path: '/Users/pulkitsingh/dev/chaakar/dist/example.png' });
  searchValue.map(async (element) => {
    console.log(
      await page.evaluate((el) => {
        const title = el.textContent;
        const link = el.querySelector('a')?.getAttribute('href');
        return {
          title,
          link,
        };
      }, element)
    );
  });
  log(page);
  // await browser.close();
};

const main = () => {
  try {
    search();
  } catch (e) {
    console.log({ e });
  }
};

main();
