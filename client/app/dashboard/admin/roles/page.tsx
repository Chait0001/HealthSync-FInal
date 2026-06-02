'use client';

import { useEffect, useState, Fragment } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Shield, Check, Save, Loader2 } from 'lucide-react';

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});
  const [loading, setLoading] = useState(true);
  const [savingRoleId, setSavingRoleId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get('/admin/roles'),
      api.get('/admin/permissions'),
    ]).then(async ([r, p]) => {
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
            initialSelected[role._id] = new Set(permDocs.map((pd: any) => pd.permission_key));
          } catch (err) {
            console.error(`Failed to fetch permissions for role ${role.name}`, err);
          }
        })
      );
      setSelected(initialSelected);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading roles/permissions data', err);
      setLoading(false);
    });
  }, []);

  const toggle = (roleId: string, permKey: string) => {
    setSelected(prev => {
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
        permission_keys: [...(selected[roleId] ?? [])]
      });
      alert('Permissions saved successfully!');
    } catch (err) {
      console.error('Failed to save permissions', err);
      alert('Failed to save permissions. Please try again.');
    } finally {
      setSavingRoleId(null);
    }
  };

  const modules = [...new Set(permissions.map((p: any) => p.module))];

  if (loading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading roles and permissions matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Permissions</h1>
          <p className="text-muted-foreground mt-1">Configure and manage access control levels across roles.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/5">
                <th className="text-left p-4 bg-slate-50/50 dark:bg-white/5 font-semibold text-slate-700 dark:text-neutral-300">
                  Permission Name / Key
                </th>
                {roles.map(r => (
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
              {modules.map(mod => (
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
                        {roles.map(r => (
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

      <div className="flex flex-wrap gap-4 mt-6 p-4 bg-slate-50 dark:bg-[#0d1117]/60 border border-slate-200 dark:border-white/5 rounded-2xl items-center justify-between">
        <div className="text-sm text-slate-500 dark:text-neutral-400 flex items-center gap-2">
          <Shield className="w-5 h-5 text-teal-500" />
          <span>Select permissions check-boxes and click save to apply RBAC updates.</span>
        </div>
        <div className="flex gap-3">
          {roles.map(r => (
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
    </div>
  );
}
