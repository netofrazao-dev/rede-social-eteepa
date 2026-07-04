// Carrega as variáveis do arquivo .env para process.env
import 'dotenv/config';

// Centraliza todas as configurações do app em um único lugar.
// Se a variável não existir no .env, usamos um valor padrão razoável.
export const config = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET || 'segredo-inseguro-apenas-para-desenvolvimento',
  jwtExpires: process.env.JWT_EXPIRES || '7d',
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  maxUploadMB: Number(process.env.MAX_UPLOAD_MB) || 15,

  // Supabase (banco de dados). A service role key é SECRETA (só backend).
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
};
