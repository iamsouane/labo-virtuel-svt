const SimulationSelectionNaturelle = () => {
  return (
    <section
      id="selection-naturelle"
      className="py-20 px-6 bg-gray-50 max-w-7xl mx-auto text-center rounded-xl shadow-lg"
    >
      <h2 className="text-3xl font-semibold mb-6">Simulation : Sélection Naturelle</h2>
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src="https://phet.colorado.edu/sims/html/natural-selection/latest/natural-selection_fr.html"
          allowFullScreen
          className="w-full h-full rounded-lg border border-gray-300"
          title="Simulation Sélection Naturelle"
        />
      </div>
      <p className="mt-4 text-gray-700 max-w-xl mx-auto">
        Explore comment les populations évoluent selon les conditions environnementales
        grâce à cette simulation interactive proposée par PhET.
      </p>
    </section>
  );
};

export default SimulationSelectionNaturelle;