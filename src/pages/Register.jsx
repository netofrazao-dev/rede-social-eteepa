import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useApp from '../hooks/useApp';
import Button from '../components/Button';
import Input from '../components/Input';
import Card, { CardBody } from '../components/Card';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return setError('Por favor, informe seu nome.');
    if (!email.trim()) return setError('Por favor, informe seu e-mail.');
    if (password.length < 6) return setError('A senha precisa ter pelo menos 6 caracteres.');
    if (password !== confirm) return setError('As senhas não são iguais.');

    setIsLoading(true);
    setError('');

    try {
      await register(name.trim(), email, password);
      addToast('Conta criada com sucesso! Bem-vindo(a) 🎉', 'success');
      navigate('/feed', { replace: true });
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col justify-center min-h-[780px] p-6 overflow-hidden">
      {/* Fundo desfocado (mesmo clima da tela de login) */}
      <div className="absolute inset-0 z-0 flex flex-col gap-4 p-4 opacity-75 select-none pointer-events-none filter blur-sm">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col gap-3">
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
        ))}
      </div>

      {/* Overlay escuro */}
      <div className="absolute inset-0 z-10 bg-slate-950/40 backdrop-blur-md"></div>

      {/* Card de cadastro */}
      <div className="relative z-20 w-full animate-scale-in">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1.5 rounded-full text-3xs font-extrabold tracking-widest text-primary bg-primary/10 border border-primary/20 mb-3 uppercase">
            Criar Conta
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-sm leading-tight">
            Rede Social <br />
            <span className="bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">
              EETEPA-BREVES
            </span>
          </h2>
          <p className="text-xs text-white/70 mt-2 font-medium">
            Faça parte da comunidade da escola
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur">
          <CardBody className="p-6 pt-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Nome completo"
                type="text"
                name="name"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User className="w-5 h-5 text-text-muted/80" />}
                autoFocus
              />

              <Input
                label="E-mail"
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-5 h-5 text-text-muted/80" />}
              />

              <Input
                label="Senha"
                type="password"
                name="password"
                placeholder="Mínimo de 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5 text-text-muted/80" />}
              />

              <Input
                label="Confirmar senha"
                type="password"
                name="confirm"
                placeholder="Repita a senha"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                icon={<Lock className="w-5 h-5 text-text-muted/80" />}
              />

              {error && (
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
                icon={<UserPlus className="w-5 h-5" />}
                className="mt-2"
              >
                Criar conta
              </Button>
            </form>

            {/* Link para voltar ao login */}
            <div className="mt-6 border-t border-slate-100 pt-4 text-center">
              <p className="text-xs text-text-muted">
                Já tem conta?{' '}
                <Link to="/login" className="font-bold text-primary hover:underline">
                  Entrar
                </Link>
              </p>
            </div>

            <p className="text-3xs text-text-muted/70 text-center mt-3 leading-relaxed">
              Novas contas entram como <strong>aluno</strong> (podem ver, curtir e comentar).
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
