import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import axiosInstance from '@/lib/axios';
import { apiClient, RoleDTO } from '@/lib/api';

const UserRegister = () => {
  const navigate = useNavigate();

  const [userFname, setUserFname] = useState("");
  const [userLname, setUserLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(true);

  // Fetch roles from backend on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const fetchedRoles = await apiClient.getRoles();
        setRoles(fetchedRoles);
      } catch (error: any) {
        console.error("Failed to fetch roles:", error);
        toast.error("Failed to load available roles");
        // Fallback to default roles if API fails
        setRoles([
          { roleId: 1, roleName: "USER" },
          { roleId: 2, roleName: "MANAGER" }
        ]);
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRoleId) {
      toast.error("Please select a role");
      return;
    }

    setLoading(true);
    
    const registrationData = {
      firstName: userFname.trim(),
      lastName: userLname.trim(),
      email: email.trim(),
      password: password.trim(),
      roleId: parseInt(selectedRoleId)
    };
    
    console.log("Sending registration data:", registrationData);
    
    try{
      const response = await axiosInstance.post("/auth/register", registrationData);
      toast.success("Registration successful! Please login with your credentials.");
      console.log("Registration successful:", response.data);
      
      // Reset form
      setUserFname("");
      setUserLname("");
      setEmail("");
      setPassword("");
      setSelectedRoleId("");
      
      // Redirect to login
      navigate("/auth/login");
    }catch(err: any){
      console.error("Registration error:", err);
      console.error("Error response:", err.response?.data);
      toast.error(`Registration failed: ${err.response?.data?.message || err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <UserPlus className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl text-foreground mb-2">User Registration</h1>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        <div className="bg-card p-8 rounded-lg card-shadow">
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <Label htmlFor="fname">First Name</Label>
              <Input
                id="fname"
                type="text"
                required
                value={userFname}
                onChange={(e) => setUserFname(e.target.value)}
                placeholder="First Name"
              />
            </div>

            <div>
              <Label htmlFor="lname">Last Name</Label>
              <Input
                id="lname"
                type="text"
                required
                value={userLname}
                onChange={(e) => setUserLname(e.target.value)}
                placeholder="Last Name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="person@example.com"
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select 
                value={selectedRoleId} 
                onValueChange={setSelectedRoleId} 
                required
                disabled={rolesLoading}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder={rolesLoading ? "Loading roles..." : "Select your role"} />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.roleId} value={role.roleId.toString()}>
                      {role.roleName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {rolesLoading && (
                <p className="text-sm text-muted-foreground mt-1">Loading available roles...</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full" 
              disabled={loading || rolesLoading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/auth/login" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
              ← Back to login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;