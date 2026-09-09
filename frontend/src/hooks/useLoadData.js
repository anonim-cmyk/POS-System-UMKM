import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeUser, setUser } from "../redux/slices/userSlices";
import { getApiData } from "../api/auth.api";

const useLoadData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getApiData();
        const { _id, name, email, phone, role } = data.data;

        dispatch(setUser({ _id, name, email, phone, role }));
      } catch (error) {
        // ❗ jangan redirect di sini
        dispatch(removeUser());
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  return isLoading;
};

export default useLoadData;
