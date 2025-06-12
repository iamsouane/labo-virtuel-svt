const SimulationPollution = () => {
  return (
    <section
      id="pollution"
      className="py-20 px-6 bg-gray-50 max-w-7xl mx-auto text-center rounded-xl shadow-lg"
    >
      <h2 className="text-3xl font-semibold mb-6">Simulation : Pollution de l'air</h2>
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src="https://lab.concord.org/embeddable.html#interactives/air-pollution/air-pollution-master.json"
          allowFullScreen
          className="w-full h-full rounded-lg border border-gray-300"
          title="Simulation Pollution de l'air"
        />
      </div>
      <p className="mt-4 text-gray-700 max-w-xl mx-auto">
        Explore comment les activités humaines influencent la pollution de l'air à travers cette simulation interactive.
        Ajuste les paramètres pour voir les effets sur la qualité de l’air dans différents environnements.
      </p>
    </section>
  );
};

export default SimulationPollution;
