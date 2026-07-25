import { useState } from "react";
import { Link } from "react-router-dom";
import { Code2, Play, Pause, RotateCcw, SkipBack, SkipForward, Maximize2 } from "lucide-react";

export default function ProblemPage({ problemId }) {
  const [viewMode, setViewMode] = useState("animation"); // "problem" | "animation"

  return (
    <div className="h-full flex flex-col p-6 max-w-6xl mx-auto w-full">
      
      {/* Header */}
      <header className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] uppercase tracking-widest font-bold text-[#8c877d]">Problem</div>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold font-serif tracking-tight">{
              problemId === 'two-sum-ii' ? 'Two Sum II' : 
              problemId === 'valid-palindrome' ? 'Valid Palindrome' : 
              '3Sum'
            }</h1>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full border border-[#8c877d]/30 text-[10px] text-[#8c877d] font-mono">LeetCode #{problemId === 'two-sum-ii' ? '167' : '125'}</span>
              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${problemId === 'two-sum-ii' ? 'bg-[#e78253]/10 border-[#e78253]/20 text-[#e78253]' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                {problemId === 'two-sum-ii' ? 'MEDIUM' : 'EASY'}
              </span>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-[#141311] border border-[#33312c] rounded-lg p-1">
          <button 
            onClick={() => setViewMode("problem")}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${viewMode === 'problem' ? 'bg-[#f3f0e6] text-[#141311]' : 'text-[#8c877d] hover:text-[#f3f0e6]'}`}
          >
            Problem Description
          </button>
          <button 
            onClick={() => setViewMode("animation")}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${viewMode === 'animation' ? 'bg-[#f3f0e6] text-[#141311]' : 'text-[#8c877d] hover:text-[#f3f0e6]'}`}
          >
            Animation View
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {viewMode === "problem" ? (
        <div className="flex-1 bg-[#141311] border border-[#33312c] rounded-xl p-8 overflow-y-auto">
           <h2 className="text-xl font-bold mb-4">Description</h2>
           <p className="text-[#8c877d] leading-relaxed mb-4">
             Given a 1-indexed array of integers <code className="bg-[#1e1d1a] px-1.5 py-0.5 rounded text-[#e78253]">numbers</code> that is already sorted in non-decreasing order, find two numbers such that they add up to a specific <code className="bg-[#1e1d1a] px-1.5 py-0.5 rounded text-[#e78253]">target</code> number. Let these two numbers be <code className="bg-[#1e1d1a] px-1.5 py-0.5 rounded text-[#e78253]">numbers[index1]</code> and <code className="bg-[#1e1d1a] px-1.5 py-0.5 rounded text-[#e78253]">numbers[index2]</code> where 1 &lt;= index1 &lt; index2 &lt;= numbers.length.
           </p>
           <button 
             onClick={() => setViewMode("animation")}
             className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-[#e78253] text-[#141311] font-bold rounded-lg hover:bg-[#e78253]/90 transition-colors"
           >
             Start Animation <Play size={16} fill="currentColor" />
           </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0 gap-6">
          {/* Top Half: Visuals & Code */}
          <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
            {/* Left: Visualization Engine */}
            <div className="flex-1 bg-[#141311] border border-[#33312c] rounded-xl relative overflow-hidden flex flex-col">
              <div className="absolute top-4 right-4 flex items-center gap-4 text-xs font-mono text-[#8c877d]">
                <span>time <strong className="text-[#f3f0e6]">O(n)</strong></span>
                <span>space <strong className="text-[#f3f0e6]">O(1)</strong></span>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                 <div className="text-[#8c877d] font-mono text-sm border border-dashed border-[#33312c] p-12 rounded-xl">
                   [ Visualization Engine Placeholder ]
                 </div>
              </div>
            </div>

            {/* Right: Code Block */}
            <div className="w-full lg:w-[400px] flex flex-col gap-4">
              <div className="flex-1 bg-[#141311] border border-[#33312c] rounded-xl flex flex-col overflow-hidden">
                <div className="px-4 py-3 border-b border-[#33312c] flex items-center justify-between">
                  <span className="font-bold">Optimized <span className="text-[#8c877d] font-normal">· two pointers</span></span>
                  <button className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#33312c] text-xs font-bold text-[#8c877d] hover:text-[#f3f0e6] transition-colors">
                    <Code2 size={12} /> Practice
                  </button>
                </div>
                <div className="flex-1 p-4 font-mono text-xs leading-loose text-[#8c877d] overflow-y-auto">
                   <div className="flex"><span className="w-6 text-right mr-4 opacity-50">1</span><span>L, R = 0, n - 1</span></div>
                   <div className="flex"><span className="w-6 text-right mr-4 opacity-50">2</span><span>while L &lt; R:</span></div>
                   <div className="flex text-[#e78253] bg-[#e78253]/10 -mx-4 px-4 py-0.5 border-l-2 border-[#e78253]"><span className="w-6 text-right mr-4 opacity-50">3</span><span>sum = arr[L] + arr[R]</span></div>
                   <div className="flex"><span className="w-6 text-right mr-4 opacity-50">4</span><span>if sum == target: return [L, R]</span></div>
                   <div className="flex"><span className="w-6 text-right mr-4 opacity-50">5</span><span>if sum &lt; target: L += 1</span></div>
                   <div className="flex"><span className="w-6 text-right mr-4 opacity-50">6</span><span>else: R -= 1</span></div>
                </div>
              </div>
              
              <div className="h-32 bg-[#141311] border border-[#33312c] rounded-xl flex flex-col overflow-hidden">
                 <div className="px-4 py-2 border-b border-[#33312c]">
                   <span className="font-bold text-xs">state</span>
                 </div>
                 <div className="flex-1 p-4 font-mono text-xs flex flex-col justify-center gap-2">
                   <div className="flex justify-between">
                     <span className="text-[#8c877d]">L</span>
                     <span className="text-[#f3f0e6]">0</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-[#8c877d]">R</span>
                     <span className="text-[#f3f0e6]">5</span>
                   </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Bottom Half: Playback & Explanations */}
          <div className="shrink-0 flex flex-col gap-4">
            <div className="bg-[#141311] border border-[#33312c] rounded-xl p-4 flex items-center gap-4 text-sm font-mono text-[#8c877d]">
               <div className="px-2 py-0.5 rounded border border-[#e78253]/50 text-[#e78253] text-[10px] uppercase">line 3</div>
               L = 0, R = 5. sum = 2 + 19 = 21. Since 21 &gt; 14, move the right pointer left to decrease the sum.
            </div>

            <div className="bg-[#141311] border border-[#33312c] rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded hover:bg-[#33312c] text-[#8c877d] hover:text-[#f3f0e6] transition-colors"><RotateCcw size={16} /></button>
                <button className="p-1.5 rounded hover:bg-[#33312c] text-[#8c877d] hover:text-[#f3f0e6] transition-colors"><SkipBack size={16} fill="currentColor" /></button>
                <button className="p-2 rounded-full bg-[#f3f0e6] text-[#141311] hover:scale-105 transition-transform"><Play size={16} fill="currentColor" /></button>
                <button className="p-1.5 rounded hover:bg-[#33312c] text-[#8c877d] hover:text-[#f3f0e6] transition-colors"><SkipForward size={16} fill="currentColor" /></button>
              </div>
              <div className="flex-1 mx-8 relative flex items-center">
                <div className="w-full h-1 bg-[#33312c] rounded-full overflow-hidden">
                  <div className="h-full bg-[#e78253] w-[30%]" />
                </div>
                <div className="absolute left-[30%] w-3 h-3 rounded-full bg-[#e78253] -translate-x-1.5 border-2 border-[#141311]" />
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 rounded border border-[#33312c] text-xs font-bold text-[#8c877d] hover:text-[#f3f0e6] transition-colors">1x</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
