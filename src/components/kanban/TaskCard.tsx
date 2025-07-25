import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/mockData";
import { 
  Calendar, 
  MessageCircle, 
  Paperclip, 
  Flag,
  MoreHorizontal 
} from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: () => void;
}

const TaskCard = ({ task, index, onClick }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const isPastDue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card 
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
            snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
          }`}
          onClick={onClick}
        >
          <CardContent className="p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-sm leading-tight line-clamp-2">
                {task.title}
              </h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                    {tag}
                  </Badge>
                ))}
                {task.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs px-2 py-0">
                    +{task.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}

            {/* Priority & Due Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flag className={`h-3 w-3 ${getPriorityColor(task.priority)}`} />
                <span className="text-xs text-muted-foreground capitalize">
                  {task.priority}
                </span>
              </div>
              
              {task.dueDate && (
                <div className={`flex items-center gap-1 text-xs ${
                  isPastDue ? 'text-red-500' : 'text-muted-foreground'
                }`}>
                  <Calendar className="h-3 w-3" />
                  {task.dueDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1">
              {/* Assignees */}
              <div className="flex -space-x-1">
                {task.assignees.slice(0, 3).map((assignee) => (
                  <Avatar key={assignee.id} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={assignee.avatar} alt={assignee.name} />
                    <AvatarFallback className="text-xs">
                      {assignee.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {task.assignees.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                    +{task.assignees.length - 3}
                  </div>
                )}
              </div>

              {/* Indicators */}
              <div className="flex items-center gap-2">
                {task.comments.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageCircle className="h-3 w-3" />
                    {task.comments.length}
                  </div>
                )}
                {task.attachments.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Paperclip className="h-3 w-3" />
                    {task.attachments.length}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default TaskCard;