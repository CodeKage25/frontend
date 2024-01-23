import Link from "next/link";
import { FC } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface FooterInterface {
    title: string;
    cta: string[];
}

const FooterCTA: FC<FooterInterface> = ({ title, cta }) => {
    return (
        <div className="flex flex-col">
            <p className="font-medium text-xs text-white uppercase md:text-[14px]">{title}</p>
            <div className="flex flex-col justify-start mt-4 space-y-3">
                {
                    cta.map((item) => (
                        <Link href={`/${item}`} key={item} className="capitalize text-left text-white font-normal text-[14px] hover:underline">
                            {item}
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

const Footer = () => {
    return (
        <div className="w-full px-4 pt-[50px] pb-[40px] flex flex-col justify-center items-center bg-[#253B4B] lg:px-[80px] lg:pt-[100px] lg:pb-[40px]">
            <div className="w-full flex flex-col justify-between mb-[70px] lg:flex-row lg:space-x-10">
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:flex lg:space-x-14 lg:basis-2/3">
                    <FooterCTA
                        {...companyCta}
                    />

                    <FooterCTA
                        {...supportHelpCta}
                    />

                    <FooterCTA
                        {...featuresCta}
                    />

                    <FooterCTA
                        {...socialCta}
                    />
                </div>
                <div className="w-full mt-16 flex flex-col space-y-5 lg:mt-0 lg:max-w-[35%]">
                    <p className="text-white font-medium text-[14px] md:text-[14px]">Join our Newsletter</p>
                    <div className="relative flex items-center basis-1/3">
                        <Input type={'email'} className="block border-0 py-7 ring-[1px] ring-input rounded-[10px] w-full text-sm bg-[#F0F0F1]"
                            placeholder={'Email address'} />
                        <Button className="absolute top-1/2 right-[2%] transform -translate-y-1/2 py-1 font-semibold px-5">Submit</Button>
                    </div>
                </div>
            </div>
            <Separator />
            <p className="font-normal text-[12px] text-white mt-4 md:text-[14px]">Katangwa @2023 All right reserved</p>
        </div>
    )
}

export default Footer;

const companyCta: FooterInterface = {
    title: 'company',
    cta: ['about', 'privacy policy', 'Terms and Condition']
}

const supportHelpCta: FooterInterface = {
    title: 'support & help',
    cta: ['safety tips', 'disclaimer', 'FAQs', 'contact us']
}

const featuresCta: FooterInterface = {
    title: 'features',
    cta: ['buy', 'sell', 'request']
}

const socialCta: FooterInterface = {
    title: 'socials',
    cta: ['linkedin', 'facebook', 'instagram']
}