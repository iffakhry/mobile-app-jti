# Panduan Praktikum: Flutter Widget & Widget Tree

### Format: 2 Pertemuan x 4 Jam (Hands-on, Interaktif)

**Topik:** Introductory Mobile Programming
**Prasyarat:** Flutter SDK & environment sudah terpasang, sudah paham dasar Dart (variabel, fungsi, class)
**Metode:** Live coding, hands-on lab mandiri/berpasangan, challenge berjenjang, diskusi reflektif

---

## Cara Menggunakan Panduan Ini

- 🧠 **Teori** — konsep yang perlu dipahami sebelum praktik
- 💻 **Lab** — sesi hands-on wajib, kamu kerjakan langsung sendiri
- 🏆 **Challenge** — tantangan opsional/berjenjang untuk yang ingin bereksplorasi lebih jauh
- 💡 **Industry Insight** — poin yang relevan dengan praktik pengembangan aplikasi di industri saat ini
- ✅ **Checkpoint** — pertanyaan cepat untuk memastikan pemahaman sebelum lanjut
- ⚠️ **Notes** — kesalahan yang sering dilakukan pemula

Setiap sesi 4 jam dibagi menjadi blok-blok waktu supaya kamu tahu apa yang akan dipelajari kapan. Alokasi waktu tiap blok bisa sedikit maju/mundur menyesuaikan ritme kelas, tapi urutan materinya sengaja dibuat berjenjang (scaffolded) — jadi ikuti urutannya ya, karena materi di belakang akan memakai konsep yang sudah dipelajari di depan.

---

# 🗓️ PERTEMUAN 1 (4 Jam) — Fondasi Widget & Membangun UI Statis

**Fokus:** Memahami widget & widget tree, menguasai `MaterialApp`, `Scaffold`, dan widget dasar (`Text`, `Image`, `Icon`, `Container`) untuk membangun tampilan statis.

| Waktu         | Durasi   | Kegiatan                                                                     |
| ------------- | -------- | ---------------------------------------------------------------------------- |
| 00:00 – 00:15 | 15 menit | Pembukaan & Kontrak Belajar                                                  |
| 00:15 – 00:45 | 30 menit | 🧠 Teori: Apa itu Widget & Live Demo `MaterialApp`/`Scaffold`                |
| 00:45 – 01:30 | 45 menit | 💻 Lab 1: Halaman Pertamaku                                                  |
| 01:30 – 01:45 | 15 menit | ☕ Istirahat                                                                 |
| 01:45 – 02:30 | 45 menit | 🧠 Teori: Widget Tree & Widget Konten (`Text`, `Image`, `Icon`, `Container`) |
| 02:30 – 03:15 | 45 menit | 💻 Lab 2: Kartu Profil Statis                                                |
| 03:15 – 03:45 | 30 menit | 🏆 Challenge Tier 1                                                          |
| 03:45 – 04:00 | 15 menit | ✅ Review, Kuis Cepat, Preview Pertemuan 2                                   |

---

## [00:00–00:15] Pembukaan & Kontrak Belajar

Sebelum masuk materi, kamu perlu tahu dulu **tujuan akhir dari 2 pertemuan ini**: di akhir pertemuan kedua, kamu akan berhasil membangun sebuah **kartu profil interaktif** dari nol — mulai dari tampilan statis (pertemuan 1) sampai bisa merespons sentuhan pengguna (pertemuan 2). Kenapa ini penting disampaikan di awal? Supaya kamu punya "peta arah" dan sadar bahwa setiap lab yang kamu kerjakan bukan latihan yang berdiri sendiri-sendiri, melainkan bagian dari satu proyek akhir yang sama.

---

## [00:15–00:45] 🧠 Teori: Apa itu Widget?

Di Flutter, **semua yang tampak di layar adalah widget** — teks, tombol, padding, warna latar, bahkan halaman itu sendiri.

> **Analogi:** Widget itu seperti **balok LEGO**. Satu balok kecil (`Text`) tidak banyak berguna sendirian, tapi disusun berlapis (`Text` di dalam `Container`, `Container` di dalam `Column`) bisa membangun tampilan yang kompleks.

Widget adalah **blueprint tampilan**, bukan tampilan itu sendiri, dan bersifat **immutable** — begitu dibuat, tidak bisa diubah isinya. Ketika tampilan perlu berubah, Flutter membuat widget baru untuk menggantikan yang lama. Konsep ini akan sangat penting saat kita masuk ke `StatefulWidget` di Pertemuan 2.

### Live Demo: `MaterialApp` dan `Scaffold`

Mari mulai dengan membuat project baru dari nol. Ikuti dan ketik ulang kode berikut di editor kamu (jangan copy-paste saja — mengetik ulang membantu kamu lebih cepat hafal struktur dasarnya):

```dart
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Aplikasi Praktikum',
      theme: ThemeData(
        colorSchemeSeed: Colors.deepPurple,
        useMaterial3: true,
      ),
      home: const HomePage(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Beranda')),
      body: const Center(child: Text('Halo, Mahasiswa!')),
    );
  }
}
```

**Yang perlu kamu pahami dari kode di atas:**

| Widget        | Peran                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------- |
| `MaterialApp` | Widget akar aplikasi — atur tema, judul, dan navigasi global                                  |
| `Scaffold`    | Kerangka halaman siap pakai — punya slot untuk `appBar`, `body`, `floatingActionButton`, dll. |

💡 **Industry Insight:** `MaterialApp` mengikuti _Material Design_ dari Google — bahasa desain yang dipakai mayoritas aplikasi Android maupun lintas platform. Ada juga `CupertinoApp` untuk gaya iOS, tapi Material lebih umum dipakai karena konsisten lintas platform dan lebih cepat dikembangkan tim yang beragam latar belakangnya.

**Contoh implementasi umum di industri — deteksi platform otomatis:**
Pola ini sering dipakai saat tim ingin tampilan mengikuti gaya native platform tanpa membuat 2 aplikasi terpisah:

```dart
import 'dart:io' show Platform;

Widget buildButton({required String label, required VoidCallback onPressed}) {
  if (Platform.isIOS) {
    return CupertinoButton.filled(onPressed: onPressed, child: Text(label));
  }
  return ElevatedButton(onPressed: onPressed, child: Text(label));
}
```

Dengan pola ini, komponen UI otomatis menyesuaikan platform tempat aplikasi berjalan — pendekatan yang umum dipakai di aplikasi produksi yang menyasar Android & iOS sekaligus.

✅ **Checkpoint (coba jawab dulu sebelum lanjut):** Kalau `Scaffold` dihapus dan diganti langsung `Text` sebagai `home:`, kira-kira apa yang terjadi? _(Jawaban: teks akan tetap tampil, tapi tanpa AppBar dan tanpa Material styling seperti ripple effect, dsb.)_

---

## [00:45–01:30] 💻 Lab 1: Halaman Pertamaku

**Tujuan:** Kamu akan membuat project Flutter baru dan menjalankan halaman sederhana secara mandiri.

### Instruksi

1. Buat project baru: `flutter create halaman_pertamaku`
2. Bersihkan isi `main.dart`, ganti dengan struktur `MaterialApp` + `Scaffold` seperti contoh demo.
3. Ubah judul `AppBar` menjadi nama kamu sendiri.
4. Tambahkan `backgroundColor` pada `Scaffold` dengan warna pilihanmu.
5. Jalankan di emulator/Chrome, pastikan tidak ada error.

### Kriteria Selesai

- [ ] Project berhasil dijalankan tanpa error
- [ ] `AppBar` menampilkan namamu
- [ ] Ada perubahan `backgroundColor` yang terlihat

⚠️ **Jebakan Umum:** Lupa memanggil `runApp()` di `main()`, atau lupa `const` pada constructor sehingga muncul warning (tidak fatal, tapi kurang mengikuti konvensi).

---

## [01:30–01:45] ☕ Istirahat

---

## [01:45–02:30] 🧠 Teori: Widget Tree & Widget Konten

### Widget Tree

Karena widget disusun berlapis, hasilnya membentuk sebuah **pohon (tree)**:

```
MaterialApp
 └── Scaffold
      ├── AppBar
      │    └── Text ("Judul Halaman")
      └── body
           └── Center
                └── Column
                     ├── Icon
                     ├── Text
                     └── Container
```

Poin penting:

- **Data mengalir top-down**: widget induk mengirim data ke anak lewat constructor.
- **Setiap widget hanya punya satu parent**, tapi bisa punya banyak child.
- Nanti di Pertemuan 2, kita akan lihat bahwa **rebuild akibat perubahan state hanya memengaruhi cabang tree yang relevan** — bukan seluruh aplikasi. Ini salah satu alasan Flutter tetap cepat walau UI-nya kompleks.

💡 **Industry Insight:** Banyak bug pemula (misal "perubahan warna tidak muncul" atau "app jadi lambat") berakar dari kesalahpahaman soal widget tree — biasanya karena struktur widget terlalu dalam/berantakan atau `setState()` dipanggil di scope yang salah. Developer profesional membiasakan diri memvisualisasikan widget tree sebelum menulis kode, terutama untuk layout yang kompleks.

**Contoh implementasi — meletakkan `setState()` di scope yang tepat:**

```dart
// ❌ Kurang tepat: seluruh halaman jadi StatefulWidget hanya karena satu ikon kecil butuh state
class WrongPage extends StatefulWidget { /* ...seluruh halaman ikut rebuild besar... */ }

// ✅ Lebih baik: hanya bagian yang butuh state yang dibuat StatefulWidget,
// bagian lain tetap StatelessWidget sehingga tidak ikut rebuild
class ProductPage extends StatelessWidget {
  const ProductPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Detail Produk')), // tidak pernah rebuild
      body: Column(
        children: const [
          Text('Nama Produk'),       // tidak pernah rebuild
          FavoriteButton(),          // hanya widget inilah yang StatefulWidget
        ],
      ),
    );
  }
}
```

Praktik ini disebut _narrowing the rebuild scope_ — semakin kecil dan spesifik bagian yang dibuat stateful, semakin sedikit widget yang perlu digambar ulang, dan semakin mudah kode dilacak saat debugging.

### Widget Konten Dasar

**`Text`** — menampilkan teks, styling lewat `TextStyle`:

```dart
const Text('Selamat Datang', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold));
```

**`Icon`** — menampilkan ikon dari set Material:

```dart
const Icon(Icons.favorite, color: Colors.red, size: 32);
```

**`Image`** — menampilkan gambar dari berbagai sumber:

```dart
Image.asset('assets/logo.png');        // dari file lokal (daftarkan di pubspec.yaml)
Image.network('https://contoh.com/foto.jpg'); // dari internet
```

💡 **Industry Insight:** `Image.network` polos tidak punya _error handling_ yang baik kalau gagal load (misal tidak ada koneksi). Di proyek nyata, gunakan `errorBuilder` atau paket seperti `cached_network_image` supaya ada fallback dan gambar tidak berulang kali diunduh dari internet.

**Contoh implementasi — pola yang umum dipakai di aplikasi produksi:**

```dart
// Cara paling dasar dengan errorBuilder + loadingBuilder bawaan Flutter
Image.network(
  'https://contoh.com/foto.jpg',
  errorBuilder: (context, error, stackTrace) {
    return const Icon(Icons.broken_image, size: 48, color: Colors.grey);
  },
  loadingBuilder: (context, child, progress) {
    if (progress == null) return child;
    return const Center(child: CircularProgressIndicator());
  },
);
```

```dart
// Pola yang lebih umum dipakai di industri: package cached_network_image
// (tambahkan dulu: flutter pub add cached_network_image)
CachedNetworkImage(
  imageUrl: 'https://contoh.com/foto.jpg',
  placeholder: (context, url) => const CircularProgressIndicator(),
  errorWidget: (context, url, error) => const Icon(Icons.error),
);
```

Pendekatan kedua lebih disukai di proyek nyata karena otomatis melakukan _caching_ — gambar yang sama tidak diunduh ulang setiap kali widget dibangun kembali, sehingga menghemat kuota data pengguna dan mempercepat tampilan.

**`Container`** — widget serbaguna untuk ukuran, warna, padding, margin, dan dekorasi:

```dart
Container(
  padding: const EdgeInsets.all(16),
  decoration: BoxDecoration(
    color: Colors.deepPurple.shade50,
    borderRadius: BorderRadius.circular(12),
  ),
  child: const Text('Saya di dalam Container'),
);
```

💡 **Industry Insight:** Jangan pakai `Container` untuk semua kebutuhan hanya karena "serba bisa". Kalau hanya butuh padding, pakai `Padding`. Kalau hanya butuh alignment, pakai `Align`/`Center`. Widget spesifik lebih ringan dan kode lebih mudah dibaca — reviewer kode di tempat kerja biasanya akan menandai `Container` yang dipakai secara berlebihan.

**Contoh implementasi — sebelum vs sesudah:**

```dart
// ❌ Container dipakai padahal cuma butuh padding
Container(
  padding: const EdgeInsets.all(16),
  child: const Text('Halo'),
);

// ✅ Lebih ringan dan jelas maksudnya: pakai Padding
const Padding(
  padding: EdgeInsets.all(16),
  child: Text('Halo'),
);
```

```dart
// ❌ Container dipakai padahal cuma butuh menengahkan child
Container(
  alignment: Alignment.center,
  child: const Text('Di tengah'),
);

// ✅ Lebih ringan dan jelas maksudnya: pakai Center
const Center(child: Text('Di tengah'));
```

Aturan praktisnya: **gunakan `Container` hanya saat benar-benar butuh gabungan beberapa fitur sekaligus** (misalnya warna + padding + border radius + shadow dalam satu widget, seperti pada Kartu Profil). Kalau cuma butuh satu fitur, pilih widget yang paling spesifik untuk fitur itu.

✅ **Checkpoint:** Kalau kamu ingin gambar `+ text` sejajar ke samping (bukan ke bawah), widget apa yang mungkin kamu butuhkan selain yang sudah dipelajari? _(Petunjuk: coba tebak berdasarkan pola nama widget Flutter yang sudah kamu kenal — jawabannya `Row`, meskipun belum dibahas detail di sini.)_

---

## [02:30–03:15] 💻 Lab 2: Kartu Profil Statis

**Tujuan:** Kamu akan menggabungkan `Container`, `Column`/`Row`, `Icon`, `Image`, dan `Text` menjadi satu komponen UI utuh — ini adalah fondasi dari proyek akhir 2 pertemuan.

### Instruksi

Bangun tampilan "Kartu Profil" di dalam `body` Scaffold, dengan struktur:

```
Container (sebagai kartu, punya padding, warna, border radius, shadow)
 └── Column
      ├── Image (foto profil, bulat menggunakan CircleAvatar atau ClipOval)
      ├── Text (nama)
      ├── Text (jurusan/peran, ukuran lebih kecil, warna abu-abu)
      └── Row
           ├── Icon (misal: email)
           └── Icon (misal: telepon)
```

**Langkah:**

1. Gunakan `Image.network` dengan URL foto bebas (boleh avatar generator seperti `https://i.pravatar.cc/150`).
2. Bungkus foto dengan `CircleAvatar` atau `ClipOval` agar tampil bulat.
3. Tambahkan `BoxDecoration` pada `Container` luar: warna latar, `borderRadius`, dan `boxShadow` agar terlihat seperti kartu.
4. Susun `Text` nama dan peran dengan `TextStyle` berbeda ukuran/berat font.
5. Tambahkan 2 `Icon` di bagian bawah kartu (mewakili kontak/sosial media) di dalam `Row`.

### Kriteria Selesai

- [ ] Kartu tampil di tengah layar (gunakan `Center`)
- [ ] Ada gambar/avatar, nama, peran, dan minimal 2 ikon
- [ ] Kartu memiliki padding, warna latar berbeda dari background halaman, dan sudut membulat

---

## [03:15–03:45] 🏆 Challenge Tier 1 (Opsional, Boleh Dikerjakan Berpasangan)

Pilih salah satu atau lebih sesuai waktu tersisa:

- ⭐ **Basic:** Tambahkan `boxShadow` pada kartu agar terlihat "mengambang", dan ubah warna tema sesuai selera.
- ⭐⭐ **Intermediate:** Tambahkan `Divider` antara bagian nama/peran dan bagian ikon kontak, serta buat kartu bisa di-scroll jika ditambah konten lain (gunakan `SingleChildScrollView`).
- ⭐⭐⭐ **Advanced:** Buat _dua_ kartu profil berbeda dalam satu halaman, disusun dalam `ListView` horizontal (`scrollDirection: Axis.horizontal`) — ini pemanasan untuk konsep list yang akan sedikit disinggung nanti.

> Sudah selesai duluan? Coba tunjukkan hasil challenge-mu ke dosen/asisten atau teman sebelah untuk dapat masukan sebelum sesi ini berakhir.

---

## [03:45–04:00] ✅ Review, Kuis Cepat, Preview Pertemuan 2

**Sebelum lanjut ke pertemuan berikutnya, coba jawab dulu (boleh didiskusikan dengan teman sebelah):**

1. Apa perbedaan mendasar antara widget dan "tampilan" itu sendiri?
2. Sebutkan minimal 3 widget yang sudah kamu pakai hari ini dan fungsi masing-masing.
3. Kenapa `Container` sebaiknya tidak dipakai untuk semua kebutuhan?

**Sekilas Pertemuan 2:** Kartu profil yang baru kamu buat masih "diam" — belum bisa merespons sentuhan. Di pertemuan berikutnya, kamu akan belajar membuat UI yang **hidup dan interaktif** menggunakan `StatefulWidget`, lalu menyempurnakan kartu profil ini menjadi versi interaktif sebagai proyek akhir.

---

---

# 🗓️ PERTEMUAN 2 (4 Jam) — Interaktivitas & State Management Dasar

**Fokus:** Memahami `StatefulWidget`, `setState()`, praktik penyusunan widget yang baik, lalu menyempurnakan Kartu Profil menjadi interaktif sebagai proyek akhir.

| Waktu         | Durasi   | Kegiatan                                                        |
| ------------- | -------- | --------------------------------------------------------------- |
| 00:00 – 00:15 | 15 menit | Recap Cepat Pertemuan 1                                         |
| 00:15 – 01:00 | 45 menit | 🧠 Teori: StatelessWidget vs StatefulWidget + Demo `setState()` |
| 01:00 – 01:45 | 45 menit | 💻 Lab 3: Aplikasi Counter                                      |
| 01:45 – 02:00 | 15 menit | ☕ Istirahat                                                    |
| 02:00 – 02:45 | 45 menit | 🧠 Teori: Praktik Industri dalam Menyusun Widget                |
| 02:45 – 03:30 | 45 menit | 💻 Lab 4: Kartu Profil Interaktif (Proyek Akhir)                |
| 03:30 – 03:50 | 20 menit | 🏆 Challenge Tier 2 (Berjenjang)                                |
| 03:50 – 04:00 | 10 menit | Wrap-up, Refleksi, Tugas Lanjutan                               |

---

## [00:00–00:15] Recap Cepat Pertemuan 1

Sebelum lanjut ke materi baru, coba jelaskan ke teman sebelahmu (atau ke dirimu sendiri kalau belajar sendirian): apa itu widget tree, dan sebutkan satu widget yang kamu pakai membangun kartu profil kemarin beserta fungsinya. Ini pemanasan sekaligus memastikan konsep dasarnya sudah lengket sebelum kamu masuk ke konsep yang lebih dinamis.

---

## [00:15–01:00] 🧠 Teori: StatelessWidget vs StatefulWidget

### StatelessWidget

Widget yang **tidak punya data internal yang berubah** setelah dibangun. Tampilannya tetap sama kecuali parent-nya mengirim data baru.

> **Analogi:** `StatelessWidget` seperti **foto cetak** — sekali dicetak, gambarnya tidak berubah.

### StatefulWidget

Widget yang **bisa menyimpan dan mengubah data selama hidup**, lalu memicu Flutter menggambar ulang tampilannya saat data berubah.

> **Analogi:** `StatefulWidget` seperti **papan tulis whiteboard** — isinya bisa dihapus dan ditulis ulang kapan saja tanpa mengganti papannya.

### Live Demo: Counter Sederhana

```dart
class CounterPage extends StatefulWidget {
  const CounterPage({super.key});

  @override
  State<CounterPage> createState() => _CounterPageState();
}

class _CounterPageState extends State<CounterPage> {
  int _count = 0;

  void _increment() {
    setState(() {
      _count++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(child: Text('Jumlah: $_count', style: const TextStyle(fontSize: 24))),
      floatingActionButton: FloatingActionButton(
        onPressed: _increment,
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

**Begini alur `setState()` kalau dibedah selangkah demi selangkah:**

1. User menekan tombol → `_increment()` terpanggil.
2. `setState()` mengubah nilai `_count` **dan** memberi tahu Flutter: _"data berubah, gambar ulang bagian ini."_
3. Flutter memanggil ulang `build()` **hanya untuk widget ini ke bawah** (bukan seluruh app) — sesuai konsep widget tree yang sudah dipelajari.

⚠️ **Jebakan Umum:**

- Mengubah variabel **di luar** `setState()` — tampilan tidak akan ter-update meskipun data sebenarnya berubah.
- Melakukan proses berat (network call, kalkulasi besar) **di dalam** `setState()`. Yang benar: proses berat dilakukan di luar, hasilnya baru di-_assign_ ke variabel di dalam `setState()`.

### Kapan Memilih yang Mana?

| Gunakan `StatelessWidget` jika...               | Gunakan `StatefulWidget` jika...                             |
| ----------------------------------------------- | ------------------------------------------------------------ |
| Tampilan hanya bergantung pada data dari parent | Ada data yang berubah akibat interaksi user                  |
| Tidak ada animasi/toggle/counter internal       | Ada form, status loading, atau counter yang dikelola sendiri |

✅ **Checkpoint (coba jawab dulu sebelum lanjut):** Kalau kartu profilmu kemarin ingin punya tombol "like" yang icon-nya berubah warna saat ditekan, dia harus jadi `StatelessWidget` atau `StatefulWidget`? Kenapa?

---

## [01:00–01:45] 💻 Lab 3: Aplikasi Counter

**Tujuan:** Kamu akan mempraktikkan `StatefulWidget` dan `setState()` secara mandiri, dengan variasi dari demo agar tidak sekadar copy-paste.

### Instruksi

1. Buat halaman baru `CounterPage` (boleh reuse project Lab 1/2).
2. Tambahkan **dua** tombol: satu untuk menambah (`+1`), satu untuk mengurangi (`-1`).
3. Beri aturan: angka **tidak boleh kurang dari 0** (validasi sederhana di dalam fungsi, sebelum `setState()`).
4. Ubah warna teks angka menjadi merah jika angka bernilai 0, dan hijau jika lebih dari 0.

### Kriteria Selesai

- [ ] Tombol tambah dan kurang berfungsi
- [ ] Angka tidak bisa menjadi negatif
- [ ] Warna teks berubah sesuai kondisi nilai

---

## [01:45–02:00] ☕ Istirahat

---

## [02:00–02:45] 🧠 Teori: Praktik Industri dalam Menyusun Widget

Bagian ini krusial — ini yang membedakan kode "yang penting jalan" dari kode yang **siap dikembangkan dalam tim/proyek nyata**.

### 1. Gunakan `const` sebisa mungkin

```dart
const Text('Teks tetap'); // widget ini tidak akan dibangun ulang selama parameternya tidak berubah — optimasi performa nyata
```

**Contoh implementasi — efek `const` saat rebuild:**

```dart
class Counter extends StatefulWidget {
  const Counter({super.key});
  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // ✅ const: widget ini TIDAK dibangun ulang setiap kali setState() dipanggil,
        // karena Flutter tahu isinya tidak mungkin berubah
        const Text('Judul Halaman Tetap'),

        // Widget ini WAJIB dibangun ulang karena bergantung pada _count
        Text('Jumlah: $_count'),

        ElevatedButton(
          onPressed: () => setState(() => _count++),
          child: const Text('Tambah'),
        ),
      ],
    );
  }
}
```

Semakin banyak widget yang bisa ditandai `const`, semakin sedikit pekerjaan yang perlu dilakukan Flutter setiap kali `setState()` dipanggil — ini praktik yang selalu dicek linter (`flutter analyze`) di proyek profesional.

### 2. Pecah widget jadi komponen kecil (Composition)

Widget tree yang terlalu dalam dalam satu `build()` menyulitkan pembacaan & debugging. Ekstrak jadi widget/class terpisah, terutama bagian yang dipakai berulang (misalnya `ProfileCard`, `StatBadge`).

**Contoh implementasi — sebelum vs sesudah ekstraksi:**

```dart
// ❌ Sebelum: semua logic tampilan menumpuk di satu build(), sulit dibaca & sulit dites
class HomePage extends StatelessWidget {
  const HomePage({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: const [BoxShadow(blurRadius: 8, color: Colors.black26)],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: const [
              CircleAvatar(radius: 40),
              Text('Nama Mahasiswa', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              Text('Jurusan Informatika', style: TextStyle(color: Colors.grey)),
            ],
          ),
        ),
      ),
    );
  }
}

// ✅ Sesudah: bagian kartu diekstrak jadi widget sendiri — bisa dipakai ulang & lebih mudah dites
class HomePage extends StatelessWidget {
  const HomePage({super.key});
  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: ProfileCard()));
  }
}

class ProfileCard extends StatelessWidget {
  const ProfileCard({super.key});
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [BoxShadow(blurRadius: 8, color: Colors.black26)],
      ),
      child: const Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          CircleAvatar(radius: 40),
          Text('Nama Mahasiswa', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          Text('Jurusan Informatika', style: TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }
}
```

### 3. Gunakan `Key` pada list dinamis

Kalau item list bisa berubah urutan/dihapus (misal `ListView` yang bisa di-reorder), gunakan `Key` (`ValueKey`, `UniqueKey`) agar Flutter tidak salah menukar state antar item.

**Contoh implementasi:**

```dart
// ✅ Setiap item diberi ValueKey unik berdasarkan id data, bukan index list
ListView.builder(
  itemCount: students.length,
  itemBuilder: (context, index) {
    final student = students[index];
    return StudentTile(
      key: ValueKey(student.id), // bukan ValueKey(index)!
      student: student,
    );
  },
);
```

⚠️ Menggunakan `index` sebagai key berbahaya kalau list bisa berubah urutan/dihapus — Flutter bisa salah mengasosiasikan state (misalnya status "expanded" atau "dicentang") ke item yang salah setelah list berubah. Gunakan identitas unik dari data (`id`) sebagai key, bukan posisinya.

### 4. Pisahkan UI dari logic bisnis

`setState()` cocok untuk kasus lokal/sederhana. Di skala tim/produksi, umumnya logic dipisah dari widget menggunakan state management seperti `Provider`, `Riverpod`, atau `Bloc` — agar lebih mudah di-_test_ dan dikelola banyak developer sekaligus.

**Contoh implementasi — pola `Provider` (salah satu yang paling umum dipakai):**

```dart
// 1. Class terpisah untuk logic/data, tidak tahu-menahu soal widget
class CounterModel extends ChangeNotifier {
  int _count = 0;
  int get count => _count;

  void increment() {
    _count++;
    notifyListeners(); // beri tahu widget yang "mendengarkan" bahwa data berubah
  }
}

// 2. Daftarkan model di atas widget tree yang membutuhkannya
void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => CounterModel(),
      child: const MyApp(),
    ),
  );
}

// 3. Widget UI murni "membaca" data, tanpa tahu logic di baliknya
class CounterText extends StatelessWidget {
  const CounterText({super.key});
  @override
  Widget build(BuildContext context) {
    final count = context.watch<CounterModel>().count;
    return Text('Jumlah: $count');
  }
}
```

Dengan pola ini, `CounterModel` bisa diuji (_unit test_) tanpa perlu menjalankan UI sama sekali — sesuatu yang sulit dilakukan kalau logic bercampur langsung dengan `setState()` di dalam widget.

### 5. Gunakan `ListView.builder` untuk list panjang

`.builder` merender item **secara lazy** (hanya yang terlihat di layar), bukan render semua sekaligus — penting untuk performa saat data banyak.

**Contoh implementasi:**

```dart
// ❌ Semua item langsung dibuat sekaligus, meskipun belum terlihat di layar
ListView(
  children: students.map((s) => Text(s.name)).toList(),
);

// ✅ Item dibuat "on demand" hanya saat akan terlihat di layar
ListView.builder(
  itemCount: students.length,
  itemBuilder: (context, index) {
    return Text(students[index].name);
  },
);
```

Perbedaannya baru terasa signifikan saat data mencapai ratusan/ribuan item — pola `.builder` adalah standar default di aplikasi produksi untuk semua jenis list, feed, atau chat.

### 6. Manfaatkan widget bawaan sebelum membuat custom

Cek dulu apakah Flutter/Material sudah punya widget siap pakai (`Card`, `ListTile`, `Chip`) sebelum membangun dari nol — menghemat waktu dan menjaga konsistensi visual dengan konvensi platform.

**Contoh implementasi:**

```dart
// ❌ Membuat "kartu list" dari nol dengan Container + Row manual
Container(
  padding: const EdgeInsets.all(12),
  margin: const EdgeInsets.symmetric(vertical: 4),
  decoration: BoxDecoration(border: Border.all(color: Colors.grey)),
  child: Row(
    children: const [
      Icon(Icons.person),
      SizedBox(width: 12),
      Text('Nama Mahasiswa'),
    ],
  ),
);

// ✅ Memakai widget bawaan yang sudah sesuai konvensi Material Design
const ListTile(
  leading: Icon(Icons.person),
  title: Text('Nama Mahasiswa'),
  subtitle: Text('Jurusan Informatika'),
  trailing: Icon(Icons.chevron_right),
);
```

`ListTile` sudah menangani padding, alignment, dan ukuran yang konsisten dengan pedoman Material Design — mengurangi kode yang perlu ditulis dan dipelihara sendiri.

### Live Demo Singkat: Refactor

Coba bandingkan lagi **sebelum vs sesudah** refactor kartu profil dari Pertemuan 1 pada contoh poin 2 di atas: bagian kartu diekstrak menjadi widget terpisah bernama `ProfileCard`, dan `const` ditambahkan di tempat yang relevan.

💡 **Industry Insight:** Saat _code review_ di tempat kerja, hal-hal di atas (pemakaian `const`, ekstraksi widget, pemisahan logic) adalah hal-hal pertama yang biasanya dikomentari senior developer — bukan karena "gaya", tapi karena berdampak langsung ke performa aplikasi dan kemudahan kolaborasi tim.

---

## [02:45–03:30] 💻 Lab 4: Kartu Profil Interaktif (Proyek Akhir)

**Tujuan:** Kamu akan menggabungkan seluruh materi 2 pertemuan — widget dasar, widget tree, `StatefulWidget`, dan praktik penyusunan widget yang baik — menjadi satu proyek utuh.

### Instruksi

Sempurnakan Kartu Profil dari Lab 2 (Pertemuan 1) menjadi **interaktif**, dengan ketentuan:

1. Ubah `HomePage` (atau widget kartu) menjadi `StatefulWidget`.
2. Tambahkan **ikon "like/favorite"** yang saat ditekan:
   - Berubah dari `Icons.favorite_border` menjadi `Icons.favorite`
   - Berubah warna dari abu-abu menjadi merah
   - Menambah counter jumlah "like" yang ditampilkan di bawah kartu
3. Ekstrak bagian kartu menjadi widget terpisah, misalnya class `ProfileCard`, agar `build()` utama tidak terlalu panjang (terapkan poin _Composition_ yang baru dipelajari).
4. Gunakan `const` di semua widget yang memungkinkan.

### Kriteria Selesai

- [ ] Kartu profil sekarang adalah bagian dari `StatefulWidget`
- [ ] Ikon like berubah tampilan & warna saat ditekan
- [ ] Ada counter jumlah like yang bertambah setiap ditekan
- [ ] Struktur kode sudah dipecah menjadi minimal 2 widget/class terpisah

⚠️ **Jebakan Umum:** Menaruh `StatefulWidget` di level yang salah (misalnya membuat seluruh `MaterialApp` jadi stateful padahal cukup bagian kartunya saja) — ini berkaitan langsung dengan pemahaman "rebuild hanya memengaruhi cabang tree yang relevan" dari Pertemuan 1.

---

## [03:30–03:50] 🏆 Challenge Tier 2 (Berjenjang)

- ⭐ **Basic:** Tambahkan animasi sederhana saat ikon like ditekan menggunakan `AnimatedContainer` atau `AnimatedScale` (boleh eksplorasi dokumentasi resmi Flutter).
- ⭐⭐ **Intermediate:** Tambahkan tombol "reset" yang mengembalikan status like dan counter ke kondisi awal.
- ⭐⭐⭐ **Advanced:** Buat kartu profil bisa menampilkan **daftar beberapa profil** (misal 3 teman sekelas) menggunakan `ListView.builder`, di mana **setiap kartu punya status like independen** satu sama lain. (Challenge ini akan memaksamu berpikir soal di mana `state` seharusnya "hidup" — pemanasan konsep _lifting state up_ yang akan dibahas lebih dalam di pertemuan-pertemuan mendatang.)

> Kalau kamu berhasil menyelesaikan challenge tier yang lebih tinggi, coba demo-kan hasilnya ke dosen/asisten atau teman sekelas. Kebiasaan berbagi hasil kerja (demo/show & tell) ini juga umum dilakukan di dunia kerja, misalnya saat _sprint review_.

---

## [03:50–04:00] Wrap-up, Refleksi, Tugas Lanjutan

**Tuliskan jawaban singkat untuk pertanyaan berikut (exit ticket):**

1. Konsep apa yang paling menantang buatmu dari 2 pertemuan ini, dan kenapa?
2. Coba jelaskan dengan kata-katamu sendiri: kenapa `const` bisa meningkatkan performa aplikasi, dikaitkan dengan konsep _rebuild_ pada widget tree?

**Tugas lanjutan (opsional):** Selesaikan challenge yang belum sempat kamu kerjakan di kelas, atau eksplorasi mandiri: tambahkan satu widget baru yang belum diajarkan (misal `Card` atau `Chip`) ke dalam Kartu Profil Interaktif buatanmu, lalu ceritakan singkat di pertemuan berikutnya apa fungsinya.

---

## Referensi Lanjutan

- Widget catalog resmi: https://docs.flutter.dev/ui/widgets
- Konsep state management: https://docs.flutter.dev/data-and-backend/state-mgmt/intro
- Dokumentasi animasi dasar: https://docs.flutter.dev/ui/animations
- Package `provider`: https://pub.dev/packages/provider
- Package `cached_network_image`: https://pub.dev/packages/cached_network_image

---

_Panduan ini dirancang untuk 2 pertemuan @4 jam. Alokasi waktu tiap blok bisa sedikit maju/mundur menyesuaikan ritmemu sendiri, tapi tetap ikuti urutan materinya karena sengaja disusun berjenjang (scaffolded) menuju proyek akhir Kartu Profil Interaktif._
