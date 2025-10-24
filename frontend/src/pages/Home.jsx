import Greetings from "../components/home/Greetings";
import MiniCard from "../components/home/MiniCard";
import PopularDishes from "../components/home/PopularDishes";
import RecentOrders from "../components/home/RecentOrders";
import BottomNav from "../components/shared/BottomNav";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";

const Home = () => {
  return (
    <>
      <section className="bg-[#1f1f1f] min-h-screen flex gap-3 pb-20">
        <div className="flex-[3] h-full overflow-y-auto scrollbar-hide">
          <Greetings />
          <div className="flex items-center w-full gap-3 px-8 mt-8">
            <MiniCard
              title="Total Earnings"
              icon={<BsCashCoin />}
              number={512}
              footerNum={1.6}
            />
            <MiniCard
              title="In Progress"
              icon={<GrInProgress />}
              number={512}
              footerNum={1.6}
            />
          </div>
          <RecentOrders />
        </div>
        <div className="flex-[2] h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide">
          <PopularDishes />
        </div>
      </section>
      <BottomNav />
    </>
  );
};

export default Home;
