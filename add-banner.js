const fs = require('fs');
const path = require('path');

const pkg = require(process.env.PWD +'/package.json');
const banner = `/*!
 * ${pkg.name} ${pkg.version}
 * Licensed under the ${pkg.license} license.
 * ${pkg.homepage}
 */
`;

const filePath = path.join(process.env.PWD, 'dist/tobii.min.js');
const content = fs.readFileSync(filePath, 'utf8');
const output = banner + '\n' + content;
fs.writeFileSync(filePath, output);

console.log('Banner prepended to ' + filePath);
