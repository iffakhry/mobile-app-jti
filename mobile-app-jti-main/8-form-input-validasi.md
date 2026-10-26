# Modul 6 — Form, Input & Validasi

> **Praktikum Mobile Programming dengan Flutter & Dart**
> Studi kasus: **Kartu Profil Digital** (lanjutan Modul 3–5)
> Durasi: **2 pertemuan × 4 jam**

---

## 🎯 Apa yang Akan Kamu Capai?

Di modul sebelumnya, kamu sudah membangun tampilan **Kartu Profil Digital**. Tapi sejauh ini datanya masih _statis_: kamu tidak bisa mengubah nama atau emailmu lewat aplikasi.

Di modul ini, kamu akan menambahkan fitur **Edit Profil**: sebuah form yang bisa diisi, divalidasi, lalu hasilnya langsung tampil di kartu profilmu.

**Setelah menyelesaikan modul ini, kamu mampu:**

1. Membuat input teks dengan `TextField` dan mengelola nilainya dengan `TextEditingController`.
2. Membuat berbagai jenis tombol dan memahami cara kerja `setState()`.
3. Membangun form dengan `Form` dan `TextFormField`.
4. Menulis aturan validasi (wajib diisi, panjang minimal, format email, nomor HP).
5. Menerapkan praktik form yang dipakai di industri: widget reusable, validator terpisah, perpindahan fokus keyboard, loading state, dan pengiriman data antarhalaman.

**Hasil akhir:** aplikasi yang bisa dijalankan dengan alur seperti ini:

```
┌─────────────────────┐          ┌─────────────────────┐
│ Kartu Profil Digital│          │ ← Edit Profil       │
│                     │          │                     │
│       ( 🙂 )        │          │ [👤 Nama Lengkap  ] │
│   Fakhry Firdaus    │  tekan   │ [✉️  Email         ] │
│ Mahasiswa Flutter   │ ───────► │ [📞 No. HP        ] │
│                     │  "Edit"  │ [📝 Bio           ] │
│ ✉️ fakhry@email.com  │          │                     │
│ 📞 081234567890      │ ◄─────── │ [ Simpan Perubahan ]│
│                     │  "Simpan"│                     │
│          [✏️ Edit]   │ + data   └─────────────────────┘
└─────────────────────┘  berubah
```

---

## ⏱️ Peta Waktu

### Pertemuan 1 — Fondasi Input (240 menit)

| Waktu  | Bagian   | Topik                                 |
| ------ | -------- | ------------------------------------- |
| 20 mnt | Bagian 0 | Persiapan project                     |
| 15 mnt | Bagian 1 | Peta konsep: alur kerja sebuah form   |
| 50 mnt | Bagian 2 | `TextField` & `TextEditingController` |
| 45 mnt | Bagian 3 | Button & `setState()`                 |
| 15 mnt | —        | Istirahat ☕                          |
| 60 mnt | Bagian 4 | `Form` & `TextFormField`              |
| 35 mnt | —        | Challenge Pertemuan 1 & review        |

### Pertemuan 2 — Validasi & Praktik Industri (240 menit)

| Waktu  | Bagian   | Topik                                          |
| ------ | -------- | ---------------------------------------------- |
| 55 mnt | Bagian 5 | Validasi input                                 |
| 55 mnt | Bagian 6 | Form yang nyaman dipakai (UX standar industri) |
| 15 mnt | —        | Istirahat ☕                                   |
| 40 mnt | Bagian 7 | Mengirim data kembali ke halaman profil        |
| 20 mnt | Bagian 8 | Finalisasi & skenario uji                      |
| 55 mnt | —        | Challenge Akhir & presentasi singkat           |

---

## 📦 Prasyarat

- Project **Kartu Profil Digital** dari modul sebelumnya (atau buat project baru dengan Bagian 0).
- Flutter SDK, VS Code, dan emulator/Chrome sudah siap.
- Paham `StatelessWidget`, `StatefulWidget`, `Column`, `Row`, `Card`, dan `ListView`.

> 💡 **Tip:** Selama praktikum, gunakan **Hot Reload** (`r`) untuk perubahan tampilan, dan **Hot Restart** (`R`) setiap kali kamu mengubah isi `initState()` atau menambah file baru.

---

# PERTEMUAN 1

---

## Bagian 0 — Persiapan Project (20 menit)

Kita akan merapikan project dengan struktur folder seperti yang dipakai di aplikasi sungguhan.

**Struktur folder yang akan kamu buat:**

```
lib/
├── main.dart
├── models/
│   └── profile_data.dart
├── pages/
│   ├── profile_page.dart
│   └── edit_profile_page.dart      ← dibuat di Bagian 2
├── utils/
│   └── validators.dart             ← dibuat di Bagian 5
└── widgets/
    └── app_text_field.dart         ← dibuat di Bagian 6
```

> 💡 **Kenapa dipisah?** Satu file berisi semuanya memang cepat di awal, tapi cepat sekali jadi berantakan. Memisahkan _model_, _halaman_, _widget_, dan _utilitas_ membuat kodemu mudah dicari, dites, dan dipakai ulang.

### Langkah 0.1 — Buat folder & file

Di VS Code, buat folder `models`, `pages`, `utils`, `widgets` di dalam `lib/`.

### Langkah 0.2 — Model data profil

Buat `lib/models/profile_data.dart`:

```dart
class ProfileData {
  const ProfileData({
    required this.name,
    required this.email,
    required this.phone,
    required this.bio,
  });

  final String name;
  final String email;
  final String phone;
  final String bio;

  /// Membuat salinan baru dengan sebagian data diganti.
  ProfileData copyWith({
    String? name,
    String? email,
    String? phone,
    String? bio,
  }) {
    return ProfileData(
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      bio: bio ?? this.bio,
    );
  }
}
```

> 📝 Semua field `final` (tidak bisa diubah). Kalau ada data baru, kita buat **objek baru** lewat `copyWith`. Pola ini disebut **immutable model** dan akan sangat membantu saat kamu belajar state management nanti.

### Langkah 0.3 — Halaman profil (kode awal)

Buat `lib/pages/profile_page.dart`:

```dart
import 'package:flutter/material.dart';

import '../models/profile_data.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  ProfileData _profile = const ProfileData(
    name: 'Fakhry Firdaus',
    email: 'fakhry@email.com',
    phone: '081234567890',
    bio: 'Mahasiswa yang sedang belajar Flutter',
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Kartu Profil Digital')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const SizedBox(height: 8),
          const Center(
            child: CircleAvatar(
              radius: 56,
              backgroundImage: NetworkImage(
                'https://picsum.photos/seed/profile/300/300',
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            _profile.name,
            textAlign: TextAlign.center,
            style: Theme.of(context)
                .textTheme
                .headlineSmall
                ?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 4),
          Text(_profile.bio, textAlign: TextAlign.center),
          const SizedBox(height: 24),
          Card(
            child: ListTile(
              leading: const Icon(Icons.email_outlined),
              title: const Text('Email'),
              subtitle: Text(_profile.email),
            ),
          ),
          Card(
            child: ListTile(
              leading: const Icon(Icons.phone_outlined),
              title: const Text('No. HP'),
              subtitle: Text(_profile.phone),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // Akan dihubungkan ke halaman Edit Profil di Bagian 2
        },
        icon: const Icon(Icons.edit),
        label: const Text('Edit Profil'),
      ),
    );
  }
}
```

> 📝 Perhatikan: data profil disimpan di variabel state `_profile` (bukan `final`), supaya nanti bisa diganti dengan data baru dari form.

### Langkah 0.4 — `main.dart`

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
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: const ProfilePage(),
    );
  }
}
```

> ⚠️ **Gambar tidak muncul di Chrome?** Gunakan `picsum.photos` seperti di atas. Beberapa layanan avatar lain sering gagal di web karena kebijakan CORS.

### ✅ Checkpoint 0

Jalankan `flutter run`. Kamu harus melihat kartu profil dengan foto, nama, bio, email, dan nomor HP, plus tombol **Edit Profil** (belum berfungsi).

---

## Bagian 1 — Peta Konsep: Alur Kerja Sebuah Form (15 menit)

**Analogi:** bayangkan kamu mengisi **formulir pendaftaran di loket**. Kamu menulis datamu, petugas memeriksa kelengkapannya, lalu kalau benar, formulir diterima. Kalau salah, petugas mengembalikan dengan catatan: _"Nomor HP kurang satu digit."_

Form di aplikasi bekerja sama persis:

```
  ① INPUT          ② SIMPAN          ③ VALIDASI         ④ SUBMIT
 Pengguna    ──►   Nilai ditampung ──► Periksa aturan ──► Kirim / simpan
 mengetik          (controller/state)  (validator)         data valid
                                          │
                                          └── salah? tampilkan pesan error
```

**Siapa mengerjakan apa?**

| Widget / Konsep         | Perannya                                                                  |
| ----------------------- | ------------------------------------------------------------------------- |
| `TextField`             | Kotak input teks paling dasar                                             |
| `TextEditingController` | "Penampung" isi teks; bisa dibaca & diubah lewat kode                     |
| `TextFormField`         | `TextField` + kemampuan **validasi** + terhubung ke `Form`                |
| `Form`                  | "Petugas loket": mengelompokkan banyak field dan memvalidasinya sekaligus |
| `GlobalKey<FormState>`  | "Remote control" untuk memerintah `Form` (validate, reset)                |
| Button                  | Pemicu aksi (mis. Simpan)                                                 |
| `setState()`            | Memberi tahu Flutter: _"data berubah, gambar ulang tampilan!"_            |
| `validator`             | Fungsi pemeriksa. `null` = valid, `String` = pesan error                  |

---

## Bagian 2 — `TextField` & `TextEditingController` (50 menit)

### 2.1 Anatomi `TextField`

```dart
TextField(
  controller: _nameController,          // penampung isi teks
  keyboardType: TextInputType.name,     // jenis keyboard
  textInputAction: TextInputAction.next,// tombol aksi di keyboard
  decoration: const InputDecoration(    // tampilan kotak input
    labelText: 'Nama Lengkap',
    hintText: 'Contoh: Fakhry Firdaus',
    prefixIcon: Icon(Icons.person_outline),
    border: OutlineInputBorder(),
  ),
  onChanged: (value) { /* dipanggil setiap isi berubah */ },
)
```

**Properti penting `InputDecoration`:**

| Properti                    | Fungsi                                                                         |
| --------------------------- | ------------------------------------------------------------------------------ |
| `labelText`                 | Judul field (naik ke atas saat fokus)                                          |
| `hintText`                  | Contoh isian (hilang saat mengetik)                                            |
| `prefixIcon` / `suffixIcon` | Ikon di kiri / kanan                                                           |
| `border`                    | `OutlineInputBorder()` untuk kotak, `UnderlineInputBorder()` untuk garis bawah |
| `errorText`                 | Pesan error manual                                                             |

**Jenis keyboard yang umum (`keyboardType`):**

| Nilai                        | Dipakai untuk                 |
| ---------------------------- | ----------------------------- |
| `TextInputType.text`         | Teks umum                     |
| `TextInputType.emailAddress` | Email (ada tombol `@`)        |
| `TextInputType.phone`        | Nomor telepon                 |
| `TextInputType.number`       | Angka                         |
| `TextInputType.multiline`    | Teks panjang / beberapa baris |

### 2.2 Dua cara membaca isi input

| Cara                       | Kapan dipakai                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `onChanged: (value) {...}` | Saat kamu perlu bereaksi **setiap kali** pengguna mengetik (mis. pencarian, counter)  |
| `TextEditingController`    | Saat kamu perlu membaca/mengubah isi **kapan saja** (mis. saat tombol Simpan ditekan) |

### 2.3 Wajib tahu: `dispose()`

`TextEditingController` memakai memori. Kalau halaman ditutup tetapi controller tidak dibuang, memori bocor (_memory leak_).

> ⚠️ **Aturan emas:** setiap controller yang kamu buat di `State`, **wajib** dibuang di `dispose()`.

### 2.4 Praktik: Halaman Edit Profil versi 1

Buat `lib/pages/edit_profile_page.dart`:

```dart
import 'package:flutter/material.dart';

class EditProfilePage extends StatefulWidget {
  const EditProfilePage({super.key});

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final _nameController = TextEditingController();
  final _bioController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _bioController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Edit Profil')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Nama Lengkap',
                hintText: 'Contoh: Fakhry Firdaus',
                prefixIcon: Icon(Icons.person_outline),
                border: OutlineInputBorder(),
              ),
              onChanged: (value) => debugPrint('Nama: $value'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _bioController,
              maxLines: 3,
              decoration: const InputDecoration(
                labelText: 'Bio',
                prefixIcon: Icon(Icons.notes_outlined),
                border: OutlineInputBorder(),
              ),
              onChanged: (value) => debugPrint('Bio: $value'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### 2.5 Hubungkan tombol "Edit Profil"

Di `profile_page.dart`, tambahkan import dan isi `onPressed`:

```dart
import 'edit_profile_page.dart';
```

```dart
floatingActionButton: FloatingActionButton.extended(
  onPressed: () {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const EditProfilePage()),
    );
  },
  icon: const Icon(Icons.edit),
  label: const Text('Edit Profil'),
),
```

> 📝 **Navigasi sekilas:** `Navigator.push` membuka halaman baru di atas halaman sekarang (seperti menumpuk kartu). Tombol _Back_ di AppBar otomatis memanggil `pop` untuk menutupnya. Navigasi akan dibahas lengkap di modul berikutnya; untuk sekarang, cukup pakai polanya.

### ✅ Checkpoint 2

- Tombol **Edit Profil** membuka halaman baru.
- Saat kamu mengetik, **Debug Console** di VS Code menampilkan `Nama: ...` dan `Bio: ...` setiap huruf.

### ⚠️ Kesalahan umum di bagian ini

| Gejala                                                  | Penyebab & solusi                                                            |
| ------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Error _"InputDecorator cannot have an unbounded width"_ | `TextField` ada di dalam `Row` tanpa batas lebar. Bungkus dengan `Expanded`. |
| Warning controller tidak dibuang                        | Lupa `dispose()`.                                                            |
| Perubahan di `initState` tidak terlihat                 | Pakai **Hot Restart**, bukan Hot Reload.                                     |

---

## Bagian 3 — Button & `setState()` (45 menit)

### 3.1 Jenis tombol di Material 3

| Widget           | Kapan dipakai                        |
| ---------------- | ------------------------------------ |
| `FilledButton`   | Aksi **utama** halaman (mis. Simpan) |
| `ElevatedButton` | Aksi penting dengan efek bayangan    |
| `OutlinedButton` | Aksi **sekunder** (mis. Batal)       |
| `TextButton`     | Aksi ringan (mis. Lupa password?)    |
| `IconButton`     | Aksi berupa ikon saja                |

Semua tombol punya properti `onPressed`.

> 💡 **Trik penting:** jika `onPressed` diisi `null`, tombol otomatis menjadi **nonaktif** (abu-abu dan tidak bisa ditekan). Inilah cara standar untuk menonaktifkan tombol.

### 3.2 Memahami `setState()`

Flutter itu **deklaratif**: tampilan adalah hasil dari data. Saat data berubah, kamu harus memberi tahu Flutter supaya `build()` dijalankan ulang.

```dart
setState(() {
  _preview = 'Halo!';   // ① ubah data di dalam sini
});                     // ② Flutter menjalankan build() ulang otomatis
```

**Aturan `setState()`:**

| ✅ Lakukan                                                                      | ❌ Hindari                                                                        |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Ubah variabel _di dalam_ callback `setState`                                    | Memanggil `setState` di dalam `build()` (loop tak berujung)                       |
| Panggil `setState` hanya saat tampilan perlu berubah                            | `setState(() async { ... })` (callback tidak boleh `async`)                       |
| Lakukan pekerjaan berat/async **di luar**, lalu `setState` untuk hasil akhirnya | Memanggil `setState` setelah halaman ditutup (cek `mounted`, dibahas di Bagian 6) |

> 📝 Mengubah `_nameController.text` **tidak** otomatis menggambar ulang layar. Kalau tampilan bergantung pada isi input, panggil `setState` (misalnya dari `onChanged`).

### 3.3 Praktik: Preview, counter, dan tombol dinamis

Kita tambahkan tiga hal di `edit_profile_page.dart`:

1. Tombol **Tampilkan Preview** yang **nonaktif** saat nama kosong.
2. Teks hasil preview.
3. Counter jumlah karakter bio.

**Langkah 1:** tambahkan variabel dan fungsi di `_EditProfilePageState`:

```dart
String _preview = '';

void _showPreview() {
  setState(() {
    _preview = 'Halo, ${_nameController.text.trim()}! 👋';
  });
}
```

**Langkah 2:** ubah `onChanged` kedua `TextField` menjadi:

```dart
onChanged: (_) => setState(() {}),
```

> 📝 `setState(() {})` kosong itu valid: kita hanya ingin `build()` berjalan ulang agar tombol dan counter membaca isi controller terbaru.

**Langkah 3:** tambahkan widget berikut **setelah** `TextField` bio di dalam `Column`:

```dart
Align(
  alignment: Alignment.centerRight,
  child: Text('${_bioController.text.length}/100 karakter'),
),
const SizedBox(height: 16),
FilledButton.icon(
  onPressed: _nameController.text.trim().isEmpty ? null : _showPreview,
  icon: const Icon(Icons.visibility_outlined),
  label: const Text('Tampilkan Preview'),
),
const SizedBox(height: 16),
if (_preview.isNotEmpty)
  Card(
    child: Padding(
      padding: const EdgeInsets.all(16),
      child: Text(_preview),
    ),
  ),
```

### ✅ Checkpoint 3

- Tombol abu-abu saat nama kosong, aktif saat nama terisi.
- Menekan tombol memunculkan kartu `Halo, <namamu>! 👋`.
- Counter bertambah saat mengetik bio.

---

☕ **Istirahat 15 menit**

---

## Bagian 4 — `Form` & `TextFormField` (60 menit)

### 4.1 Masalah `TextField` biasa

Dengan `TextField`, kalau ada 5 field yang harus diperiksa, kamu harus menulis `if` satu per satu, mengatur `errorText` satu per satu, dan berisiko ada yang terlewat. Solusinya: **`Form` + `TextFormField`**.

|                             | `TextField`                    | `TextFormField`                          |
| --------------------------- | ------------------------------ | ---------------------------------------- |
| Punya `validator`           | ❌                             | ✅                                       |
| Bisa divalidasi oleh `Form` | ❌                             | ✅                                       |
| Cocok untuk                 | Pencarian, input tunggal, chat | Formulir (daftar, edit profil, checkout) |

> ⚠️ `TextField` biasa di dalam `Form` **tidak ikut divalidasi**. Pastikan memakai `TextFormField`.

### 4.2 Cara kerja `Form`

```dart
final _formKey = GlobalKey<FormState>();     // ① buat "remote control"

Form(
  key: _formKey,                              // ② pasang ke Form
  child: Column(children: [
    TextFormField(validator: ...),            // ③ field punya validator
    TextFormField(validator: ...),
  ]),
)

_formKey.currentState!.validate();            // ④ periksa SEMUA field sekaligus
```

**Aturan `validator`:**

- Mengembalikan **`null`** → input **valid**.
- Mengembalikan **`String`** → input **tidak valid**; String itu menjadi pesan error.

> ⚠️ **Jebakan klasik:** `return '';` (string kosong) dianggap **error**, bukan valid. Selalu gunakan `return null;` untuk valid.

**Method penting `FormState`:**

| Method       | Fungsi                                                                       |
| ------------ | ---------------------------------------------------------------------------- |
| `validate()` | Menjalankan semua validator; hasilnya `true` jika semua valid                |
| `save()`     | Memanggil `onSaved` semua field                                              |
| `reset()`    | Mengembalikan field ke nilai awal (jika memakai controller, hasilnya kosong) |

### 4.3 Praktik: Ubah ke Form

**Ganti seluruh isi** `edit_profile_page.dart` dengan kode berikut (versi 2: nama & email):

```dart
import 'package:flutter/material.dart';

class EditProfilePage extends StatefulWidget {
  const EditProfilePage({super.key});

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  void _submit() {
    if (_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Tersimpan: ${_nameController.text.trim()}')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Edit Profil')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Nama Lengkap',
                  prefixIcon: Icon(Icons.person_outline),
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Nama wajib diisi';
                  }
                  if (value.trim().length < 3) {
                    return 'Nama minimal 3 karakter';
                  }
                  return null; // valid
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  prefixIcon: Icon(Icons.email_outlined),
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Email wajib diisi';
                  }
                  if (!value.contains('@')) {
                    return 'Format email tidak valid';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: _submit,
                  child: const Text('Simpan'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

### ✅ Checkpoint 4

| Yang kamu lakukan                   | Hasil yang diharapkan                   |
| ----------------------------------- | --------------------------------------- |
| Tekan **Simpan** dengan form kosong | Muncul pesan merah di bawah kedua field |
| Isi nama `Al` lalu Simpan           | `Nama minimal 3 karakter`               |
| Isi email `fakhry` (tanpa `@`)      | `Format email tidak valid`              |
| Isi semua dengan benar              | SnackBar `Tersimpan: ...` muncul        |

### ⚠️ Kesalahan umum di bagian ini

| Gejala                                                                 | Penyebab & solusi                                                               |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `Null check operator used on a null value` di `_formKey.currentState!` | `key: _formKey` belum dipasang ke `Form`, atau dipakai di dua `Form` sekaligus. |
| Validasi tidak jalan di salah satu field                               | Field itu masih `TextField`, bukan `TextFormField`.                             |
| Semua field selalu merah                                               | `validator` mengembalikan `''` bukan `null`.                                    |

---

## 🏆 Challenge Pertemuan 1 (35 menit)

Kerjakan sesuai kemampuanmu. Mulai dari ⭐, naik bertahap jika sudah lancar!

| Level  | Tantangan                                                                                                                       | Petunjuk                                                                                                                                             |
| ------ | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| ⭐     | Tambahkan field **Jurusan** (wajib diisi, minimal 3 karakter) di form Edit Profil.                                              | Salin pola field Nama. Jangan lupa controller dan `dispose()`.                                                                                       |
| ⭐⭐   | Buat tombol **Simpan nonaktif** sampai nama (≥ 3 karakter) dan email (mengandung `@`) terisi.                                   | Pakai `setState` di `onChanged` dan `onPressed: kondisi ? _submit : null`. Hitung kondisi dari `controller.text`.                                    |
| ⭐⭐⭐ | Buat halaman terpisah berisi **field password** dengan **indikator kekuatan** (Lemah / Sedang / Kuat) yang berubah _real-time_. | Pakai `obscureText: true`. Kekuatan dihitung dari panjang, ada angka, dan ada huruf besar. Simpan hasilnya di variabel dan update dengan `setState`. |

> 🎨 **Bonus kreasi:** ubah warna tombol, bentuk border, atau ikon sesukamu. Jelajahi properti `InputDecoration` di dokumentasi!

---

# PERTEMUAN 2

---

## Bagian 5 — Validasi Input (55 menit)

### 5.1 Prinsip validasi yang baik

1. **Pesan error harus jelas**: sebutkan _apa_ yang salah dan _bagaimana_ memperbaikinya. Contoh: ❌ `Invalid` → ✅ `Nomor HP harus diawali 08 atau +62`.
2. **Jangan terlalu cerewet**: jangan tampilkan error merah saat pengguna baru mulai mengetik.
3. **Rapikan input**: gunakan `trim()` agar spasi tak sengaja tidak membuat input dianggap salah.
4. **Satu aturan = satu fungsi kecil**, lalu digabung sesuai kebutuhan (lihat 5.2).

### 5.2 Validator terpisah & bisa digabung (pola industri)

Menulis validator di dalam setiap field membuat kode panjang dan berulang. Di aplikasi nyata, validator dikumpulkan di satu tempat.

Buat `lib/utils/validators.dart`:

```dart
import 'package:flutter/material.dart';

class Validators {
  Validators._(); // mencegah class ini dibuat objeknya

  /// Wajib diisi.
  static FormFieldValidator<String> requiredField(String field) {
    return (value) {
      if (value == null || value.trim().isEmpty) {
        return '$field wajib diisi';
      }
      return null;
    };
  }

  /// Panjang minimal.
  static FormFieldValidator<String> minLength(int min, String field) {
    return (value) {
      if ((value ?? '').trim().length < min) {
        return '$field minimal $min karakter';
      }
      return null;
    };
  }

  /// Format email sederhana.
  static String? email(String? value) {
    final text = (value ?? '').trim();
    if (text.isEmpty) return 'Email wajib diisi';
    final regex = RegExp(r'^[\w.+-]+@([\w-]+\.)+[\w-]{2,}$');
    if (!regex.hasMatch(text)) return 'Format email tidak valid';
    return null;
  }

  /// Nomor HP Indonesia: 08xx..., 628xx..., atau +628xx...
  static String? phone(String? value) {
    final text = (value ?? '').trim();
    if (text.isEmpty) return 'Nomor HP wajib diisi';
    final regex = RegExp(r'^(\+62|62|0)8[1-9][0-9]{7,10}$');
    if (!regex.hasMatch(text)) {
      return 'Nomor HP tidak valid (contoh: 081234567890)';
    }
    return null;
  }

  /// Nilai harus sama dengan field lain (mis. konfirmasi password).
  static FormFieldValidator<String> matches(
    String Function() other,
    String message,
  ) {
    return (value) => value == other() ? null : message;
  }

  /// Menggabungkan beberapa validator; berhenti di error pertama.
  static FormFieldValidator<String> compose(
    List<FormFieldValidator<String>> validators,
  ) {
    return (value) {
      for (final validator in validators) {
        final error = validator(value);
        if (error != null) return error;
      }
      return null;
    };
  }
}
```

**Cara memakainya:**

```dart
validator: Validators.compose([
  Validators.requiredField('Nama'),
  Validators.minLength(3, 'Nama'),
]),
```

```dart
validator: Validators.email,
```

> 💡 **Insight:** pola `compose` membuat aturan mudah disusun seperti Lego. Kamu bisa menambah aturan baru tanpa mengubah field lain.

> 📝 **Regex** (`RegExp`) adalah pola pencocokan teks. Kamu tidak perlu menghafalnya: pahami fungsinya dan uji polanya sebelum dipakai.

### 5.3 Kapan error ditampilkan? `autovalidateMode`

| Mode                | Perilaku                                   | Catatan                                          |
| ------------------- | ------------------------------------------ | ------------------------------------------------ |
| `disabled`          | Validasi hanya saat `validate()` dipanggil | Default                                          |
| `always`            | Validasi terus-menerus sejak form tampil   | ❌ Mengganggu: form sudah merah sebelum disentuh |
| `onUserInteraction` | Validasi setelah pengguna menyentuh field  | ✅ Nyaman dipakai                                |

> 💡 **Pola yang disukai pengguna:** biarkan form bersih di awal. Saat pengguna menekan Simpan dan ada error, ubah mode ke `onUserInteraction` agar error **hilang sendiri** begitu ia memperbaiki isiannya.

### 5.4 Praktik: Validator + field baru

Semua perubahan di bagian ini dilakukan di file `lib/pages/edit_profile_page.dart`. Ikuti urutannya, dan perhatikan **letak** setiap potongan kode.

**① Tambahkan import** di baris paling atas file, di bawah `import 'package:flutter/material.dart';`:

```dart
import 'package:flutter/material.dart';
import '../utils/validators.dart'; // ← baris baru
```

**② Tambahkan controller Telepon dan Bio** di dalam `_EditProfilePageState`, tepat **di bawah** controller yang sudah ada (`_nameController` dan `_emailController`):

```dart
class _EditProfilePageState extends State<EditProfilePage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController(); // ← baru
  final _bioController = TextEditingController();   // ← baru
```

**③ Buang controller baru di `dispose()`.** Tambahkan dua baris sebelum `super.dispose();`:

```dart
@override
void dispose() {
  _nameController.dispose();
  _emailController.dispose();
  _phoneController.dispose(); // ← baru
  _bioController.dispose();   // ← baru
  super.dispose();
}
```

**④ Tambahkan state mode validasi** di bawah deklarasi controller (masih di dalam `_EditProfilePageState`, sebelum `dispose()`):

```dart
AutovalidateMode _autoValidate = AutovalidateMode.disabled;
```

**⑤ Ubah method `_submit`.** **Ganti seluruh** method `_submit` yang lama dengan ini:

```dart
void _submit() {
  if (!_formKey.currentState!.validate()) {
    // Ada yang salah: mulai pantau perubahan agar error hilang saat diperbaiki
    setState(() => _autoValidate = AutovalidateMode.onUserInteraction);
    return;
  }
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text('Tersimpan: ${_nameController.text.trim()}')),
  );
}
```

**⑥ Pasang pada `Form`.** Di dalam method `build`, cari widget `Form` lalu tambahkan satu baris `autovalidateMode`:

```dart
child: Form(
  key: _formKey,
  autovalidateMode: _autoValidate, // ← baru
  child: Column(
    children: [
      ...
```

**⑦ Ganti validator Nama dan Email.** Cari `TextFormField` Nama dan Email. **Hapus** blok `validator: (value) { ... }` yang lama pada masing-masing field, lalu ganti dengan:

```dart
// Pada TextFormField Nama:
validator: Validators.compose([
  Validators.requiredField('Nama'),
  Validators.minLength(3, 'Nama'),
]),

// Pada TextFormField Email:
validator: Validators.email,
```

**⑧ Tambahkan field Telepon dan Bio.** Letakkan **setelah** `TextFormField` Email dan **sebelum** `const SizedBox(height: 24)` (yang berada di atas tombol Simpan):

```dart
              TextFormField(
                controller: _emailController,
                // ... field Email (sudah ada)
              ),
              const SizedBox(height: 16),
              // ↓↓↓ tambahkan mulai dari sini ↓↓↓
              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: 'No. HP',
                  prefixIcon: Icon(Icons.phone_outlined),
                  border: OutlineInputBorder(),
                ),
                validator: Validators.phone,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _bioController,
                maxLines: 3,
                maxLength: 100,
                decoration: const InputDecoration(
                  labelText: 'Bio (opsional)',
                  prefixIcon: Icon(Icons.notes_outlined),
                  border: OutlineInputBorder(),
                ),
              ),
              // ↑↑↑ sampai di sini ↑↑↑
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: _submit,
                  child: const Text('Simpan'),
                ),
              ),
```

> 📝 Field Bio tidak punya `validator` karena sifatnya opsional: boleh kosong. `maxLength: 100` sudah otomatis membatasi input dan menampilkan counter.

> ⚠️ Setelah ini form belum terisi data awal dan belum mengirim hasil ke halaman profil. Itu dikerjakan di Bagian 7.

### 5.5 Contoh: konfirmasi password

Dipakai di challenge nanti. Perhatikan `() => _passwordController.text`: nilainya dibaca **saat validasi berjalan**, jadi selalu terbaru.

```dart
TextFormField(
  controller: _confirmController,
  obscureText: true,
  decoration: const InputDecoration(labelText: 'Konfirmasi Password'),
  validator: Validators.matches(
    () => _passwordController.text,
    'Konfirmasi password tidak sama',
  ),
),
```

### 5.6 ⚠️ Validasi di aplikasi ≠ keamanan

> Validasi di Flutter hanya untuk **kenyamanan pengguna** (memberi tahu kesalahan lebih cepat). Orang jahat bisa mengirim data langsung ke server tanpa melewati aplikasimu. Karena itu, **server harus memvalidasi ulang** semua data. Di aplikasi nyata, error dari server juga harus ditampilkan dengan rapi ke pengguna (lihat challenge ⭐⭐⭐).

### ✅ Checkpoint 5

| Input                                   | Hasil                                                    |
| --------------------------------------- | -------------------------------------------------------- |
| Nama kosong                             | `Nama wajib diisi`                                       |
| Email `fakhry@`                         | `Format email tidak valid`                               |
| Email `fakhry@email.com`                | Valid                                                    |
| HP `12345`                              | `Nomor HP tidak valid (contoh: 081234567890)`            |
| HP `081234567890` atau `+6281234567890` | Valid                                                    |
| Setelah error muncul, perbaiki isian    | Pesan error hilang **sendiri** tanpa menekan Simpan lagi |

---

## Bagian 6 — Form yang Nyaman Dipakai: Praktik Standar Industri (55 menit)

Form yang "bisa jalan" belum tentu form yang **enak dipakai**. Berikut praktik yang dipakai tim profesional.

### 6.1 Daftar praktik

| #   | Praktik                                           | Alasan                                                                                                    |
| --- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1   | **Widget field reusable** (`AppTextField`)        | Satu perubahan desain, semua form ikut berubah. Kode tidak berulang.                                      |
| 2   | **`textInputAction` + `FocusNode`**               | Tombol _Next_ di keyboard memindahkan fokus ke field berikutnya, seperti aplikasi profesional.            |
| 3   | **`keyboardType` yang tepat**                     | Email dapat tombol `@`, telepon dapat keypad angka.                                                       |
| 4   | **`inputFormatters`**                             | Mencegah input yang pasti salah (mis. huruf di kolom telepon).                                            |
| 5   | **`autofillHints`**                               | Memungkinkan HP mengisi otomatis nama/email.                                                              |
| 6   | **Form bisa di-scroll** (`SingleChildScrollView`) | Mencegah error _"BOTTOM OVERFLOWED"_ saat keyboard muncul.                                                |
| 7   | **Tutup keyboard** saat tap area kosong / scroll  | Pengguna tidak "terkunci" oleh keyboard.                                                                  |
| 8   | **Loading state & cegah double submit**           | Tombol nonaktif + indikator saat memproses, supaya data tidak terkirim dua kali.                          |
| 9   | **Cek `mounted` setelah `await`**                 | Halaman bisa saja sudah ditutup saat proses selesai; memakai `context` setelahnya bisa menimbulkan error. |
| 10  | **Jangan `debugPrint` data sensitif**             | Password tidak boleh pernah masuk ke log.                                                                 |

> 💡 **Catatan:** untuk form yang sangat besar/kompleks, tim industri sering memakai package seperti `flutter_form_builder` atau mengelola state form lewat state management (Provider, Riverpod, BLoC). Fondasi yang kamu pelajari di sini adalah dasar dari semuanya.

### 6.2 Praktik: Buat `AppTextField` yang reusable

Buat `lib/widgets/app_text_field.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class AppTextField extends StatefulWidget {
  const AppTextField({
    super.key,
    required this.controller,
    required this.label,
    this.hint,
    this.icon,
    this.validator,
    this.keyboardType,
    this.textInputAction,
    this.textCapitalization = TextCapitalization.none,
    this.focusNode,
    this.onFieldSubmitted,
    this.inputFormatters,
    this.autofillHints,
    this.isPassword = false,
    this.maxLines = 1,
    this.maxLength,
  });

  final TextEditingController controller;
  final String label;
  final String? hint;
  final IconData? icon;
  final FormFieldValidator<String>? validator;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final TextCapitalization textCapitalization;
  final FocusNode? focusNode;
  final ValueChanged<String>? onFieldSubmitted;
  final List<TextInputFormatter>? inputFormatters;
  final Iterable<String>? autofillHints;
  final bool isPassword;
  final int maxLines;
  final int? maxLength;

  @override
  State<AppTextField> createState() => _AppTextFieldState();
}

class _AppTextFieldState extends State<AppTextField> {
  bool _obscure = true; // khusus field password

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: TextFormField(
        controller: widget.controller,
        focusNode: widget.focusNode,
        validator: widget.validator,
        keyboardType: widget.keyboardType,
        textInputAction: widget.textInputAction,
        textCapitalization: widget.textCapitalization,
        onFieldSubmitted: widget.onFieldSubmitted,
        inputFormatters: widget.inputFormatters,
        autofillHints: widget.autofillHints,
        obscureText: widget.isPassword && _obscure,
        maxLines: widget.isPassword ? 1 : widget.maxLines,
        maxLength: widget.maxLength,
        decoration: InputDecoration(
          labelText: widget.label,
          hintText: widget.hint,
          prefixIcon: widget.icon == null ? null : Icon(widget.icon),
          suffixIcon: widget.isPassword
              ? IconButton(
                  icon: Icon(
                    _obscure
                        ? Icons.visibility_off_outlined
                        : Icons.visibility_outlined,
                  ),
                  onPressed: () => setState(() => _obscure = !_obscure),
                )
              : null,
          border: const OutlineInputBorder(),
        ),
      ),
    );
  }
}
```

> 📝 Perhatikan: `AppTextField` memakai `setState` sendiri untuk tombol "mata" password. State kecil seperti ini sebaiknya disimpan **di widget yang memerlukannya** saja.

### 6.3 Pindah fokus dengan tombol _Next_

```dart
final _emailFocus = FocusNode();
final _phoneFocus = FocusNode();
final _bioFocus = FocusNode();
```

Pasang pada field:

```dart
AppTextField(
  controller: _nameController,
  textInputAction: TextInputAction.next,
  onFieldSubmitted: (_) => _emailFocus.requestFocus(),
  ...
),
AppTextField(
  controller: _emailController,
  focusNode: _emailFocus,
  ...
),
```

> ⚠️ `FocusNode` juga wajib di-`dispose()`, sama seperti controller.

### 6.4 Loading state & cegah double submit

```dart
bool _isLoading = false;

Future<void> _submit() async {
  FocusScope.of(context).unfocus();                 // tutup keyboard
  if (!_formKey.currentState!.validate()) {
    setState(() => _autoValidate = AutovalidateMode.onUserInteraction);
    return;
  }

  setState(() => _isLoading = true);                // ① tombol nonaktif
  await Future.delayed(const Duration(seconds: 1)); // ② simulasi kirim ke server
  if (!mounted) return;                             // ③ halaman masih ada?
  setState(() => _isLoading = false);
  // ... lanjut: kirim data (Bagian 7)
}
```

Dan tombolnya:

```dart
FilledButton.icon(
  onPressed: _isLoading ? null : _submit,
  icon: _isLoading
      ? const SizedBox(
          width: 18,
          height: 18,
          child: CircularProgressIndicator(strokeWidth: 2),
        )
      : const Icon(Icons.save_outlined),
  label: Text(_isLoading ? 'Menyimpan...' : 'Simpan Perubahan'),
)
```

> 📝 `Future.delayed` kita pakai untuk **meniru** proses jaringan. Di aplikasi nyata, di sinilah pemanggilan API berada (dibahas di modul networking).

### ✅ Checkpoint 6

Kita rakit semuanya di Bagian 8. Untuk saat ini pastikan:

- File `app_text_field.dart` tidak ada error merah.
- Kamu paham fungsi setiap praktik di tabel 6.1.

---

☕ **Istirahat 15 menit**

---

## Bagian 7 — Mengirim Data Kembali ke Halaman Profil (40 menit)

Sekarang form harus benar-benar **mengubah** kartu profil.

**Alurnya:**

```
ProfilePage ──push(data lama)──► EditProfilePage
ProfilePage ◄──pop(data baru)─── EditProfilePage
   │
   └── setState(() => _profile = dataBaru)  → kartu berubah!
```

### 7.1 Kirim data lama ke form (supaya form terisi)

Di `edit_profile_page.dart`, tambahkan parameter:

```dart
class EditProfilePage extends StatefulWidget {
  const EditProfilePage({super.key, required this.initialData});

  final ProfileData initialData;
  ...
```

Controller diisi di `initState()`:

```dart
late final TextEditingController _nameController;

@override
void initState() {
  super.initState();
  _nameController = TextEditingController(text: widget.initialData.name);
  // ...lakukan hal yang sama untuk email, phone, dan bio
}
```

> 📝 `late final` artinya: variabel pasti diisi, tetapi nanti (di `initState`), bukan saat deklarasi, karena kita butuh `widget.initialData` yang belum tersedia di awal.

### 7.2 Kirim data baru kembali

Di akhir `_submit()` pada `EditProfilePage`:

```dart
final result = widget.initialData.copyWith(
  name: _nameController.text.trim(),
  email: _emailController.text.trim(),
  phone: _phoneController.text.trim(),
  bio: _bioController.text.trim(),
);
Navigator.pop(context, result); // kirim hasil ke halaman sebelumnya
```

### 7.3 Terima hasilnya di `ProfilePage`

Tambahkan method berikut di `_ProfilePageState`, lalu panggil dari `onPressed` tombol Edit:

```dart
Future<void> _openEditPage() async {
  final result = await Navigator.push<ProfileData>(
    context,
    MaterialPageRoute(
      builder: (_) => EditProfilePage(initialData: _profile),
    ),
  );

  if (!mounted || result == null) return; // null = pengguna menekan Back

  setState(() => _profile = result);
  ScaffoldMessenger.of(context).showSnackBar(
    const SnackBar(content: Text('Profil berhasil diperbarui ✅')),
  );
}
```

```dart
floatingActionButton: FloatingActionButton.extended(
  onPressed: _openEditPage,
  ...
```

> 💡 **Insight:** kita mengirim **objek model** (`ProfileData`), bukan controller atau widget. Antarhalaman cukup bertukar data murni. Inilah alasan model dibuat terpisah sejak Bagian 0.

---

## Bagian 8 — Finalisasi & Skenario Uji (20 menit)

### 8.1 Kode final `edit_profile_page.dart`

Ganti seluruh isi file dengan kode lengkap berikut. Bandingkan dengan hasil kerjamu: kalau ada perbedaan, cari tahu sebabnya!

```dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../models/profile_data.dart';
import '../utils/validators.dart';
import '../widgets/app_text_field.dart';

class EditProfilePage extends StatefulWidget {
  const EditProfilePage({super.key, required this.initialData});

  final ProfileData initialData;

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController _nameController;
  late final TextEditingController _emailController;
  late final TextEditingController _phoneController;
  late final TextEditingController _bioController;

  final _emailFocus = FocusNode();
  final _phoneFocus = FocusNode();
  final _bioFocus = FocusNode();

  bool _isLoading = false;
  AutovalidateMode _autoValidate = AutovalidateMode.disabled;

  @override
  void initState() {
    super.initState();
    final data = widget.initialData;
    _nameController = TextEditingController(text: data.name);
    _emailController = TextEditingController(text: data.email);
    _phoneController = TextEditingController(text: data.phone);
    _bioController = TextEditingController(text: data.bio);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _bioController.dispose();
    _emailFocus.dispose();
    _phoneFocus.dispose();
    _bioFocus.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    FocusScope.of(context).unfocus();

    if (!_formKey.currentState!.validate()) {
      setState(() => _autoValidate = AutovalidateMode.onUserInteraction);
      return;
    }

    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 1)); // simulasi server
    if (!mounted) return;
    setState(() => _isLoading = false);

    final result = widget.initialData.copyWith(
      name: _nameController.text.trim(),
      email: _emailController.text.trim(),
      phone: _phoneController.text.trim(),
      bio: _bioController.text.trim(),
    );
    Navigator.pop(context, result);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Edit Profil')),
      body: GestureDetector(
        behavior: HitTestBehavior.translucent,
        onTap: () => FocusScope.of(context).unfocus(),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
            child: Form(
              key: _formKey,
              autovalidateMode: _autoValidate,
              child: Column(
                children: [
                  AppTextField(
                    controller: _nameController,
                    label: 'Nama Lengkap',
                    hint: 'Contoh: Fakhry Firdaus',
                    icon: Icons.person_outline,
                    textInputAction: TextInputAction.next,
                    textCapitalization: TextCapitalization.words,
                    autofillHints: const [AutofillHints.name],
                    validator: Validators.compose([
                      Validators.requiredField('Nama'),
                      Validators.minLength(3, 'Nama'),
                    ]),
                    onFieldSubmitted: (_) => _emailFocus.requestFocus(),
                  ),
                  AppTextField(
                    controller: _emailController,
                    focusNode: _emailFocus,
                    label: 'Email',
                    hint: 'nama@email.com',
                    icon: Icons.email_outlined,
                    keyboardType: TextInputType.emailAddress,
                    textInputAction: TextInputAction.next,
                    autofillHints: const [AutofillHints.email],
                    validator: Validators.email,
                    onFieldSubmitted: (_) => _phoneFocus.requestFocus(),
                  ),
                  AppTextField(
                    controller: _phoneController,
                    focusNode: _phoneFocus,
                    label: 'No. HP',
                    hint: '081234567890',
                    icon: Icons.phone_outlined,
                    keyboardType: TextInputType.phone,
                    textInputAction: TextInputAction.next,
                    inputFormatters: [
                      FilteringTextInputFormatter.allow(RegExp(r'[0-9+]')),
                      LengthLimitingTextInputFormatter(15),
                    ],
                    validator: Validators.phone,
                    onFieldSubmitted: (_) => _bioFocus.requestFocus(),
                  ),
                  AppTextField(
                    controller: _bioController,
                    focusNode: _bioFocus,
                    label: 'Bio (opsional)',
                    icon: Icons.notes_outlined,
                    keyboardType: TextInputType.multiline,
                    maxLines: 3,
                    maxLength: 100,
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton.icon(
                      onPressed: _isLoading ? null : _submit,
                      icon: _isLoading
                          ? const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Icon(Icons.save_outlined),
                      label: Text(
                        _isLoading ? 'Menyimpan...' : 'Simpan Perubahan',
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
```

### 8.2 Kode final `profile_page.dart` (bagian yang berubah)

Pastikan ada **import** dan method `_openEditPage` berikut:

```dart
import 'edit_profile_page.dart';
```

```dart
Future<void> _openEditPage() async {
  final result = await Navigator.push<ProfileData>(
    context,
    MaterialPageRoute(
      builder: (_) => EditProfilePage(initialData: _profile),
    ),
  );

  if (!mounted || result == null) return;

  setState(() => _profile = result);
  ScaffoldMessenger.of(context).showSnackBar(
    const SnackBar(content: Text('Profil berhasil diperbarui ✅')),
  );
}
```

dan `onPressed: _openEditPage` pada `FloatingActionButton.extended`.

### 8.3 Skenario uji

Jalankan `flutter run`, lalu uji satu per satu. Centang jika hasilnya sesuai.

| ✔   | Skenario                          | Hasil yang diharapkan                            |
| --- | --------------------------------- | ------------------------------------------------ |
| ☐   | Buka Edit Profil                  | Form terisi data profil saat ini                 |
| ☐   | Kosongkan Nama → Simpan           | `Nama wajib diisi`                               |
| ☐   | Nama `Al` → Simpan                | `Nama minimal 3 karakter`                        |
| ☐   | Email `fakhry@` → Simpan          | `Format email tidak valid`                       |
| ☐   | HP `12345` → Simpan               | Pesan nomor HP tidak valid                       |
| ☐   | Ketik huruf di kolom HP           | Huruf tidak bisa masuk                           |
| ☐   | Perbaiki field yang error         | Pesan error hilang sendiri                       |
| ☐   | Tekan _Next_ di keyboard          | Fokus pindah ke field berikutnya                 |
| ☐   | Ketik bio lebih dari 100 karakter | Terhenti di 100, counter terlihat                |
| ☐   | Semua valid → Simpan              | Tombol berubah jadi `Menyimpan...` 1 detik       |
| ☐   | Tekan Simpan berkali-kali cepat   | Hanya diproses satu kali                         |
| ☐   | Setelah menyimpan                 | Kembali ke profil, data berubah, SnackBar muncul |
| ☐   | Tekan Back tanpa menyimpan        | Data profil tidak berubah                        |
| ☐   | Keyboard muncul                   | Tidak ada error _overflow_, form bisa di-scroll  |

### 🎉 Kriteria selesai

- [ ] Aplikasi berjalan tanpa error merah
- [ ] Semua skenario uji lolos
- [ ] Semua `TextEditingController` dan `FocusNode` di-`dispose()`
- [ ] Kamu bisa menjelaskan **perbedaan `TextField` vs `TextFormField`** dengan kata-katamu sendiri

---

## 🏆 Challenge Akhir (55 menit)

| Level  | Tantangan                                                                                                                                                                                                                                                                                         | Petunjuk                                                                                                                                                                                                                                                    |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ⭐     | Tambahkan field **Website / LinkedIn** (opsional). Jika diisi, harus berupa URL valid (diawali `http://` atau `https://`).                                                                                                                                                                        | Buat `Validators.url` yang mengembalikan `null` jika kosong. Gunakan `Uri.tryParse(value)` dan cek `hasScheme`.                                                                                                                                             |
| ⭐⭐   | Buat halaman **Ganti Password**: password lama, baru, dan konfirmasi. Aturan: minimal 8 karakter, mengandung huruf **dan** angka, konfirmasi harus sama. Ada tombol "mata" untuk melihat password.                                                                                                | Pakai `AppTextField(isPassword: true)`, `Validators.compose`, dan `Validators.matches`. Tambahkan tombol menuju halaman ini dari `ProfilePage`.                                                                                                             |
| ⭐⭐⭐ | **Pilih salah satu:** <br>**(A) Tanggal Lahir**: field read-only yang membuka `showDatePicker`; validasi umur minimal 17 tahun. <br>**(B) Error dari server**: simulasikan bahwa email `admin@email.com` sudah dipakai. Setelah "server" menolak, tampilkan pesan error **di bawah field email**. | (A) Gunakan `readOnly: true` dan `onTap`. Isi controller dengan tanggal terpilih. <br>(B) Simpan `String? _serverError`; validator email mengembalikannya bila tidak `null`; panggil `validate()` lagi dan kosongkan `_serverError` saat pengguna mengetik. |

> 🎨 **Bonus kreasi:** tambahkan **Dropdown Jurusan** dengan `DropdownButtonFormField`. _Catatan:_ pada Flutter versi terbaru parameter nilai awalnya bernama `initialValue`; pada versi lama bernama `value`. Ikuti pesan dari editor jika muncul peringatan _deprecated_.

> 🎤 **Presentasi singkat:** di akhir sesi, tunjukkan hasilmu dan jelaskan **satu hal baru** yang kamu pelajari serta **satu kesalahan** yang kamu temui dan cara memperbaikinya.

---

## 📝 Rangkuman

| Konsep                          | Ingat ini                                                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `TextField`                     | Input dasar; baca nilainya dengan `controller` atau `onChanged`                                                     |
| `TextEditingController`         | Wajib `dispose()`                                                                                                   |
| Button                          | `onPressed: null` = tombol nonaktif                                                                                 |
| `setState()`                    | Memberi tahu Flutter untuk menggambar ulang; jangan dipanggil di `build()`                                          |
| `Form` + `GlobalKey<FormState>` | Memvalidasi banyak field sekaligus lewat `validate()`                                                               |
| `TextFormField`                 | `TextField` + `validator`                                                                                           |
| `validator`                     | `null` = valid, `String` = pesan error (jangan `''`)                                                                |
| `autovalidateMode`              | Pakai `onUserInteraction` setelah submit pertama gagal                                                              |
| Praktik industri                | Widget reusable, validator terpisah, fokus & keyboard tepat, loading state, cek `mounted`, validasi ulang di server |

## ⚠️ Daftar Kesalahan Umum

| Gejala                                       | Kemungkinan penyebab                                |
| -------------------------------------------- | --------------------------------------------------- |
| `unbounded width`                            | `TextField` di dalam `Row` tanpa `Expanded`         |
| `BOTTOM OVERFLOWED`                          | Form tidak dibungkus `SingleChildScrollView`        |
| `Null check operator used on a null value`   | `GlobalKey` belum dipasang ke `Form`                |
| Validasi tidak berjalan                      | Memakai `TextField`, bukan `TextFormField`          |
| Semua field merah                            | `validator` mengembalikan `''`                      |
| Form tidak terisi data awal                  | Controller diisi di `build()` atau lupa Hot Restart |
| Error saat memakai `context` setelah `await` | Lupa cek `if (!mounted) return;`                    |
| Tampilan tidak berubah saat mengetik         | Lupa `setState`                                     |

## 📚 Referensi

- [TextField](https://api.flutter.dev/flutter/material/TextField-class.html)
- [TextFormField](https://api.flutter.dev/flutter/material/TextFormField-class.html)
- [Form](https://api.flutter.dev/flutter/widgets/Form-class.html)
- [TextEditingController](https://api.flutter.dev/flutter/widgets/TextEditingController-class.html)
- [FilledButton](https://api.flutter.dev/flutter/material/FilledButton-class.html)
- [TextInputFormatter](https://api.flutter.dev/flutter/services/TextInputFormatter-class.html)

---
