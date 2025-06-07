const SimulationPhotosynthese = () => {
  return (
    <section
      id="photosynthese"
      className="py-20 px-6 bg-gray-50 max-w-7xl mx-auto text-center rounded-xl shadow-lg"
    >
      <h2 className="text-3xl font-semibold mb-6">Expérience sur la photosynthèse</h2>
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src="https://leosiiman.neocities.org/lab-rate-of-photosynthesis/photolab-individual"
          allowFullScreen
          className="w-full h-full rounded-lg border border-gray-300"
          title="Simulation Photosynthèse"
        />
      </div>
      <p className="mt-4 text-gray-700 max-w-xl mx-auto">
        Observe comment la lumière, le CO₂ et la température affectent la vitesse de photosynthèse
        à travers cette simulation interactive.
      </p>
    </section>
  );
};

export default SimulationPhotosynthese;