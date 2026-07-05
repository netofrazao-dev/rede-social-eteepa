// Controlador de autenticação: login e "quem sou eu".
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { users } from '../db/repo.js';
import { publicUser } from '../utils/present.js';

// POST /api/auth/login  -> { email, password }
export async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Informe e-mail e senha.' });
  }

  const user = await users.findByEmail(email);
  // Mensagem genérica de propósito: não revela se foi o e-mail ou a senha que
  // estava errado (boa prática de segurança).
  if (!user) {
    return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
  }

  const senhaConfere = await bcrypt.compare(password, user.password_hash);
  if (!senhaConfere) {
    return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
  }

  const token = jwt.sign({ sub: user.id }, config.jwtSecret, {
    expiresIn: config.jwtExpires,
  });

  const postCount = await users.postCount(user.id);
  res.json({ token, user: publicUser(user, postCount) });
}

// POST /api/auth/register  -> { name, email, password }
// Cria uma conta nova. Por segurança, todo cadastro entra como "student"
// (aluno) — professores/coordenação são cadastrados por dentro (seed/admin),
// senão qualquer um se registraria como professor e poderia publicar.
export async function register(req, res) {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').toLowerCase().trim();
  const password = String(req.body.password || '');

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Preencha nome, e-mail e senha.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'A senha precisa ter pelo menos 6 caracteres.' });
  }

  const existente = await users.findByEmail(email);
  if (existente) {
    return res.status(409).json({ error: 'Já existe uma conta com esse e-mail.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  let user;
  try {
    user = await users.create({
      name,
      email,
      passwordHash,
      role: 'student',
      roleLabel: 'Aluno(a)',
    });
  } catch (e) {
    // Corrida: duas pessoas com o mesmo e-mail ao mesmo tempo (unique no banco)
    if (e?.code === '23505') {
      return res.status(409).json({ error: 'Já existe uma conta com esse e-mail.' });
    }
    throw e;
  }

  const token = jwt.sign({ sub: user.id }, config.jwtSecret, {
    expiresIn: config.jwtExpires,
  });

  res.status(201).json({ token, user: publicUser(user, 0) });
}

// GET /api/auth/me  -> dados do usuário logado (usa o token)
export async function me(req, res) {
  const postCount = await users.postCount(req.user.id);
  res.json(publicUser(req.user, postCount));
}
