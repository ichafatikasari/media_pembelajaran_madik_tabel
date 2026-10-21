import { 
  MaterialItem, 
  FlipCardItem, 
  ClassChallengeItem, 
  QuizQuestionItem 
} from '../types';

export const APP_INFO = {
  subject: 'Informatika',
  grade: 'Kelas 10 SMA/MA',
  topic: 'Membuat dan Mengatur Tabel di Microsoft Word',
  version: 'Microsoft Word 2007, 2010, 2013, 2016, 2019, 2021 & Office 365',
  targetAge: '15 - 16 Tahun'
};

// ==========================================
// ATURAN PENILAIAN OTOMATIS TANTANGAN
// Percobaan 1: 100 pt, Percobaan 2: 80 pt, dst.
// ==========================================
export const ATTEMPT_SCORES: number[] = [100, 80, 60, 40, 20];

export function calculateChallengePoints(attempts: number): number {
  if (attempts <= 0) return 0;
  if (attempts <= ATTEMPT_SCORES.length) {
    return ATTEMPT_SCORES[attempts - 1];
  }
  return ATTEMPT_SCORES[ATTEMPT_SCORES.length - 1]; // Percobaan ke-5 atau lebih = 20 poin
}

export const LEARNING_OBJECTIVES = [
  {
    id: 1,
    title: 'Menyisipkan Tabel',
    desc: 'Menyisipkan tabel baru dengan menentukan jumlah kolom dan baris yang tepat.'
  },
  {
    id: 2,
    title: 'Mengatur Lebar Kolom & Merge Cells',
    desc: 'Menyesuaikan proporsi kolom dan menggabungkan sel untuk membuat header bertingkat.'
  },
  {
    id: 3,
    title: 'Menengahkan Teks (Align Center)',
    desc: 'Meratakan teks di tengah sel secara horizontal maupun vertikal.'
  },
  {
    id: 4,
    title: 'Menambah & Menghapus Baris/Kolom',
    desc: 'Menyisipkan baris/kolom baru dan menghapus data yang tidak diperlukan.'
  },
  {
    id: 5,
    title: 'Membuat Tabel Format Absensi Nyata',
    desc: 'Mewujudkan tabel dokumen rapi seperti tabel presensi siswa di Microsoft Word asli.'
  }
];

export const MATERIALS: MaterialItem[] = [
  {
    id: 'materi-1',
    number: 1,
    title: 'Pengertian Tabel, Kolom, Baris, dan Sel',
    subtitle: 'Mengenal bagian-bagian penyusun tabel sebelum mulai membuat',
    summary: 'Tabel adalah kumpulan kotak teratur yang dibentuk oleh garis vertikal dan horizontal. Tempat bertemunya kolom dan baris disebut sel.',
    steps: [
      {
        number: 1,
        text: 'Kolom (Column): Kotak yang memanjang tegak lurus (vertikal) dari atas ke bawah.',
        detail: 'Contoh: Kolom "NO", Kolom "NAMA SISWA", Kolom "KELAS". Tiap kolom berisi jenis data yang sejenis.'
      },
      {
        number: 2,
        text: 'Baris (Row): Kotak yang berjejer mendatar (horizontal) dari kiri ke kanan.',
        detail: 'Contoh: Baris judul (header), baris nomor 1, baris nomor 2. Satu baris memuat satu kesatuan informasi data siswa.'
      },
      {
        number: 3,
        text: 'Sel (Cell): Satu kotak tunggal tempat berpotongnya satu kolom dan satu baris.',
        detail: 'Di dalam sel inilah kita mengetikkan teks, angka, atau simbol di dokumen Word.'
      }
    ],
    proTip: '💡 Cara gampang menghafal: Kolom itu seperti TIANG BENDERA (berdiri tegak lurus), sedangkan Baris seperti BARISAN UPACARA (berjejer menyamping)!',
    wordActionPrompt: 'Buka Microsoft Word kamu sekarang. Buat dokumen kosong baru untuk memulai latihan bersama.',
    illustrationType: 'concept_grid'
  },
  {
    id: 'materi-2',
    number: 2,
    title: 'Cara Menyisipkan Tabel di Microsoft Word',
    subtitle: 'Langkah resmi memasukkan tabel dengan ukuran kolom dan baris yang kita inginkan',
    summary: 'Kita bisa menyisipkan tabel lewat menu Insert, lalu mengisi berapa banyak kolom dan baris yang dibutuhkan pada kotak dialog Insert Table.',
    steps: [
      {
        number: 1,
        text: 'Klik tab "Insert" pada bilah pita (Ribbon) atas Microsoft Word.',
        detail: 'Tab Insert berisi semua objek yang bisa dimasukkan ke dalam dokumen lembar kerja.'
      },
      {
        number: 2,
        text: 'Klik tombol "Table" (ikon kisi-kisi kotak).',
        detail: 'Akan muncul kisi kotak kecil dan beberapa opsi menu di bagian bawahnya.'
      },
      {
        number: 3,
        text: 'Pilih "Insert Table..." dari daftar yang muncul.',
        detail: 'Langkah ini membuka kotak dialog kecil untuk memasukkan angka pasti.'
      },
      {
        number: 4,
        text: 'Ketik jumlah pada "Number of columns" dan "Number of rows".',
        detail: 'Contoh: Number of columns: 5, Number of rows: 4.'
      },
      {
        number: 5,
        text: 'Klik tombol "OK".',
        detail: 'Tabel akan langsung muncul di halaman dokumen Word kamu!'
      }
    ],
    proTip: '💡 Saat kursor berada di dalam tabel, Microsoft Word akan memunculkan 2 tab baru di sebelah kanan: Table Design dan Layout!',
    wordActionPrompt: 'Praktikkan di Word kamu sekarang: Coba klik Insert > Table > Insert Table, lalu masukkan 4 Kolom dan 3 Baris, kemudian klik OK!',
    illustrationType: 'insert_table'
  },
  {
    id: 'materi-3',
    number: 3,
    title: 'Mengatur Lebar Kolom (Column Width)',
    subtitle: 'Menyesuaikan ukuran kolom agar tidak terlalu sempit atau terlalu longgar',
    summary: 'Kolom "NO" cukup dibuat sempit, sedangkan kolom "NAMA LENGKAP" butuh ruang lebih luas. Kita bisa mengaturnya dengan mouse atau lewat tab Layout.',
    steps: [
      {
        number: 1,
        text: 'Cara 1 (Manual Menggeser Garis): Arahkan kursor tepat ke garis pemisah di antara dua kolom.',
        detail: 'Tunggu sampai kursor berubah bentuk menjadi panah ganda berlawanan (↔).'
      },
      {
        number: 2,
        text: 'Klik dan tahan mouse, lalu geser ke kiri untuk mempersempit atau ke kanan untuk memperlebar.',
        detail: 'Lepas klik mouse saat lebarnya sudah pas menurut pandanganmu.'
      },
      {
        number: 3,
        text: 'Cara 2 (Angka Presisi di Tab Layout): Klik di dalam kolom yang ingin diatur.',
        detail: 'Buka tab "Layout" (di bawah Table Tools), cari grup menu "Cell Size".'
      },
      {
        number: 4,
        text: 'Ubah angka pada kotak "Width" (Lebar Kolom) sesuai ukuran sentimeter yang diinginkan.',
        detail: 'Misal: Kolom No diatur 1.2 cm, kolom Nama Siswa diatur 6.0 cm.'
      }
    ],
    proTip: '💡 Trik Kilat: Klik ganda (double-click) pada garis batas kolom, maka Word akan otomatis mengatur lebar kolom sesuai panjang tulisan terpanjang di dalamnya!',
    wordActionPrompt: 'Praktikkan di Word kamu sekarang: Geser garis batas kolom pertama pada tabelmu agar lebih sempit dibanding kolom kedua!',
    illustrationType: 'column_width'
  },
  {
    id: 'materi-4',
    number: 4,
    title: 'Menggabungkan Sel (Merge Cells)',
    subtitle: 'Menyatukan dua atau lebih sel menjadi satu kotak yang luas',
    summary: 'Merge Cells sangat penting saat kita ingin membuat judul tabel atau header bertingkat (misalnya judul payung KETERANGAN di atas kolom Sakit, Izin, dan Alpa).',
    steps: [
      {
        number: 1,
        text: 'Sorot (blok) beberapa sel bersebelahan yang ingin kamu gabungkan.',
        detail: 'Klik tahan mouse pada sel awal lalu geser melewati sel target.'
      },
      {
        number: 2,
        text: 'Klik tab "Layout" pada kelompok Table Tools di bagian atas layar.',
        detail: 'Lihat kelompok menu yang berlabel "Merge".'
      },
      {
        number: 3,
        text: 'Klik tombol "Merge Cells".',
        detail: 'Garis pemisah di antara sel-sel tersebut akan hilang dan berubah menjadi satu sel besar.'
      }
    ],
    proTip: '💡 Kalau kamu ingin membatalkan atau memecah kembali sel yang sudah digabung, klik tombol "Split Cells" di sebelah Merge Cells!',
    wordActionPrompt: 'Praktikkan di Word kamu sekarang: Blok dua sel di baris paling atas tabelmu, lalu klik tab Layout > Merge Cells!',
    illustrationType: 'merge_cells'
  },
  {
    id: 'materi-5',
    number: 5,
    title: 'Menengahkan Teks dalam Tabel (Align Center)',
    subtitle: 'Membuat posisi teks berada tepat di tengah tinggi dan tengah lebar sel',
    summary: 'Di dalam tabel, kita tidak hanya menengahkan teks ke kiri-kanan, tetapi juga harus pas di tengah-tengah tinggi sel agar tabel tampak rapi dan profesional.',
    steps: [
      {
        number: 1,
        text: 'Blok sel atau baris judul tabel yang ingin diatur posisinya.',
        detail: 'Kamu bisa memblok seluruh baris judul sekaligus.'
      },
      {
        number: 2,
        text: 'Klik tab "Layout" pada bagian Table Tools.',
        detail: 'Cari kelompok menu yang bernama "Alignment".'
      },
      {
        number: 3,
        text: 'Klik ikon "Align Center" (kotak nomor 5, berada tepat di tengah dari 9 pilihan kotak alignment).',
        detail: 'Teks akan langsung berpindah ke tengah horizontal dan tengah vertikal sel.'
      }
    ],
    proTip: '💡 Ingat bedanya: Ikon "Center" di tab Home hanya menengahkan kiri-kanan. Tapi ikon "Align Center" di tab Layout menengahkan kiri-kanan SEKALIGUS atas-bawah!',
    wordActionPrompt: 'Praktikkan di Word kamu sekarang: Ketik judul di sel tabelmu, blok, lalu klik Layout > Align Center!',
    illustrationType: 'align_center'
  },
  {
    id: 'materi-6',
    number: 6,
    title: 'Menghapus Baris, Kolom, atau Seluruh Tabel',
    subtitle: 'Membuang baris atau kolom yang salah tanpa merusak sisa tabel',
    summary: 'Awas! Menekan tombol Delete di keyboard hanya menghapus tulisannya saja. Untuk membuang baris atau kolomnya, kita harus menggunakan menu Delete di tab Layout.',
    steps: [
      {
        number: 1,
        text: 'Klik di dalam sel pada baris atau kolom yang ingin dihapus.',
        detail: 'Kursor harus berkedip di baris/kolom sasaran.'
      },
      {
        number: 2,
        text: 'Buka tab "Layout" pada Table Tools di pita atas.',
        detail: 'Lihat grup "Rows & Columns" di sebelah kiri.'
      },
      {
        number: 3,
        text: 'Klik tombol bertanda silang merah: "Delete".',
        detail: 'Akan muncul menu pilihan: Delete Cells, Delete Columns, Delete Rows, dan Delete Table.'
      },
      {
        number: 4,
        text: 'Pilih opsi yang kamu perlukan:',
        detail: '• Delete Rows: untuk menghapus baris mendatar.\n• Delete Columns: untuk menghapus kolom tegak.\n• Delete Table: untuk membuang seluruh tabel dari lembar kerja.'
      }
    ],
    proTip: '💡 Perbedaan Penting: Tombol Backspace di keyboard saat satu baris terblok akan langsung menghapus baris tersebut. Namun jika menekan Delete, hanya teksnya yang hilang!',
    wordActionPrompt: 'Praktikkan di Word kamu sekarang: Coba klik salah satu baris, lalu klik Layout > Delete > Delete Rows!',
    illustrationType: 'delete_options'
  },
  {
    id: 'materi-7',
    number: 7,
    title: 'Menyisipkan Baris atau Kolom Baru',
    subtitle: 'Menambah ruang saat ada teman sekelas atau kolom data baru yang mau ditambahkan',
    summary: 'Kita bisa menyisipkan baris baru di atas atau di bawah, serta kolom baru di sebelah kiri atau kanan sel yang sedang aktif.',
    steps: [
      {
        number: 1,
        text: 'Klik di dalam sel yang akan dijadikan patokan.',
        detail: 'Posisi sel ini menjadi patokan apakah kamu ingin menambah di atas, bawah, kiri, atau kanan.'
      },
      {
        number: 2,
        text: 'Buka tab "Layout" pada kelompok "Rows & Columns".',
        detail: 'Terdapat 4 tombol berikon panah biru yang sangat jelas.'
      },
      {
        number: 3,
        text: 'Pilih salah satu sesuai kebutuhan:',
        detail: '• Insert Above: Menambah 1 baris baru di ATAS.\n• Insert Below: Menambah 1 baris baru di BAWAH.\n• Insert Left: Menambah 1 kolom baru di sebelah KIRI.\n• Insert Right: Menambah 1 kolom baru di sebelah KANAN.'
      }
    ],
    proTip: '💡 Trik Tercepat di Dunia: Jika kursor berada di sel paling ujung kanan bawah tabel, cukup tekan tombol "TAB" pada keyboard, maka Word otomatis membuatkan 1 baris baru di bawahnya!',
    wordActionPrompt: 'Praktikkan di Word kamu sekarang: Letakkan kursor di sel terakhir tabelmu, lalu tekan tombol TAB di keyboard!',
    illustrationType: 'insert_options'
  }
];

export const GUIDED_ATTENDANCE_TABLE = {
  title: 'TABEL ABSEN SISWA KELAS X IPA',
  subtitle: 'Contoh format resmi yang harus ditiru siswa di Microsoft Word asli',
  headersRow1: [
    { text: 'NO', rowSpan: 2, width: '45px' },
    { text: 'NAMA SISWA', rowSpan: 2, width: '220px' },
    { text: 'JENIS KELAMIN', colSpan: 2, width: '80px' },
    { text: 'KETERANGAN', colSpan: 3, width: '120px' },
    { text: 'JUMLAH', rowSpan: 2, width: '60px' }
  ],
  headersRow2: [
    { text: 'L', width: '40px' },
    { text: 'P', width: '40px' },
    { text: 'S', width: '40px' },
    { text: 'I', width: '40px' },
    { text: 'A', width: '40px' }
  ],
  sampleRows: [
    { no: '1', nama: 'Ahmad Fauzi Ridwan', l: '✓', p: '', s: '-', i: '1', a: '-', jml: '1' },
    { no: '2', nama: 'Bintang Putri Lestari', l: '', p: '✓', s: '-', i: '-', a: '-', jml: '0' },
    { no: '3', nama: 'Cahya Pratama Putra', l: '✓', p: '', s: '1', i: '-', a: '-', jml: '1' },
    { no: '4', nama: 'Dewi Anggraini', l: '', p: '✓', s: '-', i: '-', a: '-', jml: '0' },
    { no: '5', nama: 'Eko Prasetyo Utomo', l: '✓', p: '', s: '-', i: '-', a: '1', jml: '1' },
    { no: '6', nama: 'Farida Zahra Ramadhani', l: '', p: '✓', s: '1', i: '-', a: '-', jml: '1' }
  ]
};

export const CHECKLIST_STEPS = [
  {
    id: 1,
    title: 'Menyisipkan Tabel 8 Kolom × 8 Baris',
    desc: 'Di Word: Klik Insert > Table > Insert Table. Isi Number of columns: 8 dan Number of rows: 8, lalu klik OK.',
    materiRefId: 'materi-2',
    materiName: 'Materi 2'
  },
  {
    id: 2,
    title: 'Menggabungkan Sel Header (Merge Cells)',
    desc: 'Di Word: Blok sel NO (vertikal 2 baris) lalu klik Merge Cells. Lakukan juga untuk NAMA SISWA, JENIS KELAMIN (2 kolom mendatar), KETERANGAN (3 kolom mendatar), dan JUMLAH.',
    materiRefId: 'materi-4',
    materiName: 'Materi 4'
  },
  {
    id: 3,
    title: 'Mengisi Data Teks & Simbol Siswa',
    desc: 'Di Word: Ketik judul kolom NO, NAMA SISWA, L, P, S, I, A, JUMLAH, dan ketikkan 6 baris nama temanmu.',
    materiRefId: 'materi-1',
    materiName: 'Materi 1'
  },
  {
    id: 4,
    title: 'Mengatur Lebar Kolom (Width)',
    desc: 'Di Word: Geser batas kolom NO agar ramping (sekitar 1.5 cm), dan buat kolom NAMA SISWA lebih lapang (sekitar 6 cm).',
    materiRefId: 'materi-3',
    materiName: 'Materi 3'
  },
  {
    id: 5,
    title: 'Menengahkan Teks Header (Align Center)',
    desc: 'Di Word: Blok semua baris judul atas, buka tab Layout, lalu klik ikon Align Center agar teks berada persis di tengah.',
    materiRefId: 'materi-5',
    materiName: 'Materi 5'
  },
  {
    id: 6,
    title: 'Menyimpan File Dokumen',
    desc: 'Di Word: Klik File > Save As, simpan dengan format nama: Absen_IPA_NamaKamu.docx.',
    materiRefId: 'materi-2',
    materiName: 'Word Asli'
  }
];

export const FLIP_CARDS: FlipCardItem[] = [
  {
    id: 1,
    title: '1. Anatomi Tabel',
    frontSummary: 'Apa perbedaan Kolom, Baris, dan Sel?',
    backDetail: 'Kolom = jalur vertikal (tegak dari atas ke bawah). Baris = jalur horizontal (mendatar dari kiri ke kanan). Sel = kotak tunggal pertemuan kolom dan baris tempat kita mengetik teks.',
    iconName: 'Grid',
    relatedMateri: 'Materi 1'
  },
  {
    id: 2,
    title: '2. Menyisipkan Tabel',
    frontSummary: 'Di mana menu untuk membuat tabel baru dengan jumlah pasti?',
    backDetail: 'Klik menu Insert > Table > pilih "Insert Table...", lalu masukkan Number of columns dan Number of rows, kemudian klik OK.',
    iconName: 'PlusSquare',
    relatedMateri: 'Materi 2'
  },
  {
    id: 3,
    title: '3. Merge & Lebar Kolom',
    frontSummary: 'Bagaimana cara menggabungkan sel dan mengubah lebar kolom?',
    backDetail: 'Untuk menggabungkan sel: blok sel target > buka tab Layout > klik Merge Cells. Untuk lebar kolom: tarik garis pemisah atau ketik ukuran di tab Layout pada kotak Width.',
    iconName: 'Layers',
    relatedMateri: 'Materi 3 & 4'
  },
  {
    id: 4,
    title: '4. Menengahkan Teks (Alignment)',
    frontSummary: 'Apa bedanya Center di tab Home dengan Align Center di tab Layout?',
    backDetail: 'Center di tab Home hanya menengahkan kiri-kanan. Sedangkan Align Center di tab Layout menengahkan teks secara horizontal SEKALIGUS di tengah tinggi kotak (vertikal).',
    iconName: 'AlignCenter',
    relatedMateri: 'Materi 5'
  },
  {
    id: 5,
    title: '5. Tambah & Hapus Baris/Kolom',
    frontSummary: 'Bagaimana cara menambah dan menghapus baris tanpa merusak tabel?',
    backDetail: 'Menambah: gunakan tombol Insert Above / Below / Left / Right di tab Layout. Menghapus: klik Layout > tombol Delete > pilih Delete Rows, Delete Columns, atau Delete Table (jangan gunakan tombol Delete di keyboard!).',
    iconName: 'Trash2',
    relatedMateri: 'Materi 6 & 7'
  }
];

export const DEMO_CHALLENGE = {
  title: 'Tantangan Contoh (Demonstrasi Guru)',
  topic: 'Urutkan langkah menghapus satu baris pada tabel',
  subMateriRef: 'Materi 6',
  correctSteps: [
    { id: 'demo-1', order: 1, text: 'Klik di dalam salah satu sel pada baris yang ingin dihapus' },
    { id: 'demo-2', order: 2, text: 'Klik tab "Layout" pada kelompok Table Tools di pita atas' },
    { id: 'demo-3', order: 3, text: 'Klik tombol bertanda silang "Delete"' },
    { id: 'demo-4', order: 4, text: 'Pilih opsi "Delete Rows"' }
  ],
  rules: [
    'Boleh dicoba ulang jika urutan belum tepat.',
    'Setiap percobaan yang salah akan mengurangi poin perolehan kelompok.',
    'Kelompok berdiskusi bersama, lalu hanya satu perwakilan yang maju ke smart board untuk menyusun urutan.'
  ]
};

export const CLASS_CHALLENGES: ClassChallengeItem[] = [
  {
    id: 'tantangan-1',
    targetGroup: 'Baris 1',
    title: 'Tantangan Kelompok Baris 1: Menyisipkan Tabel Baru',
    description: 'Susun langkah yang tepat ketika seorang siswa ingin menyisipkan tabel berukuran 5 kolom dan 4 baris di Microsoft Word.',
    subMateriRef: 'Materi 2',
    steps: [
      { id: 't1-1', order: 1, text: 'Buka dokumen Microsoft Word di laptop' },
      { id: 't1-2', order: 2, text: 'Klik tab "Insert" pada bilah pita (Ribbon) atas' },
      { id: 't1-3', order: 3, text: 'Klik tombol berikon kisi "Table"' },
      { id: 't1-4', order: 4, text: 'Pilih opsi menu "Insert Table..."' },
      { id: 't1-5', order: 5, text: 'Ketik Number of columns: 5 dan Number of rows: 4' },
      { id: 't1-6', order: 6, text: 'Klik tombol "OK" dan tabel akan terbentuk di halaman' }
    ],
    explanation: 'Urutan resmi di Word selalu diawali dari tab Insert > Table > Insert Table... > mengisi angka kolom dan baris > klik OK.'
  },
  {
    id: 'tantangan-2',
    targetGroup: 'Baris 2',
    title: 'Tantangan Kelompok Baris 2: Menggabungkan Sel (Merge Cells)',
    description: 'Susun langkah yang benar untuk menyatukan 3 sel kolom Sakit, Izin, dan Alpa di bawah satu judul payung "KETERANGAN".',
    subMateriRef: 'Materi 4',
    steps: [
      { id: 't2-1', order: 1, text: 'Klik dan tahan mouse untuk memblok sel-sel yang ingin digabung' },
      { id: 't2-2', order: 2, text: 'Perhatikan tab baru yang muncul di pita atas Word' },
      { id: 't2-3', order: 3, text: 'Klik tab kontekstual "Layout" (di bawah Table Tools)' },
      { id: 't2-4', order: 4, text: 'Cari kelompok menu yang berlabel "Merge"' },
      { id: 't2-5', order: 5, text: 'Klik tombol "Merge Cells" sehingga sekat antar sel hilang' }
    ],
    explanation: 'Kuncinya adalah menyorot (blok) sel terlebih dahulu, lalu membuka tab Layout, dan mengklik tombol Merge Cells.'
  },
  {
    id: 'tantangan-3',
    targetGroup: 'Baris 3',
    title: 'Tantangan Kelompok Baris 3: Menengahkan Teks dalam Tabel',
    description: 'Susun langkah yang benar untuk membuat teks header tabel berada tepat di tengah-tengah tinggi dan lebar sel.',
    subMateriRef: 'Materi 5',
    steps: [
      { id: 't3-1', order: 1, text: 'Ketik teks judul pada sel atau baris tabel yang bersangkutan' },
      { id: 't3-2', order: 2, text: 'Blok semua sel judul yang ingin diratakan posisinya' },
      { id: 't3-3', order: 3, text: 'Buka tab "Layout" pada bagian Table Tools' },
      { id: 't3-4', order: 4, text: 'Cari kelompok menu yang bernama "Alignment"' },
      { id: 't3-5', order: 5, text: 'Klik ikon "Align Center" (ikon kotak dengan garis persis di tengah)' }
    ],
    explanation: 'Align Center berada di tab Layout kelompok Alignment, membuat tulisan rapi di pusat koordinat horizontal dan vertikal sel.'
  },
  {
    id: 'tantangan-4',
    targetGroup: 'Baris 4',
    title: 'Tantangan Kelompok Baris 4: Menyisipkan Baris atau Kolom Baru',
    description: 'Susun langkah yang benar saat ada siswa baru yang harus ditambahkan tepat di bawah baris siswa nomor 2.',
    subMateriRef: 'Materi 7',
    steps: [
      { id: 't4-1', order: 1, text: 'Klik pada salah satu sel di baris siswa nomor 2 sebagai acuan' },
      { id: 't4-2', order: 2, text: 'Pastikan kursor berkedip aktif di dalam baris tersebut' },
      { id: 't4-3', order: 3, text: 'Buka tab "Layout" pada Table Tools di bagian atas' },
      { id: 't4-4', order: 4, text: 'Lihat kelompok menu "Rows & Columns"' },
      { id: 't4-5', order: 5, text: 'Klik tombol berikon panah ke bawah: "Insert Below"' }
    ],
    explanation: 'Insert Below menyisipkan 1 baris kosong tepat di bawah baris kursor aktif, sangat tepat untuk menambah data baru di tengah tabel.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestionItem[] = [
  {
    id: 1,
    question: 'Di dalam tabel Microsoft Word, jalur kotak yang memanjang secara TEGAK (vertikal) dari atas ke bawah disebut...',
    options: [
      { key: 'A', text: 'Baris (Row)' },
      { key: 'B', text: 'Kolom (Column)' },
      { key: 'C', text: 'Sel (Cell)' },
      { key: 'D', text: 'Gridline' }
    ],
    correctAnswer: 'B',
    explanation: 'Kolom (Column) memanjang secara tegak (vertikal). Baris (Row) berjejer mendatar (horizontal), dan Sel (Cell) adalah kotak pertemuan keduanya.',
    materiRef: 'Materi 1',
    topicTag: 'Pengertian Dasar'
  },
  {
    id: 2,
    question: 'Pertemuan antara satu kolom dan satu baris yang membentuk satu kotak tunggal tempat mengetik teks disebut...',
    options: [
      { key: 'A', text: 'Tabel' },
      { key: 'B', text: 'Range' },
      { key: 'C', text: 'Sel (Cell)' },
      { key: 'D', text: 'Border' }
    ],
    correctAnswer: 'C',
    explanation: 'Sel (Cell) adalah kotak tunggal tempat bertemunya satu baris dan satu kolom. Di dalam sel inilah kita menginputkan data.',
    materiRef: 'Materi 1',
    topicTag: 'Pengertian Dasar'
  },
  {
    id: 3,
    question: 'Langkah menu yang tepat untuk menyisipkan tabel dengan menentukan jumlah kolom dan baris secara manual adalah...',
    options: [
      { key: 'A', text: 'Home > Paragraph > Table' },
      { key: 'B', text: 'Insert > Table > Insert Table...' },
      { key: 'C', text: 'Layout > Page Setup > Table' },
      { key: 'D', text: 'View > Show > Gridlines' }
    ],
    correctAnswer: 'B',
    explanation: 'Semua objek baru disisipkan lewat tab Insert. Untuk menentukan jumlah pasti kolom dan baris, kita memilih Insert > Table > Insert Table...',
    materiRef: 'Materi 2',
    topicTag: 'Menyisipkan Tabel'
  },
  {
    id: 4,
    question: 'Perintah yang digunakan untuk MENYATUKAN dua atau lebih sel yang bersebelahan menjadi satu sel yang luas adalah...',
    options: [
      { key: 'A', text: 'Split Cells' },
      { key: 'B', text: 'Merge Cells' },
      { key: 'C', text: 'Group Table' },
      { key: 'D', text: 'AutoFit' }
    ],
    correctAnswer: 'B',
    explanation: 'Merge Cells (menggabungkan sel) berfungsi melebur garis batas antar beberapa sel terpilih menjadi satu ruangan sel yang luas.',
    materiRef: 'Materi 4',
    topicTag: 'Menggabungkan Sel'
  },
  {
    id: 5,
    question: 'Jika kamu ingin menambah satu baris baru persis di BAWAH posisi kursor yang sedang aktif, tombol yang diklik pada tab Layout adalah...',
    options: [
      { key: 'A', text: 'Insert Above' },
      { key: 'B', text: 'Insert Below' },
      { key: 'C', text: 'Insert Left' },
      { key: 'D', text: 'Insert Right' }
    ],
    correctAnswer: 'B',
    explanation: 'Insert Below berfungsi menambah satu baris kosong baru tepat di bawah (below) baris tempat kursor aktif berada.',
    materiRef: 'Materi 7',
    topicTag: 'Menyisipkan Baris'
  },
  {
    id: 6,
    question: 'Seorang siswa memblok satu baris data lalu menekan tombol "DELETE" di keyboard laptopnya. Apa yang terjadi pada tabel tersebut?',
    options: [
      { key: 'A', text: 'Baris tersebut terhapus dan tabel menjadi lebih pendek' },
      { key: 'B', text: 'Hanya teks di dalam sel yang terhapus, kotak barisnya tetap ada' },
      { key: 'C', text: 'Seluruh tabel langsung hilang dari lembar kerja' },
      { key: 'D', text: 'Tabel otomatis terbelah dua' }
    ],
    correctAnswer: 'B',
    explanation: 'Tombol Delete pada keyboard hanya membersihkan isi teks (konten) sel. Untuk menghapus baris fisiknya, siswa harus menggunakan menu Layout > Delete > Delete Rows.',
    materiRef: 'Materi 6',
    topicTag: 'Menghapus Baris/Kolom'
  },
  {
    id: 7,
    question: 'Fitur perataan di tab Layout yang membuat teks berada persis di tengah tinggi kotak sel sekaligus di tengah sisi kiri-kanan adalah...',
    options: [
      { key: 'A', text: 'Align Top Left' },
      { key: 'B', text: 'Align Center' },
      { key: 'C', text: 'Align Bottom Center' },
      { key: 'D', text: 'Justify' }
    ],
    correctAnswer: 'B',
    explanation: 'Align Center pada tab Layout Word meratakan teks di pusat koordinat horizontal dan vertikal sel secara proporsional.',
    materiRef: 'Materi 5',
    topicTag: 'Perataan Teks'
  },
  {
    id: 8,
    question: 'Di mana kita bisa mengubah ukuran lebar kolom secara presisi dengan satuan sentimeter (cm)?',
    options: [
      { key: 'A', text: 'Tab Insert > Picture Width' },
      { key: 'B', text: 'Tab Home > Font Size' },
      { key: 'C', text: 'Tab Layout > Cell Size (Width)' },
      { key: 'D', text: 'Tab References > Table of Contents' }
    ],
    correctAnswer: 'C',
    explanation: 'Pada tab kontekstual Layout (di bawah Table Tools), terdapat grup "Cell Size" yang memuat pengaturan "Table Column Width" dan "Table Row Height".',
    materiRef: 'Materi 3',
    topicTag: 'Mengatur Lebar Kolom'
  },
  {
    id: 9,
    question: 'Perintah yang merupakan kebalikan dari Merge Cells, yaitu membagi 1 sel menjadi beberapa baris atau kolom adalah...',
    options: [
      { key: 'A', text: 'Split Table' },
      { key: 'B', text: 'Split Cells' },
      { key: 'C', text: 'Break Column' },
      { key: 'D', text: 'Unmerge' }
    ],
    correctAnswer: 'B',
    explanation: 'Split Cells digunakan untuk memecah kembali sebuah sel menjadi sejumlah kolom atau baris yang ditentukan.',
    materiRef: 'Materi 4',
    topicTag: 'Menggabungkan Sel'
  },
  {
    id: 10,
    question: 'Tombol keyboard pintas tercepat untuk membuat baris baru saat kursor berada di sel paling pojok kanan bawah tabel adalah...',
    options: [
      { key: 'A', text: 'Tombol Shift' },
      { key: 'B', text: 'Tombol Spasi (Spacebar)' },
      { key: 'C', text: 'Tombol Tab' },
      { key: 'D', text: 'Tombol Ctrl + Z' }
    ],
    correctAnswer: 'C',
    explanation: 'Menekan tombol TAB di sel terakhir (pojok kanan bawah) akan otomatis memerintahkan Microsoft Word untuk menambahkan satu baris baru di bawahnya.',
    materiRef: 'Materi 7',
    topicTag: 'Menyisipkan Baris'
  }
];

export const DEFAULT_QUIZ_SETTINGS = {
  timeLimit: 20, // 20 detik
  correctPoints: 10,
  wrongPoints: 0,
  soundEnabled: true,
  lifelinesEnabled: true
};

export const DEFAULT_STUDENTS = [
  { id: 'std-1', name: 'Ahmad Fauzi', groupId: 0, score: 0, answeredCount: 0, correctCount: 0, hasStar: false },
  { id: 'std-2', name: 'Annisa Rahma', groupId: 0, score: 0, answeredCount: 0, correctCount: 0, hasStar: false },
  { id: 'std-3', name: 'Bagas Pratama', groupId: 0, score: 0, answeredCount: 0, correctCount: 0, hasStar: false },
  { id: 'std-4', name: 'Citra Dewi', groupId: 0, score: 0, answeredCount: 0, correctCount: 0, hasStar: false },
  { id: 'std-5', name: 'Daffa Al Ghifari', groupId: 0, score: 0, answeredCount: 0, correctCount: 0, hasStar: false },

  { id: 'std-6', name: 'Dimas Prasetyo', groupId: 1, score: 0, answeredCount: 0, correctCount: 0, hasStar: false },
  { id: 'std-7', name: 'Farah Nabila', groupId: 1, score: 0, answeredCount: 0, correctCount: 0, hasStar: false },
  { id: 'std-8', name: 'Gilang Ramadhan', groupId: 1, score: 0, answeredCount: 0, correctCount: 0, hasStar: false },
  { id: 'std-9', name: 'Hafiz Zulfikar', groupId: 1, score: 0, answeredCount: 0, correctCount: 0, hasStar: false },
  { id: 'std-10', name: 'Indah Permata', groupId: 1, score: 0, answeredCount: 0, correctCount: 0, hasStar: false },

  { id: 'std-11', name: 'Kevin Sanjaya', groupId: 2, score: 0, answeredCount: 0, correctCount: 0, hasStar: false },
  { id: 'std-12', name: 'Larasati Putri', groupId: 2, score: 0, answeredCount: 0, correctCount: 0, hasStar: false },
  { id: 'std-13', name: 'M. Rizky Pratama', groupId: 2, score: 0, answeredCount: 0, correctCount: 0, hasStar: false },
  { id: 'std-14', name: 'Nabila Syakieb', groupId: 2, score: 0, answeredCount: 0, correctCount: 0, hasStar: false },
  { id: 'std-15', name: 'Pandu Wicaksono', groupId: 2, score: 0, answeredCount: 0, correctCount: 0, hasStar: false },

  { id: 'std-16', name: 'Raditya Arya', groupId: 3, score: 0, answeredCount: 0, correctCount: 0, hasStar: false },
  { id: 'std-17', name: 'Siti Nurhaliza', groupId: 3, score: 0, answeredCount: 0, correctCount: 0, hasStar: false },
  { id: 'std-18', name: 'Taufik Hidayat', groupId: 3, score: 0, answeredCount: 0, correctCount: 0, hasStar: false },
  { id: 'std-19', name: 'Vanya Aurelia', groupId: 3, score: 0, answeredCount: 0, correctCount: 0, hasStar: false },
  { id: 'std-20', name: 'Yoga Pratama', groupId: 3, score: 0, answeredCount: 0, correctCount: 0, hasStar: false }
];

