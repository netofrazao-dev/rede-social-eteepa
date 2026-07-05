import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import useAuth from '../hooks/useAuth';
import useApp from '../hooks/useApp';
import api from '../services/api';
import { Send, AlertCircle, Image, Video, X } from 'lucide-react';

const MAX_CHARS = 280;
const CATEGORIES = ['Aviso', 'Notas', 'Ajuda', 'Geral'];

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Geral');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  // Media states
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [mediaType, setMediaType] = useState(''); // 'image' | 'video'
  
  const fileInputRef = useRef(null);

  const { user } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) { // 15MB limit
        setValidationError('O arquivo é muito grande. Escolha mídias menores que 15MB.');
        return;
      }

      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
      setValidationError('');
      addToast('Mídia adicionada com sucesso!', 'success');
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview('');
    setMediaType('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    
    // Validation checks
    if (!content.trim() && !mediaFile) {
      setValidationError('A publicação não pode estar vazia.');
      return;
    }
    if (content.length > MAX_CHARS) {
      setValidationError(`Limite de ${MAX_CHARS} caracteres excedido.`);
      return;
    }

    setIsLoading(true);
    setValidationError('');

    try {
      // Monta um FormData para enviar texto + arquivo de mídia de uma vez.
      // O backend recebe o campo "media" via multer.
      const formData = new FormData();
      formData.append('content', content.trim());
      formData.append('category', category);
      if (mediaFile) formData.append('media', mediaFile);

      await api.post('/posts', formData);

      addToast('Publicação compartilhada com sucesso!', 'success');
      navigate('/feed');
    } catch (err) {
      const msg = err.response?.data?.error || 'Ocorreu um erro ao publicar.';
      setValidationError(msg);
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const charCount = content.length;
  const isCloseToLimit = charCount > MAX_CHARS - 30;
  const isOverLimit = charCount > MAX_CHARS;

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Navbar with back button */}
      <Navbar title="Nova Publicação" showBack={true} />

      <form onSubmit={handlePublish} className="p-4 flex-1 flex flex-col gap-5 safe-scroll-area">
        
        {/* User Card info */}
        <div className="flex items-center gap-3">
          <Avatar name={user?.name} size="sm" />
          <div>
            <h4 className="font-bold text-xs text-text-main">{user?.name}</h4>
            <p className="text-4xs font-bold uppercase tracking-wider text-text-muted">
              Publicando como {user?.roleLabel}
            </p>
          </div>
        </div>

        {/* Text Area input */}
        <div className="flex-1 flex flex-col gap-2 min-h-[140px] relative">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder="O que está acontecendo na EETEPA hoje?"
            className={`
              w-full flex-1 min-h-[140px] text-sm text-text-main border-none focus:outline-none resize-none placeholder-slate-400
              ${isOverLimit ? 'text-primary' : ''}
            `}
            aria-label="Conteúdo da publicação"
          />

          {/* Media attachment preview */}
          {mediaPreview && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 mt-2 p-1 animate-scale-in">
              {mediaType === 'video' ? (
                <video src={mediaPreview} controls className="w-full max-h-48 object-cover rounded-xl" />
              ) : (
                <img src={mediaPreview} alt="Preview" className="w-full max-h-48 object-cover rounded-xl" />
              )}
              <button
                type="button"
                onClick={removeMedia}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 active:scale-90 transition-transform"
                aria-label="Remover mídia"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Inline validation errors */}
          {validationError && (
            <div className="flex items-center gap-1.5 text-primary text-2xs font-semibold select-none animate-fade-in absolute bottom-0 left-0 bg-red-50 p-2.5 rounded-xl border border-red-100 w-full">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Media Attach buttons & Categories selector */}
        <div className="flex flex-col gap-4">
          {/* Media selection bar */}
          <div className="flex items-center gap-2">
            <span className="text-3xs font-extrabold uppercase tracking-widest text-text-muted select-none mr-2">
              Anexar
            </span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,video/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={triggerFileSelect}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100 text-3xs font-bold text-text-main active:scale-95 transition-all"
            >
              <Image className="w-3.5 h-3.5 text-primary" />
              <span>Adicionar Foto / Vídeo</span>
            </button>
          </div>

          {/* Categories selector */}
          <div className="flex flex-col gap-2">
            <label className="text-3xs font-extrabold uppercase tracking-widest text-text-muted select-none">
              Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`
                    px-4 py-2 rounded-xl text-3xs font-bold uppercase tracking-wide transition-all select-none active:scale-95 border
                    ${category === cat 
                      ? 'bg-primary text-white border-transparent shadow-md shadow-primary/10' 
                      : 'bg-bg-sec text-text-muted hover:text-text-main border-slate-200/60'}
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Panel with Counter & Submit Button */}
        <div className="border-t border-slate-100 pt-4 mt-auto flex items-center justify-between">
          {/* Character counter */}
          <div className="flex flex-col select-none">
            <span className={`text-2xs font-bold ${isOverLimit ? 'text-primary' : isCloseToLimit ? 'text-amber-500' : 'text-text-muted'}`}>
              {charCount} / {MAX_CHARS}
            </span>
            {isOverLimit && (
              <span className="text-4xs font-bold text-primary uppercase mt-0.5">
                Limite excedido!
              </span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            disabled={isOverLimit || (!content.trim() && !mediaFile)}
            icon={<Send className="w-4 h-4" />}
            className="shadow-lg shadow-primary/20 px-6"
          >
            Publicar
          </Button>
        </div>
      </form>
    </div>
  );
}
export { CreatePost };
