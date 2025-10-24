import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Users as UsersIcon, Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import UserFormModal from "@/components/admin/UserFormModal";
import RoleFormModal from "@/components/admin/RoleFormModal";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import axiosInstance from "@/lib/axios";

// Backend User interface matching the User model
interface BackendUser {
  userId: number;
  userFname: string;
  userLname: string;
  email: string;
  passwordHash: string;
  role: BackendRole;
  createdDate: string;
  active: boolean;
  updatedDate: string;
}

// Backend Role interface matching the Role model
interface BackendRole {
  roleId: number;
  roleName: string;
}

// Frontend display interfaces
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // For form data, will be encoded in backend
  role: string;
  status: "Active" | "Inactive";
  lastLogin: string; // Will use createdDate as fallback
  createdDate: string;
  userId: number; // Keep backend ID for API calls
}

interface Role {
  id: string;
  name: string;
  description: string; // Not in backend, will be empty
  color: string; // Not in backend, will be generated
  userCount: number; // Calculated from users
  permissions: string[]; // Not implemented yet
  roleId: number; // Keep backend ID for API calls
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"user" | "role">("user");
  const [itemToDelete, setItemToDelete] = useState<User | Role | null>(null);

  // Helper function to convert backend user to frontend user
  const convertBackendUserToFrontend = (backendUser: BackendUser, roles: Role[]): User => {
    const role = roles.find(r => r.roleId === backendUser.role.roleId);
    return {
      id: `user-${backendUser.userId}`,
      firstName: backendUser.userFname,
      lastName: backendUser.userLname,
      email: backendUser.email,
      password: "", // Not displayed in UI, only used for form data
      role: role?.name || backendUser.role.roleName,
      status: backendUser.active ? "Active" : "Inactive",
      lastLogin: backendUser.createdDate.split('T')[0], // Using createdDate as fallback
      createdDate: backendUser.createdDate.split('T')[0],
      userId: backendUser.userId
    };
  };

  // Helper function to convert backend role to frontend role
  const convertBackendRoleToFrontend = (backendRole: BackendRole, userCount: number): Role => {
    const colors = ["#2F4156", "#576C8D", "#C0D9E6", "#8B5A83", "#D4A574"];
    const colorIndex = backendRole.roleId % colors.length;
    
    return {
      id: `role-${backendRole.roleId}`,
      name: backendRole.roleName,
      description: `Role for ${backendRole.roleName.toLowerCase()} users`,
      color: colors[colorIndex],
      userCount: userCount,
      permissions: [], // Not implemented yet
      roleId: backendRole.roleId
    };
  };

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      console.log('Fetching users from /auth/get-users...');
      
      // Check authentication
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        toast.error('Please log in to access user management');
        setUsers([]);
        return;
      }

      const response = await axiosInstance.get('/auth/get-users');
      console.log('Users response:', response.data);
      
      const backendUsers = response.data as BackendUser[];
      const frontendUsers = backendUsers.map(user => convertBackendUserToFrontend(user, roles));
      setUsers(frontendUsers);
      
      console.log('Users loaded successfully:', frontendUsers.length, 'users');
    } catch (error: any) {
      console.error('Error fetching users:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/auth/login';
      } else {
        toast.error(`Failed to load users: ${error.response?.data?.message || error.message}`);
      }
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch roles from backend
  const fetchRoles = async () => {
    try {
      setRolesLoading(true);
      console.log('Fetching roles from /auth/get-role...');
      
      const response = await axiosInstance.get('/auth/get-role');
      console.log('Roles response:', response.data);
      
      const backendRoles = response.data as BackendRole[];
      
      // Calculate user count for each role
      const rolesWithUserCount = backendRoles.map(backendRole => {
        const userCount = users.filter(user => 
          user.role === backendRole.roleName
        ).length;
        return convertBackendRoleToFrontend(backendRole, userCount);
      });
      
      setRoles(rolesWithUserCount);
      console.log('Roles loaded successfully:', rolesWithUserCount.length, 'roles');
    } catch (error: any) {
      console.error('Error fetching roles:', error);
      console.error('Error details:', error.response?.data);
      toast.error(`Failed to load roles: ${error.response?.data?.message || error.message}`);
      setRoles([]);
    } finally {
      setRolesLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchRoles()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Update roles when users change (for user count calculation)
  useEffect(() => {
    if (users.length > 0 && roles.length > 0) {
      const updatedRoles = roles.map(role => ({
        ...role,
        userCount: users.filter(user => user.role === role.name).length
      }));
      setRoles(updatedRoles);
    }
  }, [users]);

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // CRUD Operations
  const handleAddUser = async (userData: Omit<User, "id" | "lastLogin" | "createdDate" | "userId">) => {
    try {
      // Check if roles are loaded
      if (roles.length === 0) {
        toast.error('Roles not loaded. Please refresh and try again.');
        return;
      }

      // Find the role ID for the selected role name
      const selectedRole = roles.find(r => r.name === userData.role);
      if (!selectedRole) {
        toast.error('Selected role not found');
        return;
      }

      // Check authentication
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      // Validate required fields
      if (!userData.firstName.trim() || !userData.lastName.trim() || !userData.email.trim()) {
        toast.error('Please fill in all required fields');
        return;
      }

      const newUserPayload = {
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email.trim(),
        password: userData.password,
        roleId: parseInt(selectedRole.roleId.toString())
      };

      console.log('Creating user with payload:', newUserPayload);
      console.log('Current token:', localStorage.getItem('token'));
      console.log('Current userId:', localStorage.getItem('userId'));
      
      // For registration, we might not need authentication
      const response = await axiosInstance.post('/auth/register', newUserPayload);
      console.log('User created:', response.data);

      // Since /auth/register always sets active=false, we need to update the user status
      if (userData.status === "Active") {
        const updatePayload = {
          userFname: userData.firstName.trim(),
          userLname: userData.lastName.trim(),
          email: userData.email.trim(),
          passwordHash: userData.password,
          role: {
            roleId: selectedRole.roleId,
            roleName: selectedRole.name
          },
          active: true
        };
        
        console.log('Updating user active status:', updatePayload);
        await axiosInstance.put(`/auth/update-user/${response.data.userId}`, updatePayload);
        console.log('User status updated to active');
      }

      toast.success("User added successfully");
      setUserModalOpen(false);
      await fetchUsers(); // Refresh users list
    } catch (error: any) {
      console.error('Error creating user:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      toast.error(`Failed to create user: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEditUser = async (userData: Omit<User, "id" | "lastLogin" | "createdDate" | "userId">) => {
    if (!editingUser) return;

    try {
      // Find the role ID for the selected role name
      const selectedRole = roles.find(r => r.name === userData.role);
      if (!selectedRole) {
        toast.error('Selected role not found');
        return;
      }

      const updateUserPayload = {
        userFname: userData.firstName,
        userLname: userData.lastName,
        email: userData.email,
        passwordHash: userData.password,
        role: {
          roleId: selectedRole.roleId,
          roleName: selectedRole.name
        },
        active: userData.status === "Active"
      };

      console.log('Updating user with payload:', updateUserPayload);
      const response = await axiosInstance.put(`/auth/update-user/${editingUser.userId}`, updateUserPayload);
      console.log('User updated:', response.data);

      toast.success("User updated successfully");
      setEditingUser(null);
      setUserModalOpen(false);
      await fetchUsers(); // Refresh users list
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(`Failed to update user: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleAddRole = async (roleData: Omit<Role, "id" | "userCount" | "roleId">) => {
    try {
      const newRolePayload = {
        roleName: roleData.name
      };

      console.log('Creating role with payload:', newRolePayload);
      const response = await axiosInstance.post('/auth/post-role', newRolePayload);
      console.log('Role created:', response.data);

      toast.success("Role created successfully");
      setRoleModalOpen(false);
      await fetchRoles(); // Refresh roles list
    } catch (error: any) {
      console.error('Error creating role:', error);
      toast.error(`Failed to create role: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEditRole = async (roleData: Omit<Role, "id" | "userCount" | "roleId">) => {
    if (!editingRole) return;

    try {
      const updateRolePayload = {
        roleName: roleData.name
      };

      console.log('Updating role with payload:', updateRolePayload);
      const response = await axiosInstance.put(`/auth/update-role/${editingRole.roleId}`, updateRolePayload);
      console.log('Role updated:', response.data);

      toast.success("Role updated successfully");
      setEditingRole(null);
      setRoleModalOpen(false);
      await fetchRoles(); // Refresh roles list
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error(`Failed to update role: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (deleteType === "user") {
        const user = itemToDelete as User;
        console.log('Deleting user with ID:', user.userId);
        await axiosInstance.delete(`/auth/delete-user/${user.userId}`);
        toast.success("User deleted successfully");
        await fetchUsers(); // Refresh users list
      } else if (deleteType === "role") {
        const role = itemToDelete as Role;
        console.log('Deleting role with ID:', role.roleId);
        await axiosInstance.delete(`/auth/delete-role/${role.roleId}`);
        toast.success("Role deleted successfully");
        await fetchRoles(); // Refresh roles list
      }
      
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast.error(`Failed to delete ${deleteType}: ${error.response?.data?.message || error.message}`);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchUsers(), fetchRoles()]);
    setLoading(false);
    toast.success('Data refreshed successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">User & Role Management</h1>
          <p className="text-muted-foreground mt-1">Manage admin users and permission roles</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => {
              if (activeTab === "users") {
                setEditingUser(null);
                setUserModalOpen(true);
              } else {
                setEditingRole(null);
                setRoleModalOpen(true);
              }
            }}
            size="lg"
            variant="hero"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New {activeTab === "users" ? "User" : "Role"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users">
            Users {usersLoading && "(Loading...)"}
          </TabsTrigger>
        </TabsList>

        {/* Search */}
        <div className="mt-4">
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4 mt-6">
          {usersLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        <div className="h-3 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-gray-200 rounded"></div>
                      <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                      <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <div className="h-8 w-16 bg-gray-200 rounded"></div>
                      <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="p-6 card-shadow hover:elegant-shadow transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{user.firstName} {user.lastName}</h3>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "Active"
                        ? "dark:bg-green-500 dark:text-green-100"
                        : "dark:bg-red-500 dark:text-red-100"
                    }`}>
                      {user.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>{user.email}</p>
                    {/* Password field not displayed in UI for security */}
                    <p>Created: {new Date(user.createdDate).toLocaleDateString()}</p>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => { setEditingUser(user); setUserModalOpen(true); }}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDeleteType("user");
                        setItemToDelete(user);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!usersLoading && filteredUsers.length === 0 && (
            <Card className="p-12 text-center">
              <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search criteria" : "No users have been created yet"}
              </p>
            </Card>
          )}
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4 mt-6">
          {rolesLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                    <div className="flex gap-2 pt-2">
                      <div className="h-8 w-16 bg-gray-200 rounded"></div>
                      <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredRoles.map((role) => (
                <Card key={role.id} className="p-6 card-shadow hover:elegant-shadow transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${role.color}20` }}>
                        <Shield className="h-5 w-5" style={{ color: role.color }} />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold">{role.name}</h3>
                        <p className="text-sm text-muted-foreground">{role.userCount} users</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{role.description}</p>

                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">PERMISSIONS</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-muted rounded text-xs">
                        Basic Access
                      </span>
                      <span className="px-2 py-1 bg-muted rounded text-xs">
                        View Data
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => { setEditingRole(role); setRoleModalOpen(true); }}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDeleteType("role");
                        setItemToDelete(role);
                        setDeleteDialogOpen(true);
                      }}
                      disabled={role.userCount > 0}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!rolesLoading && filteredRoles.length === 0 && (
            <Card className="p-12 text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No roles found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search criteria" : "No roles have been created yet"}
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <UserFormModal
        isOpen={userModalOpen}
        onClose={() => { setUserModalOpen(false); setEditingUser(null); }}
        onSubmit={editingUser ? handleEditUser : handleAddUser}
        initialData={editingUser || undefined}
        availableRoles={roles.map(r => r.name)}
      />

      <RoleFormModal
        isOpen={roleModalOpen}
        onClose={() => { setRoleModalOpen(false); setEditingRole(null); }}
        onSubmit={editingRole ? handleEditRole : handleAddRole}
        initialData={editingRole || undefined}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => { setDeleteDialogOpen(false); setItemToDelete(null); }}
        onConfirm={handleDelete}
        title={`Delete ${deleteType === "user" ? "User" : "Role"}`}
        description={`Are you sure you want to delete ${
          deleteType === "user"
            ? `${(itemToDelete as User)?.firstName} ${(itemToDelete as User)?.lastName}`
            : (itemToDelete as Role)?.name
        }? This action cannot be undone.`}
      />
    </div>
  );
}