// useAuth.js
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiClients from "src/apiClients/apiClients";
import { clearUser } from "src/Redux/userSlice";
export const UseAuth = (action) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          const response = await apiClients.sessionData();
          if (response?.success === true) {
            if (response?.data) {
              setUser(response.data);
            }
          } else {
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
            // localStorage.removeItem("subscriptionExpired")
            dispatch(clearUser());
            // setUser(null)
            // Use the navigate function to redirect to "/home"
           if(!action ){
            navigate("/");
           }
           
          }
        }

      } catch (error) {
              
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        console.log(error);
      }
    };

    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return { user };
};
