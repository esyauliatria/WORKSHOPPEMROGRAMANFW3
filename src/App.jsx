
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [kategori, setKategori] = useState([]);
  const [sumber, setSumber] = useState('');
  const [pesan, setPesan] = useState('Sedang mengambil data...');
  const [loading, setLoading] = useState(true);

  const ambilKategori = async () => {
    setLoading(true);
    setPesan('Sedang mengambil data...');
    setSumber('');

    try {
      // Mengambil data dari server utama
      const response = await axios.get(
        'http://localhost:4000/api/kategori/',
        { timeout: 3000 }
      );

      setKategori(response.data.data || []);
      setPesan('Data berhasil diambil.');
      setSumber('Server Utama (Port 4000)');
    } catch (error) {
      console.log('Server utama gagal. Mencoba server cadangan...');

      try {
        // Jika server utama gagal, gunakan server cadangan
        const response = await axios.get(
          'http://localhost:3100/apiserverb/kategori/',
          { timeout: 3000 }
        );

        setKategori(response.data.data || []);
        setPesan('Data berhasil diambil melalui server cadangan.');
        setSumber('Server Cadangan (Port 3100)');
      } catch (errorCadangan) {
        setKategori([]);
        setPesan('Server utama dan server cadangan gagal diakses.');
        console.error(errorCadangan);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ambilKategori();
  }, []);

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-dark bg-primary shadow">
        <div className="container">
          <span className="navbar-brand fw-bold">
            Sistem Informasi Kategori
          </span>
        </div>
      </nav>

      <main className="container py-5">
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
              <div>
                <h3 className="fw-bold mb-1">Data Kategori</h3>
                <p className="text-secondary mb-0">
                  Pengujian mekanisme fallback server
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={ambilKategori}
                disabled={loading}
              >
                {loading ? 'Memuat...' : 'Muat Ulang Data'}
              </button>
            </div>

            <div className={`alert ${sumber.includes('Cadangan') ? 'alert-warning' : sumber ? 'alert-success' : 'alert-info'}`}>
              <strong>Sumber data:</strong> {sumber || '-'}
              <br />
              {pesan}
            </div>

            {loading ? (
              <p className="text-center py-4">Mengambil data kategori...</p>
            ) : kategori.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered table-striped align-middle">
                  <thead className="table-primary">
                    <tr>
                      <th style={{ width: '30%' }}>ID Kategori</th>
                      <th>Nama Kategori</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kategori.map((item, index) => (
                      <tr key={item.id_kategori ?? item.id ?? index}>
                        <td>{item.id_kategori ?? item.id ?? '-'}</td>
                        <td>{item.nama_kategori ?? item.nama ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-danger py-4">
                Data kategori belum dapat ditampilkan.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
