
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ViewSelectorProps {
  currentView: string;
  onViewChange: (view: any) => void;
}

export function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  const views = [
    { id: 'dayGridMonth', label: 'Month' },
    { id: 'timeGridWeek', label: 'Week' },
    { id: 'timeGridDay', label: 'Day' },
    { id: 'listWeek', label: 'List' },
  ];

  return (
    <div className="flex space-x-1 bg-secondary rounded-lg p-1">
      {views.map((view) => (
        <Button
          key={view.id}
          variant="ghost"
          size="sm"
          onClick={() => onViewChange(view.id)}
          className={cn(
            "text-sm",
            currentView === view.id && "bg-white shadow-sm dark:bg-gray-800"
          )}
        >
          {view.label}
        </Button>
      ))}
    </div>
  );
}
