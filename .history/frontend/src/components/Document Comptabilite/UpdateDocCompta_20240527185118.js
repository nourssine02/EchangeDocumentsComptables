import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateDocCompta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date: "",
    nature: "",
    designation: "",
    destinataire: "",
    document_fichier: "",
    priorite: "",
    observations: "",
  });
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/documents_comptabilite/${id}`);
        const document = res.data;
        setForm({
          date: document.date,
          nature: document.nature,
          designation: document.designation,
          destinataire: document.destinataire,
          document_fichier: document.document_fichier,
          priorite: document.priorite,
          observations: document.observations,
        });
        setImageUrl(document.document_fichier);
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchDocument();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "document_fichier" && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        const url = `data:image/png;base64,${base64Data}`;
        setForm((prev) => ({ ...prev, document_fichier: url }));
        setImageUrl(url);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const updateDocument = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/documents_comptabilite/${id}`, form);
      alert("Données modifiées avec succès.");
      navigate("/documents_comptabilite");
    } catch (error) {
      console.error("Error updating document:", error);
      alert("Erreur lors de mettre à jour le document: " + error.message);
    }
  };

  const handleCancel = () => {
    navigate("/documents_comptabilite");
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <h1>Modifier Document Comptabilite</h1>
            <br />
            <form className="forms-sample" onSubmit={updateDocument}>
            <div className="row">
                <div className="col-md-6">  
              <div className="form-group">
                <label htmlFor="date">Date de la periode:</label>
                <input
                  id="date"
                  name="date"
                  placeholder="Date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nature">Nature du Document:</label>
                <select
                  id="nature"
                  name="nature"
                  style={{ color: "black" }}
                  className="form-control"
                  value={form.nature}
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
              </div>
</div>
<div className="col-md-6">
              <div className="form-group">
                <label htmlFor="designation">Désignation:</label>
                <input
                  id="designation"
                  name="designation"
                  type="text"
                  placeholder="Désignation"
                  value={form.designation}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="destinataire">Destinataire:</label>
                <input
                  id="destinataire"
                  name="destinataire"
                  type="text"
                  placeholder="Destinataire"
                  value={form.destinataire}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              </div>

              <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="document_fichier">Document/ Fichier à Insérer:</label>
                {imageUrl && (
                  <div>
                    <img src={imageUrl} alt="Document" style={{ width: "100px", marginBottom: "10px" }} />
                  </div>
                )}
                <input
                  id="document_fichier"
                  name="document_fichier"
                  type="file"
                  onChange={handleFileChange}
                  className="form-control"
                />
              </div>
              

              </div>

             
              </div>
              <br></br>

              <div className="button d-flex align-items-center" style={{ gap: "10px" }}>
                <button
                  type="submit"
                  className="btn btn-primary mr-2"
                  style={{ marginBottom: "5px", marginLeft: "400px" }}
                >
                  Modifier
                </button>
                <button type="button" className="btn btn-light" onClick={handleCancel}>
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

export default UpdateDocCompta;