const SimulationEnergie = () => {
  return (
    <section
      id="energie"
      className="py-20 px-6 bg-gray-50 max-w-7xl mx-auto text-center rounded-xl shadow-lg"
    >
      <h2 className="text-3xl font-semibold mb-6">Simulation : Formes et transformations de l'énergie</h2>
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src="https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_fr.html"
          allowFullScreen
          className="w-full h-full rounded-lg border border-gray-300"
          title="Simulation Formes et transformations de l'énergie"
        />
      </div>
      <p className="mt-4 text-gray-700 max-w-xl mx-auto">
        Manipule différents objets pour observer comment l’énergie thermique, cinétique et potentielle se transforme
        dans cette simulation interactive proposée par PhET.
      </p>
    </section>
  );
};

export default SimulationEnergie;
