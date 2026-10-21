import React from 'react';
import { X, BookOpen, Terminal, Sparkles, Check } from 'lucide-react';

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-sky-400/60 rounded-3xl p-5 md:p-8 text-white max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <BookOpen className="w-6 h-6" />
            </span>
            <div>
              <div className="text-[11px] md:text-xs font-bold text-sky-400 uppercase tracking-widest">
                Ringkasan Materi Kelas 10
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                Cheat Sheet Dasar Python
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Cards */}
        <div className="space-y-4 text-sm md:text-base">
          {/* Card 1: Pengertian Coding & print() */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <h3 className="font-extrabold text-amber-300 flex items-center gap-2 mb-1.5 text-base md:text-lg">
              <Terminal className="w-5 h-5 text-amber-400" />
              1. Pengertian Coding & Fungsi print()
            </h3>
            <p className="text-slate-300 leading-relaxed mb-2 text-xs md:text-sm">
              <strong>Coding</strong> adalah menulis instruksi agar komputer bekerja sesuai perintah kita.
              Dalam Python, fungsi <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">print()</code> digunakan untuk menampilkan teks atau data ke layar monitor.
            </p>
            <div className="bg-slate-900 p-2.5 rounded-xl font-mono text-xs text-emerald-400">
              print("Halo Dunia!")  # Menampilkan: Halo Dunia!<br />
              print(10 + 5)         # Menampilkan: 15 (hasil hitung)
            </div>
          </div>

          {/* Card 2: 4 Tipe Data Utama */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <h3 className="font-extrabold text-sky-300 flex items-center gap-2 mb-2 text-base md:text-lg">
              <Sparkles className="w-5 h-5 text-sky-400" />
              2. Empat Tipe Data Wajib Python (str, int, float, bool)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm">
              {/* String */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-sky-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-sky-400">str (String)</span>
                  <span className="text-[10px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded">Teks</span>
                </div>
                <p className="text-slate-300 text-xs mb-1.5">
                  Kumpulan huruf/karakter yang <strong>selalu diapit tanda kutip</strong> ("..." atau '...').
                </p>
                <code className="text-amber-300 font-mono text-[11px] block bg-slate-950 p-1.5 rounded">
                  nama = "Budi"<br />
                  mapel = 'Informatika'
                </code>
              </div>

              {/* Integer */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-emerald-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-emerald-400">int (Integer)</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded">Bilangan Bulat</span>
                </div>
                <p className="text-slate-300 text-xs mb-1.5">
                  Angka bulat positif, negatif, atau nol <strong>tanpa tanda koma desimal</strong>.
                </p>
                <code className="text-emerald-300 font-mono text-[11px] block bg-slate-950 p-1.5 rounded">
                  umur = 16<br />
                  skor = 100, suhu = -4
                </code>
              </div>

              {/* Float */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-purple-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-purple-400">float (Floating Point)</span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded">Pecahan Desimal</span>
                </div>
                <p className="text-slate-300 text-xs mb-1.5">
                  Bilangan yang memiliki angka desimal. Pemisah desimal memakai <strong>tanda titik (.)</strong>.
                </p>
                <code className="text-purple-300 font-mono text-[11px] block bg-slate-950 p-1.5 rounded">
                  tinggi = 1.68<br />
                  pi = 3.14
                </code>
              </div>

              {/* Boolean */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-amber-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-amber-400">bool (Boolean)</span>
                  <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded">Benar / Salah</span>
                </div>
                <p className="text-slate-300 text-xs mb-1.5">
                  Hanya memiliki dua nilai logika: <strong>True</strong> atau <strong>False</strong> (huruf kapital).
                </p>
                <code className="text-amber-300 font-mono text-[11px] block bg-slate-950 p-1.5 rounded">
                  siswa_aktif = True<br />
                  sudah_lulus = False
                </code>
              </div>
            </div>
          </div>

          {/* Card 3: Tips Aturan Variabel */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs md:text-sm text-slate-300">
            <h4 className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              Aturan Dasar Variabel Python:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Python bersifat <strong>case-sensitive</strong> (huruf besar & kecil berbeda).</li>
              <li>Nama variabel tidak boleh diawali angka (contoh yang salah: <code className="text-rose-400 font-mono">1siswa</code>).</li>
              <li>Tidak boleh menggunakan spasi (gunakan underscore <code className="text-amber-300 font-mono">_</code> seperti <code className="text-amber-300 font-mono">nama_siswa</code>).</li>
            </ul>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl text-base transition-all"
          >
            Sudah Paham, Siap Berlari!
          </button>
        </div>
      </div>
    </div>
  );
};
