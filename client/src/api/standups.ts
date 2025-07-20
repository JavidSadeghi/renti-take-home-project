import api from './axios';

export interface StandupData {
  yesterday: string;
  today: string;
  blockers?: string;
}

export interface Standup {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  yesterday: string;
  today: string;
  blockers?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamStandup {
  user: {
    _id: string;
    username: string;
    email: string;
  };
  standup: Standup | null;
}

export interface HistoryResponse {
  standups: Standup[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const createOrUpdateStandup = async (data: StandupData): Promise<Standup> => {
  const response = await api.post('/standups', data);
  return response.data;
};

export const getTodayStandup = async (): Promise<Standup | null> => {
  const response = await api.get('/standups/today');
  return response.data;
};

export const getTeamStandups = async (date?: string): Promise<TeamStandup[]> => {
  const params = date ? { date } : {};
  const response = await api.get('/standups/team', { params });
  return response.data;
};

export const getUserHistory = async (
  page = 1,
  limit = 10,
  startDate?: string,
  endDate?: string
): Promise<HistoryResponse> => {
  const params: any = { page, limit };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  const response = await api.get('/standups/history', { params });
  return response.data;
};

export const getStandupsByDate = async (date: string): Promise<Standup[]> => {
  const response = await api.get(`/standups/date/${date}`);
  return response.data;
}; 