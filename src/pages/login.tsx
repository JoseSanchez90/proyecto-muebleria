// src/pages/Login.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/Authentication/authContext';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError('Correo o contraseña incorrectos');
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="grid grid-cols-2 max-w-5xl gap-8 w-full">
        {/* Logo y título */}
        <section className="flex flex-col justify-center items-center gap-4">
          <img src="/src/assets/images/logo.png" alt="Logo" className="w-92" />
          <div className="flex flex-col justify-center items-center gap-2">
            <h1 className="text-2xl font-bold">Muebles Modernos</h1>
            <p className="px-20 text-gray-600 text-sm text-center">
                Diseño y confort para tu hogar. La mejor selección de muebles minimalistas.
            </p>
          </div>
        </section>

        {/* Formulario */}
        <section className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-2">Bienvenido de nuevo</h2>
          <p className="text-gray-600 mb-6">Inicia sesión para continuar con tu compra.</p>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link to="/recuperar-contraseña" className="text-sm text-gray-600 hover:text-gray-900">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              size="lg"
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            ¿No tienes una cuenta?{' '}
            <Link to="/registro" className="text-gray-900 font-semibold hover:underline">
              Regístrate
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;