import React, { useState } from 'react';
import { FLIP_CARDS } from '../data/learningData';
import { FlipCardItem } from '../types';
import { 
  Layers, RotateCw, ArrowRight, BookOpen, 
  Sparkles, CheckCircle2, Grid, PlusSquare, 
  AlignCenter, Trash2 
} from 'lucide-react';

interface UlasanSectionProps {
  onNavigateToContoh: () => void;
}

export const UlasanSection: React.FC<UlasanSectionProps> = ({
  onNavigateToContoh
}) => {
  // Set of flipped card ids
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  const toggleFlip = (id: number) => {
    if (flippedCards.includes(id)) {
      setFlippedCards(flippedCards.filter((cardId) => cardId !== id));
    } else {
      setFlippedCards([...flippedCards, id]);
    }
  };

  const flipAll = () => {
    if (flippedCards.length === FLIP_CARDS.length) {
      setFlippedCards([]);
    } else {
      setFlippedCards(FLIP_CARDS.map((c) => c.id));
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Grid': return <Grid className="w-5 h-5 text-teal-600" />;
      case 'PlusSquare': return <PlusSquare className="w-5 h-5 text-sky-600" />;
      case 'Layers': return <Layers className="w-5 h-5 text-indigo-600" />;
      case 'AlignCenter': return <AlignCenter className="w-5 h-5 text-emerald-600" />;
      case 'Trash2': return <Trash2 className="w-5 h-5 text-red-600" />;
      default: return <Sparkles className="w-5 h-5 text-sky-600" />;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title & Introduction */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Pertemuan 2 · Pemanasan Mengingat Materi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Ulasan Kilat (5 Kartu Balik)
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Klik atau ketuk kartu di bawah untuk membalik dan mengingat kembali konsep inti Materi 1 sampai 7 
            sebelum tantangan kelompok dan kuis dimulai di Smart Board!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={flipAll}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{flippedCards.length === FLIP_CARDS.length ? 'Tutup Semua Kartu' : 'Buka Semua Kartu'}</span>
          </button>

          <button
            onClick={onNavigateToContoh}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <span>Lanjut ke Tantangan Contoh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5 Flip Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FLIP_CARDS.map((card) => {
          const isFlipped = flippedCards.includes(card.id);

          return (
            <div
              key={card.id}
              onClick={() => toggleFlip(card.id)}
              className="cursor-pointer perspective h-64 group select-none"
            >
              <div
                className={`w-full h-full rounded-3xl p-6 transition-all duration-500 transform-style-3d border flex flex-col justify-between shadow-xs hover:shadow-md ${
                  isFlipped
                    ? 'bg-gradient-to-br from-teal-900 via-slate-900 to-sky-950 text-white border-teal-500/50'
                    : 'bg-white border-slate-200 hover:border-teal-400'
                }`}
              >
                {/* Front or Back View */}
                {!isFlipped ? (
                  // Front Side
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                          {renderIcon(card.iconName)}
                        </div>
                        <span className="text-[10px] font-extrabold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full uppercase tracking-wider">
                          {card.relatedMateri}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-slate-900 leading-snug">
                        {card.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {card.frontSummary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-teal-700 text-xs font-extrabold group-hover:translate-x-0.5 transition-transform">
                      <span className="flex items-center gap-1">
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Klik untuk Balik Kartu Jawaban</span>
                      </span>
                      <span>➔</span>
                    </div>
                  </>
                ) : (
                  // Back Side
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold px-2.5 py-1 bg-teal-500/20 text-teal-300 rounded-full uppercase tracking-wider border border-teal-400/30">
                          Kunci Ringkasan
                        </span>
                        <RotateCw className="w-4 h-4 text-slate-400" />
                      </div>

                      <h4 className="text-sm font-black text-amber-300">
                        {card.title}
                      </h4>

                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {card.backDetail}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 text-slate-400 text-[11px] font-medium flex items-center justify-between">
                      <span>{card.relatedMateri}</span>
                      <span className="text-teal-300 underline">Klik untuk tutup</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Quick Start Next Stage Card */}
        <div
          onClick={onNavigateToContoh}
          className="cursor-pointer p-6 rounded-3xl bg-gradient-to-br from-teal-600 to-sky-700 text-white shadow-md flex flex-col justify-between hover:scale-[1.02] transition-transform"
        >
          <div className="space-y-3">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-extrabold uppercase tracking-wider inline-block">
              Siap Bermain?
            </span>
            <h3 className="text-xl font-black">
              Demonstrasi Tantangan Guru
            </h3>
            <p className="text-xs text-teal-100 leading-relaxed">
              Setelah mengingat ulasan kilat di atas, mari perhatikan Guru mendemokan cara menyusun urutan langkah di layar Smart Board!
            </p>
          </div>

          <button
            onClick={onNavigateToContoh}
            className="w-full py-2.5 bg-white text-teal-950 font-black text-xs rounded-xl hover:bg-teal-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Buka Tantangan Contoh (Demo)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
