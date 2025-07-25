import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/layout/Navbar";
import KanbanColumn from "@/components/kanban/KanbanColumn";
import TaskModal from "@/components/modals/TaskModal";
import { mockProjects, Project, Task, Column } from "@/lib/mockData";
import { 
  ArrowLeft, 
  Settings, 
  Filter, 
  Users, 
  Calendar,
  Plus,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

const ProjectBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredColumns, setFilteredColumns] = useState<Column[]>([]);

  useEffect(() => {
    const foundProject = mockProjects.find(p => p.id === id);
    if (foundProject) {
      setProject(foundProject);
      setFilteredColumns(foundProject.columns);
    }
  }, [id]);

  useEffect(() => {
    if (project) {
      if (searchQuery.trim()) {
        const filtered = project.columns.map(column => ({
          ...column,
          tasks: column.tasks.filter(task => 
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        }));
        setFilteredColumns(filtered);
      } else {
        setFilteredColumns(project.columns);
      }
    }
  }, [searchQuery, project]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !project) return;

    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const newColumns = [...project.columns];
    const sourceColumn = newColumns.find(col => col.id === source.droppableId);
    const destColumn = newColumns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const [movedTask] = sourceColumn.tasks.splice(source.index, 1);
    movedTask.status = destColumn.status;
    destColumn.tasks.splice(destination.index, 0, movedTask);

    setProject({ ...project, columns: newColumns });
  };

  const handleTaskClick = (taskId: string) => {
    const task = project?.columns
      .flatMap(col => col.tasks)
      .find(t => t.id === taskId);
    
    if (task) {
      setSelectedTask(task);
      setIsTaskModalOpen(true);
    }
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    if (!project) return;

    const newColumns = project.columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    }));

    setProject({ ...project, columns: newColumns });
    
    // Update selected task if it's the one being edited
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, ...updates });
    }
  };

  const handleTaskDelete = (taskId: string) => {
    if (!project) return;

    const newColumns = project.columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => task.id !== taskId)
    }));

    setProject({ ...project, columns: newColumns });
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleAddTask = (columnId: string) => {
    // Mock task creation - in real app, this would create a new task
    console.log("Add task to column:", columnId);
  };

  if (!project) {
    return <div>Project not found</div>;
  }

  const totalTasks = project.columns.reduce((acc, col) => acc + col.tasks.length, 0);
  const completedTasks = project.columns.find(col => col.status === 'done')?.tasks.length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Project Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold">{project.name}</h1>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
                <Badge variant="secondary">
                  {totalTasks} tasks
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Team Members */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {project.members.slice(0, 5).map((member) => (
                    <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-xs">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project.members.length > 5 && (
                    <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                      +{project.members.length - 5}
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Users className="h-4 w-4" />
                  Invite
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Stats */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search tasks..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{completedTasks}/{totalTasks} completed</span>
                <div className="w-24 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="container mx-auto p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-300px)]">
            {filteredColumns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onTaskClick={handleTaskClick}
                onAddTask={handleAddTask}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Task Modal */}
      <TaskModal
        task={selectedTask}
        open={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />
    </div>
  );
};

export default ProjectBoard;