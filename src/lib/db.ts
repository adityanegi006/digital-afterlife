import { JSONFilePreset } from 'lowdb/node';
import path from 'path';

const dbFile = path.join(process.cwd(), 'local-db.json');

export type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  relation: string;
};

export type VaultSchema = {
  importantDocs: Array<{ id: string; title: string; filePath: string; notes: string; fileUrl?: string }>;
  medical: { 
    bloodType: string; 
    allergies: string; 
    reports: Array<{ id: string; condition: string; doctor: string; fileUrl?: string }>;
  };
  insurance: Array<{ id: string; provider: string; policyNumber: string; type: string; beneficiary: string; fileUrl?: string }>;
  assets: Array<{ id: string; type: string; details: string; beneficiary: string; fileUrl?: string }>;
  subscriptions: Array<{ id: string; service: string; actionRequired: string }>;
  timeCapsules: Array<{ id: string; toName: string; message: string }>;
  liabilities: Array<{ id: string; type: string; provider: string; amount: string; notes: string }>;
  dependents: { pets: Array<{ id: string; name: string; type: string; care: string }>; people: Array<{ id: string; name: string; relation: string; instructions: string }> };
  finalWishes: { burialPreference: string; prepaidDetails: string; music: string; notes: string };
  guardianMode: boolean;
};

const defaultData: VaultSchema = {
  importantDocs: [],
  medical: { bloodType: '', allergies: '', reports: [] },
  insurance: [],
  assets: [],
  subscriptions: [],
  timeCapsules: [],
  liabilities: [],
  dependents: { pets: [], people: [] },
  finalWishes: { burialPreference: '', prepaidDetails: '', music: '', notes: '' },
  guardianMode: false,
};

export async function getDb() {
  const db = await JSONFilePreset<VaultSchema>(dbFile, defaultData);
  // ensure loaded db has all keys from defaultData
  db.data = {
    ...defaultData,
    ...(db.data || {}),
  } as VaultSchema;
  return db;
}
