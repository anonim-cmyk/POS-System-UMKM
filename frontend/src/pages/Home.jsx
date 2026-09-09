import Greetings from "../components/home/Greetings";
import MiniCard from "../components/home/MiniCard";
import PopularDishes from "../components/home/PopularDishes";
import RecentOrders from "../components/home/RecentOrders";
import BottomNav from "../components/shared/BottomNav";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import { useOrderDetail } from "../hooks/useOrderDetail";
import { formatRupiah } from "../utils";

const Home = () => {
  const { orders, isLoading } = useOrderDetail({ page: 1, limit: 1000 });

  // Hitung Total Earnings berdasarkan totalWithTax dari order completed
  const totalEarnings = orders
    .filter((o) => o.orderStatus === "completed")
    .reduce((sum, o) => sum + (o.bills?.totalWithTax || 0), 0);

  // Hitung order sedang diproses
  const inProgress = orders.filter((o) => o.orderStatus !== "completed").length;

  return (
    <>
      <section className="bg-[#1f1f1f] min-h-screen overflow-y-hidden">
        {/* Container dengan max-width untuk layar besar */}
        <div className="max-w-[1600px] mx-auto">
          {/* Flex container yang responsive */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 pb-20 lg:pb-8">
            {/* Left Section - Main Content */}
            <div className="flex-1 lg:flex-[3] w-full overflow-y-auto scrollbar-hide">
              <Greetings />

              {/* Cards Grid - Stack on mobile, row on tablet+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
                <MiniCard
                  title="Total Earnings"
                  icon={<BsCashCoin />}
                  number={formatRupiah(totalEarnings)}
                  footerNum={1.6}
                />
                <MiniCard
                  title="In Progress"
                  icon={<GrInProgress />}
                  number={inProgress}
                  footerNum={2.4}
                />
              </div>

              <RecentOrders />
            </div>

            {/* Right Section - Popular Dishes */}
            <div className="w-full lg:w-auto lg:flex-[2] lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto scrollbar-hide">
              <PopularDishes />
            </div>
          </div>
        </div>
      </section>
      <BottomNav />
    </>
  );
};

export default Home;
