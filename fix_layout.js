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

const modules = getFiles('apps/visualdb/src/modules');

for (const file of modules) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix 1: Missing useEffect in PlaygroundModule
  if (file.includes('PlaygroundModule.jsx')) {
    if (!content.includes('import { useState, useEffect } from "react";')) {
      content = content.replace(
        'import { useState } from "react";',
        'import { useState, useEffect } from "react";'
      );
    }
  }

  // Fix 2: Double wrapping in editorContent
  if (content.includes('editorContent={')) {
    const openingDivRegex = /\{\/\* COLUMN 2: Editor & Trace \*\/\}\s*<div className="w-full lg:w-\[35%\] h-full flex flex-col bg-zinc-950 border-r border-border shrink-0">/g;
    content = content.replace(openingDivRegex, '{/* COLUMN 2: Editor & Trace */}');
    
    const closingDivRegex = /<\/div>\n\s*<\/>\n\s*}\n\s*dataContent=\{/g;
    content = content.replace(closingDivRegex, '</>\n      }\n      dataContent={');
  }

  // Fix 3: Double wrapping in dataContent as well! (Let's check if dataContent had a wrapper)
  // Actually, wait, dataContent had TWO inner flex columns. So removing a single wrapper div is not applicable.
  // The bug is specifically the w-[35%] inside editorContent because it forces it to 35% of 35%.
  // In dataContent, the flex-1 elements inside were fine because the parent was just the ModuleLayout column.

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Fixed all modules!');
