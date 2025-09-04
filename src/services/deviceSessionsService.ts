
import { DeviceSession } from '@/types';
import { useDeviceSessionsApi } from '@/api/endpoints/deviceSessions';
import { useMessage } from '@/contexts/MessageContext';
import { useDeviceData } from '@/hooks/useDeviceInfo';

export const useDeviceSessionsService = () => {
  const { showSuccess, showError } = useMessage();
  const deviceSessionsApi = useDeviceSessionsApi();
  const { deviceId } = useDeviceData();

  const getActiveSessions = async (): Promise<DeviceSession[]> => {
    try {
      return await deviceSessionsApi.getActiveSessions();
    } catch (error) {
      console.error('Erro ao buscar sessões ativas:', error);
      showError('Não foi possível carregar suas sessões ativas.');
      return [];
    }
  };

  const getAllSessions = async (): Promise<DeviceSession[]> => {
    try {
      return await deviceSessionsApi.getAllSessions();
    } catch (error) {
      console.error('Erro ao buscar todas as sessões:', error);
      showError('Não foi possível carregar o histórico de sessões.');
      return [];
    }
  };

  const revokeSession = async (sessionDeviceId: string): Promise<boolean> => {
    try {
      await deviceSessionsApi.revokeSession(sessionDeviceId);
      showSuccess('Sessão revogada com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao revogar sessão:', error);
      showError('Não foi possível revogar esta sessão.');
      return false;
    }
  };

  const isCurrentDevice = (session: DeviceSession): boolean => {
    return session.deviceId === deviceId;
  };

  return {
    getActiveSessions,
    getAllSessions,
    revokeSession,
    isCurrentDevice,
  };
};
