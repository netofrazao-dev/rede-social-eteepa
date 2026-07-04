// Funções que transformam as linhas do banco (colunas em snake_case) no formato
// exato que o frontend espera (camelCase: roleLabel, mediaUrl, etc.).
import { config } from '../config.js';

// Converte uma data ISO em texto amigável: "Hoje, 10:30", "Ontem, 16:45",
// "2 dias atrás"...
export function formatDate(iso) {
  const data = new Date(iso);
  const agora = new Date();
  const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const ontem = new Date(agora);
  ontem.setDate(agora.getDate() - 1);

  const diffDias = Math.floor((agora - data) / 86400000);

  if (data.toDateString() === agora.toDateString()) return `Hoje, ${hora}`;
  if (data.toDateString() === ontem.toDateString()) return `Ontem, ${hora}`;
  if (diffDias < 7) return `${diffDias} dias atrás`;
  return data.toLocaleDateString('pt-BR');
}

// Monta o link completo da mídia (o banco guarda só "/uploads/arquivo.jpg").
export function mediaUrl(caminhoSalvo) {
  if (!caminhoSalvo) return null;
  if (caminhoSalvo.startsWith('http')) return caminhoSalvo;
  return `${config.baseUrl}${caminhoSalvo}`;
}

// Usuário "público": nunca devolve o hash da senha. postCount vem de fora.
export function publicUser(user, postCount = 0) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    roleLabel: user.role_label,
    avatar: user.avatar || '',
    postCount,
  };
}

// Formata um post (linha já vem com o autor no join e o array de curtidas).
export function presentPost(row, currentUserId) {
  const autor = row.author || {};
  const curtidas = row.likes || [];
  return {
    id: row.id,
    name: autor.name ?? 'Usuário removido',
    roleLabel: autor.role_label ?? '',
    role: autor.role ?? 'student',
    date: formatDate(row.created_at),
    createdAt: row.created_at,
    content: row.content,
    category: row.category,
    mediaUrl: mediaUrl(row.media_url),
    mediaType: row.media_type ?? null,
    likes: curtidas.length,
    liked: currentUserId ? curtidas.some((l) => l.user_id === currentUserId) : false,
    commentCount: (row.comments || []).length,
  };
}

// Formata um comentário (linha já vem com o autor no join).
export function presentComment(row) {
  const autor = row.author || {};
  return {
    id: row.id,
    name: autor.name ?? 'Usuário removido',
    role: autor.role ?? 'student',
    roleLabel: autor.role_label ?? '',
    content: row.content,
    date: formatDate(row.created_at),
    createdAt: row.created_at,
  };
}
