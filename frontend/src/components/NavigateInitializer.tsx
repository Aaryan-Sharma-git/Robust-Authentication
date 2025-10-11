import { setNavigate } from "@/lib/navigate";
import { useEffect } from "react";
import { useNavigate } from "react-router";


const NavigatorInitializer = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return null; // no UI needed
};

export default NavigatorInitializer;
