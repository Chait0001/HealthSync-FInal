import 'dotenv/config';
import { DatabaseConnection } from '../config/database';
import { PermissionModel } from '../models/Permission.model';
import { RoleModel } from '../models/Role.model';
import { RolePermissionModel } from '../models/RolePermission';
import { UserModel } from '../models/User.model';

const PERMISSIONS = [
  { key: 'patients.view',           module: 'patients',      action: 'view',    name: 'View Patients',       category: 'Patients' },
  { key: 'patients.create',         module: 'patients',      action: 'create',  name: 'Create Patient',      category: 'Patients' },
  { key: 'patients.update',         module: 'patients',      action: 'update',  name: 'Update Patient',      category: 'Patients' },
  { key: 'appointments.view',       module: 'appointments',  action: 'view',    name: 'View Appointments',   category: 'Appointments' },
  { key: 'appointments.create',     module: 'appointments',  action: 'create',  name: 'Book Appointment',    category: 'Appointments' },
  { key: 'appointments.cancel',     module: 'appointments',  action: 'cancel',  name: 'Cancel Appointment',  category: 'Appointments' },
  { key: 'appointments.approve',    module: 'appointments',  action: 'approve', name: 'Approve Appointment', category: 'Appointments' },
  { key: 'doctors.view',            module: 'doctors',       action: 'view',    name: 'View Doctors',        category: 'Doctors' },
  { key: 'doctors.manage',          module: 'doctors',       action: 'manage',  name: 'Manage Doctors',      category: 'Doctors' },
  { key: 'users.view',              module: 'users',         action: 'view',    name: 'View Users',          category: 'Admin' },
  { key: 'users.delete',            module: 'users',         action: 'delete',  name: 'Delete Users',        category: 'Admin' },
  { key: 'roles.manage',            module: 'roles',         action: 'manage',  name: 'Manage Roles',        category: 'Admin' },
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin:        ['patients.view','patients.create','patients.update','appointments.view','appointments.create','appointments.cancel','appointments.approve','doctors.view','doctors.manage','users.view','users.delete','roles.manage'],
  doctor:       ['patients.view','patients.update','appointments.view','appointments.cancel','doctors.view'],
  patient:      ['appointments.view','appointments.create','appointments.cancel','doctors.view'],
  receptionist: ['patients.view','patients.create','appointments.view','appointments.create','appointments.cancel','doctors.view'],
};

async function seed() {
  await DatabaseConnection.getInstance().connect();

  // Upsert permissions
  for (const p of PERMISSIONS) {
    await PermissionModel.findOneAndUpdate({ key: p.key }, p, { upsert: true, new: true });
  }
  console.log('✅ Permissions seeded');

  // Upsert roles
  const roleDefs = [
    { key: 'admin',        name: 'Admin',        scope_level: 'global' },
    { key: 'doctor',       name: 'Doctor',       scope_level: 'department' },
    { key: 'patient',      name: 'Patient',      scope_level: 'own' },
    { key: 'receptionist', name: 'Receptionist', scope_level: 'hospital' },
  ];
  for (const r of roleDefs) {
    await RoleModel.findOneAndUpdate({ key: r.key }, r, { upsert: true, new: true });
  }
  console.log('✅ Roles seeded');

  // Assign permissions to roles
  const allPerms = await PermissionModel.find();
  const allRoles = await RoleModel.find();
  const permMap = Object.fromEntries(allPerms.map(p => [p.key, p]));
  const roleMap = Object.fromEntries(allRoles.map(r => [r.key, r]));

  for (const [roleKey, permKeys] of Object.entries(ROLE_PERMISSIONS)) {
    const role = roleMap[roleKey];
    if (!role) continue;
    await RolePermissionModel.deleteMany({ role_id: role._id });
    const inserts = permKeys.map(k => ({
      role_id: role._id,
      permission_id: permMap[k]._id,
      permission_key: k,
      effect: 'allow',
    }));
    await RolePermissionModel.insertMany(inserts);
  }
  console.log('✅ Role-permissions assigned');

  // Migrate existing users: populate permissions_cache based on their role string
  const users = await UserModel.find({});
  let migratedCount = 0;
  for (const user of users) {
    const userRole = (user as any).role;
    if (!userRole) continue;
    const role = roleMap[userRole];
    if (!role) continue;
    // Get permission keys for this role
    const rolePermDocs = await RolePermissionModel.find({ role_id: role._id, effect: 'allow' });
    const permKeys = rolePermDocs.map(rp => rp.permission_key);
    await UserModel.findByIdAndUpdate(user._id, { $set: { permissions_cache: permKeys } });
    migratedCount++;
  }
  console.log(`✅ Migrated permissions_cache for ${migratedCount} existing users`);

  process.exit(0);
}

seed().catch(console.error);

