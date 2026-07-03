import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Avatar from '../components/Avatar';
import Card, { CardHeader, CardBody, CardFooter } from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import useAuth from '../hooks/useAuth';
import useApp from '../hooks/useApp';
import { LogOut, Settings, Edit3, Heart, MessageSquare, Share2, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    // Load feed and filter by user name
    const customPosts = localStorage.getItem('eetepa_custom_posts');
    const loadedCustom = customPosts ? JSON.parse(customPosts) : [];
    
    // Add some initial mock posts representing user history if they match
    const allPosts = [
      ...loadedCustom,
      {
        id: 99,
        name: 'Glauber Souza',
        roleLabel: 'Diretor Geral',
        role: 'admin',
        date: '3 dias atrás',
        content: 'Reunião pedagógica finalizada com sucesso. Alinhamos novas metas para o ensino técnico e uso de IA no ambiente escolar.',
        likes: 31,
        liked: true,
        category: 'Aviso',
      },
      {
        id: 100,
        name: 'Prof. Marcos Silva',
        roleLabel: 'Prof. de Informática',
        role: 'teacher',
        date: '5 dias atrás',
        content: 'Materiais extras de lógica de programação adicionados no classroom. Lembrem-se de praticar antes de começar com bibliotecas!',
        likes: 19,
        liked: false,
        category: 'Geral',
      },
      {
        id: 101,
        name: 'Amanda Costa',
        roleLabel: 'Líder do 3º Info',
        role: 'leader',
        date: '4 dias atrás',
        content: 'Conseguimos reservar o auditório para nosso debate estudantil na próxima sexta-feira! Divulguem nas salas!',
        likes: 27,
        liked: true,
        category: 'Geral',
      },
      {
        id: 102,
        name: 'Thiago Rocha',
        roleLabel: 'Aluno de Informática',
        role: 'student',
        date: '1 semana atrás',
        content: 'Finalmente terminei meu primeiro projeto web com HTML e CSS puros! Muito satisfeito com os resultados obtidos.',
        likes: 12,
        liked: true,
        category: 'Geral',
      }
    ];

    const filtered = allPosts.filter((p) => p.name === user?.name);
    setUserPosts(filtered);
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
