import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import { useAuth } from '../../hooks/useAuth';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(form);
      if (user.role.name === 'admin') navigate('/admin');
      else if (user.role.name === 'secretaria') navigate('/secretaria');
      else navigate('/usuario');
    } catch (err) {
      setError(err?.response?.data?.detail || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input label="Correo electrónico" name="email" type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={handleChange} required />
      <Input label="Contraseña" name="password" type="password" placeholder="********" value={form.password} onChange={handleChange} required />
      {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Ingresando...' : 'Iniciar sesión'}
      </Button>
    </form>
  );
}
