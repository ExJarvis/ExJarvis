import { render } from 'react-dom';
import React from 'react';
import Home from './github.io/Home/view';

const main = () => {
  const mainElement = document.createElement('div');
  mainElement.setAttribute('id', 'root');
  document.body.appendChild(mainElement);
  render(<Home />, mainElement);
};

main();
