# Modul 9 — Struktur Navigasi: Drawer & BottomNavigationBar

**Mata Kuliah:** Pemrograman Mobile (Flutter & Dart)
**Durasi:** 2 pertemuan × 4 jam
**Studi Kasus:** Kartu Profil Digital (lanjutan Modul 1–8)

---

## 🎯 Tujuan Pembelajaran

Setelah menyelesaikan modul ini, kamu mampu:

1. Menjelaskan **hierarki navigasi** aplikasi mobile dan kapan memakai Drawer, BottomNavigationBar, atau `Navigator.push`.
2. Membuat **Drawer** lengkap dengan header, menu, dan aksi (navigasi, dialog, snackbar).
3. Membuat **BottomNavigationBar** dengan beberapa tab yang **state-nya tetap terjaga** (`IndexedStack`).
4. Menyusun **App Shell**: satu `Scaffold` induk yang mengatur AppBar, Drawer, dan tab.
5. Menerapkan praktik industri: *single source of truth* untuk destinasi, Material 3 `NavigationBar`, penanganan tombol back (`PopScope`), dan layout adaptif (`NavigationRail`).

## 📦 Hasil Akhir

Aplikasi **Kartu Profil Digital** dengan:

- **Bottom navigation** 4 tab: Beranda · Proyek · Kontak · Pengaturan
- **Drawer** berisi header profil, pintasan, "Tentang Aplikasi", dan "Keluar"
- **Halaman detail proyek** yang dibuka dari tab Proyek
- Tampil **Bottom Bar di HP** dan **Navigation Rail di layar lebar** (tablet/Chrome)

**Prasyarat:** kamu sudah memahami `Scaffold`, `ListView`, `StatefulWidget`, `setState`, `Navigator.push/pop` (Modul 3–8).

---

## 📚 Bagian 1 — Konsep Dasar Navigasi

### 1.1 Peta Navigasi Aplikasi

Aplikasi mobile punya **tingkatan navigasi**. Pahami ini dulu sebelum menulis kode:

```
Aplikasi
│
├── Level 1: Destinasi UTAMA (sering dipakai, 3–5 item)
│     └── BottomNavigationBar / NavigationBar
│           [Beranda] [Proyek] [Kontak] [Pengaturan]
│
├── Level 2: Destinasi SEKUNDER (jarang dipakai)
│     └── Drawer
│           Tentang Aplikasi, Bantuan, Keluar
│
└── Level 3: Halaman DETAIL (konten dari item tertentu)
      └── Navigator.push → ada tombol back
            Detail Proyek
```

### 1.2 Kapan Memakai Apa?

| Komponen | Cocok untuk | Jumlah item | Kelebihan | Kekurangan |
|---|---|---|---|---|
| **BottomNavigationBar** | Destinasi utama yang sering dibuka | 3–5 | Terjangkau ibu jari, selalu terlihat | Tidak muat untuk banyak menu |
| **Drawer** | Menu sekunder, pengaturan akun | Banyak | Muat banyak menu | Tersembunyi (kurang *discoverable*) |
| **Navigator.push** | Halaman detail, form, alur linear | — | Sederhana, ada animasi & tombol back | Bukan untuk perpindahan antar menu utama |

> 💡 **Insight industri:** Aplikasi modern (Instagram, Tokopedia, Gojek) menaruh menu **utama di bottom bar**. Drawer dipakai untuk menu **sekunder** saja. Menu penting yang disembunyikan di drawer cenderung jarang dibuka pengguna.

### 1.3 Anatomi Drawer

- Dipasang pada properti `drawer` milik `Scaffold`.
- Jika `AppBar` ada, ikon **hamburger (☰)** muncul **otomatis**.
- Terbuka dengan geser dari tepi kiri atau tap ikon hamburger.
- Ditutup dengan `Navigator.pop(context)`. Drawer diperlakukan seperti "halaman sementara".

### 1.4 Anatomi BottomNavigationBar

- Dipasang pada properti `bottomNavigationBar` milik `Scaffold`.
- Butuh dua hal: `currentIndex` (tab aktif) dan `onTap` (saat tab dipilih).
- Perpindahan tab **bukan** perpindahan halaman lewat Navigator. Kamu hanya mengganti **widget yang ditampilkan** di `body` berdasarkan index.
- `StatefulWidget` menyimpan index tab aktif di sebuah variabel.

```
User tap tab → onTap(index) → setState(_indeks = index) → body menampilkan halaman ke-index
```

### 1.5 Konsep Kunci: App Shell

**App Shell** adalah satu widget (biasanya `Scaffold`) yang menjadi "cangkang" aplikasi: menyimpan AppBar, Drawer, dan BottomNavigationBar. Halaman-halaman tab hanya mengisi `body`.

> ⚠️ **Aturan emas:** Halaman di dalam tab **tidak** membuat `Scaffold` + `AppBar` sendiri. Kalau dibuat, aplikasimu akan punya **dua AppBar bertumpuk**. AppBar dikelola oleh shell.

---

## 🗂️ Struktur Project

Susun folder `lib/` seperti ini. Struktur rapi sejak awal adalah kebiasaan industri:

```
lib/
├── main.dart
├── app_shell.dart            ← Scaffold induk (Drawer + BottomNav)
├── data/
│   ├── destinasi.dart        ← daftar tab (single source of truth)
│   └── proyek_data.dart      ← model & data proyek
├── pages/
│   ├── beranda_page.dart
│   ├── proyek_page.dart
│   ├── proyek_detail_page.dart
│   ├── kontak_page.dart
│   ├── pengaturan_page.dart
│   └── tentang_page.dart
└── widgets/
    └── app_drawer.dart
```

---

# 🗓️ PERTEMUAN 1 (4 Jam) — Drawer & BottomNavigationBar

| Waktu | Kegiatan |
|---|---|
| 0:00 – 0:30 | Membaca Bagian 1 + diskusi singkat |
| 0:30 – 0:55 | **Lab 1** — Menyiapkan project & halaman-halaman |
| 0:55 – 1:45 | **Lab 2** — Drawer |
| 1:45 – 1:55 | Istirahat |
| 1:55 – 2:35 | **Lab 3** — BottomNavigationBar |
| 2:35 – 3:05 | **Lab 4** — Menjaga state tab (`IndexedStack`) |
| 3:05 – 3:50 | **Challenge Pertemuan 1** |
| 3:50 – 4:00 | Rangkuman & checklist |

---

## 🧪 Lab 1 — Menyiapkan Project & Halaman (25 menit)

Kamu akan membuat halaman-halaman sederhana lebih dulu agar fokus berikutnya hanya pada navigasi.

> 📌 Jika kamu sudah punya halaman profil dari modul sebelumnya, boleh dipakai sebagai isi `BerandaPage`. Syaratnya: **hapus `Scaffold` dan `AppBar`-nya**, sisakan isinya saja.

### Langkah 1 — Buat project

```bash
flutter create kartu_profil_navigasi
cd kartu_profil_navigasi
```

Atau lanjutkan project Kartu Profil Digital dari modul sebelumnya. Lalu buat folder `data`, `pages`, dan `widgets` di dalam `lib/`.

### Langkah 2 — Data proyek (`lib/data/proyek_data.dart`)

```dart
import 'package:flutter/material.dart';

class Proyek {
  final String judul;
  final String deskripsi;
  final IconData ikon;

  const Proyek({
    required this.judul,
    required this.deskripsi,
    required this.ikon,
  });
}

const daftarProyek = [
  Proyek(
    judul: 'Aplikasi Absensi Kampus',
    deskripsi: 'Presensi mahasiswa berbasis lokasi.',
    ikon: Icons.fingerprint,
  ),
  Proyek(
    judul: 'Katalog UMKM',
    deskripsi: 'Etalase produk UMKM lokal dengan pencarian.',
    ikon: Icons.storefront,
  ),
  Proyek(
    judul: 'Pengingat Belajar',
    deskripsi: 'Jadwal belajar dengan notifikasi harian.',
    ikon: Icons.alarm,
  ),
  Proyek(
    judul: 'Catatan Keuangan',
    deskripsi: 'Mencatat pemasukan dan pengeluaran harian.',
    ikon: Icons.account_balance_wallet,
  ),
];
```

### Langkah 3 — Halaman Beranda (`lib/pages/beranda_page.dart`)

```dart
import 'package:flutter/material.dart';

class BerandaPage extends StatelessWidget {
  const BerandaPage({super.key});

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context).textTheme;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                const CircleAvatar(
                  radius: 48,
                  backgroundImage: NetworkImage(
                    'https://picsum.photos/seed/profile/300/300',
                  ),
                ),
                const SizedBox(height: 16),
                Text('Fakhry Firdaus', style: tema.headlineSmall),
                const SizedBox(height: 4),
                Text('Software Engineer', style: tema.bodyMedium),
                const SizedBox(height: 12),
                const Text(
                  'Membangun aplikasi mobile dengan Flutter dan suka berbagi ilmu.',
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
```

> ⚠️ **Pitfall:** Gambar tidak muncul di Android? Pastikan izin internet ada di `android/app/src/main/AndroidManifest.xml`:
> `<uses-permission android:name="android.permission.INTERNET"/>` (letakkan di atas tag `<application>`).
> Jalankan di Chrome dan gambar gagal dimuat? Itu masalah CORS. Gunakan `picsum.photos` seperti di atas.

### Langkah 4 — Halaman Proyek (`lib/pages/proyek_page.dart`)

```dart
import 'package:flutter/material.dart';
import '../data/proyek_data.dart';
import 'proyek_detail_page.dart';

class ProyekPage extends StatelessWidget {
  const ProyekPage({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      itemCount: daftarProyek.length,
      separatorBuilder: (context, index) => const Divider(height: 1),
      itemBuilder: (context, index) {
        final proyek = daftarProyek[index];
        return ListTile(
          leading: CircleAvatar(child: Icon(proyek.ikon)),
          title: Text(proyek.judul),
          subtitle: Text(proyek.deskripsi),
          trailing: const Icon(Icons.chevron_right),
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => ProyekDetailPage(proyek: proyek),
            ),
          ),
        );
      },
    );
  }
}
```

### Langkah 5 — Halaman Detail (`lib/pages/proyek_detail_page.dart`)

Halaman detail **boleh** punya `Scaffold` sendiri karena ia halaman penuh (dibuka lewat `Navigator.push`), bukan isi tab.

```dart
import 'package:flutter/material.dart';
import '../data/proyek_data.dart';

class ProyekDetailPage extends StatelessWidget {
  final Proyek proyek;

  const ProyekDetailPage({super.key, required this.proyek});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(proyek.judul)),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(proyek.ikon, size: 64),
            const SizedBox(height: 16),
            Text(
              proyek.judul,
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(proyek.deskripsi),
          ],
        ),
      ),
    );
  }
}
```

### Langkah 6 — Halaman Kontak (`lib/pages/kontak_page.dart`)

```dart
import 'package:flutter/material.dart';

class KontakPage extends StatelessWidget {
  const KontakPage({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: const [
        ListTile(
          leading: Icon(Icons.email_outlined),
          title: Text('Email'),
          subtitle: Text('fakhry@example.com'),
        ),
        ListTile(
          leading: Icon(Icons.code),
          title: Text('GitHub'),
          subtitle: Text('github.com/fakhry'),
        ),
        ListTile(
          leading: Icon(Icons.link),
          title: Text('LinkedIn'),
          subtitle: Text('linkedin.com/in/fakhry'),
        ),
      ],
    );
  }
}
```

### Langkah 7 — Halaman Pengaturan (`lib/pages/pengaturan_page.dart`)

Halaman ini sengaja dibuat **stateful**. Nanti kamu akan memakainya untuk membuktikan bahwa state tab bisa hilang.

```dart
import 'package:flutter/material.dart';

class PengaturanPage extends StatefulWidget {
  const PengaturanPage({super.key});

  @override
  State<PengaturanPage> createState() => _PengaturanPageState();
}

class _PengaturanPageState extends State<PengaturanPage> {
  bool _notifikasi = false;
  bool _profilPublik = true;

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        SwitchListTile(
          title: const Text('Notifikasi'),
          value: _notifikasi,
          onChanged: (nilai) => setState(() => _notifikasi = nilai),
        ),
        SwitchListTile(
          title: const Text('Profil Publik'),
          value: _profilPublik,
          onChanged: (nilai) => setState(() => _profilPublik = nilai),
        ),
      ],
    );
  }
}
```

### Langkah 8 — Halaman Tentang (`lib/pages/tentang_page.dart`)

```dart
import 'package:flutter/material.dart';

class TentangPage extends StatelessWidget {
  const TentangPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tentang Aplikasi')),
      body: const Center(
        child: Text('Kartu Profil Digital v1.0'),
      ),
    );
  }
}
```

### ✅ Checkpoint Lab 1

Belum ada yang bisa dijalankan sebagai aplikasi utuh. Pastikan **tidak ada error merah** di VS Code (kecuali `AppShell` yang belum dibuat). Lanjut ke Lab 2.

---

## 🧪 Lab 2 — Drawer (50 menit)

### Langkah 1 — Buat shell sederhana dengan Drawer

Buat `lib/app_shell.dart`. Untuk sementara `body` menampilkan `BerandaPage`:

```dart
import 'package:flutter/material.dart';
import 'pages/beranda_page.dart';

class AppShell extends StatelessWidget {
  const AppShell({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Kartu Profil Digital')),
      drawer: const Drawer(
        child: Center(child: Text('Isi drawer')),
      ),
      body: const BerandaPage(),
    );
  }
}
```

### Langkah 2 — Sambungkan di `lib/main.dart`

```dart
import 'package:flutter/material.dart';
import 'app_shell.dart';

void main() => runApp(const KartuProfilApp());

class KartuProfilApp extends StatelessWidget {
  const KartuProfilApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Kartu Profil Digital',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
      home: const AppShell(),
    );
  }
}
```

Jalankan (`flutter run`). Perhatikan: ikon **☰ muncul otomatis** di AppBar, dan drawer bisa digeser dari kiri.

### Langkah 3 — Pisahkan Drawer ke widget sendiri

Praktik industri: widget yang besar dipisah ke file sendiri. Buat `lib/widgets/app_drawer.dart`:

```dart
import 'package:flutter/material.dart';
import '../pages/tentang_page.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          const UserAccountsDrawerHeader(
            accountName: Text('Fakhry Firdaus'),
            accountEmail: Text('fakhry@example.com'),
            currentAccountPicture: CircleAvatar(
              backgroundImage: NetworkImage(
                'https://picsum.photos/seed/profile/300/300',
              ),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.info_outline),
            title: const Text('Tentang Aplikasi'),
            onTap: () {
              Navigator.pop(context); // 1. tutup drawer
              Navigator.push(         // 2. baru pindah halaman
                context,
                MaterialPageRoute(builder: (context) => const TentangPage()),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.share_outlined),
            title: const Text('Bagikan Profil'),
            onTap: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Tautan profil disalin')),
              );
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Keluar'),
            onTap: () {
              Navigator.pop(context);
              _konfirmasiKeluar(context);
            },
          ),
        ],
      ),
    );
  }

  void _konfirmasiKeluar(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Keluar?'),
        content: const Text('Kamu akan keluar dari aplikasi (simulasi).'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('Batal'),
          ),
          FilledButton(
            onPressed: () {
              Navigator.pop(dialogContext);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Kamu telah keluar')),
              );
            },
            child: const Text('Keluar'),
          ),
        ],
      ),
    );
  }
}
```

Lalu ubah `drawer` di `app_shell.dart` dan tambahkan import-nya:

```dart
import 'widgets/app_drawer.dart';
// ...
drawer: const AppDrawer(),
```

### Langkah 4 — Eksperimen (wajib dicoba)

1. **Hapus** baris `Navigator.pop(context);` pada "Tentang Aplikasi", lalu jalankan. Tekan back dari halaman Tentang. Apa yang terjadi? *(Drawer masih terbuka.)* Kembalikan barisnya.
2. Buka drawer secara **manual lewat kode**. Tambahkan tombol di body dan pakai `GlobalKey`:

```dart
// di dalam State
final _scaffoldKey = GlobalKey<ScaffoldState>();
// pada Scaffold: key: _scaffoldKey,
// pada tombol:   onPressed: () => _scaffoldKey.currentState?.openDrawer(),
```

> ⚠️ **Pitfall umum:** `Scaffold.of(context).openDrawer()` sering error *"Scaffold.of() called with a context that does not contain a Scaffold"*. Penyebabnya: `context` yang dipakai berasal dari widget **di atas** Scaffold. Solusi: bungkus tombol dengan `Builder`, atau pakai `GlobalKey` seperti di atas.

> 💡 **Insight industri:** Drawer + `Navigator.pop` lalu `Navigator.push` adalah pola dasar. Di aplikasi besar, perpindahan ini dikelola router (misalnya `go_router`), tetapi **urutan logikanya tetap sama**: tutup drawer dulu, baru navigasi.

### ✅ Checkpoint Lab 2

- [ ] Ikon ☰ muncul dan drawer terbuka
- [ ] Header menampilkan foto, nama **Fakhry Firdaus**, dan email
- [ ] "Tentang Aplikasi" membuka halaman baru dan drawer tertutup
- [ ] "Bagikan Profil" memunculkan SnackBar
- [ ] "Keluar" memunculkan dialog konfirmasi

---

## 🧪 Lab 3 — BottomNavigationBar (40 menit)

### Langkah 1 — Daftar destinasi (`lib/data/destinasi.dart`)

Semua informasi tab (label, ikon, halaman) disimpan **di satu tempat**. Ini prinsip *single source of truth*: kalau nanti menambah tab, kamu cukup mengubah satu file.

```dart
import 'package:flutter/material.dart';
import '../pages/beranda_page.dart';
import '../pages/kontak_page.dart';
import '../pages/pengaturan_page.dart';
import '../pages/proyek_page.dart';

class Destinasi {
  final String label;
  final IconData ikon;
  final IconData ikonAktif;
  final Widget halaman;

  const Destinasi({
    required this.label,
    required this.ikon,
    required this.ikonAktif,
    required this.halaman,
  });
}

const daftarDestinasi = [
  Destinasi(
    label: 'Beranda',
    ikon: Icons.person_outline,
    ikonAktif: Icons.person,
    halaman: BerandaPage(),
  ),
  Destinasi(
    label: 'Proyek',
    ikon: Icons.work_outline,
    ikonAktif: Icons.work,
    halaman: ProyekPage(),
  ),
  Destinasi(
    label: 'Kontak',
    ikon: Icons.contacts_outlined,
    ikonAktif: Icons.contacts,
    halaman: KontakPage(),
  ),
  Destinasi(
    label: 'Pengaturan',
    ikon: Icons.settings_outlined,
    ikonAktif: Icons.settings,
    halaman: PengaturanPage(),
  ),
];
```

### Langkah 2 — Ubah `AppShell` menjadi `StatefulWidget`

Ganti seluruh isi `app_shell.dart`. Versi ini sengaja memakai `_halaman[_indeks]` dulu, agar kamu bisa melihat masalahnya di Lab 4:

```dart
import 'package:flutter/material.dart';
import 'data/destinasi.dart';
import 'widgets/app_drawer.dart';

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int _indeks = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(daftarDestinasi[_indeks].label)),
      drawer: const AppDrawer(),
      body: daftarDestinasi[_indeks].halaman,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _indeks,
        onTap: (i) => setState(() => _indeks = i),
        type: BottomNavigationBarType.fixed,
        items: [
          for (final d in daftarDestinasi)
            BottomNavigationBarItem(
              icon: Icon(d.ikon),
              activeIcon: Icon(d.ikonAktif),
              label: d.label,
            ),
        ],
      ),
    );
  }
}
```

Jalankan dan coba pindah-pindah tab. Judul AppBar ikut berubah.

> ⚠️ **Pitfall:** Jika `type` tidak diisi dan jumlah tab **lebih dari 3**, Flutter memakai mode `shifting`: label tab yang tidak aktif **hilang** dan warna bisa aneh. Untuk 4–5 tab, selalu set `type: BottomNavigationBarType.fixed`.

### Langkah 3 — Eksperimen

1. Hapus `type: BottomNavigationBarType.fixed`, lihat perubahannya, lalu kembalikan.
2. Ubah `selectedItemColor` dan `unselectedItemColor`.
3. Tambahkan `showUnselectedLabels: true` dan amati.

### ✅ Checkpoint Lab 3

- [ ] 4 tab tampil dengan ikon dan label
- [ ] Tab aktif memakai ikon *filled*, tab lain *outlined*
- [ ] Judul AppBar berubah sesuai tab
- [ ] Drawer tetap berfungsi dari semua tab

---

## 🧪 Lab 4 — Menjaga State Tab dengan `IndexedStack` (30 menit)

### Langkah 1 — Buktikan masalahnya

1. Buka tab **Pengaturan**, nyalakan switch **Notifikasi**.
2. Pindah ke tab **Beranda**, lalu kembali ke **Pengaturan**.
3. Switch kembali **mati**. State-mu hilang!

**Penyebabnya:** setiap pindah tab, `body` berganti widget. Widget lama dibuang (*disposed*), widget baru dibuat dari nol.

### Langkah 2 — Perbaiki dengan `IndexedStack`

`IndexedStack` membuat **semua halaman sekaligus**, tetapi hanya menampilkan satu sesuai `index`. Halaman yang tersembunyi tetap hidup, jadi state-nya terjaga.

Ganti `body` di `app_shell.dart`:

```dart
body: IndexedStack(
  index: _indeks,
  children: [for (final d in daftarDestinasi) d.halaman],
),
```

Ulangi eksperimen tadi. Sekarang switch tetap menyala. ✅

### Langkah 3 — Pahami trade-off

| Pendekatan | State terjaga? | Beban memori | Cocok untuk |
|---|---|---|---|
| `halaman[_indeks]` | ❌ | Ringan | Tab sederhana tanpa state |
| `IndexedStack` | ✅ | Semua tab dibangun di awal | Tab sedikit (3–5), state ringan |
| `PageStorageKey` | Hanya posisi scroll | Ringan | Menjaga scroll list |
| `go_router` `StatefulShellRoute` | ✅ + tiap tab punya navigator sendiri | Dikelola router | Aplikasi skala produksi |

> 💡 **Insight industri:** `IndexedStack` adalah solusi tercepat dan cukup untuk banyak aplikasi. Hati-hati kalau tiap tab memanggil API berat di `initState`: semuanya ikut dipanggil saat aplikasi dibuka. Pada aplikasi skala besar, tim memakai `StatefulShellRoute` dari `go_router` (yang sudah kamu kenal di Modul 8) supaya tiap tab punya riwayat navigasinya sendiri.

### ✅ Checkpoint Lab 4

- [ ] Switch di Pengaturan **tetap** menyala setelah pindah tab
- [ ] Posisi scroll di tab Proyek tetap terjaga

---

## 🏆 Challenge Pertemuan 1

Pilih minimal **satu** challenge sesuai tingkat keberanianmu.

### ⭐ Level 1 — Personalisasi Tampilan
- Ubah warna tab aktif dan tidak aktif sesuai selera.
- Ganti ikon tiap tab dengan ikon lain dari [Icons](https://api.flutter.dev/flutter/material/Icons-class.html).
- Tambahkan satu menu baru di drawer, misalnya "Bantuan", yang membuka halaman baru.

### ⭐⭐ Level 2 — Badge & Penanda
- Beri **badge angka** pada tab Kontak (misalnya `3`) memakai widget `Badge`:
  ```dart
  Badge(label: Text('3'), child: Icon(Icons.contacts_outlined))
  ```
- Buat item drawer yang sedang aktif tampak **terpilih** (`ListTile(selected: true)`).

### ⭐⭐⭐ Level 3 — Navigasi di dalam Tab
- Pada tab **Proyek**, tambahkan `TabBar` + `TabBarView` di bagian atas dengan 3 kategori: *Semua*, *Mobile*, *Web*. Tambahkan properti `kategori` pada model `Proyek`.
- Petunjuk: pelajari `DefaultTabController` di [api.flutter.dev](https://api.flutter.dev/flutter/material/DefaultTabController-class.html).

---

## 📝 Rangkuman Pertemuan 1

- **Drawer** untuk menu sekunder. Tutup dengan `Navigator.pop` sebelum berpindah halaman.
- **BottomNavigationBar** untuk 3–5 destinasi utama. Pakai `type: fixed` jika tab lebih dari 3.
- Pindah tab = mengganti widget di `body`, **bukan** `Navigator.push`.
- `IndexedStack` menjaga state tab.
- Halaman tab tidak boleh punya `Scaffold`/`AppBar` sendiri. Shell yang mengatur.

---

# 🗓️ PERTEMUAN 2 (4 Jam) — Struktur Navigasi Tingkat Industri

| Waktu | Kegiatan |
|---|---|
| 0:00 – 0:20 | Review Pertemuan 1 & tanya jawab |
| 0:20 – 0:55 | **Lab 5** — Drawer & tab saling berkomunikasi |
| 0:55 – 1:35 | **Lab 6** — Halaman detail & perilaku Bottom Bar |
| 1:35 – 1:45 | Istirahat |
| 1:45 – 2:20 | **Lab 7** — Upgrade ke Material 3 `NavigationBar` |
| 2:20 – 2:55 | **Lab 8** — Tombol Back yang benar (`PopScope`) |
| 2:55 – 3:25 | **Lab 9** — Layout adaptif (`NavigationRail`) |
| 3:25 – 3:50 | **Challenge Pertemuan 2** |
| 3:50 – 4:00 | Rangkuman & checklist akhir |

---

## 🧪 Lab 5 — Drawer & Tab Saling Berkomunikasi (35 menit)

**Masalah:** Kamu ingin item drawer "Proyek Saya" **berpindah ke tab Proyek**. Tetapi `_indeks` ada di `AppShell`, sedangkan drawer adalah widget terpisah.

**Solusi:** shell mengirim **callback** ke drawer. Drawer memanggilnya saat item dipilih. Pola ini disebut *lifting state up* ("mengangkat state ke atas").

```
AppShell (pemilik _indeks) ──onPilihTab──▶ AppDrawer
         ▲                                    │
         └────────── dipanggil saat tap ◀─────┘
```

### Langkah 1 — Tambah callback di `AppDrawer`

Ubah bagian atas class `AppDrawer`:

```dart
class AppDrawer extends StatelessWidget {
  final ValueChanged<int> onPilihTab;

  const AppDrawer({super.key, required this.onPilihTab});
```

Tambahkan item baru **sebelum** "Tentang Aplikasi":

```dart
ListTile(
  leading: const Icon(Icons.work_outline),
  title: const Text('Proyek Saya'),
  onTap: () {
    Navigator.pop(context); // tutup drawer
    onPilihTab(1);          // pindah ke tab Proyek
  },
),
```

### Langkah 2 — Kirim callback dari `AppShell`

Tambahkan method di `_AppShellState`:

```dart
void _pilihTab(int i) => setState(() => _indeks = i);
```

Ubah drawer dan `onTap` bottom bar:

```dart
drawer: AppDrawer(onPilihTab: _pilihTab),
// ...
onTap: _pilihTab,
```

> ⚠️ Karena `onPilihTab` tidak konstan, hapus kata `const` di depan `AppDrawer(...)`.

### ✅ Checkpoint Lab 5

- [ ] Dari tab mana pun, "Proyek Saya" di drawer membawa kamu ke tab Proyek
- [ ] Bottom bar ikut menandai tab Proyek sebagai aktif

> 💡 **Insight industri:** Pola callback cocok untuk skala kecil. Saat aplikasi membesar, state navigasi dipindah ke state management (Provider/Riverpod/BLoC) atau router, supaya widget mana pun bisa memicu perpindahan tab tanpa mengoper callback berlapis-lapis. Konsepnya sama, hanya "tempat penyimpanannya" yang berbeda.

---

## 🧪 Lab 6 — Halaman Detail & Perilaku Bottom Bar (40 menit)

### Langkah 1 — Coba alurnya

1. Buka tab **Proyek** dan tap salah satu proyek.
2. Halaman detail terbuka **menutupi seluruh layar, termasuk Bottom Bar**.
3. Tekan back (atau panah di AppBar) untuk kembali. Tab Proyek masih di posisi scroll yang sama.

**Mengapa Bottom Bar hilang?** `Navigator.push` bekerja di Navigator milik `MaterialApp` (level paling atas). Halaman baru ditumpuk di atas **seluruh** shell. Ini perilaku **normal dan umum**: banyak aplikasi menyembunyikan bottom bar di halaman detail agar fokus pada konten.

```
Navigator (root)
 ├── AppShell  (AppBar + Drawer + BottomNav + tab)
 └── ProyekDetailPage   ← ditumpuk di atas shell
```

### Langkah 2 — Kirim data lewat konstruktor

`ProyekPage` sudah mengirim objek `Proyek` ke `ProyekDetailPage(proyek: proyek)`. Ini cara **paling aman dan paling sederhana** untuk meneruskan data (type-safe, error terdeteksi saat kompilasi).

### Langkah 3 — Tambahkan animasi `Hero` (opsional, 10 menit)

Di `proyek_page.dart`, bungkus ikon dengan `Hero`:

```dart
leading: Hero(
  tag: 'ikon-${proyek.judul}',
  child: CircleAvatar(child: Icon(proyek.ikon)),
),
```

Di `proyek_detail_page.dart`:

```dart
Hero(
  tag: 'ikon-${proyek.judul}',
  child: Icon(proyek.ikon, size: 64),
),
```

Ikon kini "terbang" mulus antar halaman.

### Langkah 4 — Pahami pilihan arsitektur

| Kebutuhan | Solusi |
|---|---|
| Detail menutupi bottom bar *(yang baru kamu buat)* | `Navigator.push` biasa |
| Detail **tetap menampilkan** bottom bar | Navigator bersarang per tab: `go_router` `StatefulShellRoute` |

> 💡 **Insight industri:** Instagram dan Spotify mempertahankan bottom bar di dalam alur tertentu, sedangkan banyak aplikasi e-commerce menyembunyikannya di halaman detail. Keduanya valid. Pilih berdasarkan kebutuhan pengguna, bukan karena mudah dibuat.

### ✅ Checkpoint Lab 6

- [ ] Tap proyek membuka halaman detail dengan data yang benar
- [ ] Tombol back kembali ke tab Proyek
- [ ] (Opsional) Animasi Hero berjalan

---

## 🧪 Lab 7 — Upgrade ke Material 3 `NavigationBar` (35 menit)

`BottomNavigationBar` adalah komponen Material 2 yang masih berfungsi. Untuk aplikasi baru dengan Material 3, Flutter menyediakan **`NavigationBar`** dengan tampilan modern (indikator berbentuk pil di tab aktif). Fungsinya sama, hanya nama properti yang berbeda.

### Perbandingan API

| `BottomNavigationBar` (lama) | `NavigationBar` (Material 3) |
|---|---|
| `currentIndex` | `selectedIndex` |
| `onTap` | `onDestinationSelected` |
| `items` → `BottomNavigationBarItem` | `destinations` → `NavigationDestination` |
| `icon` + `activeIcon` | `icon` + `selectedIcon` |
| `label` | `label` |

### Langkah 1 — Ganti bottom bar

Di `app_shell.dart`, ganti seluruh `bottomNavigationBar`:

```dart
bottomNavigationBar: NavigationBar(
  selectedIndex: _indeks,
  onDestinationSelected: _pilihTab,
  destinations: [
    for (final d in daftarDestinasi)
      NavigationDestination(
        icon: Icon(d.ikon),
        selectedIcon: Icon(d.ikonAktif),
        label: d.label,
      ),
  ],
),
```

Perhatikan: karena daftar destinasi berada di satu tempat (`daftarDestinasi`), kamu hanya mengubah **satu bagian** kode. Inilah keuntungan *single source of truth*.

Bandingkan tampilannya dengan versi lama. Pastikan `useMaterial3: true` aktif di `ThemeData` (di Flutter versi terbaru ini sudah menjadi bawaan).

### ✅ Checkpoint Lab 7

- [ ] Tab aktif punya indikator berbentuk pil
- [ ] Semua fitur sebelumnya tetap berjalan (state terjaga, drawer, detail)

---

## 🧪 Lab 8 — Tombol Back yang Benar dengan `PopScope` (35 menit)

**Masalah:** Kamu berada di tab **Kontak**, lalu menekan back di Android. Aplikasi **langsung keluar**. Padahal pengguna biasanya mengharapkan kembali ke tab **Beranda** dulu.

**Aturan yang umum dipakai di industri:**

```
Di tab selain Beranda  → back = kembali ke Beranda
Di tab Beranda         → back = keluar aplikasi
Drawer sedang terbuka  → back = tutup drawer
```

### Langkah 1 — Bungkus `Scaffold` dengan `PopScope`

Tambahkan `GlobalKey` di `_AppShellState`:

```dart
final _scaffoldKey = GlobalKey<ScaffoldState>();
```

Lalu bungkus `Scaffold`:

```dart
return PopScope(
  canPop: _indeks == 0, // hanya boleh keluar jika di Beranda
  onPopInvokedWithResult: (didPop, result) {
    if (didPop) return;
    if (_scaffoldKey.currentState?.isDrawerOpen ?? false) {
      _scaffoldKey.currentState?.closeDrawer();
    } else {
      _pilihTab(0);
    }
  },
  child: Scaffold(
    key: _scaffoldKey,
    // ... isi Scaffold seperti sebelumnya
  ),
);
```

### Langkah 2 — Uji tiga skenario (jalankan di emulator Android)

1. Di tab Kontak → tekan back → harus kembali ke **Beranda**.
2. Di Beranda → tekan back → aplikasi **keluar**.
3. Buka drawer di tab Pengaturan → tekan back → drawer **tertutup**, tab tidak berubah.

> ⚠️ **Pitfall:** Banyak tutorial lama memakai `WillPopScope`. Widget itu sudah **deprecated**. Gunakan `PopScope`. Tidak seperti pendahulunya, `PopScope` menerima `canPop` berupa nilai statis agar kompatibel dengan fitur *predictive back* di Android modern.

### ✅ Checkpoint Lab 8

- [ ] Ketiga skenario berjalan sesuai tabel

---

## 🧪 Lab 9 — Layout Adaptif dengan `NavigationRail` (30 menit)

Di tablet, jendela Chrome, atau desktop, bottom bar terasa janggal: terlalu lebar dan jauh dari jangkauan. Praktik standar: layar **sempit → bottom bar**, layar **lebar → navigation rail** (bilah vertikal di kiri). Ini memakai konsep responsif dari Modul 5.

### Langkah 1 — Versi akhir `app_shell.dart`

Ganti seluruh isi file dengan versi lengkap berikut:

```dart
import 'package:flutter/material.dart';
import 'data/destinasi.dart';
import 'widgets/app_drawer.dart';

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  final _scaffoldKey = GlobalKey<ScaffoldState>();
  int _indeks = 0;

  void _pilihTab(int i) => setState(() => _indeks = i);

  @override
  Widget build(BuildContext context) {
    final layarLebar = MediaQuery.sizeOf(context).width >= 600;

    return PopScope(
      canPop: _indeks == 0,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        if (_scaffoldKey.currentState?.isDrawerOpen ?? false) {
          _scaffoldKey.currentState?.closeDrawer();
        } else {
          _pilihTab(0);
        }
      },
      child: Scaffold(
        key: _scaffoldKey,
        appBar: AppBar(title: Text(daftarDestinasi[_indeks].label)),
        drawer: AppDrawer(onPilihTab: _pilihTab),
        body: Row(
          children: [
            if (layarLebar)
              NavigationRail(
                selectedIndex: _indeks,
                onDestinationSelected: _pilihTab,
                labelType: NavigationRailLabelType.all,
                destinations: [
                  for (final d in daftarDestinasi)
                    NavigationRailDestination(
                      icon: Icon(d.ikon),
                      selectedIcon: Icon(d.ikonAktif),
                      label: Text(d.label),
                    ),
                ],
              ),
            Expanded(
              child: IndexedStack(
                index: _indeks,
                children: [for (final d in daftarDestinasi) d.halaman],
              ),
            ),
          ],
        ),
        bottomNavigationBar: layarLebar
            ? null
            : NavigationBar(
                selectedIndex: _indeks,
                onDestinationSelected: _pilihTab,
                destinations: [
                  for (final d in daftarDestinasi)
                    NavigationDestination(
                      icon: Icon(d.ikon),
                      selectedIcon: Icon(d.ikonAktif),
                      label: d.label,
                    ),
                ],
              ),
      ),
    );
  }
}
```

### Langkah 2 — Uji

```bash
flutter run -d chrome
```

Perkecil dan perbesar jendela browser. Pada lebar **≥ 600 px**, bottom bar berganti menjadi rail di kiri. State tab tetap terjaga saat layout berubah.

### ✅ Checkpoint Akhir Modul

- [ ] Bottom bar di layar sempit, rail di layar lebar
- [ ] Drawer berfungsi (header, pintasan, Tentang, Bagikan, Keluar)
- [ ] Pindah tab tidak menghilangkan state
- [ ] Detail proyek terbuka & kembali dengan benar
- [ ] Tombol back berperilaku sesuai aturan Lab 8

---

## 🏆 Challenge Pertemuan 2

### ⭐ Level 1 — Material 3 Penuh
Ganti `Drawer` dengan **`NavigationDrawer`** (Material 3). Cari contohnya di [api.flutter.dev/flutter/material/NavigationDrawer-class.html](https://api.flutter.dev/flutter/material/NavigationDrawer-class.html).

### ⭐⭐ Level 2 — Tab Kelima
Tambahkan tab **Galeri** yang berisi `GridView` foto (`picsum.photos`). Cukup ubah **satu file** (`destinasi.dart`). Jika berhasil, kamu sudah merasakan manfaat *single source of truth*. Setelah itu tambahkan tab keenam dan lihat apa yang terjadi pada `NavigationBar`. Menurutmu, mengapa pedoman desain membatasi 3–5 tab?

### ⭐⭐⭐ Level 3 — Bottom Bar Tetap Muncul di Halaman Detail
Migrasikan struktur navigasi ke **`go_router`** dengan `StatefulShellRoute.indexedStack`, sehingga:
- tiap tab punya riwayat navigasinya sendiri,
- bottom bar **tetap tampil** saat detail proyek dibuka.

Bonus: tap tab yang sedang aktif akan kembali ke halaman awal tab tersebut (`goBranch(index, initialLocation: true)`).

---

## 🧯 Daftar Pitfall (Baca Jika Mengalami Error)

| Gejala | Penyebab | Solusi |
|---|---|---|
| Label tab hilang / ikon tidak terlihat | Tab > 3 tanpa `type: fixed` | `type: BottomNavigationBarType.fixed` |
| Drawer masih terbuka setelah pindah halaman | Lupa `Navigator.pop(context)` | Tutup drawer dulu, baru navigasi |
| Error `Scaffold.of() called with a context that does not contain a Scaffold` | `context` berasal dari atas Scaffold | Pakai `Builder` atau `GlobalKey<ScaffoldState>` |
| State tab (switch, input) hilang saat pindah tab | `body` hanya menampilkan satu widget | Pakai `IndexedStack` |
| Dua AppBar bertumpuk | Halaman tab punya `Scaffold`+`AppBar` sendiri | Hapus; AppBar dikelola shell |
| Ikon ☰ tidak muncul | `leading` pada AppBar diganti manual | Hapus `leading` atau buat tombol sendiri |
| Gambar profil tidak muncul | Izin internet / CORS di Chrome | Tambah izin `INTERNET`; pakai `picsum.photos` |
| Warning `WillPopScope` deprecated | API lama | Ganti dengan `PopScope` |

---

## 💡 Rangkuman Praktik Industri

1. **Utama di bawah, sekunder di samping.** Bottom bar untuk 3–5 menu utama, drawer untuk menu sekunder.
2. **Satu sumber kebenaran.** Daftar destinasi dibuat sekali, dipakai oleh bottom bar, rail, dan drawer.
3. **Shell memegang kerangka.** Halaman tab hanya berisi konten, tanpa `Scaffold` sendiri.
4. **Jaga state tab.** `IndexedStack` untuk skala kecil, `StatefulShellRoute` untuk skala produksi.
5. **Tombol back harus masuk akal.** Gunakan `PopScope`, bukan `WillPopScope`.
6. **Adaptif.** Bottom bar di HP, rail di layar lebar.
7. **Pakai komponen Material 3.** `NavigationBar`, `NavigationDrawer`, `NavigationRail` untuk aplikasi baru.
8. **Pecah file.** Satu widget besar, satu file.

## 📖 Referensi

- [Navigation & routing — docs.flutter.dev](https://docs.flutter.dev/ui/navigation)
- [`Drawer`](https://api.flutter.dev/flutter/material/Drawer-class.html) · [`NavigationDrawer`](https://api.flutter.dev/flutter/material/NavigationDrawer-class.html)
- [`BottomNavigationBar`](https://api.flutter.dev/flutter/material/BottomNavigationBar-class.html) · [`NavigationBar`](https://api.flutter.dev/flutter/material/NavigationBar-class.html) · [`NavigationRail`](https://api.flutter.dev/flutter/material/NavigationRail-class.html)
- [`IndexedStack`](https://api.flutter.dev/flutter/widgets/IndexedStack-class.html) · [`PopScope`](https://api.flutter.dev/flutter/widgets/PopScope-class.html) · [`Badge`](https://api.flutter.dev/flutter/material/Badge-class.html)
- [Pedoman Navigation Bar — Material Design 3](https://m3.material.io/components/navigation-bar)

---

*Selamat berkarya! Di modul berikutnya, kamu akan mulai mengelola state aplikasi yang lebih kompleks agar navigasi dan data bisa bekerja sama dengan rapi.* 🚀
