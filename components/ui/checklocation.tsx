import { checkLocation } from "@/api/user/endpoints";
import { CheckLocationResInterface } from "@/lib/types/user/LocationResInterface";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./alert-dialog";
import { LocationType } from "@/lib/types/location/CoordinateInterface";
import { useLocationUpdate } from "@/lib/hooks/useLocationUpdate";
import { requestPermission } from "@/lib/utils";
import { toast } from "react-toastify";

const CheckLocation = () => {
    const [location, setLocation] = useState<LocationType | null>(null);
    const [openLocationDialog, setOpenLocationDialog] = useState<boolean>(false);
    const [fetchLocation, setFetchLocation] = useState<boolean>(true);
    const { data } = useQuery<CheckLocationResInterface, AxiosError>(
        {
            queryKey: ['check-location'],
            queryFn: () => checkLocation(),
            enabled: !!fetchLocation,
            refetchOnMount: false,
        });

    useEffect(() => {
        if (data && !data?.data.message)
            setOpenLocationDialog(true);
        else
            setFetchLocation(false);
    }, [data]);

    const locationMutate = useLocationUpdate({
        onSuccess(data) {
            toast.success(data.message);
            setFetchLocation(false);
            setOpenLocationDialog(false);
            // requestPermission();
        },
        onError(error) {
            toast.error('Unable to set location');
        },
    });

    const onSuccess = (position: GeolocationPosition) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        locationMutate.mutate({
            lan: latitude,
            log: longitude
        });
    }

    const onError = (position: GeolocationPositionError) => {
        setOpenLocationDialog(false);
        setLocation({
            coord: {
                long: 0,
                lat: 0,
            },
            loaded: true,
            status: "ERROR",
            message: "Unable to retrieve your location",
        });
    }

    const onLocationGranted = () => {
        if (!(navigator.geolocation)) {
            console.log('no geolocation')
            setLocation(() => ({
                coord: {
                    long: 0,
                    lat: 0,
                },
                loaded: true,
                status: "ERROR",
                message: "Geolocation is not supported by your browser",
            }));
        } else {
            navigator.geolocation.getCurrentPosition(onSuccess, onError)
        }
    }

    return (
        <AlertDialog defaultOpen={false} open={openLocationDialog} >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Location update!</AlertDialogTitle>
                    <AlertDialogDescription>
                        Welcome to Katangwa! To provide you with a personalized experience, we would like to know your current location. This will help us tailor our content and services to your area. Would you be willing to share your location with us? You can click &apos;Continue&apos; to grant permission or &apos;Cancel&apos; to decline.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => {
                        setOpenLocationDialog(false);
                        setFetchLocation(false);
                        requestPermission();
                    }}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => onLocationGranted()}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CheckLocation;