import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './components/Home';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Incidents from './components/Incidents';
import Prisonniers from './components/Prisonniers';
import Cellules from './components/Cellules';
import Visites from './components/Visites';
import Comptes from './components/Comptes';
import DemandeVisite from './components/DemandeVisite';
import ModifierIncident from './components/ModifierIncident';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/prisonniers" element={<Prisonniers />} />
          <Route path="/cellules" element={<Cellules />} />
          <Route path="/visites" element={<Visites />} />
          <Route path="/comptes" element={<Comptes />} />
          <Route path="/visite" element={<DemandeVisite />} />
          <Route path="/incidents/:id/modifier" element={<ModifierIncident />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;