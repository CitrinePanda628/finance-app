import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Calendar as CalenderIcon } from "lucide-react";
import { format } from "date-fns";

import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { SelectHandler } from "react-day-picker";

type Props = {
    value?: Date;
    onChange?: SelectHandler<{ mode: "single" }>
    disabled?: boolean;
}

export const DatePicker = ({
    value,
    onChange,
    disabled,
}: Props) => {
    return (
    <Popover>
        <PopoverTrigger asChild>
            <Button
            disabled={disabled}
            variant="outline"
            className={cn(
                    "w-full justify-start text-left font-normal",
                     !value && "text-muted-foreground",
            )}
            >
                <CalenderIcon className="size-4 mr-2" />
                {value ? format(value, "PPP") : <span>Pick a Date</span>}
            </Button>
        </PopoverTrigger>
            <PopoverContent 
                className="z-50 w-auto p-0 bg-white" 
                align="start"
                side="bottom"
                sideOffset={4}
            >
            <Calendar
                mode="single"
                selected={value}
                onSelect={onChange}
                disabled={disabled}
                autoFocus
            />
        </PopoverContent>
    </Popover>
    )
}