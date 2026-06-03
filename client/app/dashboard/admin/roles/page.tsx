'use client';

import { useEffect, useState, Fragment } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import {
  Shield,
  Save,
  Loader2,
  Plus,
  Trash2,
  X,
  ShieldCheck,
  Users,
  Lock,
  Globe,
} from 'lucide-react';

// ─── Create Role Modal ──────────────────────────────────────────────────────
function CreateRoleModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState('');
  const [roleType, setRoleType] = useState<'system' | 'custom'>('custom');
  const [scopeLevel, setScopeLevel] = useState('hospital');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const key = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !key) {
      setError('Please enter a valid role name.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.post('/roles', {
        key,
        name: name.trim(),
        role_type: roleType,
        scope_level: scopeLevel,
      });
      onCreated();
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Failed to create role. Please try again.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/5">
          <h2 className="text-xl font-bold tracking-tight">Create New Role</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Role Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
              Role Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Receptionist, Lab Technician"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-neutral-500"
            />
            {key && (
              <p className="text-xs text-slate-400 dark:text-neutral-500 font-mono">
                Key: <span className="text-teal-600 dark:text-teal-400">{key}</span>
              </p>
            )}
          </div>

          {/* Role Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
              Role Type
            </label>
            <select
              value={roleType}
              onChange={(e) => setRoleType(e.target.value as 'system' | 'custom')}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors"
            >
              <option value="custom">Custom</option>
              <option value="system">System</option>
            </select>
          </div>

          {/* Scope Level */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
              Scope Level
            </label>
            <select
              value={scopeLevel}
              onChange={(e) => setScopeLevel(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors"
            >
              <option value="global">Global</option>
              <option value="hospital">Hospital</option>
              <option value="department">Department</option>
              <option value="own">Own</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-neutral-300 rounded-xl text-sm font-medium transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || !name.trim()}
              className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>Create Role</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Scope Icon Helper ──────────────────────────────────────────────────────
function ScopeIcon({ scope }: { scope: string }) {
  switch (scope) {
    case 'global':
      return <Globe className="w-3.5 h-3.5" />;
    case 'own':
      return <Lock className="w-3.5 h-3.5" />;
    default:
      return <Users className="w-3.5 h-3.5" />;
  }
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});
  const [loading, setLoading] = useState(true);
  const [savingRoleId, setSavingRoleId] = useState<string | null>(null);
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [r, p] = await Promise.all([
        api.get('/admin/roles'),
        api.get('/admin/permissions'),
      ]);
      const fetchedRoles = r.data.data || [];
      const fetchedPermissions = p.data.data || [];
      setRoles(fetchedRoles);
      setPermissions(fetchedPermissions);

      // Fetch existing permissions for each role to pre-populate checkboxes
      const initialSelected: Record<string, Set<string>> = {};
      await Promise.all(
        fetchedRoles.map(async (role: any) => {
          try {
            const rolePermsRes = await api.get(`/roles/${role._id}/permissions`);
            const permDocs = rolePermsRes.data.data.permissions || [];
            initialSelected[role._id] = new Set(
              permDocs.map((pd: any) => pd.permission_key)
            );
          } catch (err) {
            console.error(`Failed to fetch permissions for role ${role.name}`, err);
          }
        })
      );
      setSelected(initialSelected);
    } catch (err) {
      console.error('Error loading roles/permissions data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggle = (roleId: string, permKey: string) => {
    setSelected((prev) => {
      const set = new Set(prev[roleId] ?? []);
      if (set.has(permKey)) {
        set.delete(permKey);
      } else {
        set.add(permKey);
      }
      return { ...prev, [roleId]: set };
    });
  };

  const save = async (roleId: string) => {
    setSavingRoleId(roleId);
    try {
      await api.put(`/roles/${roleId}/permissions`, {
        permission_keys: [...(selected[roleId] ?? [])],
      });
      alert('Permissions saved successfully!');
    } catch (err) {
      console.error('Failed to save permissions', err);
      alert('Failed to save permissions. Please try again.');
    } finally {
      setSavingRoleId(null);
    }
  };

  const handleDelete = async (roleId: string, roleName: string) => {
    if (!confirm(`Are you sure you want to delete the "${roleName}" role? This action cannot be undone.`)) {
      return;
    }
    setDeletingRoleId(roleId);
    try {
      await api.delete(`/roles/${roleId}`);
      await fetchData();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to delete role.';
      alert(msg);
    } finally {
      setDeletingRoleId(null);
    }
  };

  const modules = [...new Set(permissions.map((p: any) => p.module))];

  if (loading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Loading roles and permissions matrix...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Permissions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Configure and manage access control levels across roles.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Role</span>
        </Button>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => {
          const permCount = selected[role._id]?.size ?? 0;
          const isSystem = ['admin', 'doctor', 'patient'].includes(role.key);
          return (
            <div
              key={role._id}
              className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                {!isSystem && (
                  <button
                    onClick={() => handleDelete(role._id, role.name)}
                    disabled={deletingRoleId === role._id}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete role"
                  >
                    {deletingRoleId === role._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                {role.name}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isSystem
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
                  }`}
                >
                  {isSystem ? 'system' : role.role_type || 'custom'}
                </span>
                {role.scope_level && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                    <ScopeIcon scope={role.scope_level} />
                    {role.scope_level}
                  </span>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
                    {permCount}
                  </span>{' '}
                  permission{permCount !== 1 ? 's' : ''} assigned
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/5">
                <th className="text-left p-4 bg-slate-50/50 dark:bg-white/5 font-semibold text-slate-700 dark:text-neutral-300">
                  Permission Name / Key
                </th>
                {roles.map((r) => (
                  <th
                    key={r._id}
                    className="p-4 bg-slate-50/50 dark:bg-white/5 text-center capitalize font-semibold text-slate-700 dark:text-neutral-300 border-l border-slate-200 dark:border-white/5"
                  >
                    {r.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((mod) => (
                <Fragment key={mod}>
                  <tr className="bg-slate-50/50 dark:bg-white/[0.02]">
                    <td
                      colSpan={roles.length + 1}
                      className="px-4 py-2.5 font-semibold text-teal-600 dark:text-teal-400 capitalize bg-teal-500/5 dark:bg-teal-500/10 border-y border-slate-200 dark:border-white/5"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>{mod} Module</span>
                      </div>
                    </td>
                  </tr>
                  {permissions
                    .filter((p: any) => p.module === mod)
                    .map((perm: any) => (
                      <tr
                        key={perm.key}
                        className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/30 dark:hover:bg-white/[0.01] transition-colors"
                      >
                        <td className="p-4 font-medium text-slate-800 dark:text-neutral-200">
                          <div>
                            <p>{perm.name}</p>
                            <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
                              {perm.key}
                            </span>
                          </div>
                        </td>
                        {roles.map((r) => (
                          <td
                            key={r._id}
                            className="p-4 text-center border-l border-slate-100 dark:border-white/5"
                          >
                            <label className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={selected[r._id]?.has(perm.key) ?? false}
                                onChange={() => toggle(r._id, perm.key)}
                                className="w-5 h-5 rounded border-slate-300 dark:border-white/10 text-teal-600 focus:ring-teal-500 cursor-pointer accent-teal-600"
                              />
                            </label>
                          </td>
                        ))}
                      </tr>
                    ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Bar */}
      <div className="flex flex-wrap gap-4 p-4 bg-slate-50 dark:bg-[#0d1117]/60 border border-slate-200 dark:border-white/5 rounded-2xl items-center justify-between">
        <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Shield className="w-5 h-5 text-teal-500" />
          <span>
            Select permissions check-boxes and click save to apply RBAC updates.
          </span>
        </div>
        <div className="flex gap-3 flex-wrap">
          {roles.map((r) => (
            <Button
              key={r._id}
              onClick={() => save(r._id)}
              disabled={savingRoleId !== null}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all flex items-center gap-1.5"
            >
              {savingRoleId === r._id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save {r.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateRoleModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => fetchData()}
        />
      )}
    </div>
  );
}
