'use client'

import { ArchiveX, ChevronRight, SlidersHorizontal, Store } from "lucide-react";
import ProductCard from "./ProductCard";
import { Button } from "../ui/button";
import LeftPane from "./LeftPane";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getCategoryProducts } from "@/api/category/endpoints";
import { ProductInterface } from "@/lib/types/category/ProductInterface";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { nanoid } from "nanoid";
import { Suspense, useState } from "react";
import Link from "next/link";
import { productSearch } from "@/api/product/endpoints";
import Loading from "@/app/(category)/[category]/loading";
import { getAllRequest } from "@/api/request/endpoints";

const RightPane = ({ id }: { id: number }) => {
    const pageParams = useParams();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const condition = searchParams.get('condition') as string || undefined;
    const minPrice = searchParams.get('minPrice') as string || undefined;
    const maxPrice = searchParams.get('maxPrice') as string || undefined;
    const log = searchParams.get('log') as string || undefined;
    const lan = searchParams.get('lan') as string || undefined;
    const subId = searchParams.get('subId') as string || undefined;
    const { data: products, isError } = useSuspenseQuery<ProductInterface>({
        queryKey: ['category1', pathname.includes('buy') ? 'all' : id, subId, condition, minPrice, maxPrice, log, lan],
        queryFn: () => getCategoryProducts(pathname.includes('buy') ? undefined : id.toString(), subId, condition, minPrice, maxPrice, log, lan)
    });
    const [filterOpen, setFilterOpen] = useState(false);
    const [showContentState, setShowContentState] = useState(() => {
        return pageParams.category === 'view-requests' ? 1 : 0
    });
    const query = searchParams.get('query') as string || undefined;
    const { data: searchData } = useQuery({
        queryKey: ['search1', query],
        queryFn: () => productSearch(query || ''),
        enabled: !!query
    });

    const { data } = useQuery({
        queryKey: ['requests'],
        queryFn: getAllRequest
    });

    return (
        <section className="flex flex-col px-3 py-6 lg:p-10">
            <div className="flex justify-between items-center">
                <div className="hidden justify-evenly items-center space-x-2 lg:flex">
                    <Link href={'/'} replace>
                        <Store className="w-5 h-5 text-[#B1B5C3]" />
                    </Link>
                    <ChevronRight className="w-5 h-6 text-[#737373]" />
                    <p className="font-medium text-[14px] text-[#253B4B] capitalize">{decodeURIComponent(pageParams.category as string)}</p>
                </div>
                <div className="flex justify-between space-x-1 p-[5px] border-[0.5px] border-[#C4C4C4] bg-[#F9F9F9] rounded-full font-medium lg:p-[10px]">
                    <Button className={`${showContentState === 0 ? 'shadow-[0px_4px_6px_-1px_#0F0F101A] text-white' : 'text-[#253B4B]'} rounded-full px-6 py-[8px] text-[12px]`}
                        onClick={() => setShowContentState(0)} variant={`${showContentState === 0 ? 'default' : 'ghost'}`}>Listed Items</Button>
                    <Button className={`${showContentState === 1 ? 'shadow-[0px_4px_6px_-1px_#0F0F101A] text-white' : 'text-[#253B4B]'} rounded-full px-6 py-[8px] text-[12px]`}
                        onClick={() => setShowContentState(1)} variant={`${showContentState === 1 ? 'default' : 'ghost'}`}>View Requests</Button>
                </div>
                <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                    <SheetTrigger className="flex lg:hidden" asChild>
                        <Button className="ml-auto rounded-full border border-[#C4C4C4] p-[5px]" variant="outline" size="icon"><SlidersHorizontal className="text-[#B1B5C3] w-5 h-5" /></Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="px-0 py-6 overflow-y-scroll no-scrollbar">
                        <LeftPane closeFilterSheet={() => setFilterOpen(false)} />
                    </SheetContent>
                </Sheet>
            </div>

            {
                showContentState === 0 ? (
                    <>
                        <div className="grid grid-cols-2 gap-2 mt-6 lg:grid-cols-3 lg:gap-4 lg:mt-8">
                            {
                                products?.data.map((item) => <ProductCard key={nanoid()} {...item} />)
                            }
                        </div>

                        {
                            query && (<div className="grid grid-cols-2 gap-2 mt-6 lg:grid-cols-3 lg:gap-4 lg:mt-8">
                                {searchData?.data.map((item) => <ProductCard key={nanoid()} {...item} />)}
                            </div>
                            )
                        }

                        {
                            (!query && ((products?.data.length ?? 0) === 0)) && (
                                <div className="flex flex-col items-center justify-center h-full w-full">
                                    <ArchiveX className="w-16 h-16 bg-gray-300 rounded-full p-[10px] overflow-visible" />
                                    <p className="font-semibold">No Result Found</p>
                                    <p className="font-normal text-sm">You could try again finding something else</p>
                                </div>
                            )
                        }

                        {
                            (query && ((searchData?.data.length ?? 0) === 0)) && (
                                <div className="flex flex-col items-center justify-center h-full w-full">
                                    <ArchiveX className="w-16 h-16 bg-gray-300 rounded-full p-[10px] overflow-visible" />
                                    <p className="font-semibold">No Result Found</p>
                                    <p className="font-normal text-sm">You could try again finding something else</p>
                                </div>
                            )
                        }
                    </>
                ) : (data?.data.length === 0) ? (
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <ArchiveX className="w-16 h-16 bg-gray-300 rounded-full p-[10px] overflow-visible" />
                        <p className="font-semibold">No Result Found</p>
                        <p className="font-normal text-sm">You could try again finding something else</p>
                    </div>
                ) :
                    (
                        <div className="grid grid-cols-2 gap-2 mt-6 lg:grid-cols-3 lg:gap-4 lg:mt-8">
                            {
                                data?.data.map((item) => <ProductCard key={nanoid()} {...item} />)
                            }
                        </div>
                    )
            }

        </section>
    );
}

export default RightPane;