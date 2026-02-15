import { useAuth } from '../contexts/AuthContext';
import EmployerDashboard from '../components/employer/EmployerDashboard';
import SeekerDashboard from '../components/seeker/SeekerDashboard';
import AdminDashboard from '../components/admin/AdminDashboard';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function Dashboard() {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'employer':
        return <EmployerDashboard />;
      case 'seeker':
        return <SeekerDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>;
}
