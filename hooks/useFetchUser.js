import { useEffect } from "react";
import supabase from "../utils/supabase";

const useFetchUser = (setData, setLoading) => {
  const fetchUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      const user = data.user;

      if (!user) return;
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      setData({
        id: user.id,
        email: user.email,
        username: profile.username,
      });
    } catch {
      // ss
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
};

export default useFetchUser;
