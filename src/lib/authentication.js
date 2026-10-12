export async function login(credentials) {
  if (!credentials.username.trim() || !credentials.password) {
    return { success: false, error: 'Lengkapi semua kolom yang wajib diisi.' };
  }

  return {
    success: false,
    error:
      'Layanan autentikasi belum tersedia karena integrasi dengan backend belum dilakukan.',
  };
}
