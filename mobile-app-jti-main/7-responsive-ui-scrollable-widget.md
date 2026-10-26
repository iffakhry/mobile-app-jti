# Modul 5 — Responsive UI & Scrollable Widget

> **Praktikum Mobile Programming · Flutter & Dart**
> Durasi: 2 × 4 jam · Lanjutan dari Modul 4 (UI & Layout)

---

## 🎯 Tujuan Pembelajaran

Setelah menyelesaikan modul ini, kamu mampu:

1. Menjelaskan **kenapa overflow terjadi** dan bagaimana aturan _constraints_ di Flutter bekerja.
2. Menggunakan **`SafeArea`** agar konten tidak tertutup notch, status bar, atau gesture bar.
3. Membaca informasi layar dengan **`MediaQuery`** dan tahu kapan **tidak** perlu memakainya.
4. Membuat komponen yang beradaptasi dengan ruang yang tersedia memakai **`LayoutBuilder`**.
5. Membuat halaman yang bisa di-scroll dengan **`SingleChildScrollView`**, **`ListView`**, dan **`GridView`**.
6. Menggabungkan berbagai konten scroll dengan **`CustomScrollView` + Sliver** (pola yang dipakai di aplikasi nyata).
7. Menghasilkan aplikasi yang tampil baik di **HP, landscape, dan tablet**.

---

## 📦 Yang Akan Kamu Bangun

Di Modul 4 kamu sudah membuat **Kartu Profil Digital**. Di modul ini, kartu itu berkembang menjadi **halaman profil lengkap** yang responsif: ada foto, statistik, skill, daftar proyek, galeri foto, dan form kontak.

```
   HP (portrait)                  Tablet / layar lebar (≥ 840 dp)
┌──────────────────┐        ┌───────────────┬──────────────────────────┐
│ Profil Digital   │        │ Profil Digital                           │
├──────────────────┤        ├───────────────┬──────────────────────────┤
│      (foto)      │        │    (foto)     │ Proyek                   │
│    Fakhry        │        │    Fakhry     │ ┌──────────────────────┐ │
│ 12   1.2K   340  │        │ 12  1.2K  340 │ │ 📁 Kartu Profil ...  │ │
│ [Flutter] [Dart] │        │ [Flutter]     │ └──────────────────────┘ │
│ Proyek           │        │ [Dart] ...    │ Galeri                   │
│ ┌──────────────┐ │        │               │ ▢ ▢ ▢ ▢                  │
│ │📁 Kartu ...  │ │        │  (scroll      │ ▢ ▢ ▢ ▢   (scroll        │
│ └──────────────┘ │        │   sendiri)    │           sendiri)       │
│ Galeri  ▢ ▢ ▢    │        │               │ Hubungi Saya             │
│ Hubungi Saya     │        └───────────────┴──────────────────────────┘
└──────────────────┘
```

Satu project, dibangun **bertahap** dari awal sampai jadi. Setiap bagian punya hasil yang bisa langsung kamu jalankan.

---

## 🧭 Timeline

| Pertemuan 1 (4 jam)                   | Durasi |
| ------------------------------------- | ------ |
| Bagian 0 — Persiapan & titik awal     | 15 mnt |
| Bagian 1 — Kenapa UI harus responsif? | 20 mnt |
| Bagian 2 — `SafeArea`                 | 30 mnt |
| Bagian 3 — `MediaQuery`               | 40 mnt |
| Bagian 4 — `LayoutBuilder`            | 40 mnt |
| Bagian 5 — `SingleChildScrollView`    | 40 mnt |
| Istirahat                             | 15 mnt |
| Rangkuman, Checkpoint 1, Challenge    | 40 mnt |

| Pertemuan 2 (4 jam)                                     | Durasi |
| ------------------------------------------------------- | ------ |
| Bagian 6 — `ListView`                                   | 50 mnt |
| Bagian 7 — Masalah klasik: `ListView` di dalam `Column` | 20 mnt |
| Bagian 8 — `GridView`                                   | 50 mnt |
| Istirahat                                               | 15 mnt |
| Bagian 9 — `CustomScrollView` & Sliver                  | 35 mnt |
| Bagian 10 — Layout dua panel untuk layar lebar          | 25 mnt |
| Checkpoint 2                                            | 10 mnt |
| Challenge                                               | 35 mnt |

_(Bagian 6 juga sudah termasuk pengantar singkat pertemuan 2.)_

---

## 🧰 Prasyarat

- Flutter SDK **3.27 atau lebih baru** (cek dengan `flutter --version`).
- Sudah paham `Row`, `Column`, `Stack`, `Expanded`, `Padding`, `SizedBox`, `Card` (Modul 4).
- Emulator Android dan Chrome siap dipakai.

## 🏷️ Cara Membaca Modul

| Ikon           | Arti                                                           |
| -------------- | -------------------------------------------------------------- |
| 🧪             | **Eksperimen** — tebak dulu hasilnya, baru jalankan            |
| 💡             | **Praktik industri** — kebiasaan yang dipakai di project nyata |
| ⚠️             | **Awas** — kesalahan yang sering terjadi                       |
| ✅             | **Checkpoint** — cek hasilmu sebelum lanjut                    |
| ⭐ ⭐⭐ ⭐⭐⭐ | **Challenge** — mudah, sedang, sulit                           |

> **Satuan layar:** Flutter memakai **dp** (_logical pixel_), bukan pixel fisik. HP biasanya lebarnya 360–430 dp, tablet 600 dp ke atas.

---

# 📅 PERTEMUAN 1

## Bagian 0 — Persiapan (15 menit)

Kamu boleh melanjutkan project Modul 4, tapi supaya semua mulai dari kondisi yang sama, kita buat project baru:

```bash
flutter create profil_digital
cd profil_digital
```

Buat struktur folder berikut di dalam `lib/` (kosongkan isi `main.dart` bawaan):

```
lib/
├── main.dart
├── core/
│   └── breakpoints.dart      (dibuat di Bagian 4)
├── data/
│   └── dummy_data.dart       (dibuat di Bagian 6)
├── pages/
│   └── profile_page.dart
└── widgets/
    ├── profile_header.dart
    ├── stats_row.dart
    └── skill_chips.dart
```

> 💡 **Kenapa dipecah ke banyak file?** Di project nyata, satu widget = satu file. Kode lebih mudah dibaca, dites, dan dikerjakan bersama tim.

### `lib/main.dart`

```dart
import 'package:flutter/material.dart';

import 'pages/profile_page.dart';

void main() => runApp(const ProfilApp());

class ProfilApp extends StatelessWidget {
  const ProfilApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Profil Digital',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
      ),
      home: const ProfilePage(),
    );
  }
}
```

### `lib/widgets/profile_header.dart`

```dart
import 'package:flutter/material.dart';

class ProfileHeader extends StatelessWidget {
  const ProfileHeader({super.key});

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Column(
      children: [
        const CircleAvatar(
          radius: 48,
          backgroundImage:
              NetworkImage('https://picsum.photos/seed/profile/300/300'),
        ),
        const SizedBox(height: 12),
        Text(
          'Fakhry',
          style: textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 4),
        Text('Mobile Developer • Software Engineer',
            style: textTheme.bodyMedium),
        const SizedBox(height: 8),
        Text(
          'Suka membangun aplikasi Flutter dan belajar hal baru setiap hari.',
          textAlign: TextAlign.center,
          style: textTheme.bodySmall,
        ),
      ],
    );
  }
}
```

### `lib/widgets/stats_row.dart`

```dart
import 'package:flutter/material.dart';

class StatsRow extends StatelessWidget {
  const StatsRow({super.key});

  @override
  Widget build(BuildContext context) {
    return const Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        _StatItem(label: 'Proyek', value: '12'),
        _StatItem(label: 'Pengikut', value: '1.2K'),
        _StatItem(label: 'Mengikuti', value: '340'),
      ],
    );
  }
}

class _StatItem extends StatelessWidget {
  const _StatItem({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Column(
      children: [
        Text(
          value,
          style: textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
        ),
        Text(label, style: textTheme.bodySmall),
      ],
    );
  }
}
```

### `lib/widgets/skill_chips.dart`

```dart
import 'package:flutter/material.dart';

class SkillChips extends StatelessWidget {
  const SkillChips({super.key});

  static const _skills = [
    'Flutter', 'Dart', 'Firebase', 'Git', 'REST API', 'Figma', 'SQLite',
  ];

  @override
  Widget build(BuildContext context) {
    // Wrap = Row yang otomatis turun ke baris baru saat ruang habis.
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      alignment: WrapAlignment.center,
      children: [for (final skill in _skills) Chip(label: Text(skill))],
    );
  }
}
```

### `lib/pages/profile_page.dart`

```dart
import 'package:flutter/material.dart';

import '../widgets/profile_header.dart';
import '../widgets/skill_chips.dart';
import '../widgets/stats_row.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profil Digital')),
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
  }
}
```

Jalankan dengan `flutter run`. Kamu harus melihat kartu profil sederhana di layar portrait. Ini **titik awal** kita.

---

## Bagian 1 — Kenapa UI Harus Responsif? (20 menit)

Ada ratusan ukuran layar Android/iOS: HP kecil, HP lipat, tablet, mode landscape, bahkan jendela browser yang bisa di-resize. Kalau ukuran ditulis kaku (mis. `width: 400`), tampilannya pasti pecah di suatu perangkat.

### 🧪 Eksperimen 1 — Bikin overflow

1. Jalankan aplikasi di emulator.
2. **Rotasi ke landscape** (ikon rotate di panel emulator). Kalau pakai Chrome, **kecilkan tinggi jendela**.
3. Amati: muncul **garis kuning-hitam** dan tulisan `BOTTOM OVERFLOWED BY … PIXELS`.

**Kenapa?** `Column` tidak bisa scroll. Saat tinggi konten melebihi tinggi layar, tidak ada tempat untuk sisanya.

### Aturan layout Flutter

> **Constraints go down. Sizes go up. Parent sets position.**

```
Parent ──► "Kamu boleh selebar 0–360 dan setinggi 0–500"   (constraints turun)
Child  ──► "Oke, aku ambil 300 × 120"                        (ukuran naik)
Parent ──► "Kamu kuletakkan di posisi (30, 0)"               (parent menentukan posisi)
```

Hampir semua error layout yang akan kamu temui berasal dari salah paham aturan ini.

### Peta alat di modul ini

| Kebutuhan                                                 | Alat                                                                |
| --------------------------------------------------------- | ------------------------------------------------------------------- |
| Menghindari area yang tertutup sistem (notch, status bar) | `SafeArea`                                                          |
| Mengetahui ukuran & kondisi **layar/perangkat**           | `MediaQuery`                                                        |
| Mengetahui ruang yang diberikan **induk** ke widget       | `LayoutBuilder`                                                     |
| Konten lebih panjang dari layar                           | `SingleChildScrollView`, `ListView`, `GridView`, `CustomScrollView` |

💡 **Tiga strategi responsif:** (1) _menyesuaikan_ (`Expanded`, `Flexible`, `Wrap`), (2) _men-scroll_, (3) _mengganti layout_ di ukuran tertentu. Modul ini fokus di strategi 2 dan 3.

---

## Bagian 2 — SafeArea (30 menit)

**`SafeArea`** menambahkan padding otomatis agar konten tidak tertutup **notch, status bar, gesture bar, atau sudut layar melengkung**.

### 🧪 Eksperimen 2 — Tanpa SafeArea

Di `profile_page.dart`, **hapus sementara** baris `appBar: ...`, lalu jalankan di **emulator Android** (bukan Chrome — Chrome tidak punya status bar).

**Tebak:** apa yang terjadi pada foto profil di bagian atas?

Foto akan menempel bahkan tertutup **status bar**. Sekarang bungkus body dengan `SafeArea`:

```dart
return Scaffold(
  body: SafeArea(
    child: const Padding(
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
  ),
);
```

Konten sekarang turun di bawah status bar. Setelah paham, **kembalikan** `appBar` seperti semula.

### Kapan `SafeArea` dibutuhkan?

| Situasi                                            | Perlu SafeArea?                          |
| -------------------------------------------------- | ---------------------------------------- |
| `Scaffold` dengan `AppBar`                         | Bagian atas **sudah ditangani** `AppBar` |
| Halaman tanpa `AppBar` (login, onboarding, splash) | ✅ Ya                                    |
| Tombol/bar custom di bagian bawah layar            | ✅ Ya (menghindari gesture bar)          |
| Landscape di perangkat ber-notch                   | ✅ Ya (sisi kiri/kanan)                  |

Kamu bisa memilih sisi mana yang diamankan:

```dart
SafeArea(
  top: false,      // jangan beri padding atas
  bottom: true,
  minimum: const EdgeInsets.all(8), // padding minimal walau tidak ada notch
  child: ...,
)
```

💡 **Praktik industri:** Android 15 mewajibkan tampilan _edge-to-edge_ untuk aplikasi yang menargetkan SDK 35, sehingga konten bisa tergambar sampai ke bawah status bar dan navigation bar. Artinya, memperhatikan _inset_ sistem menjadi semakin penting.

⚠️ **Awas:** Untuk halaman yang **di-scroll**, jangan membungkus _seluruh_ `ScrollView` dengan `SafeArea`, karena area scroll ikut terpotong. Letakkan `SafeArea` **di dalam** scroll view (kita lakukan di Bagian 5).

---

## Bagian 3 — MediaQuery (40 menit)

**`MediaQuery`** memberi informasi tentang **layar dan pengaturan perangkat**.

| Method (disarankan)                        | Isinya                          | Contoh penggunaan                           |
| ------------------------------------------ | ------------------------------- | ------------------------------------------- |
| `MediaQuery.sizeOf(context)`               | Ukuran layar (dp)               | Menentukan layout HP vs tablet              |
| `MediaQuery.orientationOf(context)`        | `portrait` / `landscape`        | Menyesuaikan tata letak                     |
| `MediaQuery.paddingOf(context)`            | Area aman sistem (notch, bar)   | Spasi bawah agar tidak tertutup gesture bar |
| `MediaQuery.viewInsetsOf(context)`         | Area yang tertutup **keyboard** | Menggeser form saat keyboard muncul         |
| `MediaQuery.textScalerOf(context)`         | Skala font pengguna             | Menguji aksesibilitas                       |
| `MediaQuery.platformBrightnessOf(context)` | Mode terang/gelap sistem        | Menyesuaikan tema                           |

💡 **Praktik industri:** pakai `MediaQuery.sizeOf(context)`, **bukan** `MediaQuery.of(context).size`. Versi `sizeOf` hanya rebuild saat _ukuran_ berubah, sedangkan `.of` rebuild saat _apa pun_ di MediaQuery berubah (mis. keyboard muncul) — boros.

### Langkah 3.1 — Buat panel info layar (alat bantu debug)

Buat `lib/widgets/screen_info.dart`:

```dart
import 'package:flutter/material.dart';

/// Widget SEMENTARA untuk melihat data MediaQuery secara langsung.
class ScreenInfo extends StatelessWidget {
  const ScreenInfo({super.key});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    final orientation = MediaQuery.orientationOf(context);
    final padding = MediaQuery.paddingOf(context);
    final pixelRatio = MediaQuery.devicePixelRatioOf(context);
    final textScale = MediaQuery.textScalerOf(context).scale(1);

    return Card(
      color: Theme.of(context).colorScheme.tertiaryContainer,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Text(
          'Ukuran       : ${size.width.toStringAsFixed(0)} × ${size.height.toStringAsFixed(0)} dp\n'
          'Orientasi    : ${orientation.name}\n'
          'Padding atas : ${padding.top.toStringAsFixed(0)} | bawah: ${padding.bottom.toStringAsFixed(0)}\n'
          'Pixel ratio  : $pixelRatio\n'
          'Text scale   : $textScale',
          style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
        ),
      ),
    );
  }
}
```

Tambahkan `ScreenInfo()` sebagai anak pertama `Column` di `ProfilePage` (jangan lupa `import '../widgets/screen_info.dart';`).

### 🧪 Eksperimen 3

Jalankan, lalu amati angkanya saat kamu:

1. **Merotasi** emulator.
2. **Me-resize** jendela Chrome (`flutter run -d chrome`).
3. Mengubah **Font size** di pengaturan Android (_Settings → Display → Font size_). Perhatikan `Text scale`.

Kalau layout mulai overflow saat font diperbesar, itu bukan bug emulator — **itu bug layout-mu**. Pengguna nyata memang mengubah ukuran font.

### Langkah 3.2 — Avatar yang mengikuti lebar layar

Ubah `ProfileHeader` (bagian atas `build`, dan `CircleAvatar`):

```dart
@override
Widget build(BuildContext context) {
  final textTheme = Theme.of(context).textTheme;

  // 12% dari lebar layar, dibatasi 40–72 dp
  final width = MediaQuery.sizeOf(context).width;
  final radius = (width * 0.12).clamp(40.0, 72.0).toDouble();

  return Column(
    children: [
      CircleAvatar(
        radius: radius,
        backgroundImage:
            const NetworkImage('https://picsum.photos/seed/profile/300/300'),
      ),
      // ... sisanya tetap
```

Perhatikan: `const` di `CircleAvatar` dihapus karena `radius` sekarang dihitung saat runtime.

💡 **Praktik industri — selalu `clamp`.** Ukuran proporsional tanpa batas atas/bawah akan terlalu kecil di HP mungil dan raksasa di tablet.

⚠️ **Awas:** jangan memanggil `MediaQuery` di `initState`. Panggil di dalam `build()` (atau `didChangeDependencies`).

---

## Bagian 4 — LayoutBuilder (40 menit)

`MediaQuery` menjawab: _"Seberapa besar layar perangkat?"_
`LayoutBuilder` menjawab: _"Berapa ruang yang **diberikan induk** kepada widget ini?"_

|             | `MediaQuery`                    | `LayoutBuilder`                         |
| ----------- | ------------------------------- | --------------------------------------- |
| Sumber data | Layar / perangkat               | Constraints dari widget induk           |
| Cocok untuk | Keputusan **level halaman**     | Keputusan **level komponen**            |
| Contoh      | Halaman satu kolom vs dua panel | Header: foto di atas vs foto di samping |

Bayangkan `ProfileHeader` dipakai di panel samping selebar 300 dp pada tablet. Lebar _layar_-nya 1000 dp, tapi ruang _milik komponen_ hanya 300 dp. Kalau komponen memakai `MediaQuery`, ia salah menghitung. Karena itu komponen yang dipakai ulang sebaiknya memakai `LayoutBuilder`.

### Langkah 4.1 — Pusatkan breakpoint

Buat `lib/core/breakpoints.dart`:

```dart
/// Batas lebar layar (dp), mengikuti Material 3 window size classes:
/// compact < 600 ≤ medium < 840 ≤ expanded
class Breakpoints {
  Breakpoints._(); // kelas ini tidak untuk di-instansiasi

  static const double medium = 600;
  static const double expanded = 840;
}
```

💡 **Praktik industri:** angka breakpoint **tidak ditulis berserakan** di banyak file. Satu tempat, satu sumber kebenaran.

### Langkah 4.2 — Header yang adaptif

Ganti seluruh isi `profile_header.dart`:

```dart
import 'package:flutter/material.dart';

class ProfileHeader extends StatelessWidget {
  const ProfileHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Keputusan berdasarkan ruang milik komponen ini, bukan layar.
        final isWide = constraints.maxWidth >= 480;

        final avatar = CircleAvatar(
          radius: isWide ? 56 : 48,
          backgroundImage:
              const NetworkImage('https://picsum.photos/seed/profile/300/300'),
        );

        if (isWide) {
          // Foto di kiri, teks di kanan
          return Row(
            children: [
              avatar,
              const SizedBox(width: 20),
              const Expanded(child: _ProfileInfo(centered: false)),
            ],
          );
        }

        // Foto di atas, teks di bawah
        return Column(
          children: [
            avatar,
            const SizedBox(height: 12),
            const _ProfileInfo(centered: true),
          ],
        );
      },
    );
  }
}

class _ProfileInfo extends StatelessWidget {
  const _ProfileInfo({required this.centered});

  final bool centered;

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Column(
      crossAxisAlignment:
          centered ? CrossAxisAlignment.center : CrossAxisAlignment.start,
      children: [
        Text(
          'Fakhry',
          style: textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 4),
        Text('Mobile Developer • Software Engineer',
            style: textTheme.bodyMedium),
        const SizedBox(height: 8),
        Text(
          'Suka membangun aplikasi Flutter dan belajar hal baru setiap hari.',
          textAlign: centered ? TextAlign.center : TextAlign.start,
          style: textTheme.bodySmall,
        ),
      ],
    );
  }
}
```

### 🧪 Eksperimen 4

Jalankan di **Chrome**, lalu tarik lebar jendela dari sempit ke lebar. **Tebak:** pada lebar berapa header berubah bentuk? (Ingat: `Padding` 16 di kiri-kanan mengurangi ruang!)

Header berubah saat ruang yang tersedia untuk komponen ≥ 480 dp — bukan saat layar 480 dp.

💡 **Praktik industri — "responsif di level komponen":** widget yang bisa beradaptasi sendiri lebih mudah dipakai ulang di layout mana pun.

⚠️ **Awas:** `LayoutBuilder` membaca `constraints.maxWidth`. Kalau induknya tak terbatas (mis. di dalam scroll horizontal), nilainya `double.infinity`. Selalu cek kalau ragu.

### Widget pendukung lain yang wajib kamu kenal

| Widget                        | Fungsi                                                   |
| ----------------------------- | -------------------------------------------------------- |
| `Expanded` / `Flexible`       | Berbagi sisa ruang di `Row`/`Column`                     |
| `Wrap`                        | Turun baris otomatis (sudah kita pakai di `SkillChips`)  |
| `AspectRatio`                 | Menjaga rasio (mis. 16:9) berapa pun lebarnya            |
| `FittedBox`                   | Mengecilkan anak agar muat                               |
| `ConstrainedBox(maxWidth: …)` | Membatasi lebar konten agar tidak "melar" di layar lebar |

---

## Bagian 5 — SingleChildScrollView (40 menit)

`SingleChildScrollView` membuat **satu anak** bisa di-scroll. Cocok untuk konten **pendek dan statis** — halaman profil, form, halaman detail.

### Langkah 5.1 — Buat `ContactSection`

Buat `lib/widgets/contact_section.dart`:

```dart
import 'package:flutter/material.dart';

class ContactSection extends StatelessWidget {
  const ContactSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Hubungi Saya',
                style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            const TextField(
              decoration: InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            const TextField(
              maxLines: 3,
              decoration: InputDecoration(
                labelText: 'Pesan',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: () {},
                child: const Text('Kirim'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

### 🧪 Eksperimen 5 — Rasakan masalahnya dulu

Tambahkan `ContactSection()` di akhir `Column` pada `ProfilePage` **tanpa scroll**. Jalankan.

- Konten langsung overflow di bawah (halaman lebih tinggi dari layar).
- Lalu ketuk salah satu `TextField` — keyboard muncul dan ruang makin sempit.

### Langkah 5.2 — Solusinya

Ganti isi `profile_page.dart`:

```dart
import 'package:flutter/material.dart';

import '../widgets/contact_section.dart';
import '../widgets/profile_header.dart';
import '../widgets/screen_info.dart';
import '../widgets/skill_chips.dart';
import '../widgets/stats_row.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profil Digital')),
      body: SingleChildScrollView(
        // Keyboard tertutup saat pengguna menggeser layar
        keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
        child: SafeArea(
          // SafeArea di DALAM scroll view → konten tidak terpotong
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: const [
                ScreenInfo(), // sementara
                SizedBox(height: 16),
                ProfileHeader(),
                SizedBox(height: 16),
                StatsRow(),
                SizedBox(height: 16),
                SkillChips(),
                SizedBox(height: 24),
                ContactSection(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
```

Jalankan lagi. Sekarang halaman bisa di-scroll, dan saat keyboard muncul form tetap bisa dijangkau.

> `Scaffold` secara default (`resizeToAvoidBottomInset: true`) mengecilkan body saat keyboard muncul, dan `SingleChildScrollView` membuat isinya tetap bisa digeser.

### Kapan memakai `SingleChildScrollView`?

| ✅ Cocok                            | ❌ Tidak cocok                       |
| ----------------------------------- | ------------------------------------ |
| Form, halaman detail, konten pendek | Daftar panjang (puluhan–ribuan item) |
| Jumlah anak sedikit & tetap         | Data dari API / database             |

**Alasannya:** `SingleChildScrollView` membangun **semua** anaknya sekaligus, meski tak terlihat. Untuk daftar panjang, itu boros memori dan bikin aplikasi lag. Solusinya: `ListView.builder` (Pertemuan 2).

⚠️ **Awas:** `Expanded` / `Flexible` **tidak boleh** berada langsung di dalam `Column` yang ada di `SingleChildScrollView`, karena tinggi scroll view tak terbatas. Error-nya: _"RenderFlex children have non-zero flex but incoming height constraints are unbounded."_

---

## ✅ Rangkuman Pertemuan 1

| Widget                  | Satu kalimat                                                                   |
| ----------------------- | ------------------------------------------------------------------------------ |
| `SafeArea`              | Menjauhkan konten dari area yang tertutup sistem.                              |
| `MediaQuery`            | Info tentang layar & pengaturan perangkat (pakai `sizeOf`, `paddingOf`, dll.). |
| `LayoutBuilder`         | Info tentang ruang yang diberikan induk; dasar komponen adaptif.               |
| `SingleChildScrollView` | Scroll untuk konten pendek & statis.                                           |

## ✅ Checkpoint 1

Sebelum lanjut, pastikan **semua** ini benar:

- [ ] Aplikasi berjalan tanpa error di emulator dan Chrome.
- [ ] Saat landscape, **tidak ada** garis kuning-hitam (overflow).
- [ ] Header berubah dari susunan atas-bawah menjadi kiri-kanan saat jendela dilebarkan.
- [ ] Mengetuk `TextField` tidak menyebabkan overflow.
- [ ] Panel `ScreenInfo` menampilkan angka yang berubah saat layar dirotasi.

## 🏆 Challenge Pertemuan 1

**⭐ Mudah**

1. Tampilkan `ScreenInfo` **hanya di mode debug** menggunakan `kDebugMode` (`import 'package:flutter/foundation.dart';`).
2. Ubah warna latar `ScreenInfo` menjadi merah muda saat orientasi _landscape_.

**⭐⭐ Sedang**

3. Buat _extension_ agar kode lebih ringkas dan rapi:
   ```dart
   extension ScreenX on BuildContext {
     // isi: bool get isCompact, dst. — berdasarkan Breakpoints
   }
   ```
   Lalu pakai di `ProfileHeader` atau tempat lain.
4. Ubah `StatsRow` agar memakai `Wrap` sehingga tetap rapi saat `Text scale` 2.0.

**⭐⭐⭐ Sulit**

5. Uji ketahanan: di pengaturan Android, set **Font size** ke ukuran terbesar, lalu perbaiki **semua** overflow yang muncul di halamanmu tanpa memotong teks.
6. Tambahkan `ConstrainedBox(constraints: BoxConstraints(maxWidth: 640))` + `Center` agar konten tidak terlalu melebar di layar lebar. Bandingkan hasilnya dengan sebelumnya.

---

# 📅 PERTEMUAN 2

## Bagian 6 — ListView (50 menit)

### Peta widget scrollable

| Widget                      | Untuk apa                                  | Lazy?     |
| --------------------------- | ------------------------------------------ | --------- |
| `SingleChildScrollView`     | Konten pendek & statis                     | ❌ Tidak  |
| `ListView(children: [...])` | Daftar pendek                              | ❌ Tidak  |
| `ListView.builder`          | Daftar panjang / dinamis                   | ✅ **Ya** |
| `ListView.separated`        | `builder` + pemisah antar item             | ✅ Ya     |
| `GridView.builder`          | Grid panjang                               | ✅ Ya     |
| `CustomScrollView` + Sliver | Menggabungkan berbagai jenis konten scroll | ✅ Ya     |

**Lazy** = hanya widget yang **terlihat di layar** (plus sedikit cadangan) yang dibangun. Inilah kunci performa aplikasi dengan daftar panjang.

### 🧪 Eksperimen 6 — Buktikan "lazy" itu nyata

Di `main.dart`, ubah `home:` **sementara** menjadi:

```dart
home: Scaffold(
  appBar: AppBar(title: const Text('Eksperimen ListView')),
  body: ListView.builder(
    itemCount: 1000,
    itemBuilder: (context, index) {
      debugPrint('build item $index');
      return ListTile(title: Text('Item ke-$index'));
    },
  ),
),
```

Jalankan dan lihat **Debug Console**. **Tebak:** ada berapa baris `build item` saat aplikasi pertama terbuka?

Hanya belasan baris. Scroll ke bawah, dan baris baru muncul sesuai item yang terlihat.

Sekarang bandingkan dengan `ListView` biasa:

```dart
body: ListView(
  children: List.generate(1000, (i) {
    debugPrint('build item $i');
    return ListTile(title: Text('Item ke-$i'));
  }),
),
```

Kali ini **1000 baris langsung tercetak**. Bayangkan jika tiap item berisi gambar. Itulah alasan `ListView.builder` menjadi standar. Setelah selesai, **kembalikan** `home:` menjadi `const ProfilePage()`.

### Langkah 6.1 — Siapkan data

Buat `lib/data/dummy_data.dart`:

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

const projects = <Project>[
  Project(
    title: 'Kartu Profil Digital',
    description: 'Halaman profil dengan Row, Column, dan Stack.',
    year: 2026,
  ),
  Project(
    title: 'Aplikasi Catatan',
    description: 'Catat, ubah, dan hapus catatan harian dengan mudah.',
    year: 2026,
  ),
  Project(
    title: 'To-Do List',
    description: 'Kelola tugas harian lengkap dengan penanda selesai.',
    year: 2025,
  ),
  Project(
    title: 'Kalkulator BMI',
    description: 'Hitung indeks massa tubuh dari tinggi dan berat badan.',
    year: 2025,
  ),
  Project(
    title: 'Toko Online Mini',
    description: 'Katalog produk dengan keranjang belanja sederhana.',
    year: 2025,
  ),
  Project(
    title: 'Cuaca Hari Ini',
    description: 'Menampilkan prakiraan cuaca dari REST API.',
    year: 2025,
  ),
  Project(
    title: 'Kuis Pemrograman',
    description: 'Latihan soal pilihan ganda dengan skor akhir.',
    year: 2025,
  ),
  Project(
    title: 'Pemutar Musik Sederhana',
    description: 'Memutar daftar lagu lokal dengan kontrol dasar.',
    year: 2024,
  ),
];

/// URL gambar galeri. `seed` menjaga gambar tetap sama setiap kali reload.
final galleryImages = List<String>.generate(
  24,
  (i) => 'https://picsum.photos/seed/galeri$i/400/400',
);
```

### Langkah 6.2 — Widget item proyek

Buat `lib/widgets/project_tile.dart`:

```dart
import 'package:flutter/material.dart';

import '../data/dummy_data.dart';

class ProjectTile extends StatelessWidget {
  const ProjectTile({super.key, required this.project});

  final Project project;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;

    return Card(
      margin: EdgeInsets.zero,
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: colors.primaryContainer,
          child: Icon(Icons.folder_outlined, color: colors.onPrimaryContainer),
        ),
        title: Text(project.title),
        subtitle: Text(
          project.description,
          maxLines: 2,
          overflow: TextOverflow.ellipsis, // teks panjang dipotong "…"
        ),
        trailing: Text('${project.year}'),
      ),
    );
  }
}
```

Buat juga `lib/widgets/section_title.dart`:

```dart
import 'package:flutter/material.dart';

class SectionTitle extends StatelessWidget {
  const SectionTitle(this.text, {super.key});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: Theme.of(context)
          .textTheme
          .titleLarge
          ?.copyWith(fontWeight: FontWeight.bold),
    );
  }
}
```

### Tiga constructor `ListView` yang perlu kamu hafal

```dart
// 1. Daftar pendek & tetap
ListView(children: const [Text('A'), Text('B')]);

// 2. Daftar panjang / dari data  ← paling sering dipakai
ListView.builder(
  itemCount: projects.length,
  itemBuilder: (context, index) => ProjectTile(project: projects[index]),
);

// 3. Sama seperti builder + pemisah
ListView.separated(
  itemCount: projects.length,
  separatorBuilder: (context, index) => const Divider(),
  itemBuilder: (context, index) => ProjectTile(project: projects[index]),
);
```

💡 **Praktik industri untuk daftar:**

- Pisahkan **item menjadi widget sendiri** (`ProjectTile`) dan beri `const` bila memungkinkan.
- Untuk data yang bisa berubah urutan/dihapus, beri `key: ValueKey(id)` pada item agar state-nya tidak tertukar.
- Batasi teks dengan `maxLines` + `overflow`, karena data dari server tidak bisa diprediksi panjangnya.

---

## Bagian 7 — Masalah Klasik: `ListView` di dalam `Column` (20 menit)

Kita ingin daftar proyek tampil di halaman profil, di bawah `SkillChips`. Cara paling "alami" bagi pemula:

### 🧪 Eksperimen 7 — Sengaja membuat error

Di `ProfilePage`, tambahkan setelah `SkillChips`:

```dart
const SectionTitle('Proyek'),
ListView.builder(
  itemCount: projects.length,
  itemBuilder: (context, i) => ProjectTile(project: projects[i]),
),
```

_(Hapus `const` dari `children: const [` karena sekarang ada widget non-const, dan tambahkan import yang dibutuhkan.)_

Jalankan. Error muncul:

```
Vertical viewport was given unbounded height.
```

**Kenapa?** `ListView` ingin mengambil **setinggi mungkin** untuk scroll. Tapi induknya (`Column` di dalam `SingleChildScrollView`) memberi tinggi **tak terbatas**. Dua widget scroll saling berebut, dan `ListView` tak tahu harus setinggi apa.

### Tiga solusi

| Solusi              | Cara                                                           | Catatan                                                           |
| ------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------- |
| **A.** `Expanded`   | Bungkus `ListView` dengan `Expanded`                           | Hanya jika `Column` **tidak** ada di dalam scroll view            |
| **B.** `shrinkWrap` | `shrinkWrap: true` + `physics: NeverScrollableScrollPhysics()` | Cepat, tapi **kehilangan sifat lazy** → hanya untuk daftar pendek |
| **C.** **Sliver**   | `CustomScrollView`                                             | ✅ **Solusi standar industri** (Bagian 9)                         |

Sekarang kita coba solusi **B** dulu supaya halaman berjalan:

```dart
const SectionTitle('Proyek'),
const SizedBox(height: 8),
ListView.separated(
  shrinkWrap: true,
  physics: const NeverScrollableScrollPhysics(),
  itemCount: projects.length,
  separatorBuilder: (context, index) => const SizedBox(height: 8),
  itemBuilder: (context, i) => ProjectTile(project: projects[i]),
),
```

Jalankan. Daftar proyek tampil dan seluruh halaman bisa di-scroll.

⚠️ **Awas:** `shrinkWrap: true` memaksa `ListView` menghitung tinggi **semua** item sekaligus. Cukup untuk 8 item, tapi buruk untuk 800 item. Simpan solusi B untuk daftar kecil saja.

---

## Bagian 8 — GridView (50 menit)

`GridView` menampilkan item dalam **kolom-kolom**, cocok untuk galeri, katalog produk, atau menu.

### Langkah 8.1 — Widget gambar galeri

Buat `lib/widgets/gallery_tile.dart`:

```dart
import 'package:flutter/material.dart';

class GalleryTile extends StatelessWidget {
  const GalleryTile({super.key, required this.url});

  final String url;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: Image.network(
        url,
        fit: BoxFit.cover,
        // Tampil saat gambar sedang dimuat
        loadingBuilder: (context, child, progress) {
          if (progress == null) return child;
          return const Center(
            child: CircularProgressIndicator(strokeWidth: 2),
          );
        },
        // Tampil jika gambar gagal dimuat (jangan biarkan layar merah!)
        errorBuilder: (context, error, stackTrace) => const ColoredBox(
          color: Colors.black12,
          child: Center(child: Icon(Icons.broken_image_outlined)),
        ),
      ),
    );
  }
}
```

### Dua pilihan `gridDelegate`

```dart
// A. Jumlah kolom TETAP
const SliverGridDelegateWithFixedCrossAxisCount(
  crossAxisCount: 3,
  mainAxisSpacing: 8,
  crossAxisSpacing: 8,
)

// B. Lebar item MAKSIMAL → jumlah kolom menyesuaikan otomatis
const SliverGridDelegateWithMaxCrossAxisExtent(
  maxCrossAxisExtent: 160,
  mainAxisSpacing: 8,
  crossAxisSpacing: 8,
)
```

|               | A. `FixedCrossAxisCount`    | B. `MaxCrossAxisExtent`      |
| ------------- | --------------------------- | ---------------------------- |
| Jumlah kolom  | Selalu sama                 | Bertambah saat layar melebar |
| Ukuran item   | Berubah mengikuti layar     | Relatif stabil               |
| Kapan dipakai | Layout yang harus konsisten | **Responsif otomatis** ✅    |

💡 **Praktik industri:** untuk grid yang harus responsif, `MaxCrossAxisExtent` sering menjadi pilihan pertama karena **tidak perlu `if` breakpoint** sama sekali.

Atur bentuk item dengan `childAspectRatio` (lebar ÷ tinggi). Nilai `1` = persegi, `0.75` = lebih tinggi dari lebar.

### Langkah 8.2 — Tambahkan galeri ke halaman

Di `ProfilePage`, setelah daftar proyek, tambahkan:

```dart
const SizedBox(height: 24),
const SectionTitle('Galeri'),
const SizedBox(height: 8),
GridView.builder(
  shrinkWrap: true,
  physics: const NeverScrollableScrollPhysics(),
  gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
    maxCrossAxisExtent: 160,
    mainAxisSpacing: 8,
    crossAxisSpacing: 8,
  ),
  itemCount: galleryImages.length,
  itemBuilder: (context, i) => GalleryTile(url: galleryImages[i]),
),
const SizedBox(height: 24),
const ContactSection(),
```

_(Pindahkan `ContactSection` ke bawah galeri jika sebelumnya sudah ada di atas.)_

### 🧪 Eksperimen 8

1. Jalankan di **Chrome**, lalu lebarkan jendela. Hitung: berapa kolom di lebar 400 dp? 800 dp? 1200 dp?
2. Ganti `maxCrossAxisExtent` menjadi `100`, lalu `250`. Apa yang berubah?
3. Tambahkan `childAspectRatio: 0.8` di delegate. Bagaimana bentuk item sekarang?

⚠️ **Awas — masalah yang sering dialami saat gambar tidak tampil:**

- **Android (release build):** izin internet belum ada. Di `android/app/src/main/AndroidManifest.xml`, pastikan ada baris ini di dalam `<manifest>`:
  ```xml
  <uses-permission android:name="android.permission.INTERNET" />
  ```
  _(Saat debug biasanya jalan tanpa ini, tapi **build rilis** akan gagal memuat gambar.)_
- **Chrome:** sebagian sumber gambar diblokir aturan CORS. Kita memakai `picsum.photos/seed/...` karena aman untuk Flutter web.
- **`Container()` tanpa `child` dan tanpa `height`** memiliki tinggi 0 (tidak terlihat). Untuk spasi, pakai `SizedBox`.

💡 **Praktik industri — cache gambar jaringan.** `Image.network` tidak menyimpan gambar untuk dipakai ulang secara persisten. Di aplikasi nyata umumnya dipakai package `cached_network_image`:

```bash
flutter pub add cached_network_image
```

```dart
CachedNetworkImage(
  imageUrl: url,
  fit: BoxFit.cover,
  placeholder: (context, url) =>
      const Center(child: CircularProgressIndicator(strokeWidth: 2)),
  errorWidget: (context, url, error) => const Icon(Icons.broken_image_outlined),
)
```

_(Menjadikan ini sebagai challenge di akhir modul.)_

---

## Bagian 9 — CustomScrollView & Sliver (35 menit)

Halaman kita sekarang memakai **solusi B**: `ListView` dan `GridView` yang di-`shrinkWrap` di dalam `SingleChildScrollView`. Berjalan, tapi semua item dibangun sekaligus. Kita ganti dengan pola yang dipakai di aplikasi produksi.

**Sliver** = "potongan" dari satu area scroll. `CustomScrollView` menggabungkan banyak sliver menjadi **satu scroll tunggal yang tetap lazy**.

| Sliver               | Padanannya                                         |
| -------------------- | -------------------------------------------------- |
| `SliverToBoxAdapter` | Widget biasa (mis. header, judul)                  |
| `SliverList`         | `ListView`                                         |
| `SliverGrid`         | `GridView`                                         |
| `SliverPadding`      | `Padding`                                          |
| `SliverAppBar`       | `AppBar` yang bisa mengecil/menghilang saat scroll |

> Sebenarnya `ListView` dan `GridView` yang kamu pakai selama ini **sudah memakai sliver di dalamnya**. `CustomScrollView` hanya membuka "kap mesin"-nya agar bisa digabung.

### Langkah 9.1 — Bungkus header + statistik + skill

Buat `lib/widgets/profile_summary.dart`:

```dart
import 'package:flutter/material.dart';

import 'profile_header.dart';
import 'skill_chips.dart';
import 'stats_row.dart';

/// Gabungan bagian ringkasan profil (dipakai di layout 1 kolom & 2 panel).
class ProfileSummary extends StatelessWidget {
  const ProfileSummary({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        ProfileHeader(),
        SizedBox(height: 16),
        StatsRow(),
        SizedBox(height: 16),
        SkillChips(),
      ],
    );
  }
}
```

### Langkah 9.2 — Tulis ulang `ProfilePage`

Ganti seluruh isi `profile_page.dart`:

```dart
import 'package:flutter/material.dart';

import '../data/dummy_data.dart';
import '../widgets/contact_section.dart';
import '../widgets/gallery_tile.dart';
import '../widgets/profile_summary.dart';
import '../widgets/project_tile.dart';
import '../widgets/section_title.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profil Digital')),
      body: const SafeArea(
        bottom: false, // bagian bawah kita tangani manual di dalam scroll
        child: _SinglePaneLayout(),
      ),
    );
  }
}

/// Susunan satu kolom (HP).
class _SinglePaneLayout extends StatelessWidget {
  const _SinglePaneLayout();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: CustomScrollView(
        keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
        slivers: [
          const SliverToBoxAdapter(child: SizedBox(height: 16)),
          const SliverToBoxAdapter(child: ProfileSummary()),
          const SliverToBoxAdapter(child: SizedBox(height: 24)),
          ..._contentSlivers(),
          _bottomSpacer(context),
        ],
      ),
    );
  }
}

/// Bagian konten: proyek, galeri, kontak (dipakai di kedua layout).
List<Widget> _contentSlivers() {
  return [
    const SliverToBoxAdapter(child: SectionTitle('Proyek')),
    SliverPadding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      sliver: SliverList.separated(
        itemCount: projects.length,
        separatorBuilder: (context, index) => const SizedBox(height: 8),
        itemBuilder: (context, i) => ProjectTile(project: projects[i]),
      ),
    ),
    const SliverToBoxAdapter(child: SizedBox(height: 12)),
    const SliverToBoxAdapter(child: SectionTitle('Galeri')),
    SliverPadding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      sliver: SliverGrid.builder(
        gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
          maxCrossAxisExtent: 160,
          mainAxisSpacing: 8,
          crossAxisSpacing: 8,
        ),
        itemCount: galleryImages.length,
        itemBuilder: (context, i) => GalleryTile(url: galleryImages[i]),
      ),
    ),
    const SliverToBoxAdapter(child: SizedBox(height: 12)),
    const SliverToBoxAdapter(child: ContactSection()),
  ];
}

/// Ruang kosong di akhir scroll = padding bawah sistem + jarak nyaman.
Widget _bottomSpacer(BuildContext context) {
  final bottomInset = MediaQuery.paddingOf(context).bottom;
  return SliverToBoxAdapter(child: SizedBox(height: bottomInset + 16));
}
```

Perhatikan bahwa `ScreenInfo` sudah tidak dipakai lagi (boleh dihapus file-nya atau disimpan untuk debug).

### 🧪 Eksperimen 9

Jalankan dan tambahkan `debugPrint` sementara di `itemBuilder` galeri. Scroll pelan-pelan: gambar baru **dibangun hanya saat mendekati layar**. Sekarang halaman kita punya **satu scroll yang mulus** dan tetap lazy.

💡 **Praktik industri:**

- Pola "halaman campuran" (header + daftar + grid) hampir selalu dibangun dengan `CustomScrollView`.
- Kalau ada `SliverToBoxAdapter` berisi `Column` yang sangat panjang, isinya **tidak lazy**. Jaga agar isinya kecil.
- Ada juga `SliverSafeArea` untuk kasus yang lebih rumit.

⚠️ **Awas:** `CustomScrollView` hanya menerima **sliver** sebagai anak. Widget biasa **harus** dibungkus `SliverToBoxAdapter`, kalau tidak akan muncul error _"A RenderViewport expected a child of type RenderSliver"_.

---

## Bagian 10 — Layout Dua Panel untuk Layar Lebar (25 menit)

Di tablet atau landscape lebar, layout satu kolom terlalu renggang. Kita buat **dua panel**: profil di kiri, konten di kanan — masing-masing scroll sendiri.

### Langkah 10.1 — Tambah `LayoutBuilder` di level halaman

Di `profile_page.dart`, tambahkan import di paling atas:

```dart
import '../core/breakpoints.dart';
```

Ubah `body` pada `ProfilePage`:

```dart
body: SafeArea(
  bottom: false,
  child: LayoutBuilder(
    builder: (context, constraints) {
      if (constraints.maxWidth >= Breakpoints.expanded) {
        return const _TwoPaneLayout();
      }
      return const _SinglePaneLayout();
    },
  ),
),
```

_(Hapus `const` di depan `SafeArea` karena `builder` bukan konstanta.)_

### Langkah 10.2 — Tambahkan `_TwoPaneLayout`

Tambahkan class ini di file yang sama (mis. di bawah `_SinglePaneLayout`):

```dart
/// Susunan dua panel (tablet / layar lebar).
class _TwoPaneLayout extends StatelessWidget {
  const _TwoPaneLayout();

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Panel kiri: lebar tetap, scroll sendiri
        const SizedBox(
          width: 340,
          child: SingleChildScrollView(
            padding: EdgeInsets.all(16),
            child: ProfileSummary(),
          ),
        ),
        const VerticalDivider(width: 1),
        // Panel kanan: memakai sisa ruang, scroll sendiri
        Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: CustomScrollView(
              slivers: [
                const SliverToBoxAdapter(child: SizedBox(height: 16)),
                ..._contentSlivers(),
                _bottomSpacer(context),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
```

### 🧪 Eksperimen 10 — Uji di berbagai ukuran

Jalankan di **Chrome** dan lebarkan jendela hingga melewati **840 dp**. Amati tiga hal:

1. Layout berpindah dari **satu kolom** ke **dua panel**.
2. Di panel kiri, `ProfileHeader` kembali ke susunan **atas-bawah** (ruangnya cuma ±308 dp) — padahal layar sangat lebar. Ini bukti `LayoutBuilder` di level komponen bekerja.
3. Jumlah kolom galeri **bertambah otomatis** tanpa kode tambahan.

Lalu uji juga di **emulator tablet** (buat AVD "Pixel Tablet" di Android Studio) dan **HP landscape**.

💡 **Praktik industri — checklist pengujian responsif** sebelum mengirim kode:

- [ ] HP kecil (~360 dp) dan HP besar (~430 dp)
- [ ] Landscape
- [ ] Tablet / jendela lebar
- [ ] Font size terbesar
- [ ] Keyboard terbuka
- [ ] Data panjang (teks judul 100 karakter, daftar 500 item)

---

## ✅ Rangkuman Pertemuan 2

| Konsep                            | Ringkasnya                                                              |
| --------------------------------- | ----------------------------------------------------------------------- |
| `ListView.builder`                | Daftar panjang yang lazy — standar untuk data dinamis.                  |
| `ListView` di `Column`            | Error _unbounded height_ → gunakan `Expanded` atau (lebih baik) Sliver. |
| `GridView` + `MaxCrossAxisExtent` | Grid responsif otomatis.                                                |
| `CustomScrollView` + Sliver       | Menggabungkan header, list, grid dalam satu scroll yang lazy.           |
| `LayoutBuilder` di level halaman  | Memilih layout satu kolom vs dua panel.                                 |

## ✅ Checkpoint 2 — Hasil Akhir

- [ ] Aplikasi berjalan tanpa error di emulator **dan** Chrome.
- [ ] Halaman punya bagian: profil, statistik, skill, **Proyek** (8 item), **Galeri** (24 gambar), **Hubungi Saya**.
- [ ] Seluruh halaman di-scroll dengan mulus (satu scroll di layout HP).
- [ ] Lebar ≥ 840 dp → muncul **dua panel** dengan scroll terpisah.
- [ ] Tidak ada overflow di portrait, landscape, maupun font size besar.
- [ ] Jumlah kolom galeri berubah mengikuti lebar.

---

## 🏆 Challenge Pertemuan 2

**⭐ Mudah**

1. Tambahkan 4 proyek baru ke `projects`. Beri ikon berbeda pada tiap proyek (tambahkan field `icon` di class `Project`).
2. Ganti galeri ke `SliverGridDelegateWithFixedCrossAxisCount` (3 kolom). Bandingkan perilakunya dengan `MaxCrossAxisExtent` saat jendela dilebarkan.

**⭐⭐ Sedang**

3. Ganti `Image.network` di `GalleryTile` dengan **`CachedNetworkImage`**.
4. Tambahkan **`RefreshIndicator`** (tarik untuk refresh) yang membungkus `CustomScrollView`. Gunakan `await Future.delayed(const Duration(seconds: 1))` sebagai simulasi.
5. Buat tombol **beralih tampilan** untuk daftar proyek: _List ↔ Grid_ (petunjuk: butuh `StatefulWidget` dari Modul 3).

**⭐⭐⭐ Sulit**

6. Tambahkan **`FloatingActionButton` "ke atas"** yang hanya muncul setelah scroll lebih dari 300 dp. Petunjuk: `ScrollController`, `addListener`, `animateTo`, dan **jangan lupa `dispose()`**.
7. Ganti `AppBar` dengan **`SliverAppBar`** yang mengecil saat di-scroll dan menampilkan foto profil sebagai latar (`FlexibleSpaceBar`).
8. Tambahkan tingkat layout **medium** (600–839 dp): tampilkan galeri 3 kolom tetap dan ringkasan profil bergaya `Row`. Gunakan `Breakpoints.medium` dan `Breakpoints.expanded`.

**🌟 Tantangan Bonus — Kreasi Bebas**

Ganti tema studi kasus menjadi **portofolio fotografer**, **profil toko**, atau **halaman katalog produk**, dengan aturan: wajib memakai **semua** widget yang dipelajari di modul ini, dan harus tampil baik di HP dan tablet.

---

## 🩺 Cheat Sheet Error Umum

| Pesan error                                                                            | Penyebab                                            | Solusi                                                    |
| -------------------------------------------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------- |
| `BOTTOM OVERFLOWED BY … PIXELS`                                                        | Konten lebih tinggi dari ruang, tidak bisa scroll   | Bungkus dengan scroll view, atau pakai `Flexible`/`Wrap`  |
| `Vertical viewport was given unbounded height`                                         | `ListView`/`GridView` di dalam `Column`/scroll view | `Expanded`, `shrinkWrap` (list kecil), atau **Sliver**    |
| `RenderFlex children have non-zero flex but incoming height constraints are unbounded` | `Expanded`/`Flexible` di dalam scroll view          | Hapus `Expanded`, beri tinggi tetap, atau ubah struktur   |
| `A RenderViewport expected a child of type RenderSliver`                               | Widget biasa di `slivers:`                          | Bungkus dengan `SliverToBoxAdapter`                       |
| Gambar tidak muncul di Android                                                         | Izin `INTERNET` belum ada (build rilis)             | Tambahkan di `AndroidManifest.xml`                        |
| Gambar tidak muncul di Chrome                                                          | Diblokir CORS                                       | Pakai `picsum.photos/seed/...`                            |
| Konten tertutup status bar/notch                                                       | Belum memakai `SafeArea`                            | Bungkus dengan `SafeArea` (di dalam scroll view jika ada) |

---

## 💡 Rangkuman Praktikum

1. **Jangan hardcode ukuran.** Andalkan constraints, `Expanded`/`Flexible`, `Wrap`, dan `clamp`.
2. **`MediaQuery` untuk keputusan layar, `LayoutBuilder` untuk keputusan komponen.**
3. Pakai **`MediaQuery.sizeOf`**, `paddingOf`, dll. — bukan `MediaQuery.of(context).size`.
4. **Satu sumber breakpoint** (`Breakpoints`), mengikuti Material 3 window size classes.
5. **Daftar panjang = `builder`.** `SingleChildScrollView` hanya untuk konten pendek.
6. **Halaman campuran = `CustomScrollView` + Sliver**, bukan `ListView` di dalam `Column`.
7. **Satu widget, satu file.** Pecah UI menjadi komponen kecil dan pakai `const`.
8. **Selalu beri `loading` dan `error` state** untuk gambar/data dari jaringan, dan pertimbangkan `cached_network_image`.
9. **Uji ekstrem:** font terbesar, teks panjang, landscape, tablet, keyboard terbuka.
10. Di dunia kerja kamu akan menemukan package seperti `flutter_screenutil` atau `responsive_framework`. Kuasai dulu dasar bawaan Flutter di modul ini, karena package tersebut dibangun di atasnya.

---

## 📚 Referensi

- Understanding constraints — <https://docs.flutter.dev/ui/layout/constraints>
- Adaptive & responsive design — <https://docs.flutter.dev/ui/adaptive-responsive>
- `SafeArea` — <https://api.flutter.dev/flutter/widgets/SafeArea-class.html>
- `MediaQuery` — <https://api.flutter.dev/flutter/widgets/MediaQuery-class.html>
- `LayoutBuilder` — <https://api.flutter.dev/flutter/widgets/LayoutBuilder-class.html>
- `SingleChildScrollView` — <https://api.flutter.dev/flutter/widgets/SingleChildScrollView-class.html>
- `ListView` — <https://api.flutter.dev/flutter/widgets/ListView-class.html>
- `GridView` — <https://api.flutter.dev/flutter/widgets/GridView-class.html>
- `CustomScrollView` — <https://api.flutter.dev/flutter/widgets/CustomScrollView-class.html>
- Material 3 window size classes — <https://m3.material.io/foundations/layout/applying-layout/window-size-classes>

---

**Selamat!** 🎉 Kamu sekarang bisa membuat halaman yang **aman di semua layar, mulus di-scroll, dan adaptif** dari HP sampai tablet.
