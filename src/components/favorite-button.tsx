import type { WeatherResponse } from "@/api/type";
import { useFavorite } from "@/hooks/use-favoriate";
import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface FavoriteWeatherProps {
  data: WeatherResponse;
}

const FavoriteButton = ({ data }: FavoriteWeatherProps) => {
  const { ifFavorite, addFavorite, removeFavorite } = useFavorite();
  const isCurrentFavorite = ifFavorite(data.coord.lat, data.coord.lon);

  const handleToggleFavorite = () => {
    if (isCurrentFavorite) {
      removeFavorite.mutate(`${data.coord.lat}-${data.coord.lon}`);
      toast.warning(`Remove ${data.name} from favorites`);
    } else {
      addFavorite.mutate({
        name: data.name,
        lat: data.coord.lat,
        lon: data.coord.lon,
        country: data.sys.country,
      });
      // https://github.com/shadcn-ui/ui/issues/2234
      toast.success(`Added ${data.name} to favorites`);
    }
  };
  return (
    <Button
      variant={isCurrentFavorite ? "default" : "outline"}
      size="icon"
      className={isCurrentFavorite ? "bg-yellow-500 hover:bg-yellow-600" : ""}
      onClick={handleToggleFavorite}
    >
      {/* Use the fill-current utility to set the fill color to the current text color: */}
      <Star className={`h-4 w-4 ${isCurrentFavorite ? "fill-current" : ""}`} />
    </Button>
  );
};

export default FavoriteButton;
