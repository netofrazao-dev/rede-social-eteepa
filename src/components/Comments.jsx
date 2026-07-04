import React, { useState, useEffect } from 'react';
import Avatar from './Avatar';
import { Send } from 'lucide-react';
import api from '../services/api';
import useApp from '../hooks/useApp';

// Seção de comentários que abre embaixo de um post no feed.
// Busca os comentários ao abrir e permite enviar novos.
export default function Comments({ postId, onCountChange }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const { addToast } = useApp();

  useEffect(() => {
    let ativo = true;
    api
      .get(`/posts/${postId}/comments`)
      .then(({ data }) => {
        if (ativo) setComments(data);
      })
      .catch(() => {
        if (ativo) addToast('Não foi possível carregar os comentários.', 'error');
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });
    return () => {
      ativo = false;
    };
  }, [postId]);

  const enviar = async (e) => {
    e.preventDefault();
    const conteudo = text.trim();
    if (!conteudo || sending) return;

    setSending(true);
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, { content: conteudo });
      setComments((prev) => [...prev, data]);
      setText('');
      onCountChange?.(1); // avisa o feed para somar +1 no contador
    } catch (err) {
      addToast(err.response?.data?.error || 'Não foi possível comentar.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border-t border-slate-100 bg-bg-sec/60 px-4 py-3 flex flex-col gap-3 animate-slide-down">
      {loading ? (
        <p className="text-3xs text-text-muted text-center py-2 select-none">Carregando comentários…</p>
      ) : comments.length === 0 ? (
        <p className="text-3xs text-text-muted text-center py-2 select-none">
          Nenhum comentário ainda. Seja o primeiro! 💬
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <Avatar name={c.name} size="xs" />
              <div className="flex-1 bg-white rounded-2xl rounded-tl-sm border border-slate-100 px-3 py-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-3xs text-text-main leading-none">{c.name}</span>
                  <span className="text-4xs text-text-muted leading-none">· {c.date}</span>
                </div>
                <p className="text-3xs text-text-main/90 mt-1 leading-relaxed break-words">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Campo para escrever um novo comentário */}
      <form onSubmit={enviar} className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva um comentário…"
          maxLength={500}
          className="flex-1 h-9 px-3.5 rounded-full bg-white border border-slate-200 text-3xs focus:outline-none focus:border-primary/60 transition-all"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="w-9 h-9 shrink-0 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-40 active:scale-90 transition-transform"
          aria-label="Enviar comentário"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
