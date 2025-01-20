import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const [homeData, setHomeData] = useState({
    title: "",
    subtitle: "",
    heroImages: "",
    desktopVideo: "", // Make sure these video fields are included
    mobileVideo: "", // Make sure these video fields are included
    email: "",
    phone: "",
    address: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/landing`
        );
        const data = response.data;
        console.log(data);
        setHomeData({
          title: data.title,
          subtitle: data.subtitle,
          heroImages: data.currentDayImage.url,
          desktopVideo: data.heroVideoBig.url,
          mobileVideo: data.heroVideoSmall.url,
          email: data.email,
          phone: data.phone,
          facebook: data.facebook,
          twitter: data.twitter,
          instagram: data.instagram,
          address: data.address,
          youtube: data.youtube,
        });
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <HomeContext.Provider value={{ ...homeData, isLoading }}>
      {children}
    </HomeContext.Provider>
  );
};

HomeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useHome = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useHome must be used within a HomeProvider");
  }
  return context;
};
