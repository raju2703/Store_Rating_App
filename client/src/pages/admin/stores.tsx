import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SortableTable } from "@/components/tables/sortable-table";
import { StarRating } from "@/components/ui/star-rating";
import { AddStoreDialog } from "@/components/dialogs/add-store-dialog";
import { AddUserDialog } from "@/components/dialogs/add-user-dialog";
import { Plus, Search, Eye, Pencil, UserPlus } from "lucide-react";
import { StoreWithRating, UserRole } from "@shared/schema";

export default function AdminStores() {
  const [searchQuery, setSearchQuery] = useState("");
  const [addStoreDialogOpen, setAddStoreDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  
  const { data: stores = [], isLoading } = useQuery<StoreWithRating[]>({
    queryKey: ["/api/admin/stores"],
  });

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof StoreWithRating,
      isSortable: true,
    },
    {
      header: "Email",
      accessorKey: "email" as keyof StoreWithRating,
      isSortable: true,
    },
    {
      header: "Address",
      accessorKey: "address" as keyof StoreWithRating,
      cell: (store: StoreWithRating) => (
        <div className="max-w-xs truncate">{store.address}</div>
      ),
      isSortable: true,
    },
    {
      header: "Rating",
      accessorKey: "averageRating" as keyof StoreWithRating,
      cell: (store: StoreWithRating) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900 mr-2">
            {store.averageRating.toFixed(1)}
          </div>
          <StarRating
            value={Math.round(store.averageRating)}
            readOnly
            size="sm"
          />
          <span className="ml-2 text-xs text-gray-500">
            ({store.totalRatings})
          </span>
        </div>
      ),
      isSortable: true,
    },
    {
      header: "Action",
      accessorKey: "id" as keyof StoreWithRating,
      cell: (store: StoreWithRating) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="text-primary-600 hover:text-primary-900">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Stores</h2>
          <div className="flex space-x-3">
            <Button
              onClick={() => setAddUserDialogOpen(true)}
              variant="outline"
              className="flex items-center"
            >
              <UserPlus className="mr-2 h-4 w-4" /> Add Store Owner
            </Button>
            <Button 
              onClick={() => setAddStoreDialogOpen(true)}
              className="flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Store
            </Button>
          </div>
        </div>
        
        {/* Search/Filter */}
        <div className="mt-6">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search stores by name, email or address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Stores Table */}
        <div className="mt-6">
          <SortableTable
            data={filteredStores}
            columns={columns}
            onRowClick={(store) => console.log("Clicked store:", store)}
          />
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
        defaultRole={UserRole.OWNER}
      />
    </MainLayout>
  );
}
