import { useState, useEffect } from 'react';
import { getUserHistory } from '../api/standups';
import type { HistoryResponse, Standup } from '../api/standups';

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [currentPage, startDate, endDate]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getUserHistory(
        currentPage,
        10,
        startDate || undefined,
        endDate || undefined
      );
      setHistory(data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { msg?: string } } };
      setError(error.response?.data?.msg || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDateFilter = () => {
    setCurrentPage(1);
    fetchHistory();
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Standup History</h1>
        
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={handleDateFilter}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Filter
              </button>
              <button
                onClick={clearFilters}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {history?.standups && history.standups.length > 0 ? (
        <div className="space-y-6">
          {history.standups.map((standup: Standup) => (
            <div key={standup._id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {formatDate(standup.date)}
                </h3>
              </div>
              <div className="px-4 py-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Yesterday
                  </h4>
                  <p className="text-gray-900 whitespace-pre-wrap">{standup.yesterday}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Today
                  </h4>
                  <p className="text-gray-900 whitespace-pre-wrap">{standup.today}</p>
                </div>
                {standup.blockers && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Blockers
                    </h4>
                    <p className="text-gray-900 whitespace-pre-wrap">{standup.blockers}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Pagination */}
          {history.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === history.pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {((currentPage - 1) * history.pagination.itemsPerPage) + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * history.pagination.itemsPerPage, history.pagination.totalItems)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{history.pagination.totalItems}</span>{' '}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: history.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === history.pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No standup history found</p>
        </div>
      )}
    </div>
  );
};

export default History;
