import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Avatar from '../components/Avatar';
import Card, { CardHeader, CardBody, CardFooter } from '../components/Card';
import Badge from '../components/Badge';
import Skeleton from '../components/Skeleton';
import Button from '../components/Button';
import Comments from '../components/Comments';
import useAuth from '../hooks/useAuth';
import useApp from '../hooks/useApp';
import { Heart, MessageSquare, Share2, Search, RefreshCw, Inbox, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [emptyState, setEmptyState] = useState(false);
  const [openComments, setOpenComments] = useState(null); // id do post com comentários abertos

  const { user } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  // Busca o feed na API quando a tela abre
  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/posts');
      setPosts(data);
      setEmptyState(false);
    } catch {
      addToast('Não foi possível carregar o feed.', 'error');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      // O backend devolve o post já atualizado (likes e liked corretos)
      const { data } = await api.post(`/posts/${id}/like`);
      setPosts((prevPosts) => prevPosts.map((post) => (post.id === id ? data : post)));
    } catch {
      addToast('Não foi possível curtir agora.', 'error');
    }
  };

  const toggleComments = (id) => {
    setOpenComments((atual) => (atual === id ? null : id));
  };

  // Atualiza o contador de comentários de um post (quando um novo é enviado)
  const bumpCommentCount = (id, delta) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, commentCount: (p.commentCount || 0) + delta } : p))
    );
  };

  const toggleEmptyState = () => {
    if (emptyState) {
      loadFeed();
    } else {
      setPosts([]);
      setEmptyState(true);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-bg-sec">
      {/* Top Navbar */}
      <Navbar
        title="Rede Social EETEPA-BREVES"
        rightElement={
          <button
            onClick={loadFeed}
            disabled={loading}
            className="p-2 rounded-xl text-text-muted hover:text-primary hover:bg-slate-100 active:rotate-180 transition-all duration-300 disabled:opacity-50"
            aria-label="Atualizar Feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        }
      />

      {/* Floating Action Button (FAB) for posting for teachers/admins/leaders */}
      {user?.role !== 'student' && (
        <button
          onClick={() => navigate('/create')}
          className="fixed bottom-20 right-6 z-40 bg-primary text-white p-4 rounded-full shadow-lg shadow-primary/20 hover:bg-primary-hover active:scale-95 transition-all select-none"
          style={{ right: 'calc(50% - 190px)', display: 'block' }} // align inside max-w-md frame on desktop
          aria-label="Criar Publicação"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      )}

      {/* Main Container */}
      <div className="p-4 flex-1 flex flex-col gap-4 safe-scroll-area">
        
        {/* Search Bar & Demo controllers */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 w-4 h-4 text-text-muted top-3.5" />
            <input
              type="text"
              placeholder="Buscar publicações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-9 pr-4 rounded-xl bg-white border border-slate-200/80 text-xs focus:outline-none focus:border-primary/60 transition-all"
            />
          </div>
          
          {/* Toggle empty state button for review */}
          <button
            onClick={toggleEmptyState}
            className="px-3 h-11 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-3xs font-extrabold uppercase tracking-wide text-text-muted select-none active:scale-95 transition-transform"
          >
            {emptyState ? 'Ver Posts' : 'Zerar Feed'}
          </button>
        </div>

        {/* Loading Skeleton Mode */}
        {loading ? (
          <Skeleton type="post" count={2} />
        ) : emptyState || filteredPosts.length === 0 ? (
          
          /* Elegant Empty State */
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4 animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-text-muted/60">
              <Inbox className="w-10 h-10 stroke-[1.2]" />
            </div>
            <h3 className="text-sm font-bold text-text-main">Nenhuma publicação por aqui</h3>
            <p className="text-xs text-text-muted max-w-xs mt-1 leading-relaxed">
              {searchTerm
                ? 'Nenhum resultado corresponde à sua pesquisa de filtros.'
                : 'Fique atento! Novas atualizações e comunicados da escola aparecerão neste feed.'}
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 border-slate-200 text-text-main h-10 px-4"
                onClick={() => setSearchTerm('')}
              >
                Limpar Busca
              </Button>
            )}
          </div>
        ) : (
          
          /* Interactive Posts Feed */
          <div className="flex flex-col gap-4 animate-slide-up">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="border-slate-100/60 shadow-xs">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={post.name}
                      size="sm"
                      ringColor={post.role === 'admin' ? 'ring-red-500/20' : post.role === 'teacher' ? 'ring-blue-500/20' : 'ring-emerald-500/20'}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-text-main leading-none">
                          {post.name}
                        </span>
                        <Badge
                          variant={
                            post.role === 'admin'
                              ? 'primary'
                              : post.role === 'teacher'
                              ? 'info'
                              : 'success'
                          }
                        >
                          {post.roleLabel}
                        </Badge>
                      </div>
                      <span className="text-3xs text-text-muted mt-1 inline-block font-medium">
                        {post.date}
                      </span>
                    </div>
                  </div>
                  <span className="text-3xs font-extrabold tracking-wider uppercase text-text-muted bg-bg-sec border border-slate-150 px-2 py-0.5 rounded-md">
                    {post.category}
                  </span>
                </CardHeader>

                <CardBody className="px-4 py-3 text-xs font-normal text-text-main leading-relaxed select-text">
                  {post.content}
                </CardBody>

                {/* Attached Photo/Video Rendering Block */}
                {post.mediaUrl && (
                  <div className="border-t border-b border-slate-100 bg-slate-900/5 flex items-center justify-center overflow-hidden">
                    {post.mediaType === 'video' ? (
                      <video 
                        src={post.mediaUrl} 
                        controls 
                        className="w-full max-h-56 object-cover"
                        preload="metadata"
                      />
                    ) : (
                      <img 
                        src={post.mediaUrl} 
                        alt="Publicação" 
                        className="w-full max-h-56 object-cover transition-transform hover:scale-102 duration-300"
                        loading="lazy"
                      />
                    )}
                  </div>
                )}

                <CardFooter className="px-4 py-2 border-t border-slate-50 flex items-center justify-between">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 select-none active:scale-90
                      ${post.liked ? 'text-primary bg-primary/5' : 'text-text-muted hover:text-text-main hover:bg-slate-50'}
                    `}
                    aria-label="Curtir publicação"
                  >
                    <Heart
                      className={`w-4 h-4 transition-transform duration-200 ${post.liked ? 'fill-primary text-primary scale-110' : 'text-text-muted'}`}
                    />
                    <span className="text-3xs font-bold">{post.likes}</span>
                  </button>

                  <div className="flex gap-1.5 text-text-muted select-none">
                    <button
                      onClick={() => toggleComments(post.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg active:scale-90 transition-all ${
                        openComments === post.id
                          ? 'text-primary bg-primary/5'
                          : 'hover:bg-slate-50 hover:text-text-main'
                      }`}
                      aria-label="Ver comentários"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {post.commentCount > 0 && (
                        <span className="text-3xs font-bold">{post.commentCount}</span>
                      )}
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-50 hover:text-text-main active:scale-90 transition-transform">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardFooter>

                {/* Seção de comentários (abre ao clicar no balão) */}
                {openComments === post.id && (
                  <Comments
                    postId={post.id}
                    onCountChange={(delta) => bumpCommentCount(post.id, delta)}
                  />
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export { Home };
