import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import ReactPaginate from "react-paginate";
import "./Achats.css";

const Achats = ({ isSidebarOpen }) => {
  const [achats, setAchats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const { user } = useContext(UserContext);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get("http://localhost:5000/clients");
        setClients(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const fetchAchats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/achats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            code_entreprise: selectedClient || undefined, // Ajouter le code_entreprise à la requête
          },
        });
        setAchats(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAchats();
  }, [selectedClient]); // Appel à fetchAchats chaque fois que le client est sélectionné

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handleClientChange = (e) => {
    setSelectedClient(e.target.value);
    setCurrentPage(0);
  };

  // Filtrer les achats par terme de recherche
  const filteredAchats = achats.filter((achat) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      achat.identite.toLowerCase().includes(searchTermLower) ||
      achat.code_tiers.toLowerCase().includes(searchTermLower)
    );
  });

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredAchats.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredAchats.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="titre text-center">
                  Liste des Achats de Biens et de Services
                </h2>
                <br />
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="input-group" style={{ maxWidth: "300px" }}>
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>

                  {user.role === "comptable" && (
                    <select
                      className="form-control w-auto mx-2"
                      style={{ color: "black" }}
                      value={selectedClient}
                      onChange={handleClientChange}
                    >
                      <option value="">Tous les Clients</option>
                      {clients.map((client) => (
                        <option key={client.code_entreprise} value={client.code_entreprise}>
                          {`${client.code_entreprise} - ${client.identite}`}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="table-responsive">
                  <table className="table table-sm table-hover">
                    <thead>
                      <tr>
                        {user.role === "comptable" && <th>Ajouté par</th>}
                        <th>Date de Saisie</th>
                        <th>Code Tiers</th>
                        <th>Type de Pièce</th>
                        <th>N° de Pièce</th>
                        <th>Date de Pièce</th>
                        <th>Statut</th>
                        <th>Montant Total de la Pièce</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((achat) => (
                        <tr key={achat.id}>
                          {user.role === "comptable" && <td>{achat.identite}</td>}
                          <td>{new Date(achat.date_saisie).toLocaleDateString()}</td>
                          <td>{achat.code_tiers}</td>
                          <td>{achat.type_piece}</td>
                          <td>{achat.num_piece}</td>
                          <td>{new Date(achat.date_piece).toLocaleDateString()}</td>
                          <td style={{ color: achat.statut === "non réglée" ? "red" : "green" }}>
                            {achat.statut}
                          </td>
                          <td>{achat.montant_total_piece} DT</td>
                          <td>
                            <Link to={`/detailsAchat/${achat.id}`}>
                              <button type="button" className="btn btn-primary">
                                Détails
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-center mt-5">
                  <ReactPaginate
                    previousLabel={"← Précédent"}
                    nextLabel={"Suivant →"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination justify-content-center"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"active"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achats;