import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DocumentDirection = ({isSidebarOpen}) => {
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/documents_direction");
        setDocuments(res.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    fetchDocuments();
  }, []);

  const VoirDocument = (id) => {
    const document = documents.find((doc) => doc.id === id);
    const imageUrl = document && document.document_fichier;
    console.log(imageUrl);

    if (imageUrl) {
      setShowModal(true);
      setModalImageUrl(imageUrl);
    } else {
      console.error("Document image URL not found");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImageUrl("");
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
      <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="titre text-center">Liste des Documents Pour la Direction </h2>
                <br />
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
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                    </div>
                  </div>
                  {user.role === "client" && (
                    <Link to="/addDocDirection">
                      <button type="button" className="btn btn-dark">
                      Ajouter un Règlement Reçus
                      </button>
                    </Link>
                  )}
                </div>
                <p className="card-description d-flex justify-content-end">
                  <Link to="/addDocDirection">
                    <button type="button" className="btn btn-dark">Ajouter un Document</button>
                  </Link>
                </p>
                <div className="table-responsive pt-3">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Nature</th>
                        <th>Désignation</th>
                        <th>Destinataire</th>
                        <th>Priorité</th>
                        <th>Observations</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id}>
                          <td>
                            {new Date(doc.date).toLocaleDateString()}
                          </td>
                          <td>{doc.nature}</td>
                          <td>{doc.designation}</td>
                          <td>{doc.destinataire}</td>
                          <td>{doc.priorite}</td>
                          <td>{doc.observations}</td>
                          <td>
                            <Link to={`/updateDocDirection/${doc.id}`}>
                              <button className="btn btn-success">Modifier</button>
                            </Link>
                            <button className="btn btn-danger ml-2" onClick={() => VoirDocument(doc.id)}>
                              Voir Document
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal" style={{ display: "block" , marginTop: "-30px"}}>
          <div className="modal-dialog modal-ms">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Document</h5>
                <button type="button" className="close" onClick={closeModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body" style={{ maxHeight: "78vh", overflowY: "auto" }}>
                <img src={modalImageUrl} alt="Document" style={{ width: "100%" }} />
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentDirection;