// src/components/admin/UpcomingSimulations.tsx
import { Calendar } from "lucide-react";

type SimulationPreview = {
  id: string;
  titre: string;
  date: string;
  imageUrl: string;
};

const simulationsAVenir: SimulationPreview[] = [
  {
    id: "facteurs-edaphiques",
    titre: "Facteurs édaphiques",
    date: "2025-08-12",
    imageUrl: "/edaphique.jpg", // corrigé : enlever "public"
  },
  {
    id: "ecosysteme-equilibre",
    titre: "Évolution d’un écosystème",
    date: "2025-08-06",
    imageUrl: "/ecosystem.jpg",
  },
  {
    id: "especes-variation",
    titre: "Espèce et variation",
    date: "2025-08-14",
    imageUrl: "/espece.jpg",
  },
];

export default function UpcomingSimulations() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-heading font-bold mb-6 text-dark drop-shadow-sm flex items-center gap-2">
        <Calendar className="w-6 h-6 text-primary" />
        Simulations à venir
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {simulationsAVenir.map((simu) => (
          <div
            key={simu.id}
            className="rounded-2xl overflow-hidden bg-light shadow-md hover:shadow-xl transform transition-transform duration-300 ease-in-out hover:scale-[1.04] cursor-pointer border border-gray-100"
          >
            <img
              src={simu.imageUrl}
              alt={simu.titre}
              className="w-full h-40 object-cover rounded-t-2xl"
              loading="lazy"
            />
            <div className="flex flex-col items-center justify-center text-center p-5 space-y-2 h-32">
              <h3 className="text-lg font-semibold text-primary font-heading">
                {simu.titre}
              </h3>
              <p className="text-sm text-gray-600 leading-snug">
                Prévue le :{" "}
                <span className="font-medium text-dark">
                  {new Date(simu.date).toLocaleDateString("fr-FR", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}