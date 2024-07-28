import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateTier = ({ isSidebarOpen }) => {
  const { id } = useParams();

  const [tier, setTier] = useState({
    code_tiers: "",
    date_creation: "",
    type: "",
    identite: "",
    MF_CIN: "",
    tel: "",
    email: "",
    adresse: "",
    ville: "",
    observations: "",
  });

  const [errors, setErrors] = useState({
    code_tiers: "",
    date_creation: "",
    type: "",
    identite: "",
    MF_CIN: "",
    tel: "",
    email: "",
    adresse: "",
  });

  const navigate = useNavigate();

  const villesTunisie = [
    "Tunis", "Ariana", "Ben Arous", "La Manouba", "Nabeul", "Zaghouan",
    "Bizerte", "Béja", "Jendouba", "Le Kef", "Siliana", "Sousse",
    "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid",
    "Gabès", "Médenine", "Tataouine", "Gafsa", "Tozeur", "Kebili"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTier((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "code_tiers":
        error = value ? "" : "Code Tiers est obligatoire";
        break;
      case "date_creation":
        error = value ? "" : "Date de Création est obligatoire";
        break;
      case "type":
        error = value ? "" : "Type est obligatoire";
        break;
      case "identite":
        error = value ? "" : "Identité est obligatoire";
        break;
      case "MF_CIN":
        error = value ? "" : "MF/CIN est obligatoire";
        break;
      case "tel":
        error = /^\d{8,}$/.test(value)
          ? ""
          : "Le numéro de téléphone doit contenir au moins 8 chiffres";
        break;
      case "email":
        error = /\S+@\S+\.\S+/.test(value) ? "" : "Email doit être valide";
        break;
      case "adresse":
        error = value ? "" : "Adresse est obligatoire";
        break;
    
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    // Valider tous les champs avant la soumission
    const formValid = Object.keys(tier).reduce((acc, key) => {
      validateField(key, tier[key]);
      return acc && (key === 'observations' || !errors[key]);
    }, true);

    // Vérifier s'il y a des erreurs
    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (formValid && !hasErrors) {
      try {
        const fullAddress = `${tier.adresse}, ${tier.ville}, Tunisie`;
        await axios.put(`http://localhost:5000/tiers/${id}`, { ...tier, adresse: fullAddress });
        navigate("/tiers");
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/tiers/${id}`)
      .then((res) => {
        const data = res.data[0];
        setTier({
          code_tiers: data.code_tiers,
          date_creation: data.date_creation,
          type: data.type,
          identite: data.identite,
          MF_CIN: data["MF/CIN"],
          tel: data.tel,
          email: data.email,
          adresse: data.adresse.split(', ')[0],
          ville: data.adresse.split(', ')[1],
          observations: data.observations,
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleCancel = () => {
    navigate("/tiers");
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <h1>Modifier un Tier</h1>
            <br />
            <form className="forms-sample">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Date de Création:</label>
                    <input
                      type="date"
                      className={`form-control ${errors.date_creation && "is-invalid"}`}
                      name="date_creation"
                      value={tier?.date_creation ?? ""}
                      onChange={handleChange}
                    />
                    {errors.date_creation && (
                      <div className="invalid-feedback">{errors.date_creation}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Code Tiers:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.code_tiers && "is-invalid"}`}
                      name="code_tiers"
                      value={tier?.code_tiers ?? ""}
                      onChange={handleChange}
                    />
                    {errors.code_tiers && (
                      <div className="invalid-feedback">{errors.code_tiers}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email && "is-invalid"}`}
                      name="email"
                      value={tier?.email ?? ""}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Type:</label>
                    <select
                      className={`form-control ${errors.type && "is-invalid"}`}
                      name="type"
                      style={{ color: "black" }}
                      onChange={handleChange}
                    >
                      <option value={tier?.type ?? ""}>
                        {tier?.type ?? ""}
                      </option>
                      <option value="fournisseur">Fournisseur</option>
                      <option value="client">Client</option>
                      <option value="personnel">Personnel</option>
                      <option value="associe">Associé</option>
                      <option value="autre">Autre</option>
                    </select>
                    {errors.type && (
                      <div className="invalid-feedback">{errors.type}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Identité:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.identite && "is-invalid"}`}
                      name="identite"
                      value={tier?.identite ?? ""}
                      onChange={handleChange}
                    />
                    {errors.identite && (
                      <div className="invalid-feedback">{errors.identite}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Adresse:</label>
                    <select
                      className={`form-control ${errors.adresse && "is-invalid"}`}
                      name="adresse"
                      value={tier?.adresse ?? ""}
                      onChange={handleChange}
                      style={{color: "black"}}
                    >
                      <option value="">Sélectionnez une ville...</option>
                      {villesTunisie.map((ville) => (
                        <option key={ville} value={ville}>
                          {ville}
                        </option>
                      ))}
                    </select>
                    {errors.adresse && (
                      <div className="invalid-feedback">{errors.adresse}</div>
                    )}
                  </div>

                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>MF / CIN:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.MF_CIN && "is-invalid"}`}
                      name="MF_CIN"
                      value={tier?.MF_CIN ?? ""}
                      onChange={handleChange}
                    />
                    {errors.MF_CIN && (
                      <div className="invalid-feedback">{errors.MF_CIN}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Telephone :</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.tel && "is-invalid"}`}
                      name="tel"
                      value={tier?.tel ?? ""}
                      onChange={handleChange}
                    />
                    {errors.tel && (
                      <div className="invalid-feedback">{errors.tel}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Observations:</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      value={tier?.observations ?? ""}
                      onChange={handleChange}
                      rows={5}
                      cols={50}
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-primary mr-2"
                  onClick={handleClick}
                >
                  Enregistrer
                </button>
                <button className="btn btn-light" onClick={handleCancel}>
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

export default UpdateTier;