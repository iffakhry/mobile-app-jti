# Modul 7 — Interaksi & Pengelolaan State Dasar

**Workshop Mobile Application Framework · Flutter & Dart**
**Durasi:** 2 pertemuan × 4 jam · **Studi kasus:** Kartu Profil Digital (lanjutan modul sebelumnya)

---

## 🎯 Tujuan Pembelajaran

Setelah menyelesaikan modul ini, kamu mampu:

1. Menjelaskan apa itu **state** dan mengapa UI Flutter berubah ketika state berubah.
2. Menangani **event** pengguna (`onPressed`, `onTap`, `onChanged`) dengan benar.
3. Memakai `setState()` secara tepat dan menghindari kesalahan umum.
4. Memberi umpan balik ke pengguna dengan **Snackbar** dan **Dialog**.
5. Membuat input interaktif dengan **Switch**, **Checkbox**, dan **Dropdown**.
6. Menerapkan pola industri: *state di satu tempat, data turun, event naik*.

## 🏁 Hasil Akhir

Kartu Profil Digital milikmu akan punya:

- Tombol **Ikuti / Mengikuti** dengan jumlah pengikut yang berubah, Snackbar, dan dialog konfirmasi.
- Bio yang bisa dibuka-tutup dengan sekali tap.
- Kartu **Pengaturan Profil**: Switch *Open to Work*, Checkbox keahlian, dan Dropdown status.
- Tombol **Reset** dengan dialog konfirmasi.

```text
┌────────────────────────────────┐
│ Kartu Profil Digital           │
├────────────────────────────────┤
│           ( foto )             │
│         Fakhry Firdaus         │
│          Mahasiswa             │
│      [💼 Open to Work]         │
│ ┌────────────────────────────┐ │
│ │  48      1201       320    │ │
│ │ Postingan Pengikut Mengikuti│ │
│ └────────────────────────────┘ │
│ [ ✓ Mengikuti ]                │
│ ┌ Tentang ───────────────────┐ │
│ │ Mahasiswa Teknik Info...   │ │
│ │ Selengkapnya               │ │
│ └────────────────────────────┘ │
│ ┌ Keahlian ──────────────────┐ │
│ │ (Flutter) (Dart)           │ │
│ └────────────────────────────┘ │
│ ┌ Pengaturan Profil ─────────┐ │
│ │ Open to Work         [ ●]  │ │
│ │ ☑ Flutter  ☑ Dart  ☐ Git   │ │
│ │ Status: [ Mahasiswa    ▼ ] │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

## 🗓️ Rencana Waktu

**Pertemuan 1 — Event, `setState()`, Snackbar (240 menit)**

| Menit | Kegiatan |
|---|---|
| 15 | Persiapan & kode awal (starter) |
| 35 | Teori: state, event, `setState()` |
| 40 | Lab 1: Tombol Ikuti + `setState()` |
| 15 | Istirahat |
| 25 | Lab 2: Jumlah pengikut |
| 30 | Lab 3: Snackbar |
| 25 | Lab 4: `onTap` pada bio |
| 40 | Challenge Pertemuan 1 |
| 15 | Rangkuman |

**Pertemuan 2 — Dialog, Switch, Checkbox, Dropdown (240 menit)**

| Menit | Kegiatan |
|---|---|
| 10 | Ulasan Pertemuan 1 |
| 25 | Teori: Dialog & *controlled widget* |
| 30 | Lab 5: Dialog konfirmasi |
| 20 | Lab 6: Switch |
| 15 | Istirahat |
| 25 | Lab 7: Checkbox |
| 25 | Lab 8: Dropdown |
| 35 | Lab 9: Refactor + Reset |
| 40 | Challenge Pertemuan 2 |
| 15 | Rangkuman & cek pemahaman |

## 🧰 Prasyarat

- Flutter SDK versi stable terbaru, serta emulator atau Chrome sudah berjalan (Modul 1).
- Paham `StatelessWidget`, `StatefulWidget`, `Column`, `Row`, `Card`, `SingleChildScrollView` (Modul 3–5).
- Folder proyek: `flutter create kartu_profil_digital` (atau pakai proyek dari modul sebelumnya).

---

# 📅 PERTEMUAN 1 — Event, `setState()`, dan Snackbar

## 1. Konsep Dasar

### 1.1 Apa itu State?

**State** adalah data yang bisa berubah saat aplikasi berjalan dan memengaruhi tampilan.

Contoh di aplikasimu: status *sudah mengikuti atau belum*, jumlah pengikut, bio terbuka atau tertutup.

Flutter bersifat **deklaratif**. Kamu tidak menyuruh widget "ganti teks ini". Kamu cukup menjelaskan *seperti apa UI untuk state tertentu*:

```text
UI = f(state)
```

Kalau state berubah, Flutter menggambar ulang UI dari state yang baru.

### 1.2 Event dan Callback

**Event** adalah kejadian dari pengguna: tap tombol, geser switch, pilih dropdown.
**Callback** adalah fungsi yang kamu "titipkan" ke widget untuk dijalankan *nanti* saat event terjadi.

| Callback | Dipakai pada | Kapan terpanggil |
|---|---|---|
| `onPressed` | `ElevatedButton`, `FilledButton`, `TextButton`, `IconButton` | Tombol ditekan |
| `onTap` | `InkWell`, `GestureDetector`, `ListTile` | Disentuh sekali |
| `onLongPress` | `InkWell`, `GestureDetector`, tombol | Ditekan lama |
| `onChanged` | `Switch`, `Checkbox`, `DropdownButton`, `TextField` | Nilai berubah |

> ⚠️ **Kesalahan paling umum:** `onPressed: _simpan()` ❌ menjalankan fungsi *saat build*.
> Yang benar: `onPressed: _simpan` ✅ atau `onPressed: () => _simpan()` ✅.

### 1.3 `setState()` — Alur Perubahan UI

```text
Pengguna tap tombol
      │
      ▼
 onPressed (event) ──► handler mengubah variabel di dalam setState()
                                   │
                                   ▼
                  Flutter memanggil build() lagi
                                   │
                                   ▼
                          UI baru tampil
```

`setState()` berarti: *"Data sudah berubah, tolong panggil ulang `build()`."*
Tanpa `setState()`, variabel memang berubah, tetapi layar **tidak**.

**Aturan emas `setState()`:**

1. Variabel state ditaruh di **class State** (di luar `build()`). Variabel di dalam `build()` akan ter-reset setiap build.
2. Isi `setState(() { ... })` hanya mengubah variabel dan harus **sinkron** (tanpa `async`).
3. Kerjakan hal berat atau `await` di luar `setState`, lalu panggil `setState` setelah hasilnya ada.

### 1.4 Dua Jenis State

| Jenis | Arti | Contoh | Alat |
|---|---|---|---|
| **Ephemeral (lokal)** | Hanya dipakai satu layar/widget | Switch aktif, bio terbuka | `setState()` |
| **App state (global)** | Dipakai banyak layar | Data login, keranjang belanja | Provider, Riverpod, Bloc (modul berikutnya) |

Di modul ini kamu fokus pada **ephemeral state** dengan `setState()`. Ini fondasi sebelum belajar state management.

---

## 2. Persiapan: Kode Awal (Starter)

Pakai kode Kartu Profil Digital milikmu sendiri, atau ganti isi `lib/main.dart` dengan kode ini agar semua mulai dari titik yang sama.

```dart
import 'package:flutter/material.dart';

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

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  static const _name = 'Fakhry Firdaus';
  static const _bio =
      'Mahasiswa Teknik Informatika yang sedang belajar Flutter. '
      'Suka membangun aplikasi mobile yang sederhana, rapi, dan berguna. '
      'Sedang mengerjakan proyek akhir semester bertema kartu profil digital.';

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      appBar: AppBar(title: const Text('Kartu Profil Digital')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Center(
              child: CircleAvatar(
                radius: 48,
                backgroundImage:
                    NetworkImage('https://picsum.photos/seed/profile/300/300'),
              ),
            ),
            const SizedBox(height: 12),
            Text(_name,
                textAlign: TextAlign.center, style: textTheme.headlineSmall),
            const Text('Mahasiswa', textAlign: TextAlign.center),
            const SizedBox(height: 16),
            const Card(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _StatItem(label: 'Postingan', value: '48'),
                    _StatItem(label: 'Pengikut', value: '1200'),
                    _StatItem(label: 'Mengikuti', value: '320'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            FilledButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.person_add),
              label: const Text('Ikuti'),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Tentang', style: textTheme.titleMedium),
                    const SizedBox(height: 8),
                    const Text(_bio),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Widget kecil untuk satu angka statistik. Sengaja dibuat StatelessWidget:
/// ia hanya menampilkan data yang diberikan, tidak menyimpan state sendiri.
class _StatItem extends StatelessWidget {
  const _StatItem({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(value, style: textTheme.titleLarge),
        Text(label, style: textTheme.bodySmall),
      ],
    );
  }
}
```

✅ **Checkpoint:** Jalankan dengan `flutter run`. Muncul foto, nama, statistik, tombol *Ikuti*, dan kartu *Tentang*. Tombol belum melakukan apa-apa. Itu wajar.

> ⚠️ **Gambar tidak muncul di Chrome?** Pakai `picsum.photos` seperti di atas. Beberapa layanan gambar lain diblokir CORS di browser. Di Android, pastikan permission internet ada di `AndroidManifest.xml`.

---

## 3. Lab 1 — Tombol Ikuti dan `setState()` (40 menit)

**Target:** tombol *Ikuti* berubah menjadi *Mengikuti* saat ditekan.

### Langkah 1 — Buat variabel state

Di dalam `_ProfilePageState`, **di atas** `build()`:

```dart
bool _isFollowing = false;
```

### Langkah 2 — Ubah tampilan tombol sesuai state

Ganti `FilledButton.icon(...)` lama dengan:

```dart
_isFollowing
    ? OutlinedButton.icon(
        onPressed: _onFollowPressed,
        icon: const Icon(Icons.check),
        label: const Text('Mengikuti'),
      )
    : FilledButton.icon(
        onPressed: _onFollowPressed,
        icon: const Icon(Icons.person_add),
        label: const Text('Ikuti'),
      ),
```

### Langkah 3 — 🧪 Eksperimen: tanpa `setState()`

Tambahkan method di dalam class State (di bawah variabel, di atas `build()`):

```dart
void _onFollowPressed() {
  _isFollowing = !_isFollowing;
  debugPrint('isFollowing = $_isFollowing');
}
```

Simpan (hot reload), lalu tekan tombol beberapa kali. Lihat **Debug Console**.

**Pertanyaan:** Nilai di console berubah, tapi tombol tidak. Mengapa? *(Jawab dulu sebelum lanjut.)*

> Jawabannya: variabelnya memang berubah, tetapi Flutter tidak tahu harus menggambar ulang.

### Langkah 4 — Perbaiki dengan `setState()`

```dart
void _onFollowPressed() {
  setState(() {
    _isFollowing = !_isFollowing;
  });
}
```

✅ **Checkpoint:** Tekan tombol. *Ikuti* ⇄ *Mengikuti* berganti-ganti dengan ikon yang sesuai.

> 💡 **Insight industri:** Tulis handler sebagai **method bernama** (`_onFollowPressed`), jangan menumpuk logika panjang di dalam `onPressed: () { ... }`. Kode lebih mudah dibaca, dites, dan di-debug. Pakai prefix `_on...` untuk handler dan `_is...` untuk boolean.

---

## 4. Lab 2 — Jumlah Pengikut (25 menit)

**Target:** angka *Pengikut* bertambah saat mengikuti dan berkurang saat berhenti.

### Langkah 1 — Tambah state

```dart
int _followers = 1200;
```

### Langkah 2 — Tampilkan di statistik

Angka sekarang dinamis, jadi `const` pada `Card` harus dilepas. Ganti blok statistik menjadi:

```dart
Card(
  child: Padding(
    padding: const EdgeInsets.symmetric(vertical: 16),
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        const _StatItem(label: 'Postingan', value: '48'),
        _StatItem(label: 'Pengikut', value: '$_followers'),
        const _StatItem(label: 'Mengikuti', value: '320'),
      ],
    ),
  ),
),
```

> ⚠️ **Error `Not a constant expression`?** Artinya masih ada `const` di depan widget yang berisi `$_followers`. Nilai yang berubah tidak boleh berada di dalam `const`. Pertahankan `const` hanya pada bagian yang benar-benar tetap.

### Langkah 3 — Buat method yang eksplisit

Ganti `_onFollowPressed` dengan dua method:

```dart
/// Mengatur status ikuti ke nilai tertentu (bukan sekadar toggle).
void _setFollowing(bool value) {
  if (_isFollowing == value) return; // tidak ada perubahan, abaikan
  setState(() {
    _isFollowing = value;
    _followers += value ? 1 : -1;
  });
}

void _onFollowPressed() {
  _setFollowing(!_isFollowing);
}
```

✅ **Checkpoint:** *Ikuti* → pengikut `1201`. *Mengikuti* → kembali `1200`. Tekan berulang kali, angkanya selalu konsisten (tidak lari ke 1202 atau 1198).

> 💡 **Insight industri:** Method `_setFollowing(true/false)` lebih aman daripada toggle. Hasilnya **idempoten**: dipanggil dua kali dengan nilai sama tidak mengubah apa-apa. Ini mencegah bug saat pengguna menekan cepat atau saat ada fitur *Undo* (kamu akan membuatnya sebentar lagi).

---

## 5. Lab 3 — Snackbar (30 menit)

**Snackbar** adalah pesan singkat di bagian bawah layar yang hilang sendiri. Cocok untuk **informasi tanpa memblokir** pengguna ("berhasil", "dibatalkan").

### Langkah 1 — Buat helper

Di class State:

```dart
void _showSnack(String message, {SnackBarAction? action}) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar() // hindari Snackbar menumpuk
    ..showSnackBar(
      SnackBar(
        content: Text(message),
        behavior: SnackBarBehavior.floating,
        action: action,
      ),
    );
}
```

### Langkah 2 — Panggil di handler

```dart
void _onFollowPressed() {
  if (_isFollowing) {
    _setFollowing(false);
    _showSnack('Kamu berhenti mengikuti $_name');
  } else {
    _setFollowing(true);
    _showSnack(
      'Kamu mulai mengikuti $_name',
      action: SnackBarAction(
        label: 'BATAL',
        onPressed: () => _setFollowing(false), // Undo
      ),
    );
  }
}
```

✅ **Checkpoint:**

- Tekan *Ikuti* → Snackbar muncul dengan tombol **BATAL**.
- Tekan **BATAL** → status dan jumlah pengikut kembali seperti semula.
- Tekan tombol berulang kali dengan cepat → hanya satu Snackbar tampil, tidak menumpuk.

> 💡 **Insight industri:**
> - Gunakan `ScaffoldMessenger.of(context)`. Cara lama `Scaffold.of(context).showSnackBar` sudah tidak dipakai.
> - Selalu `hideCurrentSnackBar()` sebelum menampilkan yang baru.
> - Aksi **Undo** pada Snackbar adalah pola UX standar di aplikasi modern. Aksi ringan dan bisa dibatalkan sebaiknya memakai Snackbar, bukan dialog.

---

## 6. Lab 4 — `onTap` pada Bio (25 menit)

**Target:** kartu *Tentang* membuka dan menutup isi bio saat di-tap.

### Langkah 1 — State

```dart
bool _isBioExpanded = false;
```

### Langkah 2 — Ganti kartu *Tentang*

```dart
Card(
  child: InkWell(
    borderRadius: BorderRadius.circular(12),
    onTap: () => setState(() => _isBioExpanded = !_isBioExpanded),
    child: Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Tentang', style: textTheme.titleMedium),
          const SizedBox(height: 8),
          Text(
            _bio,
            maxLines: _isBioExpanded ? null : 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 8),
          Text(
            _isBioExpanded ? 'Tutup' : 'Selengkapnya',
            style: TextStyle(color: Theme.of(context).colorScheme.primary),
          ),
        ],
      ),
    ),
  ),
),
```

✅ **Checkpoint:** Bio awalnya 2 baris dengan `...`. Tap kartu → bio terbuka penuh dan tulisan berubah jadi *Tutup*. Tap lagi → menutup. Efek *ripple* terlihat saat disentuh.

> 💡 `InkWell` memberi efek ripple. `GestureDetector` mendeteksi gestur yang sama, tetapi tanpa efek visual. Pilih `InkWell` untuk elemen yang terlihat bisa ditekan.

---

## 7. 🏆 Challenge Pertemuan 1

Kerjakan sesuai kemampuan. Boleh mengulik lebih jauh.

| Level | Tantangan |
|---|---|
| ⭐ | Tambahkan `IconButton` berbentuk hati (♡) di samping nama. Tap untuk *suka / batal suka* (`Icons.favorite` merah ⇄ `Icons.favorite_border`). Tampilkan Snackbar. |
| ⭐⭐ | Buat tombol *Ikuti* seolah memuat ke server. Saat ditekan, tombol nonaktif (`onPressed: null`) dan menampilkan `CircularProgressIndicator` selama 1 detik (`await Future.delayed(...)`), baru status berubah. *Petunjuk:* butuh state `_isLoading` dan pengecekan `mounted` setelah `await`. |
| ⭐⭐ | **Easter egg:** tap avatar 5 kali berturut-turut (`GestureDetector` + counter) untuk memunculkan Snackbar rahasia, lalu counter di-reset. |
| ⭐⭐⭐ | Pindahkan tombol Ikuti ke widget sendiri `FollowButton` (StatelessWidget) dengan parameter `isFollowing` dan `onPressed`. Buktikan fungsinya tetap sama. |

---

## 8. Rangkuman Pertemuan 1

- **State** = data yang berubah. **UI = f(state)**.
- **Event** ditangani lewat **callback**. Tulis `onPressed: _fungsi`, bukan `_fungsi()`.
- `setState()` memberi tahu Flutter untuk memanggil `build()` ulang. Tanpa itu, UI diam.
- Variabel state ada di class State, bukan di dalam `build()`.
- **Snackbar** untuk pesan ringan tanpa memblokir. Tambahkan **Undo** bila memungkinkan.
- Method `_setFollowing(bool)` lebih aman daripada toggle (idempoten).

**Tiket keluar (jawab singkat):**

1. Apa yang terjadi jika `_isFollowing` diubah tanpa `setState()`?
2. Mengapa `const` harus dilepas saat widget menampilkan `$_followers`?
3. Apa beda `onPressed: _fn` dan `onPressed: _fn()`?

---

# 📅 PERTEMUAN 2 — Dialog, Switch, Checkbox, Dropdown

> **Ulasan (10 menit):** Pastikan Kartu Profil Digital dari Pertemuan 1 berjalan: tombol Ikuti, jumlah pengikut, Snackbar + Undo, dan bio yang bisa dibuka-tutup. Bila belum, selesaikan dulu sebelum lanjut.

## 9. Konsep Dasar

### 9.1 Dialog

**Dialog** adalah jendela kecil yang muncul di atas layar dan **memblokir** interaksi sampai pengguna memilih. Cocok saat pengguna **harus memutuskan** sesuatu, terutama aksi yang berisiko.

Dialog ditampilkan dengan `showDialog()`. Fungsi ini mengembalikan `Future`, jadi hasil pilihan pengguna bisa kamu tunggu dengan `await`:

```text
showDialog ──► dialog tampil ──► pengguna tekan tombol
                                         │
                       Navigator.pop(context, nilai)
                                         │
                                         ▼
              await showDialog(...) menghasilkan "nilai" tadi
```

**Kapan memakai apa?**

| | Snackbar | Dialog |
|---|---|---|
| Memblokir layar? | Tidak | Ya |
| Butuh keputusan pengguna? | Tidak (opsional Undo) | Ya |
| Contoh | "Berhasil disimpan" | "Hapus akun? Tidak bisa dibatalkan" |

### 9.2 *Controlled Widget*: Switch, Checkbox, Dropdown

Ketiga widget ini **tidak menyimpan nilainya sendiri**. Mereka hanya:

1. **Menampilkan** nilai yang kamu berikan lewat `value`.
2. **Memberi tahu** kamu lewat `onChanged` saat pengguna mengubahnya.

Kamulah yang menyimpan nilainya di state dan memanggil `setState()`.

```text
        value (dari state) ───►  Widget  ───► tampil
                                    │
        onChanged(nilaiBaru) ◄──────┘ pengguna mengubah
                │
                ▼
        setState(() => state = nilaiBaru)
```

> 💡 Inilah prinsip **single source of truth**: satu nilai, satu tempat. Jika kamu tidak memanggil `setState()` di `onChanged`, widget tidak akan berubah. Kalau `onChanged` diisi `null`, widget otomatis **nonaktif** (disabled).

| Widget | Tipe `value` | Dipakai untuk |
|---|---|---|
| `Switch` / `SwitchListTile` | `bool` | Aktif / nonaktif satu opsi |
| `Checkbox` / `CheckboxListTile` | `bool?` | Memilih **satu atau banyak** opsi |
| `DropdownButton` | tipe data bebas | Memilih **satu** dari banyak opsi |

---

## 10. Lab 5 — Dialog Konfirmasi Berhenti Mengikuti (30 menit)

**Target:** saat menekan *Mengikuti* (untuk berhenti), muncul dialog konfirmasi dulu.

### Langkah 1 — Buat helper dialog yang bisa dipakai ulang

```dart
Future<bool> _showConfirmDialog({
  required String title,
  required String message,
  required String confirmLabel,
}) async {
  final result = await showDialog<bool>(
    context: context,
    builder: (dialogContext) => AlertDialog(
      title: Text(title),
      content: Text(message),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(dialogContext, false),
          child: const Text('Batal'),
        ),
        FilledButton(
          onPressed: () => Navigator.pop(dialogContext, true),
          child: Text(confirmLabel),
        ),
      ],
    ),
  );
  return result ?? false; // null = dialog ditutup dengan tap di luar
}
```

Bagian-bagian `AlertDialog`: `title` (judul), `content` (isi), `actions` (tombol-tombol).

### Langkah 2 — Pakai di handler (ubah menjadi `async`)

```dart
Future<void> _onFollowPressed() async {
  if (!_isFollowing) {
    _setFollowing(true);
    _showSnack(
      'Kamu mulai mengikuti $_name',
      action: SnackBarAction(
        label: 'BATAL',
        onPressed: () => _setFollowing(false),
      ),
    );
    return;
  }

  final confirmed = await _showConfirmDialog(
    title: 'Berhenti mengikuti?',
    message: 'Kamu tidak akan lagi melihat pembaruan dari $_name.',
    confirmLabel: 'Berhenti',
  );

  if (!confirmed || !mounted) return; // ⚠️ wajib dicek setelah await

  _setFollowing(false);
  _showSnack('Kamu berhenti mengikuti $_name');
}
```

✅ **Checkpoint:**

- *Ikuti* → langsung berhasil + Snackbar (aksi ringan, tidak perlu dialog).
- *Mengikuti* → dialog muncul. **Batal** atau tap di luar → tidak ada perubahan. **Berhenti** → status kembali ke *Ikuti* + Snackbar.

> 💡 **Insight industri:**
> - **Setelah `await`, cek `mounted`** (atau `context.mounted`) sebelum memakai `context` atau `setState`. Layar bisa saja sudah ditutup saat kamu menunggu, dan tanpa pengecekan aplikasi bisa error.
> - Pakai nama berbeda (`dialogContext`) untuk context di dalam dialog agar tidak tertukar dengan context halaman.
> - Dialog sebaiknya hanya untuk aksi berisiko atau tidak mudah dibatalkan. Terlalu banyak dialog membuat pengguna jengkel.
> - Menutup dialog dengan nilai (`Navigator.pop(context, nilai)`) lebih rapi daripada mengubah state langsung dari dalam dialog.

---

## 11. Lab 6 — Switch: Open to Work (20 menit)

**Target:** Switch mengaktifkan lencana *Open to Work* di bagian atas kartu profil.

### Langkah 1 — State

```dart
bool _openToWork = false;
```

### Langkah 2 — Kartu Pengaturan Profil

Tambahkan **di bawah kartu Tentang**:

```dart
const SizedBox(height: 16),
Card(
  child: Padding(
    padding: const EdgeInsets.all(16),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Pengaturan Profil', style: textTheme.titleMedium),
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Open to Work'),
          subtitle: const Text('Tampilkan lencana di kartu profilmu'),
          value: _openToWork,
          onChanged: (value) => setState(() => _openToWork = value),
        ),
      ],
    ),
  ),
),
```

### Langkah 3 — Tampilkan lencana secara kondisional

Di bawah teks `'Mahasiswa'` (di bagian atas halaman), tambahkan:

```dart
if (_openToWork) ...[
  const SizedBox(height: 8),
  const Center(
    child: Chip(
      avatar: Icon(Icons.work_outline, size: 18),
      label: Text('Open to Work'),
    ),
  ),
],
```

✅ **Checkpoint:** Geser Switch → lencana muncul di atas. Geser lagi → hilang.

> 💡 Gunakan `SwitchListTile` (bukan `Switch` polos) agar seluruh baris bisa disentuh dan lebih ramah akses. Pola `if (kondisi) ...[widget]` di dalam list adalah cara standar menampilkan widget secara kondisional.

---

## 12. Lab 7 — Checkbox: Keahlian (25 menit)

**Target:** pilih beberapa keahlian, lalu tampil sebagai *chip* di kartu **Keahlian**.

### Langkah 1 — State dan data

```dart
static const _allSkills = ['Flutter', 'Dart', 'UI/UX', 'Firebase', 'Git'];

final Set<String> _skills = {'Flutter'};
```

> Kenapa `Set`? Elemennya unik, jadi pengecekan "sudah dipilih atau belum" dengan `contains()` sederhana dan tidak mungkin ada duplikat.

### Langkah 2 — Checkbox di kartu pengaturan

Tambahkan setelah `SwitchListTile` (di dalam `children` yang sama):

```dart
const Divider(),
const Text('Keahlian'),
for (final skill in _allSkills)
  CheckboxListTile(
    contentPadding: EdgeInsets.zero,
    dense: true,
    controlAffinity: ListTileControlAffinity.leading,
    title: Text(skill),
    value: _skills.contains(skill),
    onChanged: (value) {
      setState(() {
        if (value ?? false) {
          _skills.add(skill);
        } else {
          _skills.remove(skill);
        }
      });
    },
  ),
```

`value` pada Checkbox bertipe `bool?` (bisa `null`), sehingga kita pakai `value ?? false`.

### Langkah 3 — Kartu Keahlian

Letakkan **di antara** kartu *Tentang* dan *Pengaturan Profil*:

```dart
const SizedBox(height: 16),
Card(
  child: Padding(
    padding: const EdgeInsets.all(16),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Keahlian', style: textTheme.titleMedium),
        const SizedBox(height: 8),
        if (_skills.isEmpty)
          const Text('Belum ada keahlian dipilih')
        else
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [for (final s in _skills) Chip(label: Text(s))],
          ),
      ],
    ),
  ),
),
```

✅ **Checkpoint:** Centang/hapus centang → chip di kartu *Keahlian* ikut bertambah/berkurang. Kosongkan semua → muncul teks *Belum ada keahlian dipilih*.

> ⚠️ **Hot reload tidak menambahkan variabel state baru dengan benar?** Jika setelah menambah variabel di class State aplikasi error atau nilainya aneh, lakukan **Hot Restart** (`Shift + R` di terminal, atau ikon restart di VS Code). Hot reload mempertahankan state lama.

---

## 13. Lab 8 — Dropdown: Status (25 menit)

**Target:** pilih status (Mahasiswa, Freelancer, dst.) dan teks di bawah nama ikut berubah.

### Langkah 1 — Buat `enum` (di luar class, di bawah `main()`)

```dart
enum ProfileStatus {
  student('Mahasiswa'),
  freelancer('Freelancer'),
  intern('Magang'),
  employee('Karyawan');

  const ProfileStatus(this.label);
  final String label;
}
```

> 💡 **Insight industri:** Gunakan **enum** untuk pilihan yang jumlahnya tetap, bukan `String` mentah. Typo seperti `"Mahasiwa"` tidak mungkin terjadi, dan compiler memeriksa semua kasus. *Enhanced enum* (punya `label`) memisahkan nilai di kode dari teks yang tampil ke pengguna.

### Langkah 2 — State

```dart
ProfileStatus _status = ProfileStatus.student;
```

### Langkah 3 — Dropdown

Tambahkan setelah daftar `CheckboxListTile`:

```dart
const Divider(),
const Text('Status'),
DropdownButton<ProfileStatus>(
  isExpanded: true,
  value: _status,
  items: [
    for (final s in ProfileStatus.values)
      DropdownMenuItem(value: s, child: Text(s.label)),
  ],
  onChanged: (value) {
    if (value == null) return;
    setState(() => _status = value);
  },
),
```

### Langkah 4 — Pakai di header

Ganti `const Text('Mahasiswa', ...)` menjadi:

```dart
Text(_status.label, textAlign: TextAlign.center),
```

✅ **Checkpoint:** Pilih *Freelancer* → teks di bawah nama berubah menjadi *Freelancer*.

> ⚠️ **Error `There should be exactly one item with [DropdownButton]'s value`?** `value` harus **tepat sama** dengan salah satu `value` di `items`, dan tidak boleh ada item dengan nilai kembar. Itulah salah satu alasan memakai enum.

---

## 14. Lab 9 — Refactor dan Reset (35 menit)

Kode `_ProfilePageState` sudah panjang. Di industri, widget besar dipecah agar rapi dan mudah dirawat. Pola yang dipakai: **state di satu tempat (induk), data turun, event naik.**

```text
 _ProfilePageState  (menyimpan state)
        │   data turun (value)           ▲  event naik (onChanged)
        ▼                                │
   _SettingsCard  (StatelessWidget: hanya menampilkan & melaporkan)
```

### Langkah 1 — Pindahkan kartu pengaturan ke widget sendiri

Tambahkan class ini di bagian bawah file:

```dart
class _SettingsCard extends StatelessWidget {
  const _SettingsCard({
    required this.openToWork,
    required this.onOpenToWorkChanged,
    required this.allSkills,
    required this.selectedSkills,
    required this.onSkillChanged,
    required this.status,
    required this.onStatusChanged,
    required this.onReset,
  });

  final bool openToWork;
  final ValueChanged<bool> onOpenToWorkChanged;
  final List<String> allSkills;
  final Set<String> selectedSkills;
  final void Function(String skill, bool selected) onSkillChanged;
  final ProfileStatus status;
  final ValueChanged<ProfileStatus> onStatusChanged;
  final VoidCallback onReset;

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Pengaturan Profil', style: textTheme.titleMedium),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Open to Work'),
              subtitle: const Text('Tampilkan lencana di kartu profilmu'),
              value: openToWork,
              onChanged: onOpenToWorkChanged,
            ),
            const Divider(),
            const Text('Keahlian'),
            for (final skill in allSkills)
              CheckboxListTile(
                contentPadding: EdgeInsets.zero,
                dense: true,
                controlAffinity: ListTileControlAffinity.leading,
                title: Text(skill),
                value: selectedSkills.contains(skill),
                onChanged: (value) => onSkillChanged(skill, value ?? false),
              ),
            const Divider(),
            const Text('Status'),
            DropdownButton<ProfileStatus>(
              isExpanded: true,
              value: status,
              items: [
                for (final s in ProfileStatus.values)
                  DropdownMenuItem(value: s, child: Text(s.label)),
              ],
              onChanged: (value) {
                if (value != null) onStatusChanged(value);
              },
            ),
            Align(
              alignment: Alignment.centerRight,
              child: TextButton.icon(
                onPressed: onReset,
                icon: const Icon(Icons.restart_alt),
                label: const Text('Reset pengaturan'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

### Langkah 2 — Tambah handler di State

```dart
void _onSkillChanged(String skill, bool selected) {
  setState(() {
    if (selected) {
      _skills.add(skill);
    } else {
      _skills.remove(skill);
    }
  });
}

Future<void> _onResetPressed() async {
  final confirmed = await _showConfirmDialog(
    title: 'Reset pengaturan?',
    message: 'Semua pengaturan akan kembali ke nilai awal.',
    confirmLabel: 'Reset',
  );
  if (!confirmed || !mounted) return;

  setState(() {
    _openToWork = false;
    _skills
      ..clear()
      ..add('Flutter');
    _status = ProfileStatus.student;
  });
  _showSnack('Pengaturan berhasil direset');
}
```

### Langkah 3 — Ganti kartu pengaturan lama

Hapus seluruh `Card` *Pengaturan Profil* lama di `build()`, lalu ganti dengan:

```dart
_SettingsCard(
  openToWork: _openToWork,
  onOpenToWorkChanged: (value) => setState(() => _openToWork = value),
  allSkills: _allSkills,
  selectedSkills: _skills,
  onSkillChanged: _onSkillChanged,
  status: _status,
  onStatusChanged: (value) => setState(() => _status = value),
  onReset: _onResetPressed,
),
```

✅ **Checkpoint:** Semua fungsi **tetap sama** seperti sebelum refactor (Switch, Checkbox, Dropdown), ditambah tombol **Reset pengaturan** yang memunculkan dialog, lalu Snackbar setelah dikonfirmasi.

> 💡 **Insight industri:**
> - **Refactoring yang benar = perilaku tidak berubah**, hanya struktur kode yang lebih baik. Tes dengan menjalankan ulang semua fitur.
> - Buat **widget class**, bukan method helper `Widget _buildXxx()`. Flutter bisa mengoptimalkan widget class (terutama dengan `const`).
> - `_SettingsCard` itu *stateless* dan mudah dites. Ia tidak tahu apa pun tentang `setState()`. Inilah dasar untuk memahami state management di modul berikutnya.
> - Pertahankan `setState()` seluas yang dibutuhkan saja. Pada halaman besar, memecah widget menjaga rebuild tetap kecil.

---

## 15. Kode Lengkap (Referensi Akhir)

Bandingkan dengan kodemu bila ada yang tidak sesuai. Ganti seluruh isi `lib/main.dart`:

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

enum ProfileStatus {
  student('Mahasiswa'),
  freelancer('Freelancer'),
  intern('Magang'),
  employee('Karyawan');

  const ProfileStatus(this.label);
  final String label;
}

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

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  static const _name = 'Fakhry Firdaus';
  static const _bio =
      'Mahasiswa Teknik Informatika yang sedang belajar Flutter. '
      'Suka membangun aplikasi mobile yang sederhana, rapi, dan berguna. '
      'Sedang mengerjakan proyek akhir semester bertema kartu profil digital.';
  static const _allSkills = ['Flutter', 'Dart', 'UI/UX', 'Firebase', 'Git'];

  // ===== STATE =====
  bool _isFollowing = false;
  int _followers = 1200;
  bool _isBioExpanded = false;
  bool _openToWork = false;
  final Set<String> _skills = {'Flutter'};
  ProfileStatus _status = ProfileStatus.student;

  // ===== HELPER UI =====
  void _showSnack(String message, {SnackBarAction? action}) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        SnackBar(
          content: Text(message),
          behavior: SnackBarBehavior.floating,
          action: action,
        ),
      );
  }

  Future<bool> _showConfirmDialog({
    required String title,
    required String message,
    required String confirmLabel,
  }) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Batal'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            child: Text(confirmLabel),
          ),
        ],
      ),
    );
    return result ?? false;
  }

  // ===== HANDLER =====
  void _setFollowing(bool value) {
    if (_isFollowing == value) return;
    setState(() {
      _isFollowing = value;
      _followers += value ? 1 : -1;
    });
  }

  Future<void> _onFollowPressed() async {
    if (!_isFollowing) {
      _setFollowing(true);
      _showSnack(
        'Kamu mulai mengikuti $_name',
        action: SnackBarAction(
          label: 'BATAL',
          onPressed: () => _setFollowing(false),
        ),
      );
      return;
    }

    final confirmed = await _showConfirmDialog(
      title: 'Berhenti mengikuti?',
      message: 'Kamu tidak akan lagi melihat pembaruan dari $_name.',
      confirmLabel: 'Berhenti',
    );
    if (!confirmed || !mounted) return;

    _setFollowing(false);
    _showSnack('Kamu berhenti mengikuti $_name');
  }

  void _onSkillChanged(String skill, bool selected) {
    setState(() {
      if (selected) {
        _skills.add(skill);
      } else {
        _skills.remove(skill);
      }
    });
  }

  Future<void> _onResetPressed() async {
    final confirmed = await _showConfirmDialog(
      title: 'Reset pengaturan?',
      message: 'Semua pengaturan akan kembali ke nilai awal.',
      confirmLabel: 'Reset',
    );
    if (!confirmed || !mounted) return;

    setState(() {
      _openToWork = false;
      _skills
        ..clear()
        ..add('Flutter');
      _status = ProfileStatus.student;
    });
    _showSnack('Pengaturan berhasil direset');
  }

  // ===== UI =====
  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    final colorScheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(title: const Text('Kartu Profil Digital')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Center(
              child: CircleAvatar(
                radius: 48,
                backgroundImage:
                    NetworkImage('https://picsum.photos/seed/profile/300/300'),
              ),
            ),
            const SizedBox(height: 12),
            Text(_name,
                textAlign: TextAlign.center, style: textTheme.headlineSmall),
            Text(_status.label, textAlign: TextAlign.center),
            if (_openToWork) ...[
              const SizedBox(height: 8),
              const Center(
                child: Chip(
                  avatar: Icon(Icons.work_outline, size: 18),
                  label: Text('Open to Work'),
                ),
              ),
            ],
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    const _StatItem(label: 'Postingan', value: '48'),
                    _StatItem(label: 'Pengikut', value: '$_followers'),
                    const _StatItem(label: 'Mengikuti', value: '320'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            _isFollowing
                ? OutlinedButton.icon(
                    onPressed: _onFollowPressed,
                    icon: const Icon(Icons.check),
                    label: const Text('Mengikuti'),
                  )
                : FilledButton.icon(
                    onPressed: _onFollowPressed,
                    icon: const Icon(Icons.person_add),
                    label: const Text('Ikuti'),
                  ),
            const SizedBox(height: 16),
            Card(
              child: InkWell(
                borderRadius: BorderRadius.circular(12),
                onTap: () => setState(() => _isBioExpanded = !_isBioExpanded),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Tentang', style: textTheme.titleMedium),
                      const SizedBox(height: 8),
                      Text(
                        _bio,
                        maxLines: _isBioExpanded ? null : 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _isBioExpanded ? 'Tutup' : 'Selengkapnya',
                        style: TextStyle(color: colorScheme.primary),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Keahlian', style: textTheme.titleMedium),
                    const SizedBox(height: 8),
                    if (_skills.isEmpty)
                      const Text('Belum ada keahlian dipilih')
                    else
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          for (final s in _skills) Chip(label: Text(s)),
                        ],
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            _SettingsCard(
              openToWork: _openToWork,
              onOpenToWorkChanged: (value) =>
                  setState(() => _openToWork = value),
              allSkills: _allSkills,
              selectedSkills: _skills,
              onSkillChanged: _onSkillChanged,
              status: _status,
              onStatusChanged: (value) => setState(() => _status = value),
              onReset: _onResetPressed,
            ),
          ],
        ),
      ),
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
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(value, style: textTheme.titleLarge),
        Text(label, style: textTheme.bodySmall),
      ],
    );
  }
}

class _SettingsCard extends StatelessWidget {
  const _SettingsCard({
    required this.openToWork,
    required this.onOpenToWorkChanged,
    required this.allSkills,
    required this.selectedSkills,
    required this.onSkillChanged,
    required this.status,
    required this.onStatusChanged,
    required this.onReset,
  });

  final bool openToWork;
  final ValueChanged<bool> onOpenToWorkChanged;
  final List<String> allSkills;
  final Set<String> selectedSkills;
  final void Function(String skill, bool selected) onSkillChanged;
  final ProfileStatus status;
  final ValueChanged<ProfileStatus> onStatusChanged;
  final VoidCallback onReset;

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Pengaturan Profil', style: textTheme.titleMedium),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Open to Work'),
              subtitle: const Text('Tampilkan lencana di kartu profilmu'),
              value: openToWork,
              onChanged: onOpenToWorkChanged,
            ),
            const Divider(),
            const Text('Keahlian'),
            for (final skill in allSkills)
              CheckboxListTile(
                contentPadding: EdgeInsets.zero,
                dense: true,
                controlAffinity: ListTileControlAffinity.leading,
                title: Text(skill),
                value: selectedSkills.contains(skill),
                onChanged: (value) => onSkillChanged(skill, value ?? false),
              ),
            const Divider(),
            const Text('Status'),
            DropdownButton<ProfileStatus>(
              isExpanded: true,
              value: status,
              items: [
                for (final s in ProfileStatus.values)
                  DropdownMenuItem(value: s, child: Text(s.label)),
              ],
              onChanged: (value) {
                if (value != null) onStatusChanged(value);
              },
            ),
            Align(
              alignment: Alignment.centerRight,
              child: TextButton.icon(
                onPressed: onReset,
                icon: const Icon(Icons.restart_alt),
                label: const Text('Reset pengaturan'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

## 16. 💡 Ringkasan Praktik Terbaik Industri

| # | Praktik | Alasan |
|---|---|---|
| 1 | Variabel state di class State, bukan di `build()` | `build()` dipanggil berulang dan akan mereset nilai |
| 2 | `setState()` hanya mengubah variabel, tanpa `async` | Menjaga update tetap sinkron dan dapat diprediksi |
| 3 | Cek `mounted` setelah `await` | Mencegah error saat layar sudah ditutup |
| 4 | Handler berupa method bernama (`_onXxx`) | Terbaca, mudah di-debug dan dites |
| 5 | Method eksplisit (`_setFollowing(bool)`) > toggle | Idempoten, aman untuk Undo dan tap berulang |
| 6 | `ScaffoldMessenger` + `hideCurrentSnackBar()` | Cara resmi; Snackbar tidak menumpuk |
| 7 | Snackbar untuk info ringan, Dialog untuk keputusan berisiko | UX tidak mengganggu |
| 8 | Enum untuk pilihan tetap | Aman dari typo, diperiksa compiler |
| 9 | Widget class, bukan method `_buildXxx()` | Bisa di-`const` dan rebuild lebih efisien |
| 10 | **Data turun, event naik** | Dasar semua pendekatan state management |
| 11 | Pakai `const` sebanyak mungkin pada bagian yang tetap | Mengurangi pekerjaan rebuild |
| 12 | `onChanged: null` = widget nonaktif | Cara standar menonaktifkan input |

**Kapan `setState()` tidak cukup?** Saat data dipakai di banyak layar (misalnya data login atau keranjang), atau logika sudah rumit. Saat itu industri memakai **Provider, Riverpod, atau Bloc**. Kamu akan mempelajarinya di modul berikutnya, dengan konsep yang sama seperti hari ini: *state di satu tempat, UI hanya membaca dan melaporkan event*.

---

## 17. 🛠️ Pemecahan Masalah Umum

| Gejala | Penyebab | Solusi |
|---|---|---|
| Tap tombol, UI tidak berubah | Lupa `setState()` | Bungkus perubahan variabel dengan `setState` |
| Dialog/Snackbar langsung muncul saat halaman dibuka | Menulis `onPressed: _fn()` | Tulis `onPressed: _fn` |
| `Not a constant expression` | `const` pada widget berisi nilai dinamis | Hapus `const` pada bagian yang berubah |
| Nilai kembali ke awal setiap tap | Variabel state dideklarasikan di dalam `build()` | Pindahkan ke class State |
| Snackbar menumpuk | Tidak memanggil `hideCurrentSnackBar()` | Pakai helper `_showSnack` |
| Error `exactly one item with DropdownButton's value` | `value` tidak ada di `items`, atau item kembar | Pastikan `value` termasuk dalam `items` dan unik |
| Peringatan `use_build_context_synchronously` | Memakai `context` setelah `await` tanpa cek | Tambahkan `if (!mounted) return;` |
| Perubahan kode tidak terlihat / aneh setelah tambah variabel state | Hot reload mempertahankan state lama | Lakukan **Hot Restart** |
| `RenderFlex overflowed` | Isi `Row` terlalu lebar | Bungkus dengan `Expanded`/`Flexible` atau pakai `Wrap` |

---

## 18. 🏆 Challenge Pertemuan 2

| Level | Tantangan |
|---|---|
| ⭐ | Tambahkan satu keahlian baru (mis. `Docker`) dan satu opsi baru pada `ProfileStatus` (mis. `lecturer`). Pastikan semuanya tampil benar. |
| ⭐ | Tambahkan `SwitchListTile` kedua "Tampilkan jumlah pengikut". Jika dimatikan, angka *Pengikut* diganti `—`. |
| ⭐⭐ | Tambahkan checkbox "Saya menyetujui syarat & ketentuan" dan tombol **Bagikan Profil**. Tombol **nonaktif** (`onPressed: null`) sampai checkbox dicentang. Saat ditekan, tampilkan dialog berisi ringkasan profil (nama, status, keahlian). |
| ⭐⭐⭐ | **Undo untuk Reset:** simpan kondisi pengaturan sebelum reset, lalu tampilkan Snackbar dengan aksi **BATAL** yang mengembalikan semuanya. |
| ⭐⭐⭐ | **Mode gelap:** ubah `MyApp` menjadi `StatefulWidget` yang menyimpan `ThemeMode`. Tambahkan Switch "Mode Gelap" di `_SettingsCard`. Perubahan harus "naik" ke `MyApp` lewat callback. *Petunjuk:* `MaterialApp(themeMode: ..., darkTheme: ThemeData(colorSchemeSeed: Colors.indigo, brightness: Brightness.dark, useMaterial3: true))`. |
| 🌟 Bonus | Ganti `DropdownButton` dengan `DropdownMenu` (versi Material 3) dan bandingkan keduanya. Mana yang menurutmu lebih nyaman? |

---

## 19. ✅ Cek Pemahaman

1. Jelaskan alur dari *tap tombol* sampai *UI berubah* dengan kata-katamu sendiri.
2. Mengapa `Switch`, `Checkbox`, dan `Dropdown` disebut *controlled widget*? Apa yang terjadi jika `onChanged` tidak memanggil `setState()`?
3. Kapan kamu memilih Snackbar, dan kapan Dialog? Beri satu contoh tiap kasus di luar modul ini.
4. Mengapa wajib mengecek `mounted` setelah `await`?
5. Apa arti "data turun, event naik"? Tunjukkan contohnya pada `_SettingsCard`.
6. Mengapa `Set<String>` lebih cocok daripada `List<String>` untuk menyimpan keahlian yang dipilih?

---

## 20. 📚 Referensi

- [`setState` — API Flutter](https://api.flutter.dev/flutter/widgets/State/setState.html)
- [`AlertDialog` — API Flutter](https://api.flutter.dev/flutter/material/AlertDialog-class.html)
- [`SnackBar` — API Flutter](https://api.flutter.dev/flutter/material/SnackBar-class.html)
- [`SwitchListTile` — API Flutter](https://api.flutter.dev/flutter/material/SwitchListTile-class.html)
- [`CheckboxListTile` — API Flutter](https://api.flutter.dev/flutter/material/CheckboxListTile-class.html)
- [`DropdownButton` — API Flutter](https://api.flutter.dev/flutter/material/DropdownButton-class.html)
- [Ephemeral vs app state — docs.flutter.dev](https://docs.flutter.dev/data-and-backend/state-mgmt/ephemeral-vs-app)

---

**Selamat! 🎉** Kartu Profil Digital milikmu sekarang sudah *hidup*: bisa merespons sentuhan, meminta konfirmasi, dan menyimpan pilihan pengguna. Di modul berikutnya, kamu akan belajar berpindah antarhalaman dan membawa data di antaranya.
