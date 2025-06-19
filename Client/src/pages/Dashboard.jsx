import Navbar from "../components/Navbar";
import RecentActivity from "../components/RecentActivity";
import Sidebar from "../components/Sidebar";
import StatsGrid from "../components/StatsGrid";
import WelcomeBanner from "../components/WelcomeBanner";

const Dashboard = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />
      <Navbar />
      <main className="ml-64 mt-16 p-6">
        <WelcomeBanner />
        <StatsGrid />
        <RecentActivity />
      </main>
    </div>
  );
};
export default Dashboard;
