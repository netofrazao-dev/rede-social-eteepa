import React from 'react';
import Navbar from '../components/Navbar';
import Card, { CardBody } from '../components/Card';
import Badge from '../components/Badge';
import { BookOpen, Shield, HelpCircle } from 'lucide-react';

export default function About() {
  return (
    <div className="flex-1 flex flex-col bg-bg-sec">
      {/* Top Navbar */}
      <Navbar title="Sobre o EETEPA Social" />

      <div className="p-4 flex-grow flex flex-col gap-4 safe-scroll-area">
        
        {/* Banner Card */}
        <div className="bg-gradient-to-br from-primary to-rose-600 text-white rounded-3xl p-6 shadow-md shadow-primary/10 relative overflow-hidden select-none animate-fade-in">
          <div className="relative z-10">
            <span className="text-4xs font-black tracking-widest bg-white/20 px-2.5 py-1 rounded-full uppercase">
              Versão 1.0.0
            </span>
            <h2 className="text-xl font-extrabold mt-3 tracking-tight">Rede Social EETEPA</h2>
            <p className="text-2xs text-white/90 mt-1 max-w-xs font-medium leading-relaxed">
              O ponto de encontro digital oficial dos estudantes e educadores da EETEPA Breves.
            </p>
          </div>
          {/* Subtle backgrounds visual accents */}
          <div className="absolute right-[-20px] bottom-[-20px] w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* Content Details */}
        <div className="flex flex-col gap-4 animate-slide-up">
          <Card className="border-slate-100/60 shadow-xs">
            <CardBody className="p-5 flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-xs text-text-main">Objetivo Acadêmico</h4>
                <p className="text-3xs text-text-muted mt-1 leading-relaxed">
                  Facilitar a divulgação de avisos, notas, prazos de entrega e materiais de apoio diretamente dos professores para as turmas de informática.
                </p>
              </div>
            </CardBody>
          </Card>

          <Card className="border-slate-100/60 shadow-xs">
            <CardBody className="p-5 flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-xs text-text-main">Segurança e Permissões</h4>
                <p className="text-3xs text-text-muted mt-1 leading-relaxed">
                  Para garantir um ambiente focado nos estudos, o envio de novos posts é restrito a professores, líderes e administradores. Alunos têm acesso livre para visualização e curtidas.
                </p>
              </div>
            </CardBody>
          </Card>

          <Card className="border-slate-100/60 shadow-xs">
            <CardBody className="p-5 flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-xs text-text-main">Como Usar?</h4>
                <p className="text-3xs text-text-muted mt-1 leading-relaxed">
                  Utilize o menu inferior para alternar entre o Feed de avisos, a tela de Criação de Publicações e o seu Perfil Pessoal para monitorar suas postagens.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Footer text */}
        <div className="mt-auto text-center py-4 text-4xs font-bold text-text-muted/60 select-none uppercase tracking-wider">
          EETEPA Breves © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
export { About };
