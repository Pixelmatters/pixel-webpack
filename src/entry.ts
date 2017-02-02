require('./style.scss');
declare var DEVMODE: boolean;

import {text} from './content';

document.write(text); 
console.log('Text',text); 
console.log('Env', DEVMODE);

