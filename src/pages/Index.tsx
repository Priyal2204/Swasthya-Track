
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { user, userRole, loading, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Redirect to auth page if not authenticated
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show landing page if no user role found
  if (user && !userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Header 
          onLogin={() => setShowLogin(true)}
          onRegister={() => setShowRegister(true)}
        />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Account Setup Required
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Your account needs to be set up by an administrator. Please contact your school administrator.
          </p>
          <button 
            onClick={signOut}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Show dashboard for authenticated users with role
  if (user && userRole) {
    return <Dashboard onLogout={signOut} />;
  }

  return null;
};

export default Index;
