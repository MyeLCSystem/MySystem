// --- KAWALAN JADUAL TUNTUTAN PINTAR (DINAMIK) ---
const senaraiTuntutanPekerja = [
    "Baki Gaji", "Baki Gaji Minimum", "Bayaran Balik Potongan Gaji", "Elaun", 
    "Elaun / Faedah Bersalin", "Faedah-Faedah Penamatan dan Pembentian Kerja", 
    "Gaji Cuti Hari Kelepasan", "Gaji Cuti Hospitalitasi", "Gaji Cuti Paterniti", 
    "Gaji Cuti Sakit", "Gaji Cuti Tahunan", "Gaji Ganti Cuti Tahunan", 
    "Gaji Ganti Notis", "Gaji Kerja Cuti Kelepasan", "Gaji Kerja Hari Rehat", 
    "Gaji Kerja Lebih Masa Pada Hari Cuti Kelepasan", "Gaji Kerja Lebih Masa Pada Hari Biasa", 
    "Gaji Kerja Lebih Masa Pada Hari Cuti Rehat", "Lain-lain"
];

const senaraiTuntutanMajikan = [
    "Gaji Ganti Notis", "Lain-lain"
];

let memoriTuntutan = []; 

// FUNGSI MAGIK BAHARU: Format Kotak Duit (RM)
function formatDuit(input) {
    let val = input.value.replace(/,/g, ''); // buang koma lama jika ada
    if (val !== "" && !isNaN(val)) {
        input.value = Number(val).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}

// FUNGSI MAGIK BAHARU: Buang Format bila nak menaip
function unformatDuit(input) {
    input.value = input.value.replace(/,/g, ''); // kembalikan ke nombor biasa
}

function bukaModalTuntutan(indexEdit = -1) {
    document.getElementById('modalTuntutan').style.display = 'flex';
    
    // Semak siapa pengadu untuk senarai dropdown yang betul
    const isMajikan = document.getElementById('majikan').checked;
    const dropdown = document.getElementById('jenisTuntutan');
    
    dropdown.innerHTML = '<option value="">-Sila Pilih-</option>';
    const senaraiPilihan = isMajikan ? senaraiTuntutanMajikan : senaraiTuntutanPekerja;
    
    senaraiPilihan.forEach(item => {
        dropdown.innerHTML += `<option value="${item}">${item}</option>`;
    });
    
    if(indexEdit > -1) {
        document.getElementById('tajukModal').innerHTML = "Kemaskini Tuntutan";
        document.getElementById('jenisTuntutan').value = memoriTuntutan[indexEdit].jenis;
        document.getElementById('keteranganTuntutan').value = memoriTuntutan[indexEdit].keterangan;
        
        // Formatkan jumlah untuk paparan Edit yang cantik
        const jumlahEdit = memoriTuntutan[indexEdit].jumlah;
        document.getElementById('jumlahTuntutan').value = Number(jumlahEdit).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        
        document.getElementById('indexTuntutanEdit').value = indexEdit;
    } else {
        document.getElementById('tajukModal').innerHTML = "Tambah Tuntutan";
        document.getElementById('jenisTuntutan').value = "";
        document.getElementById('keteranganTuntutan').value = "";
        document.getElementById('jumlahTuntutan').value = "";
        document.getElementById('indexTuntutanEdit').value = "-1";
    }
}

function tutupModalTuntutan() {
    document.getElementById('modalTuntutan').style.display = 'none';
}

function simpanTuntutan() {
    const jenis = document.getElementById('jenisTuntutan').value;
    const keterangan = document.getElementById('keteranganTuntutan').value;
    // Buang koma sebelum simpan supaya matematik sistem tak rosak
    let jumlah = document.getElementById('jumlahTuntutan').value.replace(/,/g, ''); 
    const index = parseInt(document.getElementById('indexTuntutanEdit').value);

    if (jenis === "" || keterangan.trim() === "" || jumlah.trim() === "" || isNaN(jumlah)) {
        alert("Sila lengkapkan Jenis, Keterangan, dan pastikan Jumlah Tuntutan adalah nombor.");
        return;
    }

    if (index > -1) {
        memoriTuntutan[index] = { jenis: jenis, keterangan: keterangan, jumlah: jumlah };
    } else {
        memoriTuntutan.push({ jenis: jenis, keterangan: keterangan, jumlah: jumlah });
    }

    tutupModalTuntutan();
    renderJadualTuntutan();
}

function hapusTuntutan(index) {
    if (confirm("Adakah anda pasti mahu memadam tuntutan ini?")) {
        memoriTuntutan.splice(index, 1); 
        renderJadualTuntutan();
    }
}

function renderJadualTuntutan() {
    const tbody = document.querySelector("#jadualTuntutan tbody");
    tbody.innerHTML = ""; 

    if (memoriTuntutan.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-row">Tiada maklumat tuntutan direkodkan.</td></tr>`;
        return;
    }

    memoriTuntutan.forEach((item, index) => {
        const jumlahCantik = Number(item.jumlah).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${item.jenis}</strong></td>
            <td>${item.keterangan}</td>
            <td>RM ${jumlahCantik}</td>
            <td><button class="btn-edit-tbl" onclick="bukaModalTuntutan(${index})">✏️ Edit</button></td>
            <td><button class="btn-delete-tbl" onclick="hapusTuntutan(${index})">🗑️ Hapus</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// --- FUNGSI MAGIK TERTINGGI: TELEPORTASI KAD PENGADU & DEFENDAN ---
function tukarPeranan() {
    const suis = document.getElementById('majikan');
    const kad1 = document.getElementById('kad1');
    const kad2 = document.getElementById('kad2');
    const tajuk1 = document.getElementById('tajukKad1');
    const tajuk2 = document.getElementById('tajukKad2');
    
    const blokSuisDanWakil = document.getElementById('blokSuisDanWakil');
    const tempatKiri = document.getElementById('tempatSuis1');
    const tempatKanan = document.getElementById('tempatSuis2');

    const ruanganAduan = document.getElementById('ruanganAduan');
    const ruanganJantina = document.getElementById('ruanganJantina');
    const ruanganAlamatKerja = document.getElementById('ruanganAlamatKerjaLengkap');
    const ruanganWakil = document.getElementById('ruanganWakilMajikan');

    if (suis.checked) {
        kad1.style.order = "2"; 
        kad2.style.order = "1"; 
        tajuk1.innerHTML = "Maklumat Defendan (Pekerja)";
        tajuk2.innerHTML = "Maklumat Pengadu (Majikan)";
        tempatKanan.appendChild(blokSuisDanWakil);
        
        ruanganAduan.style.display = "none";
        ruanganJantina.style.display = "none";
        ruanganAlamatKerja.style.display = "none";
        ruanganWakil.style.display = "block"; 
    } else {
        kad1.style.order = "1"; 
        kad2.style.order = "2"; 
        tajuk1.innerHTML = "Maklumat Pengadu";
        tajuk2.innerHTML = "Maklumat Defendan";
        tempatKiri.appendChild(blokSuisDanWakil);
        
        ruanganAduan.style.display = "grid"; 
        ruanganJantina.style.display = "grid";
        ruanganAlamatKerja.style.display = "block";
        ruanganWakil.style.display = "none"; 
    }
}

// --- FUNGSI-FUNGSI KAWALAN ASAL (DIPELIHARA SEPENUHNYA) ---
function kawalJenisDaftarPengadu() {
    const jenis = document.getElementById('jenisDaftarPengadu').value;
    const inputNo = document.getElementById('noPendPengadu');
    const remark = document.getElementById('remarkNoPendPengadu');
    const warganegara = document.getElementById('warganegaraPengadu');
    const ruanganLain = document.getElementById('ruanganWarganegaraLain');

    if(ruanganLain) { ruanganLain.style.display = 'none'; }

    if (jenis === 'MyKad') {
        inputNo.placeholder = "Contoh: 880101-01-1234";
        inputNo.maxLength = 14;
        remark.innerText = "Masukkan No. Kad Pengenalan";
        warganegara.innerHTML = '<option value="Malaysia" selected>Malaysia</option>';
    } else if (jenis === 'Pasport') {
        inputNo.placeholder = "Masukkan No. Pasport";
        inputNo.maxLength = 20;
        remark.innerText = "Masukkan No. Pasport";
        warganegara.innerHTML = `
            <option value="">-Sila Pilih-</option>
            <option value="Indonesia">Indonesia</option>
            <option value="Bangladesh">Bangladesh</option>
            <option value="Nepal">Nepal</option>
            <option value="India">India</option>
            <option value="Myanmar">Myanmar</option>
            <option value="Filipina">Filipina</option>
            <option value="Pakistan">Pakistan</option>
            <option value="Lain-lain">Lain-lain</option>
        `;
    } else {
        inputNo.placeholder = "Sila pilih jenis pendaftaran";
        remark.innerText = "";
        warganegara.innerHTML = '<option value="Malaysia" selected>Malaysia</option>';
    }
}

function kawalWarganegara() {
    const warganegara = document.getElementById('warganegaraPengadu').value;
    const ruanganLain = document.getElementById('ruanganWarganegaraLain');
    if (warganegara === 'Lain-lain') {
        ruanganLain.style.display = 'block';
    } else {
        ruanganLain.style.display = 'none';
        document.getElementById('warganegaraLain').value = ''; 
    }
}

function kawalJenisDaftarDefendan() {
    const jenis = document.getElementById('jenisDaftarDefendan').value;
    const inputNo = document.getElementById('noPendDefendan');
    const remark = document.getElementById('remarkNoPendDefendan');
    const labelNama = document.getElementById('labelNamaDefendan'); 

    if (jenis === 'MyKad') {
        inputNo.placeholder = "Contoh: 880101-01-1234";
        inputNo.maxLength = 14;
        remark.innerText = "Masukkan No. Kad Pengenalan";
        labelNama.innerHTML = 'Nama <span>*</span>'; 
    } else if (jenis === 'SSM' || jenis === 'Lain-lain') {
        inputNo.placeholder = "Masukkan No. Pendaftaran";
        inputNo.maxLength = 20;
        remark.innerText = "Masukkan No. Pendaftaran";
        labelNama.innerHTML = 'Nama Syarikat/Organisasi <span>*</span>'; 
    } else {
        inputNo.placeholder = "Sila pilih jenis pendaftaran";
        remark.innerText = "";
        labelNama.innerHTML = 'Nama <span>*</span>'; 
    }
}

function formatMyKad(inputElement, dropdownId) {
    const jenis = document.getElementById(dropdownId).value;
    if (jenis === 'MyKad') {
        let val = inputElement.value.replace(/[^0-9]/g, ''); 
        let formatted = val;
        if (val.length > 6) { formatted = val.substring(0, 6) + '-' + val.substring(6); }
        if (val.length > 8) { formatted = formatted.substring(0, 9) + '-' + formatted.substring(9, 13); }
        inputElement.value = formatted;

        if (val.length === 12 && dropdownId === 'jenisDaftarPengadu') {
            let lastDigit = parseInt(val.substring(11, 12));
            if (lastDigit % 2 !== 0) {
                document.getElementById('jantinaLelaki').checked = true;
            } else {
                document.getElementById('jantinaPerempuan').checked = true;
            }
        }
    }
}

function kawalSektor() {
    const sektor = document.getElementById('sektorDefendan').value;
    const ruanganLain = document.getElementById('ruanganSektorLain');
    if (sektor === 'Lain-lain') {
        ruanganLain.style.display = 'block';
    } else {
        ruanganLain.style.display = 'none';
        document.getElementById('sektorLain').value = '';
    }
}

// FUNGSI MAGIK: Poskod Kalis Ralat menggunakan API
async function cariPoskodAutomatik(idPoskod, idNegeri, idBandar) {
    const poskod = document.getElementById(idPoskod).value;
    const negeriDropdown = document.getElementById(idNegeri);
    const bandarField = document.getElementById(idBandar);

    const senaraiNegeri = `
        <option value="">-Sila Pilih Secara Manual-</option>
        <option value="Johor">Johor</option>
        <option value="Kedah">Kedah</option>
        <option value="Kelantan">Kelantan</option>
        <option value="Melaka">Melaka</option>
        <option value="Negeri Sembilan">Negeri Sembilan</option>
        <option value="Pahang">Pahang</option>
        <option value="Perak">Perak</option>
        <option value="Perlis">Perlis</option>
        <option value="Pulau Pinang">Pulau Pinang</option>
        <option value="Sabah">Sabah</option>
        <option value="Sarawak">Sarawak</option>
        <option value="Selangor">Selangor</option>
        <option value="Terengganu">Terengganu</option>
        <option value="W.P Kuala Lumpur">W.P Kuala Lumpur</option>
        <option value="W.P Labuan">W.P Labuan</option>
        <option value="W.P Putrajaya">W.P Putrajaya</option>
    `;

    if (poskod.length === 5) {
        try {
            negeriDropdown.innerHTML = `<option value="">Mencari...</option>`;
            if(bandarField.tagName === 'SELECT') { bandarField.innerHTML = `<option value="">Mencari...</option>`; }
            else { bandarField.value = "Mencari..."; }

            const response = await fetch(`https://api.zippopotam.us/MY/${poskod}`);
            
            if (response.ok) {
                const data = await response.json();
                let negeri = data.places[0].state;
                const bandar = data.places[0]['place name'];

                if(negeri === "Federal Territory of Kuala Lumpur") negeri = "W.P Kuala Lumpur";
                if(negeri === "Federal Territory of Putrajaya") negeri = "W.P Putrajaya";
                if(negeri === "Federal Territory of Labuan") negeri = "W.P Labuan";

                negeriDropdown.innerHTML = `<option value="${negeri}" selected>${negeri}</option>`;
                
                if(bandarField.tagName === 'SELECT') {
                    bandarField.innerHTML = `<option value="${bandar}" selected>${bandar}</option>`;
                } else {
                    bandarField.value = bandar;
                }
            } else {
                alert("⚠️ Poskod tidak ditemui dalam sistem (Mungkin poskod baharu).\n\nSila pastikan poskod dimasukkan dengan betul. Jika ia betul, sila pilih Negeri dan taip nama Bandar anda secara manual.");
                negeriDropdown.innerHTML = senaraiNegeri;
                if(bandarField.tagName === 'SELECT') {
                    const inputManual = document.createElement('input');
                    inputManual.type = 'text';
                    inputManual.id = idBandar;
                    inputManual.placeholder = "Sila taip nama bandar";
                    bandarField.parentNode.replaceChild(inputManual, bandarField);
                } else {
                    bandarField.value = "";
                    bandarField.placeholder = "Sila taip nama bandar";
                }
            }
        } catch (error) {
            alert("Gangguan capaian internet. Sila pilih secara manual.");
            negeriDropdown.innerHTML = senaraiNegeri;
        }
    } 
    else if (poskod.length < 5) {
        negeriDropdown.innerHTML = `<option value="">-Sila Pilih-</option>`;
        if(bandarField.tagName === 'SELECT') { bandarField.innerHTML = `<option value="">-Sila Pilih-</option>`; }
        else { bandarField.value = ""; }
    }
}

function toggleAduan() {
    const aduanBerkumpulan = document.getElementById('aduanBerkumpulan').checked;
    const ruanganBilangan = document.getElementById('ruanganBilanganPengadu');
    const labelNama = document.getElementById('labelNamaPengadu');

    if (aduanBerkumpulan) {
        ruanganBilangan.style.display = 'grid'; 
        labelNama.innerHTML = 'Ketua Pengadu <span>*</span>';
    } else {
        ruanganBilangan.style.display = 'none';
        labelNama.innerHTML = 'Nama <span>*</span>';
    }
}

function salinAlamatDefendan() {
    const disalin = document.getElementById('salinAlamat').checked;
    const ruanganKerja = document.getElementById('ruanganAlamatKerja');
    const labelSalin = document.getElementById('labelSalinAlamat');
    
    if (disalin) {
        ruanganKerja.style.display = 'none';
        labelSalin.innerHTML = 'Alamat tempat pekerjaan seperti alamat defendan';
        document.getElementById('alamatKerja1').value = document.getElementById('alamatDefendan1').value;
        document.getElementById('alamatKerja2').value = document.getElementById('alamatDefendan2').value;
        document.getElementById('alamatKerja3').value = document.getElementById('alamatDefendan3').value;
        document.getElementById('poskodKerja').value = document.getElementById('poskodDefendan').value;
        document.getElementById('negeriKerja').value = document.getElementById('negeriDefendan').value;
        document.getElementById('bandarKerja').value = document.getElementById('bandarDefendan').value;
    } else {
        ruanganKerja.style.display = 'block';
        labelSalin.innerHTML = 'Salin alamat defendan';
        document.getElementById('alamatKerja1').value = '';
        document.getElementById('alamatKerja2').value = '';
        document.getElementById('alamatKerja3').value = '';
        document.getElementById('poskodKerja').value = '';
        document.getElementById('negeriKerja').value = '';
        document.getElementById('bandarKerja').value = '';
    }
}

function sediaUntukCetak() {
    const aduanBerkumpulan = document.getElementById('aduanBerkumpulan')?.checked;
    const labelNamaTeks = aduanBerkumpulan ? 'Ketua Pengadu' : 'Nama Pengadu';
    const bilanganPengadu = document.getElementById('bilanganPengadu')?.value || '-';
    
    const namaPengadu = document.getElementById('namaPengadu')?.value || '-';
    const noPendPengadu = document.getElementById('noPendPengadu')?.value || '-';
    const jawatanPengadu = document.getElementById('jawatanPengadu')?.value || '-';
    const telPengadu = document.getElementById('telPengadu')?.value || '-';
    
    const namaDefendan = document.getElementById('namaDefendan')?.value || '-';
    const noPendDefendan = document.getElementById('noPendDefendan')?.value || '-';
    const sektorDefendan = document.getElementById('sektorDefendan')?.value || '-';

    let htmlBilangan = "";
    if (aduanBerkumpulan) {
        htmlBilangan = `<tr><td class="label-td">Bilangan Pengadu</td><td>: ${bilanganPengadu} Orang</td></tr>`;
    }

    const htmlDokumenRasmi = `
        <div class="formal-title">BORANG PENDAFTARAN KES BURUH</div>
        <div class="formal-section">A. MAKLUMAT PENGADU</div>
        <table class="formal-table">
            <tr><td class="label-td">Jenis Aduan</td><td>: ${aduanBerkumpulan ? 'Berkumpulan' : 'Individu'}</td></tr>
            ${htmlBilangan}
            <tr><td class="label-td">${labelNamaTeks}</td><td>: ${namaPengadu}</td></tr>
            <tr><td class="label-td">No. Pendaftaran</td><td>: ${noPendPengadu}</td></tr>
            <tr><td class="label-td">Jawatan</td><td>: ${jawatanPengadu}</td></tr>
            <tr><td class="label-td">No. Telefon</td><td>: ${telPengadu}</td></tr>
        </table>

        <div class="formal-section">B. MAKLUMAT DEFENDAN (MAJIKAN)</div>
        <table class="formal-table">
            <tr><td class="label-td">Nama Syarikat</td><td>: ${namaDefendan}</td></tr>
            <tr><td class="label-td">No. Pendaftaran</td><td>: ${noPendDefendan}</td></tr>
            <tr><td class="label-td">Sektor</td><td>: ${sektorDefendan}</td></tr>
        </table>
        <br>
        <p style="font-style: italic; font-size: 10pt;">
            *Dokumen ini dijana secara automatik oleh sistem e-Labour Court pada ${new Date().toLocaleDateString('ms-MY')}.
        </p>
    `;
    document.getElementById('printArea').innerHTML = htmlDokumenRasmi;
    window.print();
}
