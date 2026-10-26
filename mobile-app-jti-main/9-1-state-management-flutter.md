# Pendekatan State Management di Flutter

**Workshop Mobile Application Framework · Flutter & Dart**
**Studi kasus:** fitur *Ikuti / Mengikuti* pada Kartu Profil Digital, dibuat dengan **lima pendekatan** berbeda.

---

## 🎯 Tujuan Pembelajaran

Setelah menyelesaikan modul ini, kamu mampu:

1. Menjelaskan **kapan `setState()` cukup** dan kapan kamu butuh state management.
2. Menerapkan fitur yang sama dengan **`setState`, Provider, Riverpod, Bloc/Cubit, dan GetX**.
3. Membaca alur data tiap pendekatan: *siapa menyimpan state, siapa membaca, siapa mengubah*.
4. Membandingkan kelebihan dan kekurangan tiap pendekatan, lalu **memilih yang sesuai** kebutuhan.
5. Menerapkan prinsip yang berlaku di semua pendekatan: *UI hanya menampilkan, logika ada di tempat lain*.

## 🧰 Prasyarat

- Sudah menyelesaikan **Modul Interaksi & State Dasar** (event handling, `setState()`, Snackbar).
- Paham `StatelessWidget`, `StatefulWidget`, `Column`, `Card`, dan callback.
- Flutter SDK stable terbaru dan emulator atau Chrome sudah berjalan.

---

## 1. Gambaran Besar

### 1.1 Kenapa Butuh Lebih dari `setState()`?

Di modul sebelumnya, semua state disimpan di dalam satu `State` class. Itu cukup selama state hanya dipakai **satu layar**. Masalah muncul ketika:

- Data harus dipakai **banyak layar** (data login, keranjang belanja, tema aplikasi).
- Logika makin rumit (memanggil API, cache, validasi) dan **tercampur dengan kode UI**.
- Kamu ingin **mengetes logika** tanpa menjalankan tampilan.
- Beberapa widget yang berjauhan di widget tree harus **tahu perubahan yang sama**.

Flutter membedakan dua jenis state:

| Jenis | Arti | Contoh | Alat yang cocok |
|---|---|---|---|
| **Ephemeral (lokal)** | Hanya dipakai satu widget/layar | Switch aktif, bio terbuka | `setState()` |
| **App state (bersama)** | Dipakai banyak widget/layar | Login, keranjang, tema | Provider, Riverpod, Bloc, GetX |

### 1.2 Lima Pendekatan dalam Satu Tabel

| Pendekatan | Wadah state | UI membaca dengan | UI mengubah dengan | UI diberi tahu lewat |
|---|---|---|---|---|
| `setState` | Class `State` | Variabel langsung | `setState(() {...})` | `setState` |
| **Provider** | `ChangeNotifier` | `context.watch<T>()` | `context.read<T>().method()` | `notifyListeners()` |
| **Riverpod** | `Notifier` | `ref.watch(provider)` | `ref.read(provider.notifier).method()` | `state = ...` |
| **Bloc / Cubit** | `Bloc` / `Cubit` | `BlocBuilder` | `add(Event)` / `cubit.method()` | `emit(State)` |
| **GetX** | `GetxController` | `Obx(() => x.value)` | `controller.method()` | Perubahan variabel `.obs` |

### 1.3 Satu Fitur, Lima Cara

Agar adil dibandingkan, **fiturnya sama persis** di semua demo:

- Menampilkan jumlah pengikut (awal `1200`).
- Tombol **Ikuti / Mengikuti**: menambah atau mengurangi jumlah pengikut.
- Snackbar muncul setiap status berubah.

Yang berbeda hanya **cara state disimpan dan dihubungkan ke UI**. Perhatikan: widget tampilannya **tidak berubah sama sekali** di kelima demo.

---

## 2. Persiapan Proyek

### Langkah 1 — Buat proyek

```bash
flutter create state_management_demo
cd state_management_demo
```

### Langkah 2 — Pasang paket

```bash
flutter pub add provider
flutter pub add flutter_riverpod
flutter pub add flutter_bloc equatable
flutter pub add get
```

Perintah ini otomatis memilih versi terbaru yang kompatibel. Jika suatu saat API berubah karena versi baru, cek *changelog* paket di [pub.dev](https://pub.dev).

### Langkah 3 — Susun struktur folder

```text
lib/
├── main.dart                    (boleh dibiarkan)
└── demo/
    ├── shared/
    │   └── follow_card.dart     ← tampilan bersama
    ├── 01_setstate_demo.dart
    ├── 02_provider_demo.dart
    ├── 03_riverpod_demo.dart
    ├── 04_bloc_demo.dart
    └── 05_getx_demo.dart
```

Setiap file demo punya `main()` sendiri, jadi dijalankan satu per satu:

```bash
flutter run -t lib/demo/01_setstate_demo.dart
```

### Langkah 4 — Tampilan bersama (`shared/follow_card.dart`)

Widget ini **tidak menyimpan state apa pun**. Ia hanya menampilkan data yang diberikan dan melaporkan saat tombol ditekan.

```dart
import 'package:flutter/material.dart';

/// "Dumb widget": hanya menampilkan data dan melaporkan event.
/// Tidak tahu apa pun tentang setState, Provider, Riverpod, Bloc, atau GetX.
class FollowCard extends StatelessWidget {
  const FollowCard({
    super.key,
    required this.name,
    required this.followers,
    required this.isFollowing,
    required this.onFollowPressed,
  });

  final String name;
  final int followers;
  final bool isFollowing;
  final VoidCallback onFollowPressed;

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Card(
      margin: const EdgeInsets.all(24),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const CircleAvatar(radius: 40, child: Icon(Icons.person, size: 40)),
            const SizedBox(height: 12),
            Text(name, style: textTheme.titleLarge),
            const SizedBox(height: 4),
            Text('$followers pengikut', style: textTheme.bodyMedium),
            const SizedBox(height: 16),
            isFollowing
                ? OutlinedButton.icon(
                    onPressed: onFollowPressed,
                    icon: const Icon(Icons.check),
                    label: const Text('Mengikuti'),
                  )
                : FilledButton.icon(
                    onPressed: onFollowPressed,
                    icon: const Icon(Icons.person_add),
                    label: const Text('Ikuti'),
                  ),
          ],
        ),
      ),
    );
  }
}

/// Helper Snackbar yang dipakai demo 1–4.
void showFollowSnack(BuildContext context, bool isFollowing) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(
      SnackBar(
        content: Text(
          isFollowing ? 'Kamu mulai mengikuti' : 'Kamu berhenti mengikuti',
        ),
        behavior: SnackBarBehavior.floating,
      ),
    );
}
```

✅ **Checkpoint:** belum ada yang dijalankan. Pastikan file ini tidak menampilkan error merah di editor.

---

## 3. Demo 1 — `setState()`

### Konsep

State disimpan **di dalam widget itu sendiri**. Sudah kamu kuasai: cukup variabel biasa dan `setState()`.

```text
Tap tombol → handler → setState(ubah variabel) → build() ulang
```

### Kode — `lib/demo/01_setstate_demo.dart`

```dart
import 'package:flutter/material.dart';

import 'shared/follow_card.dart';

void main() => runApp(
      MaterialApp(
        theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
        home: const SetStateDemo(),
      ),
    );

class SetStateDemo extends StatefulWidget {
  const SetStateDemo({super.key});

  @override
  State<SetStateDemo> createState() => _SetStateDemoState();
}

class _SetStateDemoState extends State<SetStateDemo> {
  // STATE: tinggal di sini, hanya bisa diakses widget ini
  bool _isFollowing = false;
  int _followers = 1200;

  void _onFollowPressed() {
    setState(() {
      _isFollowing = !_isFollowing;
      _followers += _isFollowing ? 1 : -1;
    });
    showFollowSnack(context, _isFollowing);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('1 · setState')),
      body: Center(
        child: FollowCard(
          name: 'Fakhry Firdaus',
          followers: _followers,
          isFollowing: _isFollowing,
          onFollowPressed: _onFollowPressed,
        ),
      ),
    );
  }
}
```

✅ **Checkpoint:** jalankan `flutter run -t lib/demo/01_setstate_demo.dart`. Tekan tombol: *Ikuti* ⇄ *Mengikuti*, pengikut `1200` ⇄ `1201`, Snackbar muncul.

### Catatan

| 👍 Kelebihan | 👎 Keterbatasan |
|---|---|
| Bawaan Flutter, tanpa paket tambahan | State **terkunci** di satu widget |
| Paling sederhana dan mudah dipahami | Berbagi ke layar lain butuh "oper-operan" parameter |
| Sangat cocok untuk state lokal | Logika bercampur dengan UI, sulit dites |

---

## 4. Demo 2 — Provider

### Konsep

State dipindahkan ke class terpisah yang **meng-extend `ChangeNotifier`**. Class itu "disediakan" (*provide*) di atas widget tree, lalu widget mana pun di bawahnya bisa membaca dan mengubahnya.

```text
Tap tombol → context.read<Model>().toggleFollow()
          → notifyListeners()
          → widget yang memakai context.watch<Model>() dibangun ulang
```

### Tiga bagian penting

| Bagian | Fungsi |
|---|---|
| `ChangeNotifier` | Wadah state + logika. Panggil `notifyListeners()` setelah state berubah |
| `ChangeNotifierProvider` | Menyediakan model ke widget tree (letakkan **di atas** widget yang memakainya) |
| `context.watch` / `context.read` | `watch` = membaca dan ikut membangun ulang; `read` = memanggil tanpa mendengarkan |

### Kode — `lib/demo/02_provider_demo.dart`

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'shared/follow_card.dart';

// ===== MODEL: state + logika, tanpa kode UI =====
class FollowModel extends ChangeNotifier {
  bool _isFollowing = false;
  int _followers = 1200;

  bool get isFollowing => _isFollowing;
  int get followers => _followers;

  void toggleFollow() {
    _isFollowing = !_isFollowing;
    _followers += _isFollowing ? 1 : -1;
    notifyListeners(); // beri tahu semua pendengar
  }
}

void main() => runApp(
      // Sediakan model di atas MaterialApp
      ChangeNotifierProvider(
        create: (_) => FollowModel(),
        child: MaterialApp(
          theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
          home: const ProviderDemo(),
        ),
      ),
    );

// ===== UI: StatelessWidget biasa =====
class ProviderDemo extends StatelessWidget {
  const ProviderDemo({super.key});

  @override
  Widget build(BuildContext context) {
    // watch: dibaca di build() → UI otomatis dibangun ulang
    final model = context.watch<FollowModel>();

    return Scaffold(
      appBar: AppBar(title: const Text('2 · Provider')),
      body: Center(
        child: FollowCard(
          name: 'Fakhry Firdaus',
          followers: model.followers,
          isFollowing: model.isFollowing,
          onFollowPressed: () {
            // read: dipakai di dalam callback, bukan di build()
            final m = context.read<FollowModel>();
            m.toggleFollow();
            showFollowSnack(context, m.isFollowing);
          },
        ),
      ),
    );
  }
}
```

✅ **Checkpoint:** hasilnya sama persis dengan demo 1. Bedanya, `ProviderDemo` sekarang `StatelessWidget` dan state hidup di `FollowModel`.

### Catatan

| 👍 Kelebihan | 👎 Keterbatasan |
|---|---|
| Mudah dipelajari, dekat dengan konsep Flutter | Bergantung pada `BuildContext` dan widget tree |
| Resmi direkomendasikan Flutter selama bertahun-tahun | Salah letak `Provider` (terlalu rendah) → error saat runtime |
| Sedikit *boilerplate* | State tidak bisa dibaca dari luar UI |

> 💡 **Aturan `watch` vs `read`:** `watch` di dalam `build()`, `read` di dalam callback (`onPressed`, dll.). Memakai `watch` di callback atau `read` di `build()` adalah kesalahan paling umum pemula Provider.

---

## 5. Demo 3 — Riverpod

### Konsep

Riverpod dibuat oleh pembuat Provider untuk menutup kelemahannya. State disimpan di **provider global yang tidak bergantung pada widget tree**. UI memakai objek `ref` untuk membaca dan mengubahnya.

```text
Tap tombol → ref.read(followProvider.notifier).toggleFollow()
          → state = state baru
          → widget yang ref.watch(followProvider) dibangun ulang
```

### Bagian penting

| Bagian | Fungsi |
|---|---|
| `Notifier<State>` | Class logika. `build()` mengembalikan state awal, `state = ...` mengubahnya |
| `NotifierProvider` | Mendaftarkan notifier sebagai provider (biasanya variabel global `final`) |
| `ProviderScope` | Pembungkus di akar aplikasi, **wajib** ada |
| `ConsumerWidget` | Widget yang mendapat `ref` |
| `ref.watch / read / listen` | Baca + rebuild / panggil sekali / dengarkan perubahan untuk *side effect* |

> ℹ️ Pada Riverpod versi 3.x, `StateNotifier`, `StateProvider`, dan `ChangeNotifierProvider` dipindahkan ke jalur `legacy`. Untuk kode baru, pakai **`Notifier`** seperti di bawah.

### Kode — `lib/demo/03_riverpod_demo.dart`

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'shared/follow_card.dart';

// ===== STATE: kelas immutable =====
class FollowState {
  const FollowState({this.isFollowing = false, this.followers = 1200});

  final bool isFollowing;
  final int followers;

  FollowState copyWith({bool? isFollowing, int? followers}) => FollowState(
        isFollowing: isFollowing ?? this.isFollowing,
        followers: followers ?? this.followers,
      );
}

// ===== NOTIFIER: logika =====
class FollowNotifier extends Notifier<FollowState> {
  @override
  FollowState build() => const FollowState(); // state awal

  void toggleFollow() {
    final following = !state.isFollowing;
    state = state.copyWith(
      isFollowing: following,
      followers: state.followers + (following ? 1 : -1),
    );
  }
}

// ===== PROVIDER: pintu akses ke notifier =====
final followProvider =
    NotifierProvider<FollowNotifier, FollowState>(FollowNotifier.new);

void main() => runApp(const ProviderScope(child: DemoApp()));

class DemoApp extends StatelessWidget {
  const DemoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
      home: const RiverpodDemo(),
    );
  }
}

// ===== UI: ConsumerWidget =====
class RiverpodDemo extends ConsumerWidget {
  const RiverpodDemo({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // listen: untuk side effect (Snackbar), bukan untuk menggambar UI
    ref.listen(followProvider.select((s) => s.isFollowing), (prev, next) {
      showFollowSnack(context, next);
    });

    // watch: membaca state dan rebuild saat berubah
    final state = ref.watch(followProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('3 · Riverpod')),
      body: Center(
        child: FollowCard(
          name: 'Fakhry Firdaus',
          followers: state.followers,
          isFollowing: state.isFollowing,
          onFollowPressed: () =>
              ref.read(followProvider.notifier).toggleFollow(),
        ),
      ),
    );
  }
}
```

✅ **Checkpoint:** hasil tampilan sama. Perhatikan Snackbar kini dipicu oleh **`ref.listen`** (bereaksi pada perubahan state), bukan dipanggil manual di tombol.

### Catatan

| 👍 Kelebihan | 👎 Keterbatasan |
|---|---|
| Tidak bergantung pada `BuildContext` untuk mengakses state | Konsep lebih banyak (`ref`, jenis provider) |
| Mudah dites dan dikomposisi, bagus untuk data asinkron (API) | Rilis cukup cepat, perlu rutin memperbarui versi |
| Banyak ulasan 2026 menyebutnya pilihan default untuk aplikasi baru | Kurva belajar lebih curam dari Provider |

> 💡 **State yang immutable** (`copyWith`, tidak diubah langsung) adalah pola industri. Setiap perubahan membuat objek baru sehingga perubahan mudah dilacak dan dites.

---

## 6. Demo 4 — Bloc dan Cubit

### Konsep

Bloc memisahkan tiga hal secara tegas:

```text
   UI ──(Event)──► Bloc ──(State)──► UI
 "apa yang        "logika"        "hasilnya"
  terjadi"
```

- **Event**: apa yang terjadi (*"tombol Ikuti ditekan"*).
- **State**: kondisi hasil (*"sudah mengikuti, 1201 pengikut"*).
- **Bloc**: menerima event, menjalankan logika, lalu `emit()` state baru.

**Cubit** adalah versi ringkas Bloc: **tanpa event**, UI langsung memanggil method, lalu `emit()`.

| | Cubit | Bloc |
|---|---|---|
| Input dari UI | Memanggil method | Mengirim `Event` |
| Boilerplate | Lebih sedikit | Lebih banyak |
| Jejak perubahan | State saja | Event + State (mudah diaudit) |

### Kode — `lib/demo/04_bloc_demo.dart`

```dart
import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'shared/follow_card.dart';

// ===== EVENT =====
sealed class FollowEvent {
  const FollowEvent();
}

final class FollowToggled extends FollowEvent {
  const FollowToggled();
}

// ===== STATE (Equatable: dua state dengan isi sama dianggap sama) =====
class FollowState extends Equatable {
  const FollowState({this.isFollowing = false, this.followers = 1200});

  final bool isFollowing;
  final int followers;

  FollowState copyWith({bool? isFollowing, int? followers}) => FollowState(
        isFollowing: isFollowing ?? this.isFollowing,
        followers: followers ?? this.followers,
      );

  @override
  List<Object> get props => [isFollowing, followers];
}

// ===== BLOC: event masuk → state keluar =====
class FollowBloc extends Bloc<FollowEvent, FollowState> {
  FollowBloc() : super(const FollowState()) {
    on<FollowToggled>((event, emit) {
      final following = !state.isFollowing;
      emit(state.copyWith(
        isFollowing: following,
        followers: state.followers + (following ? 1 : -1),
      ));
    });
  }
}

void main() => runApp(
      MaterialApp(
        theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
        home: BlocProvider(
          create: (_) => FollowBloc(),
          child: const BlocDemo(),
        ),
      ),
    );

class BlocDemo extends StatelessWidget {
  const BlocDemo({super.key});

  @override
  Widget build(BuildContext context) {
    // BlocListener: untuk side effect (Snackbar)
    return BlocListener<FollowBloc, FollowState>(
      listenWhen: (prev, curr) => prev.isFollowing != curr.isFollowing,
      listener: (context, state) => showFollowSnack(context, state.isFollowing),
      child: Scaffold(
        appBar: AppBar(title: const Text('4 · Bloc')),
        body: Center(
          // BlocBuilder: menggambar UI dari state
          child: BlocBuilder<FollowBloc, FollowState>(
            builder: (context, state) => FollowCard(
              name: 'Fakhry Firdaus',
              followers: state.followers,
              isFollowing: state.isFollowing,
              onFollowPressed: () =>
                  context.read<FollowBloc>().add(const FollowToggled()),
            ),
          ),
        ),
      ),
    );
  }
}
```

### Versi Cubit (lebih ringkas)

Ganti `FollowEvent` dan `FollowBloc` dengan:

```dart
class FollowCubit extends Cubit<FollowState> {
  FollowCubit() : super(const FollowState());

  void toggleFollow() {
    final following = !state.isFollowing;
    emit(state.copyWith(
      isFollowing: following,
      followers: state.followers + (following ? 1 : -1),
    ));
  }
}
```

Lalu di UI: `BlocProvider(create: (_) => FollowCubit(), ...)`, `BlocBuilder<FollowCubit, FollowState>`, dan tombol memanggil `context.read<FollowCubit>().toggleFollow()`.

✅ **Checkpoint:** tampilan sama. Coba tambahkan `print` di dalam `on<FollowToggled>` untuk melihat alur *event → state*.

### Catatan

| 👍 Kelebihan | 👎 Keterbatasan |
|---|---|
| Struktur sangat jelas dan konsisten antar anggota tim | **Boilerplate paling banyak** untuk fitur sederhana |
| Paling mudah dites dan diaudit (setiap event tercatat) | Terasa "berat" untuk aplikasi kecil |
| Populer di tim besar dan domain yang ketat | Perlu disiplin memisahkan event, state, dan UI |

> 💡 Di industri, **Cubit sering dipakai untuk fitur sederhana** dan Bloc penuh untuk alur yang kompleks (misalnya proses checkout dengan banyak langkah).

---

## 7. Demo 5 — GetX

### Konsep

GetX menawarkan cara paling ringkas: variabel dibuat *reaktif* dengan `.obs`, dan widget yang membacanya di dalam `Obx` otomatis ikut berubah. GetX juga mencakup navigasi, dependency injection, dan Snackbar tanpa `BuildContext`.

```text
Tap tombol → controller.toggleFollow()
          → nilai .obs berubah
          → Obx yang membaca nilai itu otomatis rebuild
```

### Bagian penting

| Bagian | Fungsi |
|---|---|
| `GetxController` | Wadah state + logika |
| `.obs` | Menjadikan variabel *reaktif* (`RxBool`, `RxInt`, ...). Nilai dibaca/diubah lewat `.value` |
| `Obx(() => ...)` | Membangun ulang otomatis; **harus** membaca `.value` di dalamnya |
| `Get.put` / `Get.find` | Mendaftarkan / mengambil controller |
| `GetMaterialApp` | Pengganti `MaterialApp` agar fitur GetX (Snackbar, navigasi) berfungsi |

### Kode — `lib/demo/05_getx_demo.dart`

```dart
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'shared/follow_card.dart';

// ===== CONTROLLER: state reaktif + logika =====
class FollowController extends GetxController {
  final isFollowing = false.obs;
  final followers = 1200.obs;

  void toggleFollow() {
    isFollowing.value = !isFollowing.value;
    followers.value += isFollowing.value ? 1 : -1;

    // Snackbar tanpa BuildContext (praktis, tapi lihat catatan di bawah)
    Get.closeAllSnackbars();
    Get.snackbar(
      'Kartu Profil',
      isFollowing.value ? 'Kamu mulai mengikuti' : 'Kamu berhenti mengikuti',
      snackPosition: SnackPosition.BOTTOM,
    );
  }
}

void main() => runApp(
      GetMaterialApp(
        theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
        home: const GetxDemo(),
      ),
    );

class GetxDemo extends StatelessWidget {
  const GetxDemo({super.key});

  @override
  Widget build(BuildContext context) {
    // Daftarkan controller (cukup sekali)
    final controller = Get.put(FollowController());

    return Scaffold(
      appBar: AppBar(title: const Text('5 · GetX')),
      body: Center(
        // Obx: rebuild otomatis saat .obs yang dibaca di dalamnya berubah
        child: Obx(
          () => FollowCard(
            name: 'Fakhry Firdaus',
            followers: controller.followers.value,
            isFollowing: controller.isFollowing.value,
            onFollowPressed: controller.toggleFollow,
          ),
        ),
      ),
    );
  }
}
```

✅ **Checkpoint:** tampilan sama, Snackbar kini bergaya GetX. Coba hapus `.value` di dalam `Obx` dan lihat apa yang terjadi (peringatan *improper use of GetX*).

### Catatan

| 👍 Kelebihan | 👎 Keterbatasan |
|---|---|
| Paling sedikit kode, cepat untuk prototipe | Terlalu "ajaib": mudah campur aduk UI, logika, dan navigasi |
| Satu paket untuk banyak kebutuhan | `Get.snackbar` di controller membuat logika **terikat ke UI** |
| Tidak perlu `BuildContext` | Pemeliharaan paket menjadi perhatian tim (dilaporkan sempat tidak tersedia di GitHub pada April 2026, lalu kembali online) |

> ⚠️ **Pertimbangkan sebelum memakai GetX di proyek jangka panjang.** Tim profesional umumnya menilai keberlanjutan pemeliharaan paket, kemudahan tes, dan konsistensi arsitektur. Kamu tetap akan menemui GetX di banyak proyek lama, jadi penting untuk memahaminya.

---

## 8. Perbandingan Berdampingan

| Aspek | `setState` | Provider | Riverpod | Bloc / Cubit | GetX |
|---|---|---|---|---|---|
| Paket tambahan | Tidak | Ya | Ya | Ya | Ya |
| Jumlah kode (fitur kecil) | Paling sedikit | Sedikit | Sedang | Banyak (Bloc) / sedang (Cubit) | Sedikit |
| Kurva belajar | Landai | Landai | Sedang | Sedang–curam | Landai |
| State bisa dipakai banyak layar | ❌ | ✅ | ✅ | ✅ | ✅ |
| Logika terpisah dari UI | ❌ | ✅ | ✅ | ✅ (paling tegas) | ⚠️ tergantung disiplin |
| Mudah dites tanpa UI | ❌ | ✅ | ✅ | ✅ (paling mudah) | ⚠️ |
| Bergantung `BuildContext` | Ya | Ya | Tidak | Ya (akses via context) | Tidak |
| Cocok untuk | State lokal | Aplikasi kecil–menengah, proyek lama | Aplikasi baru, data asinkron | Tim besar, alur ketat | Prototipe, proyek lama |

> Tabel ini gambaran umum. Pilihan tiap tim bisa berbeda tergantung ukuran proyek, pengalaman tim, dan kebutuhan.

## 9. Bagaimana Memilih?

| Situasi | Pilihan yang masuk akal |
|---|---|
| State hanya dipakai satu widget (switch, expand, tab aktif) | **`setState`** (atau `ValueNotifier` bawaan) |
| Belajar konsep berbagi state, aplikasi kecil | **Provider** |
| Aplikasi baru, banyak data dari API, ingin mudah dites | **Riverpod** |
| Tim besar, alur kompleks, butuh jejak audit | **Bloc / Cubit** |
| Prototipe cepat, atau meneruskan proyek lama yang sudah memakainya | **GetX** |

**Aturan praktis industri:**

1. Mulai dari yang paling sederhana. Jangan memakai Bloc untuk satu tombol.
2. **Kamu boleh dan sering memadukan**: `setState` untuk state lokal kecil + satu solusi global untuk app state.
3. **Satu proyek, satu solusi global.** Mencampur Provider, Bloc, dan GetX sekaligus membuat tim bingung.
4. Ikuti keputusan tim. Konsistensi lebih berharga daripada "yang paling keren".

---

## 10. Prinsip yang Berlaku di Semua Pendekatan

Perhatikan: `FollowCard` **tidak berubah sedikit pun** di kelima demo. Itu bukan kebetulan.

| # | Prinsip | Mengapa |
|---|---|---|
| 1 | **UI hanya menampilkan dan melaporkan event** | Widget bisa dipakai ulang dan dites sendiri |
| 2 | **Logika di luar widget** (model, notifier, bloc, controller) | Bisa dites tanpa menjalankan tampilan |
| 3 | **State immutable** (`copyWith`) bila memungkinkan | Perubahan mudah dilacak dan minim bug |
| 4 | **Satu sumber kebenaran** untuk tiap data | Tidak ada dua nilai yang saling bertentangan |
| 5 | **Pisahkan *side effect*** (Snackbar, navigasi) dari menggambar UI | `ref.listen`, `BlocListener`, atau panggilan di handler |
| 6 | **Dengarkan seperlunya** (`select`, `buildWhen`, `Selector`) | Rebuild lebih sedikit, performa lebih baik |
| 7 | **Nama jelas**: `FollowModel`, `FollowNotifier`, `FollowBloc` | Mudah dicari dan dipahami tim |

### Contoh: Logika yang Bisa Dites Tanpa UI

Karena `FollowModel` (Demo 2) tidak mengandung kode UI, ia bisa dites langsung. Buat `test/follow_model_test.dart`:

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:state_management_demo/demo/02_provider_demo.dart';

void main() {
  test('toggleFollow menambah lalu mengurangi pengikut', () {
    final model = FollowModel();

    model.toggleFollow();
    expect(model.isFollowing, true);
    expect(model.followers, 1201);

    model.toggleFollow();
    expect(model.isFollowing, false);
    expect(model.followers, 1200);
  });
}
```

Jalankan dengan `flutter test`. Coba lakukan hal yang sama pada demo 1 (`setState`). Bisakah kamu mengetes logikanya tanpa menjalankan widget? Itulah alasan utama state dipisahkan dari UI.

---

## 11. 🛠️ Pemecahan Masalah Umum

| Pendekatan | Gejala | Penyebab | Solusi |
|---|---|---|---|
| Provider | `Could not find the correct Provider<...>` | Provider berada di bawah widget yang memakainya | Letakkan `ChangeNotifierProvider` **di atas** widget tersebut |
| Provider | UI tidak update | Lupa `notifyListeners()` | Panggil setelah state berubah |
| Provider | UI tidak update | Memakai `context.read` di `build()` | Pakai `context.watch` di `build()` |
| Riverpod | `No ProviderScope found` | `ProviderScope` belum membungkus aplikasi | `runApp(const ProviderScope(child: ...))` |
| Riverpod | UI tidak update | Memakai `ref.read` di `build()` | Pakai `ref.watch` di `build()` |
| Riverpod | Error saat memakai `StateNotifier`/`StateProvider` | Dipindah ke `legacy` di versi 3.x | Pakai `Notifier` / `NotifierProvider` |
| Bloc | `BlocProvider.of() called with a context that does not contain` | Context berada di atas `BlocProvider` | Pakai `Builder` atau pindahkan widget ke bawah `BlocProvider` |
| Bloc | UI tidak rebuild saat state berubah | State tidak berubah menurut `==` (Equatable) atau objek lama dimodifikasi | Selalu `emit` objek **baru** dengan `copyWith` |
| GetX | UI tidak update | `.value` tidak dibaca di dalam `Obx` | Baca `.value` di dalam closure `Obx` |
| GetX | `Get.snackbar` tidak muncul | Memakai `MaterialApp`, bukan `GetMaterialApp` | Ganti ke `GetMaterialApp` |
| Semua | Perubahan aneh setelah menambah state | Hot reload mempertahankan state lama | Lakukan **Hot Restart** |

---

## 12. 🏆 Challenge

| Level | Tantangan |
|---|---|
| ⭐ | Tambahkan state ketiga `isOpenToWork` (Switch) ke **kelima** demo. Bandingkan berapa baris kode yang kamu tambahkan di tiap pendekatan. |
| ⭐ | Pada demo 2, tambahkan tombol "Reset" di `AppBar` yang mengembalikan pengikut ke `1200`. |
| ⭐⭐ | Pada demo 3, gunakan `ref.watch(followProvider.select((s) => s.followers))` di widget terpisah yang hanya menampilkan jumlah pengikut. Buktikan widget lain tidak ikut rebuild (petunjuk: `debugPrint` di `build()`). |
| ⭐⭐ | Ubah demo 4 menjadi **Cubit**, lalu bandingkan jumlah kode dan alurnya dengan versi Bloc. |
| ⭐⭐⭐ | **Dua layar, satu state:** buat layar kedua (`Navigator.push`) yang menampilkan jumlah pengikut yang sama. Ikuti/berhenti di layar 1, lalu cek layar 2. Lakukan dengan Provider **dan** Riverpod. Mengapa ini sulit dilakukan dengan `setState`? |
| ⭐⭐⭐ | Tulis unit test untuk `FollowNotifier` (Riverpod, pakai `ProviderContainer`) atau `FollowCubit` (pakai paket `bloc_test`). |
| 🌟 Bonus | Cari satu aplikasi open-source Flutter di GitHub, lalu tentukan pendekatan state management apa yang dipakai dan alasannya. |

---

## 13. ✅ Cek Pemahaman

1. Apa beda **ephemeral state** dan **app state**? Beri contoh masing-masing di Kartu Profil Digital.
2. Mengapa `FollowCard` bisa dipakai tanpa perubahan di kelima demo?
3. Apa beda `context.watch` dan `context.read` pada Provider? Kapan memakai masing-masing?
4. Pada Riverpod, apa fungsi `ref.listen` dan mengapa Snackbar cocok memakainya, bukan `ref.watch`?
5. Apa beda **Cubit** dan **Bloc**? Kapan kamu memilih masing-masing?
6. Mengapa `Get.snackbar` di dalam controller bisa menjadi masalah untuk pengetesan?
7. Jika timmu sudah memakai Provider, apakah kamu langsung menggantinya ke Riverpod? Mengapa atau mengapa tidak?

---

## 14. 📚 Referensi

- [State management — docs.flutter.dev](https://docs.flutter.dev/data-and-backend/state-mgmt/intro)
- [Ephemeral vs app state — docs.flutter.dev](https://docs.flutter.dev/data-and-backend/state-mgmt/ephemeral-vs-app)
- [Daftar pendekatan state management — docs.flutter.dev](https://docs.flutter.dev/data-and-backend/state-mgmt/options)
- [provider — pub.dev](https://pub.dev/packages/provider)
- [flutter_riverpod — pub.dev](https://pub.dev/packages/flutter_riverpod) · [riverpod.dev](https://riverpod.dev)
- [flutter_bloc — pub.dev](https://pub.dev/packages/flutter_bloc) · [bloclibrary.dev](https://bloclibrary.dev)
- [get — pub.dev](https://pub.dev/packages/get)

---

**Selamat! 🎉** Kamu sudah melihat satu fitur yang sama diwujudkan dengan lima cara. Pilihan alat bisa berganti seiring waktu, tetapi prinsip intinya tetap: **state di satu tempat yang jelas, UI hanya membaca dan melaporkan event.**
