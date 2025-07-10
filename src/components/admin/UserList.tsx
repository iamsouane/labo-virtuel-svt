// src/components/admin/UserList.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";
import { notifyError, notifySuccess } from "../../lib/notifications";

const UserList = () => {
  const [users, setUsers] = useState<Profil[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      // Récupérer l'utilisateur connecté
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user.id || null;
      setCurrentUserId(userId);

      let query = supabase
        .from("users")
        .select("*")
        .neq("role", "ADMIN") // ✅ Exclure les ADMIN
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
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Chargement des utilisateurs...</p>;
  }

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Liste des utilisateurs</h2>
        <div className="flex items-center">
          <label htmlFor="roleFilter" className="mr-2 text-gray-600">Filtrer par rôle:</label>
          <select
            id="roleFilter"
            className="border rounded-md px-3 py-1.5"
            onChange={handleRoleFilterChange}
            value={roleFilter || "all"}
          >
            <option value="all">Tous les rôles</option>
            <option value="PROFESSEUR">Professeur</option>
            <option value="ELEVE">Élève</option>
          </select>
        </div>
      </div>

      {users.length === 0 ? (
        <p className="text-gray-600">Aucun utilisateur trouvé.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border-b">Nom</th>
                <th className="text-left px-4 py-2 border-b">Prénom</th>
                <th className="text-left px-4 py-2 border-b">Email</th>
                <th className="text-left px-4 py-2 border-b">Rôle</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{user.nom}</td>
                  <td className="px-4 py-2 border-b">{user.prenom}</td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                  <td className="px-4 py-2 border-b">
                    {/* Ne pas permettre à un admin de se modifier lui-même */}
                    {user.id === currentUserId ? (
                      <span>{user.role}</span>
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="border rounded-md px-2 py-1"
                      >
                        <option value="ELEVE">Élève</option>
                        <option value="PROFESSEUR">Professeur</option>
                        {/* Ne pas proposer ADMIN */}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;