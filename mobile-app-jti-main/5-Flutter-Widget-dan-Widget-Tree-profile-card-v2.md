# Praktikum Mobile Programming
## Mengenal Widget & Widget Tree di Flutter

**Durasi:** 1x Pertemuan (4 Jam)
**Prasyarat:** Flutter SDK & VS Code sudah terpasang, kamu sudah memahami dasar Dart (variabel, fungsi, class)
**Studi Kasus:** Sepanjang praktikum ini, kamu akan membangun **satu aplikasi yang sama secara bertahap** — sebuah **Kartu Profil Digital**. Setiap bagian akan menambahkan potongan kode baru ke project yang sudah kamu buat di bagian sebelumnya, sampai akhirnya di akhir sesi kamu punya aplikasi utuh yang bisa dijalankan dan dipamerkan.

---

## 🎯 Tujuan Pembelajaran

Setelah menyelesaikan praktikum ini, kamu akan mampu:

1. Menjelaskan konsep **Widget** dan **Widget Tree** di Flutter
2. Membedakan dan menggunakan `MaterialApp`, `Scaffold`
3. Menampilkan teks, gambar, dan ikon menggunakan `Text`, `Image`, `Icon`
4. Mengatur tata letak dengan `Container`
5. Membedakan `StatelessWidget` dan `StatefulWidget`, serta tahu kapan menggunakan masing-masing
6. Menerapkan praktik standar industri sejak awal belajar (bukan kebiasaan yang harus "dibetulkan" nanti)
7. Menyusun potongan-potongan widget menjadi **satu aplikasi utuh** yang berkembang secara bertahap

---

## 🗺️ Rundown Praktikum (4 Jam)

| Waktu | Aktivitas | Progres Studi Kasus |
|---|---|---|
| 00.00 – 00.15 | Pembukaan & Recap | Setup project |
| 00.15 – 00.45 | Konsep Widget & Widget Tree | — |
| 00.45 – 01.30 | Praktik: `MaterialApp` & `Scaffold` | Kerangka aplikasi berdiri |
| 01.30 – 01.40 | ☕ Istirahat | — |
| 01.40 – 02.20 | Praktik: `Text` & `Icon` | Nama & bio muncul di layar |
| 02.20 – 03.00 | Praktik: `Image` & `Container` | Foto profil & kartu tampil rapi |
| 03.00 – 03.45 | `StatelessWidget` vs `StatefulWidget` | Tombol "Like" interaktif berfungsi |
| 03.45 – 04.00 | Challenge Time & Penutup | Pengembangan lanjutan |

Perhatikan kolom ketiga — itulah alasan penting kamu **jangan menghapus kode dari bagian sebelumnya**. Setiap bagian menumpuk (build on top of) apa yang sudah kamu buat.

---

## Bagian 1 — Pembukaan & Recap (15 menit)

Sebelum masuk ke materi inti, pastikan environment kamu sudah siap:

```bash
flutter doctor
```

Semua checklist idealnya bertanda centang (✅). Kalau ada yang bermasalah, selesaikan dulu sebelum lanjut — widget tidak akan bisa kamu lihat hasilnya kalau environment belum jalan.

Buat project baru untuk praktikum hari ini. Karena kita akan membangun Kartu Profil Digital, kita beri nama yang sesuai:

```bash
flutter create digital_profile_card
cd digital_profile_card
code .
```

> 💡 **Catatan:** Jalankan aplikasi ke Chrome (`flutter run -d chrome`) kalau emulator Android terasa berat di laptop kamu. Untuk belajar widget UI, target Chrome sudah cukup dan lebih cepat proses reload-nya.

---

## Bagian 2 — Konsep Widget & Widget Tree (30 menit)

### Apa itu Widget?

Di Flutter, **semuanya adalah widget**. Teks yang kamu lihat di layar, tombol, gambar, bahkan jarak kosong (padding) — semuanya adalah widget. Widget adalah blueprint (rancangan) yang mendeskripsikan bagaimana bagian UI tertentu seharusnya terlihat.

Bayangkan widget seperti **kotak LEGO**. Satu kotak LEGO kecil tidak terlihat seperti apa-apa, tapi kalau kamu menyusun banyak kotak LEGO bersama-sama, terbentuklah sebuah struktur — rumah, mobil, atau apapun. Flutter UI bekerja dengan cara yang sama: kamu menyusun widget kecil menjadi widget yang lebih besar dan kompleks.

### Apa itu Widget Tree?

Karena widget disusun di dalam widget lain, hasilnya membentuk struktur seperti **pohon (tree)** — ada widget induk (parent) dan widget anak (child).

Berikut adalah widget tree dari aplikasi Kartu Profil Digital yang akan kita bangun sepanjang praktikum ini — simpan gambaran ini di kepalamu, karena setiap bagian akan mengisi salah satu cabangnya:

```
MaterialApp
 └── Scaffold
      ├── AppBar
      │    └── Text("Kartu Profil Digital")
      └── body: Center
           └── Column
                ├── Container (foto profil)
                │    └── ClipOval / Image
                ├── Text (nama)
                ├── Text (bio/jurusan)
                ├── Row (info tambahan)
                │    ├── Icon
                │    └── Text
                └── ElevatedButton (tombol Like) ← akan jadi interaktif
```

> ⚠️ **Kenapa ini penting dipahami sejak awal?**
> Ketika terjadi error di Flutter, pesan error hampir selalu merujuk ke posisi di widget tree ("RenderFlex overflowed", "widget X expects a child"). Kalau kamu tidak paham konsep tree, membaca error akan terasa seperti membaca bahasa asing. Kalau kamu paham tree, error jadi jauh lebih mudah dilacak — tinggal telusuri dari akar ke cabang yang bermasalah. Diagram di atas juga akan jadi "peta" yang kita ikuti sampai akhir praktikum.

### Dua Kategori Besar Widget

Flutter membagi widget menjadi dua kategori besar berdasarkan fungsinya:

- **Structural/Layout widget** — mengatur posisi dan tata letak (`Scaffold`, `Container`, `Column`, `Row`)
- **Display widget** — menampilkan sesuatu ke layar (`Text`, `Image`, `Icon`)

Kamu akan bertemu kedua kategori ini di praktikum hari ini, dan langsung dipakai bersama dalam satu aplikasi.

**✅ Checkpoint 1:** Lihat kembali diagram widget tree Kartu Profil Digital di atas. Coba tebak, kira-kira bagian mana yang akan kita bangun duluan, dan bagian mana yang paling terakhir? (Petunjuk: lihat urutan di tabel rundown)

---

## Bagian 3 — `MaterialApp` & `Scaffold` (45 menit)

### `MaterialApp`: Akar dari Aplikasimu

`MaterialApp` adalah widget paling atas (root) yang membungkus seluruh aplikasi. Widget ini menyediakan hal-hal dasar seperti tema warna, navigasi antar halaman, dan mendukung desain **Material Design** dari Google.

Buka `lib/main.dart`, hapus semua isinya. Ini adalah **fondasi pertama** dari Kartu Profil Digital kita:

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Kartu Profil Digital',
      theme: ThemeData(
        colorSchemeSeed: Colors.teal,
        useMaterial3: true,
      ),
      home: const ProfilePage(),
    );
  }
}

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(); // sementara kosong, akan kita isi di bagian selanjutnya
  }
}
```

Jalankan dengan `flutter run`. Aplikasi akan tampil layar putih polos — itu wajar, karena `ProfilePage` masih kosong.

> 💡 **Industry Insight — `const` bukan sekadar formalitas**
> Perhatikan `const MyApp({super.key})` dan `const ProfilePage()`. Kata kunci `const` memberi tahu Flutter bahwa widget ini tidak akan berubah, sehingga Flutter **tidak perlu membangun ulang (rebuild)** widget tersebut setiap kali ada perubahan di layar. Di aplikasi kecil efeknya tidak terasa, tapi di aplikasi production dengan ratusan widget, kebiasaan menulis `const` sejak awal berdampak nyata pada performa aplikasi. Developer profesional selalu menambahkan `const` di setiap widget yang memungkinkan. **Ingat pola ini** — kamu akan terus menulisnya di setiap bagian berikutnya.

### `Scaffold`: Kerangka Halaman

`Scaffold` menyediakan struktur halaman standar ala Material Design: app bar di atas, body di tengah, floating action button, bottom navigation, dan lain-lain — tanpa kamu perlu membangunnya dari nol.

Sekarang, **ganti isi `ProfilePage`** (jangan sentuh `MyApp`, biarkan seperti tadi) menjadi:

```dart
class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Kartu Profil Digital'),
        centerTitle: true,
      ),
      body: const Center(
        child: Text('Konten profil akan kita isi di bagian selanjutnya'),
      ),
    );
  }
}
```

Lakukan hot reload (`r` di terminal, atau save file jika sudah pakai VS Code Flutter extension). Kamu akan melihat app bar berwarna dengan judul, dan teks placeholder di tengah layar.

**Progres saat ini:** kerangka aplikasi (root + app bar + body kosong) sudah berdiri. Jangan hapus apapun — kita akan isi `body` ini di bagian berikutnya.

**✅ Checkpoint 2:** Pastikan aplikasimu tampil dengan app bar bertuliskan "Kartu Profil Digital" dan teks placeholder di tengah layar, sebelum lanjut ke bagian berikutnya.

---

## ☕ Istirahat (10 menit)

---

## Bagian 4 — `Text` & `Icon` (40 menit)

Sekarang kita mulai mengisi `body` yang tadi masih placeholder, dengan konten asli: nama, bio, dan info tambahan pemilik kartu profil.

### `Text`: Menampilkan Tulisan

```dart
const Text(
  'Ayu Lestari',
  style: TextStyle(
    fontSize: 22,
    fontWeight: FontWeight.bold,
  ),
)
```

`style` menerima objek `TextStyle` yang mengatur ukuran, ketebalan, warna, jenis huruf, dan lain-lain.

> ⚠️ **Perhatian mahasiswa pemula:** `TextStyle` bukan widget, jadi tidak bisa "dipasang" langsung ke tree. Ia hanya properti konfigurasi milik `Text`.

### `Icon`: Menampilkan Ikon

```dart
const Icon(
  Icons.school,
  color: Colors.teal,
  size: 20,
)
```

Flutter sudah menyediakan ratusan ikon siap pakai lewat `Icons.namaIkon`. Kamu bisa jelajahi daftar lengkapnya di [Flutter Icons Catalog](https://fonts.google.com/icons?icon.set=Material+Icons).

### Praktik: Ganti Body Placeholder dengan Konten Asli

Sekarang, **ganti isi `body`** di `ProfilePage` (biarkan `appBar` tetap sama seperti bagian sebelumnya):

```dart
body: Center(
  child: Column(
    mainAxisAlignment: MainAxisAlignment.center,
    children: const [
      Text(
        'Ayu Lestari',
        style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
      ),
      SizedBox(height: 4),
      Text(
        'Mahasiswa Teknik Informatika',
        style: TextStyle(fontSize: 14, color: Colors.grey),
      ),
      SizedBox(height: 12),
      Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.school, size: 18, color: Colors.teal),
          SizedBox(width: 6),
          Text('Universitas Contoh, 2023'),
        ],
      ),
    ],
  ),
),
```

`Column` menyusun widget secara vertikal, `Row` menyusun secara horizontal, dan `SizedBox` memberi jarak antar widget — ini pola yang sangat umum dipakai daripada `margin` untuk jarak antar-elemen sejenis.

> 💡 **Industry Insight — Hindari "magic number" berulang**
> Kamu baru saja menulis `SizedBox(height: 4)` dan `SizedBox(height: 12)` di tempat berbeda. Di aplikasi production, developer biasanya membuat konstanta seperti `const double spacingSmall = 4.0;` dan `const double spacingMedium = 12.0;` di file terpisah, supaya jarak antar-elemen konsisten di seluruh aplikasi dan mudah diubah dari satu tempat saja.

**Progres saat ini:** Kartu Profil Digital sudah menampilkan nama, jurusan, dan info kampus. Selanjutnya kita akan menambahkan foto profil di atas nama, dan membungkus semuanya dalam kartu yang lebih rapi.

**✅ Checkpoint 3:** Pastikan nama, jurusan, dan baris ikon+teks kampus sudah tampil rapi tersusun vertikal di tengah layar, sebelum lanjut ke bagian berikutnya.

---

## Bagian 5 — `Image` & `Container` (40 menit)

### `Image`: Menampilkan Gambar

Ada 3 cara umum menampilkan gambar di Flutter:

```dart
// 1. Dari asset lokal (gambar disimpan di folder project)
Image.asset('assets/images/profile.png')

// 2. Dari internet
Image.network('https://i.pravatar.cc/300')

// 3. Dari file di device (misal hasil kamera/galeri)
Image.file(File('path/to/file.jpg'))
```

Untuk Kartu Profil Digital kita, kita akan pakai `Image.network` supaya lebih cepat dicoba tanpa perlu menyiapkan file asset.

> ⚠️ **Industry Insight — `Image.network` biasa, tapi berisiko di production**
> `Image.network` bawaan Flutter **tidak melakukan caching**. Artinya setiap kali widget di-rebuild atau halaman dibuka ulang, gambar akan diunduh ulang dari internet — boros kuota dan lambat. Selain itu, kalau koneksi gagal, aplikasi bisa menampilkan layar rusak tanpa fallback.
>
> Standar industri saat ini adalah menggunakan package [`cached_network_image`](https://pub.dev/packages/cached_network_image):
>
> ```dart
> CachedNetworkImage(
>   imageUrl: 'https://i.pravatar.cc/300',
>   imageBuilder: (context, imageProvider) => CircleAvatar(
>     radius: 50,
>     backgroundImage: imageProvider,
>   ),
>   placeholder: (context, url) => const CircularProgressIndicator(),
>   errorWidget: (context, url, error) => const Icon(Icons.error),
> )
> ```
>
> Dengan ini, gambar otomatis disimpan sementara di device (cache), loading indicator muncul otomatis saat proses unduh, dan ada widget pengganti kalau gambar gagal dimuat. Untuk praktikum hari ini kita cukup pakai `Image.network` dulu supaya fokus ke konsep, tapi ingat: di project nyata, `cached_network_image` adalah pilihan yang lebih tepat.

### Implementasi `cached_network_image` (Opsional — Praktik Standar Industri)

Kalau kamu ingin langsung membiasakan diri dengan cara yang dipakai di project sungguhan, ikuti langkah berikut. Bagian ini opsional — kamu boleh lanjut pakai `Image.network` biasa dan kembali ke sini kapan saja.

**Langkah 1 — Tambahkan package lewat terminal:**

```bash
flutter pub add cached_network_image
```

Perintah ini otomatis menambahkan entry ke `pubspec.yaml` dan menjalankan `flutter pub get`.

**Langkah 2 — Tambahkan import di `main.dart`:**

```dart
import 'package:cached_network_image/cached_network_image.dart';
```

**Langkah 3 — Ganti `Image.network` dengan `CachedNetworkImage`:**

```dart
ClipOval(
  child: CachedNetworkImage(
    imageUrl: 'https://i.pravatar.cc/300',
    width: 100,
    height: 100,
    fit: BoxFit.cover,
    placeholder: (context, url) => const SizedBox(
      width: 100,
      height: 100,
      child: Center(child: CircularProgressIndicator()),
    ),
    errorWidget: (context, url, error) => const Icon(
      Icons.person,
      size: 100,
      color: Colors.grey,
    ),
  ),
),
```

> ⚠️ **Perhatikan:** widget `CachedNetworkImage` (dan `Image.network`) **tidak boleh** ditaruh di dalam `children` yang diawali kata kunci `const`, karena keduanya butuh melakukan proses (network call, cache lookup) saat dibangun, bukan nilai tetap. Kalau daftar `children` di project kamu ditandai `const`, hapus kata `const` di depan daftar tersebut — widget lain yang murni statis (seperti `Text` atau `SizedBox`) tetap boleh ditandai `const` satu per satu.

### Menangani Masalah Koneksi Internet (Wajib Dibaca)

Baik memakai `Image.network` maupun `CachedNetworkImage`, keduanya sama-sama butuh koneksi internet. Ada dua masalah umum yang hampir pasti kamu temui — siapkan solusinya sebelum lanjut:

**1. Error `HTTP request failed` di Android Emulator / HP fisik**

Android mewajibkan aplikasi meminta izin eksplisit untuk akses internet. Buka `android/app/src/main/AndroidManifest.xml`, dan pastikan baris berikut ada **tepat di bawah tag `<manifest ...>`**, di luar tag `<application>`:

```xml
<uses-permission android:name="android.permission.INTERNET"/>
```

Kalau belum ada, tambahkan lalu lakukan **hot restart** (bukan hot reload — perubahan file manifest butuh restart penuh aplikasi).

**2. Error CORS saat menjalankan di Chrome (web)**

Sebagian URL gambar menolak permintaan yang datang dari browser karena kebijakan CORS milik server tersebut, walaupun URL itu bisa dibuka normal langsung di tab browser. Ini bukan kesalahan kode kamu — ini keterbatasan dari sisi server gambar yang dipakai.

Kalau kamu menjalankan aplikasi di Chrome dan mengalami ini, gunakan URL gambar yang lebih ramah CORS untuk latihan, misalnya:

```dart
'https://picsum.photos/300'
```

Atau, jalankan aplikasi ke Android Emulator sebagai alternatif, karena masalah CORS spesifik untuk target web.

> 💡 **Kebiasaan baik:** selalu sediakan `errorBuilder` (untuk `Image.network`) atau `errorWidget` (untuk `CachedNetworkImage`) seperti pada contoh kode di atas. Ini memastikan aplikasi tidak menampilkan layar rusak ketika gambar gagal dimuat karena sebab apapun — koneksi mati, CORS, atau server gambar sedang down.

### `Container`: Si Kotak Serbaguna

`Container` adalah salah satu widget paling sering dipakai untuk mengatur ukuran, warna latar, border, padding, dan margin sekaligus. Kita akan pakai `Container` untuk dua hal: membungkus foto profil jadi lingkaran, dan membungkus seluruh kartu supaya punya bayangan (shadow) dan sudut melengkung.

### Praktik: Tambahkan Foto Profil & Bungkus dengan Kartu

Sekarang, **ubah `body`** dari bagian sebelumnya — kita tambahkan foto profil di atas nama, dan bungkus seluruh `Column` dengan `Container` bergaya kartu:

```dart
body: Center(
  child: Container(
    width: 280,
    padding: const EdgeInsets.all(20),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.1),
          blurRadius: 12,
          offset: const Offset(0, 6),
        ),
      ],
    ),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        ClipOval(
          child: Image.network(
            'https://i.pravatar.cc/300',
            width: 100,
            height: 100,
            fit: BoxFit.cover,
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'Ayu Lestari',
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 4),
        const Text(
          'Mahasiswa Teknik Informatika',
          style: TextStyle(fontSize: 14, color: Colors.grey),
        ),
        const SizedBox(height: 12),
        const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.school, size: 18, color: Colors.teal),
            SizedBox(width: 6),
            Text('Universitas Contoh, 2023'),
          ],
        ),
      ],
    ),
  ),
),
```

Perhatikan: nama, jurusan, dan baris kampus dari Bagian 4 **tidak hilang** — kita hanya menambahkan `ClipOval` + `Image.network` di atasnya, dan membungkus semuanya dengan `Container` kartu.

> 💡 **Padding vs Margin — sering tertukar oleh pemula**
> `padding` = jarak dari tepi `Container` ke isinya (child). `margin` = jarak dari `Container` ke widget lain di sekitarnya. Bayangkan `Container` seperti bingkai foto: `padding` adalah jarak antara foto dan bingkai, `margin` adalah jarak antara bingkai dan dinding.

> ⚠️ **Industry Insight — `decoration` vs `color` tidak boleh dipakai bersamaan**
> Kalau kamu sudah memakai `decoration: BoxDecoration(color: ...)`, jangan tambahkan properti `color:` langsung di `Container` — Flutter akan melempar error karena keduanya saling bertabrakan. Gunakan salah satu saja. Itu sebabnya di kode di atas, warna putih kartu ditulis di dalam `BoxDecoration`, bukan sebagai `color:` milik `Container` secara langsung.

**Progres saat ini:** Kartu Profil Digital sekarang punya foto bulat, nama, jurusan, info kampus, semuanya terbungkus rapi dalam kartu dengan bayangan. Satu-satunya yang masih kurang: interaksi. Itu yang akan kita tambahkan di bagian terakhir.

**✅ Checkpoint 4:** Pastikan kartu profil sudah tampil dengan foto bulat di bagian atas, dibungkus `Container` yang punya bayangan dan sudut melengkung, sebelum lanjut ke bagian berikutnya.

---

## Bagian 6 — `StatelessWidget` vs `StatefulWidget` (45 menit)

Sampai sekarang, `ProfilePage` masih berupa `StatelessWidget` — tampilannya **tetap**, tidak berubah sendiri seiring interaksi pengguna.

Tapi kartu profil yang baik biasanya punya elemen interaktif, misalnya tombol "Like" atau "Follow" yang angkanya bertambah saat ditekan. Di sinilah kita butuh **state** — data yang bisa berubah sepanjang waktu hidup widget, dan setiap kali berubah, tampilan ikut diperbarui.

### `StatelessWidget`: Tidak Punya Memori

`ProfilePage` yang sudah kamu buat adalah contoh nyata `StatelessWidget`. Ia menerima/menyimpan data (nama, foto, dsb) tapi tidak bisa mengubah tampilannya sendiri dari dalam — semua nilainya tetap sama sejak pertama dibangun.

### `StatefulWidget`: Punya Memori yang Bisa Berubah

`StatefulWidget` sebenarnya terdiri dari **dua class**: class widget itu sendiri, dan class `State` yang menyimpan datanya.

Sekarang, **ubah `ProfilePage` dari `StatelessWidget` menjadi `StatefulWidget`**, supaya bisa punya tombol Like yang berfungsi. Ini adalah perubahan struktural terakhir sebelum aplikasi kita selesai:

```dart
class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  int _likeCount = 0;
  bool _isLiked = false;

  void _toggleLike() {
    setState(() {
      _isLiked = !_isLiked;
      _isLiked ? _likeCount++ : _likeCount--;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Kartu Profil Digital'),
        centerTitle: true,
      ),
      body: Center(
        child: Container(
          width: 280,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 12,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ClipOval(
                child: Image.network(
                  'https://i.pravatar.cc/300',
                  width: 100,
                  height: 100,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Ayu Lestari',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              const Text(
                'Mahasiswa Teknik Informatika',
                style: TextStyle(fontSize: 14, color: Colors.grey),
              ),
              const SizedBox(height: 12),
              const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.school, size: 18, color: Colors.teal),
                  SizedBox(width: 6),
                  Text('Universitas Contoh, 2023'),
                ],
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _toggleLike,
                icon: Icon(
                  _isLiked ? Icons.favorite : Icons.favorite_border,
                  color: _isLiked ? Colors.red : null,
                ),
                label: Text('$_likeCount Like'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

Perhatikan bahwa `MyApp` di bagian paling atas **tidak perlu diubah sama sekali** — ia tetap memanggil `ProfilePage()` seperti biasa, tidak peduli apakah `ProfilePage` itu `Stateless` atau `Stateful`. Ini menunjukkan salah satu kekuatan widget tree: perubahan internal satu widget tidak memaksa widget lain ikut berubah.

Jalankan aplikasi, lalu klik tombol Like berkali-kali. Perhatikan ikon hati berubah dari outline ke solid, dan angka bertambah/berkurang.

### Kenapa Harus `setState()`?

`setState()` adalah cara kita memberi tahu Flutter: *"Data di dalam State ini sudah berubah, tolong bangun ulang (rebuild) tampilan widget ini."* Tanpa memanggil `setState()`, nilai `_likeCount` memang berubah di memori, tapi **layar tidak akan diperbarui** karena Flutter tidak tahu ada perubahan yang perlu digambar ulang.

> ⚠️ **Kesalahan umum pemula**
> ```dart
> void _toggleLike() {
>   _isLiked = !_isLiked; // ❌ nilai berubah, tapi UI tidak ikut update
> }
> ```
> Ini adalah bug yang sangat sering terjadi — kode "jalan" tanpa error, tapi tampilan di layar tidak pernah berubah. Selalu bungkus perubahan state di dalam `setState(() { ... })`.

### Cara Memilih: Stateless atau Stateful?

| Pertanyaan | Jawaban |
|---|---|
| Apakah tampilan widget ini bisa berubah **tanpa** widget itu dibuat ulang dari luar? | Ya → `StatefulWidget` |
| Apakah widget hanya menampilkan data yang diberikan dari luar, tidak berubah sendiri? | Ya → `StatelessWidget` |

> 💡 **Industry Insight — Jangan taruh semua state di satu widget besar**
> Untuk aplikasi kecil seperti Kartu Profil Digital ini, `setState()` di dalam satu `StatefulWidget` sudah cukup. Tapi untuk aplikasi production dengan banyak halaman yang saling berbagi data (misalnya status login, isi keranjang belanja), developer profesional memisahkan pengelolaan state ke luar widget menggunakan package seperti [`provider`](https://pub.dev/packages/provider) dengan pola `ChangeNotifier`. Alasannya: `setState()` hanya efektif untuk state yang **lokal** pada satu widget — kalau banyak widget di halaman berbeda butuh data yang sama (misalnya jumlah Like ini juga perlu tampil di halaman lain), mengoper data manual lewat constructor akan membuat kode sulit dirawat ("prop drilling"). Kamu belum perlu memakai `provider` sekarang, tapi penting untuk tahu bahwa `setState()` adalah titik awal, bukan solusi akhir untuk semua kasus.

**🎉 Selesai!** Kartu Profil Digital kamu sekarang punya foto, nama, bio, dan tombol Like yang benar-benar berfungsi — satu aplikasi utuh yang dibangun sepotong demi sepotong dari Bagian 3 sampai Bagian 6.

**✅ Checkpoint 5:** Jalankan aplikasi dari awal (`flutter run`), pastikan seluruh tampilan (app bar, foto, nama, bio, info kampus, tombol Like) muncul dengan benar dan tombol Like berfungsi menambah/mengurangi angka serta mengubah ikon hati.

---

## Bagian 7 — Challenge Time (15 menit)

Aplikasi dasarmu sudah selesai dan berjalan. Sekarang saatnya kamu berkreasi mengembangkan Kartu Profil Digital ini lebih jauh. Pilih minimal satu challenge sesuai tingkat kepercayaan dirimu — semuanya dikerjakan di atas project yang sama, bukan project baru.

### ⭐ Level 1 — Tambah Informasi Kontak
Tambahkan 1-2 baris info tambahan di bawah info kampus, misalnya email atau nomor telepon, masing-masing dengan `Icon` yang sesuai (`Icons.email`, `Icons.phone`) disusun dalam `Row`, mengikuti pola yang sama seperti baris info kampus.

### ⭐⭐ Level 2 — Tombol Share & Counter Kedua
Tambahkan satu tombol lagi di sebelah tombol Like, misalnya tombol "Share" dengan `Icons.share`, yang punya counter sendiri (`_shareCount`) menggunakan `setState()` terpisah dari `_likeCount`. Susun kedua tombol berdampingan menggunakan `Row`.

### ⭐⭐⭐ Level 3 — Pisahkan Jadi Widget Sendiri
Kartu profil kita sekarang punya satu method `build()` yang cukup panjang. Pecah menjadi beberapa `StatelessWidget` kecil:
- `ProfileAvatar` — khusus menampilkan foto bulat
- `ProfileInfo` — khusus menampilkan nama, bio, dan baris info
- `LikeButton` — khusus tombol Like (tetap butuh akses ke `_toggleLike` dan `_isLiked` dari parent, coba cari tahu caranya lewat constructor parameter)

> 💡 **Industry Insight — Widget Extraction**
> Kalau method `build()` kamu mulai terasa panjang dan bertingkat-tingkat (banyak indentasi), itu tanda sudah waktunya memecah bagian tersebut menjadi widget class terpisah — persis seperti Level 3 di atas. Ini membuat kode lebih mudah dibaca, dites, dan dipakai ulang (reusable) — praktik yang selalu dilakukan di tim development profesional, bukan hanya soal "kode rapi" semata.

---

## Rangkuman

Hari ini kamu telah membangun **satu aplikasi utuh secara bertahap** — Kartu Profil Digital — sambil belajar:

- **Widget** adalah unit dasar pembangun UI Flutter, dan **widget tree** adalah struktur hierarkis dari widget-widget tersebut
- **`MaterialApp`** sebagai root aplikasi, **`Scaffold`** sebagai kerangka halaman (Bagian 3)
- **`Text`** dan **`Icon`** untuk menampilkan nama, bio, dan info (Bagian 4)
- **`Image`** dan **`Container`** untuk menampilkan foto profil dan membungkusnya jadi kartu (Bagian 5)
- **`StatelessWidget`** untuk tampilan tetap, **`StatefulWidget`** + `setState()` untuk tombol Like yang interaktif (Bagian 6)
- Praktik industri: penggunaan `const`, `cached_network_image` untuk gambar dari internet, dan widget extraction untuk kode yang mudah dirawat

## Referensi Lanjutan

- [Flutter Widget Catalog](https://docs.flutter.dev/ui/widgets)
- [Flutter Layout Basics](https://docs.flutter.dev/ui/layout)
- [Package `cached_network_image`](https://pub.dev/packages/cached_network_image)
- [Package `provider`](https://pub.dev/packages/provider)

---

**Selamat mencoba, dan jangan takut error!** Error di Flutter biasanya sangat informatif — baca pesannya baik-baik, telusuri widget tree yang disebutkan, dan kamu akan cepat terbiasa.
