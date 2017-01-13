require('./style.scss');
import text from './content';
document.write(text);

console.log('Env', (window as any).ENV);