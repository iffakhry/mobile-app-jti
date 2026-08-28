# Panduan Praktikum: Membuat & Menjalankan Project Flutter dengan VS Code

**Tujuan:** Setelah praktikum ini, mahasiswa mampu membuat project Flutter baru, menjalankannya di Android Emulator, dan menjalankannya di browser Chrome.

---

## 1. Persiapan Awal (Prasyarat)

Sebelum mulai, pastikan hal-hal berikut sudah terpasang di komputer:

| Kebutuhan | Fungsi |
|---|---|
| **Flutter SDK** | Kumpulan tools inti untuk membangun aplikasi Flutter |
| **VS Code** | Code editor yang akan kita gunakan |
| **Android Studio** | Diperlukan untuk Android SDK & Android Emulator |
| **Google Chrome** | Untuk menjalankan aplikasi versi web |

> 💡 **Catatan:** Android Studio tidak harus dipakai sebagai editor utama, kita hanya butuh **Android SDK** dan **emulator**-nya saja.

### 1.1 Install Flutter SDK
1. Unduh Flutter SDK dari situs resmi: https://docs.flutter.dev/get-started/install
2. Ekstrak ke folder tanpa spasi, contoh: `C:\src\flutter` (Windows) atau `~/flutter` (Mac/Linux).
3. Tambahkan folder `flutter/bin` ke **Environment Variable PATH** agar perintah `flutter` bisa dipanggil dari terminal mana saja.

### 1.2 Verifikasi instalasi
Buka terminal, lalu jalankan:

```bash
flutter doctor
```

Perintah ini akan mengecek semua komponen yang dibutuhkan Flutter (Android toolchain, Chrome, VS Code, dsb.) dan menandai apa saja yang masih kurang dengan tanda `[✗]`. Selesaikan dulu semua yang bertanda silang sebelum lanjut.

---

## 2. Setup VS Code

1. Buka VS Code.
2. Masuk ke tab **Extensions** (`Ctrl+Shift+X`).
3. Cari dan install dua extension berikut:
   - **Flutter** (otomatis akan menginstall extension **Dart** juga)
   - **Dart**
4. Restart VS Code setelah instalasi selesai.

Extension ini memberi kita fitur seperti auto-complete, debugging, hot reload, dan deteksi device secara otomatis di dalam VS Code.

---

## 3. Membuat Project Flutter Baru

Ada dua cara: lewat **Command Palette** VS Code, atau lewat **terminal**. Keduanya sama saja, pilih salah satu.

### Cara A — Lewat VS Code (Command Palette)
1. Tekan `Ctrl+Shift+P` (Windows/Linux) atau `Cmd+Shift+P` (Mac).
2. Ketik `Flutter: New Project`, lalu Enter.
3. Pilih template **Application**.
4. Tentukan folder tempat menyimpan project.
5. Beri nama project, contoh: `latihan_flutter` (gunakan huruf kecil dan underscore, tanpa spasi).
6. VS Code otomatis membuka project yang baru dibuat.

### Cara B — Lewat Terminal
```bash
flutter create latihan_flutter
cd latihan_flutter
code .
```
Perintah `code .` akan membuka folder project tersebut di VS Code.

### Struktur folder penting yang perlu diketahui
```
latihan_flutter/
├─ lib/
│  └─ main.dart      # File utama, tempat kode aplikasi kita ditulis
├─ pubspec.yaml       # File konfigurasi project & daftar dependency
├─ android/           # Konfigurasi khusus platform Android
├─ web/                # Konfigurasi khusus platform Web
```

> 🎯 Fokus utama mahasiswa pemula cukup di **`lib/main.dart`** dan **`pubspec.yaml`** dulu.

---

## 4. Menjalankan Project di Android Emulator

### 4.1 Membuat Emulator (jika belum punya)
1. Buka **Android Studio**.
2. Masuk ke **More Actions > Virtual Device Manager** (atau **Tools > Device Manager**).
3. Klik **Create Device**, pilih tipe perangkat (misal Pixel 6), lalu pilih system image (misal Android 14).
4. Klik **Finish** untuk menyelesaikan pembuatan emulator.

### 4.2 Menyalakan Emulator
Ada dua cara:
- **Dari Android Studio:** klik tombol ▶️ (Play) di samping nama emulator pada Device Manager.
- **Dari terminal:**
  ```bash
  flutter emulators                 # menampilkan daftar emulator yang tersedia
  flutter emulators --launch <nama_emulator>
  ```

### 4.3 Menjalankan Aplikasi di Emulator
Setelah emulator menyala dan siap:

1. Di VS Code, lihat pojok kanan bawah — pastikan device yang aktif adalah emulator Android (misal `sdk gphone64 x86 64`).
2. Jika belum sesuai, klik nama device tersebut lalu pilih emulator dari daftar yang muncul.
3. Jalankan aplikasi dengan salah satu cara:
   - Tekan `F5`, **atau**
   - Buka Command Palette → `Flutter: Run Flutter App`, **atau**
   - Lewat terminal:
     ```bash
     flutter run
     ```

Tunggu proses build selesai, aplikasi default Flutter (Counter App) akan tampil di emulator.

### 4.4 Hot Reload
Setelah aplikasi berjalan, coba ubah sedikit teks di `lib/main.dart`, simpan file (`Ctrl+S`), lalu tekan tombol **⚡ (Hot Reload)** di VS Code atau tekan `r` di terminal. Perubahan akan langsung tampil tanpa perlu restart aplikasi dari awal.

---

## 5. Menjalankan Emulator Android Tanpa Android Studio (Opsional)

Android Studio sebenarnya hanya digunakan sebagai wadah untuk instalasi **Android SDK** dan **emulator**, bukan komponen yang wajib. Jika laptop terbatas resource-nya, kita bisa memasang **Android SDK Command Line Tools** saja tanpa install Android Studio secara penuh.

> 💡 Bagian ini bersifat opsional. Jika sudah nyaman menggunakan Android Studio seperti pada Bagian 4, boleh dilewati.

### 5.1 Download Command Line Tools

Unduh **Command line tools only** (bukan paket Android Studio penuh) dari halaman resmi:
https://developer.android.com/studio#command-tools

Pilih paket sesuai OS masing-masing (Windows, Mac, atau Linux).

Setelah diunduh, ekstrak dengan struktur folder **persis seperti ini** (nama `latest` wajib):
```
android-sdk/
└─ cmdline-tools/
   └─ latest/
      ├─ bin/
      └─ ...
```
> ⚠️ Jika struktur foldernya salah (misal langsung `cmdline-tools/bin/`), perintah `sdkmanager` tidak akan berjalan dengan benar.

---

### 5.2 Setup Environment Variable (sesuai OS)

#### 🪟 Windows
1. Buka **Search Windows** → ketik `Environment Variables` → pilih **Edit the system environment variables**.
2. Klik **Environment Variables**.
3. Buat **New** System Variable:
   - Nama: `ANDROID_HOME`
   - Value: path ke folder `android-sdk`, contoh: `C:\Users\NamaKamu\android-sdk`
4. Cari variable `Path`, klik **Edit**, lalu tambahkan baris berikut:
   ```
   %ANDROID_HOME%\cmdline-tools\latest\bin
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\emulator
   ```
5. Klik **OK** di semua jendela, lalu **restart terminal/VS Code** agar perubahan terbaca.

#### 🍎 macOS
1. Buka terminal, edit file konfigurasi shell (`~/.zshrc` untuk macOS terbaru, atau `~/.bash_profile` jika masih pakai bash):
   ```bash
   nano ~/.zshrc
   ```
2. Tambahkan baris berikut di akhir file:
   ```bash
   export ANDROID_HOME=$HOME/android-sdk
   export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/emulator
   ```
3. Simpan (`Ctrl+O`, Enter, `Ctrl+X`), lalu jalankan:
   ```bash
   source ~/.zshrc
   ```

#### 🐧 Linux
1. Buka terminal, edit file `~/.bashrc` (atau `~/.zshrc` jika menggunakan zsh):
   ```bash
   nano ~/.bashrc
   ```
2. Tambahkan baris berikut di akhir file:
   ```bash
   export ANDROID_HOME=$HOME/android-sdk
   export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/emulator
   ```
3. Simpan (`Ctrl+O`, Enter, `Ctrl+X`), lalu jalankan:
   ```bash
   source ~/.bashrc
   ```

> ✅ Cek apakah environment variable sudah terbaca dengan menjalankan `sdkmanager --version` di terminal. Jika muncul nomor versi, berarti sudah berhasil.

---

### 5.3 Install Komponen SDK yang Dibutuhkan

Perintah berikut **sama untuk Windows, Mac, dan Linux** (jalankan lewat terminal / Command Prompt / PowerShell):

```bash
sdkmanager "platform-tools" "platforms;android-34" "emulator"
sdkmanager "system-images;android-34;google_apis;x86_64"
```

> 📌 Untuk Mac dengan chip Apple Silicon (M1/M2/M3), gunakan image `arm64-v8a` agar performa emulator lebih optimal:
> ```bash
> sdkmanager "system-images;android-34;google_apis;arm64-v8a"
> ```

### 5.4 Setujui Lisensi Android SDK

```bash
flutter doctor --android-licenses
```
Ketik `y` lalu Enter untuk menyetujui semua lisensi yang muncul.

### 5.5 Membuat Emulator (AVD) Lewat Terminal

```bash
avdmanager create avd -n Pixel_6_API_34 -k "system-images;android-34;google_apis;x86_64" -d pixel_6
```

> 📌 Untuk Mac Apple Silicon, sesuaikan `system-images` dengan `arm64-v8a` seperti pada langkah 5.3.

### 5.6 Menyalakan Emulator

```bash
emulator -avd Pixel_6_API_34
```

Atau bisa juga lewat Flutter CLI:
```bash
flutter emulators
flutter emulators --launch Pixel_6_API_34
```

### 5.7 Verifikasi dengan Flutter Doctor

```bash
flutter doctor
```

Pastikan bagian **Android toolchain** sudah bertanda centang ✅. Jika sudah, project Flutter bisa dijalankan seperti biasa dengan `flutter run` maupun langsung dari VS Code (lihat Bagian 4.3), tanpa perlu Android Studio sama sekali.

---

## 6. Menjalankan Project di Chrome (Web)

Flutter juga bisa langsung dijalankan sebagai aplikasi web di browser Chrome.

### 5.1 Pastikan Web Support Aktif
```bash
flutter config --enable-web
```

### 5.2 Cek Chrome Terdeteksi
```bash
flutter devices
```
Pastikan **Chrome** muncul dalam daftar device yang tersedia.

### 5.3 Menjalankan di Chrome
1. Di VS Code, klik pemilih device di pojok kanan bawah, lalu pilih **Chrome**.
2. Jalankan dengan `F5`, atau lewat terminal:
   ```bash
   flutter run -d chrome
   ```
3. Chrome akan terbuka otomatis menampilkan aplikasi Flutter.

Fitur **Hot Reload** juga tetap berfungsi saat menjalankan di Chrome.

---

## 7. Ringkasan Perintah Penting

| Perintah | Fungsi |
|---|---|
| `flutter doctor` | Mengecek kesiapan environment |
| `flutter create <nama>` | Membuat project baru |
| `flutter devices` | Melihat daftar device yang terdeteksi |
| `flutter emulators` | Melihat daftar emulator Android |
| `flutter run` | Menjalankan project di device aktif |
| `flutter run -d chrome` | Menjalankan project langsung di Chrome |
| `r` (saat `flutter run` aktif) | Hot reload |
| `R` (huruf besar, saat `flutter run` aktif) | Hot restart |
| `q` (saat `flutter run` aktif) | Menghentikan aplikasi |

---

## 8. Troubleshooting Umum

- **`flutter doctor` menampilkan error Android licenses:** jalankan `flutter doctor --android-licenses`, lalu ketik `y` untuk menyetujui semua lisensi.
- **Emulator lambat/lag:** pastikan **Virtualization (VT-x/AMD-V)** sudah aktif di BIOS komputer.
- **Device tidak muncul di VS Code:** klik ikon refresh pada pemilih device, atau restart VS Code.
- **Chrome tidak terdeteksi:** pastikan Chrome sudah terpasang dan `flutter config --enable-web` sudah dijalankan.
- **`sdkmanager` atau `avdmanager` tidak dikenali (command not found):** cek kembali struktur folder `cmdline-tools/latest/` dan pastikan environment variable/PATH sudah benar, lalu buka terminal baru (perubahan PATH tidak berlaku di terminal yang sudah terbuka sebelumnya).
- **Emulator gagal start setelah setup manual (tanpa Android Studio):** pastikan paket `emulator` dan `platform-tools` sudah ter-install lewat `sdkmanager`, dan Virtualization (VT-x/AMD-V) sudah aktif di BIOS.

---

## 9. Latihan Mandiri

Sebagai latihan, coba lakukan hal berikut:
1. Buat project baru dengan nama `praktikum_1`.
2. Jalankan di Android Emulator, screenshot hasilnya.
3. Jalankan project yang sama di Chrome, screenshot hasilnya.
4. Ubah teks judul aplikasi di `lib/main.dart`, lakukan hot reload, dan amati perubahannya tanpa merestart aplikasi.
