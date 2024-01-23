import { getCategory } from "@/api/category/endpoints";
import { getPlans } from "@/api/plans/endpoints";
import { getUserPlan, getWallet } from "@/api/user/endpoints";
import DashboardListing from "@/components/dashboard/DashboardListing";
import getQueryClient from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

// Root page of dashboard folder is the listing page
const Listing = async () => {
    const queryClient = getQueryClient();
    const result = await getCategory();
    const allCategories = result?.data || [];
    const categoriesArray = Array.isArray(allCategories) ? allCategories : [];
    const filteredCategories = categoriesArray.slice(0, 6);
    await queryClient.prefetchQuery({
        queryKey: ['category'],
        queryFn: async () => {
            return { data: filteredCategories };
        },
    });
    // const dehydratedState = dehydrate(queryClient);
    // await queryClient.prefetchQuery({
    //     queryKey: ['plans'], 
    //     queryFn: getPlans
    // });
    // await queryClient.prefetchQuery({
    //     queryKey: ['wallet'], 
    //     queryFn: getWallet
    // });
    // await queryClient.prefetchQuery({
    //     queryKey: ['user-plan'], 
    //     queryFn: getUserPlan
    // });
    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <DashboardListing />
        </HydrationBoundary>
    )
}

export default Listing;

function categoryId(categoryId: any): { data: any; } | PromiseLike<{ data: any; }> {
    throw new Error("Function not implemented.");
}
