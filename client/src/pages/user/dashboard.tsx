import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreWithRating } from "@shared/schema";
import { SortableTable } from "@/components/tables/sortable-table";
import { StarRating } from "@/components/ui/star-rating";
import { Store, Star, Building } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function UserDashboard() {
  const queryClient = useQueryClient();

  const { data: stores = [], isLoading } = useQuery<StoreWithRating[]>({
    queryKey: ["/api/user/stores"],
    queryFn: () => fetch("/api/user/stores").then((res) => res.json()),
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center text-indigo-900 font-semibold text-xl">
          Loading stores...
        </div>
      </MainLayout>
    );
  }

  const topRatedStores = [...stores]
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, 5);

  const totalStores = stores.length;
  const yourRatingsCount = stores.filter(store => store.userRating != null).length;
  const unratedCount = stores.filter(store => store.userRating == null).length;

  const columns = [
    {
      header: "Store Name",
      accessorKey: "name" as keyof StoreWithRating,
      isSortable: true,
      cell: (store: StoreWithRating) => (
        <div className="font-semibold text-gray-900 truncate max-w-xs">{store.name}</div>
      ),
    },
    {
      header: "Address",
      accessorKey: "address" as keyof StoreWithRating,
      cell: (store: StoreWithRating) => (
        <div className="text-gray-600 truncate max-w-md">{store.address}</div>
      ),
    },
    {
      header: "Rating",
      accessorKey: "averageRating" as keyof StoreWithRating,
      isSortable: true,
      cell: (store: StoreWithRating) => (
        <div className="flex items-center">
          <span className="text-sm font-semibold text-yellow-600 mr-2">
            {store.averageRating != null ? store.averageRating.toFixed(1) : "N/A"}
          </span>
          {store.averageRating != null && (
            <StarRating value={Math.round(store.averageRating)} readOnly size="sm" />
          )}
        </div>
      ),
    },
    {
      header: "Your Rating",
      accessorKey: "userRating" as keyof StoreWithRating,
      isSortable: true,
      cell: (store: StoreWithRating) => (
        <div className="flex items-center">
          {store.userRating != null ? (
            <>
              <span className="text-sm font-semibold text-indigo-700 mr-2">
                {store.userRating.toFixed(1)}
              </span>
              <StarRating value={Math.round(store.userRating)} readOnly size="sm" />
            </>
          ) : (
            <span className="text-gray-400 italic">Not rated</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 px-6 sm:px-12 lg:px-24 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-indigo-900 drop-shadow-md">
            Welcome to Your Dashboard
          </h1>
          <p className="mt-2 text-lg text-indigo-700 opacity-80">
            Explore your rating activity and discover the best stores
          </p>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {[{
            icon: <Store className="h-6 w-6 text-indigo-500" />,
            title: "Total Stores",
            subtitle: "Available stores to rate",
            value: totalStores,
            cardColor: "bg-indigo-100",
          }, {
            icon: <Star className="h-6 w-6 text-yellow-400" />,
            title: "Your Ratings",
            subtitle: "Stores you've rated",
            value: yourRatingsCount,
            cardColor: "bg-yellow-100",
          }, {
            icon: <Building className="h-6 w-6 text-red-400" />,
            title: "Unrated Stores",
            subtitle: "Stores waiting for your rating",
            value: unratedCount,
            cardColor: "bg-red-100",
          }].map(({ icon, title, subtitle, value, cardColor }) => (
            <Card
              key={title}
              className={`${cardColor} shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 border border-transparent rounded-xl cursor-default`}
            >
              <CardHeader className="flex items-center space-x-3 pb-2">
                <div className="p-2 rounded-full bg-white">{icon}</div>
                <div>
                  <CardTitle className="text-xl font-semibold text-indigo-900">{title}</CardTitle>
                  <CardDescription className="text-indigo-700">{subtitle}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-extrabold text-indigo-900 text-center">{value}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Top Rated Stores Table */}
        <section className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-indigo-900 mb-6 flex items-center space-x-3">
            <Star className="text-yellow-400 h-7 w-7" />
            <span>Top Rated Stores</span>
          </h2>

          <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <SortableTable
              data={topRatedStores}
              columns={columns}
            />
          </div>

          {/* View All Stores */}
          <div className="mt-8 flex justify-center">
            <Link href="/user/stores">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-lg shadow-lg transition-all duration-300 font-semibold">
                View All Stores
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
