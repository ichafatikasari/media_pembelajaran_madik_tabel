import React, { useState } from 'react';
import { Student, QuizSettings } from '../types';
import { DEFAULT_STUDENTS } from '../data/learningData';
import { 
  Users, Plus, Trash2, RotateCcw, Volume2, 
  VolumeX, Clock, Award, Shield, Sparkles, Check, AlertCircle 
} from 'lucide-react';
import { playClickSound, setSoundEnabled } from '../utils/sound';

interface StudentRosterViewProps {
  students: Student[];
  onUpdateStudents: (students: Student[]) => void;
  settings: QuizSettings;
  onUpdateSettings: (settings: QuizSettings) => void;
  onBackToGame: () => void;
}

export const StudentRosterView: React.FC<StudentRosterViewProps> = ({
  students,
  onUpdateStudents,
  settings,
  onUpdateSettings,
  onBackToGame
}) => {
  const [newName, setNewName] = useState('');
  const [newGroup, setNewGroup] = useState<number>(0);
  const [pasteText, setPasteText] = useState('');
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Add single student
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    playClickSound();
    const newStudent: Student = {
      id: `std-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: newName.trim(),
      groupId: newGroup,
      score: 0,
      answeredCount: 0,
      correctCount: 0,
      hasStar: false
    };

    onUpdateStudents([...students, newStudent]);
    setNewName('');
    showToast(`Siswa "${newStudent.name}" berhasil ditambahkan ke Baris ${newGroup + 1}`);
  };

  // Bulk paste students
  const handleBulkPaste = () => {
    if (!pasteText.trim()) return;
    playClickSound();

    const lines = pasteText.split('\n').map((l) => l.trim()).filter(Boolean);
    const addedList: Student[] = [];

    lines.forEach((line, idx) => {
      // Formats supported:
      // "Ahmad Fauzi, 1"
      // "Ahmad Fauzi, Baris 2"
      // "Ahmad Fauzi" (cycles through groups 0-3)
      let name = line;
      let grpId = (students.length + idx) % 4; // default distribute evenly

      if (line.includes(',')) {
        const parts = line.split(',');
        name = parts[0].trim();
        const grpStr = parts[1].trim().toLowerCase();
        if (grpStr.includes('1')) grpId = 0;
        else if (grpStr.includes('2')) grpId = 1;
        else if (grpStr.includes('3')) grpId = 2;
        else if (grpStr.includes('4')) grpId = 3;
      }

      if (name) {
        addedList.push({
          id: `std-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
          name,
          groupId: grpId,
          score: 0,
          answeredCount: 0,
          correctCount: 0,
          hasStar: false
        });
      }
    });

    if (addedList.length > 0) {
      onUpdateStudents([...students, ...addedList]);
      setPasteText('');
      setShowPasteBox(false);
      showToast(`${addedList.length} siswa berhasil dimasukkan!`);
    }
  };

  // Load sample 20 students
  const handleLoadSample = () => {
    playClickSound();
    onUpdateStudents(DEFAULT_STUDENTS);
    showToast('20 Siswa Contoh berhasil dimuat!');
  };

  // Clear all students
  const handleClearAll = () => {
    playClickSound();
    onUpdateStudents([]);
    showToast('Daftar siswa dikosongkan.');
  };

  // Delete single student
  const handleDeleteStudent = (id: string) => {
    playClickSound();
    onUpdateStudents(students.filter((s) => s.id !== id));
  };

  // Change student's group
  const handleChangeGroup = (studentId: string, newGId: number) => {
    playClickSound();
    onUpdateStudents(
      students.map((s) => (s.id === studentId ? { ...s, groupId: newGId } : s))
    );
  };

  // Toggle sound setting
  const handleToggleSound = () => {
    const nextVal = !settings.soundEnabled;
    setSoundEnabled(nextVal);
    onUpdateSettings({ ...settings, soundEnabled: nextVal });
    if (nextVal) playClickSound();
  };

  const groupCounts = [0, 1, 2, 3].map(
    (gId) => students.filter((s) => s.groupId === gId).length
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
          <span className="text-xs sm:text-sm font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-teal-600" />
            <span>Persiapan Kuis · Mode Giliran Siswa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Daftar Siswa &amp; Pengaturan Kuis
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Kelola nama-nama siswa yang akan diundi maju menjawab soal di Smart Board. 
            Data tersimpan otomatis di browser laptop guru.
          </p>
        </div>

        <button
          onClick={onBackToGame}
          className="px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Kembali ke Arena Kuis</span>
        </button>
      </div>

      {/* Quick Stats of Registered Students */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
            Total Siswa
          </span>
          <span className="text-3xl font-black text-slate-900 tabular-nums">
            {students.length}
          </span>
          <span className="text-[11px] text-slate-500 block">terdaftar</span>
        </div>

        {[0, 1, 2, 3].map((gId) => (
          <div key={gId} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
            <span className="text-xs font-bold text-sky-800 block uppercase tracking-wider">
              Baris {gId + 1}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-sky-700 tabular-nums">
              {groupCounts[gId]}
            </span>
            <span className="text-[11px] text-slate-400 block">orang</span>
          </div>
        ))}
      </div>

      {/* 2-Column Grid: Left (Add Students & Bulk), Right (Settings) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input and Import (2 Cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Single Student Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-600" />
                <span>Tambah Siswa Satu per Satu</span>
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasteBox(!showPasteBox)}
                  className="px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  {showPasteBox ? 'Tutup Kotak Tempel' : '📋 Tempel Banyak Nama'}
                </button>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  Muat Contoh (20 Siswa)
                </button>
              </div>
            </div>

            <form onSubmit={handleAddStudent} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ketik nama lengkap siswa..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-hidden text-sm font-semibold text-slate-900"
              />
              <select
                value={newGroup}
                onChange={(e) => setNewGroup(Number(e.target.value))}
                className="px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-700 focus:border-teal-500 outline-hidden"
              >
                <option value={0}>Baris 1</option>
                <option value={1}>Baris 2</option>
                <option value={2}>Baris 3</option>
                <option value={3}>Baris 4</option>
              </select>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm transition-all shadow-xs shrink-0 cursor-pointer"
              >
                + Tambah
              </button>
            </form>

            {/* Bulk Paste Box (Accordion) */}
            {showPasteBox && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                  <span>Tempel daftar nama (satu per baris). Boleh format: "Nama, 1" atau "Nama, 2":</span>
                  <span className="text-[11px] text-teal-700">Otomatis bagi kelompok</span>
                </div>
                <textarea
                  rows={6}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={`Contoh:\nAhmad Fauzi, 1\nAnnisa Rahma, 1\nBagas Pratama, 2\nCitra Dewi, 3\nDimas Prasetyo, 4`}
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-hidden"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPasteBox(false)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkPaste}
                    className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black shadow-xs cursor-pointer"
                  >
                    Masukkan Semua Siswa
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table of Registered Students */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>Daftar Siswa Terdaftar ({students.length})</span>
              </h2>

              {students.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Kosongkan Semua</span>
                </button>
              )}
            </div>

            {students.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
                <Users className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-500">
                  Belum ada siswa terdaftar.
                </p>
                <button
                  onClick={handleLoadSample}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Klik untuk Muat 20 Siswa Contoh
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[460px] overflow-y-auto rounded-2xl border border-slate-100">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center">No</th>
                      <th className="py-2.5 px-3">Nama Siswa</th>
                      <th className="py-2.5 px-3">Kelompok / Baris</th>
                      <th className="py-2.5 px-3 text-center">Poin Kuis</th>
                      <th className="py-2.5 px-3 text-center">Riwayat</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {students.map((std, idx) => (
                      <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 text-center text-slate-400 tabular-nums font-semibold">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">
                          {std.name}
                        </td>
                        <td className="py-2.5 px-3">
                          <select
                            value={std.groupId}
                            onChange={(e) => handleChangeGroup(std.id, Number(e.target.value))}
                            className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
                          >
                            <option value={0}>Baris 1</option>
                            <option value={1}>Baris 2</option>
                            <option value={2}>Baris 3</option>
                            <option value={3}>Baris 4</option>
                          </select>
                        </td>
                        <td className="py-2.5 px-3 text-center font-black text-teal-700 tabular-nums">
                          {std.score} pt
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {std.hasStar ? (
                            <span className="text-amber-500 font-bold" title="Pernah menjawab benar">
                              ⭐
                            </span>
                          ) : std.answeredCount > 0 ? (
                            <span className="text-xs text-slate-400">
                              {std.answeredCount}x jawab
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-300">Belum giliran</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleDeleteStudent(std.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Hapus siswa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Game Show Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Pengaturan Kuis</span>
            </h2>

            {/* Timer Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Waktu Menjawab per Soal:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 20, 30].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      onUpdateSettings({ ...settings, timeLimit: sec });
                    }}
                    className={`py-2 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                      settings.timeLimit === sec
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sec} Detik
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-400 block">
                Timer lingkaran akan berdenyut dan berbunyi detak jantung saat sisa 5 detik.
              </span>
            </div>

            {/* Points Configuration */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Poin Jawaban Benar:</span>
                  <span className="text-[11px] text-slate-400">Default: 10 poin</span>
                </div>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={settings.correctPoints}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, correctPoints: Number(e.target.value) || 10 })
                  }
                  className="w-16 px-2.5 py-1.5 rounded-xl border border-slate-300 text-center font-black text-teal-700 text-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Poin Jawaban Salah:</span>
                  <span className="text-[11px] text-slate-400">Default: 0 poin</span>
                </div>
                <input
                  type="number"
                  min={-10}
                  max={10}
                  value={settings.wrongPoints}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, wrongPoints: Number(e.target.value) || 0 })
                  }
                  className="w-16 px-2.5 py-1.5 rounded-xl border border-slate-300 text-center font-black text-slate-700 text-sm"
                />
              </div>
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Suara Efek Web Audio:</span>
                  <span className="text-[11px] text-slate-400">Drum roll, detak jantung &amp; jingle</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleSound}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  settings.soundEnabled
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                {settings.soundEnabled ? 'Aktif' : 'Mati'}
              </button>
            </div>

            {/* Lifelines Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-500" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Fitur Bantuan (Lifelines):</span>
                  <span className="text-[11px] text-slate-400">Tanya Kelompok, Oper Teman, 50:50</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onUpdateSettings({ ...settings, lifelinesEnabled: !settings.lifelinesEnabled });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  settings.lifelinesEnabled
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                {settings.lifelinesEnabled ? 'Aktif' : 'Nonaktif'}
              </button>
            </div>

            {/* Start Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={onBackToGame}
                disabled={students.length === 0}
                className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Mulai Kuis Giliran Siswa</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
