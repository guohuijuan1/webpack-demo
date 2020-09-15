import {join} from 'lodash';
import largeNumber from 'large-number-ghj';

function component() {
  const element = document.createElement('div');
  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = join(['Hello', 'webpack', largeNumber('123', '678')], ' ');
  return element;
}

document.body.appendChild(component());