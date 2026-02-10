const jarumDetik = document.querySelector('.detik');
const jarumMenit = document.querySelector('.menit');
const jarumJam = document.querySelector('.jam');
const elemenTengah = document.querySelector('.tengah');

let waktuSekarang = null; 

/**
 * 1. Mengambil waktu real-time dari Server Jakarta
 */
async function sinkronkanWaktu() {
    try {
        const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Asia/Jakarta');
        const data = await response.json();
        
        // Memastikan format dateTime valid untuk object Date
        waktuSekarang = new Date(data.dateTime);
        console.log("Sinkronisasi Berhasil: " + waktuSekarang);
    } catch (err) {
        console.error("Gagal sinkronisasi, menggunakan waktu lokal.");
        waktuSekarang = new Date();
    }
}

/**
 * 2. Logika pergerakan jarum & Perubahan Gambar
 */
function jalankanWaktu() {
    if (!waktuSekarang) return;

    // Tambahkan 1 detik ke object waktu di memori
    waktuSekarang.setSeconds(waktuSekarang.getSeconds() + 1);

    const detik = waktuSekarang.getSeconds();
    const menit = waktuSekarang.getMinutes();
    const jam = waktuSekarang.getHours();

    // --- LOGIKA DURASI 18:00 - 06:00 ---
    const isMalam = (jam >= 18 || jam < 6);
    
    const daftarElemen = [jarumJam, jarumMenit, jarumDetik, elemenTengah];
    daftarElemen.forEach(el => {
        if (el) {
            if (isMalam) {
                el.classList.add('mode-malam');
            } else {
                el.classList.remove('mode-malam');
            }
        }
    });

    // Kalkulasi rotasi
    const derajatDetik = (detik / 60) * 360; 
    const derajatMenit = ((menit / 60) * 360) + ((detik / 60) * 6);
    const derajatJam = (((jam % 12) / 12) * 360) + ((menit / 60) * 30);

    // Update tampilan visual
    if (jarumDetik) jarumDetik.style.transform = `translateX(-50%) rotate(${derajatDetik}deg)`;
    if (jarumMenit) jarumMenit.style.transform = `translateX(-50%) rotate(${derajatMenit}deg)`;
    if (jarumJam) jarumJam.style.transform = `translateX(-50%) rotate(${derajatJam}deg)`;
}

/**
 * 3. Deteksi Tab Aktif (Agar jam tidak ngaco saat tab ditinggal lama)
 */
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'visible') {
        sinkronkanWaktu();
    }
});

/**
 * 4. Eksekusi Awal (WAJIB ADA AGAR JAM JALAN)
 */
sinkronkanWaktu().then(() => {
    // Jalankan fungsi update setiap 1000ms (1 detik)
    setInterval(jalankanWaktu, 1000);
    // Panggil sekali langsung agar tidak menunggu 1 detik pertama
    jalankanWaktu();
});

// Re-sinkronisasi otomatis setiap 30 menit
setInterval(sinkronkanWaktu, 1800000);
