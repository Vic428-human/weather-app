import type { Coordinates } from "@/api/type";
import { useEffect, useState } from "react";

interface GeoLocationState {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
}

// custom hook is a simple function in react, and useState is in this hook, and render component in all those things.
export function useGeoLocation() {
  const [location, setLocation] = useState<GeoLocationState>({
    coordinates: null,
    error: null,
    isLoading: false,
  });

  //  this function will call as soon as this app is loading
  //  或者要refresh重新抓取確認是否有新的定位時
  const getLocation = () => {
    setLocation((prev) => ({ ...prev, isLoading: true, error: null }));

    // 若當前使用者沒有提供座標位置
    if (!navigator.geolocation) {
      setLocation({
        coordinates: null,
        error: "Your browser does not support geolocation",
        isLoading: false,
      });

      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    function success(pos: { coords: any }) {
      const crd = pos.coords;
      //   console.log("Your current position is:");
      //   console.log(`Latitude : ${crd.latitude}`);
      //   console.log(`Longitude: ${crd.longitude}`);
      //   console.log(`More or less ${crd.accuracy} meters.`);
      setLocation({
        coordinates: {
          lat: crd.latitude,
          lon: crd.longitude,
        },
        error: null,
        isLoading: false,
      });
    }

    function error(err: any) {
      let errorMsg: string;

      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMsg = "User denied the request for Geolocation.";
          break;
        case err.POSITION_UNAVAILABLE:
          errorMsg = "Location information is unavailable.";
          break;
        case err.TIMEOUT:
          errorMsg = "The request to get user location timed out.";
          break;
        case err.UNKNOWN_ERROR:
          errorMsg = "An unknown error occurred.";
          break;
      }
      //   console.warn(`ERROR(${err.code}): ${err.message}`);
      setLocation({
        coordinates: null,
        error: null,
        isLoading: false,
      });
    }

    // 若有提供座標 => https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
    navigator.geolocation.getCurrentPosition(success, error, options);
  };

  useEffect(() => {
    getLocation();
  }, []);

  return { ...location, getLocation };
}
