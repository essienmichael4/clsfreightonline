import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Loader2, UploadCloud, CheckCircle2, ArrowLeft, FileSpreadsheet, X, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosToken from "@/hooks/useAxiosToken";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface UploadResult {
  total: number;
  success: number;
  duplicates: number;
  skipped: number;
  duplicateTrackingNumbers?: string[];
}

interface DuplicateGroup {
  trackingNumber: string;
  rows: number[]; // 1-based row indices (excluding header)
  count: number;
}

const AddPackages = () => {
  const navigate = useNavigate();
  const axios_instance_token = useAxiosToken();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [successState, setSuccessState] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [showDuplicates, setShowDuplicates] = useState(true);

  const validateFile = (file: File) => {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Only Excel files are allowed");
      return false;
    }
    return true;
  };

  const detectDuplicates = (rows: any[]): DuplicateGroup[] => {
    // Look for a column that might contain tracking numbers
    const trackingKeys = Object.keys(rows[0] || {}).filter((key) =>
      /tracking|track|awb|waybill|number|no\.?$/i.test(key)
    );

    // Fallback: use "Shipping Mark" if no tracking column found
    const trackingKey =
      trackingKeys[0] ||
      Object.keys(rows[0] || {}).find((k) =>
        /shipping.?mark/i.test(k)
      );

    if (!trackingKey) return [];

    const seen = new Map<string, number[]>();
    rows.forEach((row, idx) => {
      const val = String(row[trackingKey] ?? "").trim();
      if (!val || val === "undefined" || val === "—") return;
      if (!seen.has(val)) seen.set(val, []);
      seen.get(val)!.push(idx + 1); // 1-based row number
    });

    return Array.from(seen.entries())
      .filter(([, rowNums]) => rowNums.length > 1)
      .map(([trackingNumber, rows]) => ({ trackingNumber, rows, count: rows.length }))
      .sort((a, b) => b.count - a.count);
  };

  const handleFile = async (selected: File) => {
    if (!validateFile(selected)) return;
    setFile(selected);
    setUploadResult(null);
    setDuplicates([]);

    const data = await selected.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const headerIndex = rawRows.findIndex((row) =>
      row.some(
        (cell) =>
          typeof cell === "string" && cell.toLowerCase().includes("shipping mark")
      )
    );

    if (headerIndex === -1) {
      toast.error("Could not find 'Shipping Mark' column");
      return;
    }

    const headers = rawRows[headerIndex];
    const dataRows = rawRows.slice(headerIndex + 1);
    const formattedRows = dataRows.map((row) => {
      const obj: any = {};
      headers.forEach((header: string, index: number) => {
        obj[header] = row[index];
      });
      return obj;
    });

    setRowCount(formattedRows.length);
    setPreviewRows(formattedRows.slice(0, 5));

    const found = detectDuplicates(formattedRows);
    setDuplicates(found);
    if (found.length > 0) setShowDuplicates(true);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const clearFile = () => {
    setFile(null);
    setRowCount(null);
    setPreviewRows([]);
    setProgress(0);
    setUploadResult(null);
    setDuplicates([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const uploadFile = async () => {
    if (!file) throw new Error("No file selected");
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios_instance_token.post("/packages/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        }
      },
    });

    return response.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: uploadFile,
    onSuccess: (data: UploadResult) => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      setUploadResult(data);
      setSuccessState(true);
      setTimeout(() => {
        setSuccessState(false);
      }, 2500);
    },
    onError: () => {
      toast.error("Upload failed");
      setProgress(0);
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Upload Packages</h1>
            <p className="text-sm text-gray-500 mt-0.5">Import packages in bulk via Excel spreadsheet</p>
          </div>
        </div>

        <div className="space-y-5">

          {/* Dropzone — only shown when no file selected */}
          {!file ? (
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-200
                ${isDragging
                  ? "border-blue-400 bg-blue-50 scale-[1.01]"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30"
                }`}
            >
              <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors
                ${isDragging ? "bg-blue-100" : "bg-gray-100"}`}>
                <UploadCloud className={`w-8 h-8 transition-colors ${isDragging ? "text-blue-500" : "text-gray-400"}`} />
              </div>
              <p className="text-base font-semibold text-gray-800">
                {isDragging ? "Drop it here" : "Drag & drop your Excel file"}
              </p>
              <p className="text-sm text-gray-400 mt-1">or click to browse — .xlsx and .xls supported</p>
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            /* File Info Card */
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm leading-tight">{file.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {(file.size / 1024).toFixed(1)} KB
                      {rowCount !== null && (
                        <span className="ml-2 text-emerald-600 font-medium">· {rowCount.toLocaleString()} rows detected</span>
                      )}
                    </p>
                  </div>
                </div>
                {!isPending && (
                  <button
                    onClick={clearFile}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Progress bar */}
              {isPending && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Success state */}
              {successState && (
                <div className="mt-4 flex items-center gap-2 text-emerald-600 bg-emerald-50 rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">Upload successful!</span>
                </div>
              )}
            </div>
          )}

          {/* Duplicate Tracking Numbers */}
          {duplicates.length > 0 && (
            <div className="bg-white border border-amber-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Header */}
              <button
                onClick={() => setShowDuplicates((v) => !v)}
                className="w-full px-5 py-3.5 flex items-center justify-between border-b border-amber-100 hover:bg-amber-50/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800">Duplicate Tracking Numbers</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                      {duplicates.length} {duplicates.length === 1 ? "group" : "groups"} · {duplicates.reduce((sum, d) => sum + d.count, 0)} rows
                    </span>
                  </div>
                </div>
                {showDuplicates
                  ? <ChevronUp className="w-4 h-4 text-gray-400" />
                  : <ChevronDown className="w-4 h-4 text-gray-400" />
                }
              </button>

              {/* Duplicate list */}
              {showDuplicates && (
                <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                  {duplicates.map((dup, i) => (
                    <div key={i} className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Count badge */}
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex-shrink-0">
                          {dup.count}
                        </span>
                        {/* Tracking number */}
                        <span className="text-sm font-mono font-medium text-gray-800 truncate">
                          {dup.trackingNumber}
                        </span>
                      </div>
                      {/* Row locations */}
                      <div className="flex flex-wrap gap-1 justify-end flex-shrink-0">
                        {dup.rows.map((row) => (
                          <span
                            key={row}
                            className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500"
                          >
                            row {row}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer hint */}
              {showDuplicates && (
                <div className="px-5 py-2.5 bg-amber-50/60 border-t border-amber-100">
                  <p className="text-xs text-amber-700">
                    These rows share the same tracking number and may be processed as duplicates by the server.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Upload Results */}
          {uploadResult && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-3.5 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-700">Upload Results</p>
              </div>
              <div className="grid grid-cols-4 divide-x divide-gray-100">
                <div className="px-5 py-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{uploadResult.total}</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Total</p>
                </div>
                <div className="px-5 py-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{uploadResult.success}</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Imported</p>
                </div>
                <div className="px-5 py-4 text-center">
                  <p className="text-2xl font-bold text-amber-500">{uploadResult.duplicates}</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Duplicates</p>
                </div>
                <div className="px-5 py-4 text-center">
                  <p className="text-2xl font-bold text-rose-500">{uploadResult.skipped}</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Skipped</p>
                </div>
              </div>

              {/* Duplicate Tracking Numbers */}
              {uploadResult.duplicateTrackingNumbers && uploadResult.duplicateTrackingNumbers.length > 0 && (
                <div className="border-t border-gray-100">
                  <div className="px-5 py-3 flex items-center justify-between bg-amber-50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                        Duplicate Tracking Numbers
                      </p>
                    </div>
                    <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md font-medium">
                      {uploadResult.duplicateTrackingNumbers.length} found
                    </span>
                  </div>
                  <div className="px-5 py-3 max-h-48 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {uploadResult.duplicateTrackingNumbers.map((tn) => (
                        <span
                          key={tn}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs font-mono text-amber-800"
                        >
                          {tn}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preview Table */}
          {previewRows.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">Preview</p>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">First 5 rows</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      {Object.keys(previewRows[0]).map((key) => (
                        <th key={key} className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {previewRows.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="px-4 py-3 text-gray-600 whitespace-nowrap max-w-[180px] truncate">
                            {String(val ?? "—")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Upload Button */}
          {file && !successState && (
            <Button
              onClick={() => mutate()}
              disabled={isPending}
              className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold rounded-xl shadow-sm transition-all"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UploadCloud className="w-4 h-4" />
                  Upload {rowCount ? `${rowCount.toLocaleString()} Packages` : "Packages"}
                </span>
              )}
            </Button>
          )}

          {/* Upload another file button — shown after successful upload */}
          {uploadResult && !isPending && (
            <button
              onClick={clearFile}
              className="w-full h-11 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
            >
              Upload another file
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default AddPackages;
