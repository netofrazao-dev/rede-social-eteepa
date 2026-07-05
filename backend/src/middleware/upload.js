// Configuração do multer para receber upload de fotos e vídeos.
// Os arquivos são salvos na pasta /uploads e servidos como arquivos estáticos.
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { config } from '../config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    // Nome único para evitar que um upload sobrescreva outro
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomUUID()}${ext}`);
  },
});

// Só aceita imagens e vídeos
function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens ou vídeos são permitidos.'));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.maxUploadMB * 1024 * 1024 },
});
