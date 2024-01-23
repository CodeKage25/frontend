'use client'

import Image from "next/image";
import { Button } from "../ui/button";
import wallet from '@/public/empty-wallet.svg';
import { useState } from "react";
// import FundWalletDialog from "../dashboard/FundWalletDialog";

const WalletView = () => {
    const [openDialog, setOpenDialog] = useState(false);
    return (
        <div className="flex flex-col space-y-10 text-[#5F5F5F]">
            {/* <FundWalletDialog
                open={openDialog}
                setOpen={setOpenDialog}
            /> */}
            <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-8 lg:space-y-0">
                <div className="relative flex flex-col px-24 py-16 space-y-3 justify-center items-center text-black rounded-lg border-[0.5px] border-[#C4C4C4]">
                    <p className="font-normal text-center">Current Balance</p>
                    <p className="text-2xl font-semibold lg:text-3xl">400 <span className="font-normal text-sm">coins</span></p>
                    <Image className="absolute -top-[8%] right-0" src={wallet} width={100} height={100} alt="" />
                </div>
                <div className="flex flex-col space-y-4">
                    <Button className="py-6 lg:w-[140%]" onClick={() => { setOpenDialog(true) }}>Fund Wallet</Button>
                    <Button className="text-black py-6 border-primary text-primary lg:w-[140%]" variant="outline">History</Button>
                </div>
            </div>
            <div className="flex flex-col space-y-5">
                <p className="text-black text-[14px]">
                    Fees and Commissions:
                    <span className="block text-[#5F5F5F]">
                        Katangwa often charge fees or commissions for various services, such as listing items or premium features.
                        Coins can be used to cover these fees, and the platform may deduct them from the wallet balance
                    </span>
                </p>
                <p className="text-black text-[14px]">
                    Rewards and Incentives:
                    <span className="block text-[#5F5F5F]">
                        Katangwa delights in rewarding users. We may incentivize user engagement and loyalty
                        by rewarding coins for specific actions. These actions could include referring new users, completing transactions, providing feedback, or achieving certain milestones. Accumulated coins can then be redeemed for discounts, premium features, or other benefits within Katangwa.
                    </span>
                </p>
                <p className="text-black text-[14px]">
                    Trust and Security:
                    <span className="block text-[#5F5F5F]">
                        In some cases, Katangwa employs a reputation or trust system to establish credibility among users,
                        where users with higher reputation scores or trust levels can receive additional coins as a form of recognition or reward for their reliability and positive interactions.
                    </span>
                </p>
            </div>
        </div>
    )
}

export default WalletView;