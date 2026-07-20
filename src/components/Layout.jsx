import { NavLink, Outlet } from "react-router-dom";
import { Database, Home, MousePointerClick, Filter, ArrowDownAZ, Search, Settings, TerminalSquare, Scissors, FolderTree, Combine } from "lucide-react";
import { cn } from "../utils/cn";

export default function Layout() {
  const links = [
    { to: "/", label: "Overview", icon: Home },
    { to: "/select", label: "SELECT Query", icon: MousePointerClick },
    { to: "/where", label: "WHERE Clause", icon: Filter },
    { to: "/innerjoin", label: "INNER JOIN", icon: Combine },
    { to: "/leftjoin", label: "LEFT JOIN", icon: Combine },
    { to: "/groupby", label: "GROUP BY Clause", icon: FolderTree },
    { to: "/orderby", label: "ORDER BY Clause", icon: ArrowDownAZ },
    { to: "/limit", label: "LIMIT Clause", icon: Scissors },
    { to: "/playground", label: "Playground", icon: TerminalSquare },
  ];

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans selection:bg-accent/30 selection:text-white">
      {/* Sidebar - Hidden on mobile, visible on medium screens and up */}
      <aside className="hidden md:flex w-[240px] border-r border-zinc-800/80 bg-zinc-950 flex-col flex-shrink-0">
        <div className="h-12 px-4 border-b border-zinc-800/80 flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center bg-zinc-100 text-zinc-900 shadow-sm shadow-white/10">
            <Database size={12} strokeWidth={2.5} />
          </div>
          <span className="font-medium text-[13px] tracking-tight text-zinc-100">
            VisualDB
          </span>
        </div>
        
        <nav className="flex-1 py-4 px-2 space-y-[2px] overflow-y-auto">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-3 px-3">
            Execution Modules
          </div>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 border border-transparent",
                  isActive
                    ? "bg-zinc-900 text-zinc-100 border-zinc-800/50 shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
                )
              }
            >
              <link.icon size={14} className={cn("transition-colors")} strokeWidth={2.5} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 mx-2 mb-2 rounded-lg border border-zinc-800/50 bg-zinc-900/30 flex items-center gap-3 text-[13px] text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-200 hover:border-zinc-700/50 cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
            <span className="text-[10px] text-zinc-300 font-bold">ST</span>
          </div>
          <div className="flex-1 flex flex-col min-w-0">
             <span className="truncate font-medium text-zinc-200">Student Workspace</span>
             <span className="text-[10px] text-zinc-500 truncate">Free Plan</span>
          </div>
          <Settings size={14} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background relative">
        {/* Top Header */}
        <header className="h-12 border-b border-zinc-800/80 flex items-center px-4 justify-between bg-zinc-950/80 backdrop-blur-md z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-2 text-[13px] text-zinc-500">
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">Workspace</span>
            <span className="opacity-50">/</span>
            <span className="text-zinc-300 font-medium">Interactive Learning</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
              <input 
                type="text" 
                placeholder="Search commands (Cmd+K)" 
                className="h-7 w-64 bg-zinc-900/50 border border-zinc-800 rounded-md pl-8 pr-3 text-[13px] text-zinc-200 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900 transition-all placeholder:text-zinc-600 shadow-inner"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
