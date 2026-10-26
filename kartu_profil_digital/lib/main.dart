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