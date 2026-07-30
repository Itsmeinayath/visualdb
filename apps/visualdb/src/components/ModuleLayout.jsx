import { useState } from 'react';
import { cn } from '../utils/cn';
import { BookOpen, Terminal } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function ModuleLayout({ theoryContent, editorContent, dataContent }) {
  const [activeTab, setActiveTab] = useState('theory');

  return (
    <div className="flex flex-col w-full overflow-hidden bg-background relative" style={{ height: 'calc(100vh - 3rem)' }}>
      
      {/* DESKTOP LAYOUT (Uses Resizable Panels) */}
      <div className="hidden lg:flex flex-1 w-full h-full min-h-0">
        <PanelGroup direction="horizontal" autoSaveId="visualdb-layout">
          
          {/* COLUMN 1: Theory */}
          <Panel 
            defaultSize={30}
            minSize={20}
            className="bg-card/30"
          >
            <div className="h-full w-full overflow-y-auto flex flex-col">
              {theoryContent}
            </div>
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-border/50 hover:bg-accent/50 transition-colors cursor-col-resize flex flex-col items-center justify-center">
            <div className="h-8 w-1 rounded-full bg-zinc-600/50" />
          </PanelResizeHandle>

          {/* COLUMN 2: Editor */}
          <Panel defaultSize={35} minSize={20} className="bg-zinc-950">
            <div className="h-full w-full flex flex-col">
              {editorContent}
            </div>
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-border/50 hover:bg-accent/50 transition-colors cursor-col-resize flex flex-col items-center justify-center">
            <div className="h-8 w-1 rounded-full bg-zinc-600/50" />
          </PanelResizeHandle>

          {/* COLUMN 3: Data */}
          <Panel defaultSize={35} minSize={20} className="bg-zinc-950/20">
            {/* Inner scrollable container to bypass Panel's inline overflow:hidden */}
            <div className="h-full w-full flex flex-col p-4 gap-4 overflow-y-auto">
              {dataContent}
            </div>
          </Panel>

        </PanelGroup>
      </div>

      {/* MOBILE LAYOUT (Stack based on activeTab) */}
      <div className="flex-1 lg:hidden flex flex-col overflow-hidden min-h-0">
        
        {/* Theory Tab */}
        <div className={cn(
          "w-full h-full border-b border-border flex flex-col bg-card/30 overflow-y-auto shrink-0",
          activeTab !== 'theory' ? "hidden" : "flex"
        )}>
          {theoryContent}
        </div>

        {/* Workspace Tab (Editor + Data stacked vertically) */}
        <div className={cn(
          "w-full flex-col overflow-y-auto min-h-0",
          activeTab !== 'interactive' ? "hidden" : "flex"
        )}>
          <div className="w-full flex flex-col bg-zinc-950 border-b border-border shrink-0 min-h-[500px]">
            {editorContent}
          </div>
          <div className="w-full flex flex-col p-4 gap-4 bg-zinc-950/20 relative min-h-[500px]">
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
