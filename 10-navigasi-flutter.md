# Modul 8 — Navigasi: Navigator, Named Routes & Passing Arguments

> **Praktikum Pemrograman Mobile · Flutter & Dart · 2 × 4 jam**
> Studi kasus: **Kartu Profil Digital** (lanjutan Modul 1–7)

---

## 🎯 Tujuan Pembelajaran

Setelah menyelesaikan modul ini, kamu mampu:

1. Menjelaskan konsep **route** dan **tumpukan (stack) Navigator**.
2. Berpindah halaman dengan `Navigator.push()` dan `Navigator.pop()`.
3. Mengirim data ke halaman lain (lewat _constructor_ dan _arguments_) dan **mengembalikan data** dari halaman sebelumnya.
4. Menggunakan **named routes** dan mengelolanya di satu tempat dengan `onGenerateRoute`.
5. Mengatur alur halaman: `pushReplacementNamed`, `pushNamedAndRemoveUntil`, dan halaman _404_.
6. Menerapkan praktik navigasi yang dipakai di industri, serta mengimplementasikan `go_router` dan membandingkannya dengan `Navigator`.

## 📋 Prasyarat

- Flutter SDK & emulator/Chrome sudah siap (Modul 1).
- Paham `StatelessWidget`, `StatefulWidget`, `setState()`, `ListView`, `Card`, dan `Form` (Modul 3–7).
- Project **Kartu Profil Digital**. Kalau belum punya, buat project baru:

```bash
flutter create kartu_profil_digital
cd kartu_profil_digital
flutter run -d chrome   # atau pilih emulator Android
```

## 🗺️ Gambaran Hasil Akhir

```
Splash ──(2 detik)──► Profil ──ketuk proyek──► Detail Proyek
                        │
                        ├──ikon edit──► Edit Profil ──simpan──► kembali ke Profil (data berubah)
                        └──ikon keluar──► kembali ke Splash (semua halaman dibersihkan)
```

## ⏱️ Rencana Waktu

| Pertemuan | Sesi                                                           | Durasi |
| --------- | -------------------------------------------------------------- | ------ |
| **1**     | Konsep Navigator (stack, push, pop)                            | 25 mnt |
|           | Lab 1 — Persiapan project & data                               | 35 mnt |
|           | Lab 2 — `push`/`pop` + kirim data lewat constructor            | 45 mnt |
|           | _Istirahat_                                                    | 15 mnt |
|           | Lab 3 — Mengembalikan data dari halaman Edit                   | 50 mnt |
|           | Pitfall, insight, cek pemahaman                                | 20 mnt |
|           | 🏆 Challenge                                                   | 50 mnt |
| **2**     | Konsep Named Routes & Arguments                                | 25 mnt |
|           | Lab 4 — Named routes + Splash screen                           | 45 mnt |
|           | Lab 5 — `onGenerateRoute` + passing arguments (versi industri) | 50 mnt |
|           | _Istirahat_                                                    | 15 mnt |
|           | Lab 6 — Mengatur stack: logout & halaman 404                   | 30 mnt |
|           | Lab 7 — Mengintip stack dengan `NavigatorObserver`             | 10 mnt |
|           | Lab 8 — Implementasi `go_router` & perbandingan                | 35 mnt |
|           | Insight industri & cek pemahaman                               | 10 mnt |
|           | 🏆 Challenge                                                   | 20 mnt |

---

# 📘 PERTEMUAN 1 — Navigator Dasar

## 1. Konsep: Route dan Navigator

- **Route** = satu "layar" / halaman dalam aplikasi.
- **Navigator** = widget yang mengelola route dalam bentuk **tumpukan (stack)**. Halaman paling atas adalah yang tampil di layar.

```
Awal              push(Detail)         pop()
┌─────────┐       ┌─────────┐         ┌─────────┐
│         │       │ Detail  │ ← tampil│         │
│ Profil  │ ←tampil│ Profil  │         │ Profil  │ ← tampil
└─────────┘       └─────────┘         └─────────┘
```

Bayangkan **tumpukan piring**: `push` = menaruh piring di atas, `pop` = mengambil piring paling atas.

Tiga hal penting yang perlu kamu tahu:

| Konsep                           | Penjelasan                                                                  |
| -------------------------------- | --------------------------------------------------------------------------- |
| `Navigator.push(context, route)` | Menambah halaman baru di atas stack                                         |
| `Navigator.pop(context)`         | Menutup halaman teratas, kembali ke halaman sebelumnya                      |
| `MaterialPageRoute`              | Route dengan transisi bawaan platform (geser di Android, swipe-back di iOS) |

> 💡 `push` mengembalikan **`Future`**. Future itu selesai saat halaman tersebut ditutup, dan membawa **hasil** dari `pop`. Inilah dasar untuk mengembalikan data (Lab 3). Ingat materi `async/await` di Modul 2!

**Tiga cara memindahkan data antar halaman:**

| Arah          | Cara                                  | Dipelajari di |
| ------------- | ------------------------------------- | ------------- |
| Halaman A → B | _Constructor_                         | Lab 2         |
| Halaman A → B | `arguments` (named route)             | Lab 5         |
| Halaman B → A | Hasil `Navigator.pop(context, hasil)` | Lab 3         |

---

## 2. Lab 1 — Persiapan Project & Data

**Tujuan:** menyiapkan struktur folder, model data, dan halaman Profil awal.

### Langkah 1.1 — Struktur folder

Buat folder dan file berikut di dalam `lib/`:

```
lib/
├── main.dart
├── models/
│   └── models.dart
├── data/
│   └── dummy_data.dart
└── pages/
    ├── profile_page.dart
    ├── project_detail_page.dart   (dibuat di Lab 2)
    └── edit_profile_page.dart     (dibuat di Lab 3)
```

> 💡 **Insight industri:** memisahkan kode ke folder `models`, `data`, `pages` (atau `features/`) membuat project mudah dirawat saat halamannya bertambah banyak. Jangan menaruh semuanya di `main.dart`.

### Langkah 1.2 — Model data

`lib/models/models.dart`

```dart
class Project {
  final String id;
  final String title;
  final String description;
  final List<String> techStack;

  const Project({
    required this.id,
    required this.title,
    required this.description,
    required this.techStack,
  });
}

class Profile {
  final String name;
  final String bio;

  const Profile({required this.name, required this.bio});

  /// Membuat salinan Profile dengan sebagian field diganti.
  Profile copyWith({String? name, String? bio}) =>
      Profile(name: name ?? this.name, bio: bio ?? this.bio);
}
```

> 💡 Field dibuat `final` (immutable). Untuk "mengubah" data, buat objek baru dengan `copyWith`. Pola ini sangat umum di Flutter karena memudahkan state management di modul selanjutnya.

### Langkah 1.3 — Data contoh

`lib/data/dummy_data.dart`

```dart
import '../models/models.dart';

const defaultProfile = Profile(
  name: 'Fakhry Firdaus',
  bio: 'Software Engineer & Dosen. Suka berbagi ilmu tentang Flutter '
      'dan pengembangan aplikasi mobile.',
);

const dummyProjects = <Project>[
  Project(
    id: 'p1',
    title: 'Aplikasi Absensi Kampus',
    description: 'Aplikasi presensi mahasiswa berbasis QR code dengan '
        'rekap kehadiran otomatis per mata kuliah.',
    techStack: ['Flutter', 'Firebase', 'Provider'],
  ),
  Project(
    id: 'p2',
    title: 'Katalog UMKM Jember',
    description: 'Katalog digital untuk membantu UMKM lokal memasarkan '
        'produknya secara online.',
    techStack: ['Flutter', 'REST API', 'Dio'],
  ),
  Project(
    id: 'p3',
    title: 'Monitoring Kandang Pintar',
    description: 'Dashboard mobile untuk memantau suhu dan kelembapan '
        'kandang secara real-time.',
    techStack: ['Flutter', 'MQTT', 'Cloud'],
  ),
];
```

### Langkah 1.4 — Halaman Profil (starter)

Jika kamu sudah punya `ProfilePage` dari modul sebelumnya, pindahkan ke file ini dan sesuaikan. Jika belum, pakai kode berikut.

`lib/pages/profile_page.dart`

```dart
import 'package:flutter/material.dart';

import '../data/dummy_data.dart';
import '../models/models.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  Profile _profile = defaultProfile;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Kartu Profil Digital'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            tooltip: 'Edit profil',
            onPressed: () {}, // TODO: Lab 3
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Center(
            child: CircleAvatar(
              radius: 48,
              backgroundImage:
                  NetworkImage('https://picsum.photos/seed/profile/300/300'),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            _profile.name,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          Text(_profile.bio, textAlign: TextAlign.center),
          const SizedBox(height: 24),
          Text('Proyek', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          for (final project in dummyProjects)
            Card(
              child: ListTile(
                leading: const Icon(Icons.folder_open),
                title: Text(project.title),
                subtitle: Text(project.techStack.join(' • ')),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {}, // TODO: Lab 2
              ),
            ),
        ],
      ),
    );
  }
}
```

### Langkah 1.5 — `main.dart`

```dart
import 'package:flutter/material.dart';

import 'pages/profile_page.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Kartu Profil Digital',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
      home: const ProfilePage(),
    );
  }
}
```

✅ **Checkpoint 1:** Aplikasi berjalan dan menampilkan foto, nama, bio, dan 3 kartu proyek. Mengetuk kartu belum melakukan apa-apa.

---

## 3. Lab 2 — `push`, `pop`, dan Kirim Data lewat Constructor

**Tujuan:** membuka halaman Detail Proyek dari kartu yang diketuk.

### Langkah 2.1 — Buat halaman detail

`lib/pages/project_detail_page.dart`

```dart
import 'package:flutter/material.dart';

import '../models/models.dart';

class ProjectDetailPage extends StatelessWidget {
  final Project project;

  const ProjectDetailPage({super.key, required this.project});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(project.title)),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              project.title,
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 12),
            Text(project.description),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              children: [
                for (final tech in project.techStack) Chip(label: Text(tech)),
              ],
            ),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Kembali'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

Perhatikan: data `project` dikirim lewat **constructor**, sama seperti kamu mengirim data ke widget biasa.

### Langkah 2.2 — Navigasi dari Profil

Di `profile_page.dart`, tambahkan import dan method berikut:

```dart
import 'project_detail_page.dart';
```

```dart
// Tambahkan di dalam class _ProfilePageState
void _openProjectDetail(Project project) {
  Navigator.push(
    context,
    MaterialPageRoute(
      builder: (context) => ProjectDetailPage(project: project),
    ),
  );
}
```

Lalu ganti `onTap: () {}, // TODO: Lab 2` menjadi:

```dart
onTap: () => _openProjectDetail(project),
```

✅ **Checkpoint 2:** Ketuk kartu → halaman detail muncul. Tombol **Kembali** dan tombol _back_ (←) di AppBar sama-sama kembali ke Profil. Perhatikan bahwa AppBar menampilkan tombol back **otomatis** karena ada halaman di bawahnya di stack.

> 🔎 **Coba sendiri (2 menit):** Di `ProjectDetailPage`, ganti `Navigator.pop(context)` menjadi `Navigator.pop(context)` dua kali berturut-turut. Apa yang terjadi? Mengapa? _(Jawabannya ada di bagian Pitfall.)_

---

## 4. Lab 3 — Mengembalikan Data dari Halaman Edit

**Tujuan:** mengedit nama dan bio di halaman baru, lalu hasilnya muncul di halaman Profil.

### Langkah 3.1 — Halaman Edit Profil

`lib/pages/edit_profile_page.dart`

```dart
import 'package:flutter/material.dart';

import '../models/models.dart';

class EditProfilePage extends StatefulWidget {
  final Profile profile;

  const EditProfilePage({super.key, required this.profile});

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _bioController;

  @override
  void initState() {
    super.initState();
    // Isi awal form diambil dari data yang dikirim lewat constructor
    _nameController = TextEditingController(text: widget.profile.name);
    _bioController = TextEditingController(text: widget.profile.bio);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _bioController.dispose();
    super.dispose();
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;

    final updated = widget.profile.copyWith(
      name: _nameController.text.trim(),
      bio: _bioController.text.trim(),
    );

    // Tutup halaman SEKALIGUS kirim hasil ke halaman sebelumnya
    Navigator.pop(context, updated);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Edit Profil')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Nama',
                  border: OutlineInputBorder(),
                ),
                validator: (value) => (value == null || value.trim().isEmpty)
                    ? 'Nama tidak boleh kosong'
                    : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _bioController,
                maxLines: 3,
                decoration: const InputDecoration(
                  labelText: 'Bio',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context), // hasil = null
                      child: const Text('Batal'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: FilledButton(
                      onPressed: _save,
                      child: const Text('Simpan'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

### Langkah 3.2 — Terima hasilnya di Profil

Di `profile_page.dart`, tambahkan import dan method:

```dart
import 'edit_profile_page.dart';
```

```dart
Future<void> _openEditProfile() async {
  // await = tunggu sampai halaman Edit ditutup
  final result = await Navigator.push<Profile>(
    context,
    MaterialPageRoute(
      builder: (context) => EditProfilePage(profile: _profile),
    ),
  );

  // Dua pengaman: widget masih aktif? ada hasil (tidak dibatalkan)?
  if (!mounted || result == null) return;
  setState(() => _profile = result);
}
```

Lalu ganti `onPressed: () {}, // TODO: Lab 3` pada ikon edit menjadi:

```dart
onPressed: _openEditProfile,
```

✅ **Checkpoint 3:**

- Ubah nama → **Simpan** → nama di Profil berubah.
- **Batal** atau tombol back → data **tidak** berubah (hasilnya `null`).
- Kosongkan nama → muncul pesan validasi dan halaman tidak tertutup.

### Alur data yang baru kamu buat

```
ProfilePage ──(constructor: profile)──► EditProfilePage
ProfilePage ◄──(Navigator.pop(context, updated))── EditProfilePage
```

---

## 5. ⚠️ Pitfall Pertemuan 1

| #   | Masalah                                                    | Penyebab & Solusi                                                                                                                 |
| --- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `Navigator.pop` dua kali → layar hitam / aplikasi tertutup | Stack hanya punya 1 halaman, lalu di-`pop`. Gunakan `Navigator.maybePop(context)` atau cek `Navigator.canPop(context)` bila ragu. |
| 2   | Peringatan _"Don't use BuildContext across async gaps"_    | Setelah `await`, widget bisa saja sudah ditutup. Selalu cek `if (!mounted) return;` sebelum memakai `context` atau `setState`.    |
| 3   | Aplikasi _loop_ membuka halaman tanpa henti                | `Navigator.push` dipanggil langsung di dalam `build()`. Panggil navigasi hanya di dalam **callback** (`onPressed`, `onTap`, dll). |
| 4   | Data tidak berubah saat tombol back ditekan                | Itu wajar: hasil `pop` adalah `null`. **Selalu cek `null`** sebelum memakai hasil.                                                |
| 5   | `TextEditingController` tidak dibersihkan                  | Selalu `dispose()` controller di `dispose()` agar tidak terjadi memory leak.                                                      |

## 6. 💡 Insight Industri — Pertemuan 1

1. **Halaman = widget biasa.** Terima data lewat constructor dengan `required`, jangan mengandalkan variabel global. Halaman jadi mudah diuji dan dipakai ulang.
2. **Data immutable + `copyWith`.** Halaman Edit tidak mengubah objek asli, melainkan mengembalikan objek **baru**. Ini mencegah bug "data berubah diam-diam".
3. **`mounted` check itu wajib** setelah setiap `await` yang diikuti `context`/`setState`. Linter Flutter (`use_build_context_synchronously`) akan menandainya.
4. **Kirim data seminimal mungkin.** Pada aplikasi nyata, halaman detail biasanya menerima **ID** lalu mengambil data lengkap dari repository/API. Kita memakai objek penuh di sini hanya untuk menyederhanakan praktikum (dibahas lagi di Challenge Pertemuan 2).

## 7. 🧠 Cek Pemahaman

1. Apa yang dikembalikan `Navigator.push()` dan kapan nilainya tersedia?
2. Mengapa tombol back otomatis muncul di AppBar halaman Detail, tapi tidak di halaman Profil?
3. Apa yang terjadi pada hasil jika pengguna menekan tombol back sistem di halaman Edit?
4. Mengapa perlu `if (!mounted) return;` setelah `await`?

## 8. 🏆 Challenge Pertemuan 1

Kerjakan sesuai levelmu. Boleh mulai dari yang mana saja!

- ⭐ **Tambah field `jabatan`.** Tambahkan `jabatan` (contoh: _Software Engineer_) pada model `Profile`, form Edit, dan tampilkan di bawah nama pada halaman Profil.
- ⭐⭐ **Umpan balik ke pengguna.** Tampilkan `SnackBar` "Profil berhasil diperbarui" di halaman Profil, **hanya jika** pengguna benar-benar menyimpan perubahan. _(Petunjuk: `ScaffoldMessenger.of(context).showSnackBar(...)`, dan jangan lupa `mounted`.)_
- ⭐⭐⭐ **Konfirmasi buang perubahan.** Jika pengguna mengubah isi form lalu menekan back/Batal, tampilkan dialog "Buang perubahan?". _(Petunjuk: widget `PopScope`, `showDialog`.)_
- 🌟 **Bonus:** Beri animasi `Hero` pada ikon proyek antara kartu di Profil dan halaman Detail.

---

# 📗 PERTEMUAN 2 — Named Routes & Passing Arguments

## 9. Konsep: Kenapa Named Routes?

Pada Pertemuan 1, tiap pemanggilan `MaterialPageRoute(builder: ...)` ditulis di tempat tombol berada. Saat aplikasi punya 20 halaman, ini jadi berantakan: nama halaman tersebar, sulit dilacak, dan sulit diubah.

**Named route** memberi setiap halaman sebuah **nama (String path)**, misalnya `'/profile'`, dan semua daftar halaman dikumpulkan di **satu tempat**.

```dart
// Sebelum (Pertemuan 1)
Navigator.push(context, MaterialPageRoute(builder: (_) => ProjectDetailPage(project: p)));

// Sesudah (Pertemuan 2)
Navigator.pushNamed(context, AppRoutes.projectDetail, arguments: p);
```

**Dua cara mendaftarkan named route:**

| Cara                            | Cocok untuk                  | Kelemahan                                       |
| ------------------------------- | ---------------------------- | ----------------------------------------------- |
| `routes: { ... }` (peta statis) | Halaman tanpa data           | Sulit mengirim _arguments_ dengan aman          |
| `onGenerateRoute` (fungsi)      | Halaman dengan data / logika | Sedikit lebih panjang — **dipakai di industri** |

**Passing arguments:** `pushNamed(..., arguments: data)` mengirim data apa pun (tipe `Object?`). Penerima harus **memeriksa tipenya** sebelum dipakai.

---

## 10. Lab 4 — Named Routes + Splash Screen

**Tujuan:** menambah Splash screen, lalu berpindah ke Profil memakai named route.

### Langkah 4.1 — Daftar nama route (satu sumber kebenaran)

Buat folder `lib/app/`, lalu file `lib/app/app_routes.dart`:

```dart
class AppRoutes {
  AppRoutes._(); // mencegah class ini dibuat objeknya

  static const splash = '/';
  static const profile = '/profile';
  static const projectDetail = '/project-detail';
  static const editProfile = '/edit-profile';
}
```

> 💡 **Insight industri:** jangan menulis string route langsung (`'/profile'`) di banyak tempat. Typo seperti `'/profil'` tidak ketahuan compiler dan baru error saat aplikasi dijalankan. Dengan konstanta, **IDE akan membantu** (autocomplete + error saat typo).

### Langkah 4.2 — Splash screen

`lib/pages/splash_page.dart`

```dart
import 'package:flutter/material.dart';

import '../app/app_routes.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 2), _goToProfile);
  }

  void _goToProfile() {
    if (!mounted) return;
    // pushReplacementNamed: ganti Splash dengan Profil (Splash dibuang dari stack)
    Navigator.pushReplacementNamed(context, AppRoutes.profile);
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.badge, size: 72),
            SizedBox(height: 16),
            Text('Kartu Profil Digital'),
            SizedBox(height: 24),
            CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}
```

### Langkah 4.3 — Daftarkan route dengan `routes:` (versi dasar)

Ubah `MaterialApp` di `main.dart`. **Hapus `home:`**, ganti dengan:

```dart
import 'app/app_routes.dart';
import 'pages/splash_page.dart';
// (import profile_page.dart tetap ada)

MaterialApp(
  // ...title, theme tetap
  initialRoute: AppRoutes.splash,
  routes: {
    AppRoutes.splash: (context) => const SplashPage(),
    AppRoutes.profile: (context) => const ProfilePage(),
  },
)
```

✅ **Checkpoint 4:** Aplikasi menampilkan Splash selama 2 detik, lalu pindah ke Profil. Tekan tombol back di Profil → aplikasi **keluar** (bukan kembali ke Splash), karena Splash sudah diganti.

> ⚠️ **Jangan** memakai `home:` bersamaan dengan route `'/'` di `routes:`; Flutter akan memunculkan error. Perubahan `initialRoute` juga **tidak terlihat dengan hot reload** — gunakan **hot restart** (`R`).

---

## 11. Lab 5 — `onGenerateRoute` + Passing Arguments (Versi Industri)

**Tujuan:** mengirim `Project` dan `Profile` memakai `arguments`, dengan penanganan tipe yang aman.

### Langkah 5.1 — Cara dasar (hanya untuk dipahami)

Dengan peta `routes:`, penerima mengambil data seperti ini:

```dart
// Mengirim
Navigator.pushNamed(context, AppRoutes.projectDetail, arguments: project);

// Menerima, di dalam build()
final project = ModalRoute.of(context)!.settings.arguments as Project;
```

Cara ini **berisiko**:

- Jika lupa mengirim `arguments` atau tipenya salah → **crash** saat runtime.
- Halaman jadi _terikat_ ke sistem route sehingga sulit diuji.
- `ModalRoute.of(context)` tidak boleh dipanggil di `initState()`.

Karena itu, di industri **arguments dibaca di satu tempat (router)**, lalu diteruskan ke halaman lewat constructor.

### Langkah 5.2 — Buat router terpusat

`lib/app/app_router.dart`

```dart
import 'package:flutter/material.dart';

import '../models/models.dart';
import '../pages/edit_profile_page.dart';
import '../pages/not_found_page.dart';
import '../pages/profile_page.dart';
import '../pages/project_detail_page.dart';
import '../pages/splash_page.dart';
import 'app_routes.dart';

class AppRouter {
  AppRouter._();

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    final args = settings.arguments;

    switch (settings.name) {
      case AppRoutes.splash:
        return _build(const SplashPage(), settings);

      case AppRoutes.profile:
        return _build(const ProfilePage(), settings);

      case AppRoutes.projectDetail:
        // Periksa tipe arguments sebelum dipakai
        if (args is Project) {
          return _build(ProjectDetailPage(project: args), settings);
        }
        return _build(const NotFoundPage(), settings);

      case AppRoutes.editProfile:
        if (args is Profile) {
          return _build(EditProfilePage(profile: args), settings);
        }
        return _build(const NotFoundPage(), settings);

      default:
        return _build(const NotFoundPage(), settings);
    }
  }

  // Pembungkus: `settings` wajib diteruskan agar nama route tercatat
  static MaterialPageRoute<dynamic> _build(Widget page, RouteSettings settings) =>
      MaterialPageRoute(builder: (_) => page, settings: settings);
}
```

### Langkah 5.3 — Halaman 404

`lib/pages/not_found_page.dart`

```dart
import 'package:flutter/material.dart';

import '../app/app_routes.dart';

class NotFoundPage extends StatelessWidget {
  const NotFoundPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Oops!')),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.explore_off, size: 64),
            const SizedBox(height: 12),
            const Text('Halaman tidak ditemukan'),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: () => Navigator.pushNamedAndRemoveUntil(
                context,
                AppRoutes.profile,
                (route) => false,
              ),
              child: const Text('Ke Beranda'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### Langkah 5.4 — Pasang router di `main.dart`

Ganti `routes: {...}` dengan:

```dart
import 'app/app_router.dart';

MaterialApp(
  // ...title, theme tetap
  initialRoute: AppRoutes.splash,
  onGenerateRoute: AppRouter.onGenerateRoute,
)
```

> Hapus import `splash_page.dart` dan `profile_page.dart` dari `main.dart` karena tidak dipakai lagi.

### Langkah 5.5 — Ubah navigasi di Profil menjadi named route

Di `profile_page.dart`, ganti import halaman (`project_detail_page.dart`, `edit_profile_page.dart`) dengan:

```dart
import '../app/app_routes.dart';
```

Lalu ubah kedua method:

```dart
void _openProjectDetail(Project project) {
  Navigator.pushNamed(
    context,
    AppRoutes.projectDetail,
    arguments: project, // dikirim sebagai arguments
  );
}

Future<void> _openEditProfile() async {
  final result = await Navigator.pushNamed(
    context,
    AppRoutes.editProfile,
    arguments: _profile,
  );

  // `is Profile` = cek tipe sekaligus cek null
  if (!mounted || result is! Profile) return;
  setState(() => _profile = result);
}
```

✅ **Checkpoint 5:** Semua fitur Pertemuan 1 tetap berjalan: detail proyek terbuka, edit profil menyimpan hasil. Bedanya, sekarang semua halaman terdaftar di **satu tempat** (`AppRouter`), dan halaman Detail/Edit **tidak tahu apa-apa** tentang `arguments`, hanya menerima constructor biasa.

> ⚠️ **Kenapa `result is! Profile` dan bukan `pushNamed<Profile>(...)`?** Route dari `onGenerateRoute` dibuat tanpa tipe hasil spesifik. Menulis `pushNamed<Profile>` dapat memicu error _type cast_. Memeriksa dengan `is` lebih aman dan sudah mencakup pengecekan `null`.

---

## 12. Lab 6 — Mengatur Stack: Logout & Halaman 404

**Tujuan:** memahami operasi stack selain `push` dan `pop`.

### Langkah 6.1 — Tombol keluar

Di `profile_page.dart`, tambahkan tombol kedua pada `actions` AppBar:

```dart
IconButton(
  icon: const Icon(Icons.logout),
  tooltip: 'Keluar',
  onPressed: _logout,
),
```

dan method:

```dart
void _logout() {
  // Pindah ke Splash DAN hapus semua halaman di bawahnya
  Navigator.pushNamedAndRemoveUntil(
    context,
    AppRoutes.splash,
    (route) => false, // false = hapus semua route lama
  );
}
```

### Langkah 6.2 — Uji halaman 404

Sementara, tambahkan tombol percobaan ini di mana saja pada Profil lalu hapus setelah dicoba:

```dart
TextButton(
  onPressed: () => Navigator.pushNamed(context, '/halaman-ngawur'),
  child: const Text('Uji 404'),
),
```

✅ **Checkpoint 6:**

- **Keluar** → Splash → Profil lagi. Tekan back di Profil → aplikasi keluar (stack bersih).
- **Uji 404** → halaman "Halaman tidak ditemukan" tampil.

### Rangkuman operasi stack

| Method                    | Efek pada stack                             | Contoh pemakaian                     |
| ------------------------- | ------------------------------------------- | ------------------------------------ |
| `pushNamed`               | Tambah di atas                              | Buka detail                          |
| `pop` / `maybePop`        | Ambil teratas                               | Tombol kembali, Batal                |
| `pushReplacementNamed`    | Ganti teratas dengan yang baru              | Splash → Home                        |
| `pushNamedAndRemoveUntil` | Tambah baru, hapus yang lama sesuai kondisi | Logout, selesai onboarding           |
| `popUntil`                | Kembali sampai kondisi terpenuhi            | Kembali ke Beranda dari alur panjang |
| `canPop`                  | Cek apakah masih bisa kembali               | Tampilkan/hide tombol back           |

---

## 13. Lab 7 — Mengintip Stack dengan `NavigatorObserver`

**Tujuan:** melihat langsung apa yang terjadi pada stack lewat log.

Buat `lib/app/log_observer.dart`:

```dart
import 'package:flutter/material.dart';

class LogObserver extends NavigatorObserver {
  @override
  void didPush(Route<dynamic> route, Route<dynamic>? previousRoute) {
    debugPrint('PUSH    → ${route.settings.name} (dari ${previousRoute?.settings.name})');
  }

  @override
  void didPop(Route<dynamic> route, Route<dynamic>? previousRoute) {
    debugPrint('POP     ← ${route.settings.name} (kembali ke ${previousRoute?.settings.name})');
  }

  @override
  void didReplace({Route<dynamic>? newRoute, Route<dynamic>? oldRoute}) {
    debugPrint('REPLACE ${oldRoute?.settings.name} → ${newRoute?.settings.name}');
  }

  @override
  void didRemove(Route<dynamic> route, Route<dynamic>? previousRoute) {
    debugPrint('REMOVE  ${route.settings.name}');
  }
}
```

Pasang di `MaterialApp`:

```dart
navigatorObservers: [LogObserver()],
```

Jalankan aplikasi, lakukan semua alur (buka detail, edit, keluar), lalu amati **Debug Console**.

> 💡 **Insight industri:** `NavigatorObserver` dipakai untuk **analytics** (mis. mencatat layar yang dibuka ke Firebase Analytics) dan debugging navigasi.

---

## 14. Lab 8 — Implementasi `go_router` & Perbandingan

**Tujuan:** memindahkan aplikasi yang **sama persis** ke `go_router`, lalu merasakan sendiri apa yang berubah, apa untungnya, dan apa ruginya.

> 💡 Kerjakan di **branch Git baru** supaya versi `Navigator` tetap aman untuk dibandingkan:
> `git checkout -b feat/go-router`. Kalau belum memakai Git, salin dulu seluruh folder project.

### Langkah 8.1 — Pasang paket

```bash
flutter pub add go_router
```

Perintah ini otomatis menambahkan versi terbaru ke `pubspec.yaml`. Cek [pub.dev/packages/go_router](https://pub.dev/packages/go_router) untuk catatan perubahan terbaru.

### Langkah 8.2 — Ubah daftar path

Ganti isi `lib/app/app_routes.dart`:

```dart
class AppRoutes {
  AppRoutes._();

  static const splash = '/';
  static const profile = '/profile';
  static const editProfile = '/profile/edit';

  /// Path berparameter dibuat lewat fungsi, bukan string manual
  static String projectDetail(String id) => '/profile/projects/$id';
}
```

Perhatikan pola path-nya, seperti alamat website:

```
/                          → Splash
/profile                   → Profil
/profile/projects/p1       → Detail proyek p1   (anak dari Profil)
/profile/edit              → Edit profil        (anak dari Profil)
```

### Langkah 8.3 — Pencari proyek berdasarkan ID

Tambahkan di akhir `lib/data/dummy_data.dart`:

```dart
Project? findProjectById(String id) {
  for (final project in dummyProjects) {
    if (project.id == id) return project;
  }
  return null; // tidak ditemukan
}
```

### Langkah 8.4 — Definisikan router

Ganti **seluruh isi** `lib/app/app_router.dart`:

```dart
import 'package:go_router/go_router.dart';

import '../data/dummy_data.dart';
import '../models/models.dart';
import '../pages/edit_profile_page.dart';
import '../pages/not_found_page.dart';
import '../pages/profile_page.dart';
import '../pages/project_detail_page.dart';
import '../pages/splash_page.dart';
import 'app_routes.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: AppRoutes.splash,
  debugLogDiagnostics: true, // cetak log navigasi di Debug Console
  errorBuilder: (context, state) => const NotFoundPage(), // pengganti halaman 404
  routes: [
    GoRoute(
      path: AppRoutes.splash,
      builder: (context, state) => const SplashPage(),
    ),
    GoRoute(
      path: AppRoutes.profile,
      builder: (context, state) => const ProfilePage(),
      routes: [
        // Route anak: path RELATIF (tanpa "/" di depan)
        GoRoute(
          path: 'projects/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            final project = findProjectById(id);
            if (project == null) return const NotFoundPage();
            return ProjectDetailPage(project: project);
          },
        ),
        GoRoute(
          path: 'edit',
          builder: (context, state) {
            final profile = state.extra; // objek yang dikirim lewat `extra`
            if (profile is! Profile) return const NotFoundPage();
            return EditProfilePage(profile: profile);
          },
        ),
      ],
    ),
  ],
);
```

Bandingkan dengan `AppRouter` versi `Navigator` di Lab 5: tidak ada lagi `switch` dan pembungkus `MaterialPageRoute`; setiap halaman dideklarasikan sebagai `GoRoute`.

### Langkah 8.5 — Pasang di `main.dart`

Ganti `MaterialApp(...)` menjadi `MaterialApp.router(...)`:

```dart
import 'app/app_router.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Kartu Profil Digital',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
      routerConfig: appRouter,
    );
  }
}
```

`initialRoute`, `onGenerateRoute`, dan `navigatorObservers` dihapus karena sudah diurus `GoRouter`.

### Langkah 8.6 — Sesuaikan pemanggilan di tiap halaman

Karena `MaterialApp.router` tidak memakai named route bawaan `Navigator`, semua `Navigator.pushNamed(...)` harus diganti. Tambahkan di tiap file yang diubah:

```dart
import 'package:go_router/go_router.dart';
```

**`splash_page.dart`**

```dart
void _goToProfile() {
  if (!mounted) return;
  context.go(AppRoutes.profile); // ganti seluruh stack, mirip pushReplacement
}
```

**`profile_page.dart`**

```dart
void _openProjectDetail(Project project) {
  context.push(AppRoutes.projectDetail(project.id)); // ID di path
}

Future<void> _openEditProfile() async {
  // push<Profile>: hasil sudah bertipe Profile?, tidak perlu `is!`
  final result = await context.push<Profile>(
    AppRoutes.editProfile,
    extra: _profile, // objek dikirim lewat extra
  );
  if (!mounted || result == null) return;
  setState(() => _profile = result);
}

void _logout() {
  context.go(AppRoutes.splash); // stack dibersihkan, tanpa RemoveUntil
}
```

**`edit_profile_page.dart`**

```dart
// di _save()
context.pop(updated);

// tombol Batal
onPressed: () => context.pop(),
```

**`project_detail_page.dart`**

```dart
onPressed: () => context.pop(),
```

**`not_found_page.dart`**

```dart
onPressed: () => context.go(AppRoutes.profile),
```

✅ **Checkpoint 8:** Aplikasi berjalan **sama persis** seperti sebelumnya: Splash → Profil → Detail / Edit → Keluar. Di Debug Console muncul log navigasi dari `debugLogDiagnostics`.

### Langkah 8.7 — Eksperimen: rasakan bedanya

Jalankan di Chrome dengan port tetap:

```bash
flutter run -d chrome --web-port 5000
```

1. **Deep link.** Ubah alamat di browser menjadi `http://localhost:5000/#/profile/projects/p2` lalu tekan Enter. Halaman Detail langsung terbuka, dan tombol **back (←) tetap muncul** karena `go_router` otomatis membangun stack `Profil → Detail` dari struktur path. Dengan `Navigator` biasa, `arguments` tidak ikut ke alamat sehingga Detail tidak bisa dibuka langsung dari URL.
2. **ID tidak valid.** Buka `/#/profile/projects/p99`. Halaman 404 tampil (dari guard `project == null`).
3. **Path ngawur.** Buka `/#/halaman-ngawur`. `errorBuilder` menampilkan halaman 404, tanpa kode tambahan per halaman.
4. **Kelemahan `extra`.** Buka halaman Edit lewat tombol, lalu tekan **refresh** (F5) di browser. Data yang dikirim lewat `extra` tidak bisa diandalkan setelah halaman dimuat ulang, sehingga guard `profile is! Profile` bisa menampilkan 404.
5. **`go` vs `push`.** Ubah sementara `_openProjectDetail` menjadi `context.go(AppRoutes.projectDetail(project.id))`, lalu buka Detail dan perhatikan tombol back serta log di console. Bandingkan dengan `push`, lalu kembalikan ke `push`.

### Peta padanan: `Navigator` ↔ `go_router`

| Tujuan                       | `Navigator` (Lab 1–7)                        | `go_router` (Lab 8)                                    |
| ---------------------------- | -------------------------------------------- | ------------------------------------------------------ |
| Buka halaman di atas stack   | `Navigator.pushNamed(context, name)`         | `context.push(path)`                                   |
| Kirim data ke halaman tujuan | `arguments: data`                            | `extra: data` atau parameter di path (`/projects/:id`) |
| Kembali (+ hasil)            | `Navigator.pop(context, hasil)`              | `context.pop(hasil)`                                   |
| Terima hasil                 | `await pushNamed(...)` lalu cek `is`         | `await context.push<Tipe>(...)` (sudah bertipe)        |
| Ganti halaman saat ini       | `pushReplacementNamed`                       | `context.replace(path)`                                |
| Pindah & bersihkan stack     | `pushNamedAndRemoveUntil(..., (r) => false)` | `context.go(path)`                                     |
| Halaman tidak dikenal        | `default:` di `onGenerateRoute`              | `errorBuilder`                                         |
| Daftar halaman               | `switch` di `AppRouter`                      | daftar `GoRoute` (bisa bertingkat)                     |

### ⚖️ Kelebihan dan Kekurangan `go_router`

**Kelebihan**

| Kelebihan                                                            | Terlihat di mana?            |
| -------------------------------------------------------------------- | ---------------------------- |
| **URL/path jelas** dan mendukung deep link & web                     | Eksperimen 1                 |
| **Stack otomatis** dari struktur path, back button selalu benar      | Eksperimen 1                 |
| **Parameter di path** (`:id`) dan query (`?tab=2`) tersedia langsung | `state.pathParameters`       |
| **Hasil bertipe** (`push<Profile>`), tanpa cek `is` manual           | `_openEditProfile`           |
| **Halaman 404 terpusat**                                             | `errorBuilder`, Eksperimen 3 |
| **Redirect/guard terpusat** (mis. paksa login)                       | Contoh di bawah              |

**Kekurangan**

| Kekurangan                          | Penjelasan                                                                                                                             |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Ketergantungan paket eksternal**  | Harus mengikuti versi dan perubahan antar _major version_. `Navigator` bagian dari Flutter itu sendiri.                                |
| **Dua paradigma: `go` vs `push`**   | Salah memilih `go` bisa menghapus stack sehingga tombol back hilang (Eksperimen 5).                                                    |
| **`extra` tidak aman**              | Tidak bertipe, perlu cast manual, dan tidak ikut URL (Eksperimen 4). Solusinya: kirim **ID** lewat path, ambil data di halaman tujuan. |
| **Path tetap berupa String**        | Masih rawan typo; itulah alasan kita memakai `AppRoutes`. Untuk tim besar ada pembangkit kode `go_router_builder`.                     |
| **Berlebihan untuk aplikasi kecil** | Aplikasi 3–4 halaman tanpa web/deep link cukup dengan `Navigator` + named routes.                                                      |

**Contoh redirect** (konsep saja, dikerjakan di Challenge):

```dart
GoRouter(
  redirect: (context, state) {
    final loggedIn = false; // nanti diambil dari state/auth service
    final atLogin = state.matchedLocation == '/login';
    if (!loggedIn && !atLogin) return '/login'; // paksa login
    return null; // null = lanjutkan seperti biasa
  },
  routes: [ /* ... */ ],
);
```

**Kapan memilih yang mana?**

| Situasi                                                                 | Pilihan                                                           |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Aplikasi kecil, tanpa deep link/web                                     | `Navigator` + named routes                                        |
| Butuh deep link, URL web, atau notifikasi yang membuka halaman tertentu | `go_router`                                                       |
| Banyak halaman dan alur login/role                                      | `go_router` (redirect terpusat)                                   |
| Tim besar, banyak fitur                                                 | `go_router`, biasanya dengan aturan penamaan path yang disepakati |

### ⚠️ Pitfall `go_router`

| #   | Masalah                                                     | Penyebab & Solusi                                                                                |
| --- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1   | `context.go` / `context.push` tidak dikenali                | Lupa `import 'package:go_router/go_router.dart';` di file tersebut.                              |
| 2   | Error saat aplikasi dijalankan: path route anak tidak valid | Path route anak **tidak boleh diawali `/`** (tulis `'edit'`, bukan `'/edit'`).                   |
| 3   | Tombol back hilang setelah berpindah                        | Memakai `go` padahal seharusnya `push`.                                                          |
| 4   | Perubahan daftar route tidak berefek                        | `appRouter` dibuat sekali; gunakan **hot restart**, bukan hot reload.                            |
| 5   | `extra` bernilai `null` / bertipe salah                     | Tidak dikirim, atau halaman dibuka ulang. Selalu pakai guard `is!`, atau pindahkan data ke path. |

---

## 15. ⚠️ Pitfall Pertemuan 2

| #   | Masalah                                                | Penyebab & Solusi                                                                                               |
| --- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| 1   | Error saat membuka halaman, nama route tidak ditemukan | Typo pada string route. Gunakan konstanta `AppRoutes` dan sediakan `default:` di `onGenerateRoute`.             |
| 2   | `ModalRoute.of(context)` error di `initState()`        | Context belum siap. Baca di `build()` / `didChangeDependencies()`, atau gunakan pola constructor seperti Lab 5. |
| 3   | Error `home` dan route `'/'` bentrok                   | Pilih salah satu. Jika memakai `initialRoute`, hapus `home`.                                                    |
| 4   | Perubahan `initialRoute` tidak berefek                 | Lakukan **hot restart**, bukan hot reload.                                                                      |
| 5   | Lupa `settings: settings` di `MaterialPageRoute`       | Nama route dan arguments tidak tercatat; `NavigatorObserver` menampilkan `null`.                                |
| 6   | Data `arguments` bertipe salah → crash                 | Selalu cek dengan `is` sebelum dipakai (seperti di `AppRouter`).                                                |

## 16. 💡 Insight Industri — Pertemuan 2

1. **Satu tempat untuk semua route.** `AppRoutes` (nama) + `AppRouter` (pembuat halaman) = mudah dicari, diubah, dan di-_review_ tim.
2. **Halaman tidak tahu soal `arguments`.** Parsing arguments hanya di router; halaman menerima parameter bertipe lewat constructor.
3. **Kirim ID, bukan objek besar.** Untuk aplikasi nyata dengan API, kirim `projectId` lalu ambil data di halaman tujuan. Alasannya: data selalu segar, dan alamat halaman bisa dibuka ulang dari _deep link_/notifikasi (objek tidak bisa ikut terkirim lewat link).
4. **Alur autentikasi memakai stack dengan benar.** Splash/Login diganti (`pushReplacement`), logout membersihkan stack (`pushAndRemoveUntil`), supaya tombol back tidak membawa pengguna kembali ke halaman yang seharusnya sudah tidak bisa diakses.
5. **Tangani route tak dikenal** (halaman 404) agar aplikasi tidak crash saat menerima link atau data yang salah.

### 🚀 Naik Level: `go_router`

`Navigator` yang kamu pelajari (`push`/`pop`) bersifat **imperatif**: kamu memberi perintah satu per satu. Untuk aplikasi besar, industri banyak memakai **`go_router`**, paket navigasi **deklaratif** yang dikelola tim Flutter ([pub.dev/packages/go_router](https://pub.dev/packages/go_router)). Kamu sudah mengimplementasikannya di **Lab 8**, lengkap dengan perbandingan kelebihan dan kekurangannya.

Konsep yang kamu pelajari di modul ini (stack, route, argumen, hasil `pop`, replace/remove) **tetap berlaku** di `go_router`. Ia hanya membungkusnya dengan cara yang lebih rapi.

## 17. 🧠 Cek Pemahaman

1. Sebutkan dua keuntungan named route dibanding `MaterialPageRoute` langsung.
2. Apa beda `pushReplacementNamed` dan `pushNamedAndRemoveUntil`?
3. Mengapa pengecekan tipe `arguments` perlu dilakukan di `AppRouter`, bukan di setiap halaman?
4. Apa yang terjadi jika kamu lupa menambahkan `default:` pada `onGenerateRoute` dan membuka route yang tidak terdaftar?
5. Apa beda `context.go()` dan `context.push()` di `go_router`? Kapan memilih masing-masing?
6. Mengapa proyek dikirim lewat ID di path, sedangkan `Profile` lewat `extra`? Apa risiko `extra`?

## 18. 🏆 Challenge Pertemuan 2

- ⭐ **Halaman Pengaturan.** Tambahkan route `/settings` dengan satu `Switch` (mis. "Tampilkan bio"), dibuka dari ikon di AppBar Profil. Daftarkan di `AppRoutes` dan `AppRouter`.
- ⭐⭐ **Kirim ID, bukan objek.** Ubah `arguments` pada `projectDetail` menjadi `String` (ID proyek). Router mencari proyek dari `dummyProjects`; jika ID tidak ditemukan, tampilkan `NotFoundPage`. _(Petunjuk: `dummyProjects.where(...)` atau `firstWhere` dengan `orElse`; pertimbangkan membuat fungsi pencari di `dummy_data.dart`.)_
- ⭐⭐⭐ **Redirect & Login dengan `go_router`.** Di branch `go_router`, tambahkan halaman `/login` dan variabel `isLoggedIn`. Gunakan `redirect` agar pengguna yang belum login selalu diarahkan ke `/login`, dan tombol Keluar mengubah status login. _(Petunjuk: parameter `redirect` pada `GoRouter`, `state.matchedLocation`.)_
- 🌟 **Bonus:** Tambahkan konfirmasi `AlertDialog` ("Yakin ingin keluar?") sebelum logout.

---

## ✅ Daftar Periksa Akhir

Aplikasi dinyatakan selesai jika:

- [ ] Splash tampil 2 detik lalu otomatis pindah ke Profil.
- [ ] Ketuk kartu proyek → halaman Detail menampilkan data proyek yang benar.
- [ ] Edit Profil → Simpan mengubah tampilan Profil; Batal tidak mengubah apa-apa.
- [ ] Tombol Keluar mengembalikan ke Splash dan stack bersih.
- [ ] Route yang tidak dikenal menampilkan halaman 404.
- [ ] Log `NavigatorObserver` muncul di Debug Console.
- [ ] (Lab 8) Versi `go_router`: alamat `/profile/projects/p1` membuka Detail dengan tombol back ke Profil.

## 📝 Ringkasan Materi

```dart
// Pindah halaman
Navigator.push(context, MaterialPageRoute(builder: (_) => Halaman()));
Navigator.pushNamed(context, '/nama', arguments: data);

// Kembali (+ kirim hasil)
Navigator.pop(context);
Navigator.pop(context, hasil);

// Terima hasil
final hasil = await Navigator.pushNamed(context, '/nama');
if (!mounted || hasil is! Tipe) return;

// Atur stack
Navigator.pushReplacementNamed(context, '/nama');
Navigator.pushNamedAndRemoveUntil(context, '/nama', (route) => false);
Navigator.popUntil(context, ModalRoute.withName('/profile'));
```

```dart
// go_router
context.go('/profile');                       // ganti seluruh stack
context.push('/profile/projects/p1');         // tambah di atas stack
final hasil = await context.push<Profile>('/profile/edit', extra: data);
context.pop(hasil);                           // kembali (+ hasil)
```

---

## 📚 Referensi

- Navigasi di Flutter: <https://docs.flutter.dev/ui/navigation>
- Kelas `Navigator`: <https://api.flutter.dev/flutter/widgets/Navigator-class.html>
- Kelas `NavigatorObserver`: <https://api.flutter.dev/flutter/widgets/NavigatorObserver-class.html>
- Kelas `PopScope`: <https://api.flutter.dev/flutter/widgets/PopScope-class.html>
- Paket `go_router`: <https://pub.dev/packages/go_router>
