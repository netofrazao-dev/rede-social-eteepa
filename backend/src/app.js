// Monta a aplicação Express (middlewares + rotas). Separado do server.js para
// facilitar testes no futuro.
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  // Permite que o frontend (rodando em outra porta) chame a API
  app.use(cors({ origin: config.corsOrigin }));

  // Interpreta corpo das requisições em JSON e formulários
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve os arquivos enviados (fotos/vídeos) em /uploads/...
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  // Rota raiz só para conferir rapidamente se a API está no ar
  app.get('/', (req, res) =>
    res.json({ name: 'Rede Social EETEPA - API', status: 'online' })
  );

  // Rotas da aplicação
  app.use('/api/auth', authRoutes);
  app.use('/api/posts', postRoutes);

  // 404 para qualquer rota não encontrada
  app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));

  // Tratador de erros (sempre por último)
  app.use(errorHandler);

  return app;
}
