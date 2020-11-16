// ref: https://github.com/ant-motion/ant-design-3.x-landing-page/tree/cb0682f3fc865112b488b3e974c0e3a201eda9b0

import { render } from 'react-dom';
import React from 'react';
import Home from './github.io/Home/view';
import 'antd/dist/antd.css';

const main = () => {
  const mainElement = document.createElement('div');
  mainElement.setAttribute('id', 'root');
  document.body.appendChild(mainElement);
  render(<Home />, mainElement);
};

main();
