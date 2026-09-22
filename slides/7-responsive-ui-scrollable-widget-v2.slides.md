---
theme: default
title: "Modul 5 — Responsive UI & Scrollable Widget"
info: |
  Praktikum Mobile Programming · Flutter & Dart
  2 × 4 jam · Lanjutan dari Modul 4
author: "Fakhry Firdaus"
class: text-center
---

# Responsive UI
# & Scrollable Widget

### Praktikum Mobile Programming · Flutter & Dart

**Modul 5 · 2 × 4 jam**

Lanjutan dari **UI & Layout**

<!--
Gunakan slide ini sebagai pembuka. Sampaikan bahwa target modul bukan sekadar menghafal widget,
tetapi memahami bagaimana Flutter mengambil keputusan layout pada ukuran layar yang berbeda.
-->

---

# 🎯 Tujuan Pembelajaran

Setelah praktikum, mahasiswa mampu:

- menjelaskan **overflow** dan aturan **constraints** Flutter
- menggunakan `SafeArea`
- membaca kondisi layar dengan `MediaQuery`
- membuat komponen adaptif dengan `LayoutBuilder`
- memilih `SingleChildScrollView`, `ListView`, dan `GridView`
- menggabungkan konten dengan `CustomScrollView` + Sliver
- membuat layout yang baik di **HP, landscape, dan tablet**

<!--
Tekankan bahwa modul bergerak dari masalah → konsep → solusi → pola produksi.
-->

---

# 📦 Apa yang Akan Kita Bangun?

Dari **Kartu Profil Digital** pada Modul 4 menjadi:

- 👤 Profil
- 📊 Statistik
- 🏷️ Skill
- 📁 Daftar proyek
- 🖼️ Galeri foto
- ✉️ Form kontak

Dan tampilannya akan beradaptasi:

**HP portrait → landscape → tablet / layar lebar**

---

# 🗺️ Roadmap Praktikum

### Pertemuan 1

1. Persiapan
2. Kenapa UI harus responsif?
3. `SafeArea`
4. `MediaQuery`
5. `LayoutBuilder`
6. `SingleChildScrollView`

### Pertemuan 2

7. `ListView`
8. `GridView`
9. `CustomScrollView` + Sliver
10. Layout dua panel
11. Testing & challenge

---

# ⏱️ Alokasi Waktu

| Bagian | Pertemuan 1 | Pertemuan 2 |
|---|---:|---:|
| Konsep & eksperimen | 75 mnt | 70 mnt |
| Implementasi | 145 mnt | 125 mnt |
| Istirahat | 15 mnt | 15 mnt |
| Checkpoint + challenge | 40 mnt | 35 mnt |

> **Prinsip kelas:** tebak → jalankan → amati → jelaskan → perbaiki

---

# 🧰 Prasyarat

Sebelum mulai:

- Flutter SDK **3.27+**
- memahami:
  - `Row`
  - `Column`
  - `Stack`
  - `Expanded`
  - `Padding`
  - `SizedBox`
  - `Card`
- Emulator Android siap
- Chrome siap

---

# 🏷️ Cara Membaca Modul

| Simbol | Makna |
|---|---|
| 🧪 | Eksperimen — tebak dulu |
| 💡 | Praktik industri |
| ⚠️ | Kesalahan yang sering terjadi |
| ✅ | Checkpoint |
| ⭐ | Challenge mudah |
| ⭐⭐ | Challenge sedang |
| ⭐⭐⭐ | Challenge sulit |

> Flutter menggunakan **dp / logical pixels**, bukan pixel fisik.

<!--
Ajak mahasiswa tidak langsung menyalin kode. Eksperimen adalah bagian penting dari pembelajaran.
-->

---

# 📅 PERTEMUAN 1

## Dari UI statis → UI responsif

Kita mulai dari project sederhana,
lalu sengaja membuat masalah layout.

---

# 01 · Persiapan

## Buat project

```bash
flutter create profil_digital
cd profil_digital
```

Jalankan:

```bash
flutter run
```

Target awal:

> **Profil Digital sederhana yang berjalan di portrait.**

---

# 🗂️ Struktur Project

```text
lib/
├── main.dart
├── core/
│   └── breakpoints.dart
├── data/
│   └── dummy_data.dart
├── pages/
│   └── profile_page.dart
└── widgets/
    ├── profile_header.dart
    ├── stats_row.dart
    └── skill_chips.dart
```

💡 **Praktik industri**

> Satu widget = satu file

Lebih mudah dibaca, dites, dan dikerjakan bersama tim.

---

# 🧱 Titik Awal: `ProfilePage`

```dart
return Scaffold(
  appBar: AppBar(
    title: const Text('Profil Digital'),
  ),
  body: const Padding(
    padding: EdgeInsets.all(16),
    child: Column(
      children: [
        ProfileHeader(),
        SizedBox(height: 16),
        StatsRow(),
        SizedBox(height: 16),
        SkillChips(),
      ],
    ),
  ),
);
```

Saat ini **belum ada scrolling**.

<!--
Jalankan aplikasi sebelum melanjutkan. Pastikan semua mahasiswa memiliki titik awal yang sama.
-->

---

# 02 · Kenapa UI Harus Responsif?

Ukuran layar tidak selalu sama:

- 📱 HP kecil
- 📱 HP besar
- 🔄 Landscape
- 📱 Foldable
- 📟 Tablet
- 🌐 Browser yang bisa di-resize

❌ Jangan berasumsi:

```text
width = 400
height = 800
```

---

# 🧪 Eksperimen 1 — Bikin Overflow

1. Jalankan aplikasi.
2. Rotasi emulator ke **landscape**.
3. Atau kecilkan tinggi Chrome.
4. Amati bagian bawah layar.

Apa yang muncul?

```text
BOTTOM OVERFLOWED BY ... PIXELS
```

🗣️ **Tebak dulu penyebabnya sebelum melihat slide berikutnya.**

---

# 💥 Kenapa Overflow Terjadi?

`Column` tidak otomatis melakukan scrolling.

Jika:

```text
tinggi konten > tinggi layar
```

maka:

```text
┌───────────────┐
│    konten     │
│    konten     │
│    konten     │
│    konten     │
│───────────────│
│  OVERFLOW ❌  │
└───────────────┘
```

Flutter membutuhkan solusi layout yang sesuai.

---

# 🧠 Aturan Layout Flutter

> **Constraints go down.**
>
> **Sizes go up.**
>
> **Parent sets position.**

```text
Parent
  │
  │ constraints
  ▼
Child
  │
  │ size
  ▼
Parent
  │
  │ position
  ▼
Child
```

Ini adalah salah satu konsep terpenting di Flutter.

---

# 🔧 Tiga Strategi Responsif

### 1. Menyesuaikan

```text
Expanded
Flexible
Wrap
```

### 2. Scroll

```text
SingleChildScrollView
ListView
GridView
CustomScrollView
```

### 3. Mengganti layout

```text
HP
  ↓
1 kolom

Tablet
  ↓
2 panel
```

Modul ini fokus pada **scroll + adaptive layout**.

---

# 🧭 Peta Widget Modul

| Kebutuhan | Tool |
|---|---|
| Area sistem / notch | `SafeArea` |
| Kondisi layar | `MediaQuery` |
| Ruang widget | `LayoutBuilder` |
| Konten pendek | `SingleChildScrollView` |
| List panjang | `ListView.builder` |
| Grid | `GridView.builder` |
| Halaman campuran | `CustomScrollView` + Sliver |

---

# 03 · SafeArea

## Masalah yang diselesaikan

Konten dapat bertabrakan dengan:

- status bar
- notch
- gesture bar
- sudut layar

`SafeArea` menambahkan inset secara otomatis.

---

# 🧪 Eksperimen 2 — Tanpa SafeArea

Pada `profile_page.dart`:

1. Hapus sementara `AppBar`.
2. Jalankan di **emulator Android**.
3. Perhatikan posisi foto profil.

**Pertanyaan:**

> Apakah konten bisa terlalu dekat atau tertutup system UI?

---

# 🛡️ Solusi: `SafeArea`

```dart
return Scaffold(
  body: SafeArea(
    child: Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          ProfileHeader(),
          SizedBox(height: 16),
          StatsRow(),
          SizedBox(height: 16),
          SkillChips(),
        ],
      ),
    ),
  ),
);
```

Setelah eksperimen, kembalikan `AppBar`.

---

# 📌 Kapan Memakai SafeArea?

| Situasi | SafeArea |
|---|---|
| `Scaffold` + `AppBar` | Bagian atas sudah ditangani |
| Login / onboarding tanpa AppBar | ✅ |
| Bottom bar custom | ✅ |
| Landscape + notch | ✅ |

Anda juga bisa mengatur sisi:

```dart
SafeArea(
  top: false,
  bottom: true,
  minimum: const EdgeInsets.all(8),
  child: ...,
)
```

---

# ⚠️ SafeArea + Scroll

Untuk halaman yang scroll:

❌ Jangan asal:

```text
SafeArea
└── ScrollView
```

Perhatikan kebutuhan inset.

Pola yang digunakan dalam modul:

```text
ScrollView
└── SafeArea
    └── Content
```

Tujuannya agar area scroll tetap dapat digunakan dengan baik.

---

# 04 · MediaQuery

`MediaQuery` memberi informasi tentang:

- ukuran layar
- orientasi
- system padding
- keyboard
- text scaling
- brightness

Contoh:

```dart
final size = MediaQuery.sizeOf(context);
final width = size.width;
```

---

# 🧩 API MediaQuery yang Penting

| API | Untuk |
|---|---|
| `sizeOf` | ukuran layar |
| `orientationOf` | portrait / landscape |
| `paddingOf` | area aman |
| `viewInsetsOf` | keyboard |
| `textScalerOf` | skala font |
| `platformBrightnessOf` | light / dark |

💡 Gunakan API yang spesifik ketika memungkinkan.

---

# 💡 Praktik Industri

Lebih spesifik:

```dart
MediaQuery.sizeOf(context)
```

daripada:

```dart
MediaQuery.of(context).size
```

Kenapa?

API spesifik memungkinkan widget hanya bereaksi terhadap bagian `MediaQuery` yang relevan.

---

# 🔍 Buat `ScreenInfo`

Widget sementara untuk melihat data layar:

```dart
final size = MediaQuery.sizeOf(context);
final orientation =
    MediaQuery.orientationOf(context);
final padding =
    MediaQuery.paddingOf(context);

return Text(
  '${size.width} × ${size.height} dp\n'
  '${orientation.name}\n'
  'top: ${padding.top}\n'
  'bottom: ${padding.bottom}',
);
```

Tambahkan ke halaman.

---

# 🧪 Eksperimen 3

Amati `ScreenInfo` ketika:

1. rotate emulator
2. resize Chrome
3. ubah font size Android

Perhatikan:

```text
width
height
orientation
padding
text scale
```

### Pertanyaan

> Jika font diperbesar lalu layout overflow, apakah itu bug emulator?

**Bukan. Itu masalah layout aplikasi.**

---

# 📐 Responsif dengan Ukuran Proporsional

Misalnya avatar:

```dart
final width =
    MediaQuery.sizeOf(context).width;

final radius =
    (width * 0.12)
      .clamp(40.0, 72.0)
      .toDouble();
```

Kemudian:

```dart
CircleAvatar(
  radius: radius,
  backgroundImage: const NetworkImage(
    'https://picsum.photos/seed/profile/300/300',
  ),
)
```

---

# 💡 Kenapa `clamp()`?

Tanpa batas:

```text
radius = width × 12%
```

bisa menjadi:

```text
HP kecil  → terlalu kecil
Tablet    → terlalu besar
```

Dengan:

```dart
.clamp(40.0, 72.0)
```

ukuran tetap dalam rentang yang masuk akal.

---

# ⚠️ Hindari Ini

Jangan membaca `MediaQuery` di:

```dart
initState()
```

Lebih tepat membaca informasi yang bergantung pada `context` di:

```dart
build()
```

atau lifecycle yang memang menerima perubahan dependency.

---

# 05 · LayoutBuilder

Dua pertanyaan berbeda:

```text
MediaQuery
↓
"Seberapa besar layar?"

LayoutBuilder
↓
"Berapa ruang yang diberikan parent?"
```

Ini penting untuk **reusable component**.

---

# 🔀 MediaQuery vs LayoutBuilder

| | MediaQuery | LayoutBuilder |
|---|---|---|
| Data | layar/perangkat | constraints parent |
| Level | halaman | komponen |
| Contoh | 1 kolom vs 2 panel | header atas vs samping |

---

# 🤔 Kasus Tablet

Misalnya:

```text
Layar = 1000 dp

┌──────────┬─────────────────────────┐
│ 300 dp   │        700 dp           │
│ Profile  │       Content           │
└──────────┴─────────────────────────┘
```

`MediaQuery` mengetahui **1000 dp**.

Tapi `ProfileHeader` hanya mendapat **300 dp**.

➡️ Untuk komponen, gunakan `LayoutBuilder`.

---

# 📏 Pusatkan Breakpoint

`lib/core/breakpoints.dart`

```dart
class Breakpoints {
  Breakpoints._();

  static const double medium = 600;
  static const double expanded = 840;
}
```

> Jangan menyebarkan angka breakpoint di banyak file.

Satu sumber kebenaran lebih mudah dipelihara.

---

# 🧩 Header Adaptif

```dart
return LayoutBuilder(
  builder: (context, constraints) {
    final isWide =
        constraints.maxWidth >= 480;

    if (isWide) {
      return Row(
        children: [
          avatar,
          const SizedBox(width: 20),
          const Expanded(
            child: _ProfileInfo(centered: false),
          ),
        ],
      );
    }

    return Column(
      children: [
        avatar,
        const SizedBox(height: 12),
        const _ProfileInfo(centered: true),
      ],
    );
  },
);
```

---

# 🧪 Eksperimen 4

Jalankan di Chrome.

Tarik lebar jendela:

```text
sempit ──────────────────► lebar
```

Tebak:

> Pada lebar berapa header berubah?

Ingat:

**`Padding` juga mengurangi ruang yang tersedia.**

---

# 💡 Responsive at Component Level

Widget yang mampu beradaptasi dengan ruangnya:

- lebih reusable
- lebih mudah dipindahkan
- tidak bergantung pada ukuran layar global

> **Responsif bukan sekadar `if (screenWidth > ...)`.**

---

# 🧰 Widget Pendukung

| Widget | Fungsi |
|---|---|
| `Expanded` / `Flexible` | berbagi ruang |
| `Wrap` | turun ke baris berikutnya |
| `AspectRatio` | menjaga rasio |
| `FittedBox` | mengecilkan child |
| `ConstrainedBox` | membatasi lebar |

Kenali widget ini sebelum menambah package responsive.

---

# 06 · SingleChildScrollView

Cocok untuk:

- halaman detail
- form
- profil
- konten pendek & statis

Konsep:

```text
1 child
   ↓
bisa lebih tinggi dari layar
   ↓
scroll
```

---

# 🧪 Eksperimen 5 — Rasakan Masalahnya

Tambahkan `ContactSection()` ke akhir `Column`.

Tanpa scroll.

Jalankan.

Kemudian:

1. lihat overflow
2. fokuskan `TextField`
3. lihat keyboard muncul

Pertanyaan:

> Bagaimana membuat seluruh konten tetap bisa dijangkau?

---

# ✉️ ContactSection

Struktur form:

```text
┌─────────────────────────┐
│ Hubungi Saya            │
│                         │
│ Email                   │
│ ┌─────────────────────┐ │
│ └─────────────────────┘ │
│                         │
│ Pesan                   │
│ ┌─────────────────────┐ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│       [ Kirim ]         │
└─────────────────────────┘
```

Fokus eksperimen kali ini bukan pada desain form,
tetapi pada **scroll behavior**.

---

# 🛠️ Solusi

```dart
body: SingleChildScrollView(
  keyboardDismissBehavior:
      ScrollViewKeyboardDismissBehavior.onDrag,
  child: SafeArea(
    child: Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          ProfileHeader(),
          StatsRow(),
          SkillChips(),
          ContactSection(),
        ],
      ),
    ),
  ),
)
```

Sekarang konten dapat digeser.

---

# 📌 Kapan SingleChildScrollView?

### ✅ Cocok

- form
- detail
- profil
- sedikit child

### ❌ Tidak cocok

- puluhan/ribuan item
- data API besar
- daftar dinamis panjang

Karena semua child dibangun sekaligus.

---

# ⚠️ Kesalahan Klasik

Hindari pola:

```text
SingleChildScrollView
└── Column
    └── Expanded
```

Karena tinggi scroll view bersifat tidak terbatas.

Error yang mungkin muncul:

```text
RenderFlex children have non-zero flex
but incoming height constraints are unbounded
```

---

# ✅ Checkpoint Pertemuan 1

Pastikan:

- [ ] aplikasi jalan di emulator & Chrome
- [ ] landscape tidak overflow
- [ ] header berubah saat ruang cukup
- [ ] TextField tidak membuat overflow
- [ ] `ScreenInfo` berubah saat layar dirotasi

Jika belum, **jangan lanjut dulu**.

---

# 🏆 Challenge Pertemuan 1

### ⭐ Mudah

- tampilkan `ScreenInfo` hanya saat debug
- ubah warna saat landscape

### ⭐⭐ Sedang

- buat extension `ScreenX`
- ubah `StatsRow` menjadi `Wrap`

### ⭐⭐⭐ Sulit

- uji font size terbesar
- hilangkan semua overflow
- batasi konten dengan `maxWidth: 640`

---

# ☕ Istirahat

## 15 menit

Setelah istirahat:

> Kita masuk ke **list panjang, lazy loading, grid, dan Sliver.**

---

# 📅 PERTEMUAN 2

## Dari scroll sederhana → scroll yang scalable

Fokus:

- `ListView`
- `GridView`
- `CustomScrollView`
- adaptive two-pane layout

---

# 07 · ListView

Ada beberapa pola:

```text
ListView
ListView.builder
ListView.separated
```

Yang paling penting untuk data panjang:

```text
ListView.builder
```

Karena item dibuat **lazy**.

---

# 🧠 Apa Itu Lazy?

Misalnya ada:

```text
1.000 item
```

Tidak berarti Flutter harus membuat 1.000 widget sekaligus.

```text
┌──────────────┐
│ item 1       │ ← dibuat
│ item 2       │ ← dibuat
│ item 3       │ ← dibuat
│ ...          │
│ item 12      │ ← dibuat
└──────────────┘
       ↓ scroll
item berikutnya dibuat
```

---

# 🧪 Eksperimen 6 — Buktikan Lazy

```dart
ListView.builder(
  itemCount: 1000,
  itemBuilder: (context, index) {
    debugPrint('build item $index');

    return ListTile(
      title: Text('Item ke-$index'),
    );
  },
)
```

Lihat **Debug Console**.

Tebak:

> Apakah 1.000 item langsung dibangun?

---

# 🔬 Bandingkan dengan ListView Biasa

```dart
ListView(
  children: List.generate(1000, (i) {
    debugPrint('build item $i');

    return ListTile(
      title: Text('Item ke-$i'),
    );
  }),
)
```

Eksperimen akan memperlihatkan perbedaan penting:

```text
ListView(children: ...)
        ↓
semua child dibuat

ListView.builder(...)
        ↓
lazy
```

---

# 📦 Data Proyek

Kita siapkan model:

```dart
class Project {
  const Project({
    required this.title,
    required this.description,
    required this.year,
  });

  final String title;
  final String description;
  final int year;
}
```

Kemudian:

```dart
const projects = <Project>[
  Project(
    title: 'Kartu Profil Digital',
    description: 'Halaman profil Flutter.',
    year: 2026,
  ),
  // ...
];
```

---

# 🧱 Pisahkan Item Menjadi Widget

```dart
class ProjectTile extends StatelessWidget {
  const ProjectTile({
    super.key,
    required this.project,
  });

  final Project project;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.zero,
      child: ListTile(
        title: Text(project.title),
        subtitle: Text(
          project.description,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
        trailing: Text('${project.year}'),
      ),
    );
  }
}
```

💡 **Praktik industri:** data item dipisahkan dari tampilan halaman.

---

# 3 Constructor ListView yang Perlu Dikenal

### 1. Pendek & tetap

```dart
ListView(
  children: const [
    Text('A'),
    Text('B'),
  ],
);
```

### 2. Panjang / dinamis

```dart
ListView.builder(...)
```

### 3. Dengan separator

```dart
ListView.separated(...)
```

---

# 💡 Praktik Industri untuk List

- item → widget sendiri
- gunakan `const` bila memungkinkan
- gunakan `Key` untuk item yang stateful/dapat berubah
- batasi teks dengan `maxLines`
- gunakan `overflow`
- data panjang → builder

> Jangan membuat UI seolah-olah data server selalu pendek dan rapi.

---

# 08 · Masalah Klasik

## `ListView` di dalam `Column`

Kita ingin:

```text
Profile
Stats
Skills
↓
Projects
↓
Gallery
↓
Contact
```

Cara pemula:

```dart
Column(
  children: [
    SkillChips(),
    ListView.builder(...),
  ],
)
```

Mari **sengaja membuat error**.

---

# 💥 Error

```text
Vertical viewport was given
unbounded height.
```

Kenapa?

```text
SingleChildScrollView
└── Column
    └── ListView
```

`Column` berada pada area dengan tinggi tidak terbatas.

`ListView` juga ingin mengambil ruang vertikal sebanyak mungkin.

➡️ Konflik constraints.

---

# 🛠️ Tiga Solusi

| Solusi | Catatan |
|---|---|
| `Expanded` | hanya jika parent `Column` punya tinggi terbatas |
| `shrinkWrap` | mudah, tetapi tidak lazy sepenuhnya |
| `CustomScrollView` | cocok untuk halaman campuran |

Untuk latihan kita gunakan `shrinkWrap` dulu.

---

# ⚡ `shrinkWrap`

```dart
ListView.separated(
  shrinkWrap: true,
  physics:
      const NeverScrollableScrollPhysics(),
  itemCount: projects.length,
  separatorBuilder:
      (context, index) =>
          const SizedBox(height: 8),
  itemBuilder: (context, i) =>
      ProjectTile(
        project: projects[i],
      ),
)
```

Hasilnya:

```text
SingleChildScrollView
└── Column
    ├── Profile
    ├── Project list
    ├── Gallery
    └── Contact
```

---

# ⚠️ Kapan `shrinkWrap` Bermasalah?

`shrinkWrap: true` membuat list menghitung tinggi seluruh item.

```text
8 item    → masih masuk akal
800 item  → mahal
8.000     → jangan
```

Jadi:

> **`shrinkWrap` bukan pengganti lazy list.**

Untuk halaman besar → gunakan Sliver.

---

# 09 · GridView

Cocok untuk:

- galeri
- katalog
- menu
- kartu produk

```text
┌─────┬─────┬─────┐
│  1  │  2  │  3  │
├─────┼─────┼─────┤
│  4  │  5  │  6  │
└─────┴─────┴─────┘
```

---

# 🖼️ GalleryTile

Untuk gambar jaringan:

```dart
Image.network(
  url,
  fit: BoxFit.cover,
  loadingBuilder:
      (context, child, progress) {
    if (progress == null) return child;

    return const Center(
      child: CircularProgressIndicator(
        strokeWidth: 2,
      ),
    );
  },
)
```

Tambahkan juga `errorBuilder`.

💡 Jangan biarkan kegagalan network menghasilkan layar merah.

---

# 🔢 Dua Grid Delegate

### Fixed columns

```dart
SliverGridDelegateWithFixedCrossAxisCount(
  crossAxisCount: 3,
)
```

Jumlah kolom tetap.

### Max item width

```dart
SliverGridDelegateWithMaxCrossAxisExtent(
  maxCrossAxisExtent: 160,
)
```

Jumlah kolom dapat bertambah saat layar melebar.

---

# 📐 Grid Responsif

```text
400 dp
┌────┬────┐
│    │    │
├────┼────┤
│    │    │
└────┴────┘

800 dp
┌───┬───┬───┬───┐
│   │   │   │   │
├───┼───┼───┼───┤
│   │   │   │   │
└───┴───┴───┴───┘
```

Dengan:

```dart
maxCrossAxisExtent: 160
```

Anda tidak perlu menulis banyak `if`.

---

# 🧪 Eksperimen 8

Di Chrome:

1. uji lebar **400 dp**
2. uji **800 dp**
3. uji **1200 dp**

Kemudian ubah:

```dart
maxCrossAxisExtent: 100
```

lalu:

```dart
maxCrossAxisExtent: 250
```

Amati jumlah kolom.

---

# 🖼️ Network Image: Hal yang Harus Diingat

Jika gambar tidak tampil:

### Android release

Pastikan permission internet:

```xml
<uses-permission
    android:name="android.permission.INTERNET" />
```

### Chrome

Perhatikan sumber gambar dan aturan CORS.

### UI

Selalu siapkan:

```text
loading state
error state
success state
```

---

# 💡 Image Caching

Untuk aplikasi nyata, pertimbangkan:

```bash
flutter pub add cached_network_image
```

Contoh:

```dart
CachedNetworkImage(
  imageUrl: url,
  fit: BoxFit.cover,
  placeholder: (context, url) =>
      const CircularProgressIndicator(),
  errorWidget: (context, url, error) =>
      const Icon(Icons.broken_image),
)
```

Jadikan ini sebagai challenge.

---

# 10 · CustomScrollView + Sliver

Sekarang masalah kita:

```text
Header
+
List
+
Grid
+
Form
```

Semua harus berada dalam **satu scroll**.

Solusinya:

```text
CustomScrollView
├── SliverToBoxAdapter
├── SliverList
├── SliverGrid
└── SliverToBoxAdapter
```

---

# 🧩 Apa Itu Sliver?

Sliver adalah **bagian dari area scroll**.

| Sliver | Padanan |
|---|---|
| `SliverToBoxAdapter` | widget biasa |
| `SliverList` | `ListView` |
| `SliverGrid` | `GridView` |
| `SliverPadding` | `Padding` |
| `SliverAppBar` | AppBar yang ikut scroll |

---

# 🔍 "Kap Mesin" ListView

Menariknya:

> `ListView` dan `GridView` sendiri sudah menggunakan sliver di dalamnya.

`CustomScrollView` memberi kita kontrol untuk **menggabungkan berbagai jenis sliver**.

---

# 🧱 Struktur Final Scroll

```text
CustomScrollView
│
├── ProfileSummary
│
├── SectionTitle
├── SliverList
│
├── SectionTitle
├── SliverGrid
│
└── ContactSection
```

Semua menjadi satu scroll yang tetap lazy.

---

# 🛠️ `SliverToBoxAdapter`

Widget biasa tidak bisa langsung dimasukkan ke:

```dart
slivers: []
```

Gunakan:

```dart
SliverToBoxAdapter(
  child: ProfileSummary(),
)
```

Untuk daftar:

```dart
SliverList(...)
```

Untuk grid:

```dart
SliverGrid(...)
```

---

# 🧪 Eksperimen 9 — Lazy Sliver

Tambahkan:

```dart
debugPrint('build gallery $i');
```

ke `itemBuilder` galeri.

Kemudian scroll perlahan.

Amati:

> Apakah semua gambar dibangun sekaligus?

Tujuan:

**satu scroll + lazy rendering.**

---

# 💡 Pola Produksi

Halaman campuran:

```text
header
+
list
+
grid
+
form
```

sering cocok menggunakan:

```dart
CustomScrollView
```

Jaga `SliverToBoxAdapter` tetap kecil.

Jika di dalamnya ada `Column` yang sangat panjang,
bagian tersebut tidak lazy.

---

# ⚠️ Error Sliver

Jika muncul:

```text
A RenderViewport expected a child
of type RenderSliver
```

Periksa `slivers:`.

Widget biasa:

```dart
Text(...)
Container(...)
Column(...)
```

harus dibungkus:

```dart
SliverToBoxAdapter(
  child: ...,
)
```

---

# 11 · Layout Dua Panel

Pada layar lebar:

```text
┌──────────────────┬─────────────────────────┐
│ Profile          │ Projects                │
│                  │                         │
│ Stats            │ Gallery                 │
│                  │                         │
│ Skills           │ Contact                 │
│                  │                         │
│ scroll sendiri   │ scroll sendiri          │
└──────────────────┴─────────────────────────┘
```

Tujuan:

> Memanfaatkan ruang layar, bukan sekadar memperbesar UI HP.

---

# 📏 Breakpoint Halaman

Gunakan `LayoutBuilder` di level halaman:

```dart
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth >=
        Breakpoints.expanded) {
      return const _TwoPaneLayout();
    }

    return const _SinglePaneLayout();
  },
)
```

Dengan:

```dart
Breakpoints.expanded = 840
```

---

# 🧩 `_TwoPaneLayout`

Konsepnya:

```dart
Row(
  children: [
    SizedBox(
      width: 340,
      child: SingleChildScrollView(
        child: ProfileSummary(),
      ),
    ),

    const VerticalDivider(width: 1),

    Expanded(
      child: CustomScrollView(
        slivers: _contentSlivers(),
      ),
    ),
  ],
)
```

Hasil:

```text
Panel kiri
→ scroll sendiri

Panel kanan
→ scroll sendiri
```

---

# 🧪 Eksperimen 10

Di Chrome, lebarkan jendela melewati:

```text
840 dp
```

Amati:

1. satu kolom → dua panel
2. header kembali atas-bawah di panel kiri
3. jumlah kolom galeri bertambah otomatis

Lalu uji:

- tablet emulator
- HP landscape

---

# 🧠 Kenapa Header Kembali Vertikal?

Layar mungkin:

```text
1200 dp
```

Tetapi panel kiri hanya:

```text
≈ 308 dp
```

`ProfileHeader` menggunakan:

```dart
LayoutBuilder
```

Jadi ia melihat **ruang miliknya sendiri**.

➡️ Inilah responsive component yang benar.

---

# 🧪 Responsive Testing Checklist

Sebelum aplikasi dianggap selesai:

- [ ] HP kecil ~360 dp
- [ ] HP besar ~430 dp
- [ ] landscape
- [ ] tablet
- [ ] jendela lebar
- [ ] font size terbesar
- [ ] keyboard terbuka
- [ ] teks sangat panjang
- [ ] daftar 500 item

> Responsif diuji pada kondisi ekstrem, bukan hanya perangkat yang dimiliki developer.

---

# ✅ Checkpoint 2

Hasil akhir harus memiliki:

- profil
- statistik
- skill
- **8 proyek**
- **24 gambar**
- form kontak
- satu scroll pada HP
- dua panel pada ≥ 840 dp
- grid responsif
- tidak ada overflow

---

# 🏆 Challenge Pertemuan 2

### ⭐ Mudah

- tambah 4 proyek
- tambahkan ikon berbeda
- bandingkan fixed grid vs max extent

### ⭐⭐ Sedang

- `CachedNetworkImage`
- `RefreshIndicator`
- List ↔ Grid toggle

### ⭐⭐⭐ Sulit

- tombol "ke atas"
- `ScrollController`
- `SliverAppBar`
- breakpoint medium 600–839 dp

---

# 🌟 Challenge Bonus

Ubah studi kasus menjadi salah satu:

### 📸 Portofolio Fotografer

### 🛍️ Profil Toko

### 📦 Katalog Produk

Syarat:

- gunakan semua konsep modul
- responsif di HP
- responsif di tablet
- gunakan scrolling yang tepat
- tidak boleh overflow

---

# 🩺 Cheat Sheet Error

| Error | Kemungkinan penyebab | Solusi |
|---|---|---|
| `BOTTOM OVERFLOWED` | konten terlalu tinggi | scroll / `Flexible` / `Wrap` |
| `unbounded height` | List/Grid dalam Column | `Expanded`, `shrinkWrap`, atau Sliver |
| non-zero flex + unbounded | `Expanded` dalam scroll | ubah struktur |
| expected `RenderSliver` | widget biasa di `slivers` | `SliverToBoxAdapter` |
| gambar tidak muncul | network / permission / CORS | cek sumber + error state |
| tertutup system UI | inset belum ditangani | `SafeArea` |

---

# 🧠 10 Prinsip yang Harus Dibawa Pulang

1. **Jangan hardcode ukuran.**
2. Pahami **constraints**.
3. `MediaQuery` → kondisi layar.
4. `LayoutBuilder` → ruang komponen.
5. Gunakan satu sumber breakpoint.
6. Konten pendek → `SingleChildScrollView`.
7. List panjang → `ListView.builder`.
8. Grid responsif → `MaxCrossAxisExtent`.
9. Halaman campuran → `CustomScrollView` + Sliver.
10. **Uji kondisi ekstrem.**

---

# 🚀 Dari Flutter Basic ke Praktik Industri

Dasar yang dipelajari hari ini menjadi fondasi untuk:

```text
Responsive UI
      ↓
Design System
      ↓
Reusable Components
      ↓
State Management
      ↓
API Integration
      ↓
Production App
```

Package seperti responsive framework dapat membantu,
tetapi **pahami primitive Flutter terlebih dahulu**.

---

# 📚 Referensi

- Flutter — Understanding constraints
- Flutter — Adaptive & responsive design
- API docs: `SafeArea`
- API docs: `MediaQuery`
- API docs: `LayoutBuilder`
- API docs: `SingleChildScrollView`
- API docs: `ListView`
- API docs: `GridView`
- API docs: `CustomScrollView`
- Material 3 — Window size classes

---

# 🎉 Selamat!

## Kamu sekarang punya fondasi untuk membuat UI Flutter yang:

**aman · responsif · scrollable · scalable**

Dari:

```text
📱 HP
```

hingga:

```text
📟 Tablet
```

### Next step

> Integrasikan UI ini dengan **data dan REST API**.

<!--
Tutup dengan menghubungkan modul ini ke modul berikutnya.
Tekankan bahwa setelah layout stabil, data eksternal akan masuk melalui API.
-->
