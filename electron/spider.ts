import puppeteer from 'puppeteer';
import { getChromePath } from './utils';

puppeteer.launch({executablePath: getChromePath()});
