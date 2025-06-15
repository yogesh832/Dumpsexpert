import { useEffect } from "react";
import { instance } from "../lib/axios";
import useAuthStore from "../store";

const AuthProvider = ({ children }) => {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await instance.get("/api/auth/me");
        setUser(res.data.user);
      } catch (err) {
        console.log("Not logged in or session expired");
        console.error(err);
        setUser(null); 
      }
    };

    fetchUser();
  }, [setUser]);

  return children; 
};

export default AuthProvider;
