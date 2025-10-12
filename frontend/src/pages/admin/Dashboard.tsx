import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, FileText, Users, Mail, LogOut, Shield, ExternalLink, Settings, Wrench, UserCircle } from 'lucide-react';
import { getProjects } from '../../services/api';
import type { Project } from '../../types';

const Dashboard = () => {
  const { admin, logout, token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tokenInfo, setTokenInfo] = useState<{ expiresIn: string; isValid: boolean } | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    residential: 0,
    commercial: 0,
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const API_BASE_URL = API_URL.replace('/api', '');

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  // Decode token to check expiration
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiresAt = new Date(payload.exp * 1000);
        const now = new Date();
        const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        setTokenInfo({
          expiresIn: daysLeft > 0 ? `${daysLeft} days` : 'Expired',
          isValid: daysLeft > 0,
        });
      } catch (error) {
        setTokenInfo({ expiresIn: 'Invalid', isValid: false });
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        setStats({
          total: data.length,
          residential: data.filter(p => p.category === 'residential').length,
          commercial: data.filter(p => p.category === 'commercial').length,
        });
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {admin?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              {tokenInfo && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  tokenInfo.isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  <Shield className="w-4 h-4" />
                  <span>Session: {tokenInfo.expiresIn}</span>
                </div>
              )}
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Site
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Projects</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Residential</p>
                <p className="text-3xl font-bold">{stats.residential}</p>
              </div>
              <Users className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Commercial</p>
                <p className="text-3xl font-bold">{stats.commercial}</p>
              </div>
              <Mail className="w-12 h-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/admin/projects/new"
              className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-6 h-6 text-gray-600" />
              <div>
                <p className="font-medium">Add New Project</p>
                <p className="text-sm text-gray-600">Upload photos from the field</p>
              </div>
            </Link>

            <Link
              to="/admin/projects"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-6 h-6 text-gray-600" />
              <div>
                <p className="font-medium">Manage Projects</p>
                <p className="text-sm text-gray-600">Edit or delete existing projects</p>
              </div>
            </Link>

            <Link
              to="/admin/settings"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-6 h-6 text-gray-600" />
              <div>
                <p className="font-medium">Site Settings</p>
                <p className="text-sm text-gray-600">Update hero image/video & text</p>
              </div>
            </Link>

            <Link
              to="/admin/services"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <Wrench className="w-6 h-6 text-gray-600" />
              <div>
                <p className="font-medium">Manage Services</p>
                <p className="text-sm text-gray-600">Add or edit service offerings</p>
              </div>
            </Link>

            <Link
              to="/admin/team"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <UserCircle className="w-6 h-6 text-gray-600" />
              <div>
                <p className="font-medium">Manage Team</p>
                <p className="text-sm text-gray-600">Add or edit team members</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Recent Projects</h2>
          <div className="space-y-4">
            {projects.slice(0, 5).map((project) => (
              <div
                key={project._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {project.images[0] && (
                    <img
                      src={getImageUrl(project.images[0])}
                      alt={project.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-gray-600 capitalize">{project.category}</p>
                  </div>
                </div>
                <Link
                  to={`/admin/projects/${project._id}/edit`}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
