import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Task, mockUsers } from "@/lib/mockData";
import { 
  Calendar,
  Clock,
  Flag,
  Paperclip,
  Send,
  X,
  Edit,
  Trash2,
  Users,
  MessageCircle,
  User
} from "lucide-react";

interface TaskModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

const TaskModal = ({ task, open, onClose, onUpdate, onDelete }: TaskModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [newComment, setNewComment] = useState("");

  if (!task) return null;

  const handleSave = () => {
    onUpdate(task.id, editedTask);
    setIsEditing(false);
    setEditedTask({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask({});
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        content: newComment,
        author: mockUsers[0], // Current user
        createdAt: new Date(),
        mentions: []
      };
      onUpdate(task.id, { 
        comments: [...task.comments, comment] 
      });
      setNewComment("");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-50';
      case 'high': return 'text-orange-500 bg-orange-50';
      case 'medium': return 'text-yellow-500 bg-yellow-50';
      case 'low': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'review': return 'bg-yellow-100 text-yellow-700';
      case 'done': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editedTask.title || task.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="text-lg font-semibold border-none p-0 h-auto shadow-none"
                placeholder="Task title"
              />
            ) : (
              <DialogTitle className="text-xl">{task.title}</DialogTitle>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave}>Save</Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(task.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </DialogHeader>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Description</Label>
              {isEditing ? (
                <Textarea
                  value={editedTask.description || task.description}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                  placeholder="Add a description..."
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {task.description || "No description provided."}
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Tags</Label>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
                {isEditing && (
                  <Button variant="outline" size="sm" className="h-6">
                    + Add Tag
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* Comments */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <Label className="text-sm font-medium">
                  Comments ({task.comments.length})
                </Label>
              </div>

              {/* Comment List */}
              <div className="space-y-4">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                      <AvatarFallback className="text-xs">
                        {comment.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{comment.author.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {comment.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mockUsers[0].avatar} alt={mockUsers[0].name} />
                  <AvatarFallback className="text-xs">
                    {mockUsers[0].name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Status</Label>
              {isEditing ? (
                <Select
                  value={editedTask.status || task.status}
                  onValueChange={(value) => setEditedTask({ ...editedTask, status: value as Task['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={getStatusColor(task.status)}>
                  {task.status.replace('-', ' ')}
                </Badge>
              )}
            </div>

            {/* Priority */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Priority</Label>
              {isEditing ? (
                <Select
                  value={editedTask.priority || task.priority}
                  onValueChange={(value) => setEditedTask({ ...editedTask, priority: value as Task['priority'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <Flag className={`h-4 w-4 ${getPriorityColor(task.priority).split(' ')[0]}`} />
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
              )}
            </div>

            {/* Assignees */}
            <div>
              <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Users className="h-4 w-4" />
                Assignees
              </Label>
              <div className="space-y-2">
                {task.assignees.map((assignee) => (
                  <div key={assignee.id} className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={assignee.avatar} alt={assignee.name} />
                      <AvatarFallback className="text-xs">
                        {assignee.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{assignee.name}</span>
                    {isEditing && (
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto">
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <Button variant="outline" size="sm" className="w-full">
                    <User className="h-4 w-4 mr-2" />
                    Add Assignee
                  </Button>
                )}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Due Date
              </Label>
              {task.dueDate ? (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  {task.dueDate.toLocaleDateString()}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">No due date</span>
              )}
            </div>

            {/* Attachments */}
            <div>
              <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments ({task.attachments.length})
              </Label>
              {task.attachments.length > 0 ? (
                <div className="space-y-2">
                  {task.attachments.map((attachment, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {attachment}
                    </div>
                  ))}
                </div>
              ) : (
                <Button variant="outline" size="sm" className="w-full">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Add Attachment
                </Button>
              )}
            </div>

            <Separator />

            {/* Metadata */}
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Created: {task.createdAt.toLocaleDateString()}</div>
              <div>Updated: {task.updatedAt.toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;