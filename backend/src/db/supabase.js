// Cria o cliente do Supabase usando a SERVICE ROLE KEY (chave secreta de
// servidor). Essa chave ignora as regras de RLS, então SÓ pode ser usada aqui
// no backend — nunca no frontend.
import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

if (!config.supabaseUrl || !config.supabaseServiceKey) {
  console.error('\n❌ Supabase não configurado!');
  console.error('   Preencha SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env');
  console.error('   Passo a passo no README (seção "Configurar o Supabase").\n');
  process.exit(1);
}

export const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
