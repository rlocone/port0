'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Plus, Pencil, Trash2, Save, X, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getSocialLinks, saveSocialLinks, SocialLink } from '@/components/social-links';

const ADMIN_PASSWORD = 'Welcome@2026';

const platformOptions = [
  'Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'GitHub', 'YouTube', 'TikTok', 'Discord', 'Website', 'Other'
];

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLink, setNewLink] = useState({ platform: 'Facebook', url: '' });
  const [editForm, setEditForm] = useState({ platform: '', url: '' });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setMounted(true);
    const authStatus = sessionStorage?.getItem?.('portalAdminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setLinks(getSocialLinks());
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e?.preventDefault?.();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage?.setItem?.('portalAdminAuth', 'true');
      setLinks(getSocialLinks());
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage?.removeItem?.('portalAdminAuth');
    setPassword('');
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAddLink = () => {
    if (!newLink?.url?.trim?.()) {
      setError('Please enter a URL');
      return;
    }
    const newId = Date?.now?.()?.toString?.() ?? Math?.random?.()?.toString?.();
    const updatedLinks = [...(links ?? []), { id: newId, platform: newLink?.platform ?? 'Other', url: newLink?.url ?? '' }];
    setLinks(updatedLinks);
    saveSocialLinks(updatedLinks);
    setNewLink({ platform: 'Facebook', url: '' });
    setShowAddForm(false);
    setError('');
    showSuccess('Link added successfully!');
  };

  const handleEdit = (link: SocialLink) => {
    setEditingId(link?.id ?? null);
    setEditForm({ platform: link?.platform ?? '', url: link?.url ?? '' });
  };

  const handleSaveEdit = () => {
    if (!editForm?.url?.trim?.()) {
      setError('Please enter a URL');
      return;
    }
    const updatedLinks = (links ?? [])?.map?.((link) =>
      link?.id === editingId
        ? { ...link, platform: editForm?.platform ?? link?.platform, url: editForm?.url ?? link?.url }
        : link
    ) ?? [];
    setLinks(updatedLinks);
    saveSocialLinks(updatedLinks);
    setEditingId(null);
    setError('');
    showSuccess('Link updated successfully!');
  };

  const handleDelete = (id: string) => {
    const updatedLinks = (links ?? [])?.filter?.((link) => link?.id !== id) ?? [];
    setLinks(updatedLinks);
    saveSocialLinks(updatedLinks);
    showSuccess('Link deleted successfully!');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 w-full max-w-md text-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8 w-full max-w-md glow-purple"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4">
              <Lock className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-2xl font-light gradient-text">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-2">Enter password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password ?? ''}
                onChange={(e) => setPassword(e?.target?.value ?? '')}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-500 transition-all"
              />
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium hover:from-purple-600 hover:to-cyan-600 transition-all shadow-lg shadow-purple-500/20"
            >
              Login
            </button>
          </form>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 mt-6 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <h1 className="text-2xl font-light gradient-text">Manage Social Links</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all text-sm"
          >
            Logout
          </button>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center gap-2 text-green-400"
            >
              <Check className="w-5 h-5" />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add New Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-cyan-500/30 transition-all text-purple-300"
            >
              <Plus className="w-5 h-5" />
              Add New Link
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <h3 className="text-lg font-medium text-gray-200">Add New Social Link</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <select
                  value={newLink?.platform ?? 'Facebook'}
                  onChange={(e) => setNewLink({ ...(newLink ?? {}), platform: e?.target?.value ?? 'Facebook' })}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none text-white appearance-none cursor-pointer"
                >
                  {(platformOptions ?? [])?.map?.((platform) => (
                    <option key={platform} value={platform} className="bg-gray-900">
                      {platform}
                    </option>
                  ))}
                </select>
                <input
                  type="url"
                  value={newLink?.url ?? ''}
                  onChange={(e) => setNewLink({ ...(newLink ?? {}), url: e?.target?.value ?? '' })}
                  placeholder="https://..."
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none text-white placeholder-gray-500"
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleAddLink}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/30 hover:bg-green-500/30 transition-all text-green-400"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => { setShowAddForm(false); setError(''); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-gray-400"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Links List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-medium text-gray-200 mb-4">Current Links</h3>
          {(links?.length ?? 0) === 0 ? (
            <p className="text-gray-400 text-center py-8">No social links added yet</p>
          ) : (
            <div className="space-y-3">
              {(links ?? [])?.map?.((link, index) => (
                <motion.div
                  key={link?.id ?? index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                >
                  {editingId === link?.id ? (
                    <div className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <select
                          value={editForm?.platform ?? ''}
                          onChange={(e) => setEditForm({ ...(editForm ?? {}), platform: e?.target?.value ?? '' })}
                          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none text-white appearance-none"
                        >
                          {(platformOptions ?? [])?.map?.((platform) => (
                            <option key={platform} value={platform} className="bg-gray-900">
                              {platform}
                            </option>
                          ))}
                        </select>
                        <input
                          type="url"
                          value={editForm?.url ?? ''}
                          onChange={(e) => setEditForm({ ...(editForm ?? {}), url: e?.target?.value ?? '' })}
                          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none text-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-all"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setError(''); }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <span className="text-purple-400 font-medium">{link?.platform ?? 'Unknown'}</span>
                        <p className="text-gray-400 text-sm truncate mt-1">{link?.url ?? ''}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(link)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(link?.id ?? '')}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
