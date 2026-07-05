// Acesso aos dados via Supabase (Postgres). Todas as funções são assíncronas
// porque conversam com o banco pela rede.
import { supabase } from './supabase.js';

// Colunas do post + o autor (join) + as curtidas. Usado em todo lugar que
// precisa devolver um post pronto para o frontend.
// Obs: usamos "!posts_author_id_fkey" para dizer ao Supabase qual chave
// estrangeira usar (existe mais de uma relação entre posts e users, por causa
// da tabela likes) — senão ele acusa ambiguidade.
export const POST_SELECT = '*, author:users!posts_author_id_fkey(*), likes(user_id), comments(id)';

export const users = {
  async findById(id) {
    const { data } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
    return data || null;
  },

  async findByEmail(email) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('email', String(email).toLowerCase().trim())
      .maybeSingle();
    return data || null;
  },

  // Quantos posts esse usuário já fez (para o contador do perfil)
  async postCount(userId) {
    const { count } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('author_id', userId);
    return count || 0;
  },

  // Cria um novo usuário (cadastro). Devolve a linha criada.
  async create({ name, email, passwordHash, role, roleLabel }) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password_hash: passwordHash,
        role,
        role_label: roleLabel,
        avatar: '',
      })
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },
};

export const posts = {
  async all() {
    const { data } = await supabase
      .from('posts')
      .select(POST_SELECT)
      .order('created_at', { ascending: false });
    return data || [];
  },

  async byAuthor(authorId) {
    const { data } = await supabase
      .from('posts')
      .select(POST_SELECT)
      .eq('author_id', authorId)
      .order('created_at', { ascending: false });
    return data || [];
  },

  async findById(id) {
    const { data } = await supabase.from('posts').select(POST_SELECT).eq('id', id).maybeSingle();
    return data || null;
  },

  async create({ authorId, content, category, mediaUrl, mediaType }) {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        author_id: authorId,
        content,
        category,
        media_url: mediaUrl,
        media_type: mediaType,
      })
      .select(POST_SELECT)
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    await supabase.from('posts').delete().eq('id', id);
  },
};

export const comments = {
  async listByPost(postId) {
    const { data } = await supabase
      .from('comments')
      .select('*, author:users(*)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    return data || [];
  },

  async create({ postId, authorId, content }) {
    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, author_id: authorId, content })
      .select('*, author:users(*)')
      .single();
    if (error) throw error;
    return data;
  },
};

export const likes = {
  async exists(postId, userId) {
    const { data } = await supabase
      .from('likes')
      .select('post_id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();
    return Boolean(data);
  },

  async add(postId, userId) {
    await supabase.from('likes').insert({ post_id: postId, user_id: userId });
  },

  async remove(postId, userId) {
    await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', userId);
  },
};
