import ConfirmModal from "./ConfirmModal";
import { NavLink, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Database,
  Home,
  MousePointerClick,
  Filter,
  ArrowDownAZ,
  Search,
  TerminalSquare,
  Scissors,
  FolderTree,
  Combine,
  Menu,
  X,
  ChevronRight,
  Check,
  Layers,
  Tag,
  Sun,
  Moon,
  Merge,
} from "lucide-react";
import { cn } from "../utils/cn";

const links = [
  {
    to: "/",
    label: "Overview",
    icon: Home,
    step: null,
    difficulty: null,
    exact: true,
  },
  {
    to: "/select",
    label: "SELECT",
    icon: MousePointerClick,
    step: 1,
    difficulty: "Beginner",
    diffColor: "text-emerald-400 bg-emerald-400/10",
  },
  {
    to: "/where",
    label: "WHERE",
    icon: Filter,
    step: 2,
    difficulty: "Beginner",
    diffColor: "text-emerald-400 bg-emerald-400/10",
  },
  {
    to: "/orderby",
    label: "ORDER BY",
    icon: ArrowDownAZ,
    step: 3,
    difficulty: "Beginner",
    diffColor: "text-emerald-400 bg-emerald-400/10",
  },
  {
    to: "/limit",
    label: "LIMIT",
    icon: Scissors,
    step: 4,
    difficulty: "Beginner",
    diffColor: "text-emerald-400 bg-emerald-400/10",
  },
  {
    to: "/groupby",
    label: "GROUP BY",
    icon: FolderTree,
    step: 5,
    difficulty: "Intermediate",
    diffColor: "text-amber-400 bg-amber-400/10",
  },
  {
    to: "/having",
    label: "HAVING",
    icon: Filter,
    step: 6,
    difficulty: "Intermediate",
    diffColor: "text-amber-400 bg-amber-400/10",
  },
  {
    to: "/innerjoin",
    label: "INNER JOIN",
    icon: Combine,
    step: 7,
    difficulty: "Intermediate",
    diffColor: "text-amber-400 bg-amber-400/10",
  },
  {
    to: "/leftjoin",
    label: "LEFT JOIN",
    icon: Combine,
    step: 8,
    difficulty: "Intermediate",
    diffColor: "text-amber-400 bg-amber-400/10",
  },
  {
    to: "/distinct",
    label: "DISTINCT",
    icon: Layers,
    step: 9,
    difficulty: "Intermediate",
    diffColor: "text-amber-400 bg-amber-400/10",
  },
  {
    to: "/aliases",
    label: "ALIASES (AS)",
    icon: Tag,
    step: 10,
    difficulty: "Intermediate",
    diffColor: "text-amber-400 bg-amber-400/10",
  },
  {
    to: "/union",
    label: "UNION",
    icon: Merge,
    step: 11,
    difficulty: "Intermediate",
    diffColor: "text-amber-400 bg-amber-400/10",
  },
  {
    to: "/playground",
    label: "Playground",
    icon: TerminalSquare,
    step: null,
    difficulty: "Advanced",
    diffColor: "text-rose-400 bg-rose-400/10",
  },
];

function SidebarContent({ onClose }) {
  const [completedPaths, setCompletedPaths] = useState({});

  const updateCompletion = () => {
    const completed = {};

    links.forEach((link) => {
      if (localStorage.getItem(`completed_${link.to}`) === "true") {
        completed[link.to] = true;
      }
    });

    setCompletedPaths(completed);
  };

  useEffect(() => {
    updateCompletion();
    window.addEventListener("completion-change", updateCompletion);

    return () => {
      window.removeEventListener("completion-change", updateCompletion);
    };
  }, []);

  return (
    <>
      <div className="md:hidden h-12 px-4 border-b border-border flex items-center gap-2 shrink-0">
        <span className="font-semibold text-[13px] tracking-tight text-foreground">Menu</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors md:hidden"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 px-3">
          Start Here
        </div>

        <NavLink
          key="/"
          to="/"
          end
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 border border-transparent",
              isActive
                ? "bg-muted text-foreground border-border shadow-sm font-semibold"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )
          }
        >
          <Home size={14} strokeWidth={2.5} />
          Overview
        </NavLink>

        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-4 mb-1 px-3">
          Learning Path
        </div>

        {links
          .filter((link) => link.step !== null)
          .map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-200 border border-transparent group",
                  isActive
                    ? "bg-muted text-foreground border-border shadow-sm font-semibold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )
              }
            >
              <div
                className={cn(
                  "w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 transition-all duration-200",
                  completedPaths[link.to]
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.15)]"
                    : "bg-muted text-muted-foreground group-hover:text-foreground border border-border/40"
                )}
              >
                {completedPaths[link.to] ? (
                  <Check size={10} strokeWidth={3} />
                ) : (
                  link.step
                )}
              </div>

              <link.icon size={13} strokeWidth={2.5} className="shrink-0" />

              <span className="flex-1">{link.label}</span>

              <span
                className={cn(
                  "text-[9px] font-bold px-1.5 py-0.5 rounded-full hidden lg:block",
                  link.diffColor
                )}
              >
                {link.difficulty === "Beginner"
                  ? "BGN"
                  : link.difficulty === "Intermediate"
                    ? "INT"
                    : "ADV"}
              </span>
            </NavLink>
          ))}

        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-4 mb-1 px-3">
          Practice
        </div>

        <NavLink
          to="/playground"
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 border border-transparent",
              isActive
                ? "bg-muted text-foreground border-border shadow-sm font-semibold"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )
          }
        >
          <TerminalSquare size={14} strokeWidth={2.5} />

          <span className="flex-1">Playground</span>

          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-rose-400 bg-rose-400/10 hidden lg:block">
            ADV
          </span>
        </NavLink>
      </nav>
    </>
  );
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previousTheme) =>
      previousTheme === "dark" ? "light" : "dark"
    );
  };

  const handleResetProgress = () => {
    setIsResetModalOpen(true);
  };

  const confirmResetProgress = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("completed_")) {
        localStorage.removeItem(key);
      }
    });

    window.dispatchEvent(new Event("completion-change"));
    setIsResetModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground overflow-hidden font-sans">
      {/* Top Header (Full Width) */}
      <header className="h-12 border-b border-border flex items-center px-4 justify-between bg-card/85 backdrop-blur-md z-20 relative shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileOpen(true);
              } else {
                setSidebarOpen(!sidebarOpen);
              }
            }}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-foreground text-background shadow-sm">
              <Database size={12} strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-[13px] tracking-tight text-foreground hidden sm:block">
              VisualDB
            </span>
          </div>

          <div className="h-4 w-px bg-border mx-2 hidden sm:block" />

          <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors hidden sm:block">
              Workspace
            </span>

            <ChevronRight
              size={12}
              className="opacity-40 hidden sm:block"
            />

            <span className="text-foreground font-medium">
              Interactive Learning
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group hidden sm:block">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground/80 transition-colors"
            />

            <input
              type="text"
              placeholder="Search modules..."
              className="h-7 w-48 md:w-64 bg-muted/50 border border-border rounded-md pl-8 pr-3 text-[13px] text-foreground focus:outline-none focus:border-border focus:bg-muted transition-all placeholder:text-muted-foreground/60 shadow-inner"
            />
          </div>

          <button
            type="button"
            onClick={handleResetProgress}
            className="h-7 px-3 rounded-md border border-border bg-muted/50 hover:bg-muted text-[12px] font-medium transition-all"
          >
            Reset Progress
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="h-7 w-7 rounded-md border border-border bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </header>

      {/* Main App Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <aside 
          className={cn(
            "hidden md:flex border-r border-border bg-card flex-col shrink-0 transition-all duration-300 overflow-hidden h-full z-10",
            sidebarOpen ? "w-55" : "w-0 border-r-0"
          )}
        >
          <div className="w-55 h-full flex flex-col">
            <SidebarContent />
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            <aside className="absolute left-0 top-0 h-full w-65 bg-card border-r border-border flex flex-col z-10 shadow-2xl">
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-hidden relative bg-background">
          <Outlet />
        </main>
      </div>

      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset challenge progress?"
        message="Are you sure you want to reset all challenge progress? This action cannot be undone."
        onConfirm={confirmResetProgress}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
}