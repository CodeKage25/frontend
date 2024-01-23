// import getQueryClient from "@/lib/getQueryClient";
// import { getCategory } from "@/api/category/endpoints";
// import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

// const MainNavbar = async ({ children }: { children: React.ReactNode }) => {
//     const queryClient = getQueryClient();
//     await queryClient.prefetchQuery({
//         queryKey: ['category'],
//         queryFn: getCategory(1, 6),
//     });
//     const dehydratedState = dehydrate(queryClient);

//     return (
//         <HydrationBoundary state={dehydratedState}>
//             <div className='flex flex-col justify-between items-center'>
//                 {children}
//             </div>
//         </HydrationBoundary>
//     )
// }

// export default MainNavbar;

import getQueryClient from "@/lib/getQueryClient";
import { getCategory } from "@/api/category/endpoints";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

const MainNavbar = async ({ children }: { children: React.ReactNode }) => {
    const queryClient = getQueryClient();
    const { data: allCategories } = await getCategory();
    const categoriesArray = Array.isArray(allCategories) ? allCategories : [];
    const filteredCategories = categoriesArray.slice(0, 6);
    await queryClient.prefetchQuery({
        queryKey: ['category'],
        queryFn: async () => {
            return { data: filteredCategories };
        },
    });
    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className='flex flex-col justify-between items-center'>
                {children}
            </div>
        </HydrationBoundary>
    )
}

export default MainNavbar;