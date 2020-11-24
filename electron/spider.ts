import puppeteer, { Page } from 'puppeteer-core';
import { waitForCondition } from './utils';

export class Spider {
  private static instance: Spider;
  private browser?: puppeteer.Browser;
  private launchingBrowser: boolean = false;

  private constructor() {
    this.init();
  }

  public static getInstance(): Spider {
    if (!Spider.instance) {
      Spider.instance = new Spider();
    }
    return Spider.instance;
  }

  private init = async () => {
    this.launchBrowser(); // Keeps the browser ready
    // this.log();
  };

  private launchBrowser = async () => {
    this.launchingBrowser = true;
    this.browser = await puppeteer.launch({
      executablePath: require('chrome-location'),
      // devtools: true,
      // headless: false,
    });
    this.launchingBrowser = false;
    // console.log({ browser });
  };

  private getBrowser = async () => {
    if(!this.browser) {
      if(this.launchingBrowser) {
        await waitForCondition(() => !this.launchingBrowser);
      } else {
        await this.launchBrowser();
      }
    }
    return this.browser;
  };

  private log = async (page: Page) => {
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
    await page.evaluate(() => console.log(`url is ${location.href}`));
  };

  public search = async ({
    query,
  } : {
    query: string
  }) => {
    // await this.ensureBrowser();
    // if(!this.browser) return [];
    // console.log({ browser: this.browser });

    // const page = await this.browser.newPage();

    const browser = await this.getBrowser();
    if(!browser) return;

    // const page = await browser.newPage();
    const page = (await browser.pages())[0];

    // https://github.com/puppeteer/puppeteer/issues/1922#issuecomment-594607547
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

    await page.goto(`https://duckduckgo.com/?q=${query}`, { waitUntil: 'networkidle2' });
    // await page.type('#search_form_input_homepage', 'Puppeteer');
    // await page.click('#search_button_homepage');
    const selector = '//*[@id]/div/h2';
    await page.waitForXPath(selector);
    const searchValue = await page.$x(selector);
    // await page.screenshot({ path: '/Users/pulkitsingh/dev/chaakar/dist/example.png' });
    const results = searchValue.map(async (element) => {
      return await page.evaluate((el) => {
        const title = el.textContent;
        const link = el.querySelector('a')?.getAttribute('href');
        return {
          title,
          link,
        };
      }, element);
    });
    // log(page);
    // await browser.close();
    return await Promise.all(results);
  };
}

export const scrape = async () => {
  const browser = Spider.getInstance().browser;
  const page = await browser?.newPage();
  await page?.goto('https://www.google.com');
  await page?.screenshot({ path: '/Users/pulkitsingh/dev/chaakar/dist/example.png' });

  await browser?.close();
};


const main = () => {
  try {
    Spider.getInstance().search({ query: 'activeJS' });
  } catch (e) {
    // console.log({ e });
  }
};

// main();
