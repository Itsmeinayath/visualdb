import { NavLink, Outlet } from "react-router-dom";
import { Database, Home, MousePointerClick, Filter } from "lucide-react";
import { cn } from "../utils/cn";

export default function Layout() {
  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/select", label: "SELECT", icon: MousePointerClick },
    { to: "/where", label: "WHERE", icon: Filter },
  ];

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border glass-panel flex flex-col">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
            <Database size={18} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-gradient from-white to-white/70">
            VisualDB
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
            Modules
          </div>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )
              }
            >
              <link.icon size={18} className={cn("transition-colors")} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border text-xs text-muted-foreground text-center">
          See Databases. Don't Just Read About Them.
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
        <div className="h-full w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
