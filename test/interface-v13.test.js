'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'../public/app.js'),'utf8');
const style=fs.readFileSync(path.join(__dirname,'../public/styles.css'),'utf8');
const pkg=require('../package.json');
const relevant=(name)=>app.split('\n').find(line=>line.startsWith(`function ${name}(`))||'';
test('v1.3 footer has only the design credit and version',()=>{
 assert.equal(pkg.version,'1.3.0');
 const footer=relevant('footer');
 assert.match(footer,/WEBOIQ ✦ ENKI/);
 assert.match(footer,/نسخة 1\.3/);
 assert.doesNotMatch(footer,/data-do|rulesButton|الراوي يدير القوانين|المناقشة/);
});
test('game room has rules and leave controls outside the footer',()=>{
 const header=relevant('header');
 assert.match(header,/class=\\?"room-tools/);
 assert.match(header,/data-do=\\?"rules/);
 assert.match(header,/data-do=\\?"leave/);
});
test('on mobile, role reveal comes before action and reveal art is enlarged',()=>{
 assert.equal((app.match(/class="grid2 role-screen"/g)||[]).length,2);
 assert.match(style,/\.role-screen>\.role-identify\{order:-1\}/);
 assert.match(style,/width:min\(77vw,248px\)/);
 assert.match(style,/max-width:292px/);
});
test('visible phase wording is end of round, while internal event names remain supported',()=>{
 assert.match(app,/night:'نهاية الجولة'/);
 assert.match(app,/night:'End of round'/);
 assert.match(app,/night:submit/);
 assert.doesNotMatch(app,/ليلاً|الليل|ليلة|الليلة/);
});
