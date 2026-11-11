# Modul 11 — REST API & JSON: Menghubungkan Aplikasi ke Server

**Mata Kuliah:** Workshop Mobile Application Framework
**Durasi:** 2 × 4 jam (2 sesi)
**Studi kasus:** Lapor Fasilitas — aplikasi untuk melaporkan kondisi fasilitas kampus
**API yang dipakai:** `https://lapor-fasilitas-api.vercel.app` (dokumentasi interaktif di `/docs`)

---

## Selamat datang di Modul 11 👋

Sampai Modul 10, datamu hanya hidup di dalam perangkat: variabel, state, Shared Preferences, dan SQLite. Aplikasi seperti Instagram, Gojek, atau Tokopedia tidak bekerja seperti itu. Datanya disimpan di **server**, dan aplikasi di ponselmu hanya **meminta** dan **menampilkan** data tersebut.

Di modul ini kamu akan membangun aplikasi **Lapor Fasilitas**. Mahasiswa bisa mendaftar, login, melihat laporan kerusakan fasilitas kampus (proyektor, AC, kursi, dan sebagainya), membuat laporan baru lengkap dengan foto, dan melihat laporan miliknya sendiri. Semua data datang dari API sungguhan yang sudah disiapkan.

### Tujuan pembelajaran

Setelah menyelesaikan modul ini, kamu mampu:

1. Menjelaskan bagaimana aplikasi mobile berkomunikasi dengan server (HTTP, REST, JSON).
2. Membaca dokumentasi API dan mencoba endpoint sebelum menulis kode.
3. Mengubah JSON menjadi objek Dart (dan sebaliknya) dengan model class.
4. Meng-consume API dengan pola yang dipakai di industri: Dio, Repository, error handling, dan state loading/error/empty.
5. Mengimplementasikan autentikasi berbasis token (JWT) dengan penyimpanan yang aman.
6. Mengunggah file gambar dengan `multipart/form-data`.

### Prasyarat

| Dari modul | Yang kamu pakai lagi |
|---|---|
| Modul 2 | `async`/`await`, `Future`, null safety |
| Modul 5 | `ListView.builder`, scroll |
| Modul 6 | `Form`, `TextFormField`, validasi |
| Modul 7 | `setState`, `SnackBar`, `AlertDialog`, `DropdownButtonFormField` |
| Modul 8 | `Navigator.push/pop`, mengirim data antar halaman |
| Modul 9 | `BottomNavigationBar` |

### Rencana waktu

| Sesi | Isi | Perkiraan |
|---|---|---|
| **Sesi 1** | Konsep + Lab 1–3 (menjelajah API, model JSON, daftar laporan) | 4 jam |
| **Sesi 2** | Standar industri + Lab 4–9 (token, login, profil, buat laporan + upload foto, laporan saya, refresh token) | 4 jam |

> 💡 **Cara belajar yang disarankan:** ketik kodenya sendiri, jangan hanya copy-paste. Banyak pelajaran penting ada di error yang kamu temui sendiri.

---

# SESI 1 — Konsep & Fondasi

## A. Bagaimana aplikasi mobile terhubung ke server?

### A.1 Analogi restoran 🍽️

Bayangkan kamu makan di restoran:

| Di restoran | Di dunia aplikasi |
|---|---|
| Kamu (pelanggan) | **Aplikasi mobile** (client) |
| Menu | **Dokumentasi API** (daftar hal yang boleh dipesan) |
| Pelayan | **API** (perantara yang menerima pesanan dan mengantar hasilnya) |
| Dapur | **Server** + **database** |
| Pesanan dan hidangan | **Request** dan **response** |

Kamu tidak masuk ke dapur untuk mengambil makanan sendiri. Aplikasimu juga **tidak terhubung langsung ke database**. Alasannya:

- **Keamanan:** kredensial database tidak boleh ada di aplikasi. Aplikasi bisa dibongkar (decompile) siapa saja.
- **Aturan bisnis:** server yang memutuskan siapa boleh melakukan apa (misalnya hanya pemilik yang boleh menghapus laporannya).
- **Banyak client, satu sumber data:** aplikasi Android, iOS, dan web bisa memakai API yang sama.

### A.2 Alur komunikasinya

```text
┌──────────────┐   1. HTTP Request (HTTPS)    ┌──────────────┐        ┌──────────┐
│  Aplikasi    │ ───────────────────────────▶ │     API      │ ─────▶ │ Database │
│  Flutter     │   GET /api/reports?page=1    │   (Server)   │ ◀───── │          │
│  (Client)    │ ◀─────────────────────────── │              │        └──────────┘
└──────────────┘   2. HTTP Response (JSON)    └──────────────┘
                   status 200 + body JSON
```

1. Aplikasi mengirim **request** lewat internet (dienkripsi dengan HTTPS).
2. Server memproses: cek token, validasi data, baca atau tulis database.
3. Server mengirim **response** berisi **status code** dan **body** (umumnya JSON).
4. Aplikasi mengubah JSON menjadi objek Dart, lalu menampilkannya di UI.

> ⚠️ **Perhatian (untuk nanti saat menjalankan API di laptopmu sendiri):** di Android Emulator, `localhost` berarti *emulator itu sendiri*, bukan laptopmu. Untuk mengakses server di laptop, pakai `10.0.2.2`. Pada modul ini kita memakai API publik, jadi kamu tidak terkena masalah ini.

### A.3 Anatomi HTTP

**Request** terdiri dari:

| Bagian | Contoh | Fungsi |
|---|---|---|
| **Method** | `GET`, `POST` | Jenis aksi yang diminta |
| **URL** | `https://lapor-fasilitas-api.vercel.app/api/reports?page=1&limit=10` | Alamat resource; setelah `?` adalah *query parameter* |
| **Headers** | `Authorization: Bearer eyJ...` | Metadata: identitas, format data |
| **Body** | `{"email": "...", "password": "..."}` | Data yang dikirim (pada POST/PUT/PATCH) |

**Response** terdiri dari **status code**, **headers**, dan **body**.

**Method dan fungsinya (disebut juga operasi CRUD):**

| Method | Aksi | Contoh di API Lapor Fasilitas |
|---|---|---|
| `GET` | Membaca data | `GET /api/reports` — daftar laporan |
| `POST` | Membuat data baru | `POST /api/reports` — buat laporan |
| `PUT` | Mengganti data seluruhnya | `PUT /api/reports/{id}` — ubah laporan |
| `PATCH` | Mengubah sebagian data | `PATCH /api/users/me` — ubah nama/avatar |
| `DELETE` | Menghapus data | `DELETE /api/reports/{id}` |

**Status code yang akan sering kamu temui di modul ini:**

| Kode | Arti | Contoh pada API ini |
|---|---|---|
| `200 OK` | Berhasil | Login berhasil, daftar laporan berhasil dimuat |
| `201 Created` | Data berhasil dibuat | Register, buat laporan, upload foto |
| `400 Bad Request` | Data yang dikirim tidak valid | Email salah format, `condition` bukan nilai yang diizinkan |
| `401 Unauthorized` | Belum login, atau token salah/kedaluwarsa | Memanggil `/api/users/me` tanpa token |
| `403 Forbidden` | Sudah login, tapi tidak punya hak | Mengubah laporan milik orang lain |
| `404 Not Found` | Data tidak ada | ID laporan tidak ditemukan |
| `409 Conflict` | Bentrok dengan data yang ada | Register dengan email yang sudah terdaftar |
| `413 Payload Too Large` | Ukuran data terlalu besar | Foto lebih dari 2 MB |
| `429 Too Many Requests` | Terlalu sering mengirim request | Melebihi batas (rate limit) |
| `5xx` | Masalah di sisi server | Server error |

Pola mudah mengingatnya: **2xx = sukses, 4xx = salah di sisi client (kamu), 5xx = salah di sisi server.**

### A.4 Apa itu REST API?

**REST** (*Representational State Transfer*) adalah gaya merancang API dengan prinsip sederhana:

- **Resource berbentuk kata benda** di URL: `/api/reports`, `/api/users/me`, bukan `/api/getAllReports`.
- **Method menyatakan aksi**: `GET` untuk membaca, `POST` untuk membuat, dan seterusnya.
- **Stateless:** server tidak mengingat kamu antar request. Setiap request harus membawa identitasnya sendiri (itulah fungsi token).
- **Representasi data berupa JSON** yang bisa dibaca oleh bahasa apa pun.

### A.5 JSON dan Dart

**JSON** (*JavaScript Object Notation*) adalah format teks untuk bertukar data. Ini contoh response dari API kita (angka UUID dan nama hanya ilustrasi):

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": "3f1d5c7e-8a21-4b6e-9c0d-1f2a3b4c5d6e",
    "facility_name": "Proyektor Ruang Kelas",
    "location": "Gedung A, Ruang 2.3",
    "condition": "rusak_sedang",
    "status": "baru",
    "description": "Gambar berkedip dan warna menguning.",
    "image_url": null,
    "reporter": {
      "id": "9b2e4a10-55c3-4d7f-8e21-aa01bb02cc03",
      "name": "Budi Santoso"
    },
    "created_at": "2026-11-10T08:30:00.000Z",
    "updated_at": "2026-11-10T08:30:00.000Z"
  }
}
```

**Padanan tipe JSON dengan tipe Dart:**

| JSON | Contoh | Tipe Dart | Catatan |
|---|---|---|---|
| object `{}` | `{"name": "Budi"}` | `Map<String, dynamic>` | Dipakai juga untuk objek bersarang (`reporter`) |
| array `[]` | `[1, 2, 3]` | `List<dynamic>` | Perlu diubah elemen demi elemen |
| string | `"Budi"` | `String` | Tanggal juga berupa string (ISO 8601) → `DateTime.parse` |
| number | `10` | `int` / `double` | |
| boolean | `true` | `bool` | |
| null | `null` | `null` | Field seperti `image_url` bisa `null` → tipenya `String?` |

**Dua proses penting:**

```text
JSON (String) ──jsonDecode──▶ Map<String, dynamic> ──Model.fromJson──▶ Objek Dart   (response)
Objek Dart / Map ──jsonEncode──▶ JSON (String)                                      (request body)
```

> 💡 **Insight Industri — jangan pakai `Map` langsung di UI.**
> Menulis `data['facility_name']` di banyak tempat sangat rawan typo, dan compiler tidak bisa membantumu. Praktik standar: ubah JSON menjadi **model class bertipe** satu kali di lapisan data, lalu UI hanya memakai objek (`report.facilityName`).
> Pada proyek besar, `fromJson`/`toJson` biasanya **dibuat otomatis** dengan *code generation* (`json_serializable`, `freezed`). Di modul ini kamu menulisnya **manual** agar paham apa yang terjadi di balik layar. Lihat panduan resminya di [docs.flutter.dev — JSON and serialization](https://docs.flutter.dev/data-and-backend/serialization/json).

### A.6 Autentikasi: token JWT

Karena REST itu *stateless*, setelah login server memberimu **token**. Setiap request berikutnya wajib membawa token itu di header:

```http
Authorization: Bearer <access_token>
```

API Lapor Fasilitas memakai **dua token**:

| Token | Masa berlaku | Fungsi |
|---|---|---|
| **Access token** (`token`) | 1 jam | Dipakai di setiap request yang butuh login |
| **Refresh token** (`refresh_token`) | 7 hari, **sekali pakai** | Ditukar dengan sepasang token baru ketika access token habis |

Alurnya:

```text
Aplikasi                                       Server
   │  POST /api/auth/login (email, password)     │
   │ ──────────────────────────────────────────▶ │
   │  200: token + refresh_token + user          │
   │ ◀────────────────────────────────────────── │
   │  (simpan token di penyimpanan aman)         │
   │                                             │
   │  GET /api/users/me                          │
   │  Authorization: Bearer <token>              │
   │ ──────────────────────────────────────────▶ │
   │  200: data profil                           │
   │ ◀────────────────────────────────────────── │
   │                                             │
   │  ... 1 jam kemudian, token kedaluwarsa ...  │
   │  GET /api/users/me  → 401                   │
   │  POST /api/auth/refresh (refresh_token)     │
   │  → token baru, lalu ulangi request tadi     │
```

Kenapa tidak membuat satu token berumur panjang saja? Karena jika token bocor, penyerang hanya bisa memakainya sebentar. Refresh token memberi kenyamanan (pengguna tidak perlu login ulang tiap jam) tanpa mengorbankan keamanan.

### A.7 Mengenal API Lapor Fasilitas

- **Base URL:** `https://lapor-fasilitas-api.vercel.app`
- **Dokumentasi interaktif:** `https://lapor-fasilitas-api.vercel.app/docs` (kamu bisa langsung mencoba endpoint dari sana)
- Semua endpoint berawalan `/api`.

**Format response seragam.** Semua response memakai "amplop" (*envelope*) yang sama:

```json
// Sukses (satu objek)
{ "success": true, "message": "OK", "data": { ... } }

// Sukses (daftar + informasi halaman)
{ "success": true, "message": "OK", "data": [ ... ],
  "meta": { "page": 1, "limit": 10, "total": 25, "total_pages": 3 } }

// Gagal
{ "success": false, "message": "Validasi gagal",
  "errors": [ { "field": "email", "message": "Format email tidak valid" } ] }
```

> 💡 **Insight Industri:** format response yang konsisten membuat kamu cukup menulis **satu** cara membaca sukses dan **satu** cara membaca error untuk seluruh aplikasi. Itu yang akan kita lakukan di `ApiException` nanti.

**Endpoint yang akan kamu pakai** (tanda ★ = wajib di modul ini):

| | Method & Path | Login? | Fungsi |
|---|---|---|---|
| ★ | `POST /api/auth/register` | Tidak | Daftar akun (`name`, `email`, `password`) |
| ★ | `POST /api/auth/login` | Tidak | Login → `token`, `refresh_token`, `user` |
| | `POST /api/auth/refresh` | Tidak | Tukar refresh token (Lab 9) |
| ★ | `GET /api/users/me` | **Ya** | Lihat profil sendiri |
| ★ | `GET /api/reports` | Tidak | Daftar semua laporan (`page`, `limit`, `search`, `condition`, `status`) |
| ★ | `GET /api/reports/mine` | **Ya** | Daftar laporan milik sendiri |
| ★ | `POST /api/reports` | **Ya** | Buat laporan |
| ★ | `POST /api/uploads/images` | **Ya** | Upload foto (`multipart/form-data`, field `image`) |
| | `GET /api/reports/summary` | Tidak | Jumlah laporan per kondisi/status (tantangan) |
| | `GET /api/reports/{id}` | Tidak | Detail laporan |
| | `PUT` / `DELETE /api/reports/{id}` | **Ya** | Ubah / hapus laporan milik sendiri (tantangan) |

**Nilai yang diizinkan:**

- `condition`: `baik`, `rusak_ringan`, `rusak_sedang`, `rusak_parah`
- `status`: `baru`, `diproses`, `selesai`

**Aturan upload foto:** format JPG, PNG, atau WebP, maksimal **2 MB**.

> ⚠️ **Perhatian — API ini dipakai bersama satu kelas:**
> - Semua mahasiswa memakai database yang sama, jadi laporanmu **terlihat oleh teman-temanmu**. Gunakan data latihan yang sopan dan jangan masukkan data pribadi.
> - Pakai **password latihan** (misalnya `latihan123`), **bukan password akun aslimu**.
> - Dosen dapat mereset data demo kapan saja. Jika login yang tadinya berhasil tiba-tiba menjawab `401 Email atau password salah`, kemungkinan akunmu terhapus. Cukup register ulang.
> - Request dibatasi per alamat IP (*rate limit*). Jika seluruh kelas memakai Wi-Fi yang sama dan kamu menekan tombol berkali-kali, kamu bisa melihat `429`.
> - Server berjalan di platform *serverless*, jadi request **pertama** setelah lama tidak dipakai bisa terasa lebih lambat. Bersabarlah dan jangan langsung menyimpulkan kodemu salah.

---

## Lab 1 — Menjelajah API tanpa menulis kode (±30 menit)

Seorang developer yang baik **mencoba API dulu** sebelum menulis kode. Dengan begitu, kalau nanti aplikasimu error, kamu tahu apakah masalahnya di API atau di kodemu.

### Langkah 1 — Cek server

1. Buka `https://lapor-fasilitas-api.vercel.app/docs` di browser.
2. Cari endpoint **GET /api/health**, klik **Try it out**, lalu **Execute**.
3. Perhatikan **status code** dan **response body**-nya.

### Langkah 2 — Lihat daftar laporan (tanpa login)

Jalankan **GET /api/reports**. Perhatikan:

- Apakah `data` berupa object atau array?
- Ada berapa item? Berapa `meta.total`?
- Field mana yang nilainya `null`?

Lalu coba isi parameter `limit` = `2` dan `page` = `2`. Apa yang berubah?

### Langkah 3 — Register

Jalankan **POST /api/auth/register** dengan body (ganti dengan datamu):

```json
{
  "name": "Fakhry Firdaus",
  "email": "nama.kamu@example.com",
  "password": "latihan123"
}
```

Jalankan **dua kali**. Status code apa yang kamu dapat pada percobaan kedua?

### Langkah 4 — Login dan Authorize

1. Jalankan **POST /api/auth/login** dengan email dan password tadi.
2. Salin nilai `token` dari response (**bukan** `refresh_token`).
3. Klik tombol **Authorize** (ikon gembok) di bagian atas halaman, tempel token, lalu klik **Authorize**.

### Langkah 5 — Endpoint yang butuh login

Jalankan berurutan:

1. **GET /api/users/me** → profilmu.
2. **GET /api/reports/mine** → seharusnya masih kosong.
3. **POST /api/reports** dengan body:

   ```json
   {
     "facility_name": "AC Ruang Lab",
     "location": "Gedung B, Lab 1",
     "condition": "rusak_ringan",
     "description": "AC bocor dan menetes ke meja."
   }
   ```
4. **GET /api/reports/mine** lagi → laporanmu muncul.

### Langkah 6 — Sengaja membuat error

Catat status code dan `message` untuk tiap percobaan berikut:

| Percobaan | Status code | `message` |
|---|---|---|
| Login dengan password salah | | |
| Register dengan email `abc` (bukan email) | | |
| `GET /api/users/me` setelah klik **Logout** di Authorize | | |
| `POST /api/reports` dengan `"condition": "hancur"` | | |

### Alternatif dengan `curl` (Linux/macOS/Git Bash)

```bash
# Daftar laporan (publik)
curl "https://lapor-fasilitas-api.vercel.app/api/reports?limit=2"

# Login
curl -X POST https://lapor-fasilitas-api.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nama.kamu@example.com","password":"latihan123"}'

# Profil (ganti TOKEN dengan access token kamu)
curl https://lapor-fasilitas-api.vercel.app/api/users/me \
  -H "Authorization: Bearer TOKEN"
```

> ✅ **Checkpoint 1:** kamu bisa menjelaskan (a) perbedaan `token` dan `refresh_token`, (b) mengapa `GET /api/reports` bisa dipanggil tanpa login sedangkan `/api/reports/mine` tidak, dan (c) arti `201`, `400`, `401`, dan `409` berdasarkan percobaanmu sendiri.

---

## Lab 2 — Menyiapkan proyek & model JSON (±60 menit)

### Langkah 1 — Buat proyek dan tambahkan package

```bash
flutter create lapor_fasilitas
cd lapor_fasilitas
flutter pub add dio intl
```

| Package | Fungsi |
|---|---|
| [`dio`](https://pub.dev/packages/dio) | HTTP client: timeout, interceptor, upload file, dll. |
| [`intl`](https://pub.dev/packages/intl) | Memformat tanggal |

### Langkah 2 — Izin internet Android

Buka `android/app/src/main/AndroidManifest.xml`, lalu tambahkan **di dalam `<manifest>` dan di atas `<application>`**:

```xml
<uses-permission android:name="android.permission.INTERNET"/>
```

> ⚠️ **Perhatian:** mode *debug* biasanya tetap bisa mengakses internet walaupun izin ini belum ada. Aplikasi baru gagal terhubung setelah di-build sebagai APK *release*. Jangan sampai lupa.

### Langkah 3 — Struktur folder

Buat struktur berikut di dalam `lib/`:

```text
lib/
├── main.dart
├── core/
│   ├── app_config.dart
│   ├── api_client.dart
│   └── api_exception.dart
├── models/
│   ├── report_enums.dart
│   ├── report.dart
│   ├── user.dart
│   └── paged_result.dart
├── repositories/
│   └── report_repository.dart
├── widgets/
│   ├── error_view.dart
│   └── report_card.dart
└── pages/
    └── report_list_page.dart
```

> 💡 **Insight Industri — pisahkan tanggung jawab.** Kode yang memanggil API **tidak** ditulis di dalam widget. Widget hanya mengurus tampilan; Repository mengurus "ambil data dari mana"; Model mengurus bentuk data. Dampaknya: mengganti API, menambah cache, atau menguji kode jadi jauh lebih mudah. Kita akan melihat polanya penuh di Bagian B.

### Langkah 4 — Konfigurasi (`core/app_config.dart`)

```dart
class AppConfig {
  /// Alamat dasar API. Bisa diganti saat menjalankan aplikasi:
  /// flutter run --dart-define=API_BASE_URL=https://alamat-lain
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://lapor-fasilitas-api.vercel.app',
  );
}
```

> 💡 **Insight Industri:** base URL **tidak ditulis berulang** di setiap pemanggilan. Dengan satu konfigurasi, berpindah dari server *development* ke *production* cukup mengganti satu nilai.

### Langkah 5 — Penanganan error terpusat (`core/api_exception.dart`)

Ada banyak hal yang bisa salah ketika memanggil API: tidak ada internet, server lambat, server menolak (400/401/409), atau bentuk datanya tidak sesuai. Kita ubah semuanya menjadi **satu tipe error** yang mudah dipakai UI.

```dart
import 'package:dio/dio.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  /// Error per field dari server, mis. {'email': 'Format email tidak valid'}
  final Map<String, String> fieldErrors;

  ApiException(
    this.message, {
    this.statusCode,
    this.fieldErrors = const {},
  });

  /// Mengubah error apa pun menjadi ApiException.
  factory ApiException.from(Object error) {
    if (error is ApiException) return error;
    if (error is DioException) return ApiException.fromDio(error);
    return ApiException(
      'Terjadi kesalahan saat memproses data. (${error.runtimeType})',
    );
  }

  factory ApiException.fromDio(DioException e) {
    final response = e.response;

    // Kasus 1: server menjawab dengan status error (400, 401, 404, 409, ...)
    if (response != null) {
      final data = response.data;
      if (data is Map<String, dynamic>) {
        final fieldErrors = <String, String>{};
        final rawErrors = data['errors'];
        if (rawErrors is List) {
          for (final item in rawErrors) {
            if (item is Map<String, dynamic>) {
              fieldErrors[item['field']?.toString() ?? ''] =
                  item['message']?.toString() ?? '';
            }
          }
        }
        return ApiException(
          data['message']?.toString() ?? 'Terjadi kesalahan pada server',
          statusCode: response.statusCode,
          fieldErrors: fieldErrors,
        );
      }
      return ApiException(
        'Terjadi kesalahan pada server (${response.statusCode})',
        statusCode: response.statusCode,
      );
    }

    // Kasus 2: tidak ada response sama sekali (timeout / tidak ada koneksi)
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return ApiException('Koneksi terlalu lama. Coba lagi sebentar.');
      case DioExceptionType.connectionError:
        return ApiException(
          'Tidak dapat terhubung ke server. Periksa koneksi internetmu.',
        );
      default:
        return ApiException('Terjadi kesalahan tak terduga.');
    }
  }

  @override
  String toString() => message;
}
```

### Langkah 6 — Dio client (`core/api_client.dart`)

Untuk sekarang kita buat versi sederhana. Di Sesi 2 kita akan menambahkan token.

```dart
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:lapor_fasilitas/core/app_config.dart';

class ApiClient {
  ApiClient._internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 20),
        headers: {'Accept': 'application/json'},
      ),
    );

    if (kDebugMode) {
      // requestHeader: false agar token di header TIDAK tercetak di log
      dio.interceptors.add(
        LogInterceptor(
          requestHeader: false,
          requestBody: true,
          responseBody: true,
        ),
      );
    }
  }

  /// Satu instance untuk seluruh aplikasi (singleton).
  static final ApiClient instance = ApiClient._internal();

  late final Dio dio;
}
```

Hal yang perlu kamu pahami:

- **Timeout** wajib diatur. Tanpa timeout, aplikasi bisa menunggu tanpa batas saat sinyal buruk.
- **`LogInterceptor`** mencetak request/response di Debug Console. Sangat berguna untuk debugging, tetapi hanya aktif di mode debug dan **tidak mencetak header** supaya token tidak bocor ke log.
- **Singleton**: semua bagian aplikasi memakai satu `Dio` yang sama dan konfigurasinya tidak berulang.

### Langkah 7 — Model enum (`models/report_enums.dart`)

Nilai seperti `rusak_sedang` adalah string milik API. Di dalam aplikasi kita ubah menjadi **enum** agar tidak ada salah ketik, dan agar label tampilannya bisa diatur terpisah.

```dart
enum ReportCondition {
  baik('baik', 'Baik'),
  rusakRingan('rusak_ringan', 'Rusak Ringan'),
  rusakSedang('rusak_sedang', 'Rusak Sedang'),
  rusakParah('rusak_parah', 'Rusak Parah');

  const ReportCondition(this.value, this.label);

  final String value; // persis seperti di API
  final String label; // teks untuk pengguna

  static ReportCondition fromValue(String value) {
    return ReportCondition.values.firstWhere(
      (c) => c.value == value,
      // Defensif: nilai tak dikenal tidak membuat seluruh daftar crash
      orElse: () => ReportCondition.baik,
    );
  }
}

enum ReportStatus {
  baru('baru', 'Baru'),
  diproses('diproses', 'Diproses'),
  selesai('selesai', 'Selesai');

  const ReportStatus(this.value, this.label);

  final String value;
  final String label;

  static ReportStatus fromValue(String value) {
    return ReportStatus.values.firstWhere(
      (s) => s.value == value,
      orElse: () => ReportStatus.baru,
    );
  }
}
```

### Langkah 8 — Model Report (`models/report.dart`)

Perhatikan: field di JSON memakai `snake_case` (`facility_name`), sedangkan konvensi Dart memakai `camelCase` (`facilityName`). `fromJson` adalah tempat "penerjemahannya".

```dart
import 'package:lapor_fasilitas/models/report_enums.dart';

class Reporter {
  final String id;
  final String name;

  const Reporter({required this.id, required this.name});

  factory Reporter.fromJson(Map<String, dynamic> json) {
    return Reporter(
      id: json['id'] as String,
      name: json['name'] as String,
    );
  }
}

class Report {
  final String id;
  final String facilityName;
  final String location;
  final ReportCondition condition;
  final ReportStatus status;
  final String? description; // bisa null
  final String? imageUrl; // bisa null
  final Reporter reporter; // objek bersarang
  final DateTime createdAt;
  final DateTime updatedAt;

  const Report({
    required this.id,
    required this.facilityName,
    required this.location,
    required this.condition,
    required this.status,
    required this.description,
    required this.imageUrl,
    required this.reporter,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Report.fromJson(Map<String, dynamic> json) {
    return Report(
      id: json['id'] as String,
      facilityName: json['facility_name'] as String,
      location: json['location'] as String,
      condition: ReportCondition.fromValue(json['condition'] as String),
      status: ReportStatus.fromValue(json['status'] as String),
      description: json['description'] as String?,
      imageUrl: json['image_url'] as String?,
      reporter: Reporter.fromJson(json['reporter'] as Map<String, dynamic>),
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );
  }
}
```

Perhatikan tiga hal:

1. `as String?` (ada tanda tanya) dipakai untuk field yang **boleh null**. Kalau kamu menulis `as String` padahal nilainya `null`, aplikasi akan crash dengan error `type 'Null' is not a subtype of type 'String'`.
2. Objek bersarang (`reporter`) diubah oleh `fromJson`-nya sendiri.
3. `DateTime.parse` membaca teks ISO 8601. Server mengirim waktu dalam **UTC**; saat menampilkannya kita panggil `.toLocal()`.

### Langkah 9 — Model User (`models/user.dart`)

```dart
class User {
  final String id;
  final String name;
  final String email;
  final String? avatarUrl;
  final DateTime? createdAt; // hanya ada di GET /api/users/me

  const User({
    required this.id,
    required this.name,
    required this.email,
    this.avatarUrl,
    this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      avatarUrl: json['avatar_url'] as String?,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : null,
    );
  }
}
```

### Langkah 10 — Model hasil berhalaman (`models/paged_result.dart`)

Daftar laporan dikirim per halaman (*pagination*). Kita bungkus `data` dan `meta` dalam satu kelas generik agar bisa dipakai ulang.

```dart
class PagedResult<T> {
  final List<T> items;
  final int page;
  final int limit;
  final int total;
  final int totalPages;

  const PagedResult({
    required this.items,
    required this.page,
    required this.limit,
    required this.total,
    required this.totalPages,
  });

  bool get hasMore => page < totalPages;

  factory PagedResult.fromJson(
    Map<String, dynamic> json,
    T Function(Map<String, dynamic>) itemFromJson,
  ) {
    final meta = json['meta'] as Map<String, dynamic>;
    final rawItems = json['data'] as List<dynamic>;

    return PagedResult(
      items: rawItems
          .map((e) => itemFromJson(e as Map<String, dynamic>))
          .toList(),
      page: meta['page'] as int,
      limit: meta['limit'] as int,
      total: meta['total'] as int,
      totalPages: meta['total_pages'] as int,
    );
  }
}
```

> 💡 **Mengapa pagination?** Bayangkan ada 10.000 laporan. Mengunduh semuanya sekaligus membuat aplikasi lambat dan boros kuota. Praktik standar: ambil per halaman (10–20 item), lalu muat halaman berikutnya saat pengguna menggulir.

### Langkah 11 — Bermain dengan JSON di Dart murni

Sebelum menyentuh UI, pastikan kamu paham `jsonDecode` dan `fromJson`. Buat file `tool/json_playground.dart`:

```dart
// ignore_for_file: avoid_print
import 'dart:convert';

import 'package:lapor_fasilitas/models/report.dart';

void main() {
  const jsonString = '''
{
  "success": true,
  "message": "OK",
  "data": {
    "id": "3f1d5c7e-8a21-4b6e-9c0d-1f2a3b4c5d6e",
    "facility_name": "Proyektor Ruang Kelas",
    "location": "Gedung A, Ruang 2.3",
    "condition": "rusak_sedang",
    "status": "baru",
    "description": "Gambar berkedip dan warna menguning.",
    "image_url": null,
    "reporter": { "id": "9b2e4a10-55c3-4d7f-8e21-aa01bb02cc03", "name": "Budi Santoso" },
    "created_at": "2026-11-10T08:30:00.000Z",
    "updated_at": "2026-11-10T08:30:00.000Z"
  }
}
''';

  // 1. String -> Map
  final body = jsonDecode(jsonString) as Map<String, dynamic>;
  print('success       : ${body['success']}');

  final data = body['data'] as Map<String, dynamic>;
  print('facility_name : ${data['facility_name']}');
  print('reporter.name : ${data['reporter']['name']}'); // objek bersarang

  // 2. Map -> objek Report (cara yang benar)
  final report = Report.fromJson(data);
  print('--- setelah fromJson ---');
  print(report.facilityName);
  print(report.condition.label);
  print(report.imageUrl ?? '(tidak ada foto)');
  print(report.createdAt.toLocal());

  // 3. Map -> String JSON (seperti yang dilakukan Dio saat mengirim request body)
  final requestBody = {
    'facility_name': 'Kursi Rusak',
    'location': 'Gedung C, Ruang 1.1',
    'condition': 'rusak_parah',
  };
  print(jsonEncode(requestBody));
}
```

Jalankan:

```bash
dart run tool/json_playground.dart
```

> Jika perintah ini bermasalah di komputermu, salin kelas model dan isi `main()` ke [dartpad.dev](https://dartpad.dev) lalu jalankan di sana.

**Eksperimen (wajib dicoba):**

1. Ubah `"image_url": null` menjadi `"image_url": "https://example.com/a.jpg"`. Apa yang berubah pada output?
2. Hapus baris `"location"` dari JSON. Error apa yang muncul? Baca pesannya dengan teliti.
3. Ubah `"condition": "rusak_sedang"` menjadi `"hancur"`. Mengapa aplikasi tidak crash?

> ✅ **Checkpoint 2:** kamu bisa menjelaskan perbedaan `as String` dan `as String?`, serta mengapa `Report.fromJson` ada di model, bukan di widget.

---

## Lab 3 — Consume API pertama: melihat daftar laporan (±60 menit)

Endpoint pertama yang kita pakai adalah `GET /api/reports`. Ini endpoint **publik**, sehingga kita tidak perlu memikirkan token dulu.

### Langkah 1 — Repository (`repositories/report_repository.dart`)

```dart
import 'package:dio/dio.dart';
import 'package:lapor_fasilitas/core/api_client.dart';
import 'package:lapor_fasilitas/core/api_exception.dart';
import 'package:lapor_fasilitas/models/paged_result.dart';
import 'package:lapor_fasilitas/models/report.dart';

class ReportRepository {
  ReportRepository({Dio? dio}) : _dio = dio ?? ApiClient.instance.dio;

  final Dio _dio;

  /// GET /api/reports — daftar semua laporan (publik)
  Future<PagedResult<Report>> getReports({
    int page = 1,
    int limit = 10,
    String? search,
    ReportCondition? condition,
    ReportStatus? status,
  }) {
    return _fetchList(
      '/api/reports',
      page: page,
      limit: limit,
      search: search,
      condition: condition,
      status: status,
    );
  }

  Future<PagedResult<Report>> _fetchList(
    String path, {
    required int page,
    required int limit,
    String? search,
    ReportCondition? condition,
    ReportStatus? status,
  }) async {
    try {
      final response = await _dio.get(
        path,
        queryParameters: {
          'page': page,
          'limit': limit,
          // Hanya kirim parameter yang diisi
          if (search != null && search.isNotEmpty) 'search': search,
          if (condition != null) 'condition': condition.value,
          if (status != null) 'status': status.value,
        },
      );
      return PagedResult.fromJson(
        response.data as Map<String, dynamic>,
        Report.fromJson,
      );
    } catch (e) {
      // Semua kemungkinan error diubah menjadi satu tipe: ApiException
      throw ApiException.from(e);
    }
  }
}
```

Perhatikan bahwa `ReportRepository` **tidak tahu apa-apa tentang widget**. Ia hanya menerima parameter dan mengembalikan objek bertipe `PagedResult<Report>` atau melempar `ApiException`.

> Pada `ReportCondition? condition` di atas, kita memakai `import` dari `report_enums.dart`. Tambahkan `import 'package:lapor_fasilitas/models/report_enums.dart';` di bagian atas file jika IDE menandainya merah.

### Langkah 2 — Widget `ErrorView` (`widgets/error_view.dart`)

Setiap halaman yang memanggil API butuh tampilan error dengan tombol "Coba lagi". Kita buat satu kali dan pakai berulang.

```dart
import 'package:flutter/material.dart';

class ErrorView extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;

  const ErrorView({super.key, required this.message, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.cloud_off, size: 56, color: Colors.grey),
            const SizedBox(height: 12),
            Text(message, textAlign: TextAlign.center),
            const SizedBox(height: 16),
            FilledButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh),
              label: const Text('Coba lagi'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### Langkah 3 — Widget `ReportCard` (`widgets/report_card.dart`)

```dart
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lapor_fasilitas/models/report.dart';
import 'package:lapor_fasilitas/models/report_enums.dart';

class ReportCard extends StatelessWidget {
  final Report report;

  const ReportCard({super.key, required this.report});

  Color _conditionColor(ReportCondition condition) {
    switch (condition) {
      case ReportCondition.baik:
        return Colors.green;
      case ReportCondition.rusakRingan:
        return Colors.amber;
      case ReportCondition.rusakSedang:
        return Colors.orange;
      case ReportCondition.rusakParah:
        return Colors.red;
    }
  }

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    final date = DateFormat('dd MMM yyyy, HH:mm')
        .format(report.createdAt.toLocal());

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (report.imageUrl != null)
            Image.network(
              report.imageUrl!,
              height: 160,
              width: double.infinity,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => const SizedBox(
                height: 160,
                child: Center(child: Icon(Icons.broken_image, size: 40)),
              ),
            ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(report.facilityName, style: textTheme.titleMedium),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.place, size: 16),
                    const SizedBox(width: 4),
                    Expanded(child: Text(report.location)),
                  ],
                ),
                if (report.description != null &&
                    report.description!.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Text(report.description!),
                ],
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: [
                    Chip(
                      avatar: CircleAvatar(
                        backgroundColor: _conditionColor(report.condition),
                        radius: 6,
                      ),
                      label: Text(report.condition.label),
                    ),
                    Chip(label: Text(report.status.label)),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  'Dilaporkan oleh ${report.reporter.name} • $date',
                  style: textTheme.bodySmall,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

### Langkah 4 — Halaman daftar laporan (`pages/report_list_page.dart`)

Setiap pemanggilan API menghasilkan **empat kemungkinan keadaan** yang harus kamu tangani di UI:

| State | Tampilan |
|---|---|
| **Loading** | `CircularProgressIndicator` |
| **Error** | Pesan + tombol "Coba lagi" |
| **Empty** | "Belum ada laporan" |
| **Success** | Daftar data |

```dart
import 'package:flutter/material.dart';
import 'package:lapor_fasilitas/core/api_exception.dart';
import 'package:lapor_fasilitas/models/paged_result.dart';
import 'package:lapor_fasilitas/models/report.dart';
import 'package:lapor_fasilitas/repositories/report_repository.dart';
import 'package:lapor_fasilitas/widgets/error_view.dart';
import 'package:lapor_fasilitas/widgets/report_card.dart';

class ReportListPage extends StatefulWidget {
  const ReportListPage({super.key});

  @override
  State<ReportListPage> createState() => _ReportListPageState();
}

class _ReportListPageState extends State<ReportListPage> {
  final _repository = ReportRepository();
  late Future<PagedResult<Report>> _future;

  @override
  void initState() {
    super.initState();
    _future = _repository.getReports(); // dipanggil SEKALI di sini
  }

  void _reload() {
    setState(() {
      _future = _repository.getReports();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Lapor Fasilitas')),
      body: FutureBuilder<PagedResult<Report>>(
        future: _future,
        builder: (context, snapshot) {
          // 1. Loading
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          // 2. Error
          if (snapshot.hasError) {
            final error = snapshot.error;
            final message = error is ApiException
                ? error.message
                : 'Terjadi kesalahan tak terduga.';
            return ErrorView(message: message, onRetry: _reload);
          }

          // 3. Empty
          final reports = snapshot.data!.items;
          if (reports.isEmpty) {
            return const Center(child: Text('Belum ada laporan'));
          }

          // 4. Success
          return RefreshIndicator(
            onRefresh: () async => _reload(),
            child: ListView.builder(
              physics: const AlwaysScrollableScrollPhysics(),
              itemCount: reports.length,
              itemBuilder: (context, index) =>
                  ReportCard(report: reports[index]),
            ),
          );
        },
      ),
    );
  }
}
```

> ⚠️ **Kesalahan paling umum:** menulis `future: _repository.getReports()` **langsung di dalam `build()`**. `build()` dipanggil berkali-kali (rotasi layar, `setState`, keyboard muncul), sehingga API ikut terpanggil berkali-kali. Simpan `Future` di variabel (`_future`) yang diisi di `initState()`, seperti pada kode di atas.

### Langkah 5 — `main.dart`

```dart
import 'package:flutter/material.dart';
import 'package:lapor_fasilitas/pages/report_list_page.dart';

void main() {
  runApp(const LaporFasilitasApp());
}

class LaporFasilitasApp extends StatelessWidget {
  const LaporFasilitasApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Lapor Fasilitas',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
      home: const ReportListPage(),
    );
  }
}
```

### Langkah 6 — Jalankan dan amati

```bash
flutter run -d chrome        # atau pilih emulator Android
```

Lihat **Debug Console**. Berkat `LogInterceptor`, kamu bisa melihat request dan response JSON-nya. Bandingkan dengan yang kamu lihat di Swagger pada Lab 1.

**Uji tiga skenario:**

1. **Normal:** daftar laporan muncul.
2. **Tanpa internet:** matikan Wi-Fi/data emulator lalu tekan **Coba lagi**. Pesan error apa yang muncul?
3. **Pull-to-refresh:** tarik daftar ke bawah. Apakah ada request baru di console?

> ✅ **Checkpoint 3:** aplikasimu menampilkan daftar laporan dari server, dan kamu bisa menunjukkan keempat state (loading, error, empty, success). Kamu bisa menjelaskan mengapa `getReports()` dipanggil di `initState()` dan bukan di `build()`.

---

## Tantangan Sesi 1

**⭐ Mudah — Tampilkan jumlah laporan.** Tampilkan `meta.total` di `AppBar` (misalnya "Lapor Fasilitas (25)"). Petunjuk: nilainya ada di `snapshot.data!.total`.

**⭐⭐ Sedang — Filter kondisi.** Tambahkan deretan `ChoiceChip` ("Semua", "Baik", "Rusak Ringan", ...) di atas daftar. Saat dipilih, panggil `getReports(condition: ...)`. Petunjuk: `ReportCondition.values` bisa dipakai untuk membuat chip-nya.

**⭐⭐⭐ Menantang — Dasbor ringkasan.** Buat model `ReportSummary` untuk endpoint `GET /api/reports/summary`, lalu tampilkan kartu jumlah laporan per kondisi dan per status di bagian atas halaman. Petunjuk: lihat bentuk response-nya di Swagger terlebih dahulu (`data.total`, `data.by_condition`, `data.by_status`).

---

# SESI 2 — Standar Industri, Autentikasi, & Upload

## B. Meng-consume API sesuai standar industri

Di Sesi 1 kamu sudah memakai sebagian pola industri tanpa disadari. Sekarang kita rangkum.

### B.1 Arsitektur berlapis

```text
┌─────────────────────────────────────────────┐
│  UI (Pages & Widgets)                       │  ← hanya urusan tampilan & interaksi
├─────────────────────────────────────────────┤
│  Repository (ReportRepository, AuthRepo...) │  ← "ambil/kirim data apa, ke mana"
├─────────────────────────────────────────────┤
│  API Client (Dio + Interceptor)             │  ← urusan HTTP: base URL, token, timeout
├─────────────────────────────────────────────┤
│  Model (Report, User, ...)                  │  ← bentuk data + fromJson
└─────────────────────────────────────────────┘
                     │ HTTPS + JSON
                     ▼
                  REST API
```

| Lapisan | Tanggung jawab | Tidak boleh |
|---|---|---|
| **UI** | Menampilkan state, menangkap input | Memanggil `Dio` atau `jsonDecode` langsung |
| **Repository** | Memanggil API, mengubah JSON → model, mengubah error → `ApiException` | Mengenal `BuildContext`/widget |
| **API Client** | Konfigurasi HTTP, menempel token, logging | Mengenal aturan bisnis aplikasi |
| **Model** | Menyimpan data & parsing | Memanggil jaringan |

Pada proyek yang lebih besar, di atas Repository biasanya ada lapisan **state management** (Provider, Riverpod, atau Bloc) yang menjadi topik berikutnya. Prinsipnya sama, yaitu UI tidak berbicara langsung dengan jaringan.

### B.2 `http` atau `dio`?

| | `http` (resmi dari tim Dart) | `dio` |
|---|---|---|
| Kelebihan | Ringan, sederhana | Interceptor, timeout bawaan, upload `FormData`, progress, pembatalan request |
| Cocok untuk | Latihan, kebutuhan sederhana | Aplikasi nyata yang butuh token, refresh token, upload |

Keduanya sah dipakai. Karena aplikasi kita butuh interceptor untuk token dan upload file, kita memakai **Dio**, pilihan yang sangat umum di proyek Flutter.

### B.3 Daftar praktik standar

| # | Praktik | Di modul ini |
|---|---|---|
| 1 | **Model bertipe**, bukan `Map` mentah di UI | `Report`, `User` |
| 2 | **Repository** memisahkan UI dari jaringan | `*Repository` |
| 3 | **Satu client** terkonfigurasi (base URL, timeout, header) | `ApiClient` |
| 4 | **Error dipetakan** ke satu tipe, dengan pesan ramah pengguna | `ApiException` |
| 5 | **Empat state UI**: loading, success, empty, error + retry | Lab 3 |
| 6 | **Token otomatis** lewat interceptor, bukan ditempel manual tiap request | Lab 4 |
| 7 | **Token disimpan aman** (Keychain/Keystore), bukan di Shared Preferences | Lab 4 |
| 8 | **Refresh token otomatis** saat access token kedaluwarsa | Lab 9 |
| 9 | **Pagination** untuk daftar panjang | Lab 8 |
| 10 | **Konfigurasi lewat `--dart-define`**, tanpa rahasia di kode | `AppConfig` |
| 11 | **HTTPS saja**; token tidak masuk log | `LogInterceptor` |
| 12 | Cek **`mounted`** sebelum `setState` / `Navigator` setelah `await` | Semua lab |

> 💡 **Insight Industri — rahasia tidak boleh ada di aplikasi.**
> Aplikasi mobile bisa dibongkar. Kunci rahasia (misalnya `X-Admin-Key` yang dipakai dosen untuk endpoint admin pada API ini) **tidak boleh ditanam di aplikasi**. Itulah sebabnya endpoint admin tidak kita sentuh di modul ini. Aplikasi hanya memegang token milik pengguna yang login.

> 💡 **Insight Industri — kenapa bukan Shared Preferences untuk token?**
> Shared Preferences menyimpan data sebagai teks biasa. Di perangkat yang di-root, atau lewat backup, isinya mudah dibaca. Token adalah "kunci rumah" milik pengguna, jadi simpan di **secure storage**: iOS Keychain dan Android Keystore (diakses lewat package [`flutter_secure_storage`](https://pub.dev/packages/flutter_secure_storage)).

> 💡 **Insight Industri — di luar modul ini.**
> Tim besar sering membuat client API secara otomatis dari file OpenAPI (kamu sudah melihat dokumentasinya di `/docs`), memakai package seperti Retrofit atau generator OpenAPI, dan menulis unit test repository dengan Dio palsu (*mock*). Konsep dasarnya sama dengan yang kamu pelajari di sini.

---

## Lab 4 — Fondasi autentikasi: TokenStorage & AuthInterceptor (±30 menit)

### Langkah 1 — Tambah package

```bash
flutter pub add flutter_secure_storage image_picker
```

(`image_picker` dipakai di Lab 7.)

> ⚠️ **Perhatian:** jika build Android gagal dengan pesan tentang `minSdkVersion` setelah menambahkan `flutter_secure_storage`, naikkan `minSdk` di `android/app/build.gradle` (atau `build.gradle.kts`) sesuai pesan error yang muncul. Setelah menambah package yang punya kode native, hentikan aplikasi lalu jalankan ulang dengan `flutter run` (hot reload saja tidak cukup).

### Langkah 2 — `core/token_storage.dart`

```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class TokenStorage {
  static const _accessKey = 'access_token';
  static const _refreshKey = 'refresh_token';

  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await _storage.write(key: _accessKey, value: accessToken);
    await _storage.write(key: _refreshKey, value: refreshToken);
  }

  Future<String?> get accessToken => _storage.read(key: _accessKey);

  Future<String?> get refreshToken => _storage.read(key: _refreshKey);

  Future<void> clear() async {
    await _storage.delete(key: _accessKey);
    await _storage.delete(key: _refreshKey);
  }
}
```

### Langkah 3 — `core/auth_interceptor.dart`

**Interceptor** adalah "penjaga gerbang": ia mencegat **setiap** request sebelum dikirim. Kita memakainya untuk menempelkan token otomatis, jadi kamu tidak perlu menulis header `Authorization` di tiap repository.

```dart
import 'package:dio/dio.dart';
import 'package:lapor_fasilitas/core/token_storage.dart';

class AuthInterceptor extends Interceptor {
  AuthInterceptor(this._tokenStorage);

  final TokenStorage _tokenStorage;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await _tokenStorage.accessToken;
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options); // lanjutkan request
  }
}
```

### Langkah 4 — Perbarui `core/api_client.dart`

Ganti isi file dengan versi berikut:

```dart
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:lapor_fasilitas/core/app_config.dart';
import 'package:lapor_fasilitas/core/auth_interceptor.dart';
import 'package:lapor_fasilitas/core/token_storage.dart';

class ApiClient {
  ApiClient._internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 20),
        headers: {'Accept': 'application/json'},
      ),
    );

    dio.interceptors.add(AuthInterceptor(tokenStorage));

    if (kDebugMode) {
      dio.interceptors.add(
        LogInterceptor(
          requestHeader: false,
          requestBody: true,
          responseBody: true,
        ),
      );
    }
  }

  static final ApiClient instance = ApiClient._internal();

  final TokenStorage tokenStorage = TokenStorage();
  late final Dio dio;
}
```

> ✅ **Checkpoint 4:** proyek masih berjalan seperti di Sesi 1 (daftar laporan tetap tampil). Kamu bisa menjelaskan apa yang dilakukan `AuthInterceptor` dan mengapa lebih baik daripada menulis header `Authorization` di setiap repository.

---

## Lab 5 — Register & Login (±50 menit)

### Langkah 1 — `repositories/auth_repository.dart`

```dart
import 'package:dio/dio.dart';
import 'package:lapor_fasilitas/core/api_client.dart';
import 'package:lapor_fasilitas/core/api_exception.dart';
import 'package:lapor_fasilitas/core/token_storage.dart';
import 'package:lapor_fasilitas/models/user.dart';

class AuthRepository {
  AuthRepository({Dio? dio, TokenStorage? tokenStorage})
      : _dio = dio ?? ApiClient.instance.dio,
        _tokenStorage = tokenStorage ?? ApiClient.instance.tokenStorage;

  final Dio _dio;
  final TokenStorage _tokenStorage;

  /// POST /api/auth/register
  Future<User> register({
    required String name,
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post(
        '/api/auth/register',
        data: {'name': name, 'email': email, 'password': password},
      );
      return User.fromJson(response.data['data'] as Map<String, dynamic>);
    } catch (e) {
      throw ApiException.from(e);
    }
  }

  /// POST /api/auth/login — menyimpan token, lalu mengembalikan data user
  Future<User> login({required String email, required String password}) async {
    try {
      final response = await _dio.post(
        '/api/auth/login',
        data: {'email': email, 'password': password},
      );
      final data = response.data['data'] as Map<String, dynamic>;

      await _tokenStorage.saveTokens(
        accessToken: data['token'] as String,
        refreshToken: data['refresh_token'] as String,
      );

      return User.fromJson(data['user'] as Map<String, dynamic>);
    } catch (e) {
      throw ApiException.from(e);
    }
  }

  Future<bool> isLoggedIn() async => (await _tokenStorage.accessToken) != null;

  /// API ini tidak punya endpoint logout, jadi cukup hapus token di perangkat.
  Future<void> logout() => _tokenStorage.clear();
}
```

Perhatikan: `data` yang dikirim berupa `Map`. Dio otomatis mengubahnya menjadi JSON dan memberi header `Content-Type: application/json`. Kamu tidak perlu memanggil `jsonEncode` sendiri.

### Langkah 2 — Halaman Login (`pages/login_page.dart`)

```dart
import 'package:flutter/material.dart';
import 'package:lapor_fasilitas/core/api_exception.dart';
import 'package:lapor_fasilitas/pages/register_page.dart';
import 'package:lapor_fasilitas/repositories/auth_repository.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authRepository = AuthRepository();

  bool _isLoading = false;
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    try {
      await _authRepository.login(
        email: _emailController.text.trim(),
        password: _passwordController.text,
      );
      if (!mounted) return;
      _goToHome();
    } on ApiException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.message)),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _goToHome() {
    // SEMENTARA: halaman placeholder. Akan diganti di Lab 6 dan Lab 8.
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => const Scaffold(
          body: Center(child: Text('Login berhasil! 🎉')),
        ),
      ),
    );
  }

  Future<void> _openRegister() async {
    // RegisterPage mengembalikan email jika registrasi berhasil
    final email = await Navigator.push<String>(
      context,
      MaterialPageRoute(builder: (_) => const RegisterPage()),
    );
    if (email != null) _emailController.text = email;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  const Icon(Icons.report_problem_outlined, size: 64),
                  const SizedBox(height: 8),
                  Text(
                    'Lapor Fasilitas',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 24),
                  TextFormField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(
                      labelText: 'Email',
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) {
                      final text = value?.trim() ?? '';
                      if (text.isEmpty) return 'Email wajib diisi';
                      final isEmail =
                          RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(text);
                      return isEmail ? null : 'Format email tidak valid';
                    },
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _passwordController,
                    obscureText: _obscurePassword,
                    decoration: InputDecoration(
                      labelText: 'Password',
                      border: const OutlineInputBorder(),
                      suffixIcon: IconButton(
                        icon: Icon(_obscurePassword
                            ? Icons.visibility
                            : Icons.visibility_off),
                        onPressed: () => setState(
                            () => _obscurePassword = !_obscurePassword),
                      ),
                    ),
                    validator: (value) => (value == null || value.isEmpty)
                        ? 'Password wajib diisi'
                        : null,
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: _isLoading ? null : _submit,
                      child: _isLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Text('Login'),
                    ),
                  ),
                  TextButton(
                    onPressed: _isLoading ? null : _openRegister,
                    child: const Text('Belum punya akun? Daftar'),
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

Tiga detail yang membedakan kode "layak produksi" dari kode latihan biasa:

1. **Tombol dinonaktifkan saat loading** (`onPressed: _isLoading ? null : _submit`). Tanpa ini, pengguna bisa menekan tombol berkali-kali dan mengirim banyak request.
2. **`if (!mounted) return;`** setelah setiap `await`. Pengguna bisa saja meninggalkan halaman sebelum request selesai.
3. **`finally`** memastikan loading selalu dimatikan, baik berhasil maupun gagal.

### Langkah 3 — Halaman Register (`pages/register_page.dart`)

Strukturnya mirip Login. Bagian yang baru: kita **menampilkan pesan error per field dari server**.

```dart
import 'package:flutter/material.dart';
import 'package:lapor_fasilitas/core/api_exception.dart';
import 'package:lapor_fasilitas/repositories/auth_repository.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authRepository = AuthRepository();

  bool _isLoading = false;
  Map<String, String> _serverErrors = {}; // error per field dari server

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() => _serverErrors = {});
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    try {
      final email = _emailController.text.trim();
      await _authRepository.register(
        name: _nameController.text.trim(),
        email: email,
        password: _passwordController.text,
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Registrasi berhasil, silakan login')),
      );
      Navigator.pop(context, email); // kirim email kembali ke halaman login
    } on ApiException catch (e) {
      if (!mounted) return;
      setState(() => _serverErrors = e.fieldErrors);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.message)),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Daftar Akun')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(
                  labelText: 'Nama lengkap',
                  border: const OutlineInputBorder(),
                  errorText: _serverErrors['name'],
                ),
                validator: (v) =>
                    (v == null || v.trim().isEmpty) ? 'Nama wajib diisi' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  labelText: 'Email',
                  border: const OutlineInputBorder(),
                  errorText: _serverErrors['email'],
                ),
                validator: (v) {
                  final text = v?.trim() ?? '';
                  if (text.isEmpty) return 'Email wajib diisi';
                  final isEmail =
                      RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(text);
                  return isEmail ? null : 'Format email tidak valid';
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                obscureText: true,
                decoration: InputDecoration(
                  labelText: 'Password (minimal 6 karakter)',
                  border: const OutlineInputBorder(),
                  errorText: _serverErrors['password'],
                ),
                validator: (v) => (v == null || v.length < 6)
                    ? 'Password minimal 6 karakter'
                    : null,
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: _isLoading ? null : _submit,
                  child: _isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Daftar'),
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

> 💡 **Insight Industri — validasi dua lapis.** Validasi di aplikasi (`validator`) memberi umpan balik instan, tetapi **server tetap melakukan validasi sendiri** karena aplikasi tidak bisa dipercaya sepenuhnya. Karena itu aplikasi harus siap menampilkan error dari server, seperti `409 Email sudah terdaftar` atau `errors` per field.

### Langkah 4 — Jadikan `LoginPage` halaman awal

Di `main.dart`, ubah `home: const ReportListPage()` menjadi `home: const LoginPage()` (jangan lupa `import`-nya).

### Langkah 5 — Uji

1. Daftar akun baru → kembali ke halaman login dengan email terisi otomatis.
2. Daftar dengan email yang sama → `409`.
3. Login dengan password salah → `401` ("Email atau password salah").
4. Login dengan benar → placeholder "Login berhasil".
5. Lihat Debug Console: **tidak ada token** di header yang tercetak. Itu disengaja.

> ⚠️ **Perhatian:** `401` pada endpoint login berarti *kredensial salah*, bukan *token kedaluwarsa*. Kita memperlakukan keduanya berbeda saat membuat refresh token di Lab 9.

> ✅ **Checkpoint 5:** register dan login berhasil, pesan error dari server tampil, dan tombol tidak bisa ditekan dua kali saat loading.

---

## Lab 6 — Lihat profil & logout (±25 menit)

### Langkah 1 — Tambah method di `AuthRepository`

```dart
  /// GET /api/users/me — butuh token (ditempel otomatis oleh AuthInterceptor)
  Future<User> getProfile() async {
    try {
      final response = await _dio.get('/api/users/me');
      return User.fromJson(response.data['data'] as Map<String, dynamic>);
    } catch (e) {
      throw ApiException.from(e);
    }
  }
```

Perhatikan: tidak ada kode token sama sekali di sini. Itulah hasil kerja interceptor.

### Langkah 2 — `pages/profile_page.dart`

```dart
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lapor_fasilitas/core/api_exception.dart';
import 'package:lapor_fasilitas/models/user.dart';
import 'package:lapor_fasilitas/pages/login_page.dart';
import 'package:lapor_fasilitas/repositories/auth_repository.dart';
import 'package:lapor_fasilitas/widgets/error_view.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final _authRepository = AuthRepository();
  late Future<User> _future;

  @override
  void initState() {
    super.initState();
    _future = _authRepository.getProfile();
  }

  void _reload() {
    setState(() => _future = _authRepository.getProfile());
  }

  Future<void> _logout() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Keluar?'),
        content: const Text('Kamu perlu login lagi untuk melihat laporanmu.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Batal'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Keluar'),
          ),
        ],
      ),
    );
    if (confirm != true) return;

    await _authRepository.logout();
    if (!mounted) return;
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const LoginPage()),
      (route) => false, // hapus seluruh riwayat halaman
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profil')),
      body: FutureBuilder<User>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            final error = snapshot.error;
            return ErrorView(
              message: error is ApiException
                  ? error.message
                  : 'Terjadi kesalahan tak terduga.',
              onRetry: _reload,
            );
          }

          final user = snapshot.data!;
          final initial =
              user.name.isNotEmpty ? user.name[0].toUpperCase() : '?';

          return ListView(
            padding: const EdgeInsets.all(24),
            children: [
              Center(
                child: CircleAvatar(
                  radius: 48,
                  backgroundImage: user.avatarUrl != null
                      ? NetworkImage(user.avatarUrl!)
                      : null,
                  child: user.avatarUrl == null
                      ? Text(initial, style: const TextStyle(fontSize: 32))
                      : null,
                ),
              ),
              const SizedBox(height: 16),
              Center(
                child: Text(
                  user.name,
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
              ),
              Center(child: Text(user.email)),
              if (user.createdAt != null) ...[
                const SizedBox(height: 8),
                Center(
                  child: Text(
                    'Bergabung sejak '
                    '${DateFormat('dd MMM yyyy').format(user.createdAt!.toLocal())}',
                  ),
                ),
              ],
              const SizedBox(height: 32),
              OutlinedButton.icon(
                onPressed: _logout,
                icon: const Icon(Icons.logout),
                label: const Text('Keluar'),
              ),
            ],
          );
        },
      ),
    );
  }
}
```

### Langkah 3 — Arahkan login ke halaman profil

Di `login_page.dart`, ganti isi `_goToHome()` agar membuka `ProfilePage` (tambahkan `import`-nya):

```dart
  void _goToHome() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const ProfilePage()),
    );
  }
```

### Langkah 4 — Uji

1. Login → nama dan email yang tampil sama dengan yang kamu daftarkan.
2. Tekan **Keluar** → kembali ke Login dan tidak bisa kembali dengan tombol *back*.
3. Tutup aplikasi sepenuhnya lalu buka lagi. Kamu masih harus login karena kita belum memeriksa token saat startup (diperbaiki di Lab 8).

> ✅ **Checkpoint 6:** halaman profil memuat data dari `GET /api/users/me` **tanpa** kamu menulis header token di kode repository.

---

## Lab 7 — Upload foto & buat laporan (±45 menit)

Ini lab paling menarik karena melibatkan **dua request berurutan**:

```text
1. POST /api/uploads/images   (multipart)  ──▶  { "data": { "url": "https://res.cloudinary.com/..." } }
2. POST /api/reports          (JSON)       ──▶  body menyertakan "image_url": "<url dari langkah 1>"
```

API tidak menerima file di dalam laporan. Foto diunggah lebih dulu, lalu **URL**-nya dilampirkan ke laporan. Ini pola yang sangat umum di industri (file ke penyimpanan terpisah, data hanya menyimpan tautannya).

### Langkah 1 — Izin untuk memilih foto (khusus iOS)

Jika kamu menguji di iOS, tambahkan di `ios/Runner/Info.plist`:

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>Aplikasi memerlukan akses galeri untuk melampirkan foto laporan.</string>
```

Di Android dan Chrome tidak diperlukan konfigurasi tambahan.

### Langkah 2 — `repositories/upload_repository.dart`

```dart
import 'package:dio/dio.dart';
import 'package:image_picker/image_picker.dart';
import 'package:lapor_fasilitas/core/api_client.dart';
import 'package:lapor_fasilitas/core/api_exception.dart';

class UploadRepository {
  UploadRepository({Dio? dio}) : _dio = dio ?? ApiClient.instance.dio;

  final Dio _dio;

  /// POST /api/uploads/images — mengembalikan URL foto
  Future<String> uploadImage(XFile file) async {
    try {
      final bytes = await file.readAsBytes();
      final mimeType = file.mimeType ?? _guessMimeType(file.name);

      final formData = FormData.fromMap({
        // Nama field HARUS "image" sesuai dokumentasi API
        'image': MultipartFile.fromBytes(
          bytes,
          filename: file.name,
          contentType: DioMediaType.parse(mimeType),
        ),
      });

      final response = await _dio.post('/api/uploads/images', data: formData);
      return response.data['data']['url'] as String;
    } catch (e) {
      throw ApiException.from(e);
    }
  }

  String _guessMimeType(String filename) {
    final ext = filename.split('.').last.toLowerCase();
    switch (ext) {
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  }
}
```

> ⚠️ **Jebakan #1 — `contentType` wajib diisi.** Secara bawaan Dio mengirim file dengan tipe `application/octet-stream`. Server hanya menerima `image/jpeg`, `image/png`, dan `image/webp`, jadi tanpa `contentType` kamu akan selalu mendapat `400 Format gambar harus JPG, PNG, atau WebP` walaupun fotonya benar. Itulah alasan kita menentukan tipenya sendiri.
>
> Jika IDE-mu tidak mengenali `DioMediaType` (versi Dio lebih lama dari 5.8), gunakan `MediaType.parse(mimeType)` dari `package:http_parser/http_parser.dart`.

> ⚠️ **Jebakan #2 — nama field.** Server membaca file dari field bernama `image`. Jika kamu menulis `'file'` atau `'photo'`, server menjawab `400 Field "image" wajib diisi`.

> ⚠️ **Jebakan #3 — jangan atur `Content-Type` manual.** Untuk `FormData`, Dio mengisi `multipart/form-data` **beserta boundary-nya** secara otomatis. Kalau kamu menimpanya sendiri, boundary hilang dan upload gagal.

### Langkah 3 — Tambah `createReport` di `ReportRepository`

```dart
  /// POST /api/reports — butuh token
  Future<Report> createReport({
    required String facilityName,
    required String location,
    required ReportCondition condition,
    String? description,
    String? imageUrl,
  }) async {
    try {
      final response = await _dio.post(
        '/api/reports',
        data: {
          'facility_name': facilityName,
          'location': location,
          'condition': condition.value,
          // Field opsional: KIRIM HANYA JIKA ADA isinya
          if (description != null && description.trim().isNotEmpty)
            'description': description.trim(),
          if (imageUrl != null) 'image_url': imageUrl,
        },
      );
      return Report.fromJson(response.data['data'] as Map<String, dynamic>);
    } catch (e) {
      throw ApiException.from(e);
    }
  }
```

> ⚠️ **Jebakan #4 — jangan kirim string kosong untuk `image_url`.** Server memvalidasi `image_url` harus berupa URL. Mengirim `"image_url": ""` menghasilkan `400 Validasi gagal`. Karena itu field opsional **dihilangkan** jika tidak ada isinya, bukan dikirim sebagai `""`. Perhatikan sintaks `if (...) 'key': value` di dalam map pada kode di atas.

### Langkah 4 — `pages/create_report_page.dart`

```dart
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:lapor_fasilitas/core/api_exception.dart';
import 'package:lapor_fasilitas/models/report_enums.dart';
import 'package:lapor_fasilitas/repositories/report_repository.dart';
import 'package:lapor_fasilitas/repositories/upload_repository.dart';

class CreateReportPage extends StatefulWidget {
  const CreateReportPage({super.key});

  @override
  State<CreateReportPage> createState() => _CreateReportPageState();
}

class _CreateReportPageState extends State<CreateReportPage> {
  final _formKey = GlobalKey<FormState>();
  final _facilityController = TextEditingController();
  final _locationController = TextEditingController();
  final _descriptionController = TextEditingController();

  final _picker = ImagePicker();
  final _reportRepository = ReportRepository();
  final _uploadRepository = UploadRepository();

  ReportCondition? _condition;
  XFile? _pickedImage;
  Uint8List? _imageBytes;
  String? _uploadedImageUrl; // disimpan agar tidak upload ulang saat mencoba lagi
  String _statusText = '';
  bool _isSubmitting = false;

  @override
  void dispose() {
    _facilityController.dispose();
    _locationController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final picked = await _picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 1280, // perkecil resolusi
      imageQuality: 80, // kompres agar di bawah batas 2 MB
    );
    if (picked == null) return;

    final bytes = await picked.readAsBytes();
    if (!mounted) return;
    setState(() {
      _pickedImage = picked;
      _imageBytes = bytes;
      _uploadedImageUrl = null; // foto diganti → perlu upload ulang
    });
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);
    try {
      // Langkah 1: upload foto (jika ada dan belum pernah berhasil diunggah)
      if (_pickedImage != null && _uploadedImageUrl == null) {
        setState(() => _statusText = 'Mengunggah foto...');
        _uploadedImageUrl = await _uploadRepository.uploadImage(_pickedImage!);
        if (!mounted) return;
      }

      // Langkah 2: kirim laporan
      setState(() => _statusText = 'Menyimpan laporan...');
      await _reportRepository.createReport(
        facilityName: _facilityController.text.trim(),
        location: _locationController.text.trim(),
        condition: _condition!,
        description: _descriptionController.text,
        imageUrl: _uploadedImageUrl,
      );
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Laporan berhasil dikirim')),
      );
      Navigator.pop(context, true); // beri tahu halaman sebelumnya: ada data baru
    } on ApiException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.message)),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
          _statusText = '';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Buat Laporan')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextFormField(
                controller: _facilityController,
                decoration: const InputDecoration(
                  labelText: 'Nama fasilitas',
                  hintText: 'mis. Proyektor Ruang Kelas',
                  border: OutlineInputBorder(),
                ),
                validator: (v) => (v == null || v.trim().isEmpty)
                    ? 'Nama fasilitas wajib diisi'
                    : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _locationController,
                decoration: const InputDecoration(
                  labelText: 'Lokasi',
                  hintText: 'mis. Gedung A, Ruang 2.3',
                  border: OutlineInputBorder(),
                ),
                validator: (v) => (v == null || v.trim().isEmpty)
                    ? 'Lokasi wajib diisi'
                    : null,
              ),
              const SizedBox(height: 16),
              // Jika muncul peringatan "deprecated" di Flutter terbaru,
              // ganti parameter `value` menjadi `initialValue`.
              DropdownButtonFormField<ReportCondition>(
                value: _condition,
                decoration: const InputDecoration(
                  labelText: 'Kondisi fasilitas',
                  border: OutlineInputBorder(),
                ),
                items: ReportCondition.values
                    .map((c) => DropdownMenuItem(value: c, child: Text(c.label)))
                    .toList(),
                onChanged: (c) => setState(() => _condition = c),
                validator: (c) => c == null ? 'Pilih kondisi fasilitas' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _descriptionController,
                maxLines: 4,
                maxLength: 1000,
                decoration: const InputDecoration(
                  labelText: 'Deskripsi (opsional)',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 8),
              if (_imageBytes != null)
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.memory(
                    _imageBytes!,
                    height: 180,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                ),
              OutlinedButton.icon(
                onPressed: _isSubmitting ? null : _pickImage,
                icon: const Icon(Icons.photo_library),
                label: Text(_imageBytes == null ? 'Pilih foto' : 'Ganti foto'),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: _isSubmitting ? null : _submit,
                  icon: const Icon(Icons.send),
                  label: const Text('Kirim laporan'),
                ),
              ),
              if (_isSubmitting) ...[
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(
                      height: 16,
                      width: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    ),
                    const SizedBox(width: 12),
                    Text(_statusText),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
```

Hal penting dalam kode ini:

- **`maxWidth` dan `imageQuality`** pada `pickImage` mengecilkan foto sebelum diunggah. Foto kamera ponsel modern bisa 3–10 MB, melewati batas server (2 MB → `413`).
- **`_uploadedImageUrl`** menyimpan URL foto yang berhasil diunggah. Jika upload sukses tetapi pembuatan laporan gagal (misalnya sinyal putus), saat pengguna menekan "Kirim" lagi, foto **tidak diunggah ulang**.
- **`Navigator.pop(context, true)`** mengirim sinyal ke halaman sebelumnya agar memuat ulang daftar.
- **`Image.memory`** dipakai untuk pratinjau karena bekerja di mobile maupun web.

### Langkah 5 — Tombol untuk membuka halaman buat laporan (sementara)

Karena navigasi utama baru dibuat di Lab 8, sementara tambahkan tombol di `ReportListPage` (Sesi 1). Di dalam `Scaffold`, tambahkan:

```dart
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          final created = await Navigator.push<bool>(
            context,
            MaterialPageRoute(builder: (_) => const CreateReportPage()),
          );
          if (created == true) _reload();
        },
        icon: const Icon(Icons.add_a_photo),
        label: const Text('Lapor'),
      ),
```

Lalu ubah `home` di `main.dart` menjadi `ReportListPage()` supaya kamu bisa menguji. Sebelumnya pastikan kamu sudah login (token tersimpan dari Lab 5).

### Langkah 6 — Uji

1. Buat laporan **tanpa foto** → muncul di daftar paling atas.
2. Buat laporan **dengan foto** → fotonya tampil di kartu.
3. Biarkan kolom nama kosong lalu kirim → validasi aplikasi menahan, tidak ada request ke server.
4. Lihat Debug Console untuk dua request berurutan: `POST /api/uploads/images` lalu `POST /api/reports`.

> ✅ **Checkpoint 7:** laporan dengan foto berhasil dibuat dan tampil di daftar. Kamu bisa menjelaskan mengapa upload dan pembuatan laporan dilakukan dalam dua request, serta mengapa `contentType` wajib diisi.

---

## Lab 8 — Lihat laporan, laporan saya, dan pagination (±35 menit)

Sekarang kita menyatukan semuanya. Kita membuat **satu widget daftar yang dipakai ulang** untuk "Semua laporan" dan "Laporan saya", lengkap dengan pagination (muat halaman berikutnya saat digulir) dan pull-to-refresh.

### Langkah 1 — Tambah `getMyReports` di `ReportRepository`

```dart
  /// GET /api/reports/mine — hanya laporan milik user yang login
  Future<PagedResult<Report>> getMyReports({
    int page = 1,
    int limit = 10,
  }) {
    return _fetchList('/api/reports/mine', page: page, limit: limit);
  }
```

Bentuk response-nya **sama persis** dengan `/api/reports`, jadi helper `_fetchList` dipakai ulang. Perbedaannya hanya path dan kebutuhan token.

### Langkah 2 — `widgets/paginated_report_list.dart`

```dart
import 'package:flutter/material.dart';
import 'package:lapor_fasilitas/core/api_exception.dart';
import 'package:lapor_fasilitas/models/paged_result.dart';
import 'package:lapor_fasilitas/models/report.dart';
import 'package:lapor_fasilitas/widgets/error_view.dart';
import 'package:lapor_fasilitas/widgets/report_card.dart';

class PaginatedReportList extends StatefulWidget {
  /// Fungsi yang mengambil satu halaman data.
  final Future<PagedResult<Report>> Function(int page) fetchPage;
  final String emptyMessage;

  const PaginatedReportList({
    super.key,
    required this.fetchPage,
    this.emptyMessage = 'Belum ada laporan',
  });

  @override
  State<PaginatedReportList> createState() => _PaginatedReportListState();
}

class _PaginatedReportListState extends State<PaginatedReportList> {
  final _scrollController = ScrollController();
  final List<Report> _items = [];

  int _nextPage = 1;
  bool _hasMore = true;
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    _loadNextPage();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    final position = _scrollController.position;
    final nearBottom = position.pixels >= position.maxScrollExtent - 200;
    if (nearBottom && _errorMessage == null) _loadNextPage();
  }

  Future<void> _loadNextPage() async {
    if (_isLoading || !_hasMore) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final result = await widget.fetchPage(_nextPage);
      if (!mounted) return;
      setState(() {
        _items.addAll(result.items);
        _hasMore = result.hasMore;
        _nextPage++;
        _isLoading = false;
      });
    } on ApiException catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMessage = e.message;
        _isLoading = false;
      });
    }
  }

  /// Pull-to-refresh: ambil ulang halaman 1 lalu ganti isi daftar
  Future<void> _refresh() async {
    try {
      final result = await widget.fetchPage(1);
      if (!mounted) return;
      setState(() {
        _items
          ..clear()
          ..addAll(result.items);
        _nextPage = 2;
        _hasMore = result.hasMore;
        _errorMessage = null;
      });
    } on ApiException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.message)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    // 1. Loading pertama kali
    if (_items.isEmpty && _isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    // 2. Error dan belum ada data sama sekali
    if (_items.isEmpty && _errorMessage != null) {
      return ErrorView(message: _errorMessage!, onRetry: _loadNextPage);
    }

    // 3. Kosong
    if (_items.isEmpty) {
      return RefreshIndicator(
        onRefresh: _refresh,
        child: ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          children: [
            const SizedBox(height: 160),
            Center(child: Text(widget.emptyMessage)),
          ],
        ),
      );
    }

    // 4. Ada data (+ footer: loading / error / akhir daftar)
    return RefreshIndicator(
      onRefresh: _refresh,
      child: ListView.builder(
        controller: _scrollController,
        physics: const AlwaysScrollableScrollPhysics(),
        itemCount: _items.length + 1,
        itemBuilder: (context, index) {
          if (index < _items.length) {
            return ReportCard(report: _items[index]);
          }

          // Footer
          if (_isLoading) {
            return const Padding(
              padding: EdgeInsets.all(16),
              child: Center(child: CircularProgressIndicator()),
            );
          }
          if (_errorMessage != null) {
            return Center(
              child: TextButton(
                onPressed: _loadNextPage,
                child: Text('$_errorMessage — Coba lagi'),
              ),
            );
          }
          if (!_hasMore) {
            return const Padding(
              padding: EdgeInsets.all(16),
              child: Center(child: Text('Semua laporan sudah ditampilkan')),
            );
          }
          return const SizedBox(height: 16);
        },
      ),
    );
  }
}
```

### Langkah 3 — Sederhanakan `pages/report_list_page.dart`

Berkat widget di atas, halaman daftar laporan menjadi sangat singkat. Ganti **seluruh isi** file dengan:

```dart
import 'package:flutter/material.dart';
import 'package:lapor_fasilitas/repositories/report_repository.dart';
import 'package:lapor_fasilitas/widgets/paginated_report_list.dart';

class ReportListPage extends StatelessWidget {
  const ReportListPage({super.key});

  @override
  Widget build(BuildContext context) {
    final repository = ReportRepository();

    return Scaffold(
      appBar: AppBar(title: const Text('Semua Laporan')),
      body: PaginatedReportList(
        fetchPage: (page) => repository.getReports(page: page),
      ),
    );
  }
}
```

(Tombol "Lapor" sementara dari Lab 7 dihapus karena akan dipindahkan ke navigasi utama.)

### Langkah 4 — `pages/my_reports_page.dart`

```dart
import 'package:flutter/material.dart';
import 'package:lapor_fasilitas/repositories/report_repository.dart';
import 'package:lapor_fasilitas/widgets/paginated_report_list.dart';

class MyReportsPage extends StatelessWidget {
  const MyReportsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final repository = ReportRepository();

    return Scaffold(
      appBar: AppBar(title: const Text('Laporan Saya')),
      body: PaginatedReportList(
        fetchPage: (page) => repository.getMyReports(page: page),
        emptyMessage: 'Kamu belum membuat laporan.\nTekan tombol "Lapor" untuk memulai.',
      ),
    );
  }
}
```

Lihat betapa kecilnya halaman ini. Itulah manfaat memisahkan lapisan dan membuat widget yang dapat dipakai ulang.

### Langkah 5 — Navigasi utama: `pages/home_shell.dart`

```dart
import 'package:flutter/material.dart';
import 'package:lapor_fasilitas/pages/create_report_page.dart';
import 'package:lapor_fasilitas/pages/my_reports_page.dart';
import 'package:lapor_fasilitas/pages/profile_page.dart';
import 'package:lapor_fasilitas/pages/report_list_page.dart';

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _index = 0;
  int _refreshKey = 0; // dinaikkan setiap ada laporan baru

  Future<void> _openCreate() async {
    final created = await Navigator.push<bool>(
      context,
      MaterialPageRoute(builder: (_) => const CreateReportPage()),
    );
    // Beri key baru → halaman daftar dibuat ulang dan memuat data terbaru
    if (created == true) setState(() => _refreshKey++);
  }

  @override
  Widget build(BuildContext context) {
    final pages = [
      ReportListPage(key: ValueKey('all-$_refreshKey')),
      MyReportsPage(key: ValueKey('mine-$_refreshKey')),
      const ProfilePage(),
    ];

    return Scaffold(
      body: IndexedStack(index: _index, children: pages),
      floatingActionButton: _index == 2
          ? null
          : FloatingActionButton.extended(
              onPressed: _openCreate,
              icon: const Icon(Icons.add_a_photo),
              label: const Text('Lapor'),
            ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _index,
        onTap: (i) => setState(() => _index = i),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.list_alt), label: 'Semua'),
          BottomNavigationBarItem(
              icon: Icon(Icons.assignment_ind), label: 'Laporan Saya'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profil'),
        ],
      ),
    );
  }
}
```

### Langkah 6 — Gerbang login saat aplikasi dibuka: `pages/auth_gate.dart`

Sekarang kita perbaiki masalah di Lab 6: aplikasi harus ingat bahwa kamu sudah login.

```dart
import 'package:flutter/material.dart';
import 'package:lapor_fasilitas/pages/home_shell.dart';
import 'package:lapor_fasilitas/pages/login_page.dart';
import 'package:lapor_fasilitas/repositories/auth_repository.dart';

class AuthGate extends StatefulWidget {
  const AuthGate({super.key});

  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  late final Future<bool> _check = AuthRepository().isLoggedIn();

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<bool>(
      future: _check,
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }
        return snapshot.data! ? const HomeShell() : const LoginPage();
      },
    );
  }
}
```

### Langkah 7 — Sambungkan semuanya

1. `main.dart`: ubah `home` menjadi `const AuthGate()`.
2. `login_page.dart`: ubah `_goToHome()` agar membuka `HomeShell()` (bukan `ProfilePage`).

```dart
  void _goToHome() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const HomeShell()),
    );
  }
```

### Langkah 8 — Uji alur lengkap

1. Jalankan ulang aplikasi → langsung ke halaman utama (jika token masih tersimpan) atau halaman login.
2. Tab **Semua** → laporan semua orang. Gulir sampai bawah; jika datanya lebih dari 10, halaman berikutnya dimuat otomatis.
3. Tab **Laporan Saya** → hanya laporan yang kamu buat.
4. Tekan **Lapor** → buat laporan baru → kedua tab diperbarui.
5. Tab **Profil** → **Keluar** → kembali ke Login.

> 💡 **Uji pagination dengan mudah:** ubah sementara `limit` default di `ReportRepository` menjadi `3`. Kamu akan lebih cepat melihat "memuat halaman berikutnya". Jangan lupa kembalikan.

> ✅ **Checkpoint 8:** aplikasi punya alur lengkap register → login → lihat semua laporan → buat laporan + foto → lihat laporan saya → profil → logout. Kamu bisa menjelaskan mengapa `PaginatedReportList` menerima *fungsi* `fetchPage`, bukan memanggil repository langsung.

---

## Lab 9 — Refresh token otomatis (pendalaman, ±20 menit)

Access token hanya berlaku **1 jam**. Tanpa penanganan, setelah satu jam semua request yang butuh login akan menjawab `401` dan pengguna terlempar dengan pesan error. Aplikasi nyata menanganinya **diam-diam di belakang layar**:

```text
Request → 401 (token kedaluwarsa)
        → POST /api/auth/refresh (kirim refresh_token)
        → simpan sepasang token BARU
        → ulangi request yang tadi gagal
        → pengguna tidak merasakan apa pun 😎
        (jika refresh juga gagal → hapus token → arahkan ke halaman login)
```

> ⚠️ **Aturan penting dari API ini:** refresh token bersifat **sekali pakai (rotasi)**. Setiap kali kamu me-refresh, kamu mendapat `token` **dan** `refresh_token` baru, dan yang lama langsung tidak berlaku. Artinya:
> 1. Kamu **wajib menyimpan kedua token baru**.
> 2. Jika dua request gagal bersamaan, **jangan** me-refresh dua kali. Request kedua akan ditolak karena refresh token pertama sudah terpakai. Karena itu kita memakai satu proses refresh yang ditunggu bersama.

### Langkah 1 — Ganti isi `core/auth_interceptor.dart`

```dart
import 'package:dio/dio.dart';
import 'package:lapor_fasilitas/core/app_config.dart';
import 'package:lapor_fasilitas/core/token_storage.dart';

class AuthInterceptor extends Interceptor {
  AuthInterceptor(
    this._dio,
    this._tokenStorage, {
    this.onSessionExpired,
  });

  final Dio _dio; // Dio utama, dipakai untuk mengulang request
  final TokenStorage _tokenStorage;
  final void Function()? onSessionExpired;

  /// Proses refresh yang sedang berjalan (agar tidak refresh dua kali).
  Future<bool>? _refreshing;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await _tokenStorage.accessToken;
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final options = err.requestOptions;
    final isUnauthorized = err.response?.statusCode == 401;
    // 401 pada login/register/refresh BUKAN token kedaluwarsa → jangan di-refresh
    final isAuthEndpoint = options.path.startsWith('/api/auth/');
    final alreadyRetried = options.extra['retried'] == true;

    if (!isUnauthorized || isAuthEndpoint || alreadyRetried) {
      return handler.next(err);
    }

    final refreshed = await _refreshToken();
    if (!refreshed) {
      await _tokenStorage.clear();
      onSessionExpired?.call();
      return handler.next(err);
    }

    // Ulangi request yang tadi gagal, kali ini dengan token baru
    options.extra['retried'] = true;
    options.headers['Authorization'] =
        'Bearer ${await _tokenStorage.accessToken}';
    // FormData hanya bisa dibaca sekali → gandakan sebelum dikirim ulang
    if (options.data is FormData) {
      options.data = (options.data as FormData).clone();
    }

    try {
      final response = await _dio.fetch(options);
      handler.resolve(response);
    } on DioException catch (e) {
      handler.next(e);
    }
  }

  /// Semua request yang gagal bersamaan akan menunggu hasil proses yang sama.
  Future<bool> _refreshToken() {
    return _refreshing ??= _doRefresh().whenComplete(() => _refreshing = null);
  }

  Future<bool> _doRefresh() async {
    final refreshToken = await _tokenStorage.refreshToken;
    if (refreshToken == null) return false;

    try {
      // Pakai Dio terpisah (tanpa interceptor ini) agar tidak berputar-putar
      final response = await Dio(BaseOptions(baseUrl: AppConfig.baseUrl)).post(
        '/api/auth/refresh',
        data: {'refresh_token': refreshToken},
      );
      final data = response.data['data'] as Map<String, dynamic>;
      await _tokenStorage.saveTokens(
        accessToken: data['token'] as String,
        refreshToken: data['refresh_token'] as String,
      );
      return true;
    } catch (_) {
      return false;
    }
  }
}
```

### Langkah 2 — Sesuaikan `core/api_client.dart`

Tambahkan callback sesi berakhir dan teruskan `dio` ke interceptor:

```dart
class ApiClient {
  ApiClient._internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 20),
        headers: {'Accept': 'application/json'},
      ),
    );

    dio.interceptors.add(
      AuthInterceptor(
        dio,
        tokenStorage,
        onSessionExpired: () => onSessionExpired?.call(),
      ),
    );

    if (kDebugMode) {
      dio.interceptors.add(
        LogInterceptor(
          requestHeader: false,
          requestBody: true,
          responseBody: true,
        ),
      );
    }
  }

  static final ApiClient instance = ApiClient._internal();

  /// Diisi dari main.dart: apa yang dilakukan aplikasi saat sesi berakhir.
  static VoidCallback? onSessionExpired;

  final TokenStorage tokenStorage = TokenStorage();
  late final Dio dio;
}
```

### Langkah 3 — Arahkan ke login saat sesi berakhir (`main.dart`)

```dart
import 'package:flutter/material.dart';
import 'package:lapor_fasilitas/core/api_client.dart';
import 'package:lapor_fasilitas/pages/auth_gate.dart';
import 'package:lapor_fasilitas/pages/login_page.dart';

final navigatorKey = GlobalKey<NavigatorState>();

void main() {
  ApiClient.onSessionExpired = () {
    navigatorKey.currentState?.pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginPage()),
      (route) => false,
    );
  };
  runApp(const LaporFasilitasApp());
}

class LaporFasilitasApp extends StatelessWidget {
  const LaporFasilitasApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: navigatorKey,
      title: 'Lapor Fasilitas',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
      home: const AuthGate(),
    );
  }
}
```

### Langkah 4 — Uji (tanpa menunggu 1 jam)

Kamu bisa **merusak access token** secara sengaja. Tambahkan **sementara** tombol berikut di `ProfilePage` (di dalam `ListView`, di bawah tombol Keluar):

```dart
              TextButton(
                onPressed: () async {
                  final storage = ApiClient.instance.tokenStorage;
                  final refresh = await storage.refreshToken;
                  await storage.saveTokens(
                    accessToken: 'token-ngawur',
                    refreshToken: refresh!,
                  );
                  _reload(); // panggil GET /api/users/me dengan token rusak
                },
                child: const Text('[DEBUG] Rusak-kan access token'),
              ),
```

Tekan tombolnya lalu perhatikan Debug Console. Urutan yang benar:

1. `GET /api/users/me` → `401`
2. `POST /api/auth/refresh` → `200`
3. `GET /api/users/me` (diulang) → `200`

Profil tetap tampil seperti biasa. **Hapus tombol debug** setelah selesai.

Uji juga kasus gagal: rusak-kan **kedua** token (ganti `refreshToken` dengan teks ngawur). Aplikasi harus menghapus token dan membawamu ke halaman login.

> ✅ **Checkpoint 9:** access token yang kedaluwarsa tidak membuat pengguna terganggu. Kamu bisa menjelaskan mengapa refresh dijalankan lewat satu proses bersama, dan mengapa `401` pada `/api/auth/login` tidak boleh memicu refresh.

---

## Tantangan Sesi 2

**⭐ Mudah — Tampilkan nama di sapaan.** Setelah login, tampilkan "Halo, {nama}!" di tab "Semua". Petunjuk: `login()` sudah mengembalikan `User`; kamu perlu cara membawanya ke halaman berikutnya (Modul 8) atau memanggil `getProfile()`.

**⭐⭐ Sedang — Progress upload & validasi ukuran.** Tambahkan:
1. Pengecekan ukuran file sebelum upload; jika lebih dari 2 MB, tampilkan pesan tanpa memanggil server (`await picked.length()`).
2. Indikator progres `LinearProgressIndicator` saat upload. Petunjuk: `Dio.post` punya parameter `onSendProgress: (sent, total) { ... }`.

**⭐⭐⭐ Menantang — Ubah & hapus laporan sendiri.** Di kartu pada tab "Laporan Saya", tambahkan menu untuk:
- **Hapus** (`DELETE /api/reports/{id}`) dengan dialog konfirmasi.
- **Ubah** (`PUT /api/reports/{id}`) memakai ulang `CreateReportPage` dalam mode edit.

Tangani `403` (bukan pemilik) dan `404` (laporan sudah tidak ada) dengan pesan yang ramah. Pastikan daftar diperbarui setelahnya.

**⭐⭐⭐ Bonus — Pencarian dengan debounce.** Tambahkan `TextField` pencarian di tab "Semua" yang memanggil `getReports(search: ...)`. Agar API tidak dipanggil setiap huruf diketik, tunda pemanggilan sekitar 500 ms setelah pengguna berhenti mengetik (`Timer` dari `dart:async`).

---

## Pemecahan Masalah (Troubleshooting)

| Gejala | Kemungkinan penyebab | Solusi |
|---|---|---|
| Aplikasi release (APK) tidak bisa terhubung, padahal mode debug normal | Izin `INTERNET` belum ada di `AndroidManifest.xml` | Tambahkan `<uses-permission android:name="android.permission.INTERNET"/>` |
| Pesan "Tidak dapat terhubung ke server" | Tidak ada internet, atau salah ketik base URL | Buka base URL di browser; cek `AppConfig.baseUrl` |
| Request pertama lama sekali | Server *serverless* baru "bangun" | Tunggu sebentar; timeout 15–20 detik sudah mengantisipasi |
| Di Chrome muncul error XMLHttpRequest / CORS | Server membatasi origin, atau URL salah | Pastikan URL benar; jika URL benar, tanyakan ke pengajar karena itu pengaturan server |
| `401 Token tidak ditemukan` | Header `Authorization` tidak terkirim | Pastikan `AuthInterceptor` terpasang di `ApiClient` dan login sudah menyimpan token |
| `401 Token tidak valid` / `Token sudah kedaluwarsa` | Token rusak atau habis masa berlaku | Login ulang; selesaikan Lab 9 agar otomatis |
| `401 Email atau password salah` padahal benar | Data demo direset | Register ulang |
| `400 Validasi gagal` | Isi body tidak sesuai aturan | Baca `errors` di response (lihat Debug Console) |
| `400 Format gambar harus JPG, PNG, atau WebP` | `contentType` tidak diisi, atau file bukan JPG/PNG/WebP | Isi `contentType` (Lab 7, Jebakan #1); pilih foto JPG/PNG |
| `400 Field "image" wajib diisi` | Nama field upload bukan `image` | Pakai `'image'` pada `FormData.fromMap` |
| `413` saat upload | Foto lebih dari 2 MB | Gunakan `maxWidth` dan `imageQuality` pada `pickImage` |
| `409 Email sudah terdaftar` | Email sudah dipakai | Pakai email lain atau langsung login |
| `429 Terlalu banyak request` | Terlalu sering mengirim request dari jaringan yang sama | Tunggu sebentar; jangan menekan tombol berulang |
| `type 'Null' is not a subtype of type 'String'` | Field bernilai `null` tapi ditulis `as String` | Ubah menjadi `as String?` dan buat properti nullable |
| `type '_Map<String, dynamic>' is not a subtype of type 'List<dynamic>'` | Bentuk JSON tidak sesuai dugaan (object vs array) | Cek bentuk response di Swagger atau log |
| API terpanggil berkali-kali | `future:` ditulis langsung di `build()` | Simpan `Future` di `initState()` |
| `setState() called after dispose()` | Halaman ditutup sebelum request selesai | Tambahkan `if (!mounted) return;` setelah `await` |
| Foto tidak tampil di kartu | URL foto tidak valid atau gambar gagal dimuat | Buka `image_url` di browser; pastikan `errorBuilder` terpasang |
| `DioMediaType` tidak dikenali | Versi `dio` lama | Perbarui dio, atau pakai `MediaType` dari `http_parser` |

---

## Rangkuman

1. **Aplikasi mobile tidak mengakses database langsung.** Ia berbicara lewat **API** menggunakan **HTTP** dan bertukar data dalam **JSON**.
2. **REST** memakai resource (URL kata benda), method (`GET`/`POST`/...), dan status code (2xx sukses, 4xx salah di client, 5xx salah di server).
3. **JSON ↔ Dart:** `jsonDecode` → `Map` → `Model.fromJson`. Waspadai `null` (`String?`) dan perbedaan `snake_case` ↔ `camelCase`.
4. **Standar industri:** arsitektur berlapis (UI → Repository → API Client → Model), satu client Dio terkonfigurasi, error dipetakan ke satu tipe, dan empat state UI (loading, success, empty, error).
5. **Autentikasi:** `Authorization: Bearer <token>` ditempel otomatis lewat **interceptor**; token disimpan di **secure storage**; **refresh token** (sekali pakai) menjaga sesi tanpa mengganggu pengguna.
6. **Upload file** memakai `multipart/form-data` (`FormData`); pastikan **nama field** dan **content type** benar, serta kompres gambar sebelum diunggah.
7. **Pagination** dan **widget yang dipakai ulang** membuat aplikasi hemat data dan kodenya ringkas.

### Peta endpoint → kode

| Fitur | Endpoint | Repository | Halaman |
|---|---|---|---|
| Register | `POST /api/auth/register` | `AuthRepository.register` | `RegisterPage` |
| Login | `POST /api/auth/login` | `AuthRepository.login` | `LoginPage` |
| Lihat profil | `GET /api/users/me` | `AuthRepository.getProfile` | `ProfilePage` |
| Lihat laporan | `GET /api/reports` | `ReportRepository.getReports` | `ReportListPage` |
| Laporan saya | `GET /api/reports/mine` | `ReportRepository.getMyReports` | `MyReportsPage` |
| Upload foto | `POST /api/uploads/images` | `UploadRepository.uploadImage` | `CreateReportPage` |
| Buat laporan | `POST /api/reports` | `ReportRepository.createReport` | `CreateReportPage` |
| Refresh token | `POST /api/auth/refresh` | `AuthInterceptor` | (otomatis) |

---

## Referensi

- Dokumentasi API Lapor Fasilitas: <https://lapor-fasilitas-api.vercel.app/docs>
- Flutter — JSON and serialization: <https://docs.flutter.dev/data-and-backend/serialization/json>
- Dio (HTTP client): <https://pub.dev/packages/dio>
- flutter_secure_storage: <https://pub.dev/packages/flutter_secure_storage>
- image_picker: <https://pub.dev/packages/image_picker>
- intl: <https://pub.dev/packages/intl>
- FutureBuilder: <https://api.flutter.dev/flutter/widgets/FutureBuilder-class.html>
- Kode status HTTP (MDN): <https://developer.mozilla.org/en-US/docs/Web/HTTP/Status>
- Pengantar JWT: <https://jwt.io/introduction>
