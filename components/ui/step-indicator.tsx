import { Check } from "lucide-react";

const StepIndicator = ({ position, selected, completed }: {
    position: number,
    selected: boolean,
    completed: boolean
}) => {
    return (
        <div className="flex">
            <div className={`${completed ? 'bg-primary' : selected ? 'bg-[#09253B]' : 'bg-[#C4C4C4]'} w-[48px] h-[48px] flex justify-center items-center rounded-full text-white`}>
                {completed ? <Check /> : <span className="font-medium">{position}</span>}
            </div>
        </div>
    )
}

export default StepIndicator;