import { Button } from "@/components/ui/button";
import { useGeoLocation } from "@/hooks/use-geolocation";
import { RefreshCw } from "lucide-react";
import React from "react";

const WeatherDashboard = () => {
  // create custom hook for fetching my current location
  const {
    getLocation,
    coordinates,
    error,
    isLoading: locationLoading,
  } = useGeoLocation();
  // console.log("coordinates===>", { coordinates });

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      console.log("coordinates===>", { coordinates });
    }
  };

  if (locationLoading) {
  }
  return (
    <div className="space-y-4">
      {/* favorite city  */}
      <div className="flex items-center justify-between ">
        {/* tracking-tight
      letter-spacing: var(--tracking-tight); /* -0.025em */}
        <h1 className="text-xl font-medium tracking-tight">My Location</h1>
        <Button
          variant="outline"
          size="icon"
          // onClick={handleRefresh}
          // disabled={false}
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>
      {/* get current and hourly weather */}
    </div>
  );
};

export default WeatherDashboard;
