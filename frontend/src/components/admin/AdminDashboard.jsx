import { useEffect, useState } from 'react';
import { getAdminJobs, approveJob, rejectJob } from '../../services/api';

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await getAdminJobs();
      setJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveJob(id);
      setJobs(jobs.map((job) => (job.id === id ? { ...job, is_approved: true } : job)));
    } catch (error) {
      console.error('Error approving job:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectJob(id);
      setJobs(jobs.map((job) => (job.id === id ? { ...job, is_approved: false } : job)));
    } catch (error) {
      console.error('Error rejecting job:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Jobs</h1>

      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No jobs to manage</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <ul className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <li key={job.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Posted by: {job.employer?.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Category: {job.category?.name} | Salary: ${job.salary}
                    </p>
                    <div className="mt-2">
                      {job.is_approved ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!job.is_approved && (
                      <button
                        onClick={() => handleApprove(job.id)}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        Approve
                      </button>
                    )}
                    {job.is_approved && (
                      <button
                        onClick={() => handleReject(job.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
