import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Search, Filter, MoreVertical, Shield, UserX, UserCheck, 
  Mail, Calendar, ArrowUpRight, Loader2, AlertCircle
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '../../components/UIPolish';
import { fadeUp, staggerContainer } from '../../lib/animations';

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.data);
    } catch (error) {
      toast.error('Failed to materialize user archives');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      toast.success('Neural permissions recalibrated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update permissions');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to purge this entity from the mainframe?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('Entity purged from KALEIDO');
      fetchUsers();
    } catch (error) {
      toast.error('Purge failed');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (loading) return <LoadingSpinner size="large" />;

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 lg:px-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 uppercase tracking-tighter">Entity Archive</h1>
            <p className="text-white/40 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
              <Users size={14} /> Global Identity Repository
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search entities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Roles</option>
              <option value="buyer">Travelers (Buyers)</option>
              <option value="seller">Merchants (Sellers)</option>
              <option value="admin">Overlords (Admins)</option>
            </select>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-white/40">Entity</th>
                  <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-white/40">Neural Status</th>
                  <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-white/40">Anchor Date</th>
                  <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-white/40">Permissions</th>
                  <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-white/40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user, i) => (
                  <motion.tr 
                    key={user._id}
                    variants={fadeUp}
                    custom={i}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10">
                          <span className="text-sm font-bold">{user.name[0]}</span>
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-primary transition-colors">{user.name}</p>
                          <p className="text-xs text-white/40 flex items-center gap-1">
                            <Mail size={10} /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'admin' ? 'bg-magenta/20 text-magenta border border-magenta/30' :
                          user.role === 'seller' ? 'bg-primary/20 text-primary border border-primary/30' :
                          'bg-white/10 text-white/60 border border-white/10'
                        }`}>
                          {user.role === 'admin' && <Shield size={10} />}
                          {user.role}
                        </span>
                        {user.role === 'seller' && (
                          <span className={`text-[9px] font-mono uppercase tracking-tighter ${user.sellerInfo?.isApproved ? 'text-green-400' : 'text-yellow-400'}`}>
                            {user.sellerInfo?.isApproved ? '● Verified Merchant' : '○ Pending Approval'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-white/60 font-mono">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                        className="bg-transparent text-xs font-bold text-white/40 hover:text-white transition-colors cursor-pointer outline-none"
                      >
                        <option value="buyer">Traveler</option>
                        <option value="seller">Merchant</option>
                        <option value="admin">Overlord</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.role === 'seller' && !user.sellerInfo?.isApproved && (
                          <button 
                            onClick={async () => {
                              try {
                                await api.put(`/admin/sellers/${user._id}/approve`, { isApproved: true });
                                toast.success('Merchant credentials authorized');
                                fetchUsers();
                              } catch (error) {
                                toast.error('Approval failed');
                              }
                            }}
                            className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all"
                            title="Approve Merchant"
                          >
                            <UserCheck size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                          title="Purge Entity"
                        >
                          <UserX size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="py-20 text-center">
              <AlertCircle className="mx-auto mb-4 text-white/10" size={48} />
              <p className="text-white/40 font-mono uppercase tracking-widest">No entities found in archive</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UserManagement;
