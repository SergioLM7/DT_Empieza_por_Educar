import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../context/AuthContext";


axios.defaults.withCredentials = true;

const Login = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  //const [email, setEmail] = useState('');
  //const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setLogged, setId, setRol } = useContext(AuthContext);
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


  const onSubmit = async (data) => {
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${URL}/api/empleados/login`, data);

      console.log(response.data);

      setLogged(true);
      setId(response.data.id);
      setRol(response.data.rol);

      navigate('/candidaturas');

    } catch (error) {
      reset();
      setLoading(false);
      if (error.response) {
        setError(error.response.data.message || 'Error de inicio de sesión. Por favor, inténtelo de nuevo.');
      } else if (error.request) {
        setError('No hay respuesta del servidor. Por favor, inténtelo más tarde.');
      } else {
        setError('Ocurrió un error. Por favor, inténtelo de nuevo.');
      }
    } finally {
      reset();
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className='logo-container-login'><img
        src="https://zx5f5b.n3cdn1.secureserver.net/wp-content/uploads/2019/08/logo-exe-300-01.png"
        alt="logo-exe"
        title="logo-exe"
        className="home-logo"
      /></div>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          {...register('email', {
            required: 'El email es obligatorio',
            minLength: {
              value: 6,
              message: 'El email debe tener al menos 6 caracteres'
            }, maxLength: {
              value: 100,
              message: 'El email debe tener menos de 100 caracteres'
            }
          })}
          placeholder="Email"
        />
        {errors.email && <p className="errors">{errors.email.message}</p>}

        <input
          type="password"
          {...register('password', {
            required: 'La contraseña es obligatoria',
            minLength: {
              value: 8,
              message: 'La contraseña debe tener al menos 8 caracteres'
            }
          })}
          placeholder="Password"
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Login'}
        </button>
      </form>
    </section>
  );
};

export default Login;
