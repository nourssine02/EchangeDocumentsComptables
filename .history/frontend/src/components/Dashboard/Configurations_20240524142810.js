import axios from "axios";
import React, { useEffect, useState } from "react";

const Configurations = () => {
  const [taxRates, setTaxRates] = useState([]);
  const [newRate, setNewRate] = useState("");
  const [editingRate, setEditingRate] = useState(null);
  const [updatedRate, setUpdatedRate] = useState("");

  const fetchTaxRates = async () => {
    try {
      const response = await axios.get("http://localhost:5000/taux_retenue_source");
      setTaxRates(response.data);
    } catch (error) {
      console.error("Error fetching tax rates:", error);
    }
  };

  useEffect(() => {
    fetchTaxRates();
  }, []);

  const addTaxRate = async () => {
    try {
      await axios.post("http://localhost:5000/taux_retenue_source", {
        taux: newRate,
      });
      setNewRate("");
      fetchTaxRates();
    } catch (error) {
      console.error("Error adding tax rate:", error);
    }
  };

  const modifTaxRate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/taux_retenue_source/modif/${id}`, {
        taux: updatedRate,
      });
      setEditingRate(null);
      setUpdatedRate("");
      fetchTaxRates();
    } catch (error) {
      console.error("Error modifying tax rate:", error);
    }
  };

  const toggleTaxRate = async (id, active) => {
    try {
      await axios.put(`http://localhost:5000/taux_retenue_source/${id}`, {
        active: !active,
      });
      fetchTaxRates();
    } catch (error) {
      console.error("Error toggling tax rate:", error);
    }
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <br />
                <h1>Taux de Retenue à la Source</h1>
                <br />
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Taux de la retenue à la source</label>
                    <input
                      type="text"
                      value={newRate}
                      onChange={(e) => setNewRate(e.target.value)}
                      className="form-control"
                      placeholder="Nouveau taux de la retenue à la source"
                    />
                  </div>
                  <button onClick={addTaxRate} className="btn btn-info">
                    Ajouter
                  </button>
                </div>
                <br />
                <div className="table-responsive pt-3">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Taux</th>
                        <th>Actif</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taxRates.map((rate) => (
                        <tr key={rate.id}>
                          <td>
                            {editingRate === rate.id ? (
                              <input
                                type="text"
                                value={updatedRate}
                                onChange={(e) => setUpdatedRate(e.target.value)}
                                className="form-control"
                              />
                            ) : (
                              `${rate.taux}%`
                            )}
                          </td>
                          <td>{rate.active ? "Oui" : "Non"}</td>
                          <td>
                            <input
                              type="checkbox"
                              checked={rate.active}
                              onChange={() => toggleTaxRate(rate.id, rate.active)}
                              className="form-check-input"
                            />
                            &nbsp;&nbsp;
                            {editingRate === rate.id ? (
                              <>
                              <button
                                onClick={() => modifTaxRate(rate.id)}
                                className="btn btn-success btn-sm"
                              >
                                Enregistrer
                              </button>
                              
                              <button
                              onClick={() => modifTaxRate(rate.id)}
                              className="btn btn-success btn-sm"
                            >
                              Enregistrer
                            </button>
                            </>

                            ) : (
                              <button
                                onClick={() => {
                                  setEditingRate(rate.id);
                                  setUpdatedRate(rate.taux); // Charger la valeur existante
                                }}
                                className="btn btn-warning btn-sm"
                              >
                                Modifier
                              </button>
                            )}
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
    </div>
  );
};

export default Configurations;