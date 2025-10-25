import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Edit, Trash2, LogOut, ExternalLink, Plus } from 'lucide-react';
import { getTeamMembers } from '../../services/api';
import type { TeamMember } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';

const TeamList = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const API_BASE_URL = API_URL.replace('/api', '');

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const data = await getTeamMembers();
      setTeamMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${API_URL}/team/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete team member');

      alert('Team member deleted successfully!');
      fetchTeamMembers();
    } catch (error: any) {
      alert(error.message || 'Failed to delete team member');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Site
              </a>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Team Members</h1>
            <Link
              to="/admin/team/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Team Member
            </Link>
          </div>

          {/* Team Members List */}
          {loading ? (
            <LoadingSpinner />
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No team members found.</p>
              <Link
                to="/admin/team/new"
                className="text-blue-600 hover:underline"
              >
                Add your first team member
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div
                  key={member._id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <img
                    src={getImageUrl(member.image)}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                    <p className="text-blue-600 text-sm mb-2">{member.role}</p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{member.bio}</p>
                    {member.email && (
                      <p className="text-gray-500 text-xs mb-2">{member.email}</p>
                    )}
                    <div className="flex gap-2 mt-4">
                      <Link
                        to={`/admin/team/${member._id}/edit`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(member._id, member.name)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TeamList;
