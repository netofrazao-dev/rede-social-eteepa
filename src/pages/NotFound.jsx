import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white min-h-[600px] animate-scale-in">
      <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-black text-text-main">Página não encontrada</h2>
      <p className="text-xs text-text-muted mt-1.5 max-w-xs leading-relaxed">
        O link que você acessou pode estar quebrado ou a página foi removida temporariamente.
      </p>
      <Link to="/feed" className="mt-6 w-full max-w-xs block">
        <Button variant="primary" size="md" fullWidth>
          Voltar para o Feed
        </Button>
      </Link>
    </div>
  );
}
export { NotFound };
