import { Link } from "react-router-dom";
import { ArrowRight, Play, Sun } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#141311] text-[#f3f0e6] font-sans selection:bg-[#e78253] selection:text-[#141311] overflow-x-hidden">
      
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight">DSA <span className="text-[#e78253]">Visual</span></span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-[#8c877d] hover:text-[#f3f0e6] transition-colors">
            <Sun size={20} />
          </button>
          <div className="flex items-center gap-2 bg-[#1e1d1a] border border-[#33312c] rounded-full px-4 py-1.5">
            <div className="w-4 h-4 rounded-full bg-[#33312c] flex items-center justify-center">
               <span className="text-[10px] text-[#8c877d]">0</span>
            </div>
            <span className="text-sm font-medium text-[#f3f0e6]">Guest User</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* Left Column: Copy */}
        <div className="flex-1 max-w-2xl z-10">
          <div className="text-[10px] font-bold tracking-[0.2em] text-[#8c877d] uppercase mb-6">
            Watch the algorithm think
          </div>
          <h1 className="text-6xl md:text-8xl font-black font-serif tracking-tight leading-[1.05] mb-6 text-[#f3f0e6]">
            Algorithms<br/>you can <span className="text-[#e78253]">see.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#8c877d] leading-relaxed mb-10 font-light">
            Every pattern, stepped through one frame at a time — 
            pointers gliding, trees recursing, DP tables filling in. 
            Press play and watch the idea unfold.
          </p>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/learn/two-sum-ii" 
              className="inline-flex h-14 items-center justify-center rounded-lg bg-[#f3f0e6] px-8 font-medium text-[#141311] transition-all hover:bg-white hover:scale-[1.02] shadow-xl"
            >
              Start with DSA <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link 
              to="/learn/two-sum-ii" 
              className="inline-flex h-14 items-center justify-center rounded-lg border border-[#33312c] bg-transparent px-8 font-medium text-[#f3f0e6] transition-colors hover:bg-[#1e1d1a]"
            >
              Choose a track
            </Link>
          </div>
        </div>

        {/* Right Column: Mini Demo UI */}
        <div className="flex-1 w-full max-w-xl relative">
          <div className="absolute -top-4 -left-4 bg-[#e78253]/10 text-[#e78253] border border-[#e78253]/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest z-20 backdrop-blur-md">
            LIVE
          </div>
          <div className="w-full aspect-[4/3] bg-[#1e1d1a] border border-[#33312c] rounded-2xl shadow-2xl p-6 relative overflow-hidden flex flex-col">
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full border border-[#8c877d]/30" />
                <div className="w-3 h-3 rounded-full border border-[#8c877d]/30" />
                <div className="w-3 h-3 rounded-full border border-[#8c877d]/30" />
              </div>
              <div className="text-xs font-mono text-[#8c877d]">
                two-pointers · target 14
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              {/* Array */}
              <div className="flex gap-3">
                {[1, 4, 6, 8, 11, 15].map((num, i) => (
                  <div 
                    key={i} 
                    className={`w-12 h-14 rounded-lg border flex items-center justify-center text-xl font-bold font-mono transition-colors ${
                      i === 0 ? 'border-[#e78253] text-[#e78253] bg-[#e78253]/5' : 
                      i === 4 ? 'border-[#e78253] text-[#e78253] bg-[#e78253]/5' : 
                      'border-[#8c877d]/30 text-[#f3f0e6]'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>

              {/* Pointers */}
              <div className="flex gap-3 w-[360px] relative">
                <div className="absolute left-[16px] -top-2 flex flex-col items-center text-[#e78253]">
                  <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-[#e78253] mb-1" />
                  <span className="font-bold font-mono text-sm">L</span>
                </div>
                <div className="absolute left-[256px] -top-2 flex flex-col items-center text-[#3b82f6]">
                  <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-[#3b82f6] mb-1" />
                  <span className="font-bold font-mono text-sm">R</span>
                </div>
              </div>

              {/* State */}
              <div className="text-sm font-mono text-[#8c877d] mt-4">
                1 + 11 = 12 &lt; 14 — <span className="text-[#f3f0e6]">move left in</span>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
