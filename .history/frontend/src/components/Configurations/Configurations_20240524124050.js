import React from "react";
import { Link } from "react-router-dom";

const Configurations = () => {

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-const [taxRates, setTaxRates] = useState([]);
  const [newRate, setNewRate] = useState('');

  useEffect(() => {
    fetchTaxRates();
  }, []);

  const fetchTaxRates = async () => {
    try {
      const response = await axios.get('http://localhost:3001/tax-rates');
      setTaxRates(response.data);
    } catch (error) {
      console.error('Error fetching tax rates:', error);
    }
  };

  const addTaxRate = async () => {
    try {
      await axios.post('http://localhost:3001/tax-rates', { rate: newRate });
      setNewRate('');
      fetchTaxRates();
    } catch (error) {
      console.error('Error adding tax rate:', error);
    }
  };

  const toggleTaxRate = async (id, active) => {
    try {
      await axios.put(`http://localhost:3001/tax-rates/${id}`, { active: !active });
      fetchTaxRates();
    } catch (error) {
      console.error('Error toggling tax rate:', error);
    }
  };body">
                <h2 className="titre">Liste des Configurations</h2>
                <br></br>
                <p className="card-description">
                  <Link to="/add">
                    <button type="button" className="btn btn-info">
                      Ajouter 
                    </button>
                  </Link>
                </p>
                <div className="table-responsive pt-3">
                  <table className="table table-sm"></table>
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