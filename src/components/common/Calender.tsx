"use client";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CL, ChevronDownIcon } from "lucide-react";

interface CalendarPopoverProps {
  value?: Date;
  mode?: "single" | "range"; 
  captionLayout?: "dropdown" | "buttons"; 
  onClick?: (date: Date | Date[] | undefined) => void; 
  btnClassName?: string; 
  dateFormat?: string; 
  ChevronIcon?: boolean; 
  CalenderIcon?: string; 
}

const CalendarPopover: React.FC<CalendarPopoverProps> = ({ 
  value,
  mode = "single",
  captionLayout = "dropdown",
  onClick,
  btnClassName = 'w-48 justify-between font-normal rounded-[50px] py-[14px]',
  dateFormat = "DD-MM-YYYY",
  ChevronIcon=true,
  CalenderIcon="left"
 }) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(value);

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={btnClassName}
          >
            {CalenderIcon=="left" && <CL className="w-4 h-4 text-gray-500" />}
            {date ? moment(date).format(dateFormat) : moment(new Date()).format(dateFormat)}
            {CalenderIcon=="right" && <CL className="w-4 h-4 text-gray-500" />}
            {ChevronIcon && <ChevronDownIcon />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(selectedDate) => {
              setDate(selectedDate);
              onClick?.(selectedDate);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CalendarPopover;
