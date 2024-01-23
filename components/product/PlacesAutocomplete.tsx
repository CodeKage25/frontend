'use client';

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ErrorMessage } from "formik";

interface PlacesAutocomplete {
    name: string;
    onLocationSelect: (lat: number, lng: number, address: string) => void
}

const PlacesAutocomplete = ({ name, onLocationSelect }: PlacesAutocomplete) => {
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
                <li key={place_id} onClick={handleSelect(suggestion)} className="hover:text-primary hover:cursor-pointer">
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                </li>
            );
        });

    return (
        <div className="flex flex-col space-y-3">
            <Label htmlFor={'product-location'} className="text-[#253B4B] text-xs">Add product location</Label>
            <Input
                id="product-location"
                className="block border-0 ring-[1px] ring-input rounded-[10px] w-full p-7 text-sm bg-[#F0F0F1]"
                value={value}
                onChange={handleInput}
                disabled={!ready}
                placeholder="Enter Location"
                name={name}
                autoComplete="off"
            />
            <ErrorMessage name={name} render={msg => <small className="text-red-500 text-xs">Provide product location</small>} />
            {/* We can use the "status" to decide whether we should display the dropdown or not */}
            {status === "OK" && <ul className="border-2 rounded-lg p-4">{renderSuggestions()}</ul>}
        </div>
    );
}

export default PlacesAutocomplete;