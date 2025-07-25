export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member';
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  mentions: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignees: User[];
  dueDate?: Date;
  tags: string[];
  comments: Comment[];
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  title: string;
  status: Task['status'];
  tasks: Task[];
  color: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: User;
  members: User[];
  columns: Column[];
  createdAt: Date;
  updatedAt: Date;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format',
    role: 'owner'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face&auto=format',
    role: 'admin'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format',
    role: 'member'
  },
  {
    id: '4',
    name: 'Emily Johnson',
    email: 'emily@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face&auto=format',
    role: 'member'
  }
];

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: '1',
    content: 'Great progress on this! @Sarah Wilson can you review the latest changes?',
    author: mockUsers[0],
    createdAt: new Date('2024-01-15T10:30:00'),
    mentions: ['2']
  },
  {
    id: '2',
    content: 'Sure! I\'ll take a look at it today.',
    author: mockUsers[1],
    createdAt: new Date('2024-01-15T14:20:00'),
    mentions: []
  }
];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design user authentication flow',
    description: 'Create wireframes and mockups for the login, signup, and password reset flows.',
    priority: 'high',
    status: 'in-progress',
    assignees: [mockUsers[1], mockUsers[3]],
    dueDate: new Date('2024-02-01'),
    tags: ['design', 'frontend'],
    comments: mockComments,
    attachments: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Set up database schema',
    description: 'Design and implement the database structure for users, projects, and tasks.',
    priority: 'urgent',
    status: 'todo',
    assignees: [mockUsers[2]],
    dueDate: new Date('2024-01-25'),
    tags: ['backend', 'database'],
    comments: [],
    attachments: [],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    title: 'Implement drag and drop functionality',
    description: 'Add ability to drag tasks between columns on the kanban board.',
    priority: 'medium',
    status: 'review',
    assignees: [mockUsers[0]],
    dueDate: new Date('2024-02-05'),
    tags: ['frontend', 'javascript'],
    comments: [],
    attachments: [],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '4',
    title: 'Write API documentation',
    description: 'Document all API endpoints with examples and response schemas.',
    priority: 'low',
    status: 'done',
    assignees: [mockUsers[2]],
    tags: ['documentation', 'backend'],
    comments: [],
    attachments: [],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-13')
  }
];

// Mock Columns
export const mockColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    status: 'todo',
    tasks: mockTasks.filter(task => task.status === 'todo'),
    color: 'hsl(var(--muted))'
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    status: 'in-progress',
    tasks: mockTasks.filter(task => task.status === 'in-progress'),
    color: 'hsl(199 89% 48%)'
  },
  {
    id: 'review',
    title: 'Review',
    status: 'review',
    tasks: mockTasks.filter(task => task.status === 'review'),
    color: 'hsl(38 92% 50%)'
  },
  {
    id: 'done',
    title: 'Done',
    status: 'done',
    tasks: mockTasks.filter(task => task.status === 'done'),
    color: 'hsl(142 76% 36%)'
  }
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'CollabGrid Pro',
    description: 'A collaborative project management tool with real-time features',
    owner: mockUsers[0],
    members: mockUsers,
    columns: mockColumns,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Mobile App Redesign',
    description: 'Complete redesign of our mobile application',
    owner: mockUsers[1],
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    columns: [],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12')
  }
];

export const currentUser = mockUsers[0];