import { Link } from 'react-router-dom';

const CTA = () => (
  <section id="footer" className="py-20 px-6 bg-green-600 text-white text-center">
    <h2 className="text-3xl font-semibold mb-6">Prêt à explorer le labo ?</h2>
    <Link
      to="/login"
      className="inline-block bg-white text-green-700 hover:bg-gray-100 font-semibold py-3 px-6 rounded-xl shadow transition"
    >
      Connexion
    </Link>
  </section>
);

export default CTA;