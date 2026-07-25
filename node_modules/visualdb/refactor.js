import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const modules = globSync('src/modules/*/*.jsx');

for (const file of modules) {
  if (file.includes('SelectModule.jsx')) continue; // Already done

  let content = fs.readFileSync(file, 'utf8');

  // Check if it already uses ModuleLayout
  if (content.includes('ModuleLayout')) continue;

  // 1. Add imports
  let newContent = content.replace(
    /import \{.*\} from "lucide-react";/,
    (match) => {
      let m = match;
      if (!m.includes('Code as CodeIcon')) {
        m = m.replace('}', ', Code as CodeIcon, Book as BookIcon }');
      }
      return m + '\nimport ModuleLayout from "../../components/ModuleLayout";';
    }
  );
  
  // if lucide import wasn't found or was slightly different, let's just make sure ModuleLayout is imported
  if (!newContent.includes('import ModuleLayout')) {
    newContent = newContent.replace('import { Link } from "react-router-dom";', 'import { Link } from "react-router-dom";\nimport ModuleLayout from "../../components/ModuleLayout";');
  }

  // 2. Extract the three columns
  // The layout starts at:
  // <div className="flex flex-col lg:flex-row w-full overflow-hidden bg-background" style={{ height: 'calc(100vh - 3rem)' }}>
  const mainDivRegex = /<div className="flex flex-col lg:flex-row w-full overflow-hidden bg-background" style=\{\{ height: 'calc\(100vh - 3rem\)' \}\}>/g;
  
  const match = mainDivRegex.exec(newContent);
  if (!match) {
    console.log(`Could not find main div in ${file}`);
    continue;
  }
  
  const startIndex = match.index;
  
  // Find the end of the return statement.
  // It's usually the second to last `);`
  const returnEndIndex = newContent.lastIndexOf('  );');
  
  if (returnEndIndex === -1) {
    console.log(`Could not find return end in ${file}`);
    continue;
  }
  
  const layoutContent = newContent.substring(startIndex + match[0].length, returnEndIndex);
  
  // Split layoutContent by the column markers:
  // {/* COLUMN 1: ... */}
  // {/* COLUMN 2: ... */}
  // {/* COLUMN 3: ... */}
  
  const col1Match = layoutContent.indexOf('{/* COLUMN 1');
  const col2Match = layoutContent.indexOf('{/* COLUMN 2');
  const col3Match = layoutContent.indexOf('{/* COLUMN 3');
  
  if (col1Match === -1 || col2Match === -1 || col3Match === -1) {
    console.log(`Could not find columns in ${file}`);
    continue;
  }
  
  // we need the inner HTML of the columns, not the wrapper div.
  // Actually, we can just replace the wrappers. 
  // Let's just wrap everything from col1 to col2 in theoryContent.
  
  let col1Str = layoutContent.substring(col1Match, col2Match).trim();
  let col2Str = layoutContent.substring(col2Match, col3Match).trim();
  let col3Str = layoutContent.substring(col3Match).trim();

  // Strip out the wrapper divs of each column.
  // Col 1 wrapper usually starts with `<div className="w-full lg:w-[30%]...`
  // and ends with `</div>` right before col2Match.
  
  const removeOuterDiv = (str) => {
    const firstDivStart = str.indexOf('<div');
    const firstDivEnd = str.indexOf('>', firstDivStart);
    if (firstDivStart === -1 || firstDivEnd === -1) return str;
    
    // Find matching closing div
    let openCount = 0;
    let i = firstDivStart;
    while (i < str.length) {
      if (str.startsWith('<div', i)) openCount++;
      else if (str.startsWith('</div', i)) {
        openCount--;
        if (openCount === 0) {
          // Found closing tag. The inner content is between firstDivEnd + 1 and i
          return str.substring(firstDivEnd + 1, i).trim();
        }
      }
      i++;
    }
    return str; // Fallback
  };
  
  const theoryInner = removeOuterDiv(col1Str);
  const editorInner = removeOuterDiv(col2Str);
  const dataInner = removeOuterDiv(col3Str);
  
  const replacement = `<ModuleLayout
      theoryContent={
        <>
${theoryInner}
        </>
      }
      editorContent={
        <>
${editorInner}
        </>
      }
      dataContent={
        <>
${dataInner}
        </>
      }
    />`;

  newContent = newContent.substring(0, startIndex) + replacement + newContent.substring(returnEndIndex);
  
  fs.writeFileSync(file, newContent);
  console.log(`Successfully refactored ${file}`);
}
