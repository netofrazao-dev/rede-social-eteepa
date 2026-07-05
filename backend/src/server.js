// Ponto de entrada: confere a conexão com o Supabase e sobe o servidor.
import { createApp } from './app.js';
import { config } from './config.js';
import { supabase } from './db/supabase.js';

// Checagem rápida: consegue falar com o banco e as tabelas existem?
async function checarBanco() {
  const { error } = await supabase.from('users').select('id', { head: true, count: 'exact' });
  if (error) {
    console.warn('\n⚠️  Não consegui ler a tabela "users" no Supabase.');
    console.warn('   Rode o supabase/schema.sql no SQL Editor e depois "npm run seed".');
    console.warn('   Detalhe:', error.message, '\n');
  } else {
    console.log('🟢 Conectado ao Supabase com sucesso.');
  }
}

await checarBanco();

const app = createApp();

// Escuta em 0.0.0.0 para que provedores de hospedagem (Render, Railway, etc.)
// consigam rotear as requisições até o app. Sem isso, o serviço sobe mas fica
// inacessível de fora ("no-server").
app.listen(config.port, '0.0.0.0', () => {
  console.log(`🚀 API da Rede Social EETEPA rodando na porta ${config.port}`);
  console.log('   Contas de teste (senha 123456):');
  console.log('   admin@ / teacher@ / leader@ / student@eetepa.edu.br');
});
