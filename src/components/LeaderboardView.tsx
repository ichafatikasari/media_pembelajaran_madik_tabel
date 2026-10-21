import React, { useState } from 'react';
import { LeaderboardEntry } from '../types/game';
import { 
  Trophy, Medal, Award, Trash2, Search, ArrowLeft, 
  CheckCircle2, XCircle, Download, AlertTriangle, Users
} from 'lucide-react';

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  onBackToMenu: () => void;
  onClearLeaderboard: () => void;
  highlightId?: string | null;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  entries,
  onBackToMenu,
  onClearLeaderboard,
  highlightId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

  // Sort entries descending by score, then by distance
  const sortedEntries = [...entries].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.distance - a.distance;
  });

  const filteredEntries = sortedEntries.filter(entry => 
    entry.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const highestScore = sortedEntries.length > 0 ? sortedEntries[0].score : 0;
  const correctCount = sortedEntries.filter(e => e.quizCorrect).length;
  const accuracyPercent = sortedEntries.length > 0 
    ? Math.round((correctCount / sortedEntries.length) * 100) 
    : 0;

  // Export CSV for Teacher
  const handleExportCSV = () => {
    if (sortedEntries.length === 0) return;
    const header = ['Peringkat', 'Nama Siswa', 'Skor Total', 'Jarak (m)', 'Koin', 'Kuis Benar', 'Materi', 'Waktu'];
    const rows = sortedEntries.map((e, idx) => [
      idx + 1,
      `"${e.studentName.replace(/"/g, '""')}"`,
      e.score,
      e.distance,
      e.coins,
      e.quizCorrect ? 'Benar' : 'Salah',
      `"${e.questionTopic}"`,
      `"${e.formattedDate}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_nilai_python_subway_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteConfirm = () => {
    if (confirmInput.trim().toUpperCase() === 'RESET') {
      onClearLeaderboard();
      setShowDeleteModal(false);
      setConfirmInput('');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-3 md:p-6 select-none animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToMenu}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-2xl border border-slate-700 flex items-center gap-2 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Kembali ke Menu</span>
          </button>
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Trophy className="w-4 h-4" />
              Papan Peringkat Kelas 10
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Leaderboard Python Subway Quiz
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {sortedEntries.length > 0 && (
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs md:text-sm rounded-xl flex items-center gap-2 shadow border border-emerald-500/40"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Rekap CSV</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-3 py-2.5 bg-rose-950/70 hover:bg-rose-800 text-rose-300 hover:text-white font-semibold text-xs md:text-sm rounded-xl flex items-center gap-1.5 border border-rose-800 active:scale-95 transition-all"
            title="Hapus riwayat khusus guru"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden md:inline">Hapus Riwayat</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 md:p-4 text-center">
          <div className="text-slate-400 text-xs md:text-sm font-semibold flex items-center justify-center gap-1">
            <Users className="w-4 h-4 text-sky-400" />
            <span>Total Siswa Tampil</span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-white mt-1">
            {sortedEntries.length}
          </div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-3 md:p-4 text-center">
          <div className="text-amber-400 text-xs md:text-sm font-semibold flex items-center justify-center gap-1">
            <Trophy className="w-4 h-4" />
            <span>Skor Tertinggi</span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-amber-400 mt-1">
            {highestScore}
          </div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-3 md:p-4 text-center">
          <div className="text-emerald-400 text-xs md:text-sm font-semibold flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Akurasi Kuis Kelas</span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-400 mt-1">
            {accuracyPercent}%
          </div>
        </div>
      </div>

      {/* Search Input Filter */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari nama siswa..."
          className="w-full bg-slate-900 border-2 border-slate-700 focus:border-amber-400 rounded-2xl py-3 pl-12 pr-4 text-white text-sm md:text-base outline-none transition-all"
        />
      </div>

      {/* Leaderboard Table / Cards */}
      {filteredEntries.length === 0 ? (
        <div className="bg-slate-900/80 border-2 border-dashed border-slate-700 rounded-3xl p-8 text-center text-slate-400 space-y-3">
          <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-base font-semibold">
            {searchTerm ? 'Tidak ada nama siswa yang cocok.' : 'Belum ada giliran siswa yang tercatat.'}
          </p>
          <p className="text-xs text-slate-500">
            Ayo panggil siswa pertama untuk maju ke depan dan mulai berlari!
          </p>
          <button
            type="button"
            onClick={onBackToMenu}
            className="mt-3 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl"
          >
            Mulai Giliran Siswa Baru
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm md:text-base">
              <thead className="bg-slate-950/80 text-slate-400 text-xs md:text-sm uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 text-center w-16">Rank</th>
                  <th className="py-3.5 px-4">Nama Siswa</th>
                  <th className="py-3.5 px-4 text-center">Hasil Kuis</th>
                  <th className="py-3.5 px-4 text-center">Jarak</th>
                  <th className="py-3.5 px-4 text-center">Koin</th>
                  <th className="py-3.5 px-4 text-right">Skor Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredEntries.map((entry, index) => {
                  const rank = index + 1;
                  const isHighlighted = highlightId === entry.id;

                  let rankBadge = (
                    <span className="font-mono font-bold text-slate-400 text-base">
                      #{rank}
                    </span>
                  );

                  if (rank === 1) {
                    rankBadge = (
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/30">
                        🥇 1
                      </span>
                    );
                  } else if (rank === 2) {
                    rankBadge = (
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black shadow">
                        🥈 2
                      </span>
                    );
                  } else if (rank === 3) {
                    rankBadge = (
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-amber-100 font-black shadow">
                        🥉 3
                      </span>
                    );
                  }

                  return (
                    <tr
                      key={entry.id}
                      className={`transition-colors ${
                        isHighlighted 
                          ? 'bg-amber-500/20 ring-2 ring-amber-400' 
                          : index % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900/80 hover:bg-slate-800/60'
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-bold">
                        {rankBadge}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span className="text-base md:text-lg">{entry.studentName}</span>
                          {isHighlighted && (
                            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                              Baru Saja
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-normal">
                          {entry.formattedDate}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {entry.quizCorrect ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Benar
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            <XCircle className="w-3.5 h-3.5" />
                            Keliru
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-300">
                        {entry.distance}m
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-amber-400">
                        {entry.coins} 🪙
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-xl md:text-2xl font-black text-amber-400">
                          {entry.score}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action: Ready Next Student */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onBackToMenu}
          className="w-full max-w-xl mx-auto h-14 md:h-16 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-lg md:text-xl rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-98 transition-all border-2 border-emerald-400/50 cursor-pointer"
        >
          <span>Panggil Siswa Berikutnya & Lanjut Main</span>
          <ArrowLeft className="w-6 h-6 rotate-180" />
        </button>
      </div>

      {/* Dangerous Delete Modal (Separated from regular reset) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border-2 border-rose-600 rounded-3xl p-6 text-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400 font-black text-lg">
              <AlertTriangle className="w-7 h-7" />
              <span>Konfirmasi Hapus Seluruh Skor</span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Tindakan ini akan <strong>menghapus permanen seluruh riwayat nilai siswa di kelas ini</strong>. 
              Tombol "Siswa Berikutnya" tidak akan menghapus data, hanya tombol ini yang menghapusnya.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400">
              Ketik kata <strong className="text-rose-400 font-mono">RESET</strong> di bawah untuk menyetujui:
            </div>

            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="Ketik RESET di sini..."
              className="w-full bg-slate-950 border-2 border-rose-500/50 rounded-xl px-4 py-2.5 text-white font-mono uppercase text-sm outline-none focus:border-rose-400"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmInput('');
                }}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={confirmInput.trim().toUpperCase() !== 'RESET'}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Semua</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
