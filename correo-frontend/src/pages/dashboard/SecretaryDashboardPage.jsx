import { useEffect, useMemo, useState } from 'react';
import { getMyEmails } from '../../api/emailApi';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import EmailTable from '../../components/dashboard/EmailTable';
import StatCard from '../../components/common/StatCard';

export default function SecretaryDashboardPage() {
  const [emails, setEmails] = useState([]);
  const [feedback, setFeedback] = useState({ emailId: '', correction: '', note: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await getMyEmails();
      setEmails(data);
    };
    load();
  }, []);

  const stats = useMemo(() => ({
    total: emails.length,
    highConfidence: emails.filter((email) => email.confidence >= 0.8).length,
    pendingReview: emails.filter((email) => email.confidence < 0.8).length,
  }), [emails]);

  const handleChange = (event) => {
    setFeedback((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('Retroalimentación registrada en frontend. Cuando el backend exponga el endpoint de feedback, aquí se conectará directamente.');
    setFeedback({ emailId: '', correction: '', note: '' });
  };

  return (
    <DashboardLayout title="Dashboard de secretaría" subtitle="Revisa la clasificación automática y prepara retroalimentación para el modelo.">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Correos revisables" value={stats.total} />
        <StatCard label="Alta confianza" value={stats.highConfidence} hint="Confianza mayor o igual al 80%" />
        <StatCard label="Pendientes de revisión" value={stats.pendingReview} hint="Candidatos para corrección manual" />
      </section>

      <EmailTable
        emails={emails}
        title="Correos clasificados para revisión"
        subtitle="Panel de apoyo para validar la categoría detectada por el clasificador."
      />

      <Card title="Corrección y retroalimentación" subtitle="Formulario preparado para conectar el futuro endpoint de feedback del clasificador.">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <Input label="ID del correo" name="emailId" value={feedback.emailId} onChange={handleChange} placeholder="Ej. 12" required />
          <Input label="Categoría corregida" name="correction" value={feedback.correction} onChange={handleChange} placeholder="PQRS / urgente / spam" required />
          <div className="md:col-span-2">
            <Input label="Observación" name="note" value={feedback.note} onChange={handleChange} placeholder="Explica por qué se corrige la clasificación" required />
          </div>
          {message && <p className="md:col-span-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">{message}</p>}
          <div className="md:col-span-2">
            <Button type="submit">Guardar retroalimentación</Button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
}
