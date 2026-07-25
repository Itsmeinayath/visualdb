const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.jsx')) {
      files.push(name);
    }
  }
  return files;
}

const modules = getFiles('C:/Users/moham/.gemini/antigravity-ide/scratch/visualcs/apps/visualdb/src/modules');

for (const file of modules) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Regex to exactly match the opening wrapper, handling \r\n
  const openingDivRegex = /\{\/\* COLUMN 2: Editor & Trace \*\/\}\r?\n\s*<div className="w-full lg:w-\[35%\] h-full flex flex-col bg-zinc-950 border-r border-border shrink-0">/;
  
  if (openingDivRegex.test(content)) {
    // 1. Remove opening wrapper
    content = content.replace(openingDivRegex, '');
    
    // 2. Remove the single corresponding closing </div> before dataContent (handling \r\n)
    const closingDivRegex = /<\/div>\r?\n\s*<\/>\r?\n\s*}\r?\n\s*dataContent=\{/;
    if (closingDivRegex.test(content)) {
      content = content.replace(closingDivRegex, '</>\n      }\n      dataContent={');
      changed = true;
    } else {
      console.log(`Failed to find closing tag in ${file}!`);
      // Revert the opening tag removal if closing tag not found so we don't break syntax
      content = fs.readFileSync(file, 'utf8');
    }
  }

  // Also fix missing useEffect in PlaygroundModule
  if (file.includes('PlaygroundModule.jsx')) {
    if (!content.includes('import { useState, useEffect } from "react";')) {
      content = content.replace(
        'import { useState } from "react";',
        'import { useState, useEffect } from "react";'
      );
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed layout perfectly in: ${file}`);
  }
}
console.log('Done!');
