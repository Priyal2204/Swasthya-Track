
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { School, User, Mail, Lock, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RegisterModal = ({ open, onClose, onSuccess }: RegisterModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "teacher" as 'teacher' | 'admin',
    schoolName: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate registration - this will be replaced with Supabase
    setTimeout(() => {
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please login to continue.",
      });
      onSuccess();
      setLoading(false);
      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "teacher",
        schoolName: ""
      });
    }, 1000);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <School className="h-5 w-5 text-blue-600" />
            </div>
            <DialogTitle className="text-xl">Join SwasthyaTrack</DialogTitle>
          </div>
          <DialogDescription>
            Create your account to start tracking student health
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Dr. John Smith"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="john.smith@school.edu"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value: 'teacher' | 'admin') => updateFormData('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="schoolName">School Name</Label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="schoolName"
                type="text"
                placeholder="Springfield Elementary School"
                value={formData.schoolName}
                onChange={(e) => updateFormData('schoolName', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full medical-gradient text-white" 
            disabled={loading}
          >
            {loading ? (
              <div className="animate-pulse-medical">Creating Account...</div>
            ) : (
              <>
                <School className="mr-2 h-4 w-4" />
                Create Account
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
