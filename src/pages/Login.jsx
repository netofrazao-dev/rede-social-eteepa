import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useApp from '../hooks/useApp';
import Button from '../components/Button';
import Input from '../components/Input';
import Card, { CardBody } from '../components/Card';
import Avatar from '../components/Avatar';
import { Mail, Lock, LogIn, Heart, MessageSquare } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/feed';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor, informe seu e-mail.');
      return;
    }
    if (!password) {
      setError('Por favor, insira sua senha.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      addToast('Login realizado com sucesso!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col justify-center min-h-[780px] p-6 overflow-hidden">
      
      {/* Mock Social Feed in Background (Blurred and Darkened) */}
      <div className="absolute inset-0 z-0 flex flex-col gap-4 p-4 opacity-75 select-none pointer-events-none filter blur-sm">
        {/* Mock Post 1 */}
        <div className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="h-3 w-24 bg-slate-250 rounded"></div>
              <div className="h-2 w-16 bg-slate-150 rounded"></div>
            </div>
          </div>
          <div className="h-3 w-full bg-slate-200 rounded"></div>
          <div className="h-3 w-5/6 bg-slate-200 rounded"></div>
        </div>
        
        {/* Mock Post 2 */}
        <div className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-250"></div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="h-3 w-28 bg-slate-250 rounded"></div>
              <div className="h-2 w-20 bg-slate-150 rounded"></div>
            </div>
          </div>
          <div className="h-3 w-11/12 bg-slate-200 rounded"></div>
          <div className="h-3 w-4/5 bg-slate-200 rounded"></div>
        </div>

        {/* Mock Post 3 */}
        <div className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="h-3 w-20 bg-slate-200 rounded"></div>
              <div className="h-2 w-12 bg-slate-150 rounded"></div>
            </div>
          </div>
          <div className="h-3 w-full bg-slate-200 rounded"></div>
        </div>
      </div>

      {/* Dark overlay with backdrop-blur */}
      <div className="absolute inset-0 z-10 bg-slate-950/40 backdrop-blur-md"></div>

      {/* Login Card Container */}
      <div className="relative z-20 w-full animate-scale-in">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1.5 rounded-full text-3xs font-extrabold tracking-widest text-primary bg-primary/10 border border-primary/20 mb-3 uppercase">
            Portal Oficial
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-sm leading-tight">
            Rede Social <br/>
            <span className="bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">
              EETEPA-BREVES
            </span>
          </h2>
          <p className="text-xs text-white/70 mt-2 font-medium">
            Conectando alunos, professores e coordenação
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur">
          <CardBody className="p-6 pt-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="E-mail de Acesso"
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-5 h-5 text-text-muted/80" />}
                error={error && email === '' ? 'Campo obrigatório' : ''}
                autoFocus
              />

              <Input
                label="Senha"
                type="password"
                name="password"
                placeholder="Sua senha secreta"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5 text-text-muted/80" />}
                error={error && password === '' ? 'Campo obrigatório' : ''}
              />

              {error && !error.includes('obrigatório') && (
                <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-primary text-xs font-semibold select-none animate-fade-in leading-relaxed">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                icon={<LogIn className="w-5 h-5" />}
                className="mt-2"
              >
                Entrar
              </Button>
            </form>

            {/* Link para criar conta */}
            <div className="mt-6 border-t border-slate-100 pt-4 text-center">
              <p className="text-xs text-text-muted">
                Ainda não tem conta?{' '}
                <Link
                  to="/register"
                  className="font-bold text-primary hover:underline"
                >
                  Criar conta
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
