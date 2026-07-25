import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, ChevronRight, ChevronDown } from "lucide-react";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Smart Navigation State: keep tracks open if we are viewing a problem inside them
  const [openTracks, setOpenTracks] = useState({
    "two-pointers": true
  });

  const toggleTrack = (trackId) => {
    setOpenTracks(prev => ({...prev, [trackId]: !prev[trackId]}));
  };

  return (
    <div className="flex h-screen w-full bg-[#141311] text-[#f3f0e6] overflow-hidden font-sans">
      
      {/* Sidebar Overlay for Mobile */}
      {!sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? "w-[280px] translate-x-0" : "w-[0px] -translate-x-full"
        } transition-all duration-300 ease-in-out shrink-0 border-r border-[#33312c] bg-[#141311] flex flex-col z-50 h-full relative`}
      >
        <div className="p-4 flex items-center justify-between border-b border-[#33312c] min-w-[280px]">
          <Link to="/" className="font-bold text-lg tracking-tight whitespace-nowrap">
            DSA <span className="text-[#e78253]">Visual</span>
            <div className="text-[10px] text-[#8c877d] font-normal tracking-wide">step-by-step pattern animations</div>
          </Link>
          <div className="flex items-center gap-3">
             <button className="text-[#8c877d] hover:text-[#f3f0e6]"><Sun size={16}/></button>
          </div>
        </div>

        <div className="p-4 border-b border-[#33312c] min-w-[280px]">
           <div className="bg-[#1e1d1a] border border-[#33312c] rounded-lg px-3 py-1.5 flex items-center justify-between text-sm">
             <span className="flex items-center gap-2 text-[#8c877d]">
               <div className="w-3 h-3 rounded-full bg-[#33312c]" /> 0 day streak
             </span>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto min-w-[280px] py-4">
          <div className="px-2">
            
            {/* Track 1 */}
            <div className="mb-1">
              <button 
                onClick={() => toggleTrack('two-pointers')}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm font-bold text-[#f3f0e6] hover:bg-[#1e1d1a] rounded"
              >
                {openTracks['two-pointers'] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                Two Pointers
              </button>
              
              {openTracks['two-pointers'] && (
                <div className="flex flex-col mt-1">
                  <SidebarLink 
                    to="/learn/two-sum-ii" 
                    title="Two Sum II" 
                    desc="Sorted input - find indices that add up to target" 
                    active={location.pathname === "/learn/two-sum-ii"}
                  />
                  <SidebarLink 
                    to="/learn/valid-palindrome" 
                    title="Valid Palindrome" 
                    desc="Converging pointers - skip non-alphanumerics" 
                    active={location.pathname === "/learn/valid-palindrome"}
                  />
                  <SidebarLink 
                    to="/learn/3sum" 
                    title="3Sum" 
                    desc="Find all unique triplets that sum to zero" 
                    active={location.pathname === "/learn/3sum"}
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#1e1d1a] relative transition-all duration-300">
        
        {/* Toggle Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute top-4 z-50 p-1.5 rounded bg-[#33312c] text-[#f3f0e6] hover:bg-[#4a473d] transition-all border border-[#141311] shadow-lg ${sidebarOpen ? '-left-3' : 'left-4'}`}
        >
          {sidebarOpen ? <X size={14} /> : <Menu size={14} />}
        </button>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
}

function SidebarLink({ to, title, desc, active }) {
  return (
    <Link 
      to={to} 
      className={`px-6 py-2.5 flex flex-col gap-0.5 border-l-2 transition-colors ${
        active 
          ? "border-[#e78253] bg-[#f3f0e6] text-[#141311]" 
          : "border-transparent text-[#8c877d] hover:text-[#f3f0e6] hover:bg-[#1e1d1a]"
      }`}
    >
      <span className={`text-sm ${active ? 'font-bold' : 'font-medium'}`}>{title}</span>
      <span className={`text-xs ${active ? 'text-[#141311]/70' : 'text-[#8c877d]'} leading-tight`}>{desc}</span>
    </Link>
  );
}
