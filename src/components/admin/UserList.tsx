//src/components/admin/UserList
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";
import { notifyError, notifySuccess } from "../../lib/notifications";
import { Loader2 } from "lucide-react";
import { useActivityLogger } from "../../hooks/useActivityLogger";
import ConfirmDialog from "../ui/ConfirmDialog";

const UserList = () => {
  const [users, setUsers] = useState<Profil[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<Profil | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
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
        console.error("Erreur lors de la récupération des utilisateurs :", error.message);
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

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", userId);

    if (error) {
      notifyError("Erreur lors de la mise à jour du rôle.");
    } else {
      notifySuccess("Rôle mis à jour !");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole as Profil["role"] } : u))
      );
      if (currentUserId) {
        await logActivity(currentUserId, `Modification du rôle en ${newRole}`, "UserList");
      }
    }
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
        await logActivity(currentUserId, "Suppression d’un utilisateur", "UserList", userToDelete.id);
      }
    }

    setConfirmOpen(false);
    setUserToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center text-secondary">
        <Loader2 className="animate-spin mr-2" /> Chargement des utilisateurs...
      </div>
    );
  }

  return (
    <section className="mt-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-heading font-bold text-primary">Liste des utilisateurs</h2>

        <div className="flex items-center gap-2">
          <label htmlFor="roleFilter" className="text-sm font-medium text-dark">
            Filtrer par rôle :
          </label>
          <select
            id="roleFilter"
            onChange={handleRoleFilterChange}
            value={roleFilter || "all"}
            className="rounded-xl border border-secondary px-4 py-2 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Tous les rôles</option>
            <option value="PROFESSEUR">Professeur</option>
            <option value="ELEVE">Élève</option>
          </select>
        </div>
      </div>

      {users.length === 0 ? (
        <p className="text-secondary">Aucun utilisateur trouvé.</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-light rounded-xl shadow-md">
            <table className="min-w-full table-auto text-left text-sm">
              <thead className="bg-secondary text-light font-semibold">
                <tr>
                  <th className="px-4 py-3 border-b border-secondary">Nom</th>
                  <th className="px-4 py-3 border-b border-secondary">Prénom</th>
                  <th className="px-4 py-3 border-b border-secondary">Email</th>
                  <th className="px-4 py-3 border-b border-secondary">Rôle</th>
                  <th className="px-4 py-3 border-b border-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-accent border-b border-secondary">
                    <td className="px-4 py-2">{user.nom}</td>
                    <td className="px-4 py-2">{user.prenom}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      {user.id === currentUserId ? (
                        <span className="text-gray-600">{user.role}</span>
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="rounded-md border border-secondary px-3 py-1 text-sm text-dark focus:ring-2 focus:ring-primary"
                        >
                          <option value="ELEVE">Élève</option>
                          <option value="PROFESSEUR">Professeur</option>
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {user.id === currentUserId ? (
                        <span className="text-gray-400 italic">Vous</span>
                      ) : (
                        <button
                          onClick={() => confirmDeleteUser(user)}
                          className="text-danger hover:text-dangerHover text-sm"
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
          <div className="flex justify-center items-center mt-6 gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl border border-secondary text-sm bg-white shadow hover:bg-secondary hover:text-light disabled:opacity-50"
            >
              Précédent
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} / {Math.ceil(totalUsers / pageSize)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < Math.ceil(totalUsers / pageSize) ? prev + 1 : prev
                )
              }
              disabled={currentPage >= Math.ceil(totalUsers / pageSize)}
              className="px-4 py-2 rounded-xl border border-secondary text-sm bg-white shadow hover:bg-secondary hover:text-light disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </>
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Confirmer la suppression"
        message={`Voulez-vous vraiment supprimer l'utilisateur "${userToDelete?.prenom} ${userToDelete?.nom}" ?`}
        onCancel={() => {
          setConfirmOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
};

export default UserList;