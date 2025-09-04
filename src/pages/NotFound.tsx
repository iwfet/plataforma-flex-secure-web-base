
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { clearAuthData } from "@/utils/authUtils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleReturnHome = () => {
    // If user is logged in, take them to dashboard, otherwise to login
    if (user) {
      navigate("/dashboard");
    } else {
      // Clear any potential corrupted auth data for security
      clearAuthData();
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Oops! Página não encontrada
        </p>
        <p className="text-gray-500 mb-6">
          A página que você está procurando não existe ou você não tem permissão para acessá-la.
        </p>
        <Button 
          onClick={handleReturnHome} 
          className="px-6 py-2"
        >
          {user ? "Voltar ao Dashboard" : "Ir para Login"}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
