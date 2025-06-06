import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Accueil from './pages/Accueil';
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Accueil />
            </MainLayout>
          }
        />
        {/* Tu pourras ajouter d'autres routes ici */}
      </Routes>
    </Router>
  );
}

export default App;