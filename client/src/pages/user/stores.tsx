import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StarRating } from "@/components/ui/star-rating";
import { Search } from "lucide-react";
import { StoreWithRating } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function UserStores() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: stores = [], isLoading } = useQuery<StoreWithRating[]>({
    queryKey: ["/api/stores"],
  });

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ratingMutation = useMutation({
    mutationFn: async ({ storeId, rating }: { storeId: number; rating: number }) => {
      const res = await apiRequest("POST", "/api/ratings", { storeId, rating });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
      toast({
        title: "Rating submitted",
        description: "Your rating has been submitted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit rating",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRatingChange = (storeId: number, rating: number) => {
    ratingMutation.mutate({ storeId, rating });
  };

  return (
    <MainLayout>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">Browse Stores</h2>
        
        {/* Search */}
        <div className="mt-6">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search stores by name or address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Store Cards */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStores.map((store) => (
            <Card key={store.id}>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium text-gray-900">{store.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{store.address}</p>
                <div className="mt-4 flex items-center">
                  <div className="text-sm font-medium text-gray-900 mr-2">
                    {store.averageRating.toFixed(1)}
                  </div>
                  <StarRating
                    value={Math.round(store.averageRating)}
                    readOnly
                    size="sm"
                  />
                  <span className="ml-2 text-sm text-gray-500">
                    ({store.totalRatings} ratings)
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Your rating:</p>
                  <div className="mt-1">
                    <StarRating
                      value={store.userRating || 0}
                      onChange={(rating) => handleRatingChange(store.id, rating)}
                      size="lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredStores.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No stores found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
