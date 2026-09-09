import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import { useTables } from "../hooks/useTables";
import TablesCard from "../components/tables/TablesCard";
import FullScreenLoader from "../components/shared/FullScreenLoader";
import { FaUtensils } from "react-icons/fa";

const TABLE_FILTERS = {
  ALL: "all",
  BOOKED: "Booked",
};

const Tables = () => {
  const { tables, isLoading } = useTables();
  // const paymentInfo = usePaymentRedirect();

  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") || "all";

  const handleStatusChange = (value) => {
    if (value === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ status: value });
    }
  };

  const filteredTables =
    status === "all"
      ? tables
      : tables.filter((table) => table.status === status);

  const { bookedCount, availableCount } = useMemo(() => {
    return {
      bookedCount: tables.filter((t) => t.status === "Booked").length,
      availableCount: tables.filter((t) => t.status === "Available").length,
    };
  }, [tables]);

  if (isLoading) return <FullScreenLoader />;

  return (
    <section className="bg-[#1f1f1f] min-h-screen pb-20 lg:pb-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-[#1f1f1f] border-b border-[#2a2a2a]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
            {/* Title Section */}
            <div className="flex items-center gap-3 sm:gap-4">
              <BackButton />
              <div>
                <h1 className="text-white text-2xl sm:text-3xl font-bold">
                  Tables
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  {availableCount} available • {bookedCount} booked
                </p>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
              {Object.entries(TABLE_FILTERS).map(([key, value]) => (
                <button
                  key={value}
                  onClick={() => handleStatusChange(value)}
                  className={`whitespace-nowrap px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${
                    status === value
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-[#2a2a2a] text-gray-400 hover:bg-[#333] hover:text-white border border-[#3a3a3a]"
                  }`}
                >
                  {value === "all" ? "All Tables" : value}
                  {value !== "all" && (
                    <span className="ml-2 text-xs opacity-75">
                      ({value === "Booked" ? bookedCount : availableCount})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Success Banner */}
          {/* {paymentInfo?.transactionStatus === "settlement" && (
            <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-l-4 border-emerald-500 px-4 sm:px-6 lg:px-10 py-3 mx-4 sm:mx-6 lg:mx-10 mb-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">✓</span>
                </div>
                <div>
                  <p className="text-emerald-500 font-semibold">
                    Payment Successful!
                  </p>
                  <p className="text-gray-400 text-sm">
                    Order ID: {paymentInfo.orderId}
                  </p>
                </div>
              </div>
            </div>
          )} */}
        </div>

        {/* Tables Grid */}
        <div className="px-4 sm:px-6 lg:px-10 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5 pb-12">
            {filteredTables.map((table) => (
              <TablesCard
                key={table._id}
                id={table._id}
                name={table.tableNo}
                status={table.status}
                initials={table?.currentOrder?.customer?.name || "-"}
                seats={table.seats}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredTables.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-block p-6 bg-[#2a2a2a] rounded-2xl mb-4">
                <FaUtensils className="text-5xl text-gray-600" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">
                No tables found
              </h3>
              <p className="text-gray-400">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </section>
  );
};

export default Tables;
