import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { completeMicrosoftCallback } from '../../api/microsoftApi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function MicrosoftCallbackPage() {
  const [status, setStatus] = useState({ loading: true, message: 'Procesando vinculación con Microsoft...' });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    const complete = async () => {
      try {
        const response = await completeMicrosoftCallback({ code, state, error });
        setStatus({ loading: false, success: true, message: response.message });
      } catch (err) {
        setStatus({
          loading: false,
          success: false,
          message: err?.response?.data?.detail || 'No se pudo completar la vinculación con Microsoft.',
        });
      }
    };

    complete();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-xl">
        <Card title="Resultado de Microsoft OAuth" subtitle="Esta vista finaliza el flujo de autorización desde el frontend.">
          <p className={`rounded-2xl px-4 py-4 text-sm ${status.success ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
            {status.message}
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/usuario"><Button>Ir al dashboard</Button></Link>
            <Link to="/login"><Button variant="secondary">Volver al login</Button></Link>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Importante: configura en tu backend la variable MICROSOFT_REDIRECT_URI apuntando a esta ruta del frontend para que el flujo funcione correctamente.
          </p>
        </Card>
      </div>
    </div>
  );
}
