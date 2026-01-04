
# AEGIS

AEGIS adalah aplikasi web berbasis React yang menyediakan antarmuka pengguna modern untuk interaksi chatbot, manajemen tiket, dan pengelolaan mesin. Proyek ini dirancang untuk mendukung kebutuhan monitoring, analisis, dan kolaborasi berbasis web dengan tampilan responsif dan fitur lengkap.

## Tech Stack

- **Frontend Framework:** React 19, Vite
- **Styling:** Tailwind CSS, tw-animate-css, @tailwindcss/typography
- **UI Components:** Radix UI, Lucide React, Tabler Icons
- **State & Form:** React Hook Form, Zod
- **Routing:** React Router DOM
- **Charting:** Recharts
- **Markdown:** React Markdown, Remark GFM

## Setup & Installation

1. **Clone repository**
	```bash
	git clone <repo-url>
	cd chatbot-ui
	```

2. **Install dependencies**
	```bash
	npm install
	```

3. **Jalankan aplikasi (development mode)**
	```bash
	npm run dev
	```
	Aplikasi akan berjalan di `http://localhost:5173` (default Vite).

4. **Build untuk production**
	```bash
	npm run build
	```

## Konfigurasi

- **Proxy API:**
  Sudah dikonfigurasi di `vite.config.js` untuk endpoint `/api` ke backend (lihat file untuk detail).

---
