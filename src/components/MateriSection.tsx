import React, { useState } from 'react';
import { MATERIALS } from '../data/learningData';
import { 
  CheckCircle2, Lightbulb, 
  ArrowRight, ArrowLeft, Laptop, Check, ArrowDown,
  Layers, RotateCcw
} from 'lucide-react';

interface MateriSectionProps {
  completedMateriIds: string[];
  onToggleMateriComplete: (id: string) => void;
  onNavigateToLatihan: () => void;
  selectedMateriId?: string;
}

export const MateriSection: React.FC<MateriSectionProps> = ({
  completedMateriIds,
  onToggleMateriComplete,
  onNavigateToLatihan,
  selectedMateriId
}) => {
  const [activeMateriId, setActiveMateriId] = useState<string>(
    selectedMateriId || MATERIALS[0].id
  );

  // States for Interactive Mini-Laboratories
  // Demo 1: Concept grid
  const [conceptHighlight, setConceptHighlight] = useState<'all' | 'column' | 'row' | 'cell'>('all');
  const [clickedCell, setClickedCell] = useState<{ r: number; c: number }>({ r: 1, c: 1 });

  // Demo 2: Insert Dialog
  const [dialogCols, setDialogCols] = useState<number>(5);
  const [dialogRows, setDialogRows] = useState<number>(4);
  const [previewTable, setPreviewTable] = useState<{ cols: number; rows: number }>({ cols: 5, rows: 4 });
  const [dialogMessage, setDialogMessage] = useState<string>('Klik "OK (Sisipkan)" untuk melihat tabel terbentuk di lembar kerja Word!');

  // Demo 3: Column Width
  const [colWidths, setColWidths] = useState<number[]>([45, 120, 80]);

  // Demo 4: Merge Cells
  const [mergedState, setMergedState] = useState<boolean>(false);
  const [selectedMergeCells, setSelectedMergeCells] = useState<number[]>([1, 2]);

  // Demo 5: Align Center (9 positions)
  const [activeAlign, setActiveAlign] = useState<string>('center');

  // Demo 6: Delete Tools
  const [deleteRowsCount, setDeleteRowsCount] = useState<number>(4);
  const [deleteColsCount, setDeleteColsCount] = useState<number>(3);
  const [isTableDeleted, setIsTableDeleted] = useState<boolean>(false);
  const [deleteLog, setDeleteLog] = useState<string>('Pilih salah satu tombol perintah hapus di tab Layout.');

  // Demo 7: Insert Tools
  const [insertRows, setInsertRows] = useState<string[]>(['Siswa 1', 'Siswa 2 (Kursor Aktif)', 'Siswa 3']);
  const [insertCols, setInsertCols] = useState<string[]>(['No', 'Nama Siswa', 'Kelas']);
  const [insertNotice, setInsertNotice] = useState<string>('Klik tombol di atas untuk melihat penambahan baris atau kolom!');

  const activeMateri = MATERIALS.find((m) => m.id === activeMateriId) || MATERIALS[0];
  const isCurrentDone = completedMateriIds.includes(activeMateri.id);

  // Handlers for Demo 2 (Insert Dialog)
  const handleApplyInsertDialog = () => {
    setPreviewTable({ cols: dialogCols, rows: dialogRows });
    setDialogMessage(`✔ Tabel baru berukuran ${dialogCols} Kolom × ${dialogRows} Baris berhasil disisipkan di Word!`);
  };

  // Handlers for Demo 4 (Merge Cells)
  const handleToggleMergeCell = (index: number) => {
    if (mergedState) return;
    if (selectedMergeCells.includes(index)) {
      if (selectedMergeCells.length > 1) {
        setSelectedMergeCells(selectedMergeCells.filter((i) => i !== index));
      }
    } else {
      setSelectedMergeCells([...selectedMergeCells, index].sort());
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
              <span>Pertemuan 1 · Mandiri di Laptop</span>
              <span>·</span>
              <span>7 Materi Pembelajaran Interaktif</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Materi 1 sampai Materi 7
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Pelajari konsep dan langkah resminya, uji coba di laboratorium visual interaktif, lalu praktikkan langsung di Microsoft Word laptopmu!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-medium">Tuntas:</span>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              {completedMateriIds.length} dari 7 Materi
            </span>
          </div>
        </div>

        {/* 7 Materials Quick Navigation Tabs (Materi 1 - Materi 7) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-6">
          {MATERIALS.map((m) => {
            const isSelected = m.id === activeMateriId;
            const isDone = completedMateriIds.includes(m.id);

            return (
              <button
                key={m.id}
                onClick={() => setActiveMateriId(m.id)}
                className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between h-24 ${
                  isSelected
                    ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-500/20 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                    isSelected ? 'text-sky-700' : 'text-slate-400'
                  }`}>
                    Materi {m.number}
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>
                <div className={`text-xs font-bold line-clamp-2 ${
                  isSelected ? 'text-sky-900' : 'text-slate-700'
                }`}>
                  {m.title.replace('Cara ', '').replace('Pengertian ', '')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Material Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Explanations, Numbered Steps, Tips, Word Action Prompt (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="px-3 py-1 bg-sky-50 text-sky-800 text-xs font-extrabold rounded-md border border-sky-100">
                  Materi {activeMateri.number} dari 7
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  {activeMateri.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {activeMateri.subtitle}
                </p>
              </div>

              <button
                onClick={() => onToggleMateriComplete(activeMateri.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isCurrentDone
                    ? 'bg-teal-600 text-white shadow-xs hover:bg-teal-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {isCurrentDone ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Sudah Saya Praktikkan di Word</span>
                  </>
                ) : (
                  <>
                    <span>Tandai Sudah Dipraktikkan</span>
                  </>
                )}
              </button>
            </div>

            {/* Ringkasan Singkat */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-sm text-slate-800 font-medium leading-relaxed">
              {activeMateri.summary}
            </div>

            {/* Numbered Steps */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-600" />
                Langkah Bernomor Resmi Microsoft Word:
              </h3>

              <div className="space-y-3">
                {activeMateri.steps.map((st) => (
                  <div
                    key={st.number}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 transition-colors flex items-start gap-3.5 shadow-xs"
                  >
                    <div className="w-7 h-7 rounded-lg bg-sky-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {st.number}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                        {st.text}
                      </p>
                      {st.detail && (
                        <p className="text-xs text-slate-500 whitespace-pre-line leading-relaxed">
                          {st.detail}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tip Box */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Tips Guru Informatika</span>
              </div>
              <p className="text-xs leading-relaxed">
                {activeMateri.proTip}
              </p>
            </div>

            {/* Mandatory Word Action Prompt */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-300 text-teal-950 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-teal-800">
                <Laptop className="w-4 h-4 text-teal-600" />
                <span>Praktikkan di Word Kamu Sekarang!</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                {activeMateri.wordActionPrompt}
              </p>
            </div>

            {/* Navigation Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  const currIdx = MATERIALS.findIndex((m) => m.id === activeMateri.id);
                  if (currIdx > 0) setActiveMateriId(MATERIALS[currIdx - 1].id);
                }}
                disabled={MATERIALS.findIndex((m) => m.id === activeMateri.id) === 0}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Materi Sebelumnya</span>
              </button>

              <button
                onClick={() => {
                  const currIdx = MATERIALS.findIndex((m) => m.id === activeMateri.id);
                  if (currIdx < MATERIALS.length - 1) {
                    setActiveMateriId(MATERIALS[currIdx + 1].id);
                  } else {
                    onNavigateToLatihan();
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <span>
                  {MATERIALS.findIndex((m) => m.id === activeMateri.id) === MATERIALS.length - 1
                    ? 'Lanjut ke Latihan: Tiru Tabel Ini!'
                    : 'Materi Selanjutnya'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Visual Laboratory (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Laboratorium Visual Interaktif (Materi {activeMateri.number})
                </h3>
              </div>
              <span className="text-[11px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Bisa Diuji Langsung
              </span>
            </div>

            {/* DEMO 1: Anatomi Tabel (Materi 1) */}
            {activeMateri.id === 'materi-1' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  Pilih tombol di bawah untuk menyorot bagian tabel, atau klik salah satu kotak sel:
                </p>

                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => setConceptHighlight('all')}
                    className={`py-1.5 px-2 text-xs font-bold rounded-xl border transition-all ${
                      conceptHighlight === 'all'
                        ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setConceptHighlight('column')}
                    className={`py-1.5 px-2 text-xs font-bold rounded-xl border transition-all ${
                      conceptHighlight === 'column'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
                    }`}
                  >
                    Kolom (↓)
                  </button>
                  <button
                    onClick={() => setConceptHighlight('row')}
                    className={`py-1.5 px-2 text-xs font-bold rounded-xl border transition-all ${
                      conceptHighlight === 'row'
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
                    }`}
                  >
                    Baris (→)
                  </button>
                  <button
                    onClick={() => setConceptHighlight('cell')}
                    className={`py-1.5 px-2 text-xs font-bold rounded-xl border transition-all ${
                      conceptHighlight === 'cell'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    Sel (Kotak)
                  </button>
                </div>

                {/* Interactive Grid Canvas */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto">
                  <table className="w-full border-collapse text-xs text-center">
                    <thead>
                      <tr>
                        {['Kolom A', 'Kolom B', 'Kolom C'].map((col, cIdx) => (
                          <th
                            key={cIdx}
                            className={`p-2 border font-bold transition-colors ${
                              conceptHighlight === 'column' && cIdx === (clickedCell?.c ?? 1)
                                ? 'bg-sky-500 text-white border-sky-600 shadow-inner'
                                : 'bg-slate-200 text-slate-700 border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <span>{col}</span>
                              {conceptHighlight === 'column' && cIdx === (clickedCell?.c ?? 1) && (
                                <ArrowDown className="w-3 h-3 text-sky-100" />
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[0, 1, 2].map((rIdx) => (
                        <tr key={rIdx}>
                          {[0, 1, 2].map((cIdx) => {
                            const isCellClicked = clickedCell?.r === rIdx && clickedCell?.c === cIdx;
                            const isColHighlighted = conceptHighlight === 'column' && cIdx === (clickedCell?.c ?? 1);
                            const isRowHighlighted = conceptHighlight === 'row' && rIdx === (clickedCell?.r ?? 1);
                            const isCellHighlighted = conceptHighlight === 'cell' && isCellClicked;

                            let bgClass = 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300';
                            if (isCellHighlighted) {
                              bgClass = 'bg-amber-400 text-slate-900 font-extrabold border-amber-500 scale-105 shadow-md z-10';
                            } else if (isColHighlighted) {
                              bgClass = 'bg-sky-100 text-sky-900 font-semibold border-sky-300';
                            } else if (isRowHighlighted) {
                              bgClass = 'bg-teal-100 text-teal-900 font-semibold border-teal-300';
                            }

                            return (
                              <td
                                key={cIdx}
                                onClick={() => setClickedCell({ r: rIdx, c: cIdx })}
                                className={`p-3 border cursor-pointer transition-all ${bgClass}`}
                              >
                                <div>R{rIdx + 1}C{cIdx + 1}</div>
                                {isCellClicked && conceptHighlight === 'cell' && (
                                  <div className="text-[10px] text-amber-900 font-bold">SEL INI!</div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 text-xs text-slate-700 font-medium">
                  Sel aktif saat ini di <span className="font-bold text-sky-700">Baris ke-{(clickedCell?.r ?? 0) + 1}</span> dan <span className="font-bold text-teal-700">Kolom ke-{(clickedCell?.c ?? 0) + 1}</span>.
                </div>
              </div>
            )}

            {/* DEMO 2: Kotak Dialog Insert Table (Materi 2) */}
            {activeMateri.id === 'materi-2' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 shadow-inner">
                  {/* Miniature MS Word Insert Table Dialog Box */}
                  <div className="bg-white rounded-xl border border-slate-300 shadow-md p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-800">Insert Table</span>
                      <span className="text-[10px] text-slate-400 font-mono">Word Dialog</span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <label className="text-slate-700 font-medium">Number of columns:</label>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setDialogCols(Math.max(1, dialogCols - 1))}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center border border-slate-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-sky-800">{dialogCols}</span>
                          <button
                            onClick={() => setDialogCols(Math.min(7, dialogCols + 1))}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center border border-slate-300"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-slate-700 font-medium">Number of rows:</label>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setDialogRows(Math.max(1, dialogRows - 1))}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center border border-slate-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-sky-800">{dialogRows}</span>
                          <button
                            onClick={() => setDialogRows(Math.min(6, dialogRows + 1))}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center border border-slate-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        onClick={handleApplyInsertDialog}
                        className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                      >
                        OK (Sisipkan)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table Generated Preview */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Hasil Preview Tabel:</span>
                    <span className="font-bold text-sky-800">{previewTable.cols} Kolom × {previewTable.rows} Baris</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
                    <table className="w-full border-collapse border border-slate-300 text-xs">
                      <tbody>
                        {Array.from({ length: previewTable.rows }).map((_, r) => (
                          <tr key={r}>
                            {Array.from({ length: previewTable.cols }).map((_, c) => (
                              <td
                                key={c}
                                className={`border border-slate-300 p-2 text-center text-slate-600 ${
                                  r === 0 ? 'bg-sky-50 font-bold text-sky-900' : 'bg-white'
                                }`}
                              >
                                {r === 0 ? `K${c + 1}` : `...`}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-teal-700 font-medium">{dialogMessage}</p>
                </div>
              </div>
            )}

            {/* DEMO 3: Mengatur Lebar Kolom (Materi 3) */}
            {activeMateri.id === 'materi-3' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  Ubah slider di bawah untuk menyesuaikan ukuran lebar kolom secara sentimeter:
                </p>

                <div className="space-y-3">
                  {colWidths.map((width, idx) => {
                    const colNames = ['Kolom 1 (NO)', 'Kolom 2 (NAMA SISWA)', 'Kolom 3 (KELAS)'];
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>{colNames[idx]}</span>
                          <span className="text-sky-700 font-bold">{(width / 25).toFixed(1)} cm</span>
                        </div>
                        <input
                          type="range"
                          min={30}
                          max={160}
                          value={width}
                          onChange={(e) => {
                            const newWidths = [...colWidths];
                            newWidths[idx] = Number(e.target.value);
                            setColWidths(newWidths);
                          }}
                          className="w-full accent-sky-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 overflow-x-auto">
                  <table className="border-collapse border border-slate-300 text-xs">
                    <thead>
                      <tr className="bg-slate-100">
                        {colWidths.map((w, idx) => (
                          <th
                            key={idx}
                            style={{ width: `${w}px` }}
                            className="border border-slate-300 p-2 text-slate-800 font-bold truncate"
                          >
                            {idx === 0 ? 'NO' : idx === 1 ? 'NAMA SISWA' : 'KELAS'}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-2 text-center">1</td>
                        <td className="border border-slate-300 p-2 truncate">Dimas Prasetya</td>
                        <td className="border border-slate-300 p-2 text-center">X IPA 1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-slate-500">
                  Perhatikan: Kolom NO dibuat ramping (hemat ruang), sedangkan kolom Nama Siswa diberikan ruang lebih luas.
                </p>
              </div>
            )}

            {/* DEMO 4: Menggabungkan Sel / Merge Cells (Materi 4) */}
            {activeMateri.id === 'materi-4' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  Klik sel untuk menyeleksi, lalu klik tombol <span className="font-bold text-sky-700">Merge Cells</span>:
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (!mergedState && selectedMergeCells.length >= 2) {
                        setMergedState(true);
                      }
                    }}
                    disabled={mergedState || selectedMergeCells.length < 2}
                    className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Merge Cells (Gabung)</span>
                  </button>

                  <button
                    onClick={() => {
                      setMergedState(false);
                      setSelectedMergeCells([1, 2]);
                    }}
                    disabled={!mergedState}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Split (Kembalikan)</span>
                  </button>
                </div>

                {/* Table representation */}
                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <table className="w-full border-collapse border border-slate-300 text-xs text-center">
                    <tbody>
                      {/* Row 1 */}
                      <tr>
                        <td className="border border-slate-300 p-2.5 bg-slate-50 font-bold">NO</td>
                        {mergedState ? (
                          <td
                            colSpan={2}
                            className="border-2 border-teal-500 bg-teal-50 p-2.5 font-bold text-teal-900 transition-all animate-pulse"
                          >
                            KETERANGAN (2 Sel Melebur Jadi 1)
                          </td>
                        ) : (
                          <>
                            <td
                              onClick={() => handleToggleMergeCell(1)}
                              className={`border border-slate-300 p-2.5 cursor-pointer font-medium transition-colors ${
                                selectedMergeCells.includes(1) ? 'bg-sky-200 text-sky-900 border-sky-400 font-bold' : 'bg-white'
                              }`}
                            >
                              Sakit {selectedMergeCells.includes(1) && '✓'}
                            </td>
                            <td
                              onClick={() => handleToggleMergeCell(2)}
                              className={`border border-slate-300 p-2.5 cursor-pointer font-medium transition-colors ${
                                selectedMergeCells.includes(2) ? 'bg-sky-200 text-sky-900 border-sky-400 font-bold' : 'bg-white'
                              }`}
                            >
                              Izin {selectedMergeCells.includes(2) && '✓'}
                            </td>
                          </>
                        )}
                      </tr>
                      {/* Row 2 */}
                      <tr>
                        <td className="border border-slate-300 p-2">1</td>
                        <td className="border border-slate-300 p-2">0</td>
                        <td className="border border-slate-300 p-2">1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800">
                  {mergedState
                    ? '🎉 Hebat! Kedua sel berhasil digabungkan menjadi satu kolom payung yang rapi.'
                    : 'Pilih minimal 2 sel bersebelahan lalu klik Merge Cells di atas.'}
                </div>
              </div>
            )}

            {/* DEMO 5: Menengahkan Teks / Align Center (Materi 5) */}
            {activeMateri.id === 'materi-5' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  9 Variasi Kotak Posisi Teks Word (Layout &gt; Alignment):
                </p>

                {/* 3x3 Alignment Pad */}
                <div className="grid grid-cols-3 gap-1 max-w-[200px] mx-auto bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                  {[
                    { id: 'top-left', label: '↖ Top Left' },
                    { id: 'top-center', label: '↑ Top Center' },
                    { id: 'top-right', label: '↗ Top Right' },
                    { id: 'center-left', label: '← Center Left' },
                    { id: 'center', label: '✦ Align Center' },
                    { id: 'center-right', label: '→ Center Right' },
                    { id: 'bottom-left', label: '↙ Bottom Left' },
                    { id: 'bottom-center', label: '↓ Bottom Center' },
                    { id: 'bottom-right', label: '↘ Bottom Right' }
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => setActiveAlign(pos.id)}
                      title={pos.label}
                      className={`h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center border ${
                        activeAlign === pos.id
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {pos.id === 'center' ? '●' : '▫'}
                    </button>
                  ))}
                </div>

                {/* Live Preview Box */}
                <div className="border border-slate-300 bg-white rounded-2xl h-36 p-4 flex transition-all relative overflow-hidden shadow-inner">
                  <div className="absolute top-2 right-2 text-[10px] text-slate-400 font-mono">
                    Tinggi Sel: 3.5 cm
                  </div>
                  <div
                    className={`w-full flex transition-all duration-300 ${
                      activeAlign === 'top-left' ? 'items-start justify-start' :
                      activeAlign === 'top-center' ? 'items-start justify-center' :
                      activeAlign === 'top-right' ? 'items-start justify-end' :
                      activeAlign === 'center-left' ? 'items-center justify-start' :
                      activeAlign === 'center' ? 'items-center justify-center' :
                      activeAlign === 'center-right' ? 'items-center justify-end' :
                      activeAlign === 'bottom-left' ? 'items-end justify-start' :
                      activeAlign === 'bottom-center' ? 'items-end justify-center' :
                      'items-end justify-end'
                    }`}
                  >
                    <div className="px-3 py-1.5 bg-teal-50 border border-teal-300 rounded-lg text-teal-900 font-extrabold text-xs shadow-xs">
                      INFORMATIKA X IPA
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 text-center">
                  Posisi Aktif:{' '}
                  <span className="font-bold text-sky-700 uppercase tracking-wider">
                    {activeAlign.replace('-', ' ')}
                  </span>
                </div>
              </div>
            )}

            {/* DEMO 6: Menghapus Baris & Kolom (Materi 6) */}
            {activeMateri.id === 'materi-6' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  Uji tombol Delete pada tab Layout:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (deleteRowsCount > 1) {
                        setDeleteRowsCount(deleteRowsCount - 1);
                        setDeleteLog('Berhasil menjalankan: Delete Rows (-1 baris)!');
                      }
                    }}
                    disabled={deleteRowsCount <= 1 || isTableDeleted}
                    className="py-2 px-3 bg-red-50 hover:bg-red-100 disabled:opacity-40 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all text-left"
                  >
                    🗑️ Delete Rows
                  </button>

                  <button
                    onClick={() => {
                      if (deleteColsCount > 1) {
                        setDeleteColsCount(deleteColsCount - 1);
                        setDeleteLog('Berhasil menjalankan: Delete Columns (-1 kolom)!');
                      }
                    }}
                    disabled={deleteColsCount <= 1 || isTableDeleted}
                    className="py-2 px-3 bg-red-50 hover:bg-red-100 disabled:opacity-40 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all text-left"
                  >
                    🗑️ Delete Columns
                  </button>

                  <button
                    onClick={() => {
                      setIsTableDeleted(true);
                      setDeleteLog('Tabel utuh terhapus dari dokumen (Delete Table)!');
                    }}
                    disabled={isTableDeleted}
                    className="py-2 px-3 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all text-left"
                  >
                    ❌ Delete Table
                  </button>

                  <button
                    onClick={() => {
                      setIsTableDeleted(false);
                      setDeleteRowsCount(4);
                      setDeleteColsCount(3);
                      setDeleteLog('Tabel dikembalikan ke ukuran awal.');
                    }}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all text-left"
                  >
                    🔄 Reset Semula
                  </button>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 min-h-[100px] flex items-center justify-center">
                  {isTableDeleted ? (
                    <div className="text-center text-xs text-red-600 font-bold">
                      [Tabel telah dihapus secara total]
                    </div>
                  ) : (
                    <table className="w-full border-collapse border border-slate-300 text-xs">
                      <tbody>
                        {Array.from({ length: deleteRowsCount }).map((_, r) => (
                          <tr key={r}>
                            {Array.from({ length: deleteColsCount }).map((_, c) => (
                              <td
                                key={c}
                                className="border border-slate-300 p-2 text-center text-slate-600 bg-white"
                              >
                                Baris {r + 1}, Kolom {c + 1}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-slate-100 text-xs text-slate-700 font-medium">
                  {deleteLog}
                </div>
              </div>
            )}

            {/* DEMO 7: Menyisipkan Baris & Kolom (Materi 7) */}
            {activeMateri.id === 'materi-7' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  Sisipkan baris atau kolom baru di sekitar posisi aktif:
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      const newRows = [...insertRows];
                      newRows.splice(1, 0, `Baris Sisip Baru (Above)`);
                      setInsertRows(newRows);
                      setInsertNotice('Baris baru berhasil disisipkan di ATAS posisi kursor!');
                    }}
                    className="p-2 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl font-bold border border-sky-200 text-left"
                  >
                    ⬆ Insert Above
                  </button>

                  <button
                    onClick={() => {
                      const newRows = [...insertRows];
                      newRows.splice(2, 0, `Baris Sisip Baru (Below)`);
                      setInsertRows(newRows);
                      setInsertNotice('Baris baru berhasil disisipkan di BAWAH posisi kursor!');
                    }}
                    className="p-2 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl font-bold border border-sky-200 text-left"
                  >
                    ⬇ Insert Below
                  </button>

                  <button
                    onClick={() => {
                      const newCols = [...insertCols];
                      newCols.splice(1, 0, `Kolom Tambahan`);
                      setInsertCols(newCols);
                      setInsertNotice('Kolom baru disisipkan di sebelah KIRI!');
                    }}
                    className="p-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl font-bold border border-teal-200 text-left"
                  >
                    ⬅ Insert Left
                  </button>

                  <button
                    onClick={() => {
                      const newCols = [...insertCols];
                      newCols.push(`Kolom Tambahan`);
                      setInsertCols(newCols);
                      setInsertNotice('Kolom baru disisipkan di sebelah KANAN!');
                    }}
                    className="p-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl font-bold border border-teal-200 text-left"
                  >
                    ➡ Insert Right
                  </button>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 overflow-x-auto max-h-48 overflow-y-auto">
                  <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead>
                      <tr className="bg-slate-100">
                        {insertCols.map((c, idx) => (
                          <th key={idx} className="border border-slate-300 p-1.5 text-slate-800">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {insertRows.map((r, rIdx) => (
                        <tr
                          key={rIdx}
                          className={r.includes('Kursor Aktif') ? 'bg-sky-100 font-semibold' : 'bg-white'}
                        >
                          {insertCols.map((_, cIdx) => (
                            <td key={cIdx} className="border border-slate-300 p-1.5 text-center text-slate-700">
                              {cIdx === 0 ? rIdx + 1 : r}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800">
                  {insertNotice}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
