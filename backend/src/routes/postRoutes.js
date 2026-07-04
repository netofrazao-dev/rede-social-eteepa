import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  listPosts,
  myPosts,
  createPost,
  toggleLike,
  deletePost,
  listComments,
  addComment,
} from '../controllers/postController.js';

const router = Router();

// Ver o feed e os próprios posts exige estar logado
router.get('/', asyncHandler(authenticate), asyncHandler(listPosts));
router.get('/mine', asyncHandler(authenticate), asyncHandler(myPosts));

// Criar publicação: logado + papel autorizado (aluno é bloqueado aqui) + upload
router.post(
  '/',
  asyncHandler(authenticate),
  requireRole('admin', 'teacher', 'leader'),
  upload.single('media'),
  asyncHandler(createPost)
);

// Curtir / descurtir
router.post('/:id/like', asyncHandler(authenticate), asyncHandler(toggleLike));

// Comentários (qualquer usuário logado pode ver e comentar)
router.get('/:id/comments', asyncHandler(authenticate), asyncHandler(listComments));
router.post('/:id/comments', asyncHandler(authenticate), asyncHandler(addComment));

// Excluir
router.delete('/:id', asyncHandler(authenticate), asyncHandler(deletePost));

export default router;
