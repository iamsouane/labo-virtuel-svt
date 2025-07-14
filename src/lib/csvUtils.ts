// src/lib/csvUtils.ts

import type { ResultatEleve } from "../types"; // adapte selon où tu définis ce type

export function convertToCSV(results: ResultatEleve[]): string {
  const headers = [
    "Élève prénom",
    "Élève nom",
    "Classe",
    "Quiz",
    "Note",
    "Total questions",
    "Temps total (s)",
    "Terminé le",
  ];

  const rows = results.map((res) => {
    const totalQuestions = Object.keys(res.reponses ?? {}).length;
    const totalTime =
      typeof res.time_spent === "number"
        ? res.time_spent
        : Object.values(res.reponses ?? {}).reduce((acc, val) => acc + (val.timeSpent ?? 0), 0);
    const completedDate = new Date(res.completed_at).toLocaleString();

    return [
      res.eleve_prenom,
      res.eleve_nom,
      res.eleve_classe,
      res.quiz_title,
      res.note?.toString() ?? "",
      totalQuestions.toString(),
      totalTime.toString(),
      completedDate,
    ].map((field) => `"${field.replace(/"/g, '""')}"`); // échappe les guillemets
  });

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}