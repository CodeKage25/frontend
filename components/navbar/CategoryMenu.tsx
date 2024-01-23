'use client'

import { FC, useState } from "react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import { CategoryInterface, Subcategory } from "@/lib/types/category/CategoryInterface";
import Link from "next/link";
import { nanoid } from "nanoid";

const CategoryMenu: FC<CategoryInterface> = ({ data }) => {
    const [showRightPane, setShowRightPane] = useState(false);
    const [subCat, setSubCat] = useState<Subcategory[]>([]);
    const [hoverItem, setHoverItem] = useState<number>();

    return (
        <NavigationMenu className="z-40">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-black font-medium text-[14px]">Category</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="grid gap-3 lg:w-[800px] lg:grid-cols-[1.5fr_3fr]">
                            <ul className="bg-primary py-4 pl-6">
                                {
                                    data?.map((item) => (
                                        <li key={nanoid()} className={`${hoverItem === item.id ? 'bg-white text-primary' : 'text-white'} py-3 pl-2 font-semibold text-[14px] transition-all duration-500 hover:bg-white hover:text-primary hover:cursor-pointer`}
                                            onMouseEnter={() => {
                                                setShowRightPane(true);
                                                setHoverItem(item.id);
                                                setSubCat(item.subcategory)
                                            }}>
                                            {item.name}
                                        </li>
                                    ))
                                }
                            </ul>

                            <div className={`${showRightPane ? 'block' : 'hidden'} py-4 pl-6`}
                                onMouseLeave={() => {
                                    setShowRightPane(false);
                                    setHoverItem(-1);
                                }}>
                                {
                                    subCat?.map((item) => (
                                        <div key={nanoid()} className="flex flex-col font-normal text-[14px] text-[#253B4B]">
                                            <Link href="#" legacyBehavior passHref>
                                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                    {item.name}
                                                </NavigationMenuLink>
                                            </Link>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export default CategoryMenu;