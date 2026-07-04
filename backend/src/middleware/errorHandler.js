// Tratador central de erros. Fica no fim da cadeia do Express e captura
// qualquer erro lançado nas rotas, devolvendo um JSON amigável.
import multer from 'multer';

export function errorHandler(err, req, res, next) {
  // Erros específicos de upload (arquivo grande demais, etc.)
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'Arquivo muito grande. Envie mídias menores.' });
    }
    return res.status(400).json({ error: err.message });
  }

  // Erro do filtro de tipo de arquivo (imagem/vídeo)
  if (err?.message?.includes('imagens ou vídeos')) {
    return res.status(400).json({ error: err.message });
  }

  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
}
