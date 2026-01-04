import { useState, useCallback, useEffect } from "react";
import {
  getAllUsers,
  getUserById,
  verifyUser,
  unverifyUser,
  deleteUser,
} from "@/utils/api";
import { toast } from "sonner";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { error, data, message } = await getAllUsers();

      if (error) {
        setError(message);
        if (!message?.includes("403") && !message?.toLowerCase().includes("forbidden")) {
          toast.error(message || "Failed to fetch users");
        }
        return;
      }

      setUsers(data);
    } catch (err) {
      const errorMessage = err.message || "An error occurred while fetching users";
      setError(errorMessage);
      if (!errorMessage?.includes("403") && !errorMessage?.toLowerCase().includes("forbidden")) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, []);


  const handleVerifyUser = async (userId) => {
    try {
      const result = await verifyUser(userId);
      
      if (!result.error) {
        toast.success(result.message || "User verified successfully");
        // Update user in local state
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, isVerified: true } : user
          )
        );
        return { success: true };
      }
    } catch (err) {
      toast.error(err.message || "Failed to verify user");
      return { success: false, error: err.message };
    }
  };

  const handleUnverifyUser = async (userId) => {
    try {
      const result = await unverifyUser(userId);
      
      if (!result.error) {
        toast.success(result.message || "User unverified successfully");
        // Update user in local state
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, isVerified: false } : user
          )
        );
        return { success: true };
      }
    } catch (err) {
      toast.error(err.message || "Failed to unverify user");
      return { success: false, error: err.message };
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const { error, message } = await deleteUser(userId);

      if (error) {
        toast.error(message || "Failed to delete user");
        return { success: false };
      }

      toast.success(message || "User deleted successfully");
      // Remove user from local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      return { success: true };
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
      return { success: false, error: err.message };
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    handleVerifyUser,
    handleUnverifyUser,
    handleDeleteUser,
    refetch: fetchUsers,
  };
}

export function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const { error, data, message } = await getUserById(userId);

        if (error) {
          setError(message);
          toast.error(message || "Failed to fetch user");
          return;
        }

        setUser(data);
      } catch (err) {
        const errorMessage = err.message || "An error occurred while fetching user";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const refetch = () => {
    if (!userId) return;
    
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const { error, data, message } = await getUserById(userId);

        if (error) {
          setError(message);
          toast.error(message || "Failed to fetch user");
          return;
        }

        setUser(data);
      } catch (err) {
        const errorMessage = err.message || "An error occurred while fetching user";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  };

  return {
    user,
    loading,
    error,
    refetch,
  };
}
