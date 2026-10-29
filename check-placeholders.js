// Run before merging mac-launch to main:  node check-placeholders.js
// Exits 1 while the Lemon Squeezy checkout placeholder is still in the Mac page.
const fs = require('fs');
const path = require('path');

const PLACEHOLDERS = ['LEMON_SQUEEZY_CHECKOUT_URL'];
const FILES = ['mac/index.html', 'buy/index.html'];

let bad = 0;
for (const f of FILES) {
  const text = fs.readFileSync(path.join(__dirname, f), 'utf8');
  for (const p of PLACEHOLDERS) {
    if (text.includes(p)) {
      console.error(`${f}: still contains ${p}`);
      bad++;
    }
  }
}
if (bad) {
  console.error('Do not deploy: put the real Lemon Squeezy checkout URL in mac/index.html first.');
  process.exit(1);
}
console.log('No placeholders left.');
