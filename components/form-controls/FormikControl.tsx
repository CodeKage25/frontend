import InputControl from "./InputControl";
import InputControlWithLabel from "./InputControlWithLabel";
import InputTextarea from "./InputTextarea";
import SelectControl from "./SelectControl";

interface ControlProps {
    name: string;
    label: string;
    type: string;
    control: string;
    icon?: string;
    placeholder?: string;
    options?: any[];
    handleChange?: (id: number) => void;
    disabled?: boolean
}

export default function FormikControl({ control, ...rest }: ControlProps) {
    switch (control) {
        case 'input': return <InputControl {...rest} />
        case 'input-label': return <InputControlWithLabel {...rest} />
        case 'textarea': return <InputTextarea {...rest} />
        case 'select': return <SelectControl {...rest} />
        default: return null
    }
}