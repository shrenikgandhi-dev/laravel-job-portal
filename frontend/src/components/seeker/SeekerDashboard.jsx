import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApprovedJobs } from '../../services/api';

export default function SeekerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await getApprovedJobs();
      setJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Browse Jobs</h1>

      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No jobs available</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{job.employer?.name}</p>
              <p className="text-sm text-gray-500 mb-2">{job.category?.name}</p>
              <p className="text-lg font-bold text-indigo-600 mb-4">${job.salary}</p>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {job.description}
              </p>
              <Link
                to={`/jobs/${job.id}`}
                className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
