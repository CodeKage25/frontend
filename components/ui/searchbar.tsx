'use client'

import { Search } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productSearch, requestSearch } from "@/api/product/endpoints";
import { useDebounce } from "usehooks-ts";
import { nanoid } from "nanoid";
import { ScrollArea } from "./scroll-area";
import { usePopper } from 'react-popper';
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Searchbar = ({ styleName }: {
    styleName: string,
}) => {

    const router = useRouter();
    const pathname = usePathname();
    const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
    const { styles, attributes } = usePopper(referenceElement, popperElement);
    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [portalElement, setPortalElement] = useState<Element | null>(null);

    useEffect(() => {
        setMounted(true);
        setPortalElement(document.getElementById("search-div"));
    }, []);

    const debouncedSearchTerm = useDebounce(searchTerm, 400);
    const { data: productSearchData } = useQuery({
        queryKey: ['product-search', debouncedSearchTerm],
        queryFn: () => productSearch(debouncedSearchTerm ?? ''),
        enabled: !!debouncedSearchTerm && !pathname.includes('view-requests')
    });

    const { data: requestSearchData } = useQuery({
        queryKey: ['request-search', debouncedSearchTerm],
        queryFn: () => requestSearch(debouncedSearchTerm ?? ''),
        enabled: !!debouncedSearchTerm && pathname.includes('view-requests')
    });

    const [searchFocus, setSearchFocus] = useState(false);

    const handleProductSearch = (e: any) => {
        const searchQuery = e.target.value;
        if (searchQuery.length === 0) {
            return;
        }
        setSearchTerm(e.target.value);
    }
    if (typeof window === undefined) { return; }

    return mounted ? (
        <div className={`${styleName} w-full flex flex-col z-30`}>
            <div ref={setReferenceElement} className="relative flex items-center mt-4">
                <Input type={'text'} className="block border-0 py-6 ring-[1px] ring-input rounded-full w-full text-xs bg-[#F0F0F1] md:text-sm placeholder:font-normal"
                    placeholder={'What item are you looking for?'}
                    onChange={handleProductSearch}
                    onFocus={() => setSearchFocus(true)}
                    onClick={() => setSearchFocus(true)}
                    onBlur={() => {
                        setTimeout(() => {
                            setSearchFocus(false);
                        }, 50)
                    }}
                    onKeyDown={(e) => {
                        e.code === 'Enter' && router.push(`/search?query=${searchTerm}`)
                    }}
                />
                <Button className="absolute top-1/2 right-0 transform -translate-y-1/2 py-6 font-semibold px-3 rounded-tr-full rounded-br-full" onClick={() => {
                    if (!!searchTerm && searchTerm.length > 0)
                        router.push(`/search?query=${searchTerm}`);
                }}>
                    <Search className='w-6 h-6' strokeWidth='1.5px' />
                </Button>
            </div>

            {
                createPortal(
                    ((productSearchData?.data?.length ?? 0) > 0) && searchFocus && (
                        <ScrollArea ref={setPopperElement} style={styles.popper}
                            {...attributes.popper} className="bg-white max-w-[90%] absolute border w-full px-4 py-2 top-[100%] mt-2 shadow-md rounded-md z-50 lg:max-w-[35%]">
                            {
                                productSearchData?.data?.map(i => (
                                    <Link key={nanoid()} href={`/${i?.category?.name?.toLowerCase()}/${i.id}`} legacyBehavior passHref
                                        className="flex flex-col hover:cursor-pointer">
                                        <a>
                                            <p className="font-medium text-sm">{i.name}</p>
                                            <p className="font-normal text-xs">{i.description}</p>
                                        </a>
                                    </Link>
                                ))
                            }
                        </ScrollArea>
                    ), portalElement!!
                )
            }

            {
                createPortal(
                    ((requestSearchData?.data?.length ?? 0) > 0) && searchFocus && (
                        <ScrollArea ref={setPopperElement} style={styles.popper}
                            {...attributes.popper} className="bg-white max-w-[90%] absolute border w-full px-4 py-2 top-[100%] mt-2 shadow-md rounded-md z-50 lg:max-w-[35%]">
                            {
                                requestSearchData?.data?.map(i => (
                                    <Link key={nanoid()} href={`/request/${i.id}`} legacyBehavior passHref
                                        className="flex flex-col hover:cursor-pointer">
                                        <a>
                                            <p className="font-medium text-sm">{i.name}</p>
                                            <p className="font-normal text-xs">{i.description}</p>
                                        </a>
                                    </Link>
                                ))
                            }
                        </ScrollArea>
                    ), portalElement!!
                )
            }
        </div>
    ) : null
}

export default Searchbar;