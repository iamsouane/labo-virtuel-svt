// src/components/users/EtatDemandesSimulation.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";
import { ClipboardList, Clock, CheckCircle, XCircle } from "lucide-react";
import { PrimaryLoader } from "../ui/Loader";

interface Demande {
  id: string;
  simulation_titre: string;
  statut: string;
  message: string | null;
  destinataire_nom: string | null;
  created_at: string;
}

const EtatDemandesSimulation = ({ user }: { user: Profil }) => {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemandes = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("simulation_access_requests")
          .select(`
            id,
            statut,
            message,
            created_at,
            simulation:simulation_id (titre),
            destinataire:destinataire_id (prenom, nom)
          `)
          .eq("demandeur_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const mapped = (data || []).map((d: any): Demande => ({
          id: d.id,
          simulation_titre: d.simulation?.titre ?? "Inconnue",
          statut: d.statut,
          message: d.message,
          destinataire_nom: d.destinataire
            ? `${d.destinataire.prenom} ${d.destinataire.nom}`
            : null,
          created_at: d.created_at,
        }));

        setDemandes(mapped);
      } catch (err) {
        console.error("Erreur lors du chargement des demandes :", err);
        setError("Impossible de charger les demandes. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, [user.id]);

  const getStatusConfig = (statut: string) => {
    switch (statut) {
      case "EN_ATTENTE":
        return {
          text: "En attente",
          icon: <Clock className="w-4 h-4" />,
          bg: "bg-yellow-50",
          textColor: "text-yellow-700",
          border: "border-yellow-100",
        };
      case "APPROUVE":
        return {
          text: "Approuvée",
          icon: <CheckCircle className="w-4 h-4" />,
          bg: "bg-green-50",
          textColor: "text-green-700",
          border: "border-green-100",
        };
      case "REJETE":
        return {
          text: "Rejetée",
          icon: <XCircle className="w-4 h-4" />,
          bg: "bg-red-50",
          textColor: "text-red-700",
          border: "border-red-100",
        };
      default:
        return {
          text: statut,
          icon: null,
          bg: "bg-gray-50",
          textColor: "text-gray-700",
          border: "border-gray-100",
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-heading font-bold text-primary">
          Mes demandes d'accès
        </h2>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <PrimaryLoader size="lg" />
          <span className="text-dark font-medium text-lg">
            Chargement des demandes...
          </span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-red-700">
          {error}
        </div>
      ) : demandes.length === 0 ? (
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-500">Aucune demande d'accès enregistrée</p>
        </div>
      ) : (
        <div className="space-y-4">
          {demandes.map((d) => {
            const status = getStatusConfig(d.statut);
            return (
              <div
                key={d.id}
                className={`border rounded-xl p-5 ${status.border} ${status.bg} transition-all hover:shadow-sm`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-dark">
                      {d.simulation_titre}
                    </h3>

                    {d.message && (
                      <p className="text-sm text-gray-600 mt-2">{d.message}</p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-4">
                      {d.destinataire_nom && (
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Destinataire :</span> {d.destinataire_nom}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Date :</span> {formatDate(d.created_at)}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`ml-4 flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${status.textColor}`}
                  >
                    {status.icon}
                    <span>{status.text}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EtatDemandesSimulation;