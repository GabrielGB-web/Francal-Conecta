
import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types.ts';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
  registeredUsers: UserProfile[];
}

const Login: React.FC<LoginProps> = ({ onLogin, registeredUsers }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Logica de Master Login
    if (username.toLowerCase() === 'master' && password === 'admin123') {
      onLogin({
        id: 'MASTER-001',
        name: 'Acesso Master',
        dept: 'Diretoria',
        role: 'Donos'
      });
      return;
    }

    // Busca nos usuários cadastrados (simulando que o nome é o login e senha é padrão ou baseada no ID)
    const foundUser = registeredUsers.find(u =>
      u.name.toLowerCase().includes(username.toLowerCase()) && username.length > 3
    );

    if (foundUser) {
      onLogin(foundUser);
    } else {
      setError('Credenciais inválidas ou usuário não encontrado.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-royal-blue p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
          <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center font-black text-4xl text-white shadow-2xl mx-auto mb-6 border-2 border-red-400/30">F</div>
          <h1 className="text-white text-2xl font-black uppercase tracking-widest">Francal Conecta</h1>
          <p className="text-blue-200/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Sistema de Gestão Integrada</p>
        </div>

        <form onSubmit={handleLogin} className="p-12 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center animate-bounce">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-royal-blue uppercase ml-1 tracking-widest">Identificação</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="text"
                placeholder="Nome ou 'master'"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-xs font-bold outline-none focus:border-royal-blue focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-royal-blue uppercase ml-1 tracking-widest">Senha de Acesso</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="password"
                placeholder="Sua senha corporativa"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-xs font-bold outline-none focus:border-royal-blue focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-royal-blue text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-blue-900 transition-all flex items-center justify-center gap-3 active:scale-95 group"
          >
            Acessar Painel <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="pt-6 text-center">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
              Acesso restrito a colaboradores autorizados.<br />
              © 2025 Francal Feiras
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
