// Middlewares de autenticação e autorização.
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { users } from '../db/repo.js';

// Verifica o token JWT enviado no cabeçalho "Authorization: Bearer <token>".
// Se for válido, disponibiliza req.user e req.userId para as próximas etapas.
export async function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido. Faça login.' });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await users.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }
    req.userId = user.id;
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

// Garante que o usuário logado tenha um dos papéis permitidos.
// Ex: requireRole('admin', 'teacher', 'leader') -> bloqueia alunos.
// IMPORTANTE: esta é a checagem "de verdade". Esconder o botão no frontend
// não é segurança; a regra precisa existir aqui no servidor.
export function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: 'Acesso negado: você não tem permissão para publicar.' });
    }
    next();
  };
}
