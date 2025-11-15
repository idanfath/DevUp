<div align="center">
  <img src="public/logo2.svg" alt="DevUp Logo" height="120">

  # DevUp

  ### 🎮 Platform Tantangan Coding Berbasis AI

  **Coding. Belajar. Kuasai Kemampuanmu!**

  [![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat&logo=laravel)](https://laravel.com)
  [![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat&logo=react)](https://reactjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)
  [![Inertia.js](https://img.shields.io/badge/Inertia.js-2.1-9553E9?style=flat)](https://inertiajs.com)

  [Fitur](#-fitur) • [Instalasi](#-instalasi) • [Tech Stack](#-tech-stack) • [Penggunaan](#-cara-kerja)

</div>

---

## ⚡ Mulai Cepat

```bash
# 1. Clone dan install
git clone https://github.com/idanfath/DevUp.git
cd DevUp
composer install && npm install

# 2. Konfigurasi environment
cp .env.example .env
php artisan key:generate

# 3. Tambahkan Groq API key ke .env
GROQ_API_KEY=your_api_key_here

# 4. Setup database
php artisan migrate --seed

# 5. Build dan jalankan
npm run build
php artisan serve
```

**Selesai!** Kunjungi http://localhost:8000 dan mulai coding! 🎮

---

## 📖 Tentang

**DevUp** adalah platform tantangan coding berbasis AI yang dirancang untuk membantu developer meningkatkan kemampuan programming melalui tantangan terstruktur dan gamifikasi. Dibangun untuk **Sevent 9.0** dengan tema **"Game, Code, and Play – Sharpening Creativity and Skills in the Arena of Competition"** dan subtema **"AI for New Opportunities"**.

DevUp menggunakan **Groq AI (Llama 3.3 70B)** untuk menghasilkan tantangan coding yang unik dan memberikan feedback yang cerdas dan detail terhadap solusi yang dikirimkan. Platform ini mendukung berbagai bahasa pemrograman dan menawarkan dua jenis tantangan berbeda untuk menguji berbagai aspek kemampuan coding.

### 🎯 Visi

Mengubah pendidikan coding menjadi pengalaman belajar yang menarik dan personal dimana developer dapat berlatih, meningkatkan kemampuan, dan menguasai skill programming melalui tantangan yang dihasilkan AI dan feedback yang komprehensif.

---

## ✨ Fitur

### 🤖 **Generasi Tantangan Berbasis AI**
- Generasi tantangan dinamis menggunakan Groq AI (Llama 3.3 70B)
- Kalibrasi tingkat kesulitan yang cerdas (Mudah, Sedang, Sulit)
- Sistem variasi mencegah masalah berulang
- Generasi masalah yang sadar konteks berdasarkan riwayat terkini

### 🎯 **Evaluasi AI Komprehensif**
- Sistem penilaian multi-kriteria:
  - **Kebenaran** (50 poin): Akurasi solusi dan penanganan edge case
  - **Kualitas Kode** (30 poin): Keterbacaan, struktur, dan best practices
  - **Efisiensi** (20 poin): Optimasi algoritma dan performa
- Feedback detail dengan saran perbaikan spesifik
- Solusi yang disarankan disediakan untuk pembelajaran
- Penjelasan untuk keputusan penilaian

### 🐛 **Dua Mode Tantangan**
1. **Debug Challenge**: Temukan dan perbaiki bug dalam kode yang rusak
   - Error syntax dan logic yang realistis
   - Tingkat kesulitan progresif
   - Sistem hints untuk panduan
   - Contoh output yang diharapkan
2. **Problem Solving**: Tulis solusi dari awal
   - Template kode awal
   - Contoh input/output
   - Batasan dan persyaratan
   - Function signature disediakan

### 🌐 **Dukungan Multi-Bahasa**
Mendukung 10+ bahasa pemrograman:
- Python
- JavaScript
- TypeScript
- Java
- C++
- C#
- Go
- Rust
- PHP
- Ruby

### 🎮 **Sistem Gaming Solo**
- Sesi game yang dapat dikustomisasi (1-7 ronde)
- Pilih tingkat kesulitan Anda
- Pilih preferensi tipe tantangan
- Lacak progres di seluruh ronde
- Update skor real-time
- Lihat hasil game komprehensif dengan rincian detail

### 📊 **Statistik & Progres**
- Total pertandingan yang dimainkan
- Pelacakan tingkat kemenangan (game dengan skor 600+ poin)
- Rata-rata skor per game
- Bahasa pemrograman yang paling sering digunakan
- Riwayat game lengkap dengan filter
- Analisis performa ronde individual

### 👤 **Profil Pengguna**
- Nickname yang dapat dikustomisasi
- Upload foto profil
- Dashboard statistik personal
- Ringkasan riwayat pertandingan

### 👨‍💼 **Dashboard Admin**
- Ringkasan statistik platform
- Sistem manajemen user (buat, edit, hapus user)
- Distribusi tipe game dan tingkat kesulitan
- Pelacakan popularitas bahasa
- Leaderboard top performers
- Monitoring aktivitas game terkini
- Lihat hasil game user manapun

### 🎨 **UI/UX Modern**
- Desain bersih dan profesional dengan komponen shadcn/ui
- Integrasi Monaco Editor (editor VS Code)
- Layout responsif (Mobile, Tablet, Desktop)
- Tampilan feedback real-time
- Transisi halaman yang mulus dengan Inertia.js
- Loading states dan error handling

### 🔐 **Autentikasi & Keamanan**
- Autentikasi aman dengan Laravel Fortify
- Dukungan Two-Factor Authentication (2FA)
- Verifikasi email
- Fungsi reset password
- Kontrol akses berbasis role (Admin/User)
- Manajemen sesi

---

## 🚀 Demo

> **Catatan**: Link demo akan segera tersedia.

---

## 🛠️ Tech Stack

### **Backend**
- **Framework**: Laravel 12.x (PHP 8.2+)
- **Autentikasi**: Laravel Fortify
- **Database**: MySQL/PostgreSQL/SQLite
- **Integrasi AI**: Groq API (Llama 3.3 70B Versatile)
- **Testing**: Pest PHP

### **Frontend**
- **UI Framework**: React 19.x
- **Bahasa**: TypeScript 5.7
- **Routing**: Inertia.js 2.1 (dengan Laravel Wayfinder)
- **Styling**: Tailwind CSS 4.0
- **Komponen**: Radix UI, shadcn/ui
- **Code Editor**: Monaco Editor (@monaco-editor/react)
- **Icons**: Lucide React
- **Build Tool**: Vite 7.x

### **Development Tools**
- **Kualitas Kode**: ESLint, Prettier
- **Testing**: Pest PHP
- **Version Control**: Git
- **Package Managers**: Composer, npm/pnpm

---

## 📦 Instalasi

### Prasyarat

- PHP >= 8.2
- Composer
- Node.js >= 20.x
- npm/pnpm
- MySQL/PostgreSQL (atau SQLite untuk development)
- Groq API Key ([Dapatkan di sini](https://console.groq.com))

### Panduan Setup Lengkap

```bash
# 1. Clone repository
git clone https://github.com/idanfath/DevUp.git
cd DevUp

# 2. Install dependensi PHP
composer install

# 3. Install dependensi JavaScript
npm install
# atau menggunakan pnpm
pnpm install

# 4. Copy file environment
cp .env.example .env

# 5. Generate application key
php artisan key:generate

# 6. Konfigurasi database di .env
# Untuk SQLite (development):
DB_CONNECTION=sqlite
# DB_DATABASE=/absolute/path/to/database.sqlite

# Untuk MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=devup
# DB_USERNAME=root
# DB_PASSWORD=

# 7. Tambahkan Groq API key ke .env
GROQ_API_KEY=your_groq_api_key_here

# 8. Buat database (SQLite)
touch database/database.sqlite

# 9. Jalankan migrations
php artisan migrate

# 10. Seed database dengan default admin user
php artisan db:seed

# 11. Build frontend assets
npm run build

# 12. Jalankan development server
php artisan serve
```

### Kredensial Admin Default
```
Email: admin@example.com
Password: password
```

### Mode Development

```bash
# Jalankan semua service (Laravel, Vite, Queue) bersamaan
composer dev

# Atau manual:
php artisan serve          # Terminal 1
npm run dev                # Terminal 2
php artisan queue:listen   # Terminal 3 (opsional)
```

---

## 🎮 Cara Kerja

### 1. **Daftar / Login**
- Buat akun baru atau login dengan kredensial yang ada
- Admin diarahkan ke dashboard, user ke lobby

### 2. **Konfigurasi Game**
- Pilih bahasa pemrograman (Python, JavaScript, dll.)
- Pilih tingkat kesulitan (Mudah, Sedang, Sulit)
- Pilih tipe tantangan (Debug atau Problem Solving)
- Tentukan jumlah ronde (1-7)

### 3. **Mainkan Ronde**
- AI menghasilkan tantangan unik berdasarkan pengaturan Anda
- Sistem variasi memastikan tidak ada masalah berulang
- Tulis solusi Anda di Monaco Editor
- Submit kode untuk evaluasi

### 4. **Evaluasi AI**
- **Kebenaran**: Menguji solusi terhadap persyaratan
- **Kualitas Kode**: Menganalisis keterbacaan dan best practices
- **Efisiensi**: Mengevaluasi performa algoritma
- Terima skor (0-100) dan feedback detail
- Lihat solusi optimal yang disarankan

### 5. **Lanjut ke Ronde Berikutnya**
- Progres otomatis setelah 3 detik
- Pelacakan skor kumulatif
- Halaman hasil akhir dengan rincian komprehensif
- Lihat performa ronde individual

### 6. **Lacak Progres**
- Lihat riwayat game
- Analisis tren performa
- Cek dashboard statistik
- Review solusi dan feedback masa lalu

---

## 📂 Struktur Project

```
DevUp/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── DashboardController.php    # Admin analytics
│   │       ├── GameController.php         # Logika game
│   │       ├── LobbyController.php        # Lobby user
│   │       └── UserManagementController.php # Manajemen user admin
│   ├── Models/
│   │   ├── History.php                    # Sesi game
│   │   ├── RoundHistory.php              # Ronde individual
│   │   └── User.php                       # Akun user
│   └── Services/
│       └── GroqService.php               # Integrasi AI
├── database/
│   ├── migrations/                        # Skema database
│   └── seeders/
│       └── DatabaseSeeder.php            # Default admin user
├── resources/
│   ├── css/
│   │   └── app.css                       # Style global
│   └── js/
│       ├── components/
│       │   └── ui/                       # Komponen shadcn/ui
│       ├── layouts/
│       │   └── app-layout.tsx           # Layout utama
│       ├── pages/
│       │   ├── auth/                    # Halaman autentikasi
│       │   ├── game/
│       │   │   ├── arena.tsx            # Arena game
│       │   │   ├── configure.tsx        # Setup game
│       │   │   ├── history.tsx          # Riwayat game
│       │   │   └── results.tsx          # Hasil game
│       │   ├── dashboard.tsx            # Dashboard admin
│       │   ├── lobby.tsx                # Lobby user
│       │   └── welcome.tsx              # Landing page
│       └── types/
│           └── index.d.ts               # Definisi TypeScript
├── routes/
│   ├── web.php                          # Route aplikasi
│   └── settings.php                     # Route pengaturan user
├── .env.example                         # Template environment
├── composer.json                        # Dependensi PHP
├── package.json                         # Dependensi Node
└── README.md                            # File ini
```

---

## 🗄️ Skema Database

### Tabel Utama

#### **users**
- `id`: Primary key
- `username`: Username unik
- `email`: Alamat email unik
- `password`: Password ter-hash
- `role`: admin|user (enum)
- `nickname`: Nama tampilan
- `profile_path`: Path foto profil
- `bio`: Bio user
- `total_matches`: Jumlah game yang diselesaikan

#### **histories**
- `id`: Primary key
- `user_id`: Foreign key ke users
- `language`: Bahasa pemrograman yang digunakan
- `difficulty`: easy|medium|hard
- `gametype`: debug|problem-solving
- `round`: Jumlah ronde
- `total_score`: Skor kumulatif
- `start_time`: Timestamp mulai game
- `end_time`: Timestamp selesai game

#### **round_histories**
- `id`: Primary key
- `history_id`: Foreign key ke histories
- `round_number`: Nomor urutan ronde
- `question`: JSON (detail tantangan)
- `problem_summary`: Deskripsi singkat masalah
- `type`: Tipe tantangan
- `initial_code`: Kode awal/buggy
- `user_code`: Solusi yang dikirimkan
- `score`: Skor ronde (0-100)
- `evaluation`: JSON (feedback AI)
- `submitted_at`: Timestamp pengiriman

---

## 🧪 Testing

```bash
# Jalankan semua test
composer test

# Jalankan file test spesifik
php artisan test tests/Feature/Auth/LoginTest.php

# Jalankan dengan coverage
php artisan test --coverage
```

---

## 🔑 Environment Variables

Variabel environment kunci untuk dikonfigurasi:

```env
# Aplikasi
APP_NAME=DevUp
APP_ENV=local
APP_KEY=base64:...
APP_URL=http://localhost

# Database
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite

# Groq AI
GROQ_API_KEY=your_groq_api_key_here

# Mail (untuk reset password, 2FA)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
```

---

## 🤝 Kontribusi

Kami menerima kontribusi! Silakan ikuti langkah-langkah berikut:

1. Fork repository
2. Buat feature branch (`git checkout -b feature/FiturKeren`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan FiturKeren'`)
4. Push ke branch (`git push origin feature/FiturKeren`)
5. Buka Pull Request

### Code Style

- **PHP**: Ikuti standar coding PSR-12 (diterapkan oleh Laravel Pint)
- **TypeScript**: Ikuti konfigurasi ESLint
- **React**: Gunakan functional components dengan hooks
- **Commits**: Gunakan format conventional commits

---

## 📄 Lisensi

Project ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk detail.

---

## 👥 Tim

**DevUp** dikembangkan oleh:

- **Muhammad Zidan Fathurrahman** - Project Lead & Full Stack Developer
- **Zhafran Atthaurrahman Alezaryan** - UI/UX Designer
- **Tsara Naila Alfikri** - UI/UX Designer

---

## 🙏 Acknowledgments

- Dibangun untuk kompetisi **Sevent 9.0**
- Didukung oleh [Laravel](https://laravel.com), [React](https://reactjs.org), dan [Inertia.js](https://inertiajs.com)
- Evaluasi AI oleh [Groq](https://groq.com) (Llama 3.3 70B)
- Komponen UI dari [Radix UI](https://www.radix-ui.com) dan [shadcn/ui](https://ui.shadcn.com)
- Icons oleh [Lucide](https://lucide.dev)
- Code editor oleh [Monaco Editor](https://microsoft.github.io/monaco-editor/)

---

## 📧 Kontak

Untuk pertanyaan, saran, atau feedback:

- **Email**: zidanfath72@gmail.com
- **GitHub**: [@idanfath](https://github.com/idanfath)
- **Project Repository**: [DevUp](https://github.com/idanfath/DevUp)

---

<div align="center">

  **Dibuat dengan ❤️ untuk developer yang suka coding dan belajar**

  ⭐ Star repo ini jika menurut Anda bermanfaat!

</div>
