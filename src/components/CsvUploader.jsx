import { useState, useRef } from "react";
import Papa from "papaparse";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import { addTable } from "../engine/database";
import { cn } from "../utils/cn";

export default function CsvUploader({ onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, parsing, success, error
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.name.endsWith(".csv")) {
      setStatus("error");
      setMessage("Please upload a valid .csv file");
      return;
    }

    setStatus("parsing");
    
    // Derive table name: remove .csv and special chars, lowercase
    let tableName = file.name.replace(/\.csv$/i, "").toLowerCase();
    tableName = tableName.replace(/[^a-z0-9_]/g, "_");

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setStatus("error");
          setMessage(`Error parsing CSV: ${results.errors[0].message}`);
          return;
        }

        const data = results.data;
        if (data.length === 0) {
          setStatus("error");
          setMessage("CSV file is empty");
          return;
        }

        // Add to database
        addTable(tableName, data);
        
        setStatus("success");
        setMessage(`Table '${tableName}' loaded with ${data.length} rows`);
        
        if (onUploadSuccess) {
          onUploadSuccess(tableName);
        }

        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 3000);
      },
      error: (error) => {
        setStatus("error");
        setMessage(`Error reading file: ${error.message}`);
      }
    });
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={cn(
        "panel p-4 border-dashed border-2 flex flex-col items-center justify-center gap-3 transition-colors text-center cursor-pointer min-h-[120px]",
        isDragging ? "border-accent bg-accent/5" : "border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/30",
        status === "success" && "border-emerald-500/50 bg-emerald-500/5",
        status === "error" && "border-red-500/50 bg-red-500/5"
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        accept=".csv"
        className="hidden" 
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
          }
          // Reset value so same file can be uploaded again if needed
          e.target.value = null;
        }}
      />
      
      {status === "idle" && (
        <>
          <UploadCloud size={24} className="text-zinc-500" />
          <div>
            <div className="text-sm font-medium text-zinc-300">Upload Custom CSV</div>
            <div className="text-xs text-zinc-500 mt-1">Drag and drop or click to browse</div>
          </div>
        </>
      )}

      {status === "parsing" && (
        <>
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <div className="text-sm font-medium text-zinc-300">Parsing data...</div>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 size={24} className="text-emerald-500" />
          <div className="text-sm font-medium text-emerald-400">{message}</div>
        </>
      )}

      {status === "error" && (
        <>
          <AlertCircle size={24} className="text-red-500" />
          <div className="text-sm font-medium text-red-400">{message}</div>
        </>
      )}
    </div>
  );
}
