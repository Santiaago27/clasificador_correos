import { useEffect, useMemo, useState } from 'react';
import { getMicrosoftAccounts, getMicrosoftConnectUrl, disconnectMicrosoftAccount } from '../../api/microsoftApi';
import { getMyEmails } from '../../api/emailApi';
import DashboardLayout from '../../layouts/DashboardLayout';
import ConnectedAccounts from '../../components/dashboard/ConnectedAccounts';
import EmailTable from '../../components/dashboard/EmailTable';
import StatCard from '../../components/common/StatCard';

export default function UserDashboardPage() {
  const [accounts, setAccounts] = useState([]);
  const [emails, setEmails] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingEmails, setLoadingEmails] = useState(true);

  const loadAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const data = await getMicrosoftAccounts();
      setAccounts(data);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const loadEmails = async () => {
    setLoadingEmails(true);
    try {
      const data = await getMyEmails();
      setEmails(data);
    } finally {
      setLoadingEmails(false);
    }
  };

  useEffect(() => {
    loadAccounts();
    loadEmails();
  }, []);

  const handleConnect = async () => {
    const data = await getMicrosoftConnectUrl();
    window.location.href = data.authorization_url;
  };

  const handleDisconnect = async (accountId) => {
    await disconnectMicrosoftAccount(accountId);
    await loadAccounts();
  };

  const stats = useMemo(() => {
    return {
      connectedAccounts: accounts.filter((item) => item.is_active).length,
      processedEmails: emails.length,
    };
  }, [accounts, emails]);

  return (
    <DashboardLayout
      title="Dashboard de usuario"
      subtitle="Administra tus cuentas Microsoft y consulta tus correos procesados."
    >
      <section className="grid gap-4 md:grid-cols-2">
        <StatCard
          label="Cuentas activas"
          value={stats.connectedAccounts}
          hint="Cuentas Microsoft vinculadas"
        />
        <StatCard
          label="Correos procesados"
          value={stats.processedEmails}
          hint="Correos almacenados en tu historial"
        />
      </section>

      <ConnectedAccounts
        accounts={accounts}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        loading={loadingAccounts}
      />

      {loadingEmails ? (
        <p className="text-sm text-slate-500">Cargando correos...</p>
      ) : (
        <EmailTable emails={emails} />
      )}
    </DashboardLayout>
  );
}