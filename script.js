const jarumDetik = document.querySelector('.detik');
const jarumMenit = document.querySelector('.menit');
const jarumJam = document.querySelector('.jam');

let waktuSekarang = null; 

/**
 * 1. Mengambil waktu real-time dari Server Jakarta
 */
async function sinkronkanWaktu() {
    try {
        const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Asia/Jakarta');
        const data = await response.json();
        
        // Update waktu di memori dengan data terbaru dari server
        waktuSekarang = new Date(data.dateTime);
        
        console.log("Sinkronisasi Berhasil: Waktu server diperbarui.");
    } catch (err) {
        console.error("Gagal sinkronisasi dengan server.");
    }
}

/**
 * 2. Logika pergerakan jarum (berjalan secara mandiri)
 */
function jalankanWaktu() {
    if (!waktuSekarang) return;

    // Tambahkan 1 detik ke objek waktu di memori
    waktuSekarang.setSeconds(waktuSekarang.getSeconds() + 1);

    const detik = waktuSekarang.getSeconds();
    const menit = waktuSekarang.getMinutes();
    const jam = waktuSekarang.getHours();

    // Kalkulasi rotasi
    const derajatDetik = (detik / 60) * 360; 
    const derajatMenit = ((menit / 60) * 360) + ((detik / 60) * 6);
    const derajatJam = (((jam % 12) / 12) * 360) + ((menit / 60) * 30);

    // Update tampilan visual
    jarumDetik.style.transform = `translateX(-50%) rotate(${derajatDetik}deg)`;
    jarumMenit.style.transform = `translateX(-50%) rotate(${derajatMenit}deg)`;
    jarumJam.style.transform = `translateX(-50%) rotate(${derajatJam}deg)`;
}

/**
 * 3. Event Listener untuk Deteksi Tab Aktif
 * Jika user kembali ke tab ini, jam akan langsung ambil waktu terbaru dari server
 */
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'visible') {
        console.log("Tab aktif kembali, menyelaraskan waktu...");
        sinkronkanWaktu();
    }
});

/**
 * 4. Inisialisasi awal
 */
sinkronkanWaktu().then(() => {
    // Jalankan pergerakan jarum setiap 1 detik
    setInterval(jalankanWaktu, 1000);
    jalankanWaktu();
});

// Re-sinkronisasi otomatis setiap 30 menit sebagai pengaman tambahan
setInterval(sinkronkanWaktu, 1800000);
