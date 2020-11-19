import { render } from 'react-dom';
import React from 'react';
import App from './pages/App/view';
import 'antd/dist/antd.css';
import * as Sentry from "@sentry/electron";

const initSentry = () => {
  Sentry.init({ dsn: "https://c8f88d7866e442d3927ccd924b7b9ecf@o306873.ingest.sentry.io/1766096" });
};

const main = () => {
  const mainElement = document.createElement('div');
  mainElement.setAttribute('id', 'root');
  document.body.appendChild(mainElement);
  render(<App />, mainElement);
  initSentry();
};

main();
