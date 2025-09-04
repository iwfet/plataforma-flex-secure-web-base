
import React, { useState, useEffect } from 'react';
import { useDeviceSessionsService } from '@/services/deviceSessionsService';
import { DeviceSession } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Smartphone, Computer, Check, Trash2, XCircle } from 'lucide-react';
import { useMessage } from '@/contexts/MessageContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DeviceSessions = () => {
  const [activeSessions, setActiveSessions] = useState<DeviceSession[]>([]);
  const [allSessions, setAllSessions] = useState<DeviceSession[]>([]);
  const [loadingActive, setLoadingActive] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);
  const { getActiveSessions, getAllSessions, revokeSession, isCurrentDevice } = useDeviceSessionsService();
  const { showError } = useMessage();

  const fetchActiveSessions = async () => {
    setLoadingActive(true);
    try {
      const data = await getActiveSessions();
      setActiveSessions(data);
    } catch (error) {
      console.error("Erro ao carregar sessões ativas:", error);
      showError("Não foi possível carregar suas sessões ativas.");
    } finally {
      setLoadingActive(false);
    }
  };

  const fetchAllSessions = async () => {
    setLoadingAll(true);
    try {
      const data = await getAllSessions();
      setAllSessions(data);
    } catch (error) {
      console.error("Erro ao carregar todas as sessões:", error);
      showError("Não foi possível carregar o histórico de sessões.");
    } finally {
      setLoadingAll(false);
    }
  };

  useEffect(() => {
    fetchActiveSessions();
    fetchAllSessions();
  }, []);

  const handleRevoke = async (deviceId: string) => {
    const success = await revokeSession(deviceId);
    if (success) {
      setActiveSessions(prev => prev.filter(session => session.deviceId !== deviceId));
      // Refresh all sessions to show the newly revoked session
      fetchAllSessions();
    }
  };

  const getDeviceIcon = (session: DeviceSession) => {
    if (session.deviceType === 'mobile' || session.deviceType === 'tablet') {
      return <Smartphone className="h-5 w-5" />;
    }
    return <Computer className="h-5 w-5" />;
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  const renderSessionsTable = (sessions: DeviceSession[], loading: boolean, showRevoked: boolean = false) => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-t-primary rounded-full animate-spin"></div>
        </div>
      );
    }

    if (sessions.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {showRevoked 
              ? "Nenhuma sessão encontrada." 
              : "Nenhum dispositivo ativo encontrado."}
          </p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dispositivo</TableHead>
            <TableHead>Sistema Operacional</TableHead>
            <TableHead>Navegador</TableHead>
            <TableHead>Último Acesso</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.deviceId} className={!session.ativo ? "bg-muted/20" : ""}>
              <TableCell className="flex items-center gap-2">
                {getDeviceIcon(session)}
                <div>
                  <div className="font-medium">{session.deviceName}</div>
                  <div className="text-xs text-muted-foreground">{session.deviceType}</div>
                </div>
                {isCurrentDevice(session) && session.ativo && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                    <Check className="w-3 h-3 mr-1" />
                    Atual
                  </span>
                )}
              </TableCell>
              <TableCell>{session.os || "Desconhecido"}</TableCell>
              <TableCell>{session.browser || "Desconhecido"}</TableCell>
              <TableCell>{formatDateTime(session.ultimoAcesso)}</TableCell>
              <TableCell>
                {session.ativo ? (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Ativo
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center w-fit">
                    <XCircle className="w-3 h-3 mr-1" />
                    Revogado
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">
                {!session.ativo ? (
                  <Button variant="outline" size="sm" disabled>
                    Sessão revogada
                  </Button>
                ) : isCurrentDevice(session) ? (
                  <Button variant="outline" size="sm" disabled>
                    Dispositivo atual
                  </Button>
                ) : (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleRevoke(session.deviceId)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Revogar
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Dispositivos Conectados</CardTitle>
          <CardDescription>
            Gerencie seus dispositivos ativos e veja o histórico de sessões
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="active">Sessões Ativas</TabsTrigger>
              <TabsTrigger value="all">Todas as Sessões</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              {renderSessionsTable(activeSessions, loadingActive)}
            </TabsContent>
            <TabsContent value="all">
              {renderSessionsTable(allSessions, loadingAll, true)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceSessions;
