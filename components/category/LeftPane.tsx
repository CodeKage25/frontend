'use client'

import { LayoutGrid } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

import { Button } from "../ui/button";
import {useEffect} from "react"
import { useQuery } from "@tanstack/react-query";
import { CategoryInterface, Subcategory } from "@/lib/types/category/CategoryInterface";
import { getCategory } from "@/api/category/endpoints";
import { useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Slider } from "../ui/slider";
import { Input } from "../ui/input";
import { currencyFormatter } from "@/lib/utils";
import PlacesAutocomplete from "./PlacesAutocomplete";


const LeftPane = ({ closeFilterSheet }: { closeFilterSheet?: () => void }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const pageParams = useParams();
    const router = useRouter();
    const category = useQuery<CategoryInterface>({ queryKey: ['category'], queryFn: getCategory });
    const selectedCategoryId = Number(searchParams.get('catId'));
    const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
    useEffect(() => {
        setSelectedCatId(selectedCategoryId);
    }, [selectedCategoryId]);
    const selectedCategory = category.data?.data.find(item => item.id === selectedCategoryId);
    const [subCat, setSubCat] = useState<Subcategory[] | undefined>(selectedCategory?.subcategory ?? []);
    const [filterParams, setFilterParams] = useState<{
        subId?: null,
        condition?: null,
        minPrice?: null,
        maxPrice?: null,
        log?: null,
        lan?: null
    } | null>(null);
    const [priceRange, setPriceRange] = useState({
        minPrice: 500, maxPrice: 10000000
    });

    useEffect(() => {
        const selectedCategory = category.data?.data.find(item => item.id === selectedCategoryId);
        const subCat = selectedCategory?.subcategory ?? [];
        setSubCat(subCat);
    }, [selectedCategoryId, category.data]);

    useEffect(() => {
        if (!selectedCategory) {
            setSubCat([]);
        }
    }, [selectedCategory]);

    return (
        <div className="flex flex-col px-5 pb-5 bg-[#F9F9F9] lg:pl-[60px] lg:pr-5">
            {/* FIRST GROUP */}
            <p className="text-[10px] text-[#202022] mt-12 font-normal uppercase mb-1">category</p>
            <Select defaultValue={
                searchParams.get('catId') === null ? undefined :
                    JSON.stringify({ id: searchParams.get('catId'), name: decodeURIComponent(pageParams.category as string) })}
                    onValueChange={(value) => {
                        setFilterParams((prev: any) => ({ ...prev, subId: value }));
                    }}>
                <SelectTrigger className="text-[#828282] rounded-[8px] text-[12px]">
                    <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                    {category.data?.data.map((item) => {
                        return <SelectItem key={item.id}
                            value={JSON.stringify({ id: item.id.toString(), name: item.name.toLowerCase() })}
                            className="text-[12px]">
                            {item.name}
                        </SelectItem>
                    })}
                </SelectContent>
            </Select>

            <Select onValueChange={(value) => {
                setFilterParams((prev: any) => ({ ...prev, subId: value }));
            }}>
                <SelectTrigger className="text-[#828282] rounded-[8px] text-[12px] mt-3">
                    <SelectValue placeholder="Select Sub Category" />
                </SelectTrigger>
                <SelectContent>
                    {
                        subCat?.map((item) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                                {item.name}
                            </SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>

            {/* SECOND GROUP */}
            <p className="text-[10px] text-[#202022] mt-8 font-normal mb-1">Condition</p>
            <Select onValueChange={(value) => {
                setFilterParams((prev: any) => ({ ...prev, condition: value }));
            }}>
                <SelectTrigger className="text-[#828282] rounded-[8px] text-[12px]">
                    <SelectValue placeholder="Select Condition" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="USED">Used</SelectItem>
                </SelectContent>
            </Select>

            <p className="text-[10px] text-[#202022] mt-4 font-normal mb-1">Location</p>
            <PlacesAutocomplete
                onLocationSelect={(lat: number, lng: number) => {
                    setFilterParams((prev: any) => ({ ...prev, lan: lat, log: lng }));
                }}
            />

            {/* THIRD GROUP */}
            <p className="text-[10px] text-[#202022] mt-8 font-normal mb-1">Price Range</p>
            <Slider onValueChange={(value) => setPriceRange({ minPrice: value[0], maxPrice: value[1] })} onValueCommit={(number) => {
                setFilterParams((prev: any) => ({ ...prev, 'minPrice': number[0].toString(), 'maxPrice': number[1].toString() }));
            }}
                min={500} max={10000000}
                defaultValue={[500, 10000000]}
                minStepsBetweenThumbs={500} step={500}
                className="mt-8 mb-7" />

            <div className="flex flex-col space-y-3">
                <Input placeholder="Min" value={currencyFormatter(priceRange.minPrice ?? 500)} />
                <Input placeholder="Max" value={currencyFormatter(priceRange.maxPrice ?? 10000000)} />
            </div>

            <div className="flex justify-between space-x-3 mt-8">
                <Button className="border border-primary text-primary w-full py-5" variant="outline"
                    onClick={() => {
                        pathname.includes('buy') ?
                            router.replace('buy') :
                            router.replace(`${pathname}?catId=1`);
                    }}>Reset</Button>
                <Button className="w-full py-5" onClick={() => {
                    const queryUrl = filterParams &&
                        Object.entries({ catId: searchParams.get('catId'), ...filterParams })
                            .filter(([key, value]) => value !== undefined && value !== null)
                            .map(([key, value]) => `${key}=${value}`)
                            .join("&")
                    const query = queryUrl ? `?${queryUrl}` : "";
                    router.replace(`${pathname}${query}`);
                    closeFilterSheet && closeFilterSheet();
                }}>Filter</Button>
            </div>
        </div >
    )
}

export default LeftPane;