import WalletView from "@/components/wallet/WalletView";

const Wallet = () => {
    return (
        <div className="flex flex-col">
            <p className="hidden font-medium lg:block">Wallet</p>
            <div className="border-0 rounded-xl px-4 lg:mt-4 lg:p-10 lg:border-[0.5px] lg:border-[#C4C4C4]">
                <WalletView />
            </div>
        </div>)
}

export default Wallet;