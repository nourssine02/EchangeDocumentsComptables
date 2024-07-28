import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/reset-password', { token, password });
      alert('Password has been reset successfully.');
    } catch (error) {
      alert('Error resetting password.');
    }
  };

  return (
    
    <form onSubmit={handleSubmit}>
      <h2>Reset Password</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter new password"
        required
      />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPassword;