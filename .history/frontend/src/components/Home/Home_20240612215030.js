// Home.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import TotalCommandesParPeriode from "../Requêtes/TotalCommandesParPeriode";

function Home({ isSidebarOpen }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Utilisateur non authentifié");
          return;
        }

        const response = await axios.get("http://localhost:5000/home", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
      } catch (error) {
        setError("Erreur lors de la récupération des données");
      }
    };

    fetchUserData();
  }, [setUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <h2>Home</h2>
        {user && (
          <div>
            <p>ID User: {user.id}</p>
            <p>Identité: {user.identite}</p>
            <p>Rôle: {user.role}</p>
          </div>
        )}
        {error && <div>{error}</div>}
        <button onClick={handleLogout}>Se déconnecter</button>
        <br />
        <hr />
        <h1>Interrogations et Requêtes</h1>
        <br />
        <TotalCommandesParPeriode />
      </div>
    </div>
  );
}

export default Home;