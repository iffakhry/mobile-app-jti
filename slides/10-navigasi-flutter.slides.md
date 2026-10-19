---
theme: default
title: Modul 8 — Navigasi di Flutter
info: |
  Praktikum Pemrograman Mobile · Flutter & Dart
  Navigator, Named Routes, Passing Arguments, go_router
layout: cover
class: text-center
highlighter: shiki
lineNumbers: false
transition: slide-left
colorSchema: light
aspectRatio: 16/9
canvasWidth: 980
drawings:
  persist: false
---

# Navigasi di Flutter

Navigator · Named Routes · Passing Arguments

<div class="mt-8 opacity-70 text-sm">

Praktikum Pemrograman Mobile · Flutter & Dart · Modul 8 · 2 × 4 jam

</div>

<!--
Deck ini mengikuti modul-08-navigasi-flutter.md.
Cuplikan kode pada slide disederhanakan; kode lengkap ada di modul.
Catatan presenter (tombol P) berisi kunci jawaban cek pemahaman.
-->

---

# 🎯 Tujuan Pembelajaran

Setelah praktikum ini, kamu mampu:

1. Menjelaskan **route** dan **stack Navigator**
2. Berpindah halaman dengan `push` dan `pop`
3. Mengirim data (constructor, arguments) dan **mengembalikan data**
4. Memakai **named routes** + `onGenerateRoute`
5. Mengatur stack: `pushReplacementNamed`, `pushNamedAndRemoveUntil`, halaman 404
6. Mengimplementasikan **`go_router`** dan membandingkannya dengan `Navigator`

---

# 🗺️ Studi Kasus: Kartu Profil Digital

<div class="text-sm">

- Lanjutan Modul 1–7, kita **tambahkan navigasi antar halaman**
- Hasil akhir: project jadi, bisa di-run, dan tampilan sesuai harapan
- Cuplikan kode di slide disederhanakan; **kode lengkap ada di modul**

</div>

<div style="--slidev-code-font-size:11px;--slidev-code-line-height:16px">

```text
Splash ──(2 detik)──► Profil ──ketuk proyek──► Detail Proyek
                        │
                        ├── ikon edit ──► Edit Profil ──simpan──► kembali (+ data baru)
                        └── ikon keluar ──► Splash (stack dibersihkan)
```

</div>

<style>.slidev-code{font-size:11px !important;line-height:16px !important}</style>

---

# ⏱️ Rencana Waktu

<div class="grid grid-cols-2 gap-6 text-xs">
<div>

**Pertemuan 1 (4 jam)**

| Sesi | Durasi |
|---|---|
| Konsep Navigator | 25 mnt |
| Lab 1 — Persiapan project & data | 35 mnt |
| Lab 2 — `push`/`pop` + constructor | 45 mnt |
| *Istirahat* | 15 mnt |
| Lab 3 — Mengembalikan data | 50 mnt |
| Pitfall, insight, cek pemahaman | 20 mnt |
| 🏆 Challenge | 50 mnt |

</div>
<div>

**Pertemuan 2 (4 jam)**

| Sesi | Durasi |
|---|---|
| Konsep Named Routes & Arguments | 25 mnt |
| Lab 4 — Named routes + Splash | 45 mnt |
| Lab 5 — `onGenerateRoute` + arguments | 50 mnt |
| *Istirahat* | 15 mnt |
| Lab 6 — Logout & halaman 404 | 30 mnt |
| Lab 7 — `NavigatorObserver` | 10 mnt |
| Lab 8 — Implementasi `go_router` | 35 mnt |
| Insight & cek pemahaman | 10 mnt |
| 🏆 Challenge | 20 mnt |

</div>
</div>

---
layout: section
---

# 📘 Pertemuan 1

Navigator Dasar

---

# Route dan Navigator

<div class="grid grid-cols-2 gap-6" style="--slidev-code-font-size:12px;--slidev-code-line-height:17px">
<div>

- **Route** = satu halaman / layar
- **Navigator** = widget pengelola route dalam bentuk **stack**
- Halaman paling atas = yang tampil
- `push` = menaruh piring di atas, `pop` = mengambil yang teratas 🍽️

</div>
<div>

```text
Awal         push(Detail)    pop()
┌───────┐    ┌────────┐     ┌───────┐
│       │    │ Detail │ ←   │       │
│Profil │ ←  │ Profil │     │Profil │ ←
└───────┘    └────────┘     └───────┘

  ← = halaman yang tampil
```

</div>
</div>

<style>.slidev-code{font-size:12px !important;line-height:17px !important}</style>

---

# Tiga Hal Penting

<div class="text-sm">

| Konsep | Penjelasan |
|---|---|
| `Navigator.push(context, route)` | Menambah halaman baru di atas stack |
| `Navigator.pop(context)` | Menutup halaman teratas, kembali ke sebelumnya |
| `MaterialPageRoute` | Route dengan transisi bawaan platform |

</div>

<div class="mt-6 p-4 rounded bg-blue-50 text-sm">

💡 `push` mengembalikan **`Future`**. Future selesai saat halaman ditutup dan membawa **hasil** dari `pop`. Ini dasar untuk mengembalikan data (Lab 3). Ingat `async/await` di Modul 2.

</div>

---

# Tiga Cara Memindahkan Data

<div class="text-sm">

| Arah | Cara | Dipelajari di |
|---|---|---|
| Halaman A → B | *Constructor* | Lab 2 |
| Halaman A → B | `arguments` (named route) | Lab 5 |
| Halaman B → A | Hasil `Navigator.pop(context, hasil)` | Lab 3 |

</div>

<div class="mt-6 text-sm opacity-80">

Pada `go_router` (Lab 8), data dikirim lewat **parameter di path** (`/projects/:id`) atau `extra`.

</div>

---

# Lab 1 — Struktur & Model (1/4)

<div class="grid grid-cols-2 gap-6" style="--slidev-code-font-size:11px;--slidev-code-line-height:16px">
<div>

```text
lib/
├── main.dart
├── models/
│   └── models.dart
├── data/
│   └── dummy_data.dart
└── pages/
    ├── profile_page.dart
    ├── project_detail_page.dart
    └── edit_profile_page.dart
```

<div class="text-sm">

💡 Pisahkan `models`, `data`, `pages`. Jangan taruh semuanya di `main.dart`.

</div>

</div>
<div>

```dart
class Project {
  final String id, title, description;
  final List<String> techStack;
  const Project({
    required this.id,
    required this.title,
    required this.description,
    required this.techStack,
  });
}

class Profile {
  final String name, bio;
  const Profile({required this.name, required this.bio});

  Profile copyWith({String? name, String? bio}) =>
      Profile(name: name ?? this.name, bio: bio ?? this.bio);
}
```

</div>
</div>

<style>.slidev-code{font-size:11px !important;line-height:16px !important}</style>

---

# Lab 1 — Data Contoh (2/4)

<div class="grid grid-cols-5 gap-6" style="--slidev-code-font-size:11px;--slidev-code-line-height:16px">
<div class="col-span-3">

```dart
// lib/data/dummy_data.dart
const defaultProfile = Profile(
  name: 'Fakhry Firdaus',
  bio: 'Software Engineer & Dosen. Suka berbagi '
      'ilmu tentang Flutter dan aplikasi mobile.',
);

const dummyProjects = <Project>[
  Project(
    id: 'p1',
    title: 'Aplikasi Absensi Kampus',
    description: 'Presensi berbasis QR code.',
    techStack: ['Flutter', 'Firebase', 'Provider'],
  ),
  // p2: Katalog UMKM Jember
  // p3: Monitoring Kandang Pintar
];
```

</div>
<div class="col-span-2 text-sm">

**Insight**

- Field `final` → data **immutable**
- Mengubah data = buat objek **baru** dengan `copyWith`
- Pola ini dipakai luas di state management (modul berikutnya)

</div>
</div>

<style>.slidev-code{font-size:11px !important;line-height:16px !important}</style>

---

# Lab 1 — Halaman Profil (3/4)

<div class="grid grid-cols-5 gap-6" style="--slidev-code-font-size:10px;--slidev-code-line-height:14px">
<div class="col-span-3">

```dart
class _ProfilePageState extends State<ProfilePage> {
  Profile _profile = defaultProfile; // state lokal

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Kartu Profil Digital'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {}, // TODO: Lab 3
          ),
        ],
      ),
      body: ListView(children: [
        /* avatar, nama, bio */
        for (final p in dummyProjects)
          Card(child: ListTile(
            title: Text(p.title),
            subtitle: Text(p.techStack.join(' • ')),
            onTap: () {}, // TODO: Lab 2
          )),
      ]),
    );
  }
}
```

</div>
<div class="col-span-2 text-sm">

**Yang harus tampil**

- Foto, nama, bio
- 3 kartu proyek
- Ikon edit di AppBar

Ada `TODO` untuk **Lab 2** (ketuk kartu) dan **Lab 3** (ikon edit).

Sudah punya `ProfilePage` dari modul sebelumnya? Pindahkan ke file ini.

</div>
</div>

<style>.slidev-code{font-size:10px !important;line-height:14px !important}</style>

---

# Lab 1 — main.dart (4/4)

<div class="grid grid-cols-5 gap-6" style="--slidev-code-font-size:11px;--slidev-code-line-height:16px">
<div class="col-span-3">

```dart
void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Kartu Profil Digital',
      theme: ThemeData(
        colorSchemeSeed: Colors.indigo,
        useMaterial3: true,
      ),
      home: const ProfilePage(),
    );
  }
}
```

</div>
<div class="col-span-2">

<div class="p-4 rounded bg-green-50 text-sm">

✅ **Checkpoint 1**

Aplikasi berjalan dan menampilkan foto, nama, bio, dan 3 kartu proyek. Mengetuk kartu belum melakukan apa-apa.

</div>

</div>
</div>

<style>.slidev-code{font-size:11px !important;line-height:16px !important}</style>

---

# Lab 2 — Halaman Detail (1/2)

<div class="grid grid-cols-5 gap-6" style="--slidev-code-font-size:11px;--slidev-code-line-height:16px">
<div class="col-span-3">

```dart
class ProjectDetailPage extends StatelessWidget {
  final Project project;
  const ProjectDetailPage({super.key, required this.project});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(project.title)),
      body: Column(children: [
        Text(project.description),
        /* Wrap berisi Chip dari techStack */
        FilledButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Kembali'),
        ),
      ]),
    );
  }
}
```

</div>
<div class="col-span-2 text-sm">

**Perhatikan**

- Data `project` dikirim lewat **constructor**, seperti widget biasa
- `Navigator.pop(context)` menutup halaman ini
- Tombol back di AppBar muncul **otomatis**

</div>
</div>

<style>.slidev-code{font-size:11px !important;line-height:16px !important}</style>

---

# Lab 2 — Navigasi dari Profil (2/2)

<div class="grid grid-cols-2 gap-6" style="--slidev-code-font-size:11px;--slidev-code-line-height:16px">
<div>

```dart
import 'project_detail_page.dart';

void _openProjectDetail(Project project) {
  Navigator.push(
    context,
    MaterialPageRoute(
      builder: (context) =>
          ProjectDetailPage(project: project),
    ),
  );
}

// di ListTile:
onTap: () => _openProjectDetail(project),
```

</div>
<div class="text-sm">

<div class="p-4 rounded bg-green-50">

✅ **Checkpoint 2**

Ketuk kartu → Detail muncul. Tombol **Kembali** dan tombol back (←) sama-sama kembali ke Profil.

</div>

<div class="mt-4 p-4 rounded bg-yellow-50">

🔎 **Coba sendiri**

Panggil `Navigator.pop(context)` dua kali berturut-turut. Apa yang terjadi? Mengapa?

</div>

</div>
</div>

<style>.slidev-code{font-size:11px !important;line-height:16px !important}</style>

<!--
Jawaban: stack tinggal 1 halaman lalu di-pop lagi, sehingga layar hitam / aplikasi tertutup.
Solusi: Navigator.maybePop atau cek Navigator.canPop.
-->

---

# Lab 3 — Halaman Edit (1/3)

<div class="grid grid-cols-2 gap-6" style="--slidev-code-font-size:11px;--slidev-code-line-height:16px">
<div>

```dart
class _EditProfilePageState
    extends State<EditProfilePage> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _bioController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(
        text: widget.profile.name);
    _bioController = TextEditingController(
        text: widget.profile.bio);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _bioController.dispose();
    super.dispose();
  }
```

</div>
<div>

```dart
void _save() {
  if (!_formKey.currentState!.validate()) return;

  final updated = widget.profile.copyWith(
    name: _nameController.text.trim(),
    bio: _bioController.text.trim(),
  );

  // tutup halaman SEKALIGUS kirim hasil
  Navigator.pop(context, updated);
}
```

<div class="mt-4 text-sm">

- Isi awal form dari data **constructor**
- Hasil dikirim lewat argumen kedua `pop`
- `dispose()` controller itu wajib

</div>

</div>
</div>

<style>.slidev-code{font-size:11px !important;line-height:16px !important}</style>

---

# Lab 3 — Form & Tombol (2/3)

<div class="grid grid-cols-2 gap-6" style="--slidev-code-font-size:10px;--slidev-code-line-height:14px">
<div>

```dart
Form(
  key: _formKey,
  child: Column(children: [
    TextFormField(
      controller: _nameController,
      decoration: const InputDecoration(
        labelText: 'Nama',
      ),
      validator: (v) =>
          (v == null || v.trim().isEmpty)
              ? 'Nama tidak boleh kosong'
              : null,
    ),
    TextFormField(
      controller: _bioController,
      maxLines: 3,
    ),
    // Row tombol → lihat kolom kanan
  ]),
)
```

</div>
<div>

```dart
Row(children: [
  OutlinedButton(
    onPressed: () => Navigator.pop(context),
    child: const Text('Batal'),
  ),
  FilledButton(
    onPressed: _save,
    child: const Text('Simpan'),
  ),
]),
```

<div class="mt-4 text-sm">

- **Batal** / tombol back → hasil `null`
- **Simpan** → hasil `Profile` baru
- `validator` mencegah nama kosong

</div>

</div>
</div>

<style>.slidev-code{font-size:10px !important;line-height:14px !important}</style>

---

# Lab 3 — Terima Hasilnya (3/3)

<div class="grid grid-cols-2 gap-6" style="--slidev-code-font-size:11px;--slidev-code-line-height:16px">
<div>

```dart
Future<void> _openEditProfile() async {
  final result = await Navigator.push<Profile>(
    context,
    MaterialPageRoute(
      builder: (context) =>
          EditProfilePage(profile: _profile),
    ),
  );

  // widget masih aktif? ada hasil?
  if (!mounted || result == null) return;
  setState(() => _profile = result);
}

// ikon edit:
onPressed: _openEditProfile,
```

</div>
<div>

```text
ProfilePage
   │ constructor (profile)
   ▼
EditProfilePage
   │ pop(context, updated)
   ▼
ProfilePage
```

<div class="mt-3 p-3 rounded bg-green-50 text-sm">

✅ **Checkpoint 3**

- Simpan → nama di Profil berubah
- Batal / back → data **tidak** berubah
- Nama kosong → pesan validasi

</div>

</div>
</div>

<style>.slidev-code{font-size:11px !important;line-height:16px !important}</style>

---

# ⚠️ Pitfall — Pertemuan 1

<div class="text-sm">

| Masalah | Penyebab & solusi |
|---|---|
| `pop` dua kali → layar hitam | Stack tinggal 1 halaman. Pakai `maybePop` / `canPop` |
| Peringatan *BuildContext across async gaps* | Cek `if (!mounted) return;` setelah `await` |
| Aplikasi membuka halaman tanpa henti | `push` dipanggil di `build()`. Panggil hanya di **callback** |
| Data tidak berubah saat back ditekan | Hasil `pop` adalah `null`. **Selalu cek `null`** |
| Controller tidak dibersihkan | Panggil `dispose()` agar tidak memory leak |

</div>

---

# 💡 Insight Industri — Pertemuan 1

<div class="text-sm">

1. **Halaman = widget biasa.** Terima data lewat constructor `required`, bukan variabel global
2. **Data immutable + `copyWith`.** Halaman Edit mengembalikan objek **baru**, bukan mengubah objek asli
3. **Cek `mounted`** setiap kali memakai `context`/`setState` setelah `await`
4. **Kirim data seminimal mungkin.** Di aplikasi nyata, detail menerima **ID** lalu mengambil data dari repository/API (dibahas lagi di Pertemuan 2)

</div>

---

# 🧠 Cek Pemahaman — Pertemuan 1

<div class="text-sm">

1. Apa yang dikembalikan `Navigator.push()` dan kapan nilainya tersedia?
2. Mengapa tombol back otomatis muncul di Detail, tapi tidak di Profil?
3. Apa yang terjadi pada hasil jika pengguna menekan tombol back sistem di halaman Edit?
4. Mengapa perlu `if (!mounted) return;` setelah `await`?

</div>

<!--
Kunci:
1. Sebuah Future yang selesai saat halaman ditutup (pop), berisi hasil pop atau null.
2. AppBar mendeteksi ada halaman di bawahnya di stack; Profil adalah halaman paling bawah.
3. Hasilnya null, sehingga perlu dicek sebelum dipakai.
4. Selama menunggu, halaman bisa saja sudah ditutup; memakai context/setState pada widget yang tidak aktif menyebabkan error.
-->

---

# 🏆 Challenge — Pertemuan 1

<div class="text-sm">

- ⭐ **Field `jabatan`** — tambah di `Profile`, form Edit, dan tampilkan di bawah nama
- ⭐⭐ **Umpan balik** — `SnackBar` "Profil berhasil diperbarui" **hanya jika** pengguna menyimpan perubahan
  *(petunjuk: `ScaffoldMessenger`, jangan lupa `mounted`)*
- ⭐⭐⭐ **Konfirmasi buang perubahan** — dialog "Buang perubahan?" saat back/Batal setelah form diubah
  *(petunjuk: `PopScope`, `showDialog`)*
- 🌟 **Bonus** — animasi `Hero` pada ikon proyek antara kartu dan halaman Detail

</div>

---
layout: section
---

# 📗 Pertemuan 2

Named Routes & Passing Arguments

---

# Kenapa Named Routes?

<div class="grid grid-cols-2 gap-6" style="--slidev-code-font-size:11px;--slidev-code-line-height:16px">
<div>

```dart
// Sebelum (Pertemuan 1)
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (_) =>
        ProjectDetailPage(project: p),
  ),
);

// Sesudah (Pertemuan 2)
Navigator.pushNamed(
  context,
  AppRoutes.projectDetail,
  arguments: p,
);
```

</div>
<div class="text-sm">

**Masalah tanpa nama route**

- Pembuatan route tersebar di banyak tempat
- Sulit dilacak dan diubah saat halaman bertambah banyak

**Named route**

- Setiap halaman punya **nama** (`'/profile'`)
- Semua daftar halaman di **satu tempat**

</div>
</div>

<style>.slidev-code{font-size:11px !important;line-height:16px !important}</style>

---

# Dua Cara Mendaftarkan Route

<div class="text-sm">

| Cara | Cocok untuk | Kelemahan |
|---|---|---|
| `routes: { ... }` (peta statis) | Halaman tanpa data | Sulit mengirim *arguments* dengan aman |
| `onGenerateRoute` (fungsi) | Halaman dengan data / logika | Sedikit lebih panjang — **dipakai di industri** |

</div>

<div class="mt-6 p-4 rounded bg-blue-50 text-sm">

**Passing arguments:** `pushNamed(..., arguments: data)` mengirim data bertipe `Object?`. Penerima **harus memeriksa tipenya** sebelum dipakai.

</div>

---

# Lab 4 — AppRoutes & Splash (1/2)

<div class="grid grid-cols-2 gap-6" style="--slidev-code-font-size:11px;--slidev-code-line-height:16px">
<div>

```dart
// lib/app/app_routes.dart
class AppRoutes {
  AppRoutes._();

  static const splash = '/';
  static const profile = '/profile';
  static const projectDetail = '/project-detail';
  static const editProfile = '/edit-profile';
}
```

<div class="mt-3 text-sm">

💡 Jangan menulis string route di banyak tempat. Typo `'/profil'` baru ketahuan saat runtime. Dengan **konstanta**, IDE ikut membantu.

</div>

</div>
<div>

```dart
// SplashPage
@override
void initState() {
  super.initState();
  Future.delayed(
    const Duration(seconds: 2),
    _goToProfile,
  );
}

void _goToProfile() {
  if (!mounted) return;
  Navigator.pushReplacementNamed(
    context,
    AppRoutes.profile,
  );
}
```

</div>
</div>

<style>.slidev-code{font-size:11px !important;line-height:16px !important}</style>

---

# Lab 4 — Daftarkan Route (2/2)

<div style="--slidev-code-font-size:12px;--slidev-code-line-height:17px">

```dart
MaterialApp(
  // hapus `home:`, ganti dengan:
  initialRoute: AppRoutes.splash,
  routes: {
    AppRoutes.splash: (context) => const SplashPage(),
    AppRoutes.profile: (context) => const ProfilePage(),
  },
)
```

</div>

<div class="grid grid-cols-2 gap-6 mt-4 text-sm">
<div class="p-4 rounded bg-green-50">

✅ **Checkpoint 4**

Splash 2 detik → Profil. Tekan back di Profil → aplikasi **keluar** (Splash sudah diganti, bukan ditumpuk).

</div>
<div class="p-4 rounded bg-yellow-50">

⚠️ **Hati-hati**

- Jangan pakai `home:` bersamaan dengan route `'/'`
- Perubahan `initialRoute` butuh **hot restart** (`R`)

</div>
</div>

<style>.slidev-code{font-size:12px !important;line-height:17px !important}</style>

---

# Lab 5 — Cara Dasar & Risikonya (1/4)

<div style="--slidev-code-font-size:12px;--slidev-code-line-height:17px">

```dart
// Mengirim
Navigator.pushNamed(context, AppRoutes.projectDetail,
    arguments: project);

// Menerima, di dalam build()
final project =
    ModalRoute.of(context)!.settings.arguments as Project;
```

</div>

<div class="mt-4 text-sm">

**Berisiko:**

- Lupa mengirim `arguments` atau tipe salah → **crash** saat runtime
- Halaman **terikat** ke sistem route, sulit diuji
- `ModalRoute.of(context)` tidak boleh dipanggil di `initState()`

**Solusi industri:** baca `arguments` di **satu tempat (router)**, lalu teruskan ke halaman lewat **constructor**.

</div>

<style>.slidev-code{font-size:12px !important;line-height:17px !important}</style>

---

# Lab 5 — onGenerateRoute (2/4)

<div class="grid grid-cols-2 gap-6" style="--slidev-code-font-size:11px;--slidev-code-line-height:16px">
<div>

```dart
class AppRouter {
  AppRouter._();

  static Route<dynamic> onGenerateRoute(
      RouteSettings settings) {
    final args = settings.arguments;

    switch (settings.name) {
      case AppRoutes.splash:
        return _build(const SplashPage(), settings);

      case AppRoutes.profile:
        return _build(const ProfilePage(), settings);
```

</div>
<div>

```dart
      case AppRoutes.projectDetail:
        if (args is Project) {
          return _build(
            ProjectDetailPage(project: args),
            settings,
          );
        }
        return _build(const NotFoundPage(), settings);

      // editProfile: sama, cek `args is Profile`

      default:
        return _build(const NotFoundPage(), settings);
    }
  }
```

</div>
</div>

<style>.slidev-code{font-size:11px !important;line-height:16px !important}</style>

---

# Lab 5 — Helper, 404, main (3/4)

<div class="grid grid-cols-2 gap-6" style="--slidev-code-font-size:11px;--slidev-code-line-height:16px">
<div>

```dart
// Pembungkus: settings wajib diteruskan
static MaterialPageRoute<dynamic> _build(
  Widget page,
  RouteSettings settings,
) =>
    MaterialPageRoute(
      builder: (_) => page,
      settings: settings,
    );
```

<div class="mt-3 text-sm">

**`NotFoundPage`**: ikon + teks "Halaman tidak ditemukan" + tombol yang memanggil `pushNamedAndRemoveUntil` ke Profil.

</div>

</div>
<div>

```dart
// main.dart
MaterialApp(
  initialRoute: AppRoutes.splash,
  onGenerateRoute: AppRouter.onGenerateRoute,
)
```

<div class="mt-3 text-sm">

- Hapus `routes: {...}` dan import halaman yang tidak dipakai lagi
- Lupa `settings: settings` → nama route & arguments tidak tercatat

</div>

</div>
</div>

<style>.slidev-code{font-size:11px !important;line-height:16px !important}</style>

---

# Lab 5 — Profil Memakai pushNamed (4/4)

<div class="grid grid-cols-5 gap-6" style="--slidev-code-font-size:11px;--slidev-code-line-height:16px">
<div class="col-span-3">

```dart
void _openProjectDetail(Project project) {
  Navigator.pushNamed(
    context,
    AppRoutes.projectDetail,
    arguments: project,
  );
}

Future<void> _openEditProfile() async {
  final result = await Navigator.pushNamed(
    context,
    AppRoutes.editProfile,
    arguments: _profile,
  );
  if (!mounted || result is! Profile) return;
  setState(() => _profile = result);
}
```

</div>
<div class="col-span-2 text-sm">

<div class="p-3 rounded bg-green-50">

✅ **Checkpoint 5**

Semua fitur Pertemuan 1 tetap jalan. Bedanya: route terpusat di `AppRouter`, halaman tidak tahu soal `arguments`.

</div>

<div class="mt-3 p-3 rounded bg-yellow-50">

⚠️ Pakai `result is! Profile`, bukan `pushNamed<Profile>`. Route dari `onGenerateRoute` tidak bertipe spesifik, jadi generik dapat memicu error *type cast*.

</div>

</div>
</div>

<style>.slidev-code{font-size:11px !important;line-height:16px !important}</style>

---

# Lab 6 — Logout & Uji 404 (1/2)

<div class="grid grid-cols-2 gap-6" style="--slidev-code-font-size:11px;--slidev-code-line-height:16px">
<div>

```dart
// AppBar actions
IconButton(
  icon: const Icon(Icons.logout),
  tooltip: 'Keluar',
  onPressed: _logout,
),

void _logout() {
  // pindah ke Splash + hapus semua halaman lama
  Navigator.pushNamedAndRemoveUntil(
    context,
    AppRoutes.splash,
    (route) => false, // false = hapus semua
  );
}
```

</div>
<div class="text-sm">

**Uji 404 (sementara):**

```dart
TextButton(
  onPressed: () => Navigator.pushNamed(
      context, '/halaman-ngawur'),
  child: const Text('Uji 404'),
),
```

<div class="mt-3 p-3 rounded bg-green-50">

✅ **Checkpoint 6**

- **Keluar** → Splash → Profil. Back di Profil → aplikasi keluar
- **Uji 404** → halaman "tidak ditemukan"

</div>

</div>
</div>

<style>.slidev-code{font-size:11px !important;line-height:16px !important}</style>

---

# Lab 6 — Operasi Stack (2/2)

<div class="text-sm">

| Method | Efek pada stack | Contoh pemakaian |
|---|---|---|
| `pushNamed` | Tambah di atas | Buka detail |
| `pop` / `maybePop` | Ambil teratas | Tombol kembali, Batal |
| `pushReplacementNamed` | Ganti teratas dengan yang baru | Splash → Home |
| `pushNamedAndRemoveUntil` | Tambah baru, hapus yang lama sesuai kondisi | Logout, selesai onboarding |
| `popUntil` | Kembali sampai kondisi terpenuhi | Kembali ke Beranda dari alur panjang |
| `canPop` | Cek apakah masih bisa kembali | Tampilkan/sembunyikan tombol back |

</div>

---

# Lab 7 — Mengintip Stack

<div class="grid grid-cols-5 gap-6" style="--slidev-code-font-size:11px;--slidev-code-line-height:16px">
<div class="col-span-3">

```dart
class LogObserver extends NavigatorObserver {
  @override
  void didPush(Route<dynamic> route,
      Route<dynamic>? previousRoute) {
    debugPrint('PUSH → ${route.settings.name}');
  }

  @override
  void didPop(Route<dynamic> route,
      Route<dynamic>? previousRoute) {
    debugPrint('POP ← ${route.settings.name}');
  }
  // didReplace & didRemove: lihat modul
}

// di MaterialApp:
navigatorObservers: [LogObserver()],
```

</div>
<div class="col-span-2 text-sm">

Jalankan semua alur, lalu amati **Debug Console**.

💡 **Insight industri**

`NavigatorObserver` dipakai untuk **analytics** (mencatat layar yang dibuka) dan debugging navigasi.

</div>
</div>

<style>.slidev-code{font-size:11px !important;line-height:16px !important}</style>

---

# Lab 8 — go_router (1/5)

<div class="grid grid-cols-2 gap-6" style="--slidev-code-font-size:12px;--slidev-code-line-height:17px">
<div class="text-sm">

**Tujuan:** pindahkan aplikasi yang **sama persis** ke `go_router`, lalu rasakan bedanya.

- `Navigator` = **imperatif** (perintah satu per satu)
- `go_router` = **deklaratif** (daftar halaman + path, seperti URL)
- Paket resmi dari tim Flutter, banyak dipakai di industri

💡 Kerjakan di **branch baru** supaya versi `Navigator` tetap aman untuk dibandingkan.

</div>
<div>

```bash
git checkout -b feat/go-router
flutter pub add go_router
```

```text
/                     → Splash
/profile              → Profil
/profile/projects/p1  → Detail (anak Profil)
/profile/edit         → Edit   (anak Profil)
```

</div>
</div>

<style>.slidev-code{font-size:12px !important;line-height:17px !important}</style>

---

# Lab 8 — Path & Helper (2/5)

<div class="grid grid-cols-2 gap-6" style="--slidev-code-font-size:11px;--slidev-code-line-height:16px">
<div>

```dart
// lib/app/app_routes.dart
class AppRoutes {
  AppRoutes._();

  static const splash = '/';
  static const profile = '/profile';
  static const editProfile = '/profile/edit';

  static String projectDetail(String id) =>
      '/profile/projects/$id';
}
```

</div>
<div>

```dart
// dummy_data.dart
Project? findProjectById(String id) {
  for (final project in dummyProjects) {
    if (project.id == id) return project;
  }
  return null; // tidak ditemukan
}
```

<div class="mt-3 text-sm">

Path berparameter dibuat lewat **fungsi**, bukan string manual. Fungsi pencari dipakai router untuk `:id`.

</div>

</div>
</div>

<style>.slidev-code{font-size:11px !important;line-height:16px !important}</style>

---

# Lab 8 — Definisi Router (3/5)

<div class="grid grid-cols-2 gap-5" style="--slidev-code-font-size:10px;--slidev-code-line-height:14px">
<div>

```dart
final GoRouter appRouter = GoRouter(
  initialLocation: AppRoutes.splash,
  debugLogDiagnostics: true,
  errorBuilder: (context, state) =>
      const NotFoundPage(),
  routes: [
    GoRoute(
      path: AppRoutes.splash,
      builder: (context, state) =>
          const SplashPage(),
    ),
    GoRoute(
      path: AppRoutes.profile,
      builder: (context, state) =>
          const ProfilePage(),
      routes: [
        // anak: path RELATIF (tanpa "/")
```

</div>
<div>

```dart
        GoRoute(
          path: 'projects/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            final project = findProjectById(id);
            if (project == null) {
              return const NotFoundPage();
            }
            return ProjectDetailPage(project: project);
          },
        ),
        GoRoute(
          path: 'edit',
          builder: (context, state) {
            final p = state.extra;
            if (p is! Profile) {
              return const NotFoundPage();
            }
            return EditProfilePage(profile: p);
          },
        ),
      ],
    ),
  ],
);
```

</div>
</div>

<style>.slidev-code{font-size:10px !important;line-height:14px !important}</style>

<!--
Bandingkan dengan AppRouter versi Navigator (Lab 5): tidak ada lagi switch dan pembungkus MaterialPageRoute.
errorBuilder menggantikan default: pada switch.
-->

---

# Lab 8 — main & Halaman (4/5)

<div class="grid grid-cols-2 gap-6" style="--slidev-code-font-size:10px;--slidev-code-line-height:14px">
<div>

```dart
// di tiap file yang diubah:
import 'package:go_router/go_router.dart';

// main.dart
MaterialApp.router(
  title: 'Kartu Profil Digital',
  theme: ThemeData(useMaterial3: true),
  routerConfig: appRouter,
)

// splash_page.dart & not_found_page.dart
context.go(AppRoutes.profile);

// project_detail_page.dart, tombol Batal
context.pop();

// edit_profile_page.dart, di _save()
context.pop(updated);
```

</div>
<div>

```dart
// profile_page.dart
void _openProjectDetail(Project project) {
  context.push(AppRoutes.projectDetail(project.id));
}

Future<void> _openEditProfile() async {
  final result = await context.push<Profile>(
    AppRoutes.editProfile,
    extra: _profile,
  );
  if (!mounted || result == null) return;
  setState(() => _profile = result);
}

void _logout() => context.go(AppRoutes.splash);
```

</div>
</div>

<div class="mt-3 p-3 rounded bg-green-50 text-sm">

✅ **Checkpoint 8** — Aplikasi berjalan **sama persis**; Debug Console menampilkan log navigasi dari `debugLogDiagnostics`.

</div>

<style>.slidev-code{font-size:10px !important;line-height:14px !important}</style>

---

# Lab 8 — Eksperimen (5/5)

<div class="text-sm">

Jalankan: `flutter run -d chrome --web-port 5000`

1. **Deep link** — buka `localhost:5000/#/profile/projects/p2` → Detail terbuka dan tombol back **tetap ada**
2. **ID tidak valid** — `/#/profile/projects/p99` → halaman 404 (guard `project == null`)
3. **Path ngawur** — `/#/halaman-ngawur` → `errorBuilder` menampilkan 404
4. **Kelemahan `extra`** — buka Edit lewat tombol, lalu refresh (F5) → data `extra` tidak bisa diandalkan
5. **`go` vs `push`** — ubah sementara detail menjadi `context.go(...)`, amati tombol back dan log, lalu kembalikan

</div>

<!--
Eksperimen 1: go_router membangun stack Profil → Detail otomatis dari struktur path.
Dengan Navigator biasa, arguments tidak ikut ke alamat sehingga Detail tidak bisa dibuka langsung dari URL.
-->

---

# Peta Padanan: Navigator ↔ go_router

<div class="text-xs">

| Tujuan | `Navigator` | `go_router` |
|---|---|---|
| Buka halaman di atas stack | `pushNamed(context, name)` | `context.push(path)` |
| Kirim data | `arguments: data` | `extra:` atau `:id` di path |
| Kembali (+ hasil) | `pop(context, hasil)` | `context.pop(hasil)` |
| Terima hasil | `await` + cek `is` | `await context.push<Tipe>()` |
| Ganti halaman saat ini | `pushReplacementNamed` | `context.replace(path)` |
| Pindah & bersihkan stack | `pushNamedAndRemoveUntil` | `context.go(path)` |
| Halaman tidak dikenal | `default:` di router | `errorBuilder` |
| Daftar halaman | `switch` di `AppRouter` | daftar `GoRoute` bertingkat |

</div>

---

# ⚖️ Kelebihan & Kekurangan go_router

<div class="grid grid-cols-2 gap-6 text-sm">
<div>

**✅ Kelebihan**

- **URL/path jelas**, mendukung deep link & web
- **Stack otomatis** dari struktur path, back button benar
- **Parameter di path** (`:id`) dan query (`?tab=2`)
- **Hasil bertipe** (`push<Profile>`)
- **404 terpusat** lewat `errorBuilder`
- **Redirect/guard terpusat** (mis. paksa login)

</div>
<div>

**⚠️ Kekurangan**

- **Paket eksternal**: ikut versi & perubahan antar *major version*
- **Dua paradigma** `go` vs `push`: salah pakai `go` menghapus stack
- **`extra` tidak aman**: tidak bertipe, tidak ikut URL → kirim **ID** lewat path
- **Path tetap String**: rawan typo (pakai `AppRoutes`, atau `go_router_builder`)
- **Berlebihan** untuk aplikasi kecil

</div>
</div>

---

# Kapan Memilih yang Mana?

<div class="grid grid-cols-2 gap-6" style="--slidev-code-font-size:11px;--slidev-code-line-height:16px">
<div class="text-sm">

- **Aplikasi kecil**, tanpa deep link/web → `Navigator` + named routes
- **Deep link, URL web, notifikasi** yang membuka halaman tertentu → `go_router`
- **Banyak halaman**, alur login/role → `go_router` (redirect terpusat)
- **Tim besar** → `go_router` + aturan penamaan path yang disepakati

</div>
<div>

```dart
GoRouter(
  redirect: (context, state) {
    final loggedIn = false; // dari auth service
    final atLogin =
        state.matchedLocation == '/login';
    if (!loggedIn && !atLogin) return '/login';
    return null; // null = lanjut seperti biasa
  },
  routes: [ /* ... */ ],
);
```

<div class="mt-2 text-xs opacity-70">

Contoh konsep; dikerjakan di Challenge.

</div>

</div>
</div>

<style>.slidev-code{font-size:11px !important;line-height:16px !important}</style>

---

# ⚠️ Pitfall — Navigator (Pertemuan 2)

<div class="text-sm">

| Masalah | Penyebab & solusi |
|---|---|
| Nama route tidak ditemukan | Typo string. Pakai konstanta `AppRoutes` + `default:` di `onGenerateRoute` |
| `ModalRoute.of(context)` error di `initState()` | Context belum siap. Baca di `build()` atau pakai pola constructor |
| `home` dan route `'/'` bentrok | Pilih salah satu; pakai `initialRoute` → hapus `home` |
| Perubahan `initialRoute` tidak berefek | Lakukan **hot restart**, bukan hot reload |
| Lupa `settings: settings` | Nama route & arguments tidak tercatat |
| `arguments` bertipe salah → crash | Selalu cek dengan `is` sebelum dipakai |

</div>

---

# ⚠️ Pitfall — go_router

<div class="text-sm">

| Masalah | Penyebab & solusi |
|---|---|
| `context.go` / `context.push` tidak dikenali | Lupa `import 'package:go_router/go_router.dart';` |
| Error: path route anak tidak valid | Path anak **tidak boleh diawali `/`** (tulis `'edit'`, bukan `'/edit'`) |
| Tombol back hilang setelah berpindah | Memakai `go` padahal seharusnya `push` |
| Perubahan daftar route tidak berefek | `appRouter` dibuat sekali → **hot restart** |
| `extra` bernilai `null` / tipe salah | Tidak dikirim atau halaman dibuka ulang. Pakai guard `is!`, atau pindahkan data ke path |

</div>

---

# 💡 Insight Industri — Pertemuan 2

<div class="text-sm">

1. **Satu tempat untuk semua route**: `AppRoutes` (nama) + `AppRouter` (pembuat halaman)
2. **Halaman tidak tahu soal `arguments`**: parsing di router, halaman menerima parameter bertipe lewat constructor
3. **Kirim ID, bukan objek besar**: data selalu segar dan halaman bisa dibuka ulang dari *deep link*/notifikasi
4. **Alur autentikasi pakai stack dengan benar**: Splash/Login diganti, logout membersihkan stack, agar back tidak kembali ke halaman terlarang
5. **Tangani route tak dikenal** (404) agar aplikasi tidak crash saat menerima link/data yang salah

</div>

---

# 🧠 Cek Pemahaman — Pertemuan 2

<div class="text-sm">

1. Sebutkan dua keuntungan named route dibanding `MaterialPageRoute` langsung
2. Apa beda `pushReplacementNamed` dan `pushNamedAndRemoveUntil`?
3. Mengapa pengecekan tipe `arguments` dilakukan di `AppRouter`, bukan di setiap halaman?
4. Apa yang terjadi jika `default:` tidak ada di `onGenerateRoute` dan route tidak terdaftar dibuka?
5. Apa beda `context.go()` dan `context.push()` di `go_router`? Kapan memilih masing-masing?
6. Mengapa proyek dikirim lewat ID di path, sedangkan `Profile` lewat `extra`? Apa risiko `extra`?

</div>

<!--
Kunci:
1. Nama halaman terpusat (mudah dicari/diubah), tidak ada duplikasi pembuatan route; arguments dan 404 ditangani di satu tempat.
2. pushReplacementNamed mengganti satu halaman teratas; pushNamedAndRemoveUntil menambah halaman baru lalu menghapus halaman lama sesuai kondisi (bisa semuanya).
3. Agar logika pembacaan arguments tidak diulang; halaman cukup memakai constructor bertipe sehingga mudah diuji dan dipakai ulang.
4. Flutter error (assertion) karena tidak ada route yang bisa dibuat dan tidak ada halaman cadangan.
5. go mengganti seluruh stack sesuai path tujuan (mirip pushNamedAndRemoveUntil); push menambah di atas stack dan mengembalikan Future hasil. go untuk pindah tujuan utama (Splash → Profil, logout); push untuk halaman sementara yang perlu kembali/mengembalikan hasil.
6. ID berupa teks sehingga bisa ditulis di URL dan dibuka lewat deep link. Objek Profile tidak bisa jadi teks URL, jadi lewat extra. Risiko: extra tidak ikut URL dan tidak bisa diandalkan saat halaman dibuka ulang/lewat link, sehingga perlu guard pengecekan tipe.
-->

---

# 🏆 Challenge — Pertemuan 2

<div class="text-sm">

- ⭐ **Halaman Pengaturan** — route `/settings` dengan satu `Switch` ("Tampilkan bio"), dibuka dari ikon AppBar Profil
- ⭐⭐ **Kirim ID, bukan objek** — ubah `arguments` proyek menjadi `String` ID; router mencari dari `dummyProjects`, ID tak ditemukan → `NotFoundPage`
- ⭐⭐⭐ **Redirect & Login dengan `go_router`** — halaman `/login` + `isLoggedIn`, `redirect` memaksa belum-login ke `/login`, tombol Keluar mengubah status
  *(petunjuk: parameter `redirect`, `state.matchedLocation`)*
- 🌟 **Bonus** — `AlertDialog` "Yakin ingin keluar?" sebelum logout

</div>

---

# ✅ Daftar Periksa Akhir

<div class="text-sm">

- [ ] Splash tampil 2 detik lalu otomatis pindah ke Profil
- [ ] Ketuk kartu proyek → Detail menampilkan data proyek yang benar
- [ ] Edit Profil → Simpan mengubah tampilan Profil; Batal tidak mengubah apa-apa
- [ ] Tombol Keluar mengembalikan ke Splash dan stack bersih
- [ ] Route tidak dikenal menampilkan halaman 404
- [ ] Log `NavigatorObserver` muncul di Debug Console
- [ ] (Lab 8) `/profile/projects/p1` membuka Detail dengan tombol back ke Profil

</div>

---

# 📝 Ringkasan Cepat

<div class="grid grid-cols-2 gap-5" style="--slidev-code-font-size:10px;--slidev-code-line-height:14px">
<div>

```dart
// Navigator
Navigator.push(context,
    MaterialPageRoute(builder: (_) => Halaman()));
Navigator.pushNamed(context, '/nama',
    arguments: data);

Navigator.pop(context);          // kembali
Navigator.pop(context, hasil);   // + hasil

final hasil = await Navigator.pushNamed(
    context, '/nama');
if (!mounted || hasil is! Tipe) return;

Navigator.pushReplacementNamed(context, '/nama');
Navigator.pushNamedAndRemoveUntil(
    context, '/nama', (route) => false);
```

</div>
<div>

```dart
// go_router
context.go('/profile');            // ganti seluruh stack
context.push('/profile/projects/p1');  // tambah di atas
final hasil = await context.push<Profile>(
  '/profile/edit',
  extra: data,
);
context.pop(hasil);                // kembali (+ hasil)
```

</div>
</div>

<style>.slidev-code{font-size:10px !important;line-height:14px !important}</style>

---
layout: center
class: text-center
---

# 📚 Referensi

<div class="text-sm leading-8">

Navigasi di Flutter: `docs.flutter.dev/ui/navigation`

Kelas `Navigator`: `api.flutter.dev/flutter/widgets/Navigator-class.html`

Kelas `NavigatorObserver` & `PopScope`: `api.flutter.dev`

Paket `go_router`: `pub.dev/packages/go_router`

</div>

<div class="mt-8 text-2xl">

Selamat berkreasi! 🚀

</div>
