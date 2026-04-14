import Badge from '../common/Badge';
import Card from '../common/Card';
import EmptyState from '../common/EmptyState';

export default function EmailTable({ emails, title = 'Correos procesados', subtitle = 'Listado de correos clasificados por el sistema.' }) {
  return (
    <Card title={title} subtitle={subtitle}>
      {emails.length === 0 ? (
        <EmptyState title="Aún no hay correos clasificados" description="Cuando sincronices o clasifiques correos, aparecerán aquí." />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 font-medium">Asunto</th>
                <th className="pb-3 font-medium">Remitente</th>
                <th className="pb-3 font-medium">Categoría</th>
                <th className="pb-3 font-medium">Confianza</th>
                <th className="pb-3 font-medium">Cuenta</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email) => (
                <tr key={email.id} className="border-b border-slate-100 align-top last:border-b-0">
                  <td className="py-4 pr-4">
                    <p className="font-medium text-slate-900">{email.subject || 'Sin asunto'}</p>
                    <p className="mt-1 max-w-md text-xs text-slate-500 line-clamp-2">{email.body}</p>
                  </td>
                  <td className="py-4 pr-4 text-slate-600">{email.sender}</td>
                  <td className="py-4 pr-4"><Badge color="blue">{email.predicted_category}</Badge></td>
                  <td className="py-4 pr-4 text-slate-600">{(email.confidence * 100).toFixed(2)}%</td>
                  <td className="py-4 text-slate-600">{email.source_account}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
