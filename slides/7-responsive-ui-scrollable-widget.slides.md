---
theme: default
title: Modul 5 — Responsive UI & Scrollable Widget
info: |
  Praktikum Mobile Programming · Flutter & Dart
  Durasi: 2 × 4 jam · Lanjutan dari Modul 4 (UI & Layout)
class: text-center
transition: slide-left
mdc: true
lineNumbers: true
drawings:
  persist: false
---

# Modul 5

## Responsive UI & Scrollable Widget

Praktikum Mobile Programming · Flutter & Dart

Durasi: 2 × 4 jam · Lanjutan dari Modul 4 (UI & Layout)

📄 Modul lengkap: [github.com/iffakhry/mobile-app-jti](https://github.com/iffakhry/mobile-app-jti/blob/main/7-responsive-ui-scrollable-widget.md)

---

## class: text-xs leading-snug

# 🎯 Tujuan Pembelajaran

Setelah menyelesaikan modul ini, kamu mampu:

1. Menjelaskan **kenapa overflow terjadi** dan bagaimana aturan _constraints_ Flutter bekerja
2. Menggunakan **`SafeArea`** agar konten tidak tertutup notch/status bar/gesture bar
3. Membaca informasi layar dengan **`MediaQuery`** — dan tahu kapan **tidak** perlu memakainya
4. Membuat komponen adaptif dengan **`LayoutBuilder`**
5. Membuat halaman scroll dengan **`SingleChildScrollView`**, **`ListView`**, **`GridView`**
6. Menggabungkan konten scroll dengan **`CustomScrollView` + Sliver**
7. Menghasilkan aplikasi yang tampil baik di **HP, landscape, dan tablet**

---

## class: text-sm leading-snug

# 📦 Yang Akan Kamu Bangun

Kartu Profil Digital (Modul 4) berkembang jadi **halaman profil lengkap** yang responsif:

- Foto profil + statistik + skill chips
- Daftar proyek (list)
- Galeri foto (grid)
- Form kontak

<div class="grid grid-cols-2 gap-4 mt-4">
<div>

**HP (portrait)**
Satu kolom, semua bagian ditumpuk & di-scroll bersama

</div>
<div>

**Tablet / layar lebar (≥ 840 dp)**
Dua panel, masing-masing scroll sendiri

</div>
</div>

---

## class: text-xs leading-snug

# 🧭 Timeline — Pertemuan 1 (4 jam)

| Bagian                             | Durasi |
| ---------------------------------- | ------ |
| 0 — Persiapan & titik awal         | 15 mnt |
| 1 — Kenapa UI harus responsif?     | 20 mnt |
| 2 — `SafeArea`                     | 30 mnt |
| 3 — `MediaQuery`                   | 40 mnt |
| 4 — `LayoutBuilder`                | 40 mnt |
| 5 — `SingleChildScrollView`        | 40 mnt |
| Istirahat                          | 15 mnt |
| Rangkuman, Checkpoint 1, Challenge | 40 mnt |

---

## class: text-xs leading-snug

# 🧭 Timeline — Pertemuan 2 (4 jam)

| Bagian                                           | Durasi |
| ------------------------------------------------ | ------ |
| 6 — `ListView`                                   | 50 mnt |
| 7 — Masalah klasik: `ListView` di dalam `Column` | 20 mnt |
| 8 — `GridView`                                   | 50 mnt |
| Istirahat                                        | 15 mnt |
| 9 — `CustomScrollView` & Sliver                  | 35 mnt |
| 10 — Layout dua panel untuk layar lebar          | 25 mnt |
| Checkpoint 2                                     | 10 mnt |
| Challenge                                        | 35 mnt |

---

## class: text-xs leading-snug

# 🧰 Prasyarat & 🏷️ Cara Membaca Modul

**Prasyarat**

- Flutter SDK **3.27+** (`flutter --version`)
- Sudah paham `Row`, `Column`, `Stack`, `Expanded`, `Padding`, `SizedBox`, `Card` (Modul 4)
- Emulator Android + Chrome siap dipakai

**Ikon**

| Ikon   | Arti                                   |
| ------ | -------------------------------------- |
| 🧪     | Eksperimen — tebak dulu, baru jalankan |
| 💡     | Praktik industri                       |
| ⚠️     | Awas — kesalahan umum                  |
| ✅     | Checkpoint                             |
| ⭐⭐⭐ | Challenge (mudah → sulit)              |

---

## layout: section

# 📅 Pertemuan 1

---

## class: text-sm leading-snug

# Bagian 0 — Persiapan (15 menit)

Buat project baru agar semua mulai dari kondisi yang sama:

```bash
flutter create profil_digital
cd profil_digital
```

💡 **Kenapa dipecah ke banyak file?** Satu widget = satu file → lebih mudah dibaca, dites, dikerjakan tim.

---

## class: text-sm leading-snug

# Bagian 0 — Struktur Folder

```
lib/
├── main.dart
├── core/breakpoints.dart      (Bagian 4)
├── data/dummy_data.dart       (Bagian 6)
├── pages/profile_page.dart
└── widgets/
    ├── profile_header.dart
    ├── stats_row.dart
    └── skill_chips.dart
```

📎 [Lihat kode lengkap →](https://github.com/iffakhry/mobile-app-jti/blob/main/7-responsive-ui-scrollable-widget.md#bagian-0--persiapan-15-menit)

---

## class: text-sm leading-snug

# Bagian 1 — Kenapa UI Harus Responsif? (20 menit)

🧪 **Eksperimen:** rotasi emulator ke landscape → muncul garis kuning-hitam `BOTTOM OVERFLOWED BY … PIXELS`.

**Kenapa?** `Column` tidak bisa scroll — saat tinggi konten melebihi layar, tidak ada tempat untuk sisanya.

### Aturan layout Flutter

> **Constraints go down. Sizes go up. Parent sets position.**

---

## class: text-sm leading-snug

# Bagian 1 — Peta Alat di Modul Ini

| Kebutuhan                        | Alat                                                                |
| -------------------------------- | ------------------------------------------------------------------- |
| Hindari area tertutup sistem     | `SafeArea`                                                          |
| Ukuran & kondisi layar/perangkat | `MediaQuery`                                                        |
| Ruang yang diberikan induk       | `LayoutBuilder`                                                     |
| Konten lebih panjang dari layar  | `SingleChildScrollView`, `ListView`, `GridView`, `CustomScrollView` |

📎 [Detail eksperimen & peta alat →](https://github.com/iffakhry/mobile-app-jti/blob/main/7-responsive-ui-scrollable-widget.md#bagian-1--kenapa-ui-harus-responsif-20-menit)

---

## class: text-sm leading-snug

# Bagian 2 — SafeArea (30 menit)

Menambahkan padding otomatis agar konten tidak tertutup **notch, status bar, gesture bar**.

```dart
return Scaffold(
  body: SafeArea(
    child: Padding(/* ...konten... */),
  ),
);
```

⚠️ Untuk halaman **scroll**, letakkan `SafeArea` **di dalam** scroll view, bukan membungkusnya.

---

## class: text-sm leading-snug

# Bagian 2 — Kapan `SafeArea` Dibutuhkan?

| Situasi                                | Perlu?                   |
| -------------------------------------- | ------------------------ |
| `Scaffold` dengan `AppBar`             | Sudah ditangani `AppBar` |
| Halaman tanpa `AppBar` (login, splash) | ✅ Ya                    |
| Tombol/bar custom di bawah layar       | ✅ Ya                    |
| Landscape di perangkat ber-notch       | ✅ Ya (kiri/kanan)       |

📎 [Kode lengkap + opsi `top`/`bottom`/`minimum` →](https://github.com/iffakhry/mobile-app-jti/blob/main/7-responsive-ui-scrollable-widget.md#bagian-2--safearea-30-menit)

---

## class: text-sm leading-snug

# Bagian 3 — MediaQuery (40 menit)

Info tentang **layar dan pengaturan perangkat**.

| Method                              | Isinya                 |
| ----------------------------------- | ---------------------- |
| `MediaQuery.sizeOf(context)`        | Ukuran layar (dp)      |
| `MediaQuery.orientationOf(context)` | portrait / landscape   |
| `MediaQuery.paddingOf(context)`     | Area aman sistem       |
| `MediaQuery.viewInsetsOf(context)`  | Area tertutup keyboard |

---

## class: text-sm leading-snug

# Bagian 3 — Catatan Penting

💡 Pakai `MediaQuery.sizeOf(context)`, **bukan** `.of(context).size` — `sizeOf` hanya rebuild saat ukuran berubah.

⚠️ Jangan panggil `MediaQuery` di `initState` — panggil di `build()`.

📎 [Kode `ScreenInfo` panel debug + avatar responsif →](https://github.com/iffakhry/mobile-app-jti/blob/main/7-responsive-ui-scrollable-widget.md#bagian-3--mediaquery-40-menit)

---

## class: text-sm leading-snug

# Bagian 4 — LayoutBuilder (40 menit)

`MediaQuery` → _"Seberapa besar layar perangkat?"_
`LayoutBuilder` → _"Berapa ruang yang **diberikan induk**?"_

|             | `MediaQuery`    | `LayoutBuilder`        |
| ----------- | --------------- | ---------------------- |
| Sumber data | Layar/perangkat | Constraints dari induk |
| Cocok untuk | Level halaman   | Level komponen         |

---

## class: text-sm leading-snug

# Bagian 4 — Header Adaptif

```dart {all|3|5-6}
return LayoutBuilder(
  builder: (context, constraints) {
    final isWide = constraints.maxWidth >= 480;
    return isWide
        ? Row(children: [avatar, Expanded(child: info)])
        : Column(children: [avatar, info]);
  },
);
```

💡 Breakpoint dipusatkan dalam satu class `Breakpoints` (medium: 600, expanded: 840).

📎 [Kode lengkap `breakpoints.dart` + header adaptif →](https://github.com/iffakhry/mobile-app-jti/blob/main/7-responsive-ui-scrollable-widget.md#bagian-4--layoutbuilder-40-menit)

---

## class: text-sm leading-snug

# Bagian 5 — SingleChildScrollView (40 menit)

Membuat **satu anak** bisa di-scroll. Cocok untuk konten **pendek dan statis**.

```dart
body: SingleChildScrollView(
  keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
  child: SafeArea(
    child: Padding(/* ...semua section... */),
  ),
),
```

⚠️ `Expanded`/`Flexible` **tidak boleh** langsung di dalam `Column` di dalam `SingleChildScrollView`.

---

## class: text-sm leading-snug

# Bagian 5 — Kapan Memakainya?

| ✅ Cocok                            | ❌ Tidak cocok                       |
| ----------------------------------- | ------------------------------------ |
| Form, halaman detail, konten pendek | Daftar panjang (puluhan–ribuan item) |
| Jumlah anak sedikit & tetap         | Data dari API/database               |

📎 [Kode lengkap `ContactSection` + solusi scroll →](https://github.com/iffakhry/mobile-app-jti/blob/main/7-responsive-ui-scrollable-widget.md#bagian-5--singlechildscrollview-40-menit)

---

## class: text-sm leading-snug

# ✅ Rangkuman Pertemuan 1

| Widget                  | Satu kalimat                                         |
| ----------------------- | ---------------------------------------------------- |
| `SafeArea`              | Menjauhkan konten dari area tertutup sistem          |
| `MediaQuery`            | Info layar & perangkat (`sizeOf`, `paddingOf`, dll.) |
| `LayoutBuilder`         | Info ruang dari induk — dasar komponen adaptif       |
| `SingleChildScrollView` | Scroll untuk konten pendek & statis                  |

---

## class: text-sm leading-snug

# ✅ Checkpoint 1

Sebelum lanjut, pastikan:

- Tidak ada overflow saat landscape
- Header berubah bentuk saat jendela dilebarkan
- Mengetuk `TextField` tidak menyebabkan overflow

📎 [Checklist lengkap →](https://github.com/iffakhry/mobile-app-jti/blob/main/7-responsive-ui-scrollable-widget.md#-checkpoint-1)

---

## class: text-sm leading-snug

# 🏆 Challenge Pertemuan 1

**⭐ Mudah** — `ScreenInfo` hanya di debug mode; warna latar berubah saat landscape

**⭐⭐ Sedang** — extension `ScreenX` (`isCompact`, dst.); `StatsRow` pakai `Wrap` agar tahan `textScale` 2.0

**⭐⭐⭐ Sulit** — uji font size terbesar & perbaiki overflow; batasi lebar konten dengan `ConstrainedBox(maxWidth: 640)`

📎 [Detail challenge →](https://github.com/iffakhry/mobile-app-jti/blob/main/7-responsive-ui-scrollable-widget.md#-challenge-pertemuan-1)

---

## layout: section

# 📅 Pertemuan 2

---

## class: text-sm leading-snug

# Bagian 6 — Peta Widget Scrollable

| Widget                      | Untuk apa              | Lazy? |
| --------------------------- | ---------------------- | ----- |
| `SingleChildScrollView`     | Konten pendek & statis | ❌    |
| `ListView(children: [...])` | Daftar pendek          | ❌    |
| `ListView.builder`          | Daftar panjang/dinamis | ✅    |
| `GridView.builder`          | Grid panjang           | ✅    |
| `CustomScrollView` + Sliver | Gabungan konten scroll | ✅    |

---

## class: text-sm leading-snug

# Bagian 6 — ListView (50 menit)

🧪 **Eksperimen:** `ListView.builder` hanya cetak belasan `build item` di awal; `ListView` biasa langsung cetak **1000 baris sekaligus**.

💡 Pisahkan item jadi widget sendiri (`ProjectTile`), beri `key: ValueKey(id)` untuk data yang bisa berubah urutan, batasi teks dengan `maxLines` + `overflow`.

📎 [Kode data dummy + `ProjectTile` + 3 constructor ListView →](https://github.com/iffakhry/mobile-app-jti/blob/main/7-responsive-ui-scrollable-widget.md#bagian-6--listview-50-menit)

---

## class: text-sm leading-snug

# Bagian 7 — `ListView` di dalam `Column` (20 menit)

🧪 Menaruh `ListView.builder` langsung di `Column` (dalam `SingleChildScrollView`) → error:

```
Vertical viewport was given unbounded height.
```

**Kenapa?** `ListView` ingin setinggi mungkin, tapi induknya memberi tinggi **tak terbatas**.

---

## class: text-sm leading-snug

# Bagian 7 — Tiga Solusi

| Solusi              | Cara                             | Catatan                                      |
| ------------------- | -------------------------------- | -------------------------------------------- |
| **A.** `Expanded`   | Bungkus `ListView`               | Hanya jika `Column` **tidak** di scroll view |
| **B.** `shrinkWrap` | + `NeverScrollableScrollPhysics` | Cepat tapi **kehilangan sifat lazy**         |
| **C.** **Sliver**   | `CustomScrollView`               | ✅ Solusi standar industri (Bagian 9)        |

📎 [Kode solusi B lengkap →](https://github.com/iffakhry/mobile-app-jti/blob/main/7-responsive-ui-scrollable-widget.md#bagian-7--masalah-klasik-listview-di-dalam-column-20-menit)

---

## class: text-sm leading-snug

# Bagian 8 — GridView (50 menit)

`GridView` menampilkan item dalam **kolom-kolom** — galeri, katalog, menu.

### Dua pilihan `gridDelegate`

|               | `FixedCrossAxisCount`  | `MaxCrossAxisExtent`         |
| ------------- | ---------------------- | ---------------------------- |
| Jumlah kolom  | Selalu sama            | Bertambah saat layar melebar |
| Kapan dipakai | Layout harus konsisten | **Responsif otomatis** ✅    |

---

## class: text-sm leading-snug

# Bagian 8 — Catatan Penting

⚠️ Gambar tak tampil? Izin `INTERNET` (Android release) & CORS (Chrome) → pakai `picsum.photos/seed/...`. Container tanpa `child`/`height` = tinggi 0.

💡 Untuk cache gambar jaringan di aplikasi nyata: package `cached_network_image`.

📎 [Kode `GalleryTile`, delegate, & penanganan error gambar →](https://github.com/iffakhry/mobile-app-jti/blob/main/7-responsive-ui-scrollable-widget.md#bagian-8--gridview-50-menit)

---

## class: text-sm leading-snug

# Bagian 9 — CustomScrollView & Sliver (35 menit)

**Sliver** = "potongan" dari satu area scroll — digabung jadi **satu scroll tunggal yang tetap lazy**.

| Sliver               | Padanannya                              |
| -------------------- | --------------------------------------- |
| `SliverToBoxAdapter` | Widget biasa (header, judul)            |
| `SliverList`         | `ListView`                              |
| `SliverGrid`         | `GridView`                              |
| `SliverAppBar`       | `AppBar` yang bisa mengecil saat scroll |

---

## class: text-sm leading-snug

# Bagian 9 — Contoh Kode

```dart {all|4-6|8}
CustomScrollView(
  slivers: [
    const SliverToBoxAdapter(child: ProfileSummary()),
    SliverPadding(
      sliver: SliverList.separated(/* ...ProjectTile... */),
    ),
    SliverPadding(
      sliver: SliverGrid.builder(/* ...GalleryTile... */),
    ),
  ],
)
```

⚠️ `CustomScrollView` hanya menerima **sliver**; widget biasa dibungkus `SliverToBoxAdapter`.

📎 [Kode lengkap `ProfilePage` versi Sliver →](https://github.com/iffakhry/mobile-app-jti/blob/main/7-responsive-ui-scrollable-widget.md#bagian-9--customscrollview--sliver-35-menit)

---

## class: text-sm leading-snug

# Bagian 10 — Layout Dua Panel (25 menit)

Di tablet/landscape lebar, satu kolom terlalu renggang → **dua panel**, masing-masing scroll sendiri.

```dart {all|3-4}
child: LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth >= Breakpoints.expanded) {
      return const _TwoPaneLayout();
    }
    return const _SinglePaneLayout();
  },
),
```

---

## class: text-sm leading-snug

# Bagian 10 — Catatan Penting

🧪 **Eksperimen:** lebarkan jendela Chrome melewati **840 dp** → layout berpindah ke dua panel; jumlah kolom galeri bertambah otomatis.

💡 **Checklist pengujian responsif:** HP kecil & besar, landscape, tablet, font terbesar, keyboard terbuka, data panjang.

📎 [Kode lengkap `_TwoPaneLayout` →](https://github.com/iffakhry/mobile-app-jti/blob/main/7-responsive-ui-scrollable-widget.md#bagian-10--layout-dua-panel-untuk-layar-lebar-25-menit)

---

## class: text-sm leading-snug

# ✅ Rangkuman Pertemuan 2

| Konsep                            | Ringkasnya                                 |
| --------------------------------- | ------------------------------------------ |
| `ListView.builder`                | Daftar panjang yang lazy                   |
| `ListView` di `Column`            | Error _unbounded_ → `Expanded` atau Sliver |
| `GridView` + `MaxCrossAxisExtent` | Grid responsif otomatis                    |
| `CustomScrollView` + Sliver       | Header + list + grid, satu scroll lazy     |

---

## class: text-sm leading-snug

# ✅ Checkpoint 2 — Hasil Akhir

- Profil, statistik, skill, Proyek (8), Galeri (24), Kontak tampil
- Lebar ≥ 840 dp → muncul dua panel
- Tidak ada overflow di portrait, landscape, atau font besar

📎 [Checklist lengkap →](https://github.com/iffakhry/mobile-app-jti/blob/main/7-responsive-ui-scrollable-widget.md#-checkpoint-2--hasil-akhir)

---

## class: text-sm leading-snug

# 🏆 Challenge Pertemuan 2

**⭐ Mudah** — 4 proyek baru + ikon per proyek; ganti galeri ke `FixedCrossAxisCount` (3 kolom)

**⭐⭐ Sedang** — `CachedNetworkImage`; `RefreshIndicator`; toggle tampilan List ↔ Grid

**⭐⭐⭐ Sulit** — FAB "ke atas" setelah scroll 300 dp; `SliverAppBar` + `FlexibleSpaceBar`; breakpoint medium (600–839 dp)

📎 [Detail challenge & bonus →](https://github.com/iffakhry/mobile-app-jti/blob/main/7-responsive-ui-scrollable-widget.md#-challenge-pertemuan-2)

---

## class: text-sm leading-snug

# 🩺 Cheat Sheet Error Umum (1/2)

| Pesan error                   | Solusi                                |
| ----------------------------- | ------------------------------------- |
| `BOTTOM OVERFLOWED`           | Scroll view / `Flexible`/`Wrap`       |
| `unbounded height`            | `Expanded`, `shrinkWrap`, atau Sliver |
| `non-zero flex ... unbounded` | Hapus `Expanded` / beri tinggi tetap  |
| `expected RenderSliver`       | Bungkus `SliverToBoxAdapter`          |

---

## class: text-sm leading-snug

# 🩺 Cheat Sheet Error Umum (2/2)

| Masalah                          | Solusi                                |
| -------------------------------- | ------------------------------------- |
| Gambar tak muncul (Android)      | Tambahkan izin `INTERNET` di manifest |
| Gambar tak muncul (Chrome)       | Pakai `picsum.photos/seed/...` (CORS) |
| Konten tertutup status bar/notch | Bungkus dengan `SafeArea`             |

📎 [Tabel lengkap →](https://github.com/iffakhry/mobile-app-jti/blob/main/7-responsive-ui-scrollable-widget.md#-cheat-sheet-error-umum)

---

## class: text-sm leading-snug

# 💡 Rangkuman Praktikum (1/2)

1. **Jangan hardcode ukuran** — andalkan constraints, `Expanded`/`Flexible`, `Wrap`, `clamp`
2. `MediaQuery` untuk keputusan **layar**, `LayoutBuilder` untuk keputusan **komponen**
3. Pakai `MediaQuery.sizeOf`, `paddingOf` — bukan `.of(context).size`
4. **Satu sumber breakpoint** (`Breakpoints`), mengikuti Material 3 window size classes

---

## class: text-sm leading-snug

# 💡 Rangkuman Praktikum (2/2)

5. **Daftar panjang = `builder`**; `SingleChildScrollView` hanya untuk konten pendek
6. **Halaman campuran = `CustomScrollView` + Sliver**, bukan `ListView` di dalam `Column`
7. **Satu widget, satu file** — pecah UI jadi komponen kecil, pakai `const`
8. Selalu beri **`loading`/`error` state** untuk gambar/data dari jaringan

📎 [Bagian lengkap (poin 9–10) →](https://github.com/iffakhry/mobile-app-jti/blob/main/7-responsive-ui-scrollable-widget.md#-rangkuman-praktikum)

---

## class: text-sm leading-snug

# 📚 Referensi (1/2)

- [Understanding constraints](https://docs.flutter.dev/ui/layout/constraints)
- [Adaptive & responsive design](https://docs.flutter.dev/ui/adaptive-responsive)
- [`SafeArea`](https://api.flutter.dev/flutter/widgets/SafeArea-class.html)
- [`MediaQuery`](https://api.flutter.dev/flutter/widgets/MediaQuery-class.html)
- [`LayoutBuilder`](https://api.flutter.dev/flutter/widgets/LayoutBuilder-class.html)

---

## class: text-sm leading-snug

# 📚 Referensi (2/2)

- [`SingleChildScrollView`](https://api.flutter.dev/flutter/widgets/SingleChildScrollView-class.html)
- [`ListView`](https://api.flutter.dev/flutter/widgets/ListView-class.html)
- [`GridView`](https://api.flutter.dev/flutter/widgets/GridView-class.html)
- [`CustomScrollView`](https://api.flutter.dev/flutter/widgets/CustomScrollView-class.html)
- [Material 3 window size classes](https://m3.material.io/foundations/layout/applying-layout/window-size-classes)

---

## class: text-center

# Selamat! 🎉

Kamu sekarang bisa membuat halaman yang **aman di semua layar, mulus di-scroll, dan adaptif** dari HP sampai tablet.

📄 Modul lengkap: [7-responsive-ui-scrollable-widget.md](https://github.com/iffakhry/mobile-app-jti/blob/main/7-responsive-ui-scrollable-widget.md)
