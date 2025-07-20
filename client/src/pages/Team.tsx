import { useState, useEffect } from 'react';
import { getTeamStandups } from '../api/standups';
import type { TeamStandup } from '../api/standups';

const Team: React.FC = () => {
  const [teamStandups, setTeamStandups] = useState<TeamStandup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchTeamStandups();
  }, [selectedDate]);

  const fetchTeamStandups = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getTeamStandups(selectedDate || undefined);
      setTeamStandups(data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { msg?: string } } };
      setError(error.response?.data?.msg || 'Failed to fetch team standups');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (username: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-gray-500',
    ];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading team standups...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Team Standups</h1>
        
        <div className="flex items-center space-x-4">
          <label htmlFor="date" className="text-sm font-medium text-gray-700">
            Filter by date:
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {selectedDate && (
            <button
              onClick={() => setSelectedDate('')}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teamStandups.map((teamMember) => (
          <div
            key={teamMember.user._id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${getRandomColor(
                    teamMember.user.username
                  )}`}
                >
                  {getInitials(teamMember.user.username)}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {teamMember.user.username}
                  </h3>
                  <p className="text-xs text-gray-500">{teamMember.user.email}</p>
                </div>
              </div>
            </div>

            <div className="px-4 py-4">
              {teamMember.standup ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Yesterday
                    </h4>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {teamMember.standup.yesterday}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Today
                    </h4>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {teamMember.standup.today}
                    </p>
                  </div>

                  {teamMember.standup.blockers && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Blockers
                      </h4>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">
                        {teamMember.standup.blockers}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Submitted: {formatDate(teamMember.standup.date)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500">No standup submitted yet</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {teamStandups.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No team members found</p>
        </div>
      )}
    </div>
  );
};

export default Team;
