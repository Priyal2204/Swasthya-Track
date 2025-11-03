
import { Button } from "@/components/ui/button";
import { School, UserCheck, UserPlus } from "lucide-react";

interface HeaderProps {
  onLogin: () => void;
  onRegister: () => void;
}

const Header = ({ onLogin, onRegister }: HeaderProps) => {
  return (
    <header className="border-b border-blue-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/8619ed4b-321a-4650-b3dd-d44d66885783.png" 
              alt="SwasthyaTrack Logo" 
              className="h-8 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">SwasthyaTrack</h1>
              <p className="text-sm text-blue-600 hidden sm:block">Tracking Wellness, Empowering Futures</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              onClick={onLogin}
              className="text-blue-700 hover:bg-blue-50"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Login
            </Button>
            <Button 
              onClick={onRegister}
              className="medical-gradient text-white hover:opacity-90"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Register
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
