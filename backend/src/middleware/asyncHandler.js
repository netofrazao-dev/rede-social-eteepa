// Envolve um handler assíncrono para que qualquer erro (ou promessa rejeitada)
// seja enviado ao errorHandler, em vez de derrubar o servidor inteiro.
// Uso: router.get('/', asyncHandler(minhaFuncao))
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
