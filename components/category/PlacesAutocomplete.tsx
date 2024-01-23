'use client';

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ErrorMessage } from "formik";

interface PlacesAutocompleteInterface {
    onLocationSelect: (lat: number, lng: number, address: string) => void
}

const PlacesAutocomplete = ({ onLocationSelect }: PlacesAutocompleteInterface) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions
    } = usePlacesAutocomplete({ callbackName: "YOUR_CALLBACK_NAME" });

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value);
    };

    const handleSelect =
        (suggestion: { description: string; place_id: string }) => async () => {
            // When user selects a place, we can replace the keyword without request data from API
            // by setting the second parameter to "false"
            setValue(suggestion.description, false);
            clearSuggestions();
            try {
                const latlng = await getGeocode({ address: suggestion.description });
                const { lat, lng } = getLatLng(latlng[0]);

                onLocationSelect(lat, lng, suggestion.description);
            } catch (error) {
                console.log(error);
            }
        };

    const renderSuggestions = () =>
        data.map((suggestion) => {
            const {
                place_id,
                structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
                <li key={place_id} onClick={handleSelect(suggestion)} className="text-sm hover:text-primary hover:cursor-pointer">
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                </li>
            );
        });

    return (
        <div className="flex flex-col space-y-3">
            <Input
                id="product-location"
                className="block rounded-md w-full py-4 text-xs placeholder:text-xs"
                value={value}
                onChange={handleInput}
                disabled={!ready}
                placeholder="Enter Location"
                autoComplete="off"
            />
            {/* We can use the "status" to decide whether we should display the dropdown or not */}
            {status === "OK" && <ul className="border-2 rounded-lg p-4">{renderSuggestions()}</ul>}
        </div>
    );
}

export default PlacesAutocomplete;