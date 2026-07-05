// Popula o Supabase com os 4 usuários de teste e 3 posts de exemplo.
// Rode com:  npm run seed
// (Requer o esquema já criado — veja supabase/schema.sql)
import bcrypt from 'bcryptjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { supabase } from './supabase.js';

const SENHA_PADRAO = '123456';

// IDs fixos para os posts poderem referenciar os autores
const ID = {
  admin: '11111111-1111-1111-1111-111111111111',
  teacher: '22222222-2222-2222-2222-222222222222',
  leader: '33333333-3333-3333-3333-333333333333',
  student: '44444444-4444-4444-4444-444444444444',
};
const POST_ID = {
  p1: 'a1111111-1111-1111-1111-111111111111',
  p2: 'a2222222-2222-2222-2222-222222222222',
  p3: 'a3333333-3333-3333-3333-333333333333',
};

const IMPOSSIVEL = '00000000-0000-0000-0000-000000000000';

export async function seedDatabase() {
  const hash = await bcrypt.hash(SENHA_PADRAO, 10);

  // 1) Limpa tudo (ordem respeita as chaves estrangeiras)
  await supabase.from('comments').delete().neq('id', IMPOSSIVEL);
  await supabase.from('likes').delete().neq('user_id', IMPOSSIVEL);
  await supabase.from('posts').delete().neq('id', IMPOSSIVEL);
  await supabase.from('users').delete().neq('id', IMPOSSIVEL);

  // 2) Usuários
  const users = [
    { id: ID.admin,   email: 'admin@eetepa.edu.br',   password_hash: hash, name: 'Glauber Souza',      role: 'admin',   role_label: 'Diretor Geral',        avatar: '' },
    { id: ID.teacher, email: 'teacher@eetepa.edu.br', password_hash: hash, name: 'Prof. Marcos Silva', role: 'teacher', role_label: 'Prof. de Informática', avatar: '' },
    { id: ID.leader,  email: 'leader@eetepa.edu.br',  password_hash: hash, name: 'Amanda Costa',       role: 'leader',  role_label: 'Líder do 3º Info',     avatar: '' },
    { id: ID.student, email: 'student@eetepa.edu.br', password_hash: hash, name: 'Thiago Rocha',       role: 'student', role_label: 'Aluno de Informática', avatar: '' },
  ];
  const { error: errUsers } = await supabase.from('users').insert(users);
  if (errUsers) throw errUsers;

  // 3) Posts (com datas espalhadas para os textos "Hoje/Ontem/2 dias atrás")
  const agora = Date.now();
  const horasAtras = (h) => new Date(agora - h * 3600000).toISOString();
  const posts = [
    { id: POST_ID.p1, author_id: ID.admin,   category: 'Aviso', created_at: horasAtras(2),
      content: 'Atenção alunos e professores! Amanhã daremos início ao nosso workshop anual de tecnologia e inovação da EETEPA-BREVES. Contamos com a participação de todos no auditório principal a partir das 08:30.' },
    { id: POST_ID.p2, author_id: ID.teacher, category: 'Notas', created_at: horasAtras(26),
      content: 'Publiquei no repositório oficial da turma as notas e gabaritos da nossa segunda prova prática de React + Vite. Excelente desempenho geral da turma, parabéns pelo esforço!' },
    { id: POST_ID.p3, author_id: ID.leader,  category: 'Ajuda', created_at: horasAtras(50),
      content: 'Galera, lembrando que o prazo para entrega do projeto final integrador está chegando ao fim. Quem tiver dúvidas com a estilização usando Tailwind, me avise no laboratório que posso ajudar!' },
  ];
  const { error: errPosts } = await supabase.from('posts').insert(posts);
  if (errPosts) throw errPosts;

  // 4) Curtidas de exemplo
  const likes = [
    { post_id: POST_ID.p1, user_id: ID.teacher },
    { post_id: POST_ID.p1, user_id: ID.leader },
    { post_id: POST_ID.p2, user_id: ID.leader },
    { post_id: POST_ID.p3, user_id: ID.student },
    { post_id: POST_ID.p3, user_id: ID.admin },
  ];
  const { error: errLikes } = await supabase.from('likes').insert(likes);
  if (errLikes) throw errLikes;

  // 5) Comentários de exemplo
  const comentarios = [
    { post_id: POST_ID.p1, author_id: ID.student, content: 'Que legal! Que horas começa mesmo?' },
    { post_id: POST_ID.p1, author_id: ID.teacher, content: 'Excelente iniciativa, diretor. Estaremos lá!' },
    { post_id: POST_ID.p3, author_id: ID.student, content: 'Amanda, posso te procurar amanhã no laboratório?' },
  ];
  const { error: errComments } = await supabase.from('comments').insert(comentarios);
  if (errComments) throw errComments;
}

// Executado diretamente? (npm run seed)
const executadoDireto =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (executadoDireto) {
  try {
    await seedDatabase();
    console.log('✅ Supabase populado com sucesso!');
    console.log('   Usuários: admin@ / teacher@ / leader@ / student@eetepa.edu.br');
    console.log(`   Senha de todos: ${SENHA_PADRAO}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao popular o Supabase:', err.message);
    console.error('   Você já rodou o supabase/schema.sql no SQL Editor?');
    process.exit(1);
  }
}
