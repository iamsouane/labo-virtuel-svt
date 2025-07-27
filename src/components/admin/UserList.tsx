// src/components/admin/UserList.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";
import { notifyError, notifySuccess } from "../../lib/notifications";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useActivityLogger } from "../../hooks/useActivityLogger";
import ConfirmDialog from "../ui/ConfirmDialog";

const UserList = () => {
  const [users, setUsers] = useState<Profil[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<Profil | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToPromote, setUserToPromote] = useState<Profil | null>(null);
  const [pendingRole, setPendingRole] = useState<Profil["role"] | null>(null);
  const [confirmRoleChangeOpen, setConfirmRoleChangeOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const pageSize = 8;

  const logActivity = useActivityLogger();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user.id || null;
      setCurrentUserId(userId);

      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("users")
        .select("*", { count: "exact" })
        .neq("role", "ADMIN")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (roleFilter) {
        query = query.eq("role", roleFilter);
      }

      const { data, count, error } = await query;

      if (error) {
        notifyError("Erreur lors de la récupération des utilisateurs.");
        setUsers([]);
      } else {
        setUsers(data as Profil[]);
        if (typeof count === "number") setTotalUsers(count);
      }

      setLoading(false);
    };

    fetchUsers();
  }, [roleFilter, currentPage]);

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value === "all" ? null : e.target.value);
    setCurrentPage(1);
  };

  const handleConfirmRoleChange = async () => {
    if (!userToPromote || !pendingRole) return;

    const { error } = await supabase
      .from("users")
      .update({ role: pendingRole })
      .eq("id", userToPromote.id);

    if (error) {
      notifyError("Erreur lors de la mise à jour du rôle.");
    } else {
      notifySuccess(`Rôle de ${userToPromote.prenom} mis à jour en ${pendingRole} !`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userToPromote.id ? { ...u, role: pendingRole } : u))
      );
      if (currentUserId) {
        await logActivity(currentUserId, `Changement de rôle en ${pendingRole}`, "UserList", userToPromote.id);
      }
    }

    setConfirmRoleChangeOpen(false);
    setUserToPromote(null);
    setPendingRole(null);
  };

  const confirmDeleteUser = (user: Profil) => {
    setUserToDelete(user);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", userToDelete.id);

    if (error) {
      notifyError("Erreur lors de la suppression de l'utilisateur.");
    } else {
      notifySuccess("Utilisateur supprimé avec succès.");
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      if (currentUserId) {
        await logActivity(currentUserId, "Suppression d'un utilisateur", "UserList", userToDelete.id);
      }
    }

    setConfirmOpen(false);
    setUserToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center gap-2 text-secondary">
          <Loader2 className="animate-spin h-5 w-5" />
          <span className="font-medium">Chargement des utilisateurs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary mb-2">Gestion des utilisateurs</h1>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-dark/80">Liste des utilisateurs enregistrés</p>

          <div className="flex items-center gap-2">
            <label htmlFor="roleFilter" className="text-sm text-dark">
              Filtrer par rôle :
            </label>
            <select
              id="roleFilter"
              onChange={handleRoleFilterChange}
              value={roleFilter || "all"}
              className="rounded-lg border border-secondary/30 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">Tous</option>
              <option value="PROFESSEUR">Professeur</option>
              <option value="ELEVE">Élève</option>
            </select>
          </div>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-light rounded-lg p-8 text-center">
          <p className="text-secondary">Aucun utilisateur trouvé</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg border border-secondary/20 shadow-sm">
            <table className="min-w-full">
              <thead className="bg-light border-b border-secondary/20">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-dark">Nom</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-dark">Prénom</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-dark">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-dark">Rôle</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-dark">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/20">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-accent/20">
                    <td className="px-6 py-4 text-sm text-dark">{user.nom}</td>
                    <td className="px-6 py-4 text-sm text-dark">{user.prenom}</td>
                    <td className="px-6 py-4 text-sm text-dark">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.id === currentUserId ? (
                        <span className="text-dark">{user.role}</span>
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) => {
                            setUserToPromote(user);
                            setPendingRole(e.target.value as Profil["role"]);
                            setConfirmRoleChangeOpen(true);
                          }}
                          className="rounded-md border border-secondary/30 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="ELEVE">Élève</option>
                          <option value="PROFESSEUR">Professeur</option>
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      {user.id === currentUserId ? (
                        <span className="text-secondary">Vous</span>
                      ) : (
                        <button
                          onClick={() => confirmDeleteUser(user)}
                          className="text-danger hover:text-dangerHover font-medium"
                        >
                          Supprimer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <div className="text-sm text-dark/70">
              {totalUsers} utilisateur{totalUsers > 1 ? "s" : ""} au total
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-1 border border-secondary/30 rounded-md text-sm disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Précédent
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < Math.ceil(totalUsers / pageSize) ? prev + 1 : prev
                  )
                }
                disabled={currentPage >= Math.ceil(totalUsers / pageSize)}
                className="flex items-center px-3 py-1 border border-secondary/30 rounded-md text-sm disabled:opacity-50"
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Suppression */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Confirmer la suppression"
        message={`Voulez-vous vraiment supprimer ${userToDelete?.prenom} ${userToDelete?.nom} ?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        confirmLabel="Supprimer"
      />

      {/* Confirmation de changement de rôle */}
      <ConfirmDialog
        isOpen={confirmRoleChangeOpen}
        title="Confirmer le changement de rôle"
        message={`Voulez-vous vraiment changer le rôle de ${userToPromote?.prenom} ${userToPromote?.nom} en ${pendingRole} ? Cette action est irréversible.`}
        onCancel={() => {
          setConfirmRoleChangeOpen(false);
          setUserToPromote(null);
          setPendingRole(null);
        }}
        onConfirm={handleConfirmRoleChange}
        confirmLabel="Confirmer"
      />
    </div>
  );
};

export default UserList;