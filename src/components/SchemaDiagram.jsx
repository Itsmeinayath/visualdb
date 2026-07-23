import { KeyRound, ArrowRightLeft } from "lucide-react";

export default function SchemaDiagram({ leftTable, rightTable, leftKey, rightKey }) {
  return (
    <div className="flex flex-col h-full justify-between">
      <h3 className="font-semibold text-sm text-zinc-300 mb-3 flex items-center gap-2">
        <ArrowRightLeft size={16} className="text-accent" /> Schema Relationship
      </h3>
      
      <div className="flex-1 flex items-center justify-between bg-zinc-950/80 p-4 rounded-lg border border-zinc-800/80 relative">
        
        {/* Left Table Node */}
        <div className="flex flex-col bg-zinc-900 border border-zinc-700 rounded-md w-[35%] text-center shadow-lg z-10">
          <div className="bg-blue-500/10 text-blue-400 font-bold text-[11px] uppercase tracking-wider py-1.5 border-b border-blue-500/20">
            {leftTable}
          </div>
          <div className="py-2.5 px-2 flex items-center justify-center gap-1.5 text-xs font-mono text-zinc-200">
            <KeyRound size={12} className="text-amber-500 shrink-0" />
            <span className="truncate">{leftKey}</span>
          </div>
        </div>

        {/* Connection Line */}
        <div className="flex-1 flex flex-col items-center px-2 relative -mx-2">
          <div className="text-[10px] text-zinc-500 font-mono mb-0.5 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800 relative z-20 shadow-sm whitespace-nowrap">
            FOREIGN KEY
          </div>
          {/* Animated dashed line */}
          <div className="w-full h-px relative -mt-2 z-0 overflow-hidden">
             <div className="absolute inset-0 w-[200%] h-full bg-[linear-gradient(90deg,transparent_0%,transparent_50%,rgba(168,85,247,0.5)_50%,rgba(168,85,247,0.5)_100%)] bg-[length:12px_1px] animate-[slide_1s_linear_infinite]" />
             <style>{`
               @keyframes slide {
                 to { transform: translateX(-12px); }
               }
             `}</style>
          </div>
        </div>

        {/* Right Table Node */}
        <div className="flex flex-col bg-zinc-900 border border-zinc-700 rounded-md w-[35%] text-center shadow-lg z-10">
          <div className="bg-orange-500/10 text-orange-400 font-bold text-[11px] uppercase tracking-wider py-1.5 border-b border-orange-500/20">
            {rightTable}
          </div>
          <div className="py-2.5 px-2 flex items-center justify-center gap-1.5 text-xs font-mono text-zinc-200">
            <KeyRound size={12} className="text-amber-500 shrink-0" />
            <span className="truncate">{rightKey}</span>
          </div>
        </div>

      </div>
      
      <p className="text-[11px] text-zinc-500 mt-3 text-center">
        The database links rows where <code className="text-blue-400/80 font-mono bg-blue-500/10 px-1 py-0.5 rounded">{leftTable}.{leftKey}</code> == <code className="text-orange-400/80 font-mono bg-orange-500/10 px-1 py-0.5 rounded">{rightTable}.{rightKey}</code>
      </p>
    </div>
  );
}
