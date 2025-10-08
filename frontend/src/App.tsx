import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Quote from './pages/Quote';

// Admin pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProjectNew from './pages/admin/ProjectNew';
import ProjectsList from './pages/admin/ProjectsList';
import ProjectEdit from './pages/admin/ProjectEdit';
import SiteSettings from './pages/admin/SiteSettings';
import ServicesList from './pages/admin/ServicesList';
import ServiceForm from './pages/admin/ServiceForm';
import ServiceEdit from './pages/admin/ServiceEdit';
import TeamList from './pages/admin/TeamList';
import TeamForm from './pages/admin/TeamForm';
import TeamEdit from './pages/admin/TeamEdit';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Admin routes don't need Header/Footer
  if (isAdminRoute) {
    return (
      <Routes location={location} key={location.pathname}>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/projects" element={<ProjectsList />} />
        <Route path="/admin/projects/new" element={<ProjectNew />} />
        <Route path="/admin/projects/:id/edit" element={<ProjectEdit />} />
        <Route path="/admin/settings" element={<SiteSettings />} />
        <Route path="/admin/services" element={<ServicesList />} />
        <Route path="/admin/services/new" element={<ServiceForm />} />
        <Route path="/admin/services/:id/edit" element={<ServiceEdit />} />
        <Route path="/admin/team" element={<TeamList />} />
        <Route path="/admin/team/new" element={<TeamForm />} />
        <Route path="/admin/team/:id/edit" element={<TeamEdit />} />
      </Routes>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/quote" element={<Quote />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
