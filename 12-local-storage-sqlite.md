# Modul 10 — Local Storage & SQLite

**Studi kasus:** Kartu Profil Digital (lanjutan modul sebelumnya)
**Durasi:** 2 × 4 jam (Pertemuan 1: SharedPreferences · Pertemuan 2: SQLite & CRUD)
**Bahasa & Framework:** Dart · Flutter

---

## Daftar Isi

1. [Gambaran Modul](#1-gambaran-modul)
2. [Pertemuan 1 — SharedPreferences](#2-pertemuan-1--sharedpreferences)
3. [Pertemuan 2 — SQLite & CRUD](#3-pertemuan-2--sqlite--crud)
4. [Contoh Implementasi di Real Project](#4-contoh-implementasi-di-real-project)
5. [Insight Industri](#5-insight-industri)
6. [Rangkuman & Refleksi](#6-rangkuman--refleksi)
7. [Referensi](#7-referensi)

---

## 1. Gambaran Modul

### 1.1 Apa yang akan kamu buat?

Sampai modul sebelumnya, Kartu Profil Digital milikmu sudah punya tampilan dan navigasi, tetapi ada satu masalah besar: **semua data hilang begitu aplikasi ditutup.** Edit nama, ubah tema, tambah apa pun, lalu tutup aplikasi, dan semuanya kembali seperti semula.

Di modul ini, kartu profilmu akan "punya ingatan":

| Pertemuan | Teknologi | Fitur yang kamu bangun |
|---|---|---|
| 1 | `shared_preferences` | Mode gelap yang diingat, profil yang bisa diedit & tersimpan, penghitung "berapa kali kartu dibuka" |
| 2 | `sqflite` (SQLite) | Daftar **Proyek Saya** (portofolio) dengan CRUD lengkap, favorit, dan jumlah proyek di halaman profil |

### 1.2 Tampilan akhir yang diharapkan

```
┌─────────────────────────────┐        ┌─────────────────────────────┐
│ Kartu Profil Digital     ✎  │        │ ← Proyek Saya               │
├─────────────────────────────┤        ├─────────────────────────────┤
│        ╭────╮               │        │ ┌─────────────────────────┐ │
│        │ F  │               │        │ │ Kartu Profil Digital  ★ 🗑│ │
│        ╰────╯               │        │ │ Flutter, Dart           │ │
│    Fakhry Firdaus           │        │ └─────────────────────────┘ │
│  Software Engineer & Dosen  │        │ ┌─────────────────────────┐ │
│  Suka membangun aplikasi... │        │ │ Aplikasi Catatan      ☆ 🗑│ │
├─────────────────────────────┤        │ │ Flutter, SQLite         │ │
│ 🌙 Mode Gelap          [ON] │        │ └─────────────────────────┘ │
│ 📁 Proyek Saya   2 proyek > │        │                        (+)  │
│                             │        └─────────────────────────────┘
│ Kartu ini sudah dibuka 7×   │
└─────────────────────────────┘
```

### 1.3 Tujuan Pembelajaran

Setelah menyelesaikan modul ini, kamu mampu:

- Menjelaskan perbedaan data di memori (state) dan data yang tersimpan permanen.
- Memilih jenis penyimpanan lokal yang tepat untuk suatu kebutuhan.
- Menyimpan dan membaca data sederhana dengan **SharedPreferences**.
- Menyimpan objek (model) sebagai JSON di SharedPreferences.
- Memahami konsep database relasional: tabel, baris, kolom, *primary key*.
- Menulis perintah dasar SQL dan menerapkannya lewat `sqflite`.
- Mengimplementasikan **CRUD** (Create, Read, Update, Delete) dengan arsitektur yang rapi (Model → Repository → UI).
- Melakukan **migrasi database** saat struktur tabel berubah.

### 1.4 Prasyarat

- Project Kartu Profil Digital dari modul sebelumnya (atau kamu bisa memulai dari Lab 1 dengan project baru; semua kode yang dibutuhkan sudah disediakan).
- Pemahaman dasar: `StatefulWidget`, `Form` & `TextFormField`, `Navigator.push/pop`, `ListView`, `async/await`, `Future`.
- Emulator Android atau perangkat Android fisik sudah berjalan.

> ⚠️ **Penting — jangan jalankan Pertemuan 2 di Chrome.**
> `shared_preferences` bisa berjalan di Chrome (memakai `localStorage` browser), tetapi `sqflite` **tidak mendukung web**. Untuk Pertemuan 2, jalankan aplikasi di **emulator Android** atau perangkat Android fisik.

### 1.5 Struktur Folder Akhir

```
lib/
├── main.dart
├── models/
│   ├── profile_data.dart
│   └── project.dart
├── services/
│   └── pref_service.dart
├── data/
│   ├── db_helper.dart
│   └── project_repository.dart
└── pages/
    ├── profile_page.dart
    ├── edit_profile_page.dart
    ├── project_list_page.dart
    └── project_form_page.dart
```

Folder dipisah berdasarkan **tanggung jawab**, bukan berdasarkan jenis file. Kebiasaan ini membuat kode mudah dicari dan dirawat ketika aplikasi membesar.

---

## 2. Pertemuan 1 — SharedPreferences

### Jadwal (4 jam)

| Waktu | Kegiatan |
|---|---|
| 30 menit | Konsep: penyimpanan lokal & SharedPreferences |
| 25 menit | **Lab 1** — Persiapan project |
| 30 menit | **Lab 2** — Hello SharedPreferences (penghitung buka aplikasi) |
| 40 menit | **Lab 3** — Mode gelap yang diingat |
| 15 menit | Istirahat |
| 60 menit | **Lab 4** — Simpan profil sebagai JSON |
| 15 menit | **Lab 5** — Reset & inspeksi data |
| 20 menit | **Challenge** Pertemuan 1 |
| 5 menit | Refleksi |

---

### 2.1 Konsep

#### Data di memori vs data tersimpan

Semua variabel dan `setState()` yang kamu pakai selama ini hidup di **memori (RAM)**. Saat aplikasi ditutup, memori dibersihkan dan datanya hilang. Agar data bertahan, data harus ditulis ke **penyimpanan permanen** di perangkat.

```
  State (RAM)                    Penyimpanan Lokal
  ───────────                    ─────────────────
  cepat, sementara     ──tulis──▶  lebih lambat, permanen
  hilang saat app ditutup  ◀─baca──  bertahan setelah app ditutup
```

#### Pilih penyimpanan sesuai kebutuhan

| Kebutuhan | Pilihan yang tepat |
|---|---|
| Pengaturan kecil (tema, bahasa, flag "sudah onboarding") | **SharedPreferences** |
| Data rahasia (token login, password) | `flutter_secure_storage` (terenkripsi) |
| Data terstruktur, banyak, perlu dicari/diurutkan | **SQLite** (`sqflite` / `drift`) |
| File besar (foto, PDF, audio) | File system (`path_provider`) |
| Data yang dipakai bersama banyak perangkat/pengguna | Server (REST API / cloud) |

Menghafal tabel ini kurang penting dibanding **kebiasaan bertanya**: *"Datanya sekecil apa? Serahasia apa? Sebanyak apa?"*

#### SharedPreferences

SharedPreferences adalah penyimpanan **key-value** (pasangan kunci dan nilai), seperti `Map` yang tidak hilang saat aplikasi ditutup.

```
 key               value
 ────────────────  ──────────────
 'is_dark_mode'    true
 'open_count'      7
 'profile_data'    '{"name":"Fakhry Firdaus", ...}'
```

- **Tipe data yang didukung:** `bool`, `int`, `double`, `String`, `List<String>`.
- **Di balik layar:** Android memakai `SharedPreferences` (file XML), iOS memakai `NSUserDefaults`, web memakai `localStorage`.
- **Cocok untuk:** data kecil dan sederhana.
- **Tidak cocok untuk:** data besar, data berelasi, data yang perlu di-*query*, dan data rahasia (tersimpan sebagai teks biasa).

Metode yang akan sering kamu pakai:

| Aksi | Kode |
|---|---|
| Ambil instance | `final prefs = await SharedPreferences.getInstance();` |
| Simpan | `await prefs.setBool('key', true);` · `setInt` · `setString` · `setDouble` · `setStringList` |
| Baca | `prefs.getBool('key')` (hasilnya **nullable**, bisa `null` jika belum pernah disimpan) |
| Hapus satu | `await prefs.remove('key');` |
| Hapus semua | `await prefs.clear();` |
| Cek ada/tidak | `prefs.containsKey('key')` |
| Lihat semua key | `prefs.getKeys()` |

> 💡 Perhatikan: **menulis** itu `Future` (pakai `await`), sedangkan **membaca** itu sinkron (langsung dapat nilai) setelah `getInstance()` selesai.

---

### Lab 1 — Persiapan Project (25 menit)

**Tujuan:** punya project yang bisa dijalankan dengan tampilan kartu profil statis.

**Langkah 1.** Lanjutkan project Kartu Profil Digital, atau buat project baru:

```bash
flutter create kartu_profil_digital
cd kartu_profil_digital
```

**Langkah 2.** Tambahkan dependensi. Perintah ini otomatis memilih versi terbaru yang kompatibel:

```bash
flutter pub add shared_preferences sqflite path
```

> `sqflite` dan `path` baru dipakai di Pertemuan 2, tetapi kita pasang sekarang agar tidak perlu mengulang.

**Langkah 3.** Buat file `lib/models/profile_data.dart`. Model ini mewakili data profil yang akan kita simpan nanti.

```dart
class ProfileData {
  final String name;
  final String title;
  final String bio;

  const ProfileData({
    required this.name,
    required this.title,
    required this.bio,
  });

  /// Data bawaan saat belum ada data tersimpan.
  static const defaults = ProfileData(
    name: 'Fakhry Firdaus',
    title: 'Software Engineer & Dosen',
    bio: 'Suka membangun aplikasi mobile dan berbagi ilmu.',
  );
}
```

**Langkah 4.** Buat `lib/pages/profile_page.dart` (versi statis dulu):

```dart
import 'package:flutter/material.dart';
import '../models/profile_data.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    const profile = ProfileData.defaults;
    final colors = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(title: const Text('Kartu Profil Digital')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: colors.primaryContainer,
                    child: Text(
                      profile.name[0].toUpperCase(),
                      style: const TextStyle(fontSize: 32),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(profile.name,
                      style: Theme.of(context).textTheme.headlineSmall),
                  const SizedBox(height: 4),
                  Text(profile.title),
                  const SizedBox(height: 12),
                  Text(profile.bio, textAlign: TextAlign.center),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
```

**Langkah 5.** Ganti isi `lib/main.dart`:

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
      theme: ThemeData(colorSchemeSeed: Colors.indigo),
      home: const ProfilePage(),
    );
  }
}
```

✅ **Checkpoint 1:** aplikasi berjalan dan menampilkan kartu profil dengan nama Fakhry Firdaus.

---

### Lab 2 — Hello SharedPreferences (30 menit)

**Tujuan:** menyimpan dan membaca angka, lalu membuktikan data bertahan setelah aplikasi ditutup.

Kita akan membuat penghitung: *"Kartu ini sudah dibuka N kali"*.

#### Mengapa kita membuat `PrefService`?

Daripada memanggil `SharedPreferences` langsung di banyak halaman, kita bungkus dalam satu kelas. Keuntungannya:

- Nama *key* ditulis **satu kali** sebagai konstanta (tidak ada risiko salah ketik `'is_dark_mod'`).
- Halaman UI tidak perlu tahu cara data disimpan. Kalau suatu hari penyimpanan diganti, cukup satu file yang diubah.

**Langkah 1.** Buat `lib/services/pref_service.dart`:

```dart
import 'package:shared_preferences/shared_preferences.dart';

class PrefService {
  PrefService._(this._prefs);
  final SharedPreferences _prefs;

  // Semua key dikumpulkan di sini.
  static const _kOpenCount = 'open_count';

  /// Dipanggil sekali saat aplikasi mulai.
  static Future<PrefService> init() async {
    final prefs = await SharedPreferences.getInstance();
    return PrefService._(prefs);
  }

  // ---------- Penghitung buka aplikasi ----------
  int get openCount => _prefs.getInt(_kOpenCount) ?? 0;

  Future<void> increaseOpenCount() =>
      _prefs.setInt(_kOpenCount, openCount + 1);
}
```

Perhatikan `?? 0`: saat aplikasi pertama kali dibuka, belum ada nilai tersimpan sehingga `getInt` mengembalikan `null`. Operator `??` memberi nilai bawaan.

**Langkah 2.** Ubah `lib/main.dart`. `main` sekarang `async` karena harus menunggu `PrefService.init()`:

```dart
import 'package:flutter/material.dart';
import 'pages/profile_page.dart';
import 'services/pref_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized(); // wajib sebelum await di main
  final prefs = await PrefService.init();
  await prefs.increaseOpenCount();
  runApp(MyApp(prefs: prefs));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key, required this.prefs});
  final PrefService prefs;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Kartu Profil Digital',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(colorSchemeSeed: Colors.indigo),
      home: ProfilePage(prefs: prefs),
    );
  }
}
```

> ⚠️ **Lupa `WidgetsFlutterBinding.ensureInitialized()`** adalah error paling umum di langkah ini. Plugin butuh Flutter engine siap sebelum dipakai, dan pemanggilan ini memastikannya.

**Langkah 3.** Di `profile_page.dart`, terima `prefs` lewat constructor:

```dart
import '../services/pref_service.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key, required this.prefs});
  final PrefService prefs;
  // ...
```

Lalu tambahkan teks ini di bagian bawah `children` pada `ListView` (setelah `Card`):

```dart
const SizedBox(height: 24),
Center(
  child: Text(
    'Kartu ini sudah dibuka ${prefs.openCount} kali',
    style: Theme.of(context).textTheme.bodySmall,
  ),
),
```

Karena sekarang ada parameter yang wajib diisi, hapus `const` pada `home: ProfilePage(prefs: prefs)` jika editor memberi peringatan (kode di atas sudah benar).

**Langkah 4. Eksperimen (wajib!)**

1. Jalankan aplikasi → muncul `1 kali`.
2. Tekan **Hot Restart** (⇧⌘\\ / Ctrl+Shift+\\) → muncul `2 kali`.
3. **Hentikan aplikasi sepenuhnya** (tombol stop), jalankan lagi → muncul `3 kali`.

Angkanya terus bertambah walaupun aplikasi dimatikan total. Itulah persistensi data.

✅ **Checkpoint 2:** penghitung bertambah setiap aplikasi dibuka, dan tidak kembali ke 1.

> 🧪 **Pertanyaan:** Mengapa `main()` perlu `async`? Apa yang terjadi jika kamu menghapus `await` pada `PrefService.init()`?

---

### Lab 3 — Mode Gelap yang Diingat (40 menit)

**Tujuan:** pengaturan tema bertahan walaupun aplikasi ditutup. Ini contoh penggunaan SharedPreferences yang paling umum di industri.

**Langkah 1.** Tambahkan ke `PrefService`:

```dart
static const _kDarkMode = 'is_dark_mode';

// ---------- Tema ----------
bool get isDarkMode => _prefs.getBool(_kDarkMode) ?? false;

Future<void> setDarkMode(bool value) => _prefs.setBool(_kDarkMode, value);
```

**Langkah 2.** Ubah `main.dart` agar `MyApp` menjadi `StatefulWidget` yang menyimpan status tema. Ganti bagian `MyApp` (fungsi `main` tetap sama):

```dart
class MyApp extends StatefulWidget {
  const MyApp({super.key, required this.prefs});
  final PrefService prefs;

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  // Nilai awal dibaca dari penyimpanan, bukan hard-coded.
  late final ValueNotifier<bool> _isDark =
      ValueNotifier(widget.prefs.isDarkMode);

  void _changeTheme(bool value) {
    _isDark.value = value;            // 1. ubah tampilan sekarang
    widget.prefs.setDarkMode(value);  // 2. simpan untuk nanti
  }

  @override
  void dispose() {
    _isDark.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<bool>(
      valueListenable: _isDark,
      builder: (context, isDark, _) {
        return MaterialApp(
          title: 'Kartu Profil Digital',
          debugShowCheckedModeBanner: false,
          theme: ThemeData(colorSchemeSeed: Colors.indigo),
          darkTheme: ThemeData(
            colorSchemeSeed: Colors.indigo,
            brightness: Brightness.dark,
          ),
          themeMode: isDark ? ThemeMode.dark : ThemeMode.light,
          home: ProfilePage(
            prefs: widget.prefs,
            isDark: isDark,
            onThemeChanged: _changeTheme,
          ),
        );
      },
    );
  }
}
```

**Langkah 3.** Di `profile_page.dart`, tambahkan dua parameter:

```dart
const ProfilePage({
  super.key,
  required this.prefs,
  required this.isDark,
  required this.onThemeChanged,
});
final PrefService prefs;
final bool isDark;
final ValueChanged<bool> onThemeChanged;
```

Dan tambahkan `SwitchListTile` setelah `Card`:

```dart
const SizedBox(height: 8),
SwitchListTile(
  secondary: const Icon(Icons.dark_mode),
  title: const Text('Mode Gelap'),
  value: isDark,
  onChanged: onThemeChanged,
),
```

**Langkah 4.** Uji: nyalakan Mode Gelap → hentikan aplikasi total → jalankan lagi. Aplikasi langsung terbuka dalam mode gelap.

✅ **Checkpoint 3:** tema gelap/terang tersimpan setelah aplikasi dimatikan.

> 💡 **Mengapa tema dibaca sebelum `runApp`?** Karena `prefs` sudah dimuat di `main()`, nilai tema tersedia sejak frame pertama. Jika kita membaca setelah aplikasi tampil, pengguna akan melihat **kedipan** dari tema terang ke gelap. Pola "muat dulu, baru tampil" ini dipakai di aplikasi nyata.

---

### Lab 4 — Simpan Profil sebagai JSON (60 menit)

**Tujuan:** pengguna dapat mengedit nama, jabatan, dan bio, dan hasilnya tersimpan permanen.

#### Konsep: menyimpan objek

SharedPreferences hanya menerima tipe sederhana. Bagaimana menyimpan objek `ProfileData` yang punya tiga field? Caranya: ubah objek menjadi **String JSON**, simpan, lalu ubah kembali saat dibaca.

```
ProfileData ──toMap──▶ Map ──jsonEncode──▶ '{"name":"..."}'  ──▶ disimpan
ProfileData ◀─fromMap── Map ◀─jsonDecode── '{"name":"..."}'  ◀── dibaca
```

**Langkah 1.** Tambahkan konversi JSON ke `ProfileData` (`models/profile_data.dart`). Tambahkan `import 'dart:convert';` di baris paling atas, lalu tambahkan di dalam kelas:

```dart
Map<String, dynamic> toMap() => {
      'name': name,
      'title': title,
      'bio': bio,
    };

factory ProfileData.fromMap(Map<String, dynamic> map) => ProfileData(
      name: map['name'] as String? ?? defaults.name,
      title: map['title'] as String? ?? defaults.title,
      bio: map['bio'] as String? ?? defaults.bio,
    );

String toJson() => jsonEncode(toMap());

factory ProfileData.fromJson(String source) =>
    ProfileData.fromMap(jsonDecode(source) as Map<String, dynamic>);
```

**Langkah 2.** Tambahkan ke `PrefService` (jangan lupa `import '../models/profile_data.dart';`):

```dart
static const _kProfile = 'profile_data';

// ---------- Profil ----------
ProfileData get profile {
  final raw = _prefs.getString(_kProfile);
  if (raw == null) return ProfileData.defaults;
  try {
    return ProfileData.fromJson(raw);
  } catch (_) {
    // Data rusak? Jangan crash, kembali ke bawaan.
    return ProfileData.defaults;
  }
}

Future<void> saveProfile(ProfileData profile) =>
    _prefs.setString(_kProfile, profile.toJson());

Future<void> clearProfile() => _prefs.remove(_kProfile);
```

> 💡 Blok `try/catch` adalah kebiasaan defensif: data yang tersimpan bisa saja rusak atau formatnya berubah antar versi aplikasi. Aplikasi yang baik tidak crash karena data lama.

**Langkah 3.** Buat halaman edit `lib/pages/edit_profile_page.dart`:

```dart
import 'package:flutter/material.dart';
import '../models/profile_data.dart';

class EditProfilePage extends StatefulWidget {
  const EditProfilePage({super.key, required this.initial});
  final ProfileData initial;

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final _formKey = GlobalKey<FormState>();
  late final _name = TextEditingController(text: widget.initial.name);
  late final _title = TextEditingController(text: widget.initial.title);
  late final _bio = TextEditingController(text: widget.initial.bio);

  @override
  void dispose() {
    _name.dispose();
    _title.dispose();
    _bio.dispose();
    super.dispose();
  }

  String? _required(String? value) =>
      (value == null || value.trim().isEmpty) ? 'Wajib diisi' : null;

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    Navigator.pop(
      context,
      ProfileData(
        name: _name.text.trim(),
        title: _title.text.trim(),
        bio: _bio.text.trim(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Edit Profil')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _name,
              decoration: const InputDecoration(
                labelText: 'Nama',
                border: OutlineInputBorder(),
              ),
              validator: _required,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _title,
              decoration: const InputDecoration(
                labelText: 'Jabatan',
                border: OutlineInputBorder(),
              ),
              validator: _required,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _bio,
              maxLines: 3,
              decoration: const InputDecoration(
                labelText: 'Bio',
                border: OutlineInputBorder(),
              ),
              validator: _required,
            ),
            const SizedBox(height: 24),
            FilledButton(onPressed: _submit, child: const Text('Simpan')),
          ],
        ),
      ),
    );
  }
}
```

Halaman ini **tidak menyimpan sendiri**. Ia hanya mengembalikan hasil lewat `Navigator.pop`. Yang menyimpan adalah halaman pemanggil. Dengan begitu, halaman edit tetap sederhana dan mudah dipakai ulang.

**Langkah 4.** Ganti seluruh isi `lib/pages/profile_page.dart` dengan versi akhir Pertemuan 1:

```dart
import 'package:flutter/material.dart';
import '../models/profile_data.dart';
import '../services/pref_service.dart';
import 'edit_profile_page.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({
    super.key,
    required this.prefs,
    required this.isDark,
    required this.onThemeChanged,
  });

  final PrefService prefs;
  final bool isDark;
  final ValueChanged<bool> onThemeChanged;

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  late ProfileData _profile;

  @override
  void initState() {
    super.initState();
    _profile = widget.prefs.profile; // baca data tersimpan
  }

  Future<void> _edit() async {
    final result = await Navigator.push<ProfileData>(
      context,
      MaterialPageRoute(builder: (_) => EditProfilePage(initial: _profile)),
    );
    if (result == null) return; // pengguna menekan back

    await widget.prefs.saveProfile(result);
    if (!mounted) return;
    setState(() => _profile = result);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Profil tersimpan')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final initial =
        _profile.name.isNotEmpty ? _profile.name[0].toUpperCase() : '?';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kartu Profil Digital'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            tooltip: 'Edit profil',
            onPressed: _edit,
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: colors.primaryContainer,
                    child: Text(initial, style: const TextStyle(fontSize: 32)),
                  ),
                  const SizedBox(height: 16),
                  Text(_profile.name,
                      style: Theme.of(context).textTheme.headlineSmall),
                  const SizedBox(height: 4),
                  Text(_profile.title),
                  const SizedBox(height: 12),
                  Text(_profile.bio, textAlign: TextAlign.center),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          SwitchListTile(
            secondary: const Icon(Icons.dark_mode),
            title: const Text('Mode Gelap'),
            value: widget.isDark,
            onChanged: widget.onThemeChanged,
          ),
          // Lab 11 akan menambahkan menu "Proyek Saya" di sini.
          const SizedBox(height: 24),
          Center(
            child: Text(
              'Kartu ini sudah dibuka ${widget.prefs.openCount} kali',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ),
        ],
      ),
    );
  }
}
```

**Langkah 5. Uji alur lengkap:**

1. Tekan ikon ✎ → ubah nama dan bio → **Simpan**.
2. Kartu langsung berubah dan muncul SnackBar.
3. **Matikan aplikasi total**, jalankan lagi → data hasil editanmu masih ada.

✅ **Checkpoint 4:** profil hasil edit bertahan setelah aplikasi dimatikan.

> ⚠️ **Jebakan umum:**
> - Lupa `await` pada `saveProfile` → data kadang belum tertulis saat aplikasi ditutup cepat.
> - Memakai `context` setelah `await` tanpa `if (!mounted) return;` → peringatan/error karena halaman bisa saja sudah tertutup.
> - Mengetik ulang key (`'profile_data'`) di banyak tempat → typo membuat data "hilang". Karena itu key dijadikan konstanta.

---

### Lab 5 — Reset & Inspeksi Data (15 menit)

**Tujuan:** belajar menghapus data tersimpan dan melihat isi SharedPreferences saat debugging.

**Langkah 1.** Tambahkan method di `_ProfilePageState`:

```dart
Future<void> _reset() async {
  await widget.prefs.clearProfile();
  if (!mounted) return;
  setState(() => _profile = widget.prefs.profile);
  ScaffoldMessenger.of(context).showSnackBar(
    const SnackBar(content: Text('Profil dikembalikan ke bawaan')),
  );
}
```

**Langkah 2.** Tambahkan tombolnya di `ListView`, sebelum teks penghitung:

```dart
OutlinedButton.icon(
  onPressed: _reset,
  icon: const Icon(Icons.restore),
  label: const Text('Reset Profil'),
),
```

**Langkah 3.** Untuk *debugging*, tambahkan baris sementara di `main()` setelah `PrefService.init()`:

```dart
debugPrint('Isi prefs: ${prefs.debugKeys}');
```

dan di `PrefService`:

```dart
Set<String> get debugKeys => _prefs.getKeys();
```

Lihat di **Debug Console**: kamu akan melihat daftar key seperti `open_count`, `is_dark_mode`, `profile_data`. Hapus baris ini jika sudah selesai.

✅ **Checkpoint 5:** tombol Reset mengembalikan profil ke Fakhry Firdaus bawaan.

> 💡 **`remove` vs `clear`:** `remove(key)` menghapus satu data. `clear()` menghapus **semua** data aplikasi di SharedPreferences, termasuk tema dan penghitung. Pakai `clear()` dengan hati-hati. Untuk logout biasanya cukup `remove` data yang terkait pengguna.

---

### 🏆 Challenge Pertemuan 1 (20 menit)

Pilih tingkat yang kamu sanggupi. Boleh mengerjakan lebih dari satu.

| Level | Tantangan |
|---|---|
| ⭐ | Tambahkan teks **"Terakhir diedit: ..."** di bawah bio. Simpan waktu edit sebagai `String` (ISO 8601) di SharedPreferences dengan key baru. |
| ⭐⭐ | Buat **halaman sambutan (onboarding)** yang hanya muncul pada pembukaan pertama. Simpan flag `has_seen_onboarding` (bool). Setelah tombol "Mulai" ditekan, flag disimpan dan halaman tidak muncul lagi. |
| ⭐⭐⭐ | Ganti `Switch` mode gelap menjadi pilihan **tiga mode**: Sistem / Terang / Gelap (`ThemeMode`). Simpan sebagai `int` (`ThemeMode.index`) atau `String` (`ThemeMode.name`). Tambahkan juga pilihan **warna tema** (simpan nilai `Color.toARGB32()` sebagai `int`). |

> 🎨 Bebas berkreasi: ubah warna, tambah ikon, tambahkan field baru di profil (misalnya email atau lokasi). Menambah field berarti kamu harus ikut memperbarui `toMap`, `fromMap`, dan form edit.

---

## 3. Pertemuan 2 — SQLite & CRUD

### Jadwal (4 jam)

| Waktu | Kegiatan |
|---|---|
| 30 menit | Konsep: database, SQL, CRUD |
| 25 menit | **Lab 6** — Setup database (`DbHelper`) |
| 25 menit | **Lab 7** — Model & Repository |
| 15 menit | Istirahat |
| 45 menit | **Lab 8** — Create & Read (tambah dan tampilkan proyek) |
| 35 menit | **Lab 9** — Update & Delete |
| 25 menit | **Lab 10** — Migrasi database (fitur favorit) |
| 10 menit | **Lab 11** — Integrasi ke halaman profil |
| 25 menit | **Challenge** Pertemuan 2 |
| 5 menit | Refleksi |

---

### 3.1 Konsep

#### Mengapa SharedPreferences saja tidak cukup?

Bayangkan kamu ingin menyimpan 200 proyek, masing-masing punya judul, deskripsi, teknologi, dan tanggal. Lalu kamu ingin:

- mencari proyek yang judulnya mengandung "catatan",
- mengurutkan dari yang terbaru,
- mengubah satu proyek saja tanpa menulis ulang semuanya.

Dengan key-value, kamu harus memuat **seluruh** data, mengubahnya di memori, lalu menyimpan **seluruhnya** lagi. Untuk kasus seperti ini, gunakan **database**.

#### SQLite

**SQLite** adalah database relasional yang berjalan **langsung di dalam aplikasimu**, berupa satu file di perangkat. Tidak ada server, tidak perlu instalasi tambahan. SQLite adalah salah satu database yang paling banyak dipakai di dunia, termasuk di Android dan iOS sendiri.

#### Istilah dasar

Data disimpan dalam **tabel**, mirip lembar Excel:

```
Tabel: projects
┌────┬─────────────────────┬──────────────┬───────────────┬─────────────┐
│ id │ title               │ tech_stack   │ created_at    │ is_favorite │  ← kolom (field)
├────┼─────────────────────┼──────────────┼───────────────┼─────────────┤
│ 1  │ Kartu Profil Digital│ Flutter, Dart│ 2026-11-02... │ 1           │  ← baris (record)
│ 2  │ Aplikasi Catatan    │ Flutter      │ 2026-11-03... │ 0           │
└────┴─────────────────────┴──────────────┴───────────────┴─────────────┘
   ▲
   └── PRIMARY KEY: pengenal unik tiap baris, tidak boleh kembar
```

| Istilah | Arti |
|---|---|
| **Tabel** | Kumpulan data sejenis (contoh: `projects`) |
| **Kolom** | Satu jenis informasi (contoh: `title`) |
| **Baris** | Satu data lengkap (satu proyek) |
| **Primary Key** | Kolom pengenal unik, biasanya `id` yang naik otomatis |
| **Query** | Perintah SQL untuk bertanya/mengubah data |

#### Tipe data SQLite

SQLite hanya punya sedikit tipe: `INTEGER`, `REAL`, `TEXT`, `BLOB`. Artinya:

- `bool` → disimpan sebagai `INTEGER` (`0` = false, `1` = true)
- `DateTime` → disimpan sebagai `TEXT` (format ISO 8601) atau `INTEGER` (timestamp)

#### CRUD dan SQL

**CRUD** adalah empat operasi dasar pada data. Hampir semua aplikasi yang menyimpan data bergantung pada keempatnya.

| Operasi | Arti | SQL | Method `sqflite` |
|---|---|---|---|
| **C**reate | Tambah data | `INSERT INTO projects (...) VALUES (...)` | `db.insert(...)` |
| **R**ead | Baca data | `SELECT * FROM projects WHERE ...` | `db.query(...)` |
| **U**pdate | Ubah data | `UPDATE projects SET ... WHERE id = ?` | `db.update(...)` |
| **D**elete | Hapus data | `DELETE FROM projects WHERE id = ?` | `db.delete(...)` |

> ⚠️ **Bahaya terbesar:** `UPDATE` atau `DELETE` **tanpa `WHERE`** akan mengubah/menghapus **seluruh baris** di tabel. Selalu periksa klausa `where` sebelum menjalankan.

#### Parameter `?` (wajib dipahami)

Perhatikan bahwa nilai tidak disisipkan langsung ke string SQL, tetapi memakai tanda tanya:

```dart
// ✅ BENAR — aman
db.query('projects', where: 'title LIKE ?', whereArgs: ['%$keyword%']);

// ❌ SALAH — rawan SQL injection
db.rawQuery("SELECT * FROM projects WHERE title LIKE '%$keyword%'");
```

Dengan `?`, input pengguna diperlakukan sebagai **data**, bukan sebagai perintah SQL. Ini standar keamanan yang wajib dibiasakan.

#### Arsitektur yang akan kita pakai

```
  UI (Pages)  ──▶  Repository  ──▶  DbHelper  ──▶  File SQLite
  (tampilan)       (operasi CRUD)    (membuka DB,    (di perangkat)
                                      membuat tabel)
        ▲               │
        └── Model (Project) dipakai di semua lapisan
```

UI **tidak pernah menulis SQL**. UI hanya memanggil `repository.insert(...)`. Pemisahan ini membuat kode mudah diuji dan mudah diganti (misalnya bila suatu hari berpindah ke `drift`).

---

### Lab 6 — Setup Database (25 menit)

**Tujuan:** membuat file database dan tabel `projects`.

**Langkah 1.** Pastikan `sqflite` dan `path` sudah ada di `pubspec.yaml` (sudah dipasang di Lab 1). Jika belum:

```bash
flutter pub add sqflite path
```

**Langkah 2.** Buat `lib/data/db_helper.dart`:

```dart
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class DbHelper {
  DbHelper._(); // constructor private: tidak bisa dibuat sembarangan
  static final DbHelper instance = DbHelper._(); // satu-satunya objek

  static const _dbName = 'kartu_profil.db';
  static const _dbVersion = 1;

  static const tableProjects = 'projects';

  Database? _db;

  /// Membuka database saat pertama kali dibutuhkan, lalu dipakai ulang.
  Future<Database> get database async => _db ??= await _open();

  Future<Database> _open() async {
    final path = join(await getDatabasesPath(), _dbName);
    return openDatabase(
      path,
      version: _dbVersion,
      onCreate: _onCreate,
    );
  }

  /// Dipanggil SEKALI, saat file database pertama kali dibuat.
  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE $tableProjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        tech_stack TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    ''');
  }
}
```

Penjelasan singkat:

- **Singleton** (`instance`): seluruh aplikasi memakai **satu** koneksi database. Membuka banyak koneksi ke file yang sama berpotensi menimbulkan konflik.
- **`??=`**: "jika `_db` masih `null`, isi dengan hasil `_open()`". Database dibuka lazy, hanya saat pertama dipakai.
- **`onCreate`**: tempat membuat tabel. Hanya berjalan **sekali**.
- **`version`**: nomor versi skema. Ini kunci untuk migrasi di Lab 10.

> ⚠️ **Jebakan paling sering terjadi pada praktikum ini:**
> `onCreate` hanya jalan saat file database **belum ada**. Jika kamu mengubah `CREATE TABLE` setelah aplikasi pernah dijalankan, perubahan **tidak akan berlaku**, karena file database lama masih ada. Selama belajar, solusinya: **uninstall aplikasi dari emulator** (atau *Clear Storage*) lalu jalankan ulang. Di aplikasi nyata, solusinya adalah **migrasi** (Lab 10).

✅ **Checkpoint 6:** tidak ada error kompilasi. (Database belum terlihat hasilnya, kita buktikan di Lab 7.)

---

### Lab 7 — Model & Repository (25 menit)

**Tujuan:** membuat model `Project` dan seluruh operasi CRUD di repository, lalu mengujinya.

**Langkah 1.** Buat `lib/models/project.dart`:

```dart
class Project {
  const Project({
    this.id,
    required this.title,
    required this.description,
    required this.techStack,
    required this.createdAt,
  });

  final int? id; // null = belum disimpan; diisi otomatis oleh database
  final String title;
  final String description;
  final String techStack;
  final DateTime createdAt;

  /// Object → Map (untuk ditulis ke database)
  Map<String, Object?> toMap() => {
        if (id != null) 'id': id,
        'title': title,
        'description': description,
        'tech_stack': techStack,
        'created_at': createdAt.toIso8601String(),
      };

  /// Map (hasil baca database) → Object
  factory Project.fromMap(Map<String, Object?> map) => Project(
        id: map['id'] as int?,
        title: map['title'] as String,
        description: map['description'] as String,
        techStack: map['tech_stack'] as String,
        createdAt: DateTime.parse(map['created_at'] as String),
      );
}
```

Perhatikan bahwa nama kolom di database memakai `snake_case` (`tech_stack`, `created_at`), sedangkan field Dart memakai `camelCase` (`techStack`, `createdAt`). Penerjemahan terjadi di `toMap` dan `fromMap`.

**Langkah 2.** Buat `lib/data/project_repository.dart`. Di sinilah keempat operasi CRUD berada:

```dart
import 'package:sqflite/sqflite.dart';
import '../models/project.dart';
import 'db_helper.dart';

class ProjectRepository {
  ProjectRepository({DbHelper? helper})
      : _helper = helper ?? DbHelper.instance;

  final DbHelper _helper;
  static const _table = DbHelper.tableProjects;

  // ---------- CREATE ----------
  Future<int> insert(Project project) async {
    final db = await _helper.database;
    return db.insert(_table, project.toMap()); // mengembalikan id baru
  }

  // ---------- READ ----------
  Future<List<Project>> getAll({String query = ''}) async {
    final db = await _helper.database;
    final rows = await db.query(
      _table,
      where: query.isEmpty ? null : 'title LIKE ?',
      whereArgs: query.isEmpty ? null : ['%$query%'],
      orderBy: 'created_at DESC', // terbaru di atas
    );
    return rows.map(Project.fromMap).toList();
  }

  Future<int> count() async {
    final db = await _helper.database;
    final result = await db.rawQuery('SELECT COUNT(*) FROM $_table');
    return Sqflite.firstIntValue(result) ?? 0;
  }

  // ---------- UPDATE ----------
  Future<int> update(Project project) async {
    final db = await _helper.database;
    return db.update(
      _table,
      project.toMap(),
      where: 'id = ?', // ⚠️ jangan pernah dihilangkan
      whereArgs: [project.id],
    );
  }

  // ---------- DELETE ----------
  Future<int> delete(int id) async {
    final db = await _helper.database;
    return db.delete(
      _table,
      where: 'id = ?', // ⚠️ jangan pernah dihilangkan
      whereArgs: [id],
    );
  }
}
```

Perhatikan bahwa `getAll` sudah mendukung parameter pencarian (`query`). Kita akan memakainya di challenge.

**Langkah 3. Uji cepat lewat `main()`.** Tambahkan sementara kode ini di `main()`, sebelum `runApp`:

```dart
// ⚠️ KODE UJI SEMENTARA — hapus setelah dicoba
final repo = ProjectRepository();
await repo.insert(Project(
  title: 'Kartu Profil Digital',
  description: 'Aplikasi kartu profil dengan penyimpanan lokal.',
  techStack: 'Flutter, Dart',
  createdAt: DateTime.now(),
));
final all = await repo.getAll();
debugPrint('Total proyek: ${all.length}');
for (final p in all) {
  debugPrint('#${p.id} ${p.title} (${p.techStack})');
}
```

(Tambahkan `import 'data/project_repository.dart';` dan `import 'models/project.dart';` di `main.dart`.)

Jalankan di **emulator Android**. Di Debug Console akan tercetak data proyek. Setiap kali kamu menjalankan ulang, jumlahnya bertambah karena kode uji selalu menambah satu baris.

**Langkah 4.** Setelah berhasil, **hapus seluruh kode uji sementara** dan impor yang tidak terpakai.

✅ **Checkpoint 7:** Debug Console menampilkan data proyek yang kamu masukkan, dan jumlahnya tetap ada setelah aplikasi dimatikan lalu dijalankan lagi.

> 🔍 **Opsional — melihat isi database:** di Android Studio buka **App Inspection → Database Inspector**, pilih proses aplikasimu, lalu buka `kartu_profil.db`. Kamu bisa melihat tabel `projects` seperti spreadsheet dan menjalankan query SQL sendiri.

---

### Lab 8 — Create & Read (45 menit)

**Tujuan:** menampilkan daftar proyek dan menambah proyek baru lewat form.

#### Langkah 1 — Halaman form (tambah & edit memakai satu halaman)

Buat `lib/pages/project_form_page.dart`. Satu halaman ini melayani dua mode: **tambah** (`project == null`) dan **edit** (`project != null`).

```dart
import 'package:flutter/material.dart';
import '../data/project_repository.dart';
import '../models/project.dart';

class ProjectFormPage extends StatefulWidget {
  const ProjectFormPage({super.key, this.project});
  final Project? project; // null = mode tambah

  @override
  State<ProjectFormPage> createState() => _ProjectFormPageState();
}

class _ProjectFormPageState extends State<ProjectFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _repo = ProjectRepository();

  late final _title = TextEditingController(text: widget.project?.title);
  late final _desc = TextEditingController(text: widget.project?.description);
  late final _tech = TextEditingController(text: widget.project?.techStack);

  bool _saving = false;
  bool get _isEdit => widget.project != null;

  @override
  void dispose() {
    _title.dispose();
    _desc.dispose();
    _tech.dispose();
    super.dispose();
  }

  String? _required(String? v) =>
      (v == null || v.trim().isEmpty) ? 'Wajib diisi' : null;

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);

    final old = widget.project;
    final project = Project(
      id: old?.id,
      title: _title.text.trim(),
      description: _desc.text.trim(),
      techStack: _tech.text.trim(),
      createdAt: old?.createdAt ?? DateTime.now(),
    );

    if (_isEdit) {
      await _repo.update(project);
    } else {
      await _repo.insert(project);
    }

    if (!mounted) return;
    Navigator.pop(context, true); // true = ada perubahan, list perlu refresh
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isEdit ? 'Edit Proyek' : 'Tambah Proyek'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _title,
              decoration: const InputDecoration(
                labelText: 'Judul proyek',
                border: OutlineInputBorder(),
              ),
              validator: _required,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _tech,
              decoration: const InputDecoration(
                labelText: 'Teknologi (contoh: Flutter, Dart)',
                border: OutlineInputBorder(),
              ),
              validator: _required,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _desc,
              maxLines: 4,
              decoration: const InputDecoration(
                labelText: 'Deskripsi',
                border: OutlineInputBorder(),
              ),
              validator: _required,
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _saving ? null : _save,
              child: Text(_saving ? 'Menyimpan...' : 'Simpan'),
            ),
          ],
        ),
      ),
    );
  }
}
```

Perhatikan dua hal penting:

- Tombol dinonaktifkan selama `_saving` agar pengguna tidak menekan dua kali dan membuat data ganda.
- `Navigator.pop(context, true)` memberi tahu halaman daftar bahwa data berubah.

#### Langkah 2 — Halaman daftar

Buat `lib/pages/project_list_page.dart`:

```dart
import 'package:flutter/material.dart';
import '../data/project_repository.dart';
import '../models/project.dart';
import 'project_form_page.dart';

class ProjectListPage extends StatefulWidget {
  const ProjectListPage({super.key});

  @override
  State<ProjectListPage> createState() => _ProjectListPageState();
}

class _ProjectListPageState extends State<ProjectListPage> {
  final _repo = ProjectRepository();
  late Future<List<Project>> _future = _repo.getAll();

  void _reload() {
    setState(() {
      _future = _repo.getAll();
    });
  }

  Future<void> _openForm([Project? project]) async {
    final changed = await Navigator.push<bool>(
      context,
      MaterialPageRoute(builder: (_) => ProjectFormPage(project: project)),
    );
    if (changed == true) _reload();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Proyek Saya')),
      body: FutureBuilder<List<Project>>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Terjadi kesalahan: ${snapshot.error}'));
          }

          final items = snapshot.data ?? [];
          if (items.isEmpty) {
            return const Center(
              child: Text(
                'Belum ada proyek.\nTekan + untuk menambahkan.',
                textAlign: TextAlign.center,
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.only(bottom: 88),
            itemCount: items.length,
            itemBuilder: (context, index) {
              final p = items[index];
              return Card(
                margin:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                child: ListTile(
                  title: Text(p.title),
                  subtitle: Text(
                    '${p.techStack}\n${p.description}',
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  isThreeLine: true,
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _openForm(),
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

**Langkah 3.** Agar halaman ini bisa dicoba sebelum Lab 11, ubah sementara `home` di `main.dart`:

```dart
home: const ProjectListPage(),
```

(Tambahkan impornya. Pada Lab 11 kita kembalikan ke `ProfilePage`.)

**Langkah 4. Uji:**

1. Daftar kosong → muncul teks "Belum ada proyek".
2. Tekan **+** → isi form → Simpan → proyek muncul di daftar.
3. Coba kirim form kosong → muncul pesan validasi.
4. Matikan aplikasi total, jalankan lagi → proyek masih ada.

✅ **Checkpoint 8:** kamu bisa menambah proyek dan daftar menampilkannya, bahkan setelah aplikasi dimatikan.

> 💡 **Mengapa `FutureBuilder`?** Membaca database bersifat asynchronous. `FutureBuilder` membangun UI sesuai status: menunggu (loading), gagal (error), atau berhasil (data). Tiga status ini selalu ditangani, jangan hanya status "berhasil".

---

### Lab 9 — Update & Delete (35 menit)

**Tujuan:** mengedit proyek dengan mengetuknya dan menghapus dengan konfirmasi.

**Langkah 1.** Di `_ProjectListPageState`, tambahkan method konfirmasi hapus:

```dart
Future<void> _confirmDelete(Project p) async {
  final ok = await showDialog<bool>(
    context: context,
    builder: (ctx) => AlertDialog(
      title: const Text('Hapus proyek?'),
      content: Text('"${p.title}" akan dihapus permanen.'),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(ctx, false),
          child: const Text('Batal'),
        ),
        FilledButton(
          onPressed: () => Navigator.pop(ctx, true),
          child: const Text('Hapus'),
        ),
      ],
    ),
  );
  if (ok != true) return;

  await _repo.delete(p.id!);
  if (!mounted) return;
  _reload();
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text('"${p.title}" dihapus')),
  );
}
```

**Langkah 2.** Ubah `ListTile` pada `itemBuilder` menjadi:

```dart
child: ListTile(
  title: Text(p.title),
  subtitle: Text(
    '${p.techStack}\n${p.description}',
    maxLines: 2,
    overflow: TextOverflow.ellipsis,
  ),
  isThreeLine: true,
  onTap: () => _openForm(p), // ← UPDATE: buka form dalam mode edit
  trailing: IconButton(
    icon: const Icon(Icons.delete_outline),
    tooltip: 'Hapus',
    onPressed: () => _confirmDelete(p), // ← DELETE
  ),
),
```

Form tidak perlu diubah. Ia sudah mendukung mode edit sejak Lab 8: ketika `widget.project` terisi, kolom form otomatis terisi data lama, dan `_save()` memanggil `update` alih-alih `insert`.

**Langkah 3. Uji:**

1. Ketuk proyek → form terbuka berisi data lama → ubah judul → Simpan → daftar berubah.
2. Tekan ikon sampah → dialog konfirmasi → **Hapus** → proyek hilang dan SnackBar muncul.
3. Tekan **Batal** → proyek tetap ada.

✅ **Checkpoint 9:** CRUD lengkap berjalan. Kamu sudah bisa Create, Read, Update, dan Delete data.

> ⚠️ **Eksperimen berbahaya (di emulator saja!).** Hapus sementara baris `where` dan `whereArgs` pada method `delete` di repository, lalu hapus satu proyek. Apa yang terjadi? Kembalikan kodenya setelah mencoba. Pengalaman ini akan membuatmu selalu mengingat `WHERE`.

---

### Lab 10 — Migrasi Database: Fitur Favorit (25 menit)

**Tujuan:** menambah kolom baru **tanpa menghapus data pengguna**. Ini situasi nyata yang pasti kamu temui: aplikasi sudah dipakai ribuan orang, lalu kamu perlu menambah fitur.

#### Konsep migrasi

Pengguna lama sudah punya file database versi 1. Kamu merilis update yang butuh kolom `is_favorite`. Kamu **tidak bisa** menyuruh mereka uninstall (datanya hilang). Solusinya: naikkan `version`, lalu tulis perintah perubahan di `onUpgrade`.

```
Pengguna baru   → file belum ada  → onCreate  (langsung skema versi terbaru)
Pengguna lama   → file versi 1    → onUpgrade (ubah skema dari v1 ke v2)
```

**Langkah 1.** Ubah `db_helper.dart`:

```dart
static const _dbVersion = 2; // naik dari 1
```

Tambahkan `onUpgrade` pada `openDatabase`:

```dart
return openDatabase(
  path,
  version: _dbVersion,
  onCreate: _onCreate,
  onUpgrade: _onUpgrade, // ← tambahan
);
```

Ubah `_onCreate` agar **pengguna baru** langsung mendapat kolom baru:

```dart
Future<void> _onCreate(Database db, int version) async {
  await db.execute('''
    CREATE TABLE $tableProjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      tech_stack TEXT NOT NULL,
      created_at TEXT NOT NULL,
      is_favorite INTEGER NOT NULL DEFAULT 0
    )
  ''');
}
```

Tambahkan `_onUpgrade` agar **pengguna lama** mendapat kolom baru:

```dart
Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
  if (oldVersion < 2) {
    await db.execute(
      'ALTER TABLE $tableProjects '
      'ADD COLUMN is_favorite INTEGER NOT NULL DEFAULT 0',
    );
  }
  // Nanti jika ada versi 3: tambahkan  if (oldVersion < 3) { ... }
}
```

> ⚠️ **Dua tempat harus diubah:** `onCreate` **dan** `onUpgrade`. Jika hanya salah satu, pengguna baru atau pengguna lama akan mengalami crash karena kolom tidak ada. Pola `if (oldVersion < N)` bertingkat memastikan pengguna yang melompat dari v1 langsung ke v3 tetap menjalani semua langkah.

**Langkah 2.** Perbarui model `Project` (`models/project.dart`). Tambahkan field `isFavorite`, `copyWith`, dan sesuaikan `toMap`/`fromMap`:

```dart
class Project {
  const Project({
    this.id,
    required this.title,
    required this.description,
    required this.techStack,
    required this.createdAt,
    this.isFavorite = false,
  });

  final int? id;
  final String title;
  final String description;
  final String techStack;
  final DateTime createdAt;
  final bool isFavorite;

  Project copyWith({
    String? title,
    String? description,
    String? techStack,
    bool? isFavorite,
  }) =>
      Project(
        id: id,
        title: title ?? this.title,
        description: description ?? this.description,
        techStack: techStack ?? this.techStack,
        createdAt: createdAt,
        isFavorite: isFavorite ?? this.isFavorite,
      );

  Map<String, Object?> toMap() => {
        if (id != null) 'id': id,
        'title': title,
        'description': description,
        'tech_stack': techStack,
        'created_at': createdAt.toIso8601String(),
        'is_favorite': isFavorite ? 1 : 0, // bool → 0/1
      };

  factory Project.fromMap(Map<String, Object?> map) => Project(
        id: map['id'] as int?,
        title: map['title'] as String,
        description: map['description'] as String,
        techStack: map['tech_stack'] as String,
        createdAt: DateTime.parse(map['created_at'] as String),
        isFavorite: (map['is_favorite'] as int? ?? 0) == 1, // 0/1 → bool
      );
}
```

**Langkah 3.** Di `project_form_page.dart`, pada pembuatan objek `Project` di `_save()`, tambahkan satu baris agar status favorit tidak hilang saat proyek diedit:

```dart
final project = Project(
  id: old?.id,
  title: _title.text.trim(),
  description: _desc.text.trim(),
  techStack: _tech.text.trim(),
  createdAt: old?.createdAt ?? DateTime.now(),
  isFavorite: old?.isFavorite ?? false, // ← tambahan
);
```

**Langkah 4.** Di repository, urutkan favorit lebih dulu. Ubah `orderBy` pada `getAll`:

```dart
orderBy: 'is_favorite DESC, created_at DESC',
```

**Langkah 5.** Di halaman daftar, ganti `trailing` pada `ListTile` dengan dua tombol:

```dart
trailing: Row(
  mainAxisSize: MainAxisSize.min,
  children: [
    IconButton(
      icon: Icon(p.isFavorite ? Icons.star : Icons.star_border),
      tooltip: 'Favorit',
      onPressed: () async {
        await _repo.update(p.copyWith(isFavorite: !p.isFavorite));
        _reload();
      },
    ),
    IconButton(
      icon: const Icon(Icons.delete_outline),
      tooltip: 'Hapus',
      onPressed: () => _confirmDelete(p),
    ),
  ],
),
```

**Langkah 6. Buktikan bahwa migrasi berhasil.** Jalankan aplikasi **tanpa uninstall**. Proyek yang kamu buat di Lab 8–9 harus **masih ada**, kini dengan bintang kosong. Ketuk bintang → proyek naik ke posisi paling atas.

> Jika muncul error `no such column: is_favorite`, artinya `_dbVersion` belum naik ke `2` atau `onUpgrade` belum terdaftar di `openDatabase`.

✅ **Checkpoint 10:** data lama tetap utuh, kolom baru bekerja, dan tombol favorit mengurutkan daftar.

---

### Lab 11 — Integrasi ke Halaman Profil (10 menit)

**Tujuan:** menghubungkan seluruh fitur menjadi satu aplikasi utuh.

**Langkah 1.** Kembalikan `home` di `main.dart` ke `ProfilePage` (kode sebelumnya di Lab 3). Hapus import yang tidak terpakai.

**Langkah 2.** Di `profile_page.dart`, tambahkan impor:

```dart
import '../data/project_repository.dart';
import 'project_list_page.dart';
```

Tambahkan di `_ProfilePageState`:

```dart
final _projectRepo = ProjectRepository();
late Future<int> _countFuture = _projectRepo.count();

Future<void> _openProjects() async {
  await Navigator.push(
    context,
    MaterialPageRoute(builder: (_) => const ProjectListPage()),
  );
  if (!mounted) return;
  // Kembali dari daftar proyek → segarkan jumlah
  setState(() {
    _countFuture = _projectRepo.count();
  });
}
```

**Langkah 3.** Ganti komentar `// Lab 11 akan menambahkan...` di `ListView` dengan:

```dart
ListTile(
  leading: const Icon(Icons.folder_open),
  title: const Text('Proyek Saya'),
  subtitle: FutureBuilder<int>(
    future: _countFuture,
    builder: (context, snapshot) => Text('${snapshot.data ?? 0} proyek'),
  ),
  trailing: const Icon(Icons.chevron_right),
  onTap: _openProjects,
),
```

**Langkah 4. Uji alur akhir:**

1. Buka aplikasi → kartu profil muncul sesuai tema tersimpan.
2. Edit profil, ganti tema, tambah beberapa proyek, tandai favorit.
3. Kembali ke profil → jumlah proyek ikut berubah.
4. **Matikan aplikasi total** dan buka lagi → **semuanya masih ada**: profil, tema, penghitung, dan seluruh proyek.

🎉 **Checkpoint 11 (Hasil Akhir):** Kartu Profil Digital kini punya penyimpanan lokal yang lengkap.

---

### 🏆 Challenge Pertemuan 2 (25 menit)

| Level | Tantangan |
|---|---|
| ⭐ | Tambahkan tombol **"Hapus Semua"** di AppBar halaman daftar (dengan dialog konfirmasi). Tambahkan method `deleteAll()` di repository. Petunjuk: `db.delete(_table)` tanpa `where` menghapus semua baris. Kali ini memang disengaja. |
| ⭐⭐ | Tambahkan **kolom pencarian** di halaman daftar. Repository sudah mendukung parameter `query`; tugasmu hanya membuat `TextField` di UI dan memanggil `getAll(query: ...)`. |
| ⭐⭐ | Ganti tombol hapus dengan **geser untuk menghapus** (`Dismissible`), lengkap dengan SnackBar **"Urungkan"** yang mengembalikan data (petunjuk: simpan objek `Project` yang baru dihapus lalu `insert` kembali). |
| ⭐⭐⭐ | **Migrasi versi 3:** tambahkan kolom `category` (TEXT, default `'Umum'`). Tulis `onUpgrade` dengan `if (oldVersion < 3)`, perbarui model dan form (misalnya `DropdownButtonFormField`), lalu tambahkan **filter chip** untuk menyaring daftar berdasarkan kategori dan favorit. |
| ⭐⭐⭐ | Buat **tabel kedua** `project_tags` yang berelasi dengan `projects` lewat `project_id` (*foreign key*). Tampilkan tag di tiap kartu proyek. Pelajari `JOIN` dan `PRAGMA foreign_keys = ON`. |

> 🎨 Kreasimu dinilai dari cara berpikirmu, bukan hanya dari fitur yang jadi. Jika buntu, tuliskan: *data apa yang perlu disimpan, di mana disimpan, dan siapa yang mengubahnya?*

---

## 4. Contoh Implementasi di Real Project

Bagian ini adalah **pendalaman**. Kerjakan setelah Lab 11 selesai, sebagai tugas mandiri atau latihan lanjutan. Semua contoh memakai fondasi yang sudah kamu bangun (`PrefService`, `DbHelper`, repository), jadi kamu tidak memulai dari nol.

Di aplikasi sungguhan, SharedPreferences dan SQLite jarang dipakai sendirian. Keduanya bekerja bersama penyimpanan aman dan server.

### 4.0 Peta penggunaan di aplikasi nyata

| Jenis aplikasi | SharedPreferences | Secure Storage | SQLite |
|---|---|---|---|
| **Toko online** | tema, bahasa, riwayat pencarian | token login | keranjang, wishlist, cache katalog produk |
| **Chat / sosial media** | pengaturan notifikasi, tema | token login | riwayat pesan, cache feed, antrean pesan yang belum terkirim |
| **Catatan / to-do** | tema, mode tampilan | — | seluruh catatan dan tugas |
| **Berita / artikel** | ukuran font, kategori favorit | token (jika ada akun) | cache artikel, bookmark |
| **Keuangan** | bahasa, flag onboarding | token, kunci enkripsi | riwayat transaksi (database **terenkripsi**, misalnya SQLCipher) |

Polanya selalu sama: **kecil dan tidak rahasia → SharedPreferences. Rahasia → Secure Storage. Banyak dan terstruktur → SQLite.**

Enam contoh berikut adalah pola yang paling sering kamu temui:

| # | Pola | Teknologi |
|---|---|---|
| 1 | Sesi login, auto-login, dan logout | Secure Storage + SharedPreferences + SQLite |
| 2 | Riwayat pencarian | SharedPreferences |
| 3 | Cache data server (cache-then-network) | SQLite + SharedPreferences |
| 4 | Pagination / infinite scroll | SQLite |
| 5 | Antrean tulis saat offline (outbox) | SQLite |
| 6 | Menguji repository | SQLite in-memory |

---

### 4.1 Sesi Login, Auto-Login, dan Logout

**Kasus nyata:** setelah login, pengguna tidak perlu login lagi tiap membuka aplikasi. Saat membuka aplikasi, ada layar **Splash** yang memutuskan tujuan: Onboarding, Login, atau Beranda.

```
          ┌── belum lihat onboarding? ──▶ Onboarding
Splash ───┤
          ├── tidak ada token? ─────────▶ Login
          └── ada token ────────────────▶ Beranda
```

Pembagian tugasnya:

| Data | Disimpan di | Alasan |
|---|---|---|
| Token login | **Secure Storage** | rahasia |
| Flag "sudah lihat onboarding" | SharedPreferences | tidak rahasia, kecil |
| Data milik pengguna (proyek, dll.) | SQLite | banyak, terstruktur |

**Langkah 1.** Pasang paket penyimpanan aman:

```bash
flutter pub add flutter_secure_storage
```

> Setelah menambah plugin, lakukan **stop lalu run ulang** (bukan hot reload). Cek juga README paket untuk persyaratan versi Android minimum (`minSdkVersion`).

**Langkah 2.** Buat `lib/services/auth_storage.dart`:

```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthStorage {
  AuthStorage({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;
  static const _kToken = 'access_token';

  Future<void> saveToken(String token) =>
      _storage.write(key: _kToken, value: token);

  Future<String?> readToken() => _storage.read(key: _kToken);

  Future<void> clear() => _storage.delete(key: _kToken);
}
```

**Langkah 3.** Tambahkan flag onboarding di `PrefService`:

```dart
static const _kOnboarded = 'has_seen_onboarding';

bool get hasSeenOnboarding => _prefs.getBool(_kOnboarded) ?? false;

Future<void> setOnboarded() => _prefs.setBool(_kOnboarded, true);
```

**Langkah 4.** Buat `lib/pages/splash_page.dart`. Halaman ini hanya **memutuskan**, tidak menampilkan apa pun selain indikator loading:

```dart
import 'package:flutter/material.dart';
import '../services/auth_storage.dart';
import '../services/pref_service.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({
    super.key,
    required this.prefs,
    required this.auth,
    required this.onboardingBuilder,
    required this.loginBuilder,
    required this.homeBuilder,
  });

  final PrefService prefs;
  final AuthStorage auth;
  final WidgetBuilder onboardingBuilder;
  final WidgetBuilder loginBuilder;
  final WidgetBuilder homeBuilder;

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  @override
  void initState() {
    super.initState();
    _decide();
  }

  Future<void> _decide() async {
    final token = await widget.auth.readToken();
    if (!mounted) return;

    final WidgetBuilder target;
    if (!widget.prefs.hasSeenOnboarding) {
      target = widget.onboardingBuilder;
    } else if (token == null) {
      target = widget.loginBuilder;
    } else {
      target = widget.homeBuilder;
    }

    // pushReplacement: Splash dibuang dari stack, tombol Back tidak kembali ke sini
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: target),
    );
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: CircularProgressIndicator()));
  }
}
```

Halaman Onboarding dan Login dibuat sendiri (halaman Login akan kamu lengkapi di modul REST API). Untuk latihan sekarang, cukup halaman sederhana berisi tombol yang memanggil `prefs.setOnboarded()` atau `auth.saveToken('token-palsu')`.

**Langkah 5. Logout yang benar.** Ini sering terlewat:

```dart
Future<void> logout(BuildContext context) async {
  await auth.clear();                       // 1. hapus token
  await DbHelper.instance.clearAllTables(); // 2. hapus data milik pengguna lama
  if (!context.mounted) return;
  // 3. arahkan ke halaman Login dan buang seluruh stack
  Navigator.of(context).pushAndRemoveUntil(
    MaterialPageRoute(builder: (_) => const LoginPage()),
    (route) => false,
  );
}
```

Tambahkan ke `DbHelper`:

```dart
/// Menghapus isi semua tabel (struktur tabel tetap).
Future<void> clearAllTables() async {
  final db = await database;
  await db.transaction((txn) async {
    await txn.delete(tableProjects);
    // tambahkan tabel lain di sini jika ada
  });
}
```

> ⚠️ **Bug nyata yang sering terjadi:** pengguna A logout, pengguna B login di perangkat yang sama, lalu B melihat data milik A. Penyebabnya hanya satu: lupa membersihkan SQLite saat logout. Aturannya: **semua yang berkaitan dengan pengguna harus dibersihkan saat logout.**

> 💡 `transaction` membungkus beberapa operasi menjadi satu kesatuan: semuanya berhasil, atau semuanya dibatalkan. Tidak ada kondisi "setengah terhapus".

**Uji:** login palsu → tutup aplikasi total → buka lagi → langsung masuk Beranda. Tekan logout → buka lagi → masuk Login dan daftar proyek kosong.

---

### 4.2 Riwayat Pencarian

**Kasus nyata:** kolom pencarian menampilkan 5–10 kata kunci terakhir. Datanya kecil, berupa daftar `String`, dan tidak rahasia, sehingga SharedPreferences sudah tepat.

Aturan umum di aplikasi nyata: **terbaru di atas, tanpa duplikat, dibatasi jumlahnya, bisa dihapus.**

Tambahkan di `PrefService`:

```dart
static const _kSearchHistory = 'search_history';

List<String> get searchHistory =>
    _prefs.getStringList(_kSearchHistory) ?? const [];

Future<void> addSearchHistory(String keyword, {int max = 10}) async {
  final k = keyword.trim();
  if (k.isEmpty) return;

  final list = List<String>.of(searchHistory)
    ..removeWhere((e) => e.toLowerCase() == k.toLowerCase()) // hindari duplikat
    ..insert(0, k);                                          // terbaru di atas

  await _prefs.setStringList(_kSearchHistory, list.take(max).toList());
}

Future<void> clearSearchHistory() => _prefs.remove(_kSearchHistory);
```

Perhatikan `List<String>.of(...)`: kita membuat salinan yang bisa dimodifikasi, sebab daftar bawaan (`const []`) tidak boleh diubah.

Pemakaian di halaman pencarian (misalnya challenge ⭐⭐ Pertemuan 2). Tampilkan riwayat sebagai chip:

```dart
Wrap(
  spacing: 8,
  children: [
    for (final keyword in prefs.searchHistory)
      ActionChip(
        label: Text(keyword),
        onPressed: () => _search(keyword),
      ),
  ],
),
```

Dan panggil `prefs.addSearchHistory(keyword)` **hanya ketika pengguna benar-benar mengirim pencarian** (menekan Enter/ikon cari), bukan di setiap ketikan huruf.

---

### 4.3 Cache Data Server (Cache-then-Network)

**Kasus nyata:** hampir semua aplikasi yang menampilkan data dari server memakai pola ini. Pengguna membuka aplikasi dan **langsung melihat data** (dari SQLite), sementara aplikasi diam-diam mengambil data terbaru dari server di belakang layar. Jika internet mati, data lama tetap tampil.

```
Buka halaman
   │
   ├─1─▶ Baca SQLite ──▶ tampilkan (instan, bisa offline)
   │
   └─2─▶ Ambil dari server ──berhasil──▶ simpan ke SQLite ──▶ perbarui tampilan
                           └─gagal────▶ tetap tampilkan data lama + beri tahu pengguna
```

Contoh kita: **Feed Artikel** di Kartu Profil Digital. Server belum kita punya (akan dibuat di modul REST API), jadi kita memakai **API palsu** agar bisa langsung dicoba. Saat modul REST API tiba, kamu cukup mengganti satu kelas.

**Langkah 1. Migrasi: tabel baru `articles`.** Di `db_helper.dart`:

```dart
static const _dbVersion = 3; // naik dari 2
static const tableArticles = 'articles';
```

> Jika kamu sudah mengerjakan challenge ⭐⭐⭐ (migrasi v3 `category`), gunakan **versi 4** dan blok `oldVersion < 4`.

```dart
Future<void> _createArticles(Database db) => db.execute('''
  CREATE TABLE $tableArticles (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    cached_at TEXT NOT NULL
  )
''');
```

Perhatikan `id INTEGER PRIMARY KEY` **tanpa** `AUTOINCREMENT`: id berasal dari server, bukan dibuat oleh database lokal.

Panggil di dua tempat (ingat aturan Lab 10):

```dart
// di dalam _onCreate, setelah CREATE TABLE projects
await _createArticles(db);

// di dalam _onUpgrade
if (oldVersion < 3) {
  await _createArticles(db);
}
```

**Langkah 2. Model.** Buat `lib/models/article.dart`. Model ini punya **dua pintu masuk**: dari JSON (server) dan dari Map (database).

```dart
class Article {
  const Article({required this.id, required this.title, required this.body});

  final int id;
  final String title;
  final String body;

  /// Dari respons server (JSON)
  factory Article.fromJson(Map<String, dynamic> json) => Article(
        id: json['id'] as int,
        title: json['title'] as String,
        body: json['body'] as String,
      );

  /// Dari baris database
  factory Article.fromMap(Map<String, Object?> map) => Article(
        id: map['id'] as int,
        title: map['title'] as String,
        body: map['body'] as String,
      );

  Map<String, Object?> toMap() => {
        'id': id,
        'title': title,
        'body': body,
        'cached_at': DateTime.now().toIso8601String(),
      };
}
```

**Langkah 3. API (kontrak + versi palsu).** Buat `lib/data/article_api.dart`:

```dart
import '../models/article.dart';

/// Kontrak: repository hanya tahu "ada yang bisa mengambil artikel".
abstract class ArticleApi {
  Future<List<Article>> fetchArticles();
}

/// Versi palsu untuk latihan. Nanti diganti implementasi HTTP sungguhan.
class FakeArticleApi implements ArticleApi {
  FakeArticleApi({this.shouldFail = false});
  final bool shouldFail; // true = simulasi tidak ada internet

  @override
  Future<List<Article>> fetchArticles() async {
    await Future.delayed(const Duration(seconds: 2)); // simulasi jaringan lambat
    if (shouldFail) throw Exception('Tidak ada koneksi');
    return List.generate(
      10,
      (i) => Article(
        id: i + 1,
        title: 'Artikel ke-${i + 1}',
        body: 'Isi artikel ke-${i + 1}. Diambil pada ${DateTime.now()}.',
      ),
    );
  }
}
```

> 💡 **Mengapa memakai `abstract class`?** Repository bergantung pada *kontrak*, bukan pada implementasi. Pada modul REST API, kamu cukup membuat `HttpArticleApi implements ArticleApi` tanpa mengubah repository maupun UI. Pada pengujian, kamu bisa memakai API palsu. Ini pola standar di tim profesional.

**Langkah 4. Repository.** Buat `lib/data/article_repository.dart`:

```dart
import '../models/article.dart';
import 'article_api.dart';
import 'db_helper.dart';

class ArticleRepository {
  ArticleRepository(this._api, {DbHelper? helper})
      : _helper = helper ?? DbHelper.instance;

  final ArticleApi _api;
  final DbHelper _helper;
  static const _table = DbHelper.tableArticles;

  /// Baca dari lokal. Cepat dan bisa offline.
  Future<List<Article>> getCached() async {
    final db = await _helper.database;
    final rows = await db.query(_table, orderBy: 'id ASC');
    return rows.map(Article.fromMap).toList();
  }

  /// Ambil dari server, simpan ke lokal. Melempar exception jika gagal.
  Future<List<Article>> refresh() async {
    final fresh = await _api.fetchArticles(); // jika gagal, berhenti di sini
    final db = await _helper.database;

    await db.transaction((txn) async {
      final batch = txn.batch();
      batch.delete(_table); // buang cache lama (artikel yang sudah dihapus server ikut hilang)
      for (final a in fresh) {
        batch.insert(_table, a.toMap());
      }
      await batch.commit(noResult: true);
    });

    return fresh;
  }
}
```

Tiga detail penting:

- **Server dipanggil lebih dulu.** Cache lama baru dihapus **setelah** data baru berhasil diterima. Jika kamu menghapus dulu lalu server gagal, pengguna kehilangan semuanya.
- **`transaction`**: hapus + isi ulang berlangsung sebagai satu kesatuan. Aplikasi yang tertutup di tengah proses tidak meninggalkan cache setengah jadi.
- **`batch`**: ratusan `insert` dikirim sekaligus, jauh lebih cepat daripada `await db.insert(...)` satu per satu dalam perulangan.

> Alternatif: jika server tidak menghapus data, kamu bisa memakai *upsert* dengan `batch.insert(_table, map, conflictAlgorithm: ConflictAlgorithm.replace)`, yang memperbarui baris jika `id`-nya sudah ada.

**Langkah 5. Halaman.** Buat `lib/pages/article_page.dart`:

```dart
import 'package:flutter/material.dart';
import '../data/article_api.dart';
import '../data/article_repository.dart';
import '../models/article.dart';

class ArticlePage extends StatefulWidget {
  const ArticlePage({super.key});

  @override
  State<ArticlePage> createState() => _ArticlePageState();
}

class _ArticlePageState extends State<ArticlePage> {
  // Ganti shouldFail: true untuk menguji kondisi offline.
  final _repo = ArticleRepository(FakeArticleApi(shouldFail: false));

  List<Article> _items = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    // 1. Tampilkan cache dulu
    final cached = await _repo.getCached();
    if (!mounted) return;
    setState(() {
      _items = cached;
      _loading = cached.isEmpty; // spinner hanya jika benar-benar belum ada data
      _error = null;
    });

    // 2. Perbarui dari server
    try {
      final fresh = await _repo.refresh();
      if (!mounted) return;
      setState(() {
        _items = fresh;
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _error = _items.isEmpty ? 'Gagal memuat artikel.' : null;
      });
      if (_items.isNotEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Offline. Menampilkan data tersimpan.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    Widget body;
    if (_loading) {
      body = const Center(child: CircularProgressIndicator());
    } else if (_error != null) {
      body = Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(_error!),
            const SizedBox(height: 12),
            FilledButton(onPressed: _load, child: const Text('Coba lagi')),
          ],
        ),
      );
    } else {
      body = RefreshIndicator(
        onRefresh: _load, // tarik ke bawah untuk memuat ulang
        child: ListView.builder(
          itemCount: _items.length,
          itemBuilder: (context, i) => ListTile(
            title: Text(_items[i].title),
            subtitle: Text(_items[i].body, maxLines: 2),
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Feed Artikel')),
      body: body,
    );
  }
}
```

Untuk mencobanya, tambahkan `ListTile` "Feed Artikel" di halaman profil dengan `Navigator.push` ke `ArticlePage` (caranya sama seperti "Proyek Saya" di Lab 11).

**Langkah 6. Uji tiga skenario:**

| Skenario | Cara | Hasil yang diharapkan |
|---|---|---|
| Pertama kali, online | Jalankan dengan `shouldFail: false` | Spinner 2 detik, lalu 10 artikel |
| Membuka lagi, online | Buka ulang halaman | **Artikel langsung tampil**, lalu diam-diam diperbarui |
| Offline | Ubah ke `shouldFail: true`, **stop lalu run ulang** | Artikel lama tetap tampil + SnackBar "Offline" |

**Langkah 7 (opsional). Batasi frekuensi refresh dengan TTL.** Aplikasi nyata tidak memanggil server setiap kali halaman dibuka. Simpan waktu sinkronisasi terakhir di SharedPreferences:

```dart
// PrefService
static const _kLastSync = 'articles_last_sync';

DateTime? get articlesLastSync {
  final raw = _prefs.getString(_kLastSync);
  return raw == null ? null : DateTime.tryParse(raw);
}

Future<void> markArticlesSynced() =>
    _prefs.setString(_kLastSync, DateTime.now().toIso8601String());

bool get articlesStale {
  final last = articlesLastSync;
  return last == null ||
      DateTime.now().difference(last) > const Duration(minutes: 5);
}
```

Di `_load()`, lewati langkah 2 jika `!prefs.articlesStale`, dan panggil `prefs.markArticlesSynced()` setelah `refresh()` berhasil. Sementara itu, `RefreshIndicator` tetap memaksa pembaruan kapan pun pengguna menarik layar.

---

### 4.4 Pagination / Infinite Scroll

**Kasus nyata:** tabel berisi 5.000 baris. Memuat semuanya sekaligus memboroskan memori dan membuat layar lambat. Aplikasi nyata memuat **per halaman** (misalnya 20 baris), lalu memuat halaman berikutnya saat pengguna hampir sampai di bawah.

Di SQLite, caranya dengan `LIMIT` dan `OFFSET`:

```
Halaman 1: LIMIT 20 OFFSET 0   → baris 1–20
Halaman 2: LIMIT 20 OFFSET 20  → baris 21–40
Halaman 3: LIMIT 20 OFFSET 40  → baris 41–60
```

**Langkah 1.** Tambahkan di `ProjectRepository`:

```dart
Future<List<Project>> getPage({
  required int limit,
  required int offset,
  String query = '',
}) async {
  final db = await _helper.database;
  final rows = await db.query(
    _table,
    where: query.isEmpty ? null : 'title LIKE ?',
    whereArgs: query.isEmpty ? null : ['%$query%'],
    orderBy: 'is_favorite DESC, created_at DESC', // urutan HARUS stabil
    limit: limit,
    offset: offset,
  );
  return rows.map(Project.fromMap).toList();
}
```

> ⚠️ Pagination hanya benar jika `orderBy` **konsisten**. Tanpa urutan yang jelas, baris bisa terlewat atau muncul dua kali di antara halaman.

**Langkah 2.** Di halaman daftar, simpan data yang sudah dimuat dan deteksi pengguna mendekati dasar daftar. Kerangka state-nya:

```dart
static const _pageSize = 20;

final _scroll = ScrollController();
final List<Project> _items = [];
bool _isLoading = false;
bool _hasMore = true;

@override
void initState() {
  super.initState();
  _scroll.addListener(_onScroll);
  _loadMore();
}

@override
void dispose() {
  _scroll.dispose();
  super.dispose();
}

void _onScroll() {
  final nearBottom =
      _scroll.position.pixels >= _scroll.position.maxScrollExtent - 200;
  if (nearBottom) _loadMore();
}

Future<void> _loadMore() async {
  if (_isLoading || !_hasMore) return; // cegah pemanggilan ganda
  setState(() => _isLoading = true);

  final page = await _repo.getPage(limit: _pageSize, offset: _items.length);

  if (!mounted) return;
  setState(() {
    _items.addAll(page);
    _hasMore = page.length == _pageSize; // halaman tidak penuh = data habis
    _isLoading = false;
  });
}

/// Setelah tambah/ubah/hapus: mulai dari awal.
Future<void> _reset() async {
  setState(() {
    _items.clear();
    _hasMore = true;
  });
  await _loadMore();
}
```

Pasang `controller: _scroll` pada `ListView.builder`, dan tambahkan satu item ekstra di akhir daftar sebagai indikator loading:

```dart
ListView.builder(
  controller: _scroll,
  itemCount: _items.length + (_hasMore ? 1 : 0),
  itemBuilder: (context, i) {
    if (i == _items.length) {
      return const Padding(
        padding: EdgeInsets.all(16),
        child: Center(child: CircularProgressIndicator()),
      );
    }
    final p = _items[i];
    return ListTile(title: Text(p.title), subtitle: Text(p.techStack));
  },
),
```

**Uji:** buat **data uji sementara** (misalnya perulangan 100× `insert` di `main()`, lalu hapus setelah dicoba). Gulir ke bawah dan amati di Debug Console bahwa data dimuat 20 demi 20.

> 💡 `OFFSET` cukup untuk skala belajar dan aplikasi menengah. Pada tabel yang sangat besar, tim profesional sering beralih ke **keyset pagination** (`WHERE created_at < ?` memakai nilai item terakhir) karena lebih cepat. Cukup tahu istilahnya dulu.

---

### 4.5 Antrean Tulis Saat Offline (Outbox Pattern)

**Kasus nyata:** pengguna menambah proyek saat sinyal hilang. Aplikasi yang baik **tidak menolak**. Data disimpan dulu di SQLite dengan penanda "belum terkirim", lalu dikirim ke server saat koneksi pulih. Aplikasi chat, catatan, dan survei lapangan bekerja seperti ini.

```
Pengguna simpan ──▶ SQLite (is_synced = 0) ──▶ UI langsung menampilkan
                          │
          ketika online   ▼
                   kirim ke server ──berhasil──▶ is_synced = 1
                                    └─gagal────▶ tetap 0, coba lagi nanti
```

**Persiapan skema.** Tambahkan kolom penanda lewat migrasi (ikuti pola Lab 10):

```dart
await db.execute(
  'ALTER TABLE $tableProjects '
  'ADD COLUMN is_synced INTEGER NOT NULL DEFAULT 0',
);
```

**Kerangka sinkronisasi** di repository. `ProjectApi.upload` adalah API server yang akan kamu buat di modul REST API:

```dart
/// Kirim semua data yang belum tersinkron. Aman dipanggil berulang kali.
Future<void> syncPending(ProjectApi api) async {
  final db = await _helper.database;
  final rows = await db.query(_table, where: 'is_synced = ?', whereArgs: [0]);

  for (final row in rows) {
    final project = Project.fromMap(row);
    try {
      await api.upload(project);
      await db.update(
        _table,
        {'is_synced': 1},
        where: 'id = ?',
        whereArgs: [project.id],
      );
    } catch (_) {
      break; // koneksi bermasalah → berhenti, coba lagi di kesempatan berikutnya
    }
  }
}
```

Poin penting yang membedakan kode amatir dan profesional:

- **Idempotent:** jika `syncPending` dipanggil dua kali, tidak ada data terkirim ganda, karena yang sudah `is_synced = 1` tidak diambil lagi.
- **Berhenti saat gagal**, tidak memaksa terus.
- UI tidak menunggu server. Pengguna langsung melihat hasil karena data sudah ada di SQLite.
- Aplikasi nyata memicu `syncPending` ketika aplikasi dibuka, saat koneksi kembali (paket `connectivity_plus`), atau lewat tugas latar belakang (`workmanager`).

> 🔎 Pola ini membutuhkan server, jadi implementasi penuhnya menjadi bagian dari modul REST API. Untuk saat ini, pahami alurnya dan coba sisi lokalnya: tambahkan kolom `is_synced`, tampilkan ikon ☁️ (sudah sinkron) atau ⏳ (menunggu) di setiap proyek.

---

### 4.6 Menguji Repository dengan SQLite In-Memory

**Kasus nyata:** di tim profesional, kode yang menyentuh database wajib punya **unit test**, karena perubahan kecil bisa merusak data pengguna. Kita tidak perlu emulator: SQLite bisa berjalan **di memori** di komputermu, sehingga tes berjalan dalam hitungan detik dan database tidak meninggalkan sisa.

**Langkah 1.** Tambahkan paket khusus pengujian:

```bash
flutter pub add --dev sqflite_common_ffi
```

**Langkah 2.** Buat `DbHelper` bisa dibuat dengan database sementara. Ubah bagian atas `db_helper.dart`:

```dart
class DbHelper {
  DbHelper._([this._pathOverride]);
  static final DbHelper instance = DbHelper._();

  /// Database sementara di memori, khusus untuk pengujian.
  factory DbHelper.inMemory() => DbHelper._(inMemoryDatabasePath);

  final String? _pathOverride;
  // ... (sisanya tetap)

  Future<Database> _open() async {
    final path = _pathOverride ?? join(await getDatabasesPath(), _dbName);
    return openDatabase(
      path,
      version: _dbVersion,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
    );
  }

  Future<void> close() async {
    await _db?.close();
    _db = null;
  }
}
```

Alasan `ProjectRepository` menerima `DbHelper? helper` sejak Lab 7 menjadi jelas: agar repository bisa diberi database tiruan saat pengujian. Rancangan yang rapi memudahkan pengujian.

**Langkah 3.** Buat `test/project_repository_test.dart`:

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';

import 'package:kartu_profil_digital/data/db_helper.dart';
import 'package:kartu_profil_digital/data/project_repository.dart';
import 'package:kartu_profil_digital/models/project.dart';

Project _sample(String title) => Project(
      title: title,
      description: 'deskripsi',
      techStack: 'Dart',
      createdAt: DateTime.now(),
    );

void main() {
  sqfliteFfiInit();
  databaseFactory = databaseFactoryFfi; // pakai SQLite versi desktop

  late DbHelper helper;
  late ProjectRepository repo;

  setUp(() {
    helper = DbHelper.inMemory();            // database baru di setiap tes
    repo = ProjectRepository(helper: helper);
  });

  tearDown(() async => helper.close());

  test('insert lalu getAll mengembalikan data yang sama', () async {
    await repo.insert(_sample('Proyek A'));

    final all = await repo.getAll();

    expect(all.length, 1);
    expect(all.first.title, 'Proyek A');
  });

  test('delete hanya menghapus baris yang dipilih', () async {
    final idA = await repo.insert(_sample('A'));
    await repo.insert(_sample('B'));

    await repo.delete(idA);
    final all = await repo.getAll();

    expect(all.map((p) => p.title), ['B']);
  });

  test('pencarian memfilter berdasarkan judul', () async {
    await repo.insert(_sample('Aplikasi Catatan'));
    await repo.insert(_sample('Toko Online'));

    final result = await repo.getAll(query: 'catatan');

    expect(result.length, 1);
  });
}
```

> Ganti `kartu_profil_digital` dengan **nama project** di `pubspec.yaml` milikmu (baris `name:`).

**Langkah 4.** Jalankan:

```bash
flutter test
```

Tes ke-3 menguji sesuatu yang penting: pencarian `'catatan'` menemukan `'Aplikasi Catatan'` meskipun beda huruf besar-kecil. Itu karena `LIKE` pada SQLite tidak membedakan huruf besar-kecil untuk karakter ASCII.

> Jika muncul error SQLite tidak ditemukan di komputermu, buka README paket `sqflite_common_ffi` untuk langkah sesuai sistem operasi (Windows/macOS/Linux).

**Tantangan kecil:** tulis satu tes lagi yang membuktikan `update` hanya mengubah satu baris (petunjuk: sisipkan dua proyek, ubah satu, lalu pastikan yang lain tidak berubah). Tes seperti inilah yang akan menangkap kesalahan lupa `WHERE`.

---

### 🏆 Tugas Pendalaman

| Level | Tantangan |
|---|---|
| ⭐ | Terapkan **riwayat pencarian** (4.2) pada kolom pencarian proyek, lengkap dengan tombol "Hapus riwayat". |
| ⭐⭐ | Terapkan **alur Splash** (4.1) dengan halaman Onboarding dan Login sederhana, lengkap dengan tombol Logout di profil yang membersihkan token **dan** data SQLite. |
| ⭐⭐ | Terapkan **Feed Artikel** (4.3), lalu tambahkan **bookmark**: tabel `bookmarks` terpisah yang menyimpan `article_id`, tidak ikut terhapus saat cache dibersihkan. Pikirkan kenapa tabel ini sebaiknya dipisah. |
| ⭐⭐⭐ | Terapkan **pagination** (4.4) dengan kolom pencarian aktif: ketika kata kunci berubah, daftar di-*reset* dan dimuat dari halaman pertama. Tambahkan *debounce* 400 ms agar query tidak dijalankan di setiap ketikan. |
| ⭐⭐⭐ | Lengkapi tes (4.6) untuk `ArticleRepository` memakai API palsu yang **gagal**: buktikan bahwa cache lama **tidak terhapus** ketika `refresh()` melempar exception. |

---

## 5. Insight Industri

Bagian ini merangkum kebiasaan yang dipakai di tim pengembang aplikasi mobile profesional.

### 5.1 Pilih penyimpanan sesuai tingkat kerahasiaan

**Jangan menyimpan token login, password, atau data sensitif di SharedPreferences.** Nilai di sana tersimpan sebagai teks biasa dan bisa dibaca di perangkat yang di-*root*. Gunakan `flutter_secure_storage`, yang memakai Keychain (iOS) dan penyimpanan terenkripsi (Android).

```dart
// Contoh — untuk token, bukan SharedPreferences
const storage = FlutterSecureStorage();
await storage.write(key: 'access_token', value: token);
final token = await storage.read(key: 'access_token');
```

### 5.2 Bungkus akses penyimpanan, jangan tersebar di UI

Pola yang kamu pakai di modul ini (`PrefService` dan `ProjectRepository`) memang disengaja. Aturannya:

- Widget **tidak** memanggil `SharedPreferences` atau SQL secara langsung.
- Key dan nama tabel dijadikan konstanta.
- Perubahan cara penyimpanan cukup mengubah satu kelas.

Pada aplikasi besar, pola ini biasanya dipadukan dengan *state management* (Provider, Riverpod, atau Bloc), dan repository disuntikkan lewat *dependency injection* agar mudah diuji.

### 5.3 Selalu pakai parameter `?`

Sekali lagi karena sangat penting: **jangan pernah menyusun SQL dengan menggabungkan string dari input pengguna.** Pakai `where` + `whereArgs`.

### 5.4 Migrasi adalah hal wajib, bukan opsional

Setiap perubahan skema setelah aplikasi dirilis **harus** lewat `onUpgrade`. Kebiasaan industri:

- Naikkan `version` setiap perubahan skema.
- Jangan pernah mengedit migrasi lama yang sudah dirilis. Tambahkan blok baru.
- Uji skenario: pengguna baru, pengguna lama, dan pengguna yang melompat beberapa versi.

### 5.5 Jangan blokir UI, dan tangani semua status

Semua operasi baca/tulis bersifat async. Selalu tangani: *loading*, *error*, dan *kosong* (empty state), bukan hanya kondisi berhasil. Pada data yang sangat besar, ambil data bertahap (*pagination* dengan `limit` dan `offset`) alih-alih memuat semuanya.

### 5.6 Data lokal bisa hilang

Data hilang ketika pengguna **uninstall** aplikasi atau memilih *Clear Data*. Karena itu:

- Data penting pengguna tetap perlu **disinkronkan ke server** (backup).
- Data lokal yang kamu simpan sebaiknya dianggap **cache atau salinan kerja**, kecuali memang aplikasinya sepenuhnya offline.

### 5.7 Pola *offline-first*

Banyak aplikasi populer menjadikan database lokal sebagai **sumber kebenaran** untuk UI:

```
UI  ◀── membaca selalu dari ──  Database lokal  ◀── disinkronkan dari ──  Server (REST API)
```

Pengguna tetap bisa memakai aplikasi tanpa internet; sinkronisasi terjadi ketika jaringan tersedia. Konsep ini akan relevan saat kamu mempelajari integrasi REST API.

### 5.8 Alternatif dan langkah berikutnya

| Paket | Kegunaan |
|---|---|
| `drift` | Lapisan di atas SQLite dengan **query type-safe** dan migrasi terkelola. Banyak dipakai pada proyek skala menengah-besar. |
| `flutter_secure_storage` | Penyimpanan terenkripsi untuk token dan rahasia. |
| `path_provider` | Mengakses folder aplikasi untuk menyimpan file (foto, dokumen). |
| `sqflite_common_ffi` | Menjalankan `sqflite` di desktop dan di *unit test*. |

Sebelum memilih paket pihak ketiga untuk proyek serius, biasakan memeriksa halaman paket di pub.dev: tanggal pembaruan terakhir, jumlah *likes* dan *pub points*, serta platform yang didukung. Paket yang tidak lagi dirawat adalah risiko jangka panjang.

> ℹ️ Pada dokumentasi `shared_preferences` terbaru juga tersedia API baru (`SharedPreferencesAsync` dan `SharedPreferencesWithCache`). Konsep key-value-nya sama dengan yang kamu pelajari di sini, jadi kamu akan mudah beradaptasi.

### 5.9 Ringkasan jebakan yang sering terjadi

| Masalah | Penyebab | Solusi |
|---|---|---|
| `MissingPluginException` atau error saat startup | Lupa `WidgetsFlutterBinding.ensureInitialized()` atau plugin baru belum di-*rebuild* | Tambahkan pemanggilan itu; lakukan **stop lalu run ulang** (bukan hot reload) setelah menambah plugin |
| `sqflite` error di Chrome | `sqflite` tidak mendukung web | Gunakan emulator/perangkat Android |
| Perubahan `CREATE TABLE` tidak berpengaruh | `onCreate` hanya jalan sekali | Saat belajar: uninstall app. Di produksi: migrasi |
| `no such column` | Skema DB tidak sama dengan kode | Cek `version`, `onCreate`, dan `onUpgrade` |
| Semua data berubah/terhapus | `update`/`delete` tanpa `where` | Selalu pakai `where` + `whereArgs` |
| Data profil "hilang" | Salah ketik key | Pakai konstanta untuk key |
| Warning `use_build_context_synchronously` | Memakai `context` setelah `await` | Tambahkan `if (!mounted) return;` |
| Data ganda | Tombol simpan ditekan berulang | Nonaktifkan tombol saat proses berjalan |

---

## 6. Rangkuman & Refleksi

### Rangkuman

- **State** hidup di memori dan hilang saat aplikasi ditutup; **penyimpanan lokal** bertahan.
- **SharedPreferences:** key-value untuk data kecil dan sederhana (tema, flag, preferensi). Objek bisa disimpan lewat JSON.
- **SQLite:** database relasional di dalam perangkat untuk data terstruktur dan banyak.
- **CRUD:** `insert`, `query`, `update`, `delete`. Selalu pakai `where` + `whereArgs`.
- **Arsitektur:** UI → Repository → DbHelper; UI tidak menulis SQL.
- **Migrasi:** naikkan `version`, ubah `onCreate` **dan** `onUpgrade`.
- **Keamanan:** data rahasia tidak boleh di SharedPreferences.
- **Pola real project:** sesi login (Secure Storage), riwayat pencarian (SharedPreferences), cache-then-network, pagination, antrean tulis offline, dan pengujian repository dengan SQLite in-memory.

### Pertanyaan Refleksi

Jawab dengan kalimatmu sendiri:

1. Kamu ingin menyimpan pilihan bahasa aplikasi, token login, dan 500 catatan. Masing-masing sebaiknya disimpan di mana, dan mengapa?
2. Mengapa `onCreate` saja tidak cukup ketika kamu menambah kolom baru pada aplikasi yang sudah dirilis?
3. Apa risiko menulis `db.rawQuery("... '$input' ...")`, dan bagaimana cara yang benar?
4. Mengapa halaman daftar menerima hasil `true` dari `Navigator.pop`, bukan langsung memuat ulang sendiri setiap saat?
5. Apa perbedaan peran `DbHelper` dan `ProjectRepository`?
6. Pada pola cache-then-network, mengapa cache lama baru dihapus **setelah** data dari server berhasil diterima?
7. Apa yang harus dibersihkan saat pengguna logout, dan apa akibatnya jika ada yang terlewat?

---

## 7. Referensi

- `shared_preferences` — https://pub.dev/packages/shared_preferences
- `sqflite` — https://pub.dev/packages/sqflite
- `path` — https://pub.dev/packages/path
- `flutter_secure_storage` — https://pub.dev/packages/flutter_secure_storage
- `drift` — https://pub.dev/packages/drift
- Dokumentasi SQLite (sintaks SQL) — https://www.sqlite.org/lang.html
- Dokumentasi Flutter — https://docs.flutter.dev
- Dokumentasi Dart — https://dart.dev

---

*Selamat berkarya! Setelah modul ini, aplikasimu sudah tidak "pelupa" lagi. Modul berikutnya akan menghubungkan data lokal dengan data dari server lewat REST API.*
