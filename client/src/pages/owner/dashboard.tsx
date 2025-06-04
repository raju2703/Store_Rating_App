import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SortableTable } from "@/components/tables/sortable-table";
import { StarRating } from "@/components/ui/star-rating";
import { StoreWithRating, RatingWithUser } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function OwnerDashboard() {
  const { data: store, isLoading: storeLoading } = useQuery<StoreWithRating>({
    queryKey: ["/api/owner/store"],
  });

  const { data: ratings = [], isLoading: ratingsLoading } = useQuery<RatingWithUser[]>({
    queryKey: ["/api/owner/ratings"],
  });

  const columns = [
    {
      header: "Customer",
      accessorKey: "userName" as keyof RatingWithUser,
      cell: (rating: RatingWithUser) => (
        <div>
          <div className="font-semibold text-gray-800">{rating.userName}</div>
          <div className="text-sm text-gray-500">{rating.userEmail}</div>
        </div>
      ),
      isSortable: true,
    },
    {
      header: "Rating",
      accessorKey: "rating" as keyof RatingWithUser,
      cell: (rating: RatingWithUser) => (
        <div className="flex items-center">
          <span className="text-sm font-semibold text-gray-800 mr-2">
            {rating.rating}
          </span>
          <StarRating value={rating.rating} readOnly size="sm" />
        </div>
      ),
      isSortable: true,
    },
    {
      header: "Date",
      accessorKey: "createdAt" as keyof RatingWithUser,
      cell: (rating: RatingWithUser) => (
        <span className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(rating.createdAt), { addSuffix: true })}
        </span>
      ),
      isSortable: true,
    },
  ];

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen px-4 sm:px-6 lg:px-20 py-10">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl shadow-md mb-10">
          <h1 className="text-3xl font-bold">Store Owner Dashboard</h1>
          <p className="mt-1 text-sm opacity-90">
            Track store performance and view customer feedback
          </p>
        </div>

        {/* Store Info Card */}
        {store && (
          <Card className="border border-gray-200 shadow-sm mb-10">
            <CardHeader className="bg-gray-100 border-b px-6 py-4 rounded-t-lg">
              <h2 className="text-lg font-semibold text-gray-800">
                📍 Store Overview
              </h2>
            </CardHeader>
            <CardContent className="px-6 py-6">
              <dl className="grid sm:grid-cols-2 gap-x-12 gap-y-6 text-sm text-gray-700">
                <div>
                  <dt className="font-medium text-gray-500">Store Name</dt>
                  <dd className="text-lg font-semibold text-gray-900">{store.name}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Email</dt>
                  <dd className="text-gray-900">{store.email}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Address</dt>
                  <dd className="text-gray-900">{store.address}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Average Rating</dt>
                  <dd className="flex items-center mt-1">
                    <span className="text-xl font-bold text-gray-900 mr-2">
                      {store.averageRating.toFixed(1)}
                    </span>
                    <StarRating
                      value={Math.round(store.averageRating)}
                      readOnly
                      size="md"
                    />
                    <span className="ml-2 text-sm text-gray-500">
                      ({store.totalRatings} ratings)
                    </span>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        )}

        {/* Ratings Table */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            ⭐ Customer Ratings
          </h2>
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
            <SortableTable data={ratings} columns={columns} />

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
