import axios from "axios";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import Swal from "sweetalert2";
import TiersSaisie from "../TiersSaisie";

const AddAchat = ({ isSidebarOpen }) => {
  const { user } = useContext(UserContext);

  const [achat, setAchat] = useState({
    date_saisie: new Date().toISOString().split("T")[0],
    code_tiers: "",
    tiers_saisie: "",
    type_piece: "",
    num_piece: "",
    date_piece: "",
    statut: "",
    montant_HT_piece: "",
    FODEC_piece: "",
    TVA_piece: "",
    timbre_piece: "",
    autre_montant_piece: "",
    montant_total_piece: "",
    observations: "",
    document_fichier: "",
  });

  const [errors, setErrors] = useState({});
  const [codeTiers, setCodeTiers] = useState([]);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [isNumPieceValid, setIsNumPieceValid] = useState(true); // State pour vérifier la validité de num_piece

  const [isSubmitting, setIsSubmitting] = useState(false); // State for form submission

  const navigate = useNavigate();
  const timeoutRef = useRef(null); // Ref pour gérer le debounce

  const handleModalShow = () => setShowModal(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/code_tiers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCodeTiers(response.data);
      } catch (error) {
        console.error("Error fetching code tiers:", error);
      }
    };

    fetchData();
  }, []);

  // Fonction pour vérifier l'unicité du champ num_piece (debounce)
  const checkNumPieceUniqueness = async (numPiece) => {
    if (!numPiece) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/check-num-piece/${numPiece}`
      );
      if (response.data.exists) {
        setIsNumPieceValid(false);
        setErrors((prevErrors) => ({
          ...prevErrors,
          num_piece: "N° de la Pièce déjà existant",
        }));
      } else {
        setIsNumPieceValid(true);
        setErrors((prevErrors) => ({
          ...prevErrors,
          num_piece: "",
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de num_piece:", error);
    }
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "document_fichier" && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onerror = (error) => {
        console.error("File reading error:", error);
        alert("Failed to read the file. Please try again.");
      };

      reader.onloadend = () => {
        try {
          const base64String = btoa(
            new Uint8Array(reader.result).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          setAchat((prev) => ({ ...prev, document_fichier: base64String }));
        } catch (error) {
          console.error("Base64 encoding error:", error);
          alert("Failed to encode the file. Please try again.");
        }
      };

      reader.readAsArrayBuffer(file);
    } else {
      // Mettre à jour l'état pour les autres champs
      setAchat((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);

      // Déclencher la vérification d'unicité du num_piece après un délai
      if (name === "num_piece") {
        clearTimeout(timeoutRef.current); // Annuler le timeout précédent

        timeoutRef.current = setTimeout(() => {
          checkNumPieceUniqueness(value); // Vérifier après une pause dans la saisie
        }, 500); // 500ms de délai avant de lancer la vérification
      }
    }

    // Afficher le modal lorsque `tiers_saisie` est vide
    if (name === "tiers_saisie" && value === "") {
      setShowModal(true);
    }
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "type_piece":
        error = value ? "" : "Type de la Pièce est obligatoire";
        break;
      case "statut":
        error = value ? "" : "Statut de la Pièce est obligatoire";
        break;
      case "date_piece":
        error = value ? "" : "Date de la Pièce est obligatoire";
        break;
      case "montant_total_piece":
        error =
          value && !isNaN(value)
            ? ""
            : "Montant Total doit être un nombre valide";
        break;
      case "document_fichier":
        error = value ? "" : "Document de la Pièce est obligatoire";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const axiosWithAuth = () => {
    const token = localStorage.getItem("token");

    return axios.create({
      baseURL: "http://localhost:5000",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();

    setIsSubmitting(true); // Start form submission

    // Valider tous les champs avant la soumission
    Object.keys(achat).forEach((key) => validateField(key, achat[key]));

    // Vérifier s'il y a des erreurs
    const hasErrors = Object.values(errors).some((error) => error !== "");

    // Vérifier si num_piece est valide avant de soumettre
    if (!isNumPieceValid || hasErrors) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez corriger les erreurs avant de soumettre le formulaire.",
      });
      setIsSubmitting(false); // Stop form submission if there are errors
      return;
    }

    // Soumettre les données si tout est valide
    const axiosInstance = axiosWithAuth();

    try {
      let postData = { ...achat };

      // Envoyer les données de l'achat
      await axiosInstance.post("http://localhost:5000/achats", postData);

      
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "Achat ajouté avec succès.",
      });

      // Redirection vers la page d'achats après un court délai
      setTimeout(() => {
        navigate("/achats");
      }, 2000);
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de l'ajout de l'achat.",
      });
    }
  };

  const handleCancel = () => {
    navigate("/achats");
  };


  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <h1 className="text-center" style={{ fontSize: "35px" }}>
              Ajouter un achat de biens et de Services
            </h1>
            <br />
            <br />

            <form className="forms-sample">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Date de Saisie:</label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.date_saisie && "is-invalid"
                      }`}
                      name="date_saisie"
                      onChange={handleChange}
                      value={achat.date_saisie}
                    />
                    {errors.date_saisie && (
                      <div className="invalid-feedback">
                        {errors.date_saisie}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Date de la Pièce:</label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.date_piece && "is-invalid"
                      }`}
                      name="date_piece"
                      onChange={handleChange}
                      placeholder="Date de la Pièce"
                      value={achat.date_piece}
                    />
                    {errors.date_piece && (
                      <div className="invalid-feedback">
                        {errors.date_piece}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Code Tiers:</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control"
                      name="code_tiers"
                      onChange={handleChange}
                      value={achat.code_tiers}
                    >
                      <option value="">Sélectionner le Code Tiers</option>
                      {codeTiers.map((tier) => (
                        <option
                          key={`${tier.code_tiers}`} // Utilisez une combinaison unique si nécessaire
                          value={`${tier.code_tiers}`}
                        >
                          {`${tier.code_tiers} - ${tier.identite}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>N° de la Pièce :</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.num_piece && "is-invalid"
                      }`}
                      value={achat.num_piece}
                      name="num_piece"
                      onChange={handleChange}
                      placeholder="N° de la Pièce"
                    />
                    {errors.num_piece && (
                      <div className="invalid-feedback">{errors.num_piece}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Tiers à ajouter:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tiers_saisie"
                      onChange={handleChange}
                      onClick={handleModalShow}
                      value={achat.tiers_saisie}
                      disabled={!!achat.code_tiers}
                    />
                  </div>
                  <div className="form-group">
                    <label>Type de la Pièce :</label>
                    <select
                      style={{ color: "black" }}
                      className={`form-control ${
                        errors.type_piece && "is-invalid"
                      }`}
                      name="type_piece"
                      value={achat.type_piece}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="facture">Facture</option>
                      <option value="note d'honoraire">Note d'honoraire</option>
                      <option value="bon de livraison">Bon de livraison</option>
                      <option value="quittance">Quittance</option>
                      <option value="reçu">Reçu</option>
                      <option value="contrat">Contrat</option>
                      <option value="autre">Autre</option>
                    </select>
                    {errors.type_piece && (
                      <div className="invalid-feedback">
                        {errors.type_piece}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Statut :</label>
                    <select
                      style={{ color: "black" }}
                      className={`form-control ${
                        errors.statut && "is-invalid"
                      }`}
                      name="statut"
                      value={achat.statut}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="réglée en espèces">
                        Réglée en espèces
                      </option>
                      <option value="partiellement réglée">
                        Partiellement réglée
                      </option>
                      <option value="totalement réglée">
                        Totalement réglée
                      </option>
                      <option value="non réglée">Non Réglée</option>
                    </select>
                    {errors.statut && (
                      <div className="invalid-feedback">{errors.statut}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>FODEC sur la Pièce:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="FODEC_piece"
                        onChange={handleChange}
                        value={achat.FODEC_piece}
                        placeholder="FODEC sur la Pièce"
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    
                  </div>

                  <div className="form-group">
                    <label>Montant Total de la Pièce:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.montant_total_piece && "is-invalid"
                        }`}
                        name="montant_total_piece"
                        onChange={handleChange}
                        placeholder="Montant Total de la Pièce"
                        value={achat.montant_total_piece}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.montant_total_piece && (
                      <div className="invalid-feedback">
                        {errors.montant_total_piece}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant HT de la Pièce:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="montant_HT_piece"
                        onChange={handleChange}
                        placeholder="Montant HT de la Pièce"
                        value={achat.montant_HT_piece}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    
                  </div>

                  <div className="form-group">
                    <label>Timbre sur la Pièce:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="timbre_piece"
                        onChange={handleChange}
                        placeholder="Timbre sur la Pièce"
                        value={achat.timbre_piece}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                  
                  </div>

                  <div className="form-group">
                    <label>Document / Fichier à Insérer :</label>
                    <input
                      type="file"
                      className={`form-control ${
                        errors.document_fichier && "is-invalid"
                      }`}
                      name="document_fichier"
                      onChange={handleChange}
                    />
                    {errors.document_fichier && (
                      <div className="invalid-feedback">
                        {errors.document_fichier}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>TVA sur la Pièce:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="TVA_piece"
                        onChange={handleChange}
                        placeholder="TVA sur la Pièce"
                        value={achat.TVA_piece}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    
                  </div>

                  <div className="form-group">
                    <label>Autres Montants sur la Pièce:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="autre_montant_piece"
                        onChange={handleChange}
                        placeholder="Autres Montants sur la Pièce"
                        value={achat.autre_montant_piece}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    
                  </div>

                  <div className="form-group">
                    <label>Observations:</label>
                    <textarea
                      className={`form-control ${
                        errors.observations && "is-invalid"
                      }`}
                      name="observations"
                      onChange={handleChange}
                      placeholder="Observations"
                      value={achat.observations}
                    />
                    {errors.observations && (
                      <div className="invalid-feedback">
                        {errors.observations}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <br />
              <div className="d-flex justify-content-center">
                <button className="btn btn-primary mr-2" onClick={handleClick}>
                  {isSubmitting ? "Ajout en cours..." : "Ajouter"}
                </button>
                <button className="btn btn-light" onClick={handleCancel}>
                  Annuler
                </button>
              </div>
            </form>
            <TiersSaisie showModal={showModal} setShowModal={setShowModal} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAchat;