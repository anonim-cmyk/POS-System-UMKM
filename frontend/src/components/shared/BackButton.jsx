import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="px-3 py-2 bg-[#025cca] rounded-md"
      onClick={() => navigate(-1)}
    >
      <IoArrowBack />
    </button>
  );
};

export default BackButton;
