import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddReglement.css";

const UpdateReglement = ({ isSidebarOpen }) => {
  const { id } = useParams();

  const initialReglementState = {
    date_saisie: "",
    code_tiers: "",
    tiers_saisie: "",
    montant_brut: "",
    base_retenue_source: "",
    taux_retenue_source: "",
    montant_retenue_source: "",
    montant_net: "",
    observations: "",
  };

  const initialPayementState = {
    modalite: "",
    num: "",
    banque: "",
    date_echeance: "",
    montant: "",
  };

  const initialPieceState = {
    num_piece_a_regler: "",
    date_piece_a_regler: "",
    montant_piece_a_regler: "",
    document_fichier: "",
  };

  const [reglement, setReglement] = useState(initialReglementState);
  const [payements, setPayements] = useState([initialPayementState]);
  const [pieces, setPieces] = useState([initialPieceState]);
  const [codeTiers, setCodeTiers] = useState([]);
  const [taux, setTaux] = useState([]);
  const [activeTab, setActiveTab] = useState("payements");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/reglements_emis/${id}`
        );
        const { reglement, payements, pieces } = response.data;
        setReglement(reglement);
        setPayements(payements.length ? payements : [initialPayementState]);
        setPieces(pieces.length ? pieces : [initialPieceState]);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("An error occurred while fetching data. Please try again.");
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchCodeTiers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/code_tiers");
        setCodeTiers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCodeTiers();
  }, []);

  useEffect(() => {
    const fetchTaux = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/taux_retenue_source/active"
        );
        setTaux(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTaux();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "code_tiers") {
      const selectedCodeTier = codeTiers.find(
        (codeTier) => codeTier.code_tiers === value
      );
      if (selectedCodeTier) {
        setReglement((prev) => ({
          ...prev,
          code_tiers: selectedCodeTier.code_tiers,
          tiers_saisie: selectedCodeTier.identite,
        }));
      } else {
        setReglement((prev) => ({
          ...prev,
          code_tiers: "",
          tiers_saisie: "",
        }));
      }
    } else {
      setReglement({ ...reglement, [name]: value });
    }
  };

  const handleChangePayement = (e, index) => {
    const { name, value } = e.target;
    const updatedPayements = [...payements];
    updatedPayements[index][name] = value;
    setPayements(updatedPayements);
  };

  const handleChangePiece = (e, index) => {
    const { name, value, files } = e.target;
    if (name === "document_fichier") {
      handleFileChange(files, index);
    } else {
      const updatedPieces = [...pieces];
      updatedPieces[index][name] = value;
      setPieces(updatedPieces);
    }
  };

  const handleFileChange = (files, index) => {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        const url = `data:${file.type};base64,${base64Data}`;
        const updatedPieces = [...pieces];
        updatedPieces[index].document_fichier = url;
        setPieces(updatedPieces);
      };
      reader.onerror = (err) => {
        console.error("Erreur lors de la lecture du fichier:", err);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPayement = () => {
    setPayements([...payements, initialPayementState]);
  };

  const removePayement = async (index, payementId) => {
    try {
      await axios.delete(`http://localhost:5000/payements/${payementId}`);
      const updatedPayements = payements.filter((_, i) => i !== index);
      setPayements(updatedPayements);
    } catch (error) {
      console.error("Erreur lors de la suppression du payement :", error);
    }
  };

  const addPiece = () => {
    setPieces([...pieces, initialPieceState]);
  };

  const removePiece = async (index, pieceId) => {
    try {
      await axios.delete(`http://localhost:5000/pieces_a_regler/${pieceId}`);
      const updatedPieces = pieces.filter((_, i) => i !== index);
      setPieces(updatedPieces);
    } catch (error) {
      console.error("Erreur lors de la suppression du piece :", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedPayements = payements.map((payement) => ({
        ...payement,
        reglement_emis_id: id,
      }));

      const formattedPieces = pieces.map((piece) => ({
        ...piece,
        reglement_emis_id: id,
      }));

      await axios.put(`http://localhost:5000/reglements_emis/${id}`, {
        reglement,
        payements: formattedPayements,
        pieces: formattedPieces,
      });
      alert("Règlement mis à jour avec succès.");
      navigate("/reglements_emis");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du règlement :", error);
      alert("Erreur lors de la mise à jour du règlement.");
    }
  };

  const handleCancel = () => {
    navigate("/reglements_emis");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "payements":
        return (
          <div>
            <h3>Paiements</h3>
            {payements.map((payement, index) => (
              <div key={index} className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Modalité :</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control"
                      name="modalite"
                      onChange={(e) => handleChangePayement(e, index)}
                      value={payement.modalite}
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="Espèces">Espèces</option>
                      <option value="Chèque">Chèque</option>
                      <option value="Traite">Traite</option>
                      <option value="Virement">Virement</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Numéro :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="num"
                      onChange={(e) => handleChangePayement(e, index)}
                      value={payement.num}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Banque :</label>
                    <select
                      style={{ color: "black" }}
                      value={payement.banque}
                      name="banque"
                      className="form-control mr-3"
                      onChange={(e) => handleChangePayement(e, index)}
                    >
                      <option value="">Sélectionnez une option</option>
                      <option value="Banques locales">Banques locales</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Date d'échéance :</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_echeance"
                      onChange={(e) => handleChangePayement(e, index)}
                      value={payement.date_echeance}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant"
                      onChange={(e) => handleChangePayement(e, index)}
                      value={payement.montant}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <button
                    type="button"
                    className="btn btn-danger mt-4"
                    onClick={() => removePayement(index, payement.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-primary"
              onClick={addPayement}
            >
              Ajouter Paiement
            </button>
          </div>
        );
      case "pieces":
        return (
          <div>
            <h3>Pièces</h3>
            {pieces.map((piece, index) => (
              <div key={index} className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Numéro :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="num_piece_a_regler"
                      onChange={(e) => handleChangePiece(e, index)}
                      value={piece.num_piece_a_regler}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Date :</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_piece_a_regler"
                      onChange={(e) => handleChangePiece(e, index)}
                      value={piece.date_piece_a_regler}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant_piece_a_regler"
                      onChange={(e) => handleChangePiece(e, index)}
                      value={piece.montant_piece_a_regler}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Document :</label>
                    <input
                      type="file"
                      className="form-control"
                      name="document_fichier"
                      onChange={(e) => handleChangePiece(e, index)}
                    />
                    {piece.document_fichier && (
                      <a href={piece.document_fichier} download>
                        Télécharger le fichier
                      </a>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <button
                    type="button"
                    className="btn btn-danger mt-4"
                    onClick={() => removePiece(index, piece.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-primary"
              onClick={addPiece}
            >
              Ajouter Pièce
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <br />
            <h2>Ajouter un règlement Émis</h2>
            <form onSubmit={handleSubmit} className="forms-sample">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Date de Saisie :</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_saisie"
                      value={reglement.date_saisie}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Code tiers :</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control"
                      name="code_tiers"
                      value={reglement.code_tiers}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionnez un tiers</option>
                      {codeTiers.map((tier) => (
                        <option key={tier.id} value={tier.code_tiers}>
                          {tier.code_tiers}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Tiers saisi :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tiers_saisie"
                      value={reglement.tiers_saisie}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant brut :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant_brut"
                      value={reglement.montant_brut}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Base de retenue à la source :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="base_retenue_source"
                      value={reglement.base_retenue_source}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Taux de retenue à la source :</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control"
                      name="taux_retenue_source"
                      value={reglement.taux_retenue_source}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionnez un taux</option>
                      {taux.map((t) => (
                        <option key={t.id} value={t.taux}>
                          {t.taux}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant de la retenue à la source :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant_retenue_source"
                      value={reglement.montant_retenue_source}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant net :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant_net"
                      value={reglement.montant_net}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Observations :</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      value={reglement.observations}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="tabs-container">
                <div className="tabs">
                  <button
                    type="button"
                    className={activeTab === "payements" ? "active" : ""}
                    onClick={() => setActiveTab("payements")}
                  >
                    Paiements
                  </button>
                  <button
                    type="button"
                    className={activeTab === "pieces" ? "active" : ""}
                    onClick={() => setActiveTab("pieces")}
                  >
                    Pièces
                  </button>
                </div>
                <div className="tab-content">{renderTabContent()}</div>
              </div>
              <div 
                className="d-flex justify-content-center"
              >
              <button type="submit" className="btn btn-primary MR-2">
                Enregistrer
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Annuler
              </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateReglement;