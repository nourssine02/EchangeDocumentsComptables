import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Connexion/Login';
import Register from './components/Connexion/Register';
import ProtectedRoutes from './components/Connexion/ProtectedRoutes';
import { UserProvider } from './components/Connexion/UserProvider';
import NotFoundPage from "./components/Connexion/Error Pages/NotFoundPage";
import Test from './components/Test';
const App = () => {
  return (
    <UserProvider>
      <Router>  
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<ProtectedRoutes />} />
          {/* Catch-all route for non-existent paths, outside of ProtectedRoutes */}
          <Route path="*" element={<NotFoundPage />} />
          <Route path='/test' element={<Test />}/>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;