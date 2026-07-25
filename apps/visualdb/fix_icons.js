import fs from 'fs';
import { globSync } from 'glob';

const modules = globSync('src/modules/*/*.jsx');

for (const file of modules) {
  let content = fs.readFileSync(file, 'utf8');

  let changed = false;

  // Remove function BookIcon()
  const bookIconStart = content.indexOf('function BookIcon()');
  if (bookIconStart !== -1) {
    // Find the end of it. It looks like:
    // function BookIcon() {
    // ...
    // }
    const bookIconEnd = content.indexOf('}', bookIconStart);
    if (bookIconEnd !== -1) {
      content = content.substring(0, bookIconStart) + content.substring(bookIconEnd + 1);
      changed = true;
    }
  }

  // Remove function CodeIcon()
  const codeIconStart = content.indexOf('function CodeIcon()');
  if (codeIconStart !== -1) {
    const codeIconEnd = content.indexOf('}', codeIconStart);
    if (codeIconEnd !== -1) {
      content = content.substring(0, codeIconStart) + content.substring(codeIconEnd + 1);
      changed = true;
    }
  }

  // Sometimes there are empty spaces at the end of the file now, we can trim
  content = content.trim() + '\n';

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Removed duplicate icons in ${file}`);
  }
}
