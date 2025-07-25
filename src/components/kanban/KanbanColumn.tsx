import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Column } from "@/lib/mockData";
import TaskCard from "./TaskCard";
import { Plus, MoreHorizontal } from "lucide-react";
import { Droppable } from "@hello-pangea/dnd";

interface KanbanColumnProps {
  column: Column;
  onTaskClick: (taskId: string) => void;
  onAddTask: (columnId: string) => void;
}

const KanbanColumn = ({ column, onTaskClick, onAddTask }: KanbanColumnProps) => {
  const getColumnColor = (status: string) => {
    switch (status) {
      case 'todo': return 'border-l-gray-400';
      case 'in-progress': return 'border-l-blue-500';
      case 'review': return 'border-l-yellow-500';
      case 'done': return 'border-l-green-500';
      default: return 'border-l-gray-400';
    }
  };

  return (
    <Card className={`flex flex-col h-full border-l-4 ${getColumnColor(column.status)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{column.title}</h3>
            <Badge variant="secondary" className="text-xs">
              {column.tasks.length}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={() => onAddTask(column.id)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <CardContent 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-3 p-4 pt-0 ${
              snapshot.isDraggingOver ? 'bg-muted/50' : ''
            }`}
          >
            {column.tasks.map((task, index) => (
              <div key={task.id} className="group">
                <TaskCard 
                  task={task} 
                  index={index}
                  onClick={() => onTaskClick(task.id)}
                />
              </div>
            ))}
            {provided.placeholder}
            
            {/* Add Task Button */}
            <Button 
              variant="ghost" 
              className="w-full border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50 text-muted-foreground justify-start gap-2"
              onClick={() => onAddTask(column.id)}
            >
              <Plus className="h-4 w-4" />
              Add a task
            </Button>
          </CardContent>
        )}
      </Droppable>
    </Card>
  );
};

export default KanbanColumn;