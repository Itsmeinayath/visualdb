import { useState } from 'react';
import { cn } from '../utils/cn';
import { BookOpen, Terminal } from 'lucide-react';

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

        {/* COLUMNS 2 & 3: Workspace (Combined on mobile) */}
        <div className={cn(
          "w-full lg:flex-1 flex-col lg:flex-row overflow-y-auto lg:overflow-hidden min-h-0",
          activeTab !== 'interactive' ? "hidden lg:flex" : "flex"
        )}>
          {/* COLUMN 2: Editor */}
          <div className="w-full lg:w-[50%] lg:h-full flex flex-col bg-zinc-950 border-b lg:border-b-0 lg:border-r border-border shrink-0 min-h-[500px] lg:min-h-0">
            {editorContent}
          </div>

          {/* COLUMN 3: Data */}
          <div className="w-full lg:flex-1 lg:h-full flex flex-col overflow-y-visible lg:overflow-y-auto p-4 gap-4 bg-zinc-950/20 relative min-h-[500px] lg:min-h-0">
            {dataContent}
          </div>
        </div>

      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden flex items-center justify-around border-t border-border bg-zinc-950 p-2 shrink-0 z-50">
        <button 
          onClick={() => setActiveTab('theory')}
          className={cn("flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors text-xs font-medium w-1/2", activeTab === 'theory' ? "text-accent bg-accent/10" : "text-zinc-500 hover:text-zinc-300")}
        >
          <BookOpen size={18} />
          Lesson
        </button>
        <button 
          onClick={() => setActiveTab('interactive')}
          className={cn("flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors text-xs font-medium w-1/2", activeTab === 'interactive' ? "text-accent bg-accent/10" : "text-zinc-500 hover:text-zinc-300")}
        >
          <Terminal size={18} />
          Workspace
        </button>
      </div>
    </div>
  );
}
