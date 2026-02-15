import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJob, applyToJob } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await getJob(id);
      setJob(response.data.data);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      setMessage('Please select a resume');
      return;
    }

    setApplying(true);
    setMessage('');

    const formData = new FormData();
    formData.append('resume', resume);

    try {
      await applyToJob(id, formData);
      setMessage('Application submitted successfully!');
      setResume(null);
      setTimeout(() => navigate('/applications'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <DashboardLayout><div>Loading...</div></DashboardLayout>;
  if (!job) return <DashboardLayout><div>Job not found</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
          <div className="flex items-center text-sm text-gray-600 space-x-4 mb-4">
            <span>{job.employer?.name}</span>
            <span>•</span>
            <span>{job.category?.name}</span>
            <span>•</span>
            <span className="text-lg font-bold text-indigo-600">${job.salary}</span>
          </div>
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>
        </div>

        {user?.role === 'seeker' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Apply for this Job</h2>
            {message && (
              <div className={`mb-4 px-4 py-3 rounded ${
                message.includes('success') 
                  ? 'bg-green-50 border border-green-200 text-green-600' 
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}>
                {message}
              </div>
            )}
            <form onSubmit={handleApply}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Resume (PDF only)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResume(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
              <button
                type="submit"
                disabled={applying}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}

        {user?.role === 'employer' && job.applications && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Applications ({job.applications.length})
            </h2>
            {job.applications.length === 0 ? (
              <p className="text-gray-500">No applications yet</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {job.applications.map((app) => (
                  <li key={app.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{app.applicant?.name}</p>
                        <p className="text-sm text-gray-500">{app.applicant?.email}</p>
                        <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <a
                        href={`http://localhost:8000/storage/${app.resume_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                      >
                        View Resume
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
