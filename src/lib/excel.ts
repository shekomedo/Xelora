import * as XLSX from 'xlsx';

export interface CleaningOptions {
  removeDuplicates: boolean;
  removeEmptyCells: boolean;
  standardizeDates: boolean;
  standardizeNumbers: boolean;
  standardizeText: boolean; // trim spaces, title case maybe
}

export interface SortOptions {
  sortSheets: boolean;
  sortDataByColumn: string | null;
  sortDirection: 'asc' | 'desc';
}

export interface AnalysisReport {
  totalRows: number;
  totalColumns: number;
  emptyCellsRemoved?: number;
  duplicatesRemoved?: number;
  columnsAnalysis: Record<string, ColumnAnalysis>;
}

export interface ColumnAnalysis {
  type: 'number' | 'string' | 'date' | 'unknown';
  uniqueValues: number;
  min?: number;
  max?: number;
  avg?: number;
  sum?: number;
}

export async function processExcelFile(
  file: File,
  cleaningOps: CleaningOptions,
  sortOps: SortOptions
): Promise<{ workbook: XLSX.WorkBook; report: AnalysisReport }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });

        const report: AnalysisReport = {
          totalRows: 0,
          totalColumns: 0,
          duplicatesRemoved: 0,
          emptyCellsRemoved: 0,
          columnsAnalysis: {},
        };

        // 1. Sort Sheets
        if (sortOps.sortSheets) {
          workbook.SheetNames.sort();
        }

        // Process each sheet
        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          let jsonData = XLSX.utils.sheet_to_json(sheet, { raw: false, dateNF: 'yyyy-mm-dd' }) as any[];
          
          if (jsonData.length === 0) return;

          report.totalRows += jsonData.length;
          report.totalColumns = Math.max(report.totalColumns, Object.keys(jsonData[0] || {}).length);

          const initialCount = jsonData.length;

          // Cleaning
          if (cleaningOps.removeEmptyCells) {
            jsonData = jsonData.filter(row => {
               const isEmpty = Object.values(row).every(val => val === null || val === undefined || val === '');
               return !isEmpty;
            });
            report.emptyCellsRemoved! += (initialCount - jsonData.length);
          }

          if (cleaningOps.removeDuplicates) {
            const seen = new Set();
            const uniqueData = [];
            for (const row of jsonData) {
              const str = JSON.stringify(row);
              if (!seen.has(str)) {
                seen.add(str);
                uniqueData.push(row);
              }
            }
            report.duplicatesRemoved! += (jsonData.length - uniqueData.length);
            jsonData = uniqueData;
          }

          if (cleaningOps.standardizeText) {
             jsonData = jsonData.map(row => {
               const newRow: any = {};
               for (const key in row) {
                 if (typeof row[key] === 'string') {
                   newRow[key] = row[key].trim().replace(/\s+/g, ' ');
                 } else {
                   newRow[key] = row[key];
                 }
               }
               return newRow;
             });
          }

          if (cleaningOps.standardizeNumbers) {
             jsonData = jsonData.map(row => {
               const newRow: any = {};
               for (const key in row) {
                  const val = row[key];
                  if (typeof val === 'string' && !isNaN(Number(val)) && val.trim() !== '') {
                     newRow[key] = Number(val);
                  } else {
                     newRow[key] = val;
                  }
               }
               return newRow;
             });
          }

          // Sorting Data
          if (sortOps.sortDataByColumn && jsonData.length > 0) {
            const col = sortOps.sortDataByColumn;
            if (jsonData[0][col] !== undefined) {
               jsonData.sort((a, b) => {
                  const valA = a[col];
                  const valB = b[col];
                  if (valA === valB) return 0;
                  if (valA == null) return 1;
                  if (valB == null) return -1;
                  
                  const dir = sortOps.sortDirection === 'asc' ? 1 : -1;
                  if (typeof valA === 'string' && typeof valB === 'string') {
                     return valA.localeCompare(valB) * dir;
                  }
                  return (valA < valB ? -1 : 1) * dir;
               });
            }
          }

          // Generate Analysis for this sheet (basic)
          if (jsonData.length > 0) {
             const keys = Object.keys(jsonData[0]);
             keys.forEach(key => {
                const vals = jsonData.map(r => r[key]).filter(v => v !== undefined && v !== null && v !== '');
                const uniqueVals = new Set(vals).size;
                
                const numberVals = vals.filter(v => typeof v === 'number');
                if (numberVals.length > 0 && numberVals.length === vals.length) {
                   const min = Math.min(...numberVals);
                   const max = Math.max(...numberVals);
                   const sum = numberVals.reduce((a,b) => a+b, 0);
                   const avg = sum / numberVals.length;
                   report.columnsAnalysis[key] = { type: 'number', uniqueValues: uniqueVals, min, max, sum, avg };
                } else if (vals.some(v => v instanceof Date || (!isNaN(Date.parse(String(v))) && isNaN(Number(v))))) {
                   report.columnsAnalysis[key] = { type: 'date', uniqueValues: uniqueVals };
                } else {
                   report.columnsAnalysis[key] = { type: 'string', uniqueValues: uniqueVals };
                }
             });
          }

          // Update workbook sheet
          const newSheet = XLSX.utils.json_to_sheet(jsonData);
          workbook.Sheets[sheetName] = newSheet;
        });

        resolve({ workbook, report });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

export function exportWorkbook(workbook: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(workbook, filename);
}
