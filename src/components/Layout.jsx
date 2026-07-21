import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Database, Home, MousePointerClick, Filter, ArrowDownAZ, Search, Settings, TerminalSquare, Scissors, FolderTree, Combine, Menu, X, ChevronRight, Check, Layers, Tag } from "lucide-react";
import { cn } from "../utils/cn";

const links = [
  { to: "/", label: "Overview", icon: Home, step: null, difficulty: null, exact: true },
  { to: "/select", label: "SELECT", icon: MousePointerClick, step: 1, difficulty: "Beginner", diffColor: "text-emerald-400 bg-emerald-400/10" },
  { to: "/where", label: "WHERE", icon: Filter, step: 2, difficulty: "Beginner", diffColor: "text-emerald-400 bg-emerald-400/10" },
  { to: "/orderby", label: "ORDER BY", icon: ArrowDownAZ, step: 3, difficulty: "Beginner", diffColor: "text-emerald-400 bg-emerald-400/10" },
  { to: "/limit", label: "LIMIT", icon: Scissors, step: 4, difficulty: "Beginner", diffColor: "text-emerald-400 bg-emerald-400/10" },
  { to: "/groupby", label: "GROUP BY", icon: FolderTree, step: 5, difficulty: "Intermediate", diffColor: "text-amber-400 bg-amber-400/10" },
  { to: "/having", label: "HAVING", icon: Filter, step: 6, difficulty: "Intermediate", diffColor: "text-amber-400 bg-amber-400/10" },
  { to: "/innerjoin", label: "INNER JOIN", icon: Combine, step: 7, difficulty: "Intermediate", diffColor: "text-amber-400 bg-amber-400/10" },
  { to: "/leftjoin", label: "LEFT JOIN", icon: Combine, step: 8, difficulty: "Intermediate", diffColor: "text-amber-400 bg-amber-400/10" },
  { to: "/distinct", label: "DISTINCT", icon: Layers, step: 9, difficulty: "Intermediate", diffColor: "text-amber-400 bg-amber-400/10" },
  { to: "/aliases", label: "ALIASES (AS)", icon: Tag, step: 10, difficulty: "Intermediate", diffColor: "text-amber-400 bg-amber-400/10" },
  { to: "/playground", label: "Playground", icon: TerminalSquare, step: null, difficulty: "Advanced", diffColor: "text-rose-400 bg-rose-400/10" },
];

function SidebarContent({ onClose }) {
  const [completedPaths, setCompletedPaths] = useState({});

  const updateCompletion = () => {
    const completed = {};
    links.forEach(link => {
      if (localStorage.getItem("completed_" + link.to) === "true") {
        completed[link.to] = true;
      }
    });
    setCompletedPaths(completed);
  };

  useEffect(() => {
    updateCompletion();
    window.addEventListener("completion-change", updateCompletion);
    return () => window.removeEventListener("completion-change", updateCompletion);
  }, []);

  return (
    <>
      <div className="h-12 px-4 border-b border-zinc-800/80 flex items-center gap-2 flex-shrink-0">
        <div className="w-5 h-5 rounded flex items-center justify-center bg-zinc-100 text-zinc-900 shadow-sm shadow-white/10">
          <Database size={12} strokeWidth={2.5} />
        </div>
        <span className="font-medium text-[13px] tracking-tight text-zinc-100">VisualDB</span>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-zinc-400 hover:text-zinc-200 transition-colors md:hidden">
            <X size={16} />
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-[2px] overflow-y-auto">
        <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1 px-3">Start Here</div>

        {/* Overview link */}
        <NavLink
          key="/"
          to="/"
          end
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 border border-transparent",
              isActive
                ? "bg-zinc-900 text-zinc-100 border-zinc-800/50 shadow-sm"
                : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
            )
          }
        >
          <Home size={14} strokeWidth={2.5} />
          Overview
        </NavLink>

        <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mt-4 mb-1 px-3">Learning Path</div>

        {links.filter(l => l.step !== null).map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-200 border border-transparent group",
                isActive
                  ? "bg-zinc-900 text-zinc-100 border-zinc-800/50 shadow-sm"
                  : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
              )
            }
          >
            <div className={cn(
              "w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-all duration-200",
              completedPaths[link.to]
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.15)]"
                : "bg-zinc-800/50 text-zinc-500 group-hover:text-zinc-300"
            )}>
              {completedPaths[link.to] ? <Check size={10} strokeWidth={3} /> : link.step}
            </div>
            <link.icon size={13} strokeWidth={2.5} className="flex-shrink-0" />
            <span className="flex-1">{link.label}</span>
            <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full hidden lg:block", link.diffColor)}>
              {link.difficulty === "Beginner" ? "BGN" : link.difficulty === "Intermediate" ? "INT" : "ADV"}
            </span>
          </NavLink>
        ))}

        <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mt-4 mb-1 px-3">Practice</div>

        <NavLink
          to="/playground"
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 border border-transparent",
              isActive
                ? "bg-zinc-900 text-zinc-100 border-zinc-800/50 shadow-sm"
                : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
            )
          }
        >
          <TerminalSquare size={14} strokeWidth={2.5} />
          <span className="flex-1">Playground</span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-rose-400 bg-rose-400/10 hidden lg:block">ADV</span>
        </NavLink>
      </nav>

      <div className="p-3 mx-2 mb-2 rounded-lg border border-zinc-800/50 bg-zinc-900/30 flex items-center gap-3 text-[13px] text-zinc-400">
        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
          <span className="text-[10px] text-zinc-300 font-bold">ST</span>
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <span className="truncate font-medium text-zinc-200">Student Workspace</span>
          <span className="text-[10px] text-zinc-500 truncate">Free Plan</span>
        </div>
      </div>
    </>
  );
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans selection:bg-accent/30 selection:text-white">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[220px] border-r border-zinc-800/80 bg-zinc-950 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-[260px] bg-zinc-950 border-r border-zinc-800 flex flex-col z-10 shadow-2xl">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background relative">
        {/* Top Header */}
        <header className="h-12 border-b border-zinc-800/80 flex items-center px-4 justify-between bg-zinc-950/80 backdrop-blur-md z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="md:hidden text-zinc-400 hover:text-zinc-200 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-[13px] text-zinc-500">
              <span className="hover:text-zinc-300 cursor-pointer transition-colors hidden sm:block">Workspace</span>
              <ChevronRight size={12} className="opacity-40 hidden sm:block" />
              <span className="text-zinc-300 font-medium">Interactive Learning</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group hidden sm:block">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
              <input
                type="text"
                placeholder="Search modules..."
                className="h-7 w-48 md:w-64 bg-zinc-900/50 border border-zinc-800 rounded-md pl-8 pr-3 text-[13px] text-zinc-200 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900 transition-all placeholder:text-zinc-600 shadow-inner"
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
