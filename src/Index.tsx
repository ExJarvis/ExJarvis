import { render } from 'react-dom';
import React from 'react';
import App from './pages/App/view';
import 'antd/dist/antd.css';

const main = () => {
  const mainElement = document.createElement('div');
  mainElement.setAttribute('id', 'root');
  document.body.appendChild(mainElement);
  render(<App />, mainElement);
};

main();
