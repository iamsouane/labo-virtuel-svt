const ControlButtons = ({
  setControl,
}: {
  control: 'play' | 'pause' | 'reset';
  setControl: React.Dispatch<React.SetStateAction<'play' | 'pause' | 'reset'>>;
}) => (
  <div className="flex justify-center gap-4">
    <button
      onClick={() => setControl('play')}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      ▶️ Démarrer
    </button>
    <button
      onClick={() => setControl('pause')}
      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
    >
      ⏸ Pause
    </button>
    <button
      onClick={() => setControl('reset')}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      🔁 Réinitialiser
    </button>
  </div>
);

export default ControlButtons;