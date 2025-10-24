const MiniCard = ({ title, icon, number, footerNum }) => {
  return (
    <div className="bg-[#1a1a1a] py-5 px-5 rounded-lg w-[50%]">
      <div className="flex items-start justify-between">
        <h1 className="text-lg font-poppins font-semibold text-white">
          {title}
        </h1>
        <button
          className={`${
            title === "Total Earnings" ? "bg-[#02ca3a]" : "bg-[#f6b100]"
          } text-2xl p-3 rounded-lg`}
        >
          {icon}
        </button>
      </div>
      <div>
        <h1 className="text-4xl text-white font-bold mt-3">{number}</h1>
        <h1 className="text-xl text-white font-semibold mt-2">
          <span className="text-green-400">{footerNum}%</span> Than Yesterday
        </h1>
      </div>
    </div>
  );
};

export default MiniCard;
