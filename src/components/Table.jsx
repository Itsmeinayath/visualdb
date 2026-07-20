import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";
export default function Table({ 
  data, 
  title = "Table", 
  highlightedRows = [], 
  discardedRows = [],
  highlightedColumns = []
}) {
  if (!data || data.length === 0) return null;
  
  const columns = Object.keys(data[0]);

  return (
    <div className="glass-panel rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-border">
      <div className="bg-card/50 px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="font-mono font-semibold text-sm text-foreground flex items-center gap-2">
          <span className="text-primary">table</span> {title}
        </h3>
        <div className="text-xs text-muted-foreground">{data.length} rows</div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-black/20 text-muted-foreground">
            <tr>
              {columns.map((col) => (
                <th 
                  key={col} 
                  className={cn(
                    "px-4 py-3 font-mono font-semibold transition-colors",
                    highlightedColumns.includes(col) ? "text-primary" : ""
                  )}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {data.map((row, idx) => {
                const isHighlighted = highlightedRows.includes(row.id || idx);
                const isDiscarded = discardedRows.includes(row.id || idx);
                
                return (
                  <motion.tr
                    key={row.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: isDiscarded ? 0.2 : 1, 
                      y: 0,
                      scale: isHighlighted ? 1.02 : 1,
                      backgroundColor: isHighlighted ? "rgba(59, 130, 246, 0.15)" : "transparent"
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "border-b border-border/50 last:border-0 transition-colors",
                      isHighlighted ? "relative z-10 shadow-lg border-primary/30" : "hover:bg-white/5"
                    )}
                  >
                    {columns.map((col) => (
                      <td 
                        key={col} 
                        className={cn(
                          "px-4 py-3 font-mono whitespace-nowrap",
                          highlightedColumns.includes(col) ? "text-white font-medium" : "text-muted-foreground"
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
