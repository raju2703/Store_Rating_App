import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddStoreDialog } from "@/components/dialogs/add-store-dialog";
import { AddUserDialog } from "@/components/dialogs/add-user-dialog";
import { Loader2, Users, Store, Star, Plus } from "lucide-react";
import { useState } from "react";
import { StoreStatistics } from "@shared/schema";

export default function AdminDashboard() {
  const [addStoreDialogOpen, setAddStoreDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);

  const { data: stats, isLoading } = useQuery<StoreStatistics>({
    queryKey: ["/api/admin/statistics"],
  });

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 px-6 py-10 lg:px-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg mb-10">
          <h2 className="text-3xl font-extrabold">Welcome, Admin</h2>
          <p className="mt-2 text-lg opacity-90">
            Here's a quick overview of the platform activity.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: "Total Users",
              icon: <Users className="h-7 w-7 text-blue-500" />,
              value: stats?.totalUsers || 0,
              color: "bg-blue-100"
            },
            {
              title: "Total Stores",
              icon: <Store className="h-7 w-7 text-green-500" />,
              value: stats?.totalStores || 0,
              color: "bg-green-100"
            },
            {
              title: "Total Ratings",
              icon: <Star className="h-7 w-7 text-yellow-500" />,
              value: stats?.totalRatings || 0,
              color: "bg-yellow-100"
            }
          ].map(({ title, icon, value, color }, idx) => (
            <Card
              key={idx}
              className={`transition-transform transform hover:scale-105 hover:shadow-xl ${color}`}
            >
              <CardContent className="flex items-center p-6 gap-4">
                <div className="p-3 rounded-full bg-white shadow-md">{icon}</div>
                <div>
                  <p className="text-md text-gray-600 font-semibold">{title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      value
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => setAddStoreDialogOpen(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-5 w-5" /> Add New Store
            </Button>
            <Button
              onClick={() => setAddUserDialogOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-5 w-5" /> Add New User
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddStoreDialog
        open={addStoreDialogOpen}
        onOpenChange={setAddStoreDialogOpen}
      />
      <AddUserDialog
        open={addUserDialogOpen}
        onOpenChange={setAddUserDialogOpen}
      />
    </MainLayout>
  );
}
