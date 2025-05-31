import { useEffect, useState } from "react";
import { instance } from "../lib/axios";
import useAuthStore from "../store";

const AuthProvider = ({ children }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await instance.get("/api/auth/me"); 
        setUser(res.data.user);
      } catch (err) {
        console.log("Session expired or not logged in");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUser]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return children;
};

export default AuthProvider;
