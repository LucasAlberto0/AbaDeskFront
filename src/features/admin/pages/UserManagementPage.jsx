import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, UserPlus } from 'lucide-react';
import { getUsers, createUser } from '../api/userService';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { formatDate } from '../../../lib/utils';
import { Badge } from '../../../components/ui/Badge';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User'
  });

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createUser(formData);
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', role: 'User' });
      await fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Erro ao criar usuário.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Gestão de Usuários</h1>
          <p className="text-text-secondary mt-1">Administre os acessos e perfis da plataforma AbaDesk.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <UserPlus size={18} /> Novo Usuário
        </Button>
      </div>

      <div className="bg-surface-card border border-border-subtle rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
            </div>
          ) : (
            <table className="w-full text-left text-sm text-text-secondary">
              <thead className="bg-gray-50/50 text-xs uppercase text-text-muted border-b border-border-subtle">
                <tr>
                  <th className="px-6 py-4 font-semibold">Nome</th>
                  <th className="px-6 py-4 font-semibold">E-mail</th>
                  <th className="px-6 py-4 font-semibold">Cargo</th>
                  <th className="px-6 py-4 font-semibold">Criação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {users.map((u, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={u.id} 
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium text-text-primary">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {u.name.charAt(0)}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">
                      {u.role === 'Admin' ? (
                        <Badge status="IN_DEVELOPMENT" label="Administrador" className="bg-purple-100 text-purple-700 border-purple-200" />
                      ) : (
                        <Badge status="NEW" label="Usuário Padrão" className="bg-gray-100 text-gray-700 border-gray-200" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(u.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/50 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-card rounded-lg shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="p-4 border-b border-border-subtle bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-text-primary">Cadastrar Novo Usuário</h3>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-secondary">Nome Completo</label>
                <Input name="name" value={formData.name} onChange={handleChange} required placeholder="João da Silva" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-secondary">E-mail Corporativo</label>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="joao@abadesk.local" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-secondary">Senha</label>
                <Input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-secondary">Perfil de Acesso</label>
                <select name="role" value={formData.role} onChange={handleChange} className="flex h-10 w-full rounded-[4px] border border-border-subtle bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary">
                  <option value="User">Usuário Padrão</option>
                  <option value="Admin">Administrador (TI)</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button type="submit" isLoading={isSubmitting}>Salvar Usuário</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
