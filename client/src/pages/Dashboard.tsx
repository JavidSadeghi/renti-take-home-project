import { useState, useEffect } from 'react';
import { createOrUpdateStandup, getTodayStandup } from '../api/standups';
import type { StandupData, Standup } from '../api/standups';

const Dashboard: React.FC = () => {
  const [formData, setFormData] = useState<StandupData>({
    yesterday: '',
    today: '',
    blockers: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [existingStandup, setExistingStandup] = useState<Standup | null>(null);

  useEffect(() => {
    fetchTodayStandup();
  }, []);

  const fetchTodayStandup = async () => {
    try {
      setLoading(true);
      const standup = await getTodayStandup();
      if (standup) {
        setExistingStandup(standup);
        setFormData({
          yesterday: standup.yesterday,
          today: standup.today,
          blockers: standup.blockers || '',
        });
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { msg?: string } } };
      setError(error.response?.data?.msg || 'Failed to fetch today\'s standup');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await createOrUpdateStandup(formData);
      setSuccess(existingStandup ? 'Standup updated successfully!' : 'Standup created successfully!');
      await fetchTodayStandup(); // Refresh the data
    } catch (err: unknown) {
      const error = err as { response?: { data?: { msg?: string } } };
      setError(error.response?.data?.msg || 'Failed to save standup');
    } finally {
      setSaving(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Daily Standup</h1>
            <p className="text-gray-600">{today}</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="yesterday" className="block text-sm font-medium text-gray-700 mb-2">
                What did you do yesterday?
              </label>
              <textarea
                id="yesterday"
                name="yesterday"
                rows={4}
                required
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Describe what you accomplished yesterday..."
                value={formData.yesterday}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="today" className="block text-sm font-medium text-gray-700 mb-2">
                What will you do today?
              </label>
              <textarea
                id="today"
                name="today"
                rows={4}
                required
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Describe what you plan to accomplish today..."
                value={formData.today}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="blockers" className="block text-sm font-medium text-gray-700 mb-2">
                Any blockers or challenges?
              </label>
              <textarea
                id="blockers"
                name="blockers"
                rows={3}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Describe any blockers or challenges you're facing (optional)..."
                value={formData.blockers}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : existingStandup ? 'Update Standup' : 'Submit Standup'}
              </button>
            </div>
          </form>

          {existingStandup && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Last updated: {new Date(existingStandup.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
