// src/types/index.ts
export type Role = 'ADMIN' | 'PROFESSEUR' | 'ELEVE';

// Utilisateur complet
export interface Profil {
  id: string; // UUID
  nom: string;
  prenom: string;
  email: string;
  photo_profil?: string | null;
  role: Role;
  must_change_password: boolean;
  created_at: string;
  updated_at: string;
}

// Création nouvel utilisateur
export type NewUser = Omit<Profil, 'id' | 'created_at' | 'updated_at'> & {
  photo_profil?: string | null;
};

// Classe
export interface Classe {
  id: string; // UUID
  code_classe: string;
  created_by?: string | null; // UUID utilisateur créateur
  modified_by?: string | null; // UUID utilisateur modificateur
  created_at: string;
  updated_at: string;
}

// Relation utilisateur-classe
export interface UsersClasse {
  id: string; // UUID
  users_id: string; // UUID utilisateur
  classe_id: string; // UUID classe
  assigned_at: string;
}

// Simulation
export interface Simulation {
  id: string; // UUID
  titre: string;
  description?: string | null;
  chapitre?: string | null;
  objectifs?: string | null;
  resultats_attendus?: string | null;
  created_by?: string | null; // UUID utilisateur créateur
  created_at: string;
  updated_at: string;
}

// Simulation accessible par professeur (relation + état d'accès)
export interface SimulationProfesseur {
  id: string; // UUID
  professeur_id: string; // UUID
  simulation_id: string; // UUID
  est_autorisee: boolean;
  demande_envoyee: boolean;
  demande_envoyee_at?: string | null;
  autorisee_at?: string | null;
  created_at: string;
}

// Simulation accessible par élève (relation + état d'accès)
export interface SimulationEleve {
  id: string; // UUID
  eleve_id: string; // UUID
  simulation_id: string; // UUID
  professeur_id?: string | null; // UUID prof responsable
  est_autorisee: boolean;
  demande_envoyee: boolean;
  demande_envoyee_at?: string | null;
  autorisee_at?: string | null;
  created_at: string;
}

// Requête d'accès à une simulation
export interface SimulationAccessRequest {
  id: string; // UUID
  simulation_id: string; // UUID
  demandeur_id?: string | null; // UUID
  destinataire_id?: string | null; // UUID
  role_demandeur: Role;
  statut: 'EN_ATTENTE' | 'APPROUVE' | 'REJETE';
  message?: string | null;
  created_at: string;
  updated_at: string;
}

// Quiz
export interface Quiz {
  id: string; // UUID
  titre: string;
  description?: string | null;
  duree: number; // en minutes ou secondes selon ton usage
  image?: string | null;
  created_by?: string | null; // UUID utilisateur
  created_at: string;
  updated_at: string;
}

// Relation classe-quiz
export interface ClasseQuiz {
  id: string; // UUID
  classe_id: string; // UUID
  quiz_id: string; // UUID
  assigned_at: string;
}

// Question de quiz
export interface Question {
  id: string; // UUID
  quiz_id: string; // UUID
  question: string;
  options: string[]; // tableau d'options possibles
  reponse_correcte: string; // texte de la réponse correcte
  explication?: string | null;
  created_at: string;
  updated_at: string;
}

// Résultat de quiz
export interface QuizResult {
  id: string; // UUID
  users_id: string; // UUID utilisateur
  quiz_id: string; // UUID quiz
  note?: number | null;
  reponses?: Record<string, unknown> | null; // JSONB - réponses données
  completed_at?: string | null;
}

// Logs d'activité
export interface ActivityLog {
  id: string; // UUID
  user_id: string; // UUID utilisateur
  action: string;
  target_type?: string | null;
  target_id?: string | null;
  created_at: string;
}