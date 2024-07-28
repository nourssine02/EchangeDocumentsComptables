import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TotalCommandesParPeriode = () => {
  const [total, setTotal] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchTotal = async () => {
    try {
      const response = await axios.get('http://localhost:5000/total-commandes-par-periode', {
        params: { startDate, endDate }
      });
      setTotal(response.data[0].total);
    } catch (error) {
      console.error('Error fetching total commandes', error);
    }
  };

  return (
    <div>
      <h3>Total des Commandes par Période</h3>
      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      <button onClick={fetchTotal}>Fetch Total</button>
      <p>Total: {total}</p>
    </div>
  );
};

export default TotalCommandesParPeriode;