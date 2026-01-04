import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  UserCheck,
  UserX,
  Trash2,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";

function UserManagement({ users, loading, onVerifyUser, onUnverifyUser, onDeleteUser }) {
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    userId: null,
    userName: "",
  });
  const [actionLoading, setActionLoading] = useState(null);

  const handleVerify = async (userId) => {
    setActionLoading(`verify-${userId}`);
    await onVerifyUser(userId);
    setActionLoading(null);
  };

  const handleUnverify = async (userId) => {
    setActionLoading(`unverify-${userId}`);
    await onUnverifyUser(userId);
    setActionLoading(null);
  };

  const handleDelete = async () => {
    if (!deleteDialog.userId) return;

    setActionLoading(`delete-${deleteDialog.userId}`);
    await onDeleteUser(deleteDialog.userId);
    setActionLoading(null);
    setDeleteDialog({ open: false, userId: null, userName: "" });
  };

  const openDeleteDialog = (userId, userName) => {
    setDeleteDialog({ open: true, userId, userName });
  };

  const getUserStats = () => {
    const total = users.length;
    const verified = users.filter((u) => u.isVerified).length;
    const pending = users.filter((u) => !u.isVerified).length;
    return { total, verified, pending };
  };

  const stats = getUserStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Registered engineers
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.verified}</div>
              <p className="text-xs text-muted-foreground">Active accounts</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              All Users
            </CardTitle>
            <CardDescription>
              Manage user verification and account status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Name</TableHead>
                      <TableHead className="text-center">Username</TableHead>
                      <TableHead className="text-center">Email</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Role</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium text-center">
                          {user.name}
                        </TableCell>
                        <TableCell className="text-center">
                          @{user.username}
                        </TableCell>
                        <TableCell className="text-center">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-center">
                          {user.isVerified ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">
                            {user.role || "ENGINEER"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            {user.isVerified ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUnverify(user.id)}
                                disabled={
                                  actionLoading === `unverify-${user.id}`
                                }
                                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              >
                                <UserX className="h-4 w-4 mr-1" />
                                {actionLoading === `unverify-${user.id}`
                                  ? "..."
                                  : "Unverify"}
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerify(user.id)}
                                disabled={actionLoading === `verify-${user.id}`}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                {actionLoading === `verify-${user.id}`
                                  ? "..."
                                  : "Verify"}
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                openDeleteDialog(user.id, user.name)
                              }
                              disabled={actionLoading === `delete-${user.id}`}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ open: false, userId: null, userName: "" })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Delete User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteDialog.userName}</strong>? This action cannot be
              undone and will permanently remove the user account and all
              associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={actionLoading?.startsWith("delete-")}
            >
              {actionLoading?.startsWith("delete-") ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default UserManagement;
