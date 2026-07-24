import { useState } from 'react';
import { cn } from '../utils/cn';
import { BookOpen, Terminal, Database } from 'lucide-react';

export default function ModuleLayout({ theoryContent, editorContent, dataContent }) {
  const [activeTab, setActiveTab] = useState('theory');

  return (
    <div className="flex flex-col w-full overflow-hidden bg-background" style={{ height: 'calc(100vh - 3rem)' }}>
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* COLUMN 1: Theory */}
        <div className={cn(
          "w-full lg:w-[30%] h-full border-r border-border flex flex-col bg-card/30 overflow-y-auto shrink-0",
          activeTab !== 'theory' ? "hidden lg:flex" : "flex"
        )}>
          {theoryContent}
        </div>

        {/* COLUMN 2: Editor */}
        <div className={cn(
          "w-full lg:w-[35%] h-full flex flex-col bg-zinc-950 border-r border-border shrink-0",
          activeTab !== 'editor' ? "hidden lg:flex" : "flex"
        )}>
          {editorContent}
        </div>

        {/* COLUMN 3: Data */}
        <div className={cn(
          "w-full lg:flex-1 h-full flex flex-col overflow-y-auto p-4 gap-4 bg-zinc-950/20 relative min-w-[350px]",
          activeTab !== 'data' ? "hidden lg:flex" : "flex"
        )}>
          {dataContent}
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden flex items-center justify-around border-t border-border bg-zinc-950 p-2 shrink-0 z-50">
        <button 
          onClick={() => setActiveTab('theory')}
          className={cn("flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors text-xs font-medium", activeTab === 'theory' ? "text-accent bg-accent/10" : "text-zinc-500 hover:text-zinc-300")}
        >
          <BookOpen size={18} />
          Lesson
        </button>
        <button 
          onClick={() => setActiveTab('editor')}
          className={cn("flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors text-xs font-medium", activeTab === 'editor' ? "text-accent bg-accent/10" : "text-zinc-500 hover:text-zinc-300")}
        >
          <Terminal size={18} />
          Editor
        </button>
        <button 
          onClick={() => setActiveTab('data')}
          className={cn("flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors text-xs font-medium", activeTab === 'data' ? "text-accent bg-accent/10" : "text-zinc-500 hover:text-zinc-300")}
        >
          <Database size={18} />
          Data
        </button>
      </div>
    </div>
  );
}
