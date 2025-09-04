
import apiClient from '@/api/http';
import { DeviceSession } from '@/types';

export const useDeviceSessionsApi = () => {
  const getActiveSessions = async (): Promise<DeviceSession[]> => {
    const response = await apiClient.get('/v1/device-sessions');
    return response.data;
  };

  const getAllSessions = async (): Promise<DeviceSession[]> => {
    const response = await apiClient.get('/v1/device-sessions/all');
    return response.data;
  };

  const revokeSession = async (deviceId: string): Promise<void> => {
    await apiClient.delete(`/v1/device-sessions/${deviceId}`);
  };

  return {
    getActiveSessions,
    getAllSessions,
    revokeSession,
  };
};
