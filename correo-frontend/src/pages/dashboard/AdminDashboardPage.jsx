import { useEffect, useMemo, useState } from 'react';
import { getMyEmails } from '../../api/emailApi';
import { meRequest } from '../../api/authApi';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';

export default function AdminDashboardPage() {
  const [emails, setEmails] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [emailData, userData] = await Promise.all([getMyEmails(), meRequest()]);
      setEmails(emailData);
      setProfile(userData);
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const average = emails.length
      ? `${(emails.reduce((acc, email) => acc + email.confidence, 0) / emails.length * 100).toFixed(2)}%`
      : '0%';

    return {
      processed: emails.length,
      categories: new Set(emails.map((item) => item.predicted_category)).size,
      average,
    };
  }, [emails]);

  const categorySummary = useMemo(() => {
    const map = new Map();
    emails.forEach((email) => {
      map.set(email.predicted_category, (map.get(email.predicted_category) || 0) + 1);
    });
    return Array.from(map.entries()).map(([category, total]) => ({ category, total }));
  }, [emails]);

  return (
    <DashboardLayout title="Dashboard administrador" subtitle="Monitorea el sistema y prepara la integración de métricas administrativas reales.">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Correos procesados" value={stats.processed} />
        <StatCard label="Categorías detectadas" value={stats.categories} />
        <StatCard label="Precisión estimada" value={stats.average} hint="Basada en la confianza promedio del modelo" />
      </section>

      <Card title="Resumen del usuario administrador" subtitle="Datos disponibles hoy desde el backend actual.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Nombre</p>
            <p className="mt-1 font-semibold text-slate-900">{profile?.name || 'Sin dato'}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Correo</p>
            <p className="mt-1 font-semibold text-slate-900">{profile?.email || 'Sin dato'}</p>
          </div>
        </div>
      </Card>

      <Card title="Distribución de clasificaciones" subtitle="Vista resumida de las categorías almacenadas en la base de datos.">
        <div className="flex flex-wrap gap-3">
          {categorySummary.length === 0 ? (
            <p className="text-sm text-slate-500">Aún no hay datos para mostrar.</p>
          ) : (
            categorySummary.map((item) => (
              <div key={item.category} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <Badge color="blue">{item.category}</Badge>
                  <span className="text-sm text-slate-600">{item.total} correos</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card title="Próximos endpoints recomendados" subtitle="Para dejar el panel administrativo realmente completo.">
        <ul className="space-y-3 text-sm text-slate-600">
          <li>GET /api/v1/admin/users</li>
          <li>GET /api/v1/admin/stats</li>
          <li>GET /api/v1/admin/classifier-metrics</li>
          <li>POST /api/v1/emails/{id}/feedback</li>
        </ul>
      </Card>
    </DashboardLayout>
  );
}
