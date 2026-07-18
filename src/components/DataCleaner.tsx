import React, { useState } from 'react';
import { UploadCloud, DownloadCloud, Play, Settings2, Trash2, Layers, CheckCircle2, AlertCircle, Activity } from 'lucide-react';
import { processExcelFile, exportWorkbook, CleaningOptions, SortOptions, AnalysisReport, ColumnAnalysis } from '../lib/excel';
import * as XLSX from 'xlsx';

export function DataCleaner() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedWorkbook, setProcessedWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [cleaningOps, setCleaningOps] = useState<CleaningOptions>({
    removeDuplicates: true,
    removeEmptyCells: true,
    standardizeDates: true,
    standardizeNumbers: true,
    standardizeText: true,
  });

  const [sortOps, setSortOps] = useState<SortOptions>({
    sortSheets: false,
    sortDataByColumn: '',
    sortDirection: 'asc',
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setProcessedWorkbook(null);
      setReport(null);
      setError(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await processExcelFile(file, cleaningOps, sortOps);
      setProcessedWorkbook(result.workbook);
      setReport(result.report);
    } catch (err: any) {
      setError(err.message || "Failed to process file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    if (processedWorkbook) {
      exportWorkbook(processedWorkbook, `Xelora_Cleaned_${file?.name || 'export.xlsx'}`);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Data Lab</h2>
        <p className="text-slate-400 font-mono text-sm">Upload, clean, format and analyze Excel datasets.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings & Import Panel */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white flex items-center mb-4">
              <UploadCloud className="w-5 h-5 mr-2 text-cyan-400" /> Source Data
            </h3>
            
            <label className="block w-full border-2 border-dashed border-slate-600 hover:border-cyan-500 hover:bg-slate-700/50 transition-colors rounded-xl p-8 text-center cursor-pointer">
              <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} />
              <div className="flex flex-col items-center">
                <FileSpreadsheetIcon className="w-10 h-10 text-slate-400 mb-3" />
                <span className="text-slate-300 font-medium">{file ? file.name : "Select Excel/CSV file"}</span>
                <span className="text-slate-500 text-xs mt-1">Tap or drag and drop</span>
              </div>
            </label>
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white flex items-center mb-4">
              <Settings2 className="w-5 h-5 mr-2 text-blue-400" /> Operations
            </h3>
            
            <div className="space-y-3">
              {Object.entries(cleaningOps).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${value ? 'bg-cyan-500 border-cyan-500' : 'bg-slate-900 border-slate-600 group-hover:border-cyan-500'}`}>
                    {value && <CheckCircle2 className="w-3 h-3 text-slate-900" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={value} onChange={() => setCleaningOps(p => ({...p, [key]: !p[key as keyof CleaningOptions]}))} />
                  <span className="text-sm text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
              
              <div className="pt-4 border-t border-slate-700">
                <label className="flex items-center space-x-3 cursor-pointer group mb-3">
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${sortOps.sortSheets ? 'bg-cyan-500 border-cyan-500' : 'bg-slate-900 border-slate-600 group-hover:border-cyan-500'}`}>
                      {sortOps.sortSheets && <CheckCircle2 className="w-3 h-3 text-slate-900" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={sortOps.sortSheets} onChange={() => setSortOps(p => ({...p, sortSheets: !p.sortSheets}))} />
                    <span className="text-sm text-slate-300">Sort Sheets Alphabetically</span>
                </label>

                <div className="space-y-2">
                   <span className="text-sm text-slate-400 block">Sort Data by Column:</span>
                   <input type="text" placeholder="Column Name (e.g. Date)" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none" value={sortOps.sortDataByColumn || ''} onChange={(e) => setSortOps(p => ({...p, sortDataByColumn: e.target.value}))} />
                   {sortOps.sortDataByColumn && (
                     <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white mt-2" value={sortOps.sortDirection} onChange={(e) => setSortOps(p => ({...p, sortDirection: e.target.value as 'asc'|'desc'}))}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                     </select>
                   )}
                </div>
              </div>
            </div>

            <button
              onClick={handleProcess}
              disabled={!file || isProcessing}
              className={`w-full mt-6 py-3 rounded-xl font-bold flex items-center justify-center transition-all ${!file || isProcessing ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]'}`}
            >
              {isProcessing ? (
                <span className="flex items-center"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> Processing...</span>
              ) : (
                <span className="flex items-center"><Play className="w-4 h-4 mr-2" /> Execute Protocol</span>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 min-h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-white flex items-center">
                   <Layers className="w-5 h-5 mr-2 text-purple-400" /> Analysis Report
                 </h3>
                 {processedWorkbook && (
                   <button onClick={handleExport} className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium">
                     <DownloadCloud className="w-4 h-4 mr-2" /> Export
                   </button>
                 )}
              </div>

              {!report && !isProcessing && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                  <Activity className="w-12 h-12 mb-4 opacity-20" />
                  <p>Awaiting data input...</p>
                </div>
              )}

              {isProcessing && (
                <div className="flex-1 flex flex-col items-center justify-center text-cyan-500">
                  <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
                  <p className="font-mono text-sm animate-pulse">Analyzing matrix...</p>
                </div>
              )}

              {report && !isProcessing && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <StatCard label="Total Rows" value={report.totalRows} />
                       <StatCard label="Total Columns" value={report.totalColumns} />
                       <StatCard label="Duplicates Removed" value={report.duplicatesRemoved || 0} color="text-emerald-400" />
                       <StatCard label="Empty Cells Cleaned" value={report.emptyCellsRemoved || 0} color="text-amber-400" />
                    </div>

                    <div className="mt-8">
                       <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Column Analysis Matrix</h4>
                       <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                          {Object.entries(report.columnsAnalysis).map(([col, data]) => {
                             const colData = data as ColumnAnalysis;
                             return (
                             <div key={col} className="bg-slate-900/50 rounded-lg p-4 flex items-center justify-between">
                               <div>
                                 <span className="font-mono text-cyan-400 mr-2">{col}</span>
                                 <span className="text-xs px-2 py-1 bg-slate-800 rounded-full text-slate-400">{colData.type}</span>
                               </div>
                               <div className="flex space-x-4 text-sm text-slate-300">
                                  <span className="flex items-center" title="Unique Values"><Trash2 className="w-3 h-3 mr-1 opacity-50"/> {colData.uniqueValues} unique</span>
                                  {colData.type === 'number' && (
                                     <>
                                      <span className="text-emerald-400">Avg: {colData.avg?.toFixed(2)}</span>
                                      <span className="text-blue-400">Max: {colData.max}</span>
                                     </>
                                  )}
                               </div>
                             </div>
                             );
                          })}
                       </div>
                    </div>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

function FileSpreadsheetIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13h2" />
      <path d="M8 17h2" />
      <path d="M14 13h2" />
      <path d="M14 17h2" />
    </svg>
  );
}

function StatCard({ label, value, color = 'text-white' }: { label: string, value: number, color?: string }) {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}
