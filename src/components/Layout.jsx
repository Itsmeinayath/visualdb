import { NavLink, Outlet } from "react-router-dom";
import { Database, Home, MousePointerClick, Filter, Search, Settings, TerminalSquare } from "lucide-react";
import { cn } from "../utils/cn";

export default function Layout() {
  const links = [
    { to: "/", label: "Overview", icon: Home },
    { to: "/select", label: "SELECT Query", icon: MousePointerClick },
    { to: "/where", label: "WHERE Clause", icon: Filter },
    { to: "/playground", label: "Playground", icon: TerminalSquare },
  ];

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans selection:bg-accent/30 selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-muted/30 flex flex-col">
        <div className="h-14 px-4 border-b border-border flex items-center gap-3">
          <div className="w-6 h-6 rounded flex items-center justify-center bg-foreground text-background">
            <Database size={14} />
          </div>
          <span className="font-semibold text-sm tracking-tight text-foreground">
            VisualDB
          </span>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
            Modules
          </div>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <link.icon size={16} className={cn("transition-colors")} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border flex items-center gap-3 text-sm text-muted-foreground">
          <div className="w-6 h-6 rounded-full bg-border"></div>
          <span className="flex-1 truncate">Student Workspace</span>
          <Settings size={14} className="hover:text-foreground cursor-pointer" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Top Header */}
        <header className="h-14 border-b border-border flex items-center px-6 justify-between bg-background/95 backdrop-blur z-10 sticky top-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Workspace</span>
            <span>/</span>
            <span className="text-foreground font-medium">Interactive Learning</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search commands..." 
                className="h-8 w-64 bg-muted/50 border border-border rounded-md pl-8 pr-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-muted-foreground"
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
