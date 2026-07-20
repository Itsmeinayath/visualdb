import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";
import { Table as TableIcon } from "lucide-react";

export default function Table({ 
  data, 
  title = "table", 
  highlightedRows = [], 
  discardedRows = [],
  highlightedColumns = []
}) {
  if (!data || data.length === 0) return null;
  
  const columns = Object.keys(data[0]);

  // Use spring animation for snappy SaaS feel
  const springConfig = { type: "spring", stiffness: 500, damping: 40 };

  return (
    <div className="panel overflow-hidden flex flex-col h-full border border-border">
      {/* Table Header / Toolbar */}
      <div className="bg-muted/50 px-3 py-2 border-b border-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <TableIcon size={14} className="text-muted-foreground" />
          <span className="font-mono text-muted-foreground font-medium">{title}</span>
        </div>
        <div className="text-muted-foreground font-mono">{data.length} rows</div>
      </div>
      
      {/* Table Grid */}
      <div className="overflow-auto bg-background flex-1">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-muted-foreground bg-muted/30 sticky top-0 z-20 shadow-[0_1px_0_var(--border)]">
            <tr>
              <th className="w-12 px-3 py-1.5 border-r border-border font-mono font-medium text-center">
                #
              </th>
              {columns.map((col) => (
                <th 
                  key={col} 
                  className={cn(
                    "px-3 py-1.5 border-r border-border font-mono font-medium last:border-r-0 transition-colors",
                    highlightedColumns.includes(col) ? "text-foreground bg-accent/5" : ""
                  )}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono text-[13px]">
            <AnimatePresence>
              {data.map((row, idx) => {
                const isHighlighted = highlightedRows.includes(row.id || idx);
                const isDiscarded = discardedRows.includes(row.id || idx);
                
                return (
                  <motion.tr
                    key={row.id || idx}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ 
                      opacity: isDiscarded ? 0.3 : 1, 
                      y: 0,
                    }}
                    transition={springConfig}
                    className={cn(
                      "border-b transition-all duration-300 group",
                      isHighlighted 
                        ? "bg-emerald-500/20 border-emerald-500/50 relative z-10 shadow-[inset_3px_0_0_rgba(16,185,129,1)]" 
                        : "border-border hover:bg-muted/30"
                    )}
                  >
                    <td className={cn(
                      "px-3 py-1.5 border-r border-border text-center tabular-nums transition-colors",
                      isHighlighted ? "text-emerald-400 font-bold" : "text-muted-foreground"
                    )}>
                      {idx + 1}
                    </td>
                    {columns.map((col) => (
                      <td 
                        key={col} 
                        className={cn(
                          "px-3 py-1.5 border-r border-border last:border-r-0 whitespace-nowrap transition-colors",
                          isHighlighted ? "text-emerald-50 font-medium" : "text-muted-foreground group-hover:text-foreground/80",
                          highlightedColumns.includes(col) ? "font-semibold text-foreground" : ""
                        )}
                      >
                        {row[col]}
                      </td>
                    ))}
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
