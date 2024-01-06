import React, { useState } from 'react';
import { registerUser } from '../api';

const Registration = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [full_name, setFullName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
      full_name
    };
    try {
      const response = await registerUser(data);
      console.log('Registration successful:', response);
      // Handle post-registration logic (e.g., redirect to login)
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={full_name}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Full Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default Registration;
