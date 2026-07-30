import { useState, useRef } from 'react';
import { cn } from '../utils/cn';
import { BookOpen, Terminal, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function ModuleLayout({ theoryContent, editorContent, dataContent }) {
  const [activeTab, setActiveTab] = useState('theory');
  const [isLessonCollapsed, setIsLessonCollapsed] = useState(false);
  const theoryPanelRef = useRef(null);

  const toggleLesson = () => {
    const panel = theoryPanelRef.current;
    if (panel) {
      if (isLessonCollapsed) {
        panel.expand();
        setIsLessonCollapsed(false);
      } else {
        panel.collapse();
        setIsLessonCollapsed(true);
      }
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-background relative" style={{ height: 'calc(100vh - 3rem)' }}>
      
      {/* Floating Toggle Button (visible only when collapsed on desktop) */}
      {isLessonCollapsed && (
        <button
          onClick={toggleLesson}
          className="hidden lg:flex absolute left-4 top-4 z-50 bg-zinc-900/80 backdrop-blur border border-zinc-700 p-2 rounded-md shadow-lg text-zinc-400 hover:text-white transition-all hover:scale-105"
          title="Show Lesson"
        >
          <PanelLeftOpen size={18} />
        </button>
      )}

      {/* DESKTOP LAYOUT (Uses Resizable Panels) */}
      <div className="hidden lg:flex flex-1 w-full h-full min-h-0">
        <PanelGroup direction="horizontal" autoSaveId="visualdb-layout">
          
          {/* COLUMN 1: Theory */}
          <Panel 
            ref={theoryPanelRef}
            collapsible={true}
            collapsedSize={0}
            defaultSize={30}
            minSize={20}
            onCollapse={() => setIsLessonCollapsed(true)}
            onExpand={() => setIsLessonCollapsed(false)}
            className={cn(
              "h-full flex flex-col bg-card/30 transition-opacity duration-300 relative",
              isLessonCollapsed ? "opacity-0" : "opacity-100"
            )}
          >
            <div className="h-full overflow-y-auto flex flex-col relative">
              <button
                onClick={toggleLesson}
                className="absolute right-4 top-4 z-50 bg-zinc-900/50 hover:bg-zinc-800 p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 transition-all"
                title="Hide Lesson"
              >
                <PanelLeftClose size={16} />
              </button>
              {theoryContent}
            </div>
          </Panel>

          {!isLessonCollapsed && (
            <PanelResizeHandle className="w-1.5 bg-border/50 hover:bg-accent/50 transition-colors cursor-col-resize flex flex-col items-center justify-center">
              <div className="h-8 w-1 rounded-full bg-zinc-600/50" />
            </PanelResizeHandle>
          )}

          {/* COLUMN 2: Editor */}
          <Panel defaultSize={35} minSize={20} className="h-full flex flex-col bg-zinc-950 relative">
            {editorContent}
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-border/50 hover:bg-accent/50 transition-colors cursor-col-resize flex flex-col items-center justify-center">
            <div className="h-8 w-1 rounded-full bg-zinc-600/50" />
          </PanelResizeHandle>

          {/* COLUMN 3: Data */}
          <Panel defaultSize={35} minSize={20} className="h-full flex flex-col bg-zinc-950/20 p-4 gap-4 overflow-y-auto">
            {dataContent}
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
