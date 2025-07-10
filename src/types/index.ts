//src/types/index.ts

// Role
export type Role = 'ADMIN' | 'PROFESSEUR' | 'ELEVE'

// User (représente les données complètes d’un utilisateur)
export interface Profil {
  id: string // UUID
  nom: string
  prenom: string
  email: string
  photo_profil?: string | null
  role: Role
  must_change_password: boolean
  created_at: string // ISO timestamp
}

// NewUser (pour insérer un nouvel utilisateur dans la base de données)
export type NewUser = Omit<Profil, 'id' | 'created_at'>
