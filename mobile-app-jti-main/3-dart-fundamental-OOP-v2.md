# Dart Fundamentals & OOP untuk Flutter Development

---

## Daftar Isi

1. [Persiapan Environment](#1-persiapan-environment)
2. [Dart Fundamentals](#2-dart-fundamentals)
3. [Null Safety (Konsep Wajib)](#3-null-safety-konsep-wajib)
4. [Collections](#4-collections)
5. [Function](#5-function)
6. [OOP dalam Dart](#6-oop-dalam-dart)
7. [Asynchronous Programming](#7-asynchronous-programming)
8. [Konsep Persiapan Flutter](#8-konsep-persiapan-flutter)
9. [Latihan Praktikum](#9-latihan-praktikum)

---

## 1. Persiapan Environment

### 1.1 Apa itu Dart?

Dart adalah bahasa pemrograman **object-oriented** yang dikembangkan Google, digunakan untuk membangun aplikasi mobile, web, desktop, dan backend. Dart menjadi bahasa utama di balik framework **Flutter**.

### 1.2 Instalasi Dart SDK

- **Cara termudah (direkomendasikan)**: install **Flutter SDK**, karena Dart SDK sudah termasuk di dalamnya. Ikuti panduan resmi di https://docs.flutter.dev/get-started/install sesuai OS kamu (Windows/macOS/Linux).
- **Dart SDK saja** (tanpa Flutter): https://dart.dev/get-dart

Cek instalasi:

```bash
dart --version
```

### 1.3 Cara Menjalankan Kode Dart

| Cara                            | Kapan Dipakai                               |
| ------------------------------- | ------------------------------------------- |
| [DartPad](https://dartpad.dev/) | Belajar cepat, tidak perlu install apapun   |
| `dart run nama_file.dart`       | Menjalankan script Dart murni dari terminal |
| VS Code + Flutter Extension     | Development project Flutter sehari-hari     |

```bash
dart run main.dart
```

---

## 2. Dart Fundamentals

### 2.1 Variable: `var`, `final`, `const`, `dynamic`

Dart bersifat **statically typed** dengan **type inference** — tipe data ditentukan otomatis, tapi tetap tetap (tidak bisa berubah tipe setelahnya).

```dart
void main() {
  var nama = "Fakhry";      // tipe disimpulkan otomatis sebagai String
  int umur = 25;            // eksplisit
  final kota = "Surabaya";  // nilai hanya bisa diisi SEKALI (runtime)
  const pi = 3.14;          // nilai HARUS diketahui saat compile-time

  print(nama);
}
```

> 🔧 Terdapat perbedaan antara `var` dan `final`, `const`. Dalam Flutter, perbedaan ini penting — misalnya properti Widget hampir selalu `final`, sementara `const` dipakai untuk widget yang tidak berubah (ini akan mendukung performa render).

| Keyword   | Boleh Diubah?                   | Kapan Ditentukan Nilainya       |
| --------- | ------------------------------- | ------------------------------- |
| `var`     | Ya                              | Runtime                         |
| `final`   | Tidak (sekali isi)              | Runtime                         |
| `const`   | Tidak                           | Compile-time                    |
| `dynamic` | Ya, bahkan tipenya bisa berubah | Runtime (hindari kecuali perlu) |

### 2.2 Tipe Data Dasar

```dart
int umur = 20;             // bilangan bulat
double tinggi = 172.5;     // bilangan desimal
num angka = 10;            // bisa int ATAUPUN double
String nama = "Dart";      // teks
bool aktif = true;         // true / false
```

**String — Interpolation & Multiline**

```dart
void main() {
  String nama = "Budi";
  int umur = 20;

  // Interpolation (cara modern, HINDARI concat pakai '+')
  print("Halo $nama, umur kamu $umur tahun");
  print("Tahun depan kamu ${umur + 1} tahun"); // ekspresi pakai {}

  // Multiline string
  String puisi = '''
  Baris pertama
  Baris kedua
  ''';
}
```

> 🔧 Penggunaan `"hello"+ t` (concatenation manual) ini tidak disarankan, tapi **best practice** modern Dart adalah pakai _string interpolation_ (`$variabel`) karena lebih mudah dibaca dan lebih sedikit bug.

### 2.3 Operator

**Operator Perbandingan**

> 🔧 Dart **tidak memiliki operator `===`** (itu konsep dari JavaScript). Di Dart:
>
> - `==` membandingkan **nilai** (dan otomatis membandingkan tipe juga, karena Dart _statically typed_)
> - `identical(a, b)` mengecek apakah dua variabel menunjuk ke **objek yang sama persis di memori**

```dart
void main() {
  var angka = 8;
  print(angka == 8);      // true
  print(angka == "8");    // Error saat compile! Dart tidak bisa bandingkan int dgn String

  var a = "halo";
  var b = "halo";
  print(identical(a, b)); // true, karena Dart meng-cache String literal yang sama
}
```

**Operator Null-aware (Fitur Modern — Wajib Dikuasai)**

```dart
String? nama; // tanda '?' artinya variabel BOLEH bernilai null

print(nama ?? "Tanpa Nama");     // '??' -> gunakan nilai default jika null
nama ??= "Fakhry";               // isi HANYA jika masih null
print(nama?.length);             // '?.' -> akses properti aman, hasilnya null jika nama null
```

### 2.4 Percabangan (Conditional)

```dart
// if - else if - else
var nilai = 85;
if (nilai >= 90) {
  print("A");
} else if (nilai >= 80) {
  print("B");
} else {
  print("C");
}

// Ternary operator
var status = (nilai >= 80) ? "Lulus" : "Tidak Lulus";

// Switch statement (klasik)
var hari = 3;
switch (hari) {
  case 1:
    print("Senin");
    break;
  default:
    print("Hari tidak dikenali");
}
```

> 🔧 **Tambahan (Dart 3+)**: Sejak Dart 3, tersedia **switch expression** yang lebih ringkas dan sering dipakai di Flutter modern (misalnya untuk memilih Widget berdasarkan state):

```dart
String getStatus(int nilai) {
  return switch (nilai) {
    >= 90 => "A",
    >= 80 => "B",
    _     => "C", // default
  };
}
```

### 2.5 Perulangan (Looping)

```dart
// for
for (var i = 1; i <= 5; i++) {
  print(i);
}

// while
var i = 1;
while (i <= 5) {
  print(i);
  i++;
}

// for-in (khusus untuk iterasi Collection — sering dipakai di Flutter)
var buah = ["Apel", "Jeruk", "Mangga"];
for (var item in buah) {
  print(item);
}

// forEach
buah.forEach((item) => print(item));
```

---

## 3. Null Safety (Konsep Wajib)

> 🔧 **Tambahan**: Sejak Dart 2.12 (dan menjadi keharusan di semua project Flutter modern), **sound null safety** adalah default. Jika tidak, maka ada kemungkinan akan muncul error `The argument type 'String?' can't be assigned to 'String'`.

**Konsepnya**: Secara default, variabel **TIDAK BOLEH** bernilai `null`, kecuali kamu mendeklarasikan secara eksplisit dengan tanda `?`.

```dart
String nama = "Budi";   // TIDAK BOLEH null
String? kotaAsal;       // BOLEH null (nullable)

// nama = null; // ERROR! tidak diizinkan

void cetakKota(String? kota) {
  // gunakan null check sebelum akses
  if (kota != null) {
    print(kota.toUpperCase());
  }
}
```

**Late variable** — untuk variabel yang pasti akan diisi nanti, tapi tidak saat deklarasi:

```dart
late String token; // dijanjikan akan diisi sebelum dipakai

void login() {
  token = "abc123";
}
```

**Bang operator `!`** — memaksa Dart percaya bahwa nilai tidak null (gunakan hati-hati, karena akan **crash saat runtime** jika ternyata null):

```dart
String? input = stdin.readLineSync();
print(input!.toUpperCase()); // ! artinya "saya yakin ini tidak null"
```

---

## 4. Collections

> 🔧 **Tambahan**: Collection adalah salah satu hal yang **paling sering dipakai** saat membangun UI Flutter (misalnya `ListView.builder`).

### 4.1 List (array/daftar berurutan)

```dart
List<String> buah = ["Apel", "Jeruk", "Mangga"];

buah.add("Anggur");         // tambah data
buah.removeAt(0);           // hapus berdasar index
print(buah.length);         // jumlah data
print(buah.contains("Jeruk")); // true

// List transformasi (sangat umum dipakai di Flutter)
List<int> angka = [1, 2, 3, 4, 5];
var genap = angka.where((n) => n % 2 == 0).toList(); // [2, 4]
var kuadrat = angka.map((n) => n * n).toList();       // [1,4,9,16,25]
```

### 4.2 Map (key-value pair)

```dart
Map<String, dynamic> mahasiswa = {
  "nama": "Fakhry",
  "nim": "12345",
  "aktif": true,
};

print(mahasiswa["nama"]);
mahasiswa["semester"] = 5; // tambah key baru
```

### 4.3 Set (koleksi unik, tanpa duplikat)

```dart
Set<String> kategori = {"Mobile", "Web", "Mobile"};
print(kategori); // {"Mobile", "Web"} -> duplikat otomatis hilang
```

### 4.4 Collection `if` & `for` (Spread Operator)

> Fitur ini sangat sering dipakai saat membangun daftar Widget secara dinamis di Flutter.

```dart
bool tampilkanEkstra = true;
var daftar = [
  "Item 1",
  "Item 2",
  if (tampilkanEkstra) "Item Ekstra", // collection-if
  for (var i in [1, 2, 3]) "Loop $i",  // collection-for
];
```

---

## 5. Function

```dart
// Function dasar dengan tipe eksplisit (best practice modern)
int kalikanDua(int angka) {
  return angka * 2;
}

// Arrow function (untuk function 1 baris)
int tambah(int a, int b) => a + b;
```

> 🔧 Dalam dart, menulis function **tanpa tipe kembalian** (`kalikanDua(angka){ ... }`). Ini tetap valid, tapi **tidak direkomendasikan** karena membuat tipe menjadi implisit `dynamic`, yang bisa memunculkan bug kedepannya. Selalu deklarasikan tipe parameter & return secara eksplisit.

### 5.1 Parameter: Positional, Optional, Named

```dart
// Named parameter (WAJIB diisi -> pakai 'required')
void tampilBiodata({required String nama, int umur = 0}) {
  print("$nama, $umur tahun");
}
tampilBiodata(nama: "Budi", umur: 20);

// Positional optional parameter (pakai [])
String sapa(String nama, [String salam = "Halo"]) {
  return "$salam, $nama!";
}
```

> 💡 Named parameter dengan `required` ini adalah pola yang **akan sangat sering kamu temui** saat membuat constructor Widget di Flutter, contoh:
>
> ```dart
> const MyButton({required this.label, required this.onTap});
> ```

---

## 6. OOP dalam Dart

### 6.1 Class & Object

**Pengertian**: Class adalah _blueprint_ atau cetakan yang mendefinisikan struktur (property) dan perilaku (method) dari sesuatu. Object adalah _instance_ (wujud nyata) yang dibuat berdasarkan class tersebut.

> Analogi: Class `Mobil` = rancangan/gambar teknik mobil. Object = mobil sungguhan yang dibuat dari rancangan itu. Dari satu class yang sama, kita bisa membuat banyak object dengan data berbeda-beda.

Contoh singkat:

```dart
class Mobil {
  String merk = "Toyota";
}

void main() {
  var mobilku = Mobil(); // 'mobilku' adalah object dari class Mobil
  print(mobilku.merk);   // Toyota
}
```

```dart
class Mahasiswa {
  String nama;
  int nim;

  // Constructor (syntax modern, TANPA keyword 'new')
  Mahasiswa(this.nama, this.nim);

  void perkenalan() {
    print("Halo, saya $nama dengan NIM $nim");
  }
}

void main() {
  var mhs = Mahasiswa("Budi", 12345); // TANPA 'new'
  mhs.perkenalan();
}
```

> 🔧 **Notes**: `Dadu dd = new Dadu();`. Keyword `new` **masih valid** secara teknis, tapi sejak Dart 2, penggunaannya **tidak dianjurkan (optional & discouraged)** oleh linter resmi Dart. Cukup tulis `Dadu dd = Dadu();`.

### 6.2 Encapsulation

**Pengertian**: Encapsulation (enkapsulasi) adalah konsep membungkus/menyembunyikan data agar tidak bisa diakses atau diubah sembarangan dari luar class. Akses ke data tersebut dikontrol lewat method tertentu (misalnya getter/setter), sehingga bisa disisipi validasi.

> Analogi: Saldo rekening bank tidak boleh diubah langsung dari luar (misal ditulis manual jadi 1 miliar). Perubahan saldo harus lewat method resmi seperti `setor()` atau `tarik()` yang sudah punya aturan/validasi.

Contoh singkat:

```dart
class Rekening {
  double _saldo = 0; // private, tidak bisa diakses langsung dari luar

  void setor(double jumlah) {
    if (jumlah > 0) _saldo += jumlah; // ada validasi
  }

  double get saldo => _saldo; // akses baca yang aman
}
```

Dart tidak punya keyword `private`/`public`. Untuk membuat property/method private, tambahkan underscore `_` di depan nama.

```dart
class Lingkaran {
  double _jariJari; // private

  Lingkaran(this._jariJari);

  // Getter & Setter modern (bukan method biasa)
  double get luas => 3.14 * _jariJari * _jariJari;

  set jariJari(double value) {
    _jariJari = value < 0 ? value * -1 : value; // validasi otomatis positif
  }
}

void main() {
  var lingkaran = Lingkaran(5);
  print(lingkaran.luas);   // dipanggil TANPA tanda kurung, seperti property
  lingkaran.jariJari = -10; // otomatis jadi 10 karena setter
}
```

### 6.3 Constructor Lanjutan

**Pengertian**: Constructor adalah method khusus yang otomatis dijalankan setiap kali sebuah object dibuat (instansiasi). Constructor biasanya digunakan untuk mengisi nilai awal ke property object tersebut.

Contoh singkat:

```dart
class Buku {
  String judul;
  Buku(this.judul); // ini constructor, dipanggil otomatis saat object dibuat
}

void main() {
  var buku = Buku("Belajar Dart"); // constructor langsung mengisi 'judul'
  print(buku.judul); // Belajar Dart
}
```

```dart
class Employee {
  final String id;
  final String name;
  final String department;

  // Constructor utama
  Employee(this.id, this.name, this.department);

  // Named constructor
  Employee.magang(this.id, this.name) : department = "Magang";

  // Factory constructor (untuk logic pembuatan objek yang lebih kompleks)
  factory Employee.dariJson(Map<String, dynamic> json) {
    return Employee(json['id'], json['name'], json['department']);
  }
}
```

### 6.4 Inheritance

**Pengertian**: Inheritance (pewarisan) memungkinkan sebuah class (disebut _child_) mewarisi property dan method dari class lain (disebut _parent_), sehingga kode yang sama tidak perlu ditulis ulang.

> Analogi: `Kucing` dan `Anjing` sama-sama seekor `Hewan` yang bisa `makan()`. Daripada menulis method `makan()` di masing-masing class, cukup didefinisikan sekali di class `Hewan`, lalu `Kucing` dan `Anjing` tinggal mewarisinya.

Contoh singkat:

```dart
class Hewan {
  void makan() => print("Sedang makan");
}

class Kucing extends Hewan {} // otomatis mewarisi method makan()

void main() {
  var kucing = Kucing();
  kucing.makan(); // "Sedang makan" -> diwariskan dari class Hewan
}
```

```dart
class Character {
  int levelPoint;
  Character(this.levelPoint);
}

class Human extends Character {
  Human(super.levelPoint); // meneruskan ke constructor parent

  String killAllTitan() => "Sasageyo... Shinzo Sasageyo...";
}

void main() {
  var manusia = Human(10);
  print(manusia.levelPoint);   // diwarisi dari Character
  print(manusia.killAllTitan());
}
```

### 6.5 Abstract Class & Interface

> 🔧 **Tambahan**: Abstract dan Interface adalah konsep penting untuk _clean architecture_ di project Flutter (misalnya mendefinisikan kontrak Repository).

**Pengertian**: Abstract class adalah class "setengah jadi" yang mendefinisikan method apa saja yang **wajib dimiliki** oleh turunannya, tanpa harus menyediakan isi/implementasinya — class ini juga **tidak bisa langsung dibuat objeknya**. Interface di Dart diwujudkan lewat keyword `implements`: sebuah class yang meng-implement class lain **wajib menulis ulang seluruh method** dari class tersebut.

Contoh singkat:

```dart
abstract class Hewan {
  void bersuara(); // hanya deklarasi, tanpa isi
}

class Kucing extends Hewan {
  @override
  void bersuara() => print("Meong"); // wajib diisi oleh child class
}
```

```dart
// Abstract class -> tidak bisa di-instansiasi langsung, wajib di-extend
abstract class BangunDatar {
  double luas();
  double keliling();
}

class Persegi extends BangunDatar {
  double sisi;
  Persegi(this.sisi);

  @override
  double luas() => sisi * sisi;

  @override
  double keliling() => 4 * sisi;
}

// 'implements' -> setiap class WAJIB implementasi ulang semua method (seperti interface)
class Lingkaran implements BangunDatar {
  double jariJari;
  Lingkaran(this.jariJari);

  @override
  double luas() => 3.14 * jariJari * jariJari;

  @override
  double keliling() => 2 * 3.14 * jariJari;
}
```

### 6.6 Mixin (`with`)

> 🔧 **Tambahan**: Mixin **sangat sering dipakai** di kode Flutter (contoh: `SingleTickerProviderStateMixin` untuk animasi). Mixin memungkinkan sebuah class "meminjam" kemampuan dari class lain tanpa hubungan inheritance biasa.

**Pengertian**: Mixin adalah cara untuk "meminjamkan" kumpulan method ke banyak class yang **tidak berhubungan** (bukan parent-child), tanpa harus pakai `extends`. Gunanya agar beberapa class berbeda bisa memiliki kemampuan yang sama tanpa duplikasi kode. Sebuah class bisa memakai lebih dari satu mixin sekaligus dengan kata kunci `with`.

> Analogi: Class `Manusia` dan class `Robot` sama sekali tidak berhubungan (bukan turunan satu sama lain), tapi keduanya sama-sama bisa "berenang". Daripada menulis ulang method `berenang()` di kedua class, cukup buat satu `mixin BisaBerenang` lalu dipakai (`with`) oleh keduanya.

Contoh singkat:

```dart
mixin BisaBerenang {
  void berenang() => print("Sedang berenang");
}

class Manusia with BisaBerenang {}
class Robot with BisaBerenang {}

void main() {
  Manusia().berenang(); // "Sedang berenang"
  Robot().berenang();   // "Sedang berenang" -> tanpa hubungan inheritance
}
```

```dart
mixin Logger {
  void log(String pesan) => print("[LOG]: $pesan");
}

class ApiService with Logger {
  void fetchData() {
    log("Mengambil data..."); // method dari mixin bisa langsung dipakai
  }
}
```

### 6.7 Enum (Modern / Enhanced Enum)

> 🔧 **Tambahan**: Sejak Dart 2.17, enum bisa punya property dan method sendiri — sangat berguna untuk merepresentasikan state di Flutter (misal status loading/success/error).

**Pengertian**: Enum (_enumeration_) adalah tipe data khusus untuk mendefinisikan **sekumpulan nilai tetap/terbatas** yang sudah diketahui sejak awal, misalnya hari dalam seminggu atau status pesanan. Dengan enum, kita tidak perlu menulis nilai sebagai `String` bebas (yang rawan salah ketik), karena pilihannya sudah dibatasi.

> Analogi: Status lampu lalu lintas hanya punya 3 kemungkinan: `merah`, `kuning`, `hijau` — tidak mungkin ada nilai lain. Daripada menulis `String warna = "merahh"` (typo tapi tetap jalan), enum memaksa nilainya hanya boleh salah satu dari yang sudah ditentukan.

Contoh singkat:

```dart
enum WarnaLampu { merah, kuning, hijau }

void main() {
  var lampu = WarnaLampu.merah;

  if (lampu == WarnaLampu.merah) {
    print("Berhenti!");
  }
}
```

```dart
enum StatusPesanan {
  diproses("Sedang diproses"),
  dikirim("Sedang dikirim"),
  selesai("Pesanan selesai");

  final String label;
  const StatusPesanan(this.label);
}

void main() {
  var status = StatusPesanan.dikirim;
  print(status.label); // "Sedang dikirim"
}
```

### 6.8 Polymorphism

**Pengertian**: Polymorphism berarti satu method/fungsi dengan nama yang sama bisa menghasilkan perilaku yang **berbeda-beda**, tergantung dari objek/class mana yang memanggilnya.

> Analogi: Perintah `bersuara()` yang sama, jika dipanggil pada objek `Kucing` menghasilkan "Meong", tapi jika dipanggil pada objek `Anjing` menghasilkan "Guk" — meskipun nama method-nya sama persis.

Contoh singkat:

```dart
class Anjing extends Hewan {
  @override
  void bersuara() => print("Guk");
}

void main() {
  List<Hewan> hewanHewan = [Kucing(), Anjing()];
  for (var h in hewanHewan) {
    h.bersuara(); // memanggil method yang sama, hasil beda tiap objek
  }
}
```

```dart
void cetakInfo(BangunDatar bangun) {
  // Method yang sama dipanggil, tapi hasil berbeda tergantung objeknya
  print("Luas: ${bangun.luas()}");
}

void main() {
  cetakInfo(Persegi(5));     // pakai implementasi luas() milik Persegi
  cetakInfo(Lingkaran(3));   // pakai implementasi luas() milik Lingkaran
}
```

---

## 7. Asynchronous Programming

### 7.1 Future & async/await

```dart
Future<String> fetchUserOrder() async {
  await Future.delayed(Duration(seconds: 2));
  return "Kopi Susu";
}

void main() async {
  print("Mengambil pesanan...");
  var pesanan = await fetchUserOrder();
  print("Pesanan: $pesanan");
}
```

### 7.2 Error Handling

```dart
Future<void> ambilData() async {
  try {
    var data = await fetchUserOrder();
    print(data);
  } catch (e) {
    print("Terjadi error: $e");
  } finally {
    print("Proses selesai");
  }
}
```

### 7.3 Stream (Data yang Mengalir Berkali-kali)

> 🔧 **Tambahan**: `Stream` merupakan konsep dasar dari `StreamBuilder` di Flutter — dipakai untuk kasus seperti data real-time (chat, lokasi GPS, dsb).

**Perbedaan `Future` vs `Stream`**: `Future` mengembalikan **1 nilai** di masa depan, `Stream` mengembalikan **banyak nilai** secara berkelanjutan (seperti aliran air).

```dart
Stream<int> hitungMundur() async* {
  for (int i = 3; i > 0; i--) {
    await Future.delayed(Duration(seconds: 1));
    yield i; // 'yield' mengirim nilai ke stream, mirip 'return' tapi berulang
  }
}

void main() async {
  await for (var angka in hitungMundur()) {
    print(angka); // mencetak 3, 2, 1 (masing-masing berjeda 1 detik)
  }
}
```

---

## 8. Konsep Persiapan Flutter

Berikut adalah "jembatan" dari Dart murni ke dunia Flutter, agar transisi mahasiswa tidak kaget.

### 8.1 Semua di Flutter adalah Widget (Class)

```dart
class SapaanWidget extends StatelessWidget {
  final String nama;
  const SapaanWidget({super.key, required this.nama}); // named param + required

  @override
  Widget build(BuildContext context) {
    return Text("Halo, $nama!");
  }
}
```

Perhatikan: konsep **class, constructor, named parameter dengan `required`, dan inheritance (`extends`)** yang sudah dipelajari di atas — **semuanya dipakai langsung** di sini.

### 8.2 StatelessWidget vs StatefulWidget

|               | StatelessWidget          | StatefulWidget                     |
| ------------- | ------------------------ | ---------------------------------- |
| Data berubah? | Tidak (statis)           | Ya (dinamis, ada `setState()`)     |
| Contoh Kasus  | Logo, Label, Teks statis | Counter, Form input, Data dari API |

### 8.3 `FutureBuilder` — Async Programming Bertemu UI

Ini adalah alasan konsep `Future`/`async-await` di Bab 7 **wajib** dikuasai sebelum masuk Flutter:

```dart
FutureBuilder<String>(
  future: fetchUserOrder(), // function async yang sudah kita buat sebelumnya
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return CircularProgressIndicator(); // loading
    } else if (snapshot.hasData) {
      return Text(snapshot.data!); // tampilkan hasil (pakai '!' karena sudah dicek hasData)
    } else {
      return Text("Terjadi error");
    }
  },
)
```

### 8.4 `pubspec.yaml` — Manajemen Dependency

File `pubspec.yaml` adalah "daftar belanja" package di project Flutter, mirip `package.json` di Node.js.

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.0 # contoh package untuk request API
```

Install package baru: `flutter pub get`

### 8.5 Best Practice Tambahan

- Gunakan **`const`** pada Widget yang tidak berubah — membantu performa render Flutter.
- Ikuti **Effective Dart** naming convention: `camelCase` untuk variable/function, `PascalCase` untuk class.
- Pertimbangkan menggunakan **FVM (Flutter Version Management)** agar versi Flutter konsisten antar anggota tim/lab.

---

## 9. Latihan Praktikum

### Latihan 1 — Fundamental & Null Safety

Buat program `mahasiswa.dart` yang menyimpan data mahasiswa (`nama`, `nim`, `email` — email bersifat **nullable**) menggunakan `Map`, lalu tampilkan biodata dengan menangani kasus `email` yang null menggunakan operator `??`.

### Latihan 2 — Collection

Dari `List<int> nilai = [80, 90, 65, 70, 95]`, gunakan `.where()` dan `.map()` untuk:

1. Menampilkan hanya nilai yang lulus (≥75)
2. Mengubah semua nilai menjadi predikat huruf (A/B/C) menggunakan switch expression

### Latihan 3 — OOP: Encapsulation & Constructor

Buat class `Produk` dengan property private `_harga`. Tambahkan getter/setter dengan validasi: harga tidak boleh negatif. Tambahkan juga _named constructor_ `Produk.gratis(nama)` yang otomatis mengisi harga = 0.

### Latihan 4 — OOP: Inheritance, Abstract Class & Mixin

Buat `abstract class Kendaraan` dengan method `bunyiKlakson()`. Buat `class Motor` dan `class Mobil` yang meng-extends `Kendaraan`. Tambahkan `mixin BisaNgebut` dengan method `ngebut()`, lalu terapkan pada `class Mobil` saja.

### Latihan 5 — Async & Stream

Buat function `ambilNotifikasi()` bertipe `Stream<String>` yang mengeluarkan 5 notifikasi dummy dengan jeda masing-masing 1 detik menggunakan `async*` dan `yield`. Tampilkan semua notifikasi menggunakan `await for`.

### Latihan 6 (Challenge) — Kombinasi Menuju Flutter

Buat class `Produk` (dari Latihan 3) menjadi bahan untuk 3 objek berbeda dalam sebuah `List<Produk>`. Buat function `Future<List<Produk>> ambilDaftarProduk()` yang mensimulasikan pengambilan data (pakai `Future.delayed`), lalu bayangkan/tuliskan secara sketsa bagaimana hasilnya akan ditampilkan menggunakan `FutureBuilder` + `ListView.builder` di Flutter (tidak perlu dijalankan, cukup pseudocode).

---

## Referensi Resmi (Diperbarui)

- Dart Language Tour: https://dart.dev/language
- Effective Dart: https://dart.dev/effective-dart
- Flutter Documentation: https://docs.flutter.dev
- DartPad (latihan online): https://dartpad.dev
