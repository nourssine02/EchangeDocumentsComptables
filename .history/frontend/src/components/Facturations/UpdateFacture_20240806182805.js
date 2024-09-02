import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

const UpdateFacture = ({isSidebarOpen}) => {
  const initialFactureState = {
    date_facture: new Date().toISOString().split("T")[0],
    num_facture: "",
    code_tiers: "",
    tiers_saisie: "",
    reference_livraison: "",
    montant_HT_facture: "",
    FODEC_sur_facture: "",
    TVA_facture: "",
    timbre_facture: "",
    autre_montant_facture: "",
    montant_total_facture: "",
    observations: "",
    document_fichier: "",
    etat_payement: false, // Default to false
  };



  const [facture, setFacture] = useState(initialFactureState);
  const [codeTiers, setCodeTiers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [refLivraisons, setRefLivraisons] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchFacture = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/facture/${id}`);
        setFacture(res.data.facture);
        setFamilles(res.data.familles);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFacture();
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
    const fetchRefLivraisons = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/reference_livraison"
        );
        setRefLivraisons(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRefLivraisons();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/articles");
        setArticles(
          res.data.map((article) => ({
            value: article.article,
            label: article.article,
            quantite: article.quantite,
            prix: article.prix,
          }))
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchArticles();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFacture((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "code_tiers") {
      const selectedCodeTier = codeTiers.find(
        (codeTier) => codeTier.code_tiers === value
      );
      if (selectedCodeTier) {
        setFacture((prev) => ({
          ...prev,
          code_tiers: selectedCodeTier.code_tiers,
          tiers_saisie: selectedCodeTier.identite,
        }));
      } else {
        setFacture((prev) => ({
          ...prev,
          code_tiers: "",
          tiers_saisie: "",
        }));
      }
    } else if (name === "document_fichier" && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        const url = `data:image/png;base64,${base64Data}`;
        setFacture((prev) => ({ ...prev, document_fichier: url }));
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setFacture((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChangeArticle = (selectedOption, index) => {
    const updatedFamilles = [...familles];
    updatedFamilles[index].article = selectedOption.value;
    updatedFamilles[index].prix = selectedOption.prix;
    updatedFamilles[index].quantite = selectedOption.quantite;
    setFamilles(updatedFamilles);
  };

  const addFamille = () => {
    setFamilles([
      ...familles,
      {
        famille: "",
        sous_famille: "",
        article: "",
        quantite: 0,
        prix: 0,
      },
    ]);
  };

  const removeFamille = (index) => {
    const updatedFamilles = [...familles];
    updatedFamilles.splice(index, 1);
    setFamilles(updatedFamilles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { facture, familles };

    axios
      .put(`http://localhost:5000/facture/${id}`, data)
      .then((response) => {
        console.log(response.data.message);
        alert("Données modifiées avec succès.");
        navigate("/facturations");
      })
      .catch((error) => {
        console.error("Erreur lors de la modification du Facture :", error);
        if (error.response) {
          console.error("Contenu de la réponse :", error.response.data);
        } else {
          console.error("Aucune réponse reçue.");
        }
        alert("Erreur lors de la modification du Facture: " + error.message);
      });
  };

  const openImageViewer = () => {
    const imageViewerUrl = facture.document_fichier;
    const imageWindow = window.open("", "_blank");
    const img = document.createElement("img");
    img.src = imageViewerUrl;
    img.style.marginLeft = "400px";
    imageWindow.document.body.appendChild(img);
  };

  const handleCancel = () => {
    navigate("/facturations");
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
      <div className="card">
          <div className="card-body">
            <h1>Modifier une Facture</h1>
            <br />
            <form className="forms-sample" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Date de la Facture:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_facture"
                      onChange={handleChange}
                      value={facture.date_facture}
                    />
                  </div>

                  <div className="form-group">
                    <label>Code Tiers:</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control form-control-lg"
                      name="code_tiers"
                      onChange={handleChange}
                      value={facture.code_tiers}
                    >
                      <option value="" style={{ color: "black" }}>
                        Code Tiers
                      </option>
                      {codeTiers.map((codeTier) => (
                        <option
                          key={codeTier.code_tiers}
                          value={codeTier.code_tiers}
                          style={{ color: "black" }}
                        >
                          {codeTier.code_tiers}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>N° de la Facture:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="num_facture"
                      onChange={handleChange}
                      value={facture.num_facture}
                    />
                  </div>

                  <div className="form-group">
                    <label>Référence de la Livraison:</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control form-control-lg"
                      name="reference_livraison"
                      onChange={handleChange}
                      value={facture.reference_livraison}
                    >
                      <option value="" style={{ color: "black" }}>
                        Référence Livraison
                      </option>
                      {refLivraisons.map((refLivraison) => (
                        <option
                          key={refLivraison.num_BL}
                          value={refLivraison.num_BL}
                          style={{ color: "black" }}
                        >
                          {refLivraison.num_BL}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Tiers à Saisir:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tiers_saisie"
                      onChange={handleChange}
                      value={facture.tiers_saisie}
                    />
                  </div>
                  <div className="form-group">
                    <label>TVA de la Facture:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="TVA_facture"
                        onChange={handleChange}
                        value={facture.TVA_facture}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Montant HT de la Facture:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="montant_HT_facture"
                        onChange={handleChange}
                        value={facture.montant_HT_facture}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>FODEC sur la Facture:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="FODEC_sur_facture"
                        onChange={handleChange}
                        value={facture.FODEC_sur_facture}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Document / Fichier à Insérer :</label>
                    <input
                      type="file"
                      className="form-control"
                      name="document_fichier"
                      onChange={handleChange}
                    />
                    <br />
                    {facture.document_fichier && (
                      <img
                        src={facture.document_fichier}
                        alt="Facture Document"
                        style={{
                          width: "100px",
                          height: "auto",
                          cursor: "pointer",
                        }}
                        onClick={openImageViewer}
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <label>Etat de paiement</label>
                    <div>
                      <input
                        type="checkbox"
                        name="etat_payement"
                        checked={facture.etat_payement}
                        onChange={handleChange}
                        value={facture.etat_payement}
                      />
                      <span
                        style={{
                          color: facture.etat_payement ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {facture.etat_payement ? " Payée" : " Non Payée"}
                      </span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Observations:</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      onChange={handleChange}
                      rows={5}
                      cols={50}
                      value={facture.observations}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Timbre sur la Facture:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="timbre_facture"
                        onChange={handleChange}
                        value={facture.timbre_facture}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Autre montant sur la Facture:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="autre_montant_facture"
                        onChange={handleChange}
                        value={facture.autre_montant_facture}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Montant Total de la Facture:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="montant_total_facture"
                        onChange={handleChange}
                        value={facture.montant_total_facture}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                  </div>
                </div>
              </div>

              <br></br>
              <br></br>
              <hr />
              <legend>Familles</legend>
              {familles.map((famille, index) => (
                <div key={index} className="mb-3 border p-3">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group mb-3">
                        <label>Article:</label>
                        <Select
                          options={articles}
                          onChange={(selectedOption) =>
                            handleChangeArticle(selectedOption, index)
                          }
                          value={articles.find(
                            (article) => article.value === famille.article
                          )}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group mb-3">
                        <label>Quantité:</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          name="quantite"
                          value={famille.quantite}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group mb-3">
                        <label>Prix:</label>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            name="prix"
                            value={famille.prix}
                            readOnly
                          />
                          &nbsp;
                          <span>DT</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group d-flex align-items-end">
                        <button
                          onClick={() => removeFamille(index)}
                          type="button"
                          className="btn btn-danger btn-sm me-2"
                        >
                          <i className="bi bi-trash"></i> Supprimer
                        </button>
                        &nbsp;
                        {index === familles.length - 1 && (
                          <button
                            onClick={addFamille}
                            type="button"
                            className="btn btn-success btn-sm"
                          >
                            <i className="bi bi-plus-circle"></i> Ajouter
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <br></br>
              <div
                className="d-flex justify-content-center"
              >
                <button
                  type="submit"
                  className="btn btn-primary mr-2"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  className="btn btn-light"
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

export default UpdateFacture;