// Controlador das publicações: listar, criar, curtir, excluir (via Supabase).
import { posts, likes, comments } from '../db/repo.js';
import { presentPost, presentComment } from '../utils/present.js';

const CATEGORIAS = ['Aviso', 'Notas', 'Ajuda', 'Geral'];
const MAX_CHARS = 280;
const MAX_COMMENT_CHARS = 500;

// GET /api/posts  -> feed completo
export async function listPosts(req, res) {
  const todos = await posts.all();
  res.json(todos.map((p) => presentPost(p, req.userId)));
}

// GET /api/posts/mine  -> só os posts do usuário logado (tela de Perfil)
export async function myPosts(req, res) {
  const meus = await posts.byAuthor(req.userId);
  res.json(meus.map((p) => presentPost(p, req.userId)));
}

// POST /api/posts  -> cria publicação (multipart: content, category, media)
export async function createPost(req, res) {
  const content = String(req.body.content || '').trim();
  const category = CATEGORIAS.includes(req.body.category) ? req.body.category : 'Geral';
  const temMidia = Boolean(req.file);

  if (!content && !temMidia) {
    return res.status(400).json({ error: 'A publicação não pode estar vazia.' });
  }
  if (content.length > MAX_CHARS) {
    return res.status(400).json({ error: `Limite de ${MAX_CHARS} caracteres excedido.` });
  }

  let mediaUrl = null;
  let mediaType = null;
  if (temMidia) {
    mediaUrl = `/uploads/${req.file.filename}`;
    mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
  }

  const post = await posts.create({
    authorId: req.userId,
    content,
    category,
    mediaUrl,
    mediaType,
  });

  res.status(201).json(presentPost(post, req.userId));
}

// POST /api/posts/:id/like  -> alterna curtida do usuário logado
export async function toggleLike(req, res) {
  const post = await posts.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Publicação não encontrada.' });
  }

  const jaCurtiu = await likes.exists(post.id, req.userId);
  if (jaCurtiu) {
    await likes.remove(post.id, req.userId); // descurte
  } else {
    await likes.add(post.id, req.userId); // curte
  }

  // Recarrega o post já com a contagem atualizada
  const atualizado = await posts.findById(post.id);
  res.json(presentPost(atualizado, req.userId));
}

// GET /api/posts/:id/comments  -> lista os comentários de um post
export async function listComments(req, res) {
  const post = await posts.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Publicação não encontrada.' });
  }
  const lista = await comments.listByPost(post.id);
  res.json(lista.map(presentComment));
}

// POST /api/posts/:id/comments  -> adiciona um comentário (qualquer logado)
export async function addComment(req, res) {
  const content = String(req.body.content || '').trim();
  if (!content) {
    return res.status(400).json({ error: 'O comentário não pode estar vazio.' });
  }
  if (content.length > MAX_COMMENT_CHARS) {
    return res.status(400).json({ error: `Limite de ${MAX_COMMENT_CHARS} caracteres.` });
  }
  const post = await posts.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Publicação não encontrada.' });
  }
  const novo = await comments.create({ postId: post.id, authorId: req.userId, content });
  res.status(201).json(presentComment(novo));
}

// DELETE /api/posts/:id  -> exclui (só o autor ou um admin)
export async function deletePost(req, res) {
  const post = await posts.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Publicação não encontrada.' });
  }
  if (post.author_id !== req.userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Você só pode excluir suas próprias publicações.' });
  }
  await posts.remove(post.id);
  res.status(204).end();
}
