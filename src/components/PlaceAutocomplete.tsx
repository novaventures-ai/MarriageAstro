import { useState, useEffect } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { Loader2, MapPin } from "lucide-react";

const libraries: ("places")[] = ["places"];

interface PlaceAutocompleteProps {
    value: string;
    onPlaceSelect: (place: {
        name: string;
        latitude: number;
        longitude: number;
        formattedAddress: string;
        timezone?: string;
    }) => void;
    placeholder?: string;
    className?: string;
}

export default function PlaceAutocomplete({
    value,
    onPlaceSelect,
    placeholder = "Enter birth city",
    className = "",
}: PlaceAutocompleteProps) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey || "",
        libraries,
    });

    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [inputValue, setInputValue] = useState(value);

    // Sync local state when prop changes (e.g. form reset)
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
        setAutocomplete(autocompleteInstance);
    };

    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();

            if (!place.geometry || !place.geometry.location) {
                console.error("No geometry found for place");
                return;
            }

            const latitude = place.geometry.location.lat();
            const longitude = place.geometry.location.lng();
            const formattedAddress = place.formatted_address || place.name || "";

            // Note: Google Places API does not directly provide timezone.
            // We usually need a separate API call (Timezone API) or use a library like 'geo-tz' if needed strictly from coordinates.
            // For now, we pass location data. The parent form can handle timezone or use a default.

            onPlaceSelect({
                name: formattedAddress,
                latitude,
                longitude,
                formattedAddress,
            });

            setInputValue(formattedAddress);
        }
    };

    if (loadError) {
        console.error("Google Maps Load Error:", loadError);
        return (
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        // Fallback: manually pass simple string if maps fails
                        onPlaceSelect({
                            name: e.target.value,
                            latitude: 0,
                            longitude: 0,
                            formattedAddress: e.target.value
                        });
                    }}
                    placeholder={placeholder}
                    className={`w-full px-4 py-2 bg-white dark:bg-gray-900 border border-red-300 dark:border-red-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-colors ${className}`}
                />
                <p className="text-xs text-red-500 mt-1">Map load failed. Enter manually.</p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-400 dark:text-gray-500 transition-colors">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading maps...</span>
            </div>
        );
    }

    return (
        <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
            options={{
                types: ["(cities)"],
                fields: ["formatted_address", "geometry", "name"],
            }}
        >
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-colors ${className}`}
                />
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
        </Autocomplete>
    );
}
