import {isValidIP} from '../utils/functions.js';

const v1 = '192.168.0.4';
const v2 = '192.168';

isValidIP(v1) ? console.log(`${v1}  ::  SI es una IP valida`) : console.error(`${v1}  ::  NO es una IP valida`);
isValidIP(v2) ? console.log(`${v2}  ::  SI es una IP valida`) : console.error(`${v2}  ::  NO es una IP valida`);