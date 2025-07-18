// src/components/admin/UserList.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";
import { notifyError, notifySuccess } from "../../lib/notifications";
import { Loader2 } from "lucide-react";
import { useActivityLogger } from "../../hooks/useActivityLogger";

const UserList = () => {
  const [users, setUsers] = useState<Profil[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const logActivity = useActivityLogger();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user.id || null;
      setCurrentUserId(userId);

      let query = supabase
        .from("users")
        .select("*")
        .neq("role", "ADMIN")
        .order("created_at", { ascending: false });

      if (roleFilter) {
        query = query.eq("role", roleFilter);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error.message);
        setUsers([]);
      } else {
        setUsers(data as Profil[]);
      }

      setLoading(false);
    };

    fetchUsers();
  }, [roleFilter]);

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value === "all" ? null : e.target.value);
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

  if (loading) {
    return <div className="flex justify-center items-center text-secondary">
      <Loader2 className="animate-spin mr-2" /> Chargement des demandes...
    </div>
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
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary"
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
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full table-auto text-left text-sm">
            <thead className="bg-gray-100 text-dark font-semibold">
              <tr>
                <th className="px-4 py-3 border-b">Nom</th>
                <th className="px-4 py-3 border-b">Prénom</th>
                <th className="px-4 py-3 border-b">Email</th>
                <th className="px-4 py-3 border-b">Rôle</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-light border-b">
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
                        className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:ring-2 focus:ring-primary"
                      >
                        <option value="ELEVE">Élève</option>
                        <option value="PROFESSEUR">Professeur</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default UserList;