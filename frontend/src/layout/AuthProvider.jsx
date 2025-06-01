import { useEffect, useState } from "react";
import { instance } from "../lib/axios";
import useAuthStore from "../store";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const AuthProvider = ({ children }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await instance.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(res.data.user);
      } catch (err) {
        console.log("Session expired or not logged in");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUser]);

  if (loading) return <div className="flex items-center justify-center p-4 h-[100vh] text-center"><LoadingSpinner/></div>;

  return children;
};

export default AuthProvider;
