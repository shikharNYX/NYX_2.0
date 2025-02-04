/**
 * @author Healium Digital
 * Date Range Picker Component
 * Handles date range selection for filtering analytics data
 */

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DateRangePickerProps {
  date: { from: Date; to: Date };
  setDate: (date: { from: Date; to: Date }) => void;
}

export function DateRangePicker({ date, setDate }: DateRangePickerProps) {
  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-amber-100">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(date.from, "MM/dd/yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date.from}
            onSelect={(newDate) => newDate && setDate({ ...date, from: newDate })}
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-amber-100">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(date.to, "MM/dd/yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date.to}
            onSelect={(newDate) => newDate && setDate({ ...date, to: newDate })}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}