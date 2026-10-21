import { Question } from '../types/game';

export const PYTHON_QUESTIONS: Question[] = [
  // --- KATEGORI: PENGERTIAN CODING & PYTHON ---
  {
    id: 'q1',
    topic: 'coding',
    topicLabel: 'Dasar Pemrograman',
    question: 'Apa pengertian dari "Coding" atau pemrograman yang paling tepat bagi pemula?',
    options: [
      'Menulis serangkaian instruksi atau perintah agar komputer dapat menjalankan tugas',
      'Memperbaiki kabel dan perangkat keras komputer yang rusak',
      'Mendesain gambar menggunakan aplikasi Photoshop di komputer',
      'Menghapus virus secara otomatis dari flashdisk siswa'
    ],
    correctIndex: 0,
    explanation: 'Coding adalah proses menulis sekumpulan instruksi menggunakan bahasa pemrograman (seperti Python) agar komputer dapat mengerti dan menjalankan tugas yang kita inginkan.'
  },
  {
    id: 'q2',
    topic: 'coding',
    topicLabel: 'Pengenalan Python',
    question: 'Mengapa bahasa pemrograman Python sangat populer dan cocok dipelajari oleh siswa SMA?',
    options: [
      'Sintaksnya sederhana, mudah dibaca mirip bahasa Inggris sehari-hari',
      'Hanya bisa dijalankan di komputer supercanggih milik laboratorium',
      'Tidak memerlukan logika sama sekali saat membuat program',
      'Hanya bisa digunakan untuk memutar musik dan video'
    ],
    correctIndex: 0,
    explanation: 'Python diciptakan dengan filosofi keterbacaan kode (code readability), sehingga sintaksnya sangat bersih, intuitif, dan ramah untuk pemula.'
  },
  {
    id: 'q3',
    topic: 'coding',
    topicLabel: 'Aturan Python',
    question: 'Bahasa Python bersifat "case-sensitive". Apa artinya?',
    options: [
      'Huruf besar dan huruf kecil dianggap BERBEDA (misal: "Nama" berbeda dengan "nama")',
      'Semua teks otomatis diubah menjadi huruf kapital',
      'Python tidak bisa membaca huruf sama sekali, hanya angka',
      'Kibor yang digunakan harus memiliki lampu menyala'
    ],
    correctIndex: 0,
    explanation: 'Case-sensitive berarti Python membedakan huruf besar dan kecil. Variabel "Nilai", "NILAI", dan "nilai" adalah tiga hal yang berbeda bagi Python.'
  },
  {
    id: 'q4',
    topic: 'coding',
    topicLabel: 'Komentar Python',
    question: 'Simbol apa yang digunakan untuk membuat catatan/komentar di Python yang tidak akan dijalankan komputer?',
    codeSnippet: '# Ini adalah contoh catatan\nprint("Halo")',
    options: [
      'Tanda Pagar (#)',
      'Tanda Titik Dua (:)',
      'Tanda Garis Miring Ganda (//)',
      'Tanda Bintang Ganda (**)'
    ],
    correctIndex: 0,
    explanation: 'Tanda pagar (#) digunakan untuk menulis komentar di Python. Baris yang diawali # akan diabaikan oleh komputer dan berguna sebagai penjelasan untuk pemrogram.'
  },

  // --- KATEGORI: FUNGSI PRINT() ---
  {
    id: 'q5',
    topic: 'print',
    topicLabel: 'Fungsi print()',
    question: 'Apa fungsi utama dari perintah print() dalam bahasa Python?',
    options: [
      'Mencetak atau menampilkan teks/output ke layar konsol',
      'Mencetak dokumen langsung ke mesin printer fisik di atas kertas',
      'Menyimpan file secara otomatis ke folder dokumen',
      'Mematikan layar monitor komputer secara otomatis'
    ],
    correctIndex: 0,
    explanation: 'Fungsi print() berguna untuk menampilkan data, teks, atau hasil perhitungan ke layar monitor (konsol).'
  },
  {
    id: 'q6',
    topic: 'print',
    topicLabel: 'Sintaks print()',
    question: 'Manakah penulisan perintah print() yang BENAR untuk menampilkan teks "Selamat Pagi"?',
    options: [
      'print("Selamat Pagi")',
      'Print("Selamat Pagi")',
      'print Selamat Pagi',
      'cetak("Selamat Pagi")'
    ],
    correctIndex: 0,
    explanation: 'Python menggunakan huruf kecil semua "print(...)" dan teks harus diapit tanda petik, baik kutip dua ("...") maupun kutip satu (\'...\').'
  },
  {
    id: 'q7',
    topic: 'print',
    topicLabel: 'Output print()',
    question: 'Perhatikan kode Python berikut. Apa yang akan tampil di layar?',
    codeSnippet: 'print(5 + 3)',
    options: [
      '8',
      '5 + 3',
      '53',
      'Error tidak tampil'
    ],
    correctIndex: 0,
    explanation: 'Karena angka 5 + 3 TIDAK diberi tanda kutip, Python menganggapnya operasi matematika dan langsung menghitung hasilnya, yaitu 8.'
  },
  {
    id: 'q8',
    topic: 'print',
    topicLabel: 'Teks vs Angka',
    question: 'Perhatikan kode Python berikut. Apa yang akan tampil di layar?',
    codeSnippet: 'print("5 + 3")',
    options: [
      '5 + 3',
      '8',
      '8.0',
      'SyntaxError'
    ],
    correctIndex: 0,
    explanation: 'Karena 5 + 3 berada di dalam tanda petik ("..."), Python memperlakukannya sebagai teks biasa (string) dan mencetaknya persis seperti yang tertulis: 5 + 3.'
  },
  {
    id: 'q9',
    topic: 'print',
    topicLabel: 'Fungsi print()',
    question: 'Apa output dari kode Python di bawah ini?',
    codeSnippet: 'nama = "Ahmad"\nprint("Halo", nama)',
    options: [
      'Halo Ahmad',
      'Halo nama',
      'Halo + Ahmad',
      'HaloAhmad'
    ],
    correctIndex: 0,
    explanation: 'Fungsi print() yang memisahkan argumen dengan tanda koma (,) akan otomatis memberikan spasi di antara teks, menghasilkan "Halo Ahmad".'
  },

  // --- KATEGORI: TIPE DATA STR (STRING) ---
  {
    id: 'q10',
    topic: 'str',
    topicLabel: 'Tipe Data str',
    question: 'Apa ciri khas utama tipe data "str" (String) dalam Python?',
    options: [
      'Kumpulan huruf atau karakter yang selalu diapit tanda kutip ("..." atau \'...\')',
      'Bilangan bulat yang bernilai di atas seratus',
      'Nilai logika yang hanya bernilai Benar atau Salah',
      'Angka desimal yang memiliki tanda koma pecahan'
    ],
    correctIndex: 0,
    explanation: 'String (str) adalah tipe data untuk menyimpan teks/karakter dan harus selalu dibungkus tanda kutip, misalnya "Informatika" atau \'Kelas 10\'.'
  },
  {
    id: 'q11',
    topic: 'str',
    topicLabel: 'Tipe Data str',
    question: 'Manakah di bawah ini yang merupakan contoh tipe data string (str)?',
    options: [
      '"Subway Surfer 2026"',
      '100',
      '3.14',
      'True'
    ],
    correctIndex: 0,
    explanation: '"Subway Surfer 2026" diapit oleh tanda kutip dua, sehingga dikategorikan sebagai tipe data string (str).'
  },
  {
    id: 'q12',
    topic: 'str',
    topicLabel: 'Tipe Data str',
    question: 'Jika ada variabel angka = "25", apa tipe data dari variabel tersebut?',
    codeSnippet: 'angka = "25"',
    options: [
      'str (karena diapit tanda kutip)',
      'int (karena berupa angka 25)',
      'float (karena bilangan desimal)',
      'bool (karena bernilai benar)'
    ],
    correctIndex: 0,
    explanation: 'Walaupun isinya angka 25, karena dibungkus tanda kutip ("25"), Python menganggapnya sebagai string (str), bukan integer.'
  },

  // --- KATEGORI: TIPE DATA INT (INTEGER) ---
  {
    id: 'q13',
    topic: 'int',
    topicLabel: 'Tipe Data int',
    question: 'Apa pengertian dari tipe data "int" (Integer) dalam bahasa Python?',
    options: [
      'Tipe data untuk bilangan bulat (positif, negatif, atau nol) tanpa pecahan desimal',
      'Tipe data untuk menyimpan teks dan kata-kata panjang',
      'Tipe data khusus untuk angka yang memiliki nilai desimal berkoma',
      'Tipe data untuk menyimpan gambar dan audio'
    ],
    correctIndex: 0,
    explanation: 'Integer (int) adalah tipe data bilangan bulat, seperti 1, 10, -5, atau 0, tanpa ada pecahan atau koma desimal.'
  },
  {
    id: 'q14',
    topic: 'int',
    topicLabel: 'Tipe Data int',
    question: 'Manakah data berikut yang paling tepat disimpan menggunakan tipe data int?',
    options: [
      'Jumlah siswa di kelas (misal: 36)',
      'Nama lengkap siswa (misal: "Dewi Lestari")',
      'Tinggi badan dalam meter (misal: 1.65)',
      'Status kelulusan (misal: True)'
    ],
    correctIndex: 0,
    explanation: 'Jumlah siswa adalah bilangan bulat (tidak ada 36.5 siswa), sehingga sangat tepat menggunakan tipe data int (integer).'
  },
  {
    id: 'q15',
    topic: 'int',
    topicLabel: 'Tipe Data int',
    question: 'Manakah di bawah ini yang merupakan nilai bertipe int?',
    options: [
      '-15',
      '"-15"',
      '-15.0',
      'False'
    ],
    correctIndex: 0,
    explanation: '-15 adalah bilangan bulat negatif tanpa koma dan tanpa tanda kutip, sehingga tipenya adalah int.'
  },

  // --- KATEGORI: TIPE DATA FLOAT ---
  {
    id: 'q16',
    topic: 'float',
    topicLabel: 'Tipe Data float',
    question: 'Apa karakteristik utama tipe data "float" dalam bahasa Python?',
    options: [
      'Menyimpan bilangan riil yang memiliki angka pecahan desimal bertanda titik (.)',
      'Hanya bisa menyimpan angka bernilai genap saja',
      'Teks yang memiliki huruf berjalan di layar',
      'Data yang bernilai Benar (True) atau Salah (False)'
    ],
    correctIndex: 0,
    explanation: 'Float (floating point) adalah tipe data bilangan pecahan atau desimal. Di Python, pemisah desimal menggunakan tanda titik (.), bukan tanda koma.'
  },
  {
    id: 'q17',
    topic: 'float',
    topicLabel: 'Tipe Data float',
    question: 'Dalam penulisan matematika Python, bagaimanakah cara menulis nilai tiga koma empat belas (3,14)?',
    options: [
      '3.14 (menggunakan tanda titik)',
      '3,14 (menggunakan tanda koma)',
      '"3,14" (menggunakan kutip koma)',
      '3/14 (menggunakan tanda bagi)'
    ],
    correctIndex: 0,
    explanation: 'Python mengikuti standar internasional di mana desimal ditulis dengan tanda titik (.): 3.14. Tanda koma (,) digunakan untuk memisahkan item.'
  },
  {
    id: 'q18',
    topic: 'float',
    topicLabel: 'Tipe Data float',
    question: 'Jika x = 10.0, apa tipe data variabel x tersebut?',
    codeSnippet: 'x = 10.0\nprint(type(x))',
    options: [
      'float (karena memiliki titik desimal .0)',
      'int (karena nilainya sama dengan 10)',
      'str (karena ada titiknya)',
      'bool (karena bernilai positif)'
    ],
    correctIndex: 0,
    explanation: 'Meskipun nilainya 10, adanya tanda titik dan angka desimal (.0) membuat Python secara otomatis menggolongkannya sebagai tipe float.'
  },

  // --- KATEGORI: TIPE DATA BOOL (BOOLEAN) ---
  {
    id: 'q19',
    topic: 'bool',
    topicLabel: 'Tipe Data bool',
    question: 'Tipe data "bool" (Boolean) hanya memiliki DUA nilai. Nilai apakah itu?',
    options: [
      'True dan False (diawali huruf kapital)',
      'true dan false (diawali huruf kecil)',
      'Yes dan No',
      '1 dan 2'
    ],
    correctIndex: 0,
    explanation: 'Tipe data Boolean (bool) dalam Python hanya memiliki dua kemungkinan nilai kebenaran: True dan False, dengan huruf awal kapital (T dan F).'
  },
  {
    id: 'q20',
    topic: 'bool',
    topicLabel: 'Tipe Data bool',
    question: 'Apa hasil evaluasi logika dari kode Python di bawah ini?',
    codeSnippet: 'print(10 > 5)',
    options: [
      'True',
      'False',
      '10 > 5',
      'Error'
    ],
    correctIndex: 0,
    explanation: 'Pernyataan "10 lebih besar dari 5" adalah benar, sehingga hasil perbandingannya bernilai logika Boolean True.'
  },
  {
    id: 'q21',
    topic: 'bool',
    topicLabel: 'Tipe Data bool',
    question: 'Manakah penulisan nilai boolean yang sah (valid) di Python?',
    options: [
      'status = True',
      'status = true',
      'status = "True"',
      'status = TRUE'
    ],
    correctIndex: 0,
    explanation: 'Python mengenali keyword boolean dengan huruf pertama kapital, yaitu True dan False. Jika ditulis "True" (dengan kutip) menjadi string.'
  },

  // --- KATEGORI: VARIABEL & IDENTIFIKASI TIPE DATA ---
  {
    id: 'q22',
    topic: 'variabel',
    topicLabel: 'Fungsi type()',
    question: 'Fungsi bawaan Python apa yang dapat digunakan untuk mengetahui jenis tipe data suatu nilai atau variabel?',
    codeSnippet: 'nilai = 95\nprint(____(nilai))',
    options: [
      'type()',
      'check()',
      'tipe()',
      'jenis()'
    ],
    correctIndex: 0,
    explanation: 'Fungsi type() di Python digunakan untuk memeriksa tipe data suatu variabel atau nilai, contohnya type(95) akan menghasilkan <class \'int\'>.'
  },
  {
    id: 'q23',
    topic: 'variabel',
    topicLabel: 'Aturan Variabel',
    question: 'Manakah nama variabel di Python yang SAH (tidak menimbulkan error)?',
    options: [
      'nama_siswa',
      '2nama',
      'nama siswa (ada spasi)',
      'nama-siswa (ada tanda minus)'
    ],
    correctIndex: 0,
    explanation: 'Nama variabel Python boleh memakai huruf, angka, dan garis bawah (_), tetapi TIDAK BOLEH diawali angka, tidak boleh ada spasi, dan tidak boleh memakai tanda minus.'
  },
  {
    id: 'q24',
    topic: 'variabel',
    topicLabel: 'Ringkasan 4 Tipe Data',
    question: 'Cocokkan nilai berikut secara berurutan dengan tipe datanya: "Halo", 45, 7.5, False',
    options: [
      'str, int, float, bool',
      'int, str, bool, float',
      'str, float, int, bool',
      'bool, int, float, str'
    ],
    correctIndex: 0,
    explanation: '"Halo" adalah teks (str), 45 adalah bilangan bulat (int), 7.5 adalah pecahan desimal (float), dan False adalah nilai logika (bool).'
  }
];

export function getRandomQuestion(excludeIds: string[] = []): Question {
  const available = PYTHON_QUESTIONS.filter(q => !excludeIds.includes(q.id));
  const pool = available.length > 0 ? available : PYTHON_QUESTIONS;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
