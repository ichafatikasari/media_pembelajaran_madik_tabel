import React, { useState } from 'react';
import { GUIDED_ATTENDANCE_TABLE, CHECKLIST_STEPS } from '../data/learningData';
import { 
  CheckSquare, CheckCircle2, Laptop, ArrowRight, 
  HelpCircle, Sparkles, BookOpen, MessageSquare, ExternalLink, Check
} from 'lucide-react';

interface LatihanSectionProps {
  completedChecklist: number[];
  onToggleChecklist: (stepId: number) => void;
  difficultiesNote: string;
  setDifficultiesNote: (note: string) => void;
  onNavigateToMateri: (materiId: string) => void;
  onNavigateToPertemuan2: () => void;
}

export const LatihanSection: React.FC<LatihanSectionProps> = ({
  completedChecklist,
  onToggleChecklist,
  difficultiesNote,
  setDifficultiesNote,
  onNavigateToMateri,
  onNavigateToPertemuan2
}) => {
  const allDone = completedChecklist.length === CHECKLIST_STEPS.length;

  return (
    <div className="space-y-8 pb-16">
      {/* Title & Context Brief */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
            <Laptop className="w-4 h-4 text-teal-600" />
            <span>Pertemuan 1 · Latihan Mandiri di Laptop</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Latihan Terbimbing: "Tiru Tabel Ini!"
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Buka aplikasi Microsoft Word asli di laptopmu sekarang. Buatlah tabel yang bentuk, header, 
            penggabungan sel, dan susunannya <span className="font-bold text-slate-800">sama persis</span> dengan contoh di bawah ini!
          </p>
        </div>

        {/* Progress Tracker Card */}
        <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl flex items-center gap-4 shrink-0">
          <div className="text-right">
            <span className="text-xs font-semibold text-teal-700">Checklist Mandiri:</span>
            <div className="text-2xl font-black text-teal-900 tabular-nums">
              {completedChecklist.length} / {CHECKLIST_STEPS.length}
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {allDone ? '✓' : `${Math.round((completedChecklist.length / CHECKLIST_STEPS.length) * 100)}%`}
          </div>
        </div>
      </div>

      {/* Target Table to Clone (HTML/CSS Presentation) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-extrabold text-teal-700 uppercase tracking-wider">
              Contoh Acuan Dokumen Word
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              {GUIDED_ATTENDANCE_TABLE.title}
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Struktur: 8 Kolom × 8 Baris (Header Bertingkat Hijau)
          </span>
        </div>

        {/* Visual Callout Annotations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 font-medium">
            <span className="font-bold block text-teal-800">1. Header Berwarna Hijau:</span>
            Gunakan Shading hijau pada baris judul atas di Microsoft Word.
          </div>
          <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 font-medium">
            <span className="font-bold block text-sky-800">2. Merge Cells (Header Bertingkat):</span>
            NO, NAMA, &amp; JUMLAH digabung 2 baris vertikal. KETERANGAN digabung 3 kolom mendatar.
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-medium">
            <span className="font-bold block text-amber-800">3. Rata Tengah (Align Center):</span>
            Semua teks judul dan tanda centang diposisikan di tengah sel.
          </div>
        </div>

        {/* The Exact Table Visual (HTML/CSS) */}
        <div className="border border-slate-300 rounded-2xl p-4 sm:p-6 bg-slate-50/50 overflow-x-auto shadow-inner">
          <div className="bg-white rounded-xl border border-slate-300 p-4 shadow-sm min-w-[640px]">
            <div className="text-center font-extrabold text-sm text-slate-800 uppercase tracking-tight mb-3">
              TABEL ABSEN SISWA KELAS X IPA
            </div>

            <table className="w-full border-collapse border-2 border-teal-800 text-xs">
              <thead>
                {/* Header Row 1 */}
                <tr className="bg-teal-700 text-white font-extrabold text-center">
                  <th rowSpan={2} style={{ width: '45px' }} className="border-2 border-teal-800 p-2.5">
                    NO
                  </th>
                  <th rowSpan={2} style={{ width: '220px' }} className="border-2 border-teal-800 p-2.5 text-left pl-3">
                    NAMA SISWA
                  </th>
                  <th colSpan={2} style={{ width: '80px' }} className="border-2 border-teal-800 p-2">
                    JENIS KELAMIN
                  </th>
                  <th colSpan={3} style={{ width: '120px' }} className="border-2 border-teal-800 p-2">
                    KETERANGAN
                  </th>
                  <th rowSpan={2} style={{ width: '60px' }} className="border-2 border-teal-800 p-2.5">
                    JUMLAH
                  </th>
                </tr>

                {/* Header Row 2 (Sub-Columns) */}
                <tr className="bg-teal-600 text-white font-extrabold text-center">
                  <th style={{ width: '40px' }} className="border-2 border-teal-800 p-1.5">L</th>
                  <th style={{ width: '40px' }} className="border-2 border-teal-800 p-1.5">P</th>
                  <th style={{ width: '40px' }} className="border-2 border-teal-800 p-1.5">S</th>
                  <th style={{ width: '40px' }} className="border-2 border-teal-800 p-1.5">I</th>
                  <th style={{ width: '40px' }} className="border-2 border-teal-800 p-1.5">A</th>
                </tr>
              </thead>

              {/* Data Rows */}
              <tbody>
                {GUIDED_ATTENDANCE_TABLE.sampleRows.map((row, rIdx) => (
                  <tr
                    key={row.no}
                    className={`text-center transition-colors ${
                      rIdx % 2 === 1 ? 'bg-slate-50' : 'bg-white'
                    }`}
                  >
                    <td className="border border-slate-300 p-2 font-bold text-slate-800">
                      {row.no}
                    </td>
                    <td className="border border-slate-300 p-2 text-left pl-3 font-semibold text-slate-900">
                      {row.nama}
                    </td>
                    <td className="border border-slate-300 p-2 font-bold text-sky-700">
                      {row.l}
                    </td>
                    <td className="border border-slate-300 p-2 font-bold text-pink-700">
                      {row.p}
                    </td>
                    <td className="border border-slate-300 p-2 text-slate-600">
                      {row.s}
                    </td>
                    <td className="border border-slate-300 p-2 font-bold text-amber-700">
                      {row.i}
                    </td>
                    <td className="border border-slate-300 p-2 font-bold text-red-600">
                      {row.a}
                    </td>
                    <td className="border border-slate-300 p-2 font-bold text-slate-900 bg-slate-100">
                      {row.jml}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2-Column: Checklist on Left (7 Cols), Support Drawer on Right (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Checklist */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-teal-600" />
                <span>Petunjuk Meniru (Centang Mandiri di Laptopmu):</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">6 Langkah Tiru</span>
            </div>

            <div className="space-y-3">
              {CHECKLIST_STEPS.map((step) => {
                const isChecked = completedChecklist.includes(step.id);
                return (
                  <div
                    key={step.id}
                    onClick={() => onToggleChecklist(step.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isChecked
                        ? 'bg-teal-50/70 border-teal-300 text-teal-950 shadow-xs'
                        : 'bg-slate-50/80 border-slate-200/90 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isChecked
                          ? 'bg-teal-600 text-white'
                          : 'bg-white border-2 border-slate-300 text-transparent'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {step.id}. {step.title}
                        </h4>
                        <span className="text-[10px] text-teal-700 bg-white px-2 py-0.5 rounded border border-teal-200 font-bold shrink-0">
                          {step.materiName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: "Kalau macet, lihat materi ini" + Refleksi Kesulitan (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Box: Kalau Macet, Lihat Materi Ini */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>Kalau Macet, Lihat Materi Ini:</span>
            </div>

            <p className="text-xs text-slate-500">
              Klik tautan cepat berikut untuk membaca kembali langkah resminya jika bingung:
            </p>

            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'materi-2', name: 'Materi 2: Menyisipkan Tabel (Insert Table)' },
                { id: 'materi-3', name: 'Materi 3: Mengatur Lebar Kolom (Width)' },
                { id: 'materi-4', name: 'Materi 4: Menggabungkan Sel (Merge Cells)' },
                { id: 'materi-5', name: 'Materi 5: Menengahkan Teks (Align Center)' },
                { id: 'materi-6', name: 'Materi 6: Menghapus Baris atau Kolom' },
                { id: 'materi-7', name: 'Materi 7: Menyisipkan Baris atau Kolom' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigateToMateri(item.id)}
                  className="w-full text-left p-2.5 rounded-xl bg-sky-50/70 hover:bg-sky-100 border border-sky-200 text-xs font-bold text-sky-900 transition-colors flex items-center justify-between group"
                >
                  <span>{item.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-sky-600 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Kolom Isian: Bagian yang masih sulit bagi saya */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <span>Bagian yang Masih Sulit Bagi Saya:</span>
            </div>
            <p className="text-xs text-slate-500">
              Ketikkan di sini langkah apa yang menurutmu paling menantang (tersimpan otomatis di browser):
            </p>
            <textarea
              rows={3}
              value={difficultiesNote}
              onChange={(e) => setDifficultiesNote(e.target.value)}
              placeholder="Cth: Saya masih agak ragu saat memblok sel vertikal untuk NO dan JUMLAH sebelum Merge Cells..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-400 bg-slate-50 focus:bg-white transition-all"
            />
            {difficultiesNote && (
              <span className="text-[11px] text-teal-700 font-medium block">
                ✔ Catatan kesulitanmu tersimpan. Guru akan membantumu di pertemuan berikutnya!
              </span>
            )}
          </div>

          {/* CTA to Pertemuan 2 */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-600 to-sky-700 text-white space-y-3 shadow-md">
            <h4 className="font-extrabold text-sm">
              Sudah Selesai Mempraktikkan di Word?
            </h4>
            <p className="text-xs text-teal-100 leading-relaxed">
              Hebat! Simpan file Word-mu. Di pertemuan berikutnya, kelas akan bermain tantangan kelompok di Smart Board!
            </p>
            <button
              onClick={onNavigateToPertemuan2}
              className="w-full py-2.5 bg-white text-slate-900 rounded-xl text-xs font-extrabold hover:bg-teal-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Lanjut ke Pertemuan 2 (Tantangan & Kuis)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
