import Layout from "../components/Layout";
import WelcomeBanner from "../components/WelcomeBanner";
import StatsGrid from "../components/StatsGrid";
import RecentActivity from "../components/RecentActivity";

const Dashboard = () => {
  return (
    <Layout>
      <WelcomeBanner />
      <StatsGrid />
      <RecentActivity />
    </Layout>
  );
};

export default Dashboard;
