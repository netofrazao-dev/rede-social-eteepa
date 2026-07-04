import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Avatar from '../components/Avatar';
import Card, { CardHeader, CardBody, CardFooter } from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import useAuth from '../hooks/useAuth';
import useApp from '../hooks/useApp';
import api from '../services/api';
import { LogOut, Settings, Edit3, Heart, MessageSquare, Share2, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);

  // Busca na API só as publicações do usuário logado
  useEffect(() => {
    let ativo = true;
    api
      .get('/posts/mine')
      .then(({ data }) => {
        if (ativo) setUserPosts(data);
      })
      .catch(() => {
        if (ativo) setUserPosts([]);
      });
    return () => {
      ativo = false;
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    addToast('Sessão encerrada com sucesso.', 'info');
    navigate('/login');
  };

  const handleEditClick = () => {
    addToast('Edição de perfil não disponível nesta versão de demonstração.', 'warning');
  };

  return (
    <div className="flex-1 flex flex-col bg-bg-sec">
      {/* Navbar with logout trigger */}
      <Navbar
        title="Meu Perfil"
        rightElement={
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-primary hover:bg-primary/5 active:scale-90 transition-transform"
            aria-label="Sair da Conta"
          >
            <LogOut className="w-5 h-5" />
          </button>
        }
      />

      <div className="p-4 flex-grow flex flex-col gap-5 safe-scroll-area">
        
        {/* Profile Card Header */}
        <Card className="border-slate-100/60 shadow-xs">
          <CardBody className="p-6 flex flex-col items-center text-center gap-4">
            
            {/* Avatar XL size */}
            <Avatar name={user?.name} size="xl" ringColor="ring-primary/20" />

            <div>
              <h2 className="text-base font-extrabold text-text-main leading-tight">{user?.name}</h2>
              <div className="flex items-center justify-center gap-1.5 mt-1.5">
                <Badge variant={user?.role === 'admin' ? 'primary' : user?.role === 'teacher' ? 'info' : 'success'}>
                  {user?.roleLabel}
                </Badge>
              </div>
              <p className="text-3xs text-text-muted mt-2 font-medium">{user?.email}</p>
            </div>

            {/* Simple stats tracker */}
            <div className="w-full grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-3.5 mt-2">
              <div className="flex flex-col items-center">
                <span className="text-sm font-black text-text-main">{userPosts.length}</span>
                <span className="text-4xs font-bold uppercase tracking-wider text-text-muted mt-0.5">Posts</span>
              </div>
              <div className="flex flex-col items-center border-l border-slate-100">
                <span className="text-sm font-black text-text-main">
                  {userPosts.reduce((acc, p) => acc + p.likes, 0)}
                </span>
                <span className="text-4xs font-bold uppercase tracking-wider text-text-muted mt-0.5">Curtidas</span>
              </div>
            </div>

            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={handleEditClick}
              icon={<Settings className="w-4 h-4" />}
              className="h-11 rounded-xl text-xs"
            >
              Editar Perfil
            </Button>
          </CardBody>
        </Card>

        {/* User's Post History Feed Header */}
        <div>
          <h3 className="text-3xs font-extrabold uppercase tracking-widest text-text-muted mb-3 px-1">
            Minhas Publicações ({userPosts.length})
          </h3>

          {userPosts.length === 0 ? (
            <Card className="border-slate-100/60 p-6 text-center text-xs text-text-muted">
              Você ainda não publicou nada. Toque no "+" na barra inferior para criar um post!
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {userPosts.map((post) => (
                <Card key={post.id} className="border-slate-100/60 shadow-xs">
                  <CardHeader className="p-3 pb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar name={post.name} size="xs" />
                      <div>
                        <span className="font-bold text-3xs text-text-main block">{post.name}</span>
                        <span className="text-4xs text-text-muted leading-none font-medium">{post.date}</span>
                      </div>
                    </div>
                    <Badge variant="secondary">{post.category}</Badge>
                  </CardHeader>
                  <CardBody className="px-3 py-2 text-3xs font-normal text-text-main/90 leading-relaxed">
                    {post.content}
                  </CardBody>
                  <CardFooter className="px-3 py-1 flex items-center justify-between border-t border-slate-50">
                    <div className="flex items-center gap-1 text-3xs text-primary font-bold">
                      <Heart className="w-3.5 h-3.5 fill-primary" />
                      <span>{post.likes} curtidas</span>
                    </div>
                    <div className="flex text-text-muted">
                      <button className="p-2 hover:text-text-main"><MessageSquare className="w-3.5 h-3.5" /></button>
                      <button className="p-2 hover:text-text-main"><Share2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export { Profile };
