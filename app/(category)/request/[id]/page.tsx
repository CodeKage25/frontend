
import { getSingleRequest } from "@/api/request/endpoints";
import LeftPane from "@/components/request/LeftPane";
import RightPane from "@/components/request/RightPane";
import getQueryClient from "@/lib/getQueryClient";
import { SpecialRequestResponseInterface } from "@/lib/types/request/SpecialRequestResponseInterface";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { ChevronRight, Store } from "lucide-react";
import Link from "next/link";

const RequestDetail = async ({ params }: {
    params: { id: string }
}) => {
    console.log(params);
    const id = params.id;
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery({
        queryKey: ['request', id],
        queryFn: () => getSingleRequest(id)
    });
    const dehydratedState = dehydrate(queryClient);
    const requestData = queryClient.getQueryData<SpecialRequestResponseInterface>(['request', id])?.data;
    console.log(requestData)
    return (
        <HydrationBoundary state={dehydratedState}>
            <section className="container flex flex-col mx-auto px-3 py-6 lg:px-[60px]">
                <div className="flex justify-between items-center">
                    <div className="flex justify-evenly items-center space-x-2">
                        <Link href={'/'} replace>
                            <Store className="w-5 h-5 text-[#B1B5C3]" />
                        </Link>
                        <ChevronRight className="w-5 h-6 text-[#737373]" />
                        {/* {/* <Link href={`/${productData?.category?.name.toLowerCase()}?catId=${productData?.categoryId}`} replace> */}
                        <p className="font-medium text-[14px] text-[#253B4B] capitalize">Requests</p>
                        {/* </Link> */}
                        <ChevronRight className="w-5 h-6 text-[#737373]" />
                        <p className="font-medium text-[14px] text-[#253B4B] capitalize">{requestData?.name}</p>
                    </div>
                </div>
                <section className="grid grid-cols-1 gap-x-8 lg:grid-cols-[3fr_1.5fr]">
                    <LeftPane />
                    <RightPane />
                </section>
            </section>
        </HydrationBoundary>
    )
}

export default RequestDetail;