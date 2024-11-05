import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';
import { UserForm } from './components/UserForm';
import { UserList } from './components/UserList';
import { getUsers } from './lib/notion';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setError(null);
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">ユーザー管理システム</h1>
          
          {!import.meta.env.VITE_NOTION_TOKEN && (
            <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Notion integration is not configured. Please set VITE_NOTION_TOKEN and VITE_NOTION_DATABASE_ID environment variables.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <UserForm onUserCreated={fetchUsers} />
            </div>
            <div className="md:col-span-2">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <UserList users={users} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;