import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FilterOption {
  label: string;
  value: string;
  checked: boolean;
}

interface FilterGroup {
  label: string;
  options: FilterOption[];
}

interface TableFiltersProps {
  filters: FilterGroup[];
  onFilterChange: (groupLabel: string, value: string, checked: boolean) => void;
  onClearAll: () => void;
  activeCount: number;
}

const TableFilters = ({ filters, onFilterChange, onClearAll, activeCount }: TableFiltersProps) => {
  return (
    <div className="flex items-center gap-3">
      {filters.map((group) => (
        <DropdownMenu key={group.label}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-border bg-white">
              <Filter className="w-4 h-4 mr-2" />
              {group.label}
              {group.options.some(opt => opt.checked) && (
                <Badge className="ml-2 px-1.5 py-0 text-xs bg-primary text-primary-foreground">
                  {group.options.filter(opt => opt.checked).length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white z-50" align="start">
            <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {group.options.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={option.checked}
                onCheckedChange={(checked) => onFilterChange(group.label, option.value, checked)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
      
      {activeCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4 mr-1" />
          Clear all ({activeCount})
        </Button>
      )}
    </div>
  );
};

export default TableFilters;
