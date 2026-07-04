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

// GET /api/auth/me  -> dados do usuário logado (usa o token)
export async function me(req, res) {
  const postCount = await users.postCount(req.user.id);
  res.json(publicUser(req.user, postCount));
}
