# Praktikum Flutter
## UI & Layout: Row, Column, Stack, Expanded, Flexible, Padding, SizedBox, Card

**Durasi: 2 x 4 jam (2 kali pertemuan)**
**Studi kasus: Kartu Profil Digital**

---

## Tentang Praktikum Ini

Di praktikum sebelumnya kamu sudah berkenalan dengan Flutter: `MaterialApp`, `Scaffold`, `StatelessWidget`, `StatefulWidget`, serta widget dasar `Text`, `Image`, dan `Icon`. Widget-widget itu bisa **menampilkan** sesuatu di layar, tapi belum bisa diatur posisinya dengan rapi — kalau kamu tumpuk begitu saja, hasilnya akan berantakan atau menempel satu sama lain.

Di praktikum ini kamu akan belajar widget-widget yang tugasnya khusus untuk **mengatur layout**: menyusun secara horizontal/vertikal, menumpuk, memberi jarak, dan membagi ruang secara proporsional. Kita akan membangun studi kasus **Kartu Profil Digital** dari awal, langkah demi langkah, sampai jadi satu halaman utuh yang bisa di-run dan terlihat seperti aplikasi profesional — mirip halaman profil di Instagram atau LinkedIn.

### Tujuan Pembelajaran

Setelah menyelesaikan praktikum ini, kamu akan bisa:

1. Menyusun widget secara horizontal (`Row`) dan vertikal (`Column`) dengan alignment yang tepat
2. Menumpuk widget menggunakan `Stack` dan `Positioned`
3. Membagi ruang antar widget secara proporsional dengan `Expanded` dan `Flexible`
4. Mengatur jarak menggunakan `Padding` dan `SizedBox`
5. Membungkus konten dengan `Card` sesuai standar Material Design
6. Membaca dan memperbaiki error layout yang paling umum terjadi (overflow, dsb)
7. Menyelesaikan satu halaman UI utuh yang bisa langsung di-run dan terlihat seperti aplikasi nyata

### Prasyarat

- Flutter SDK & editor (VS Code/Android Studio) sudah terpasang dan bisa menjalankan project
- Kamu sudah paham konsep dasar `MaterialApp`, `Scaffold`, `StatelessWidget`/`StatefulWidget`, `Text`, `Image`, `Icon` dari praktikum sebelumnya (tidak akan dijelaskan detail di sini)

---

## Peta Praktikum

| Pertemuan | Fokus | Output |
|---|---|---|
| **Pertemuan 1 (4 jam)** | Setup project, recap singkat, Row, Column, Padding, SizedBox, Expanded, Flexible | Bagian info & statistik profil selesai |
| **Pertemuan 2 (4 jam)** | Stack, Card, penggabungan seluruh layout | Kartu Profil Digital versi final, siap dipamerkan |

---

# PERTEMUAN 1 — Setup, Fondasi Layout (4 Jam)

## Sesi 0 — Membuat Project dari Awal (30 menit)

### Langkah 1: Buat Project Baru

Buka terminal, lalu jalankan:

```bash
flutter create kartu_profil_digital
cd kartu_profil_digital
```

### Langkah 2: Jalankan Project Kosong

Pastikan project bisa jalan sebelum kamu mulai mengubah apapun:

```bash
flutter run
```

Pilih device (emulator Android atau Chrome). Kalau muncul aplikasi counter bawaan Flutter, artinya setup kamu sudah benar.

### Langkah 3: Bersihkan & Recap Widget Dasar

Buka `lib/main.dart`, hapus semua isinya, lalu ganti dengan kerangka berikut sebagai titik awal kita:

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
      theme: ThemeData(primarySwatch: Colors.indigo, useMaterial3: true),
      home: const ProfilePage(),
    );
  }
}

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Image.network('https://picsum.photos/seed/profile/300/300'),
            Text('Fakhry Ramadhan'),
            Icon(Icons.verified),
          ],
        ),
      ),
    );
  }
}
```

Sekilas mengingatkan kembali (sudah pernah dibahas, jadi hanya poin penting saja):

| Widget | Fungsi Singkat |
|---|---|
| `MaterialApp` | Bungkus utama aplikasi, menyediakan tema & navigasi |
| `Scaffold` | Kerangka halaman (body, app bar, dsb) |
| `StatelessWidget` / `StatefulWidget` | Widget tanpa/dengan state yang bisa berubah |
| `Text`, `Image`, `Icon` | Widget dasar untuk menampilkan teks, gambar, ikon |

Jalankan kode di atas. Kamu akan melihat foto, nama, dan ikon tertumpuk vertikal **tapi menempel semua tanpa jarak, dan tidak proporsional** — foto misalnya bisa terlalu besar. Ini masalah **layout**, bukan masalah widget dasarnya. Nah, kita akan perbaiki ini satu per satu sepanjang praktikum ini.

---

## Sesi 1.1 — Row & Column (55 menit)

### Konsep

Bayangkan `Row` dan `Column` seperti rak buku:

- **`Row`** menyusun widget **berdampingan ke samping** (sumbu horizontal)
- **`Column`** menyusun widget **bertumpuk ke atas** (sumbu vertikal)

Keduanya menerima parameter `children`, yaitu daftar widget yang mau disusun.

```dart
Row(
  children: [
    Icon(Icons.email),
    Text('kamu@email.com'),
  ],
)
```

### Mengatur Posisi: mainAxisAlignment & crossAxisAlignment

Setiap `Row`/`Column` punya dua sumbu:

- **Main axis**: arah utama (horizontal untuk `Row`, vertikal untuk `Column`)
- **Cross axis**: arah tegak lurusnya (vertikal untuk `Row`, horizontal untuk `Column`)

| Properti | Fungsi |
|---|---|
| `mainAxisAlignment` | Mengatur posisi di sepanjang sumbu utama (mis. `spaceBetween`, `center`, `start`) |
| `crossAxisAlignment` | Mengatur posisi di sumbu tegak lurus (mis. `center`, `start`, `stretch`) |

```dart
Row(
  mainAxisAlignment: MainAxisAlignment.spaceBetween,
  crossAxisAlignment: CrossAxisAlignment.center,
  children: [
    Icon(Icons.people),
    Text('1.204 Pengikut'),
  ],
)
```

> 💡 **Tips belajar**: kalau bingung hasil sebuah `mainAxisAlignment`, coba ganti satu per satu (`start` → `center` → `spaceBetween` → `spaceAround`) sambil hot reload. Cara paling cepat paham layout adalah dengan **melihat langsung efeknya**, bukan menghafal.

### 🏭 Insight Industri: Row/Column adalah 90% dari Layout Aplikasi Nyata

Kalau kamu buka source code aplikasi Flutter production manapun — dari e-commerce sampai aplikasi perbankan — kamu akan menemukan `Row` dan `Column` di mana-mana. Ini bukan widget "level pemula", ini **fondasi utama** yang dipakai developer senior setiap hari.

Satu hal yang perlu kamu waspadai sejak awal: **nested Row/Column yang terlalu dalam** membuat kode sulit dibaca — istilahnya *widget nesting hell*. Solusi standar industri: begitu satu bagian UI punya struktur sendiri (misalnya "baris statistik"), **ekstrak jadi widget terpisah**.

```dart
class StatItem extends StatelessWidget {
  final String value;
  final String label;

  const StatItem({super.key, required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        Text(label, style: const TextStyle(color: Colors.grey)),
      ],
    );
  }
}
```

Dengan begini, `build()` utama kamu tinggal memanggil `StatItem(value: '120', label: 'Post')` — jauh lebih mudah dibaca, dan widget ini bisa dipakai ulang di tempat lain.

### Menerapkan ke Kartu Profil Digital

Ubah bagian `Column` di `ProfilePage` agar avatar tidak selebar layar dan berikan susunan yang lebih rapi:

```dart
Column(
  children: [
    CircleAvatar(
      radius: 50,
      backgroundImage: NetworkImage('https://picsum.photos/seed/profile/300/300'),
    ),
    Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: const [
        Text('Fakhry Ramadhan'),
        Icon(Icons.verified, color: Colors.blue, size: 18),
      ],
    ),
  ],
)
```

Jalankan — avatar sekarang bulat dan berukuran wajar, nama & ikon verifikasi sejajar dalam satu baris.

---

## Sesi 1.2 — Padding & SizedBox (40 menit)

### Padding: Memberi Jarak dari Tepi

`Padding` membungkus satu widget dan memberi jarak (ruang kosong) di sekelilingnya.

```dart
Padding(
  padding: const EdgeInsets.all(16.0),
  child: Text('Fakhry Ramadhan'),
)
```

`EdgeInsets` punya beberapa variasi yang sering dipakai:

| Constructor | Kegunaan |
|---|---|
| `EdgeInsets.all(16)` | Jarak sama di keempat sisi |
| `EdgeInsets.symmetric(horizontal: 16, vertical: 8)` | Jarak berbeda untuk kiri-kanan dan atas-bawah |
| `EdgeInsets.only(left: 8, top: 16)` | Jarak spesifik hanya di sisi tertentu |

### SizedBox: Jarak Kosong atau Ukuran Tetap

`SizedBox` punya dua kegunaan utama:

1. Sebagai **pengganti margin/jarak** antar widget dalam `Row`/`Column`
2. Sebagai **pembatas ukuran** widget tertentu

```dart
Column(
  children: [
    Text('Fakhry Ramadhan'),
    SizedBox(height: 8), // jarak kosong 8 pixel
    Text('Mobile Developer'),
  ],
)
```

### 🏭 Insight Industri: SizedBox vs Container untuk Spacing

Banyak pemula memberi jarak dengan `Container(margin: ...)`. Di industri, kalau **tujuannya cuma memberi jarak kosong**, developer selalu memilih `SizedBox` daripada `Container` kosong, karena:

- `SizedBox` lebih ringan — tidak membawa properti `decoration`, `color`, dsb yang tidak dipakai
- Flutter bisa mengoptimalkan `SizedBox` dengan lebih baik saat proses render

```dart
// ✅ Standar industri
const SizedBox(height: 16)

// ❌ Boros, meski hasilnya sama
Container(height: 16)
```

### Menerapkan ke Kartu Profil Digital

Tambahkan `Padding` di sekeliling `Column` utama dan `SizedBox` sebagai jarak antar elemen:

```dart
Padding(
  padding: const EdgeInsets.symmetric(vertical: 24),
  child: Column(
    children: [
      CircleAvatar(
        radius: 50,
        backgroundImage: NetworkImage('https://picsum.photos/seed/profile/300/300'),
      ),
      const SizedBox(height: 12),
      Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: const [
          Text('Fakhry Ramadhan', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          SizedBox(width: 4),
          Icon(Icons.verified, color: Colors.blue, size: 18),
        ],
      ),
      const SizedBox(height: 4),
      Text('Dosen Mobile Programming', style: TextStyle(color: Colors.grey[600])),
    ],
  ),
)
```

Jalankan — tampilan sudah jauh lebih lega dan tidak menempel-nempel lagi.

### ✅ Checkpoint 1

Pastikan tampilanmu sekarang menunjukkan: avatar bulat, nama + ikon verifikasi sejajar, dan jabatan di bawahnya, dengan jarak yang nyaman dipandang.

---

## Sesi 1.3 — Expanded & Flexible (45 menit)

### Masalah yang Sering Muncul: Overflow

Coba bayangkan kamu punya `Row` berisi 3 `Text` yang isinya panjang. Kalau total lebar teks melebihi lebar layar, Flutter akan menampilkan **error garis kuning-hitam** di layar — ini disebut **RenderFlex overflow**. Ini adalah error paling umum yang akan kamu temui saat belajar layout.

Solusinya: beri tahu Flutter bagaimana caranya **membagi ruang yang tersedia**.

### Expanded

`Expanded` memaksa child-nya mengisi **semua ruang sisa** yang tersedia di dalam `Row`/`Column`.

```dart
Row(
  children: [
    Expanded(child: StatItem(value: '120', label: 'Post')),
    Expanded(child: StatItem(value: '1.204', label: 'Pengikut')),
    Expanded(child: StatItem(value: '89', label: 'Mengikuti')),
  ],
)
```

Ketiga `StatItem` di atas akan otomatis mendapat lebar yang **sama rata**, berapa pun ukuran layar device-nya. Ini kunci membuat UI **responsif**.

### Flexible

`Flexible` mirip `Expanded`, tapi child-nya **boleh lebih kecil** dari ruang yang dialokasikan (tidak dipaksa mengisi penuh). `Expanded` sebenarnya adalah `Flexible` dengan `fit: FlexFit.tight`.

| | `Expanded` | `Flexible` |
|---|---|---|
| Mengisi penuh ruang yang dialokasikan | Selalu | Hanya jika `fit: FlexFit.tight` |
| Ukuran child lebih kecil dari ruang | Tidak mungkin | Diperbolehkan |
| Kapan dipakai | Butuh distribusi ruang yang pasti (mis. 3 kolom sama rata) | Child punya ukuran natural yang ingin dipertahankan, tapi tetap dibatasi agar tidak overflow |

### Properti `flex`

Kalau kamu ingin proporsi tidak sama rata, gunakan `flex`:

```dart
Row(
  children: [
    Expanded(
      flex: 2,
      child: Container(
        height: 60,
        color: Colors.blue,
        alignment: Alignment.center,
        child: const Text('flex: 2', style: TextStyle(color: Colors.white)),
      ),
    ),
    Expanded(
      flex: 1,
      child: Container(
        height: 60,
        color: Colors.red,
        alignment: Alignment.center,
        child: const Text('flex: 1', style: TextStyle(color: Colors.white)),
      ),
    ),
  ],
)
```

> ⚠️ **Catatan penting**: `Container` tanpa `child` dan tanpa `height` akan otomatis punya tinggi **0**, jadi warnanya tidak akan terlihat sama sekali meskipun lebarnya sudah terbagi dengan benar. Selalu beri `height` (atau isi dengan `child`) supaya efek `flex` bisa benar-benar kamu lihat, seperti contoh di atas.

Kalau kode di atas kamu jalankan, hasilnya kurang lebih seperti ini — kotak biru mengambil 2 bagian ruang, kotak merah mengambil 1 bagian:

![Ilustrasi proporsi flex 2 banding 1](flex-demo.png)

### 🏭 Insight Industri: Spacer

Kalau kamu cuma butuh "mendorong" widget ke ujung tanpa membungkus widget apapun, gunakan `Spacer` — ini shortcut untuk `Expanded(child: SizedBox())`.

```dart
Row(
  children: [
    Text('Fakhry Ramadhan'),
    Spacer(), // mendorong icon ke kanan
    Icon(Icons.verified, color: Colors.blue),
  ],
)
```

Pola ini sangat umum dipakai untuk header, list item dengan trailing icon, dan action bar.

### ✅ Checkpoint 2 — Studi Kasus: Baris Statistik Profil

Buat file baru `stat_item.dart` (widget yang sudah kita bahas di Sesi 1.1):

```dart
import 'package:flutter/material.dart';

class StatItem extends StatelessWidget {
  final String value;
  final String label;

  const StatItem({super.key, required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          value,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(color: Colors.grey, fontSize: 13)),
      ],
    );
  }
}
```

Jangan lupa import di `main.dart`:

```dart
import 'stat_item.dart';
```

Lalu tambahkan baris statistik tepat di bawah bagian nama & jabatan:

```dart
Padding(
  padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
  child: Row(
    children: const [
      Expanded(child: StatItem(value: '120', label: 'Post')),
      Expanded(child: StatItem(value: '1.204', label: 'Pengikut')),
      Expanded(child: StatItem(value: '89', label: 'Mengikuti')),
    ],
  ),
)
```

**Jalankan aplikasinya.** Kamu harus melihat 3 kolom statistik yang sama lebar, tersusun rapi di bawah info profil. Coba ubah ukuran window/emulator — perhatikan bagaimana ketiganya tetap proporsional.

---

## Rangkuman Pertemuan 1

- `Row` & `Column` menyusun widget secara horizontal/vertikal
- `mainAxisAlignment` & `crossAxisAlignment` mengatur posisi di masing-masing sumbu
- `Padding` & `SizedBox` mengatur jarak — pilih `SizedBox` untuk spacing kosong
- `Expanded` & `Flexible` membagi ruang secara proporsional dan mencegah overflow
- Pecah UI kompleks menjadi widget-widget kecil bernama jelas

**Sebelum pertemuan berikutnya:** pastikan project kamu sudah menampilkan avatar, nama, jabatan, dan baris statistik tanpa error.

---

# PERTEMUAN 2 — Stack, Card, dan Penggabungan Akhir (4 Jam)

## Sesi 2.1 — Stack & Positioned (60 menit)

### Konsep

`Row` dan `Column` menyusun widget **berurutan**. `Stack` berbeda — dia **menumpuk** widget satu di atas widget lainnya, seperti lapisan kertas transparan.

```dart
Stack(
  children: [
    Container(height: 150, color: Colors.blue), // lapisan bawah
    Positioned(
      bottom: -40,
      left: 16,
      child: CircleAvatar(radius: 40), // lapisan atas
    ),
  ],
)
```

### Positioned

Widget di dalam `Stack` bisa dibungkus `Positioned` untuk menentukan posisinya secara presisi (`top`, `bottom`, `left`, `right`). Widget yang **tidak** dibungkus `Positioned` akan mengikuti properti `alignment` milik `Stack` (default: kiri-atas).

### 🏭 Insight Industri: Kegunaan Stack di Aplikasi Nyata

`Stack` sering dianggap widget "lanjutan", padahal dipakai hampir di setiap aplikasi populer untuk pola-pola berikut:

1. **Cover photo + avatar melayang** — pola profil ala Instagram/LinkedIn (yang akan kita buat sekarang)
2. **Badge notifikasi** di atas icon:

```dart
Stack(
  clipBehavior: Clip.none,
  children: [
    Icon(Icons.notifications, size: 28),
    Positioned(
      right: -2,
      top: -2,
      child: Container(
        padding: const EdgeInsets.all(4),
        decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
        child: const Text('3', style: TextStyle(color: Colors.white, fontSize: 10)),
      ),
    ),
  ],
)
```

3. **Overlay loading/error di atas gambar** yang sedang dimuat dari network

### ✅ Checkpoint 3 — Mengganti Layout Header dengan Cover Photo + Avatar Melayang

Sekarang kita ganti bagian atas Kartu Profil Digital — dari sekadar avatar polos, menjadi cover photo dengan avatar melayang di atasnya:

```dart
Stack(
  clipBehavior: Clip.none,
  alignment: Alignment.topCenter,
  children: [
    // Lapisan 1: cover photo
    Container(
      height: 140,
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.deepPurple, Colors.indigo],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
    ),
    // Lapisan 2: avatar, sengaja "melayang" turun ke bawah cover
    Positioned(
      top: 100,
      child: CircleAvatar(
        radius: 45,
        backgroundColor: Colors.white,
        child: CircleAvatar(
          radius: 42,
          backgroundImage: NetworkImage('https://picsum.photos/seed/profile/300/300'),
        ),
      ),
    ),
  ],
)
```

Jalankan — kamu akan melihat foto avatar bulat "menembus" bagian bawah cover photo. Efek ini butuh `Stack`, tidak bisa dibuat dengan `Row`/`Column` biasa.

---

## Sesi 2.2 — Card (45 menit)

### Konsep

`Card` adalah "`Container` yang sudah didandani" mengikuti standar **Material Design**: otomatis punya sudut membulat, bayangan (shadow), dan elevasi.

```dart
Card(
  elevation: 2,
  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
  child: Padding(
    padding: const EdgeInsets.all(16),
    child: Text('Mobile Developer di Jember'),
  ),
)
```

| Properti | Fungsi |
|---|---|
| `elevation` | Seberapa "terangkat" bayangannya — semakin tinggi, semakin terlihat depth |
| `shape` | Bentuk & radius sudut |
| `margin` | Jarak Card terhadap widget lain di sekitarnya |
| `color` | Warna latar Card |

### 🏭 Insight Industri: Kenapa Card, Bukan Container Manual?

Kamu **bisa** membuat efek serupa dengan `Container` + `BoxDecoration(boxShadow: [...])`, tapi developer profesional memilih `Card` untuk elemen yang butuh kesan "terangkat" karena:

- Otomatis konsisten dengan **Material Design guideline** — elevation, warna shadow, dan animasinya sudah sesuai standar tanpa perlu diracik manual
- Kalau app-nya nanti pakai **Dark Mode**, `Card` otomatis menyesuaikan warna dari `Theme`, sedangkan `Container` manual harus diatur sendiri
- Lebih sedikit kode, lebih mudah dibaca oleh developer lain di tim

```dart
// ✅ Standar industri — konsisten dengan tema, minim kode
Card(child: content)

// ❌ Manual — harus urus shadow, warna, radius sendiri, dan tidak otomatis ikut tema
Container(
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(12),
    boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 4)],
  ),
  child: content,
)
```

> Aturan praktis: gunakan `Card` kalau elemen itu perlu terlihat sebagai "permukaan" terpisah (bio, item list, tombol aksi). Gunakan `Container` polos kalau kamu hanya butuh warna latar/padding tanpa efek depth.

---

## Sesi 2.3 — Studi Kasus Utuh: Menyelesaikan Kartu Profil Digital (90 menit)

Sekarang saatnya menggabungkan **semua** yang sudah kamu pelajari — dari praktikum sebelumnya (Container, Text, Image, Icon) sampai hari ini (Row, Column, Padding, SizedBox, Expanded, Stack, Card) — menjadi satu halaman utuh.

### Struktur Akhir yang Akan Kamu Bangun

```
Scaffold
 └─ SingleChildScrollView
     └─ Column
         ├─ Stack (cover photo + avatar melayang)
         ├─ SizedBox (jarak untuk avatar yang menjorok ke bawah)
         ├─ Text nama & jabatan
         ├─ Padding + Row (statistik: Post / Pengikut / Mengikuti, masing-masing Expanded)
         ├─ Card (bio singkat)
         └─ Row (tombol "Follow" & "Message", masing-masing Expanded)
```

### Kode Lengkap `main.dart`

```dart
import 'package:flutter/material.dart';
import 'stat_item.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Kartu Profil Digital',
      theme: ThemeData(primarySwatch: Colors.indigo, useMaterial3: true),
      home: const ProfilePage(),
    );
  }
}

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  bool isFollowing = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // ===== BAGIAN 1: Cover + Avatar (Stack) =====
              Stack(
                clipBehavior: Clip.none,
                alignment: Alignment.topCenter,
                children: [
                  Container(
                    height: 140,
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Colors.deepPurple, Colors.indigo],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                    ),
                  ),
                  Positioned(
                    top: 100,
                    child: CircleAvatar(
                      radius: 45,
                      backgroundColor: Colors.white,
                      child: const CircleAvatar(
                        radius: 42,
                        backgroundImage: NetworkImage('https://picsum.photos/seed/profile/300/300'),
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 55), // jarak untuk avatar yang menjorok

              // ===== BAGIAN 2: Nama & Jabatan =====
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Text('Fakhry Ramadhan', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  SizedBox(width: 4),
                  Icon(Icons.verified, color: Colors.blue, size: 18),
                ],
              ),
              const SizedBox(height: 4),
              Text(
                'Dosen Mobile Programming',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey[600]),
              ),

              // ===== BAGIAN 3: Statistik (Row + Expanded) =====
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24),
                child: Row(
                  children: const [
                    Expanded(child: StatItem(value: '120', label: 'Post')),
                    Expanded(child: StatItem(value: '1.204', label: 'Pengikut')),
                    Expanded(child: StatItem(value: '89', label: 'Mengikuti')),
                  ],
                ),
              ),

              // ===== BAGIAN 4: Card Bio =====
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Card(
                  elevation: 1,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: const Padding(
                    padding: EdgeInsets.all(16),
                    child: Row(
                      children: [
                        Icon(Icons.info_outline, color: Colors.indigo),
                        SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'Mengajar mobile programming, fokus pada Flutter & Dart untuk mahasiswa pemula.',
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 12),

              // ===== BAGIAN 5: Tombol Aksi (Row + Expanded) =====
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () => setState(() => isFollowing = !isFollowing),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: isFollowing ? Colors.grey[300] : Colors.indigo,
                          foregroundColor: isFollowing ? Colors.black87 : Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        child: Text(isFollowing ? 'Following' : 'Follow'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {},
                        style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 12)),
                        child: const Text('Message'),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
```

Pastikan `stat_item.dart` dari Pertemuan 1 masih ada di folder `lib/`.

### Gambaran Hasil Akhir

Berikut kira-kira tampilan yang akan kamu dapatkan setelah seluruh kode di atas berjalan dengan benar:

![Tampilan akhir Kartu Profil Digital](hasil-akhir-kartu-profil.png)

### Langkah Menjalankan

1. Pastikan `lib/main.dart` sudah sesuai kode di atas, dan `lib/stat_item.dart` sudah ada
2. Pastikan koneksi internet aktif (avatar & cover diambil/di-generate dengan network image)
3. Jalankan dengan `flutter run` atau tombol run di VS Code
4. **Yang harus kamu lihat**: cover ungu-gradasi di bagian atas, avatar bulat melayang di tengahnya, nama & ikon verifikasi + jabatan di bawahnya, tiga kolom statistik sama lebar, satu Card bio, dan dua tombol aksi berdampingan
5. Coba tekan tombol **Follow** — warnanya harus berubah dan teksnya jadi "Following" (ini menguji pemahamanmu tentang `StatefulWidget` dari praktikum sebelumnya, digabung dengan layout hari ini)

### 🔧 Troubleshooting Umum

| Gejala | Penyebab | Solusi |
|---|---|---|
| Garis kuning-hitam di layar (overflow) | `Row`/`Column` isinya melebihi ruang tersedia | Bungkus child yang bermasalah dengan `Expanded` atau `Flexible` |
| `Positioned` error "harus di dalam Stack" | `Positioned` dipakai di luar `Stack` | Pastikan `Positioned` langsung menjadi children dari `Stack` |
| Avatar terpotong di bagian atas Stack | `clipBehavior` masih default (`Clip.hardEdge`) | Tambahkan `clipBehavior: Clip.none` pada `Stack` |
| Card terlihat tanpa bayangan sama sekali | Tidak ada masalah — itu bisa jadi tema `useMaterial3` yang shadow-nya lebih halus | Naikkan nilai `elevation` untuk mengetes, mis. `elevation: 6` |
| Semua konten menempel di bagian atas layar | Lupa membungkus body dengan `SafeArea` | Tambahkan `SafeArea` sebagai child pertama dari `Scaffold.body` |

---

## Sesi 2.4 — Insight Tambahan: Kebiasaan Layout ala Developer Senior (30 menit)

1. **Gunakan `const` sebanyak mungkin.** Setiap `SizedBox`, `EdgeInsets`, `Text` yang isinya tidak berubah, tambahkan `const` di depannya. Ini bukan sekadar gaya penulisan — Flutter akan **melewati proses rebuild** untuk widget `const` yang tidak berubah, sehingga aplikasi lebih hemat kinerja terutama saat layout kompleks di-`setState()` berulang kali.

2. **Pecah widget begitu terasa "terlalu dalam".** Kalau kamu sudah nested `Row > Column > Padding > Row` sampai 4-5 tingkat, itu tanda sudah waktunya diekstrak jadi widget class terpisah (seperti `StatItem` di atas). Ini standar yang dipegang tim-tim profesional untuk menjaga kode tetap mudah dibaca dan diuji.

3. **Layout Flutter itu deklaratif, bukan hitung-hitungan pixel manual.** Developer baru sering mencoba menghitung posisi pixel secara manual. Di industri, layout dibangun dengan **komposisi widget** (Row di dalam Column di dalam Expanded, dst) — Flutter yang menghitung posisi akhirnya. Percayakan itu pada sistem layout, jangan dilawan dengan angka pixel hardcode.

4. **Sekilas ke depan: `LayoutBuilder` & `MediaQuery`.** Layout hari ini sudah cukup responsif karena `Expanded`/`Flexible` otomatis menyesuaikan lebar layar. Tapi untuk kasus yang lebih kompleks (misalnya tampilan berbeda total antara HP dan tablet), nanti kamu akan berkenalan dengan `LayoutBuilder` dan `MediaQuery` — keduanya memungkinkan kode membaca ukuran layar dan mengambil keputusan layout secara dinamis.

---

## 🎯 Challenge — Uji Kemampuanmu!

Setelah Kartu Profil Digital versi final berhasil kamu jalankan, coba tantangan berikut sesuai levelmu:

### ⭐ Level Pemula
- Ganti warna gradient cover dan warna tombol "Follow" sesuai selera
- Tambahkan satu baris info tambahan di dalam Card bio (misalnya lokasi, dengan `Icon(Icons.location_on)`)
- Ubah `mainAxisAlignment` statistik menjadi `spaceAround`, amati bedanya dengan `spaceBetween`

### ⭐⭐ Level Menengah
- Tambahkan badge kecil "🟢 Online" di sudut kanan-bawah avatar menggunakan `Stack` + `Positioned` (mirip contoh badge notifikasi di Sesi 2.1)
- Buat Card baru berisi 3 baris info kontak (email, telepon, lokasi), masing-masing baris berupa `Row` dengan `Icon` + `Expanded(Text(...))`
- Ubah proporsi tombol "Follow" dan "Message" agar tidak 50:50, misalnya 60:40, menggunakan `flex` pada `Expanded`

### ⭐⭐⭐ Level Lanjutan
- Buat halaman kedua "Edit Profil" (gunakan `Navigator.push`) dengan layout form: `Column` berisi beberapa `TextField`, dipisahkan `SizedBox`, dan dikelompokkan dalam beberapa `Card` per section (Info Dasar, Kontak, Bio)
- Tambahkan tombol "Edit Profil" di halaman utama yang menavigasi ke halaman tersebut
- Pastikan tidak ada satupun `RenderFlex overflow` di kedua halaman, pada berbagai ukuran layar (coba resize emulator atau device preview)

---

## Rangkuman Pertemuan 2

- `Stack` + `Positioned` untuk menumpuk widget (cover-avatar, badge, overlay)
- `Card` membungkus konten sesuai standar Material Design — pilih ini daripada `Container` manual untuk elemen yang butuh depth
- Layout kompleks dibangun dengan **mengomposisikan** widget-widget layout dasar, bukan menghitung pixel manual
- `const` pada widget statis membantu performa, bukan sekadar gaya penulisan
- Project akhir kamu sudah berupa halaman profil utuh, responsif, dan siap dikembangkan lebih jauh

---

## Referensi Lanjutan

- [Layout widgets — docs.flutter.dev](https://docs.flutter.dev/ui/widgets/layout)
- [Understanding constraints — docs.flutter.dev](https://docs.flutter.dev/ui/layout/constraints)
- [Material Design — Card](https://api.flutter.dev/flutter/material/Card-class.html)

Selamat, Kartu Profil Digital-mu sekarang sudah punya tampilan layaknya aplikasi profil di aplikasi populer sungguhan. Simpan project ini baik-baik — struktur widget yang sudah kamu pelajari (Stack, Row/Column dengan Expanded, Card) akan terus dipakai di hampir semua fitur Flutter yang akan kamu bangun ke depannya.
