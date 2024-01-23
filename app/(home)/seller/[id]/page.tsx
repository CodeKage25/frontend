import { getSellerProfile } from "@/api/user/endpoints";
import LeftPane from "@/components/store/LeftPane";
import RightPane from "@/components/store/RightPane";
import getQueryClient from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

const SellerProfile = async ({ params }: {
    params: { id: string }
}) => {
    const id = params.id;
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery({
        queryKey: ['seller-profile', id],
        queryFn: () => getSellerProfile(id)
    });
    const dehydratedState = dehydrate(queryClient);
    return (
        <HydrationBoundary state={dehydratedState}>
            <section className="container mx-auto px-3 py-6 gap-y-6 grid grid-cols-1 lg:gap-x-6 lg:grid-cols-[1.3fr_3fr] lg:px-[60px]">
                <LeftPane />
                <RightPane />
            </section>
        </HydrationBoundary>
    )
}

export default SellerProfile;