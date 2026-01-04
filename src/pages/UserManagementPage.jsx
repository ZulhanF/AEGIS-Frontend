import React, { useEffect } from "react";
import UserManagement from "@/components/UserManagement";
import HeaderText from "@/components/HeaderText";
import { UserFilters } from "@/components/user/UserFilters";
import { filterStorage } from "@/utils/storage";
import { exportUsersToCSV } from "@/utils/export";
import { Card, CardContent } from "@/components/ui/card";
import { UserX } from "lucide-react";

function UserManagementPage({ useUsers }) {
  // Fetch users saat halaman dibuka
  useEffect(() => {
    useUsers.fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load saved filters from localStorage
  const [filters, setFilters] = React.useState(() => 
    filterStorage.loadUserFilters()
  );

  // Save filters to localStorage whenever they change
  React.useEffect(() => {
    filterStorage.saveUserFilters(filters);
  }, [filters]);

  // Filter users based on current filters
  const filteredUsers = React.useMemo(() => {
    if (!useUsers.users) return [];

    return useUsers.users.filter((user) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchSearch =
          user.name?.toLowerCase().includes(searchLower) ||
          user.username?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower);

        if (!matchSearch) return false;
      }

      // Role filter
      if (filters.role !== "all") {
        const userRole = user.role || "ENGINEER";
        if (userRole !== filters.role) return false;
      }

      // Verified filter
      if (filters.verified !== "all") {
        const isVerified = user.isVerified === true || user.isVerified === 1;
        if (filters.verified === "verified" && !isVerified) return false;
        if (filters.verified === "unverified" && isVerified) return false;
      }

      return true;
    });
  }, [useUsers.users, filters]);

  const handleExport = () => {
    exportUsersToCSV(filteredUsers);
  };

  return (
    <div className="flex-1 w-full p-6">
      <div className="max-w-6xl mx-auto">
        <HeaderText
          title="User Management"
          subtitle="Manage engineer accounts and permissions"
        />

        {/* Filters */}
        <UserFilters
          filters={filters}
          onFiltersChange={setFilters}
          onExport={handleExport}
          totalResults={filteredUsers.length}
        />

        {useUsers.loading ? (
          <Card>
            <CardContent className="py-8">
              <div className="flex items-center justify-center">
                <p className="text-muted-foreground">Loading users...</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <UserX className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No users found</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  {useUsers.users.length === 0
                    ? "No users have been registered yet."
                    : "No users match your current filters. Try adjusting your search criteria."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <UserManagement
            users={filteredUsers}
            loading={useUsers.loading}
            error={useUsers.error}
            onVerifyUser={useUsers.handleVerifyUser}
            onUnverifyUser={useUsers.handleUnverifyUser}
            onDeleteUser={useUsers.handleDeleteUser}
          />
        )}
      </div>
    </div>
  );
}

export default UserManagementPage;
