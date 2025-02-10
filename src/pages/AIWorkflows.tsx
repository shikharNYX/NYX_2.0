import * as React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, { 
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  updateEdge,
  MarkerType,
  Position,
  BackgroundVariant,
  Panel,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import { 
  Activity,
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  DollarSign,
  FileDown,
  HelpCircle,
  Home,
  Info,
  LineChart,
  Mail,
  MessageSquare,
  Pause,
  Play,
  Plus,
  RotateCw,
  Settings,
  Share2,
  Sparkles,
  Target,
  Users,
  type LucideIcon 
} from 'lucide-react';
import CustomNode from '@/components/CustomNode';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from 'next-themes';

interface SubStep {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
}

interface WorkflowStep {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  subSteps: SubStep[];
  type: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  activeInstances: number;
  successRate: number;
  completedCount: number;
  steps: WorkflowStep[];
}

interface WorkflowCardProps {
  workflow: Workflow;
}

interface CreativeAsset {
  url: string;
  aspectRatio: string;
  type: 'image' | 'video';
}

interface GeneratedContent {
  headlines: string[];
  descriptions: string[];
  captions: string[];
}

interface CampaignConfig {
  name: string;
  brandPersona: string;
  targetDemographic: {
    ageRange: { min: number; max: number };
    gender: string[];
    locations: string[];
  };
  adPlatforms: {
    [key: string]: { selected: boolean; budget: number };
  };
  budget: {
    total: number;
    currency: string;
  };
  dates: {
    start: string;
    end: string;
  };
}

const workflowTemplates: Workflow[] = [
  {
    id: '1',
    name: 'Traffic Campaign',
    description: 'Setup and launch traffic campaigns',
    activeInstances: 5,
    successRate: 85,
    completedCount: 150,
    steps: [
      {
        name: 'Campaign Planning',
        status: 'pending',
        subSteps: [
          { name: 'Naming your ad campaign', status: 'pending' },
          { name: 'Defining brand persona', status: 'pending' },
          { name: 'Configuring target demographic', status: 'pending' },
          { name: 'Selecting relevant ad platforms', status: 'pending' },
          { name: 'Allocating total budget', status: 'pending' },
          { name: 'Distributing budget between ad platforms', status: 'pending' },
          { name: 'Determining campaign start and end date', status: 'pending' }
        ],
        type: 'campaign-planning'
      },
      {
        name: 'Creative Selection',
        status: 'pending',
        subSteps: [
          { name: 'Defining aspect ratios', status: 'pending' },
          { name: 'Thinking best visual concept', status: 'pending' },
          { name: 'Determining no of images to be generated', status: 'pending' },
          { name: 'Generating images', status: 'pending' },
          { name: 'Checking conversion potential of images', status: 'pending' },
          { name: 'Enhancing images', status: 'pending' }
        ],
        type: 'creative-selection'
      },
      {
        name: 'Ad Copy',
        status: 'pending',
        subSteps: [
          { name: 'Writing headlines', status: 'pending' },
          { name: 'Writing captions', status: 'pending' },
          { name: 'Writing descriptions', status: 'pending' }
        ],
        type: 'ad-copy'
      },
      {
        name: 'User Review',
        status: 'pending',
        subSteps: [
          { name: 'Review campaign details', status: 'pending' }
        ],
        type: 'user-review'
      }
    ]
  },
  {
    id: '2',
    name: 'Social Media Automation',
    description: 'Automate social media content creation and posting',
    activeInstances: 3,
    successRate: 92,
    completedCount: 230,
    steps: [
      {
        name: 'Content Analysis',
        status: 'pending',
        subSteps: [
          { name: 'Analyzing engagement metrics', status: 'pending' },
          { name: 'Identifying top-performing content', status: 'pending' },
          { name: 'Determining content gaps', status: 'pending' }
        ],
        type: 'content-analysis'
      },
      {
        name: 'Content Creation',
        status: 'pending',
        subSteps: [
          { name: 'Creating social media posts', status: 'pending' },
          { name: 'Designing social media graphics', status: 'pending' },
          { name: 'Writing social media captions', status: 'pending' }
        ],
        type: 'content-creation'
      },
      {
        name: 'Content Publishing',
        status: 'pending',
        subSteps: [
          { name: 'Scheduling social media posts', status: 'pending' },
          { name: 'Publishing social media posts', status: 'pending' }
        ],
        type: 'content-publishing'
      }
    ]
  }
];

const defaultSteps: WorkflowStep[] = [
  {
    name: 'Campaign Planning',
    status: 'pending',
    subSteps: [
      { name: 'Naming your ad campaign', status: 'pending' },
      { name: 'Defining brand persona', status: 'pending' },
      { name: 'Configuring target demographic', status: 'pending' },
      { name: 'Selecting relevant ad platforms', status: 'pending' },
      { name: 'Allocating total budget', status: 'pending' },
      { name: 'Distributing budget between ad platforms', status: 'pending' },
      { name: 'Determining campaign start and end date', status: 'pending' }
    ],
    type: 'campaign-planning'
  },
  {
    name: 'Creative Selection',
    status: 'pending',
    subSteps: [
      { name: 'Defining aspect ratios', status: 'pending' },
      { name: 'Thinking best visual concept', status: 'pending' },
      { name: 'Determining no of images to be generated', status: 'pending' },
      { name: 'Generating images', status: 'pending' },
      { name: 'Checking conversion potential of images', status: 'pending' },
      { name: 'Enhancing images', status: 'pending' }
    ],
    type: 'creative-selection'
  },
  {
    name: 'Ad Copy',
    status: 'pending',
    subSteps: [
      { name: 'Writing headlines', status: 'pending' },
      { name: 'Writing captions', status: 'pending' },
      { name: 'Writing descriptions', status: 'pending' }
    ],
    type: 'ad-copy'
  },
  {
    name: 'User Review',
    status: 'pending',
    subSteps: [
      { name: 'Review campaign details', status: 'pending' }
    ],
    type: 'user-review'
  }
];

interface StepType {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  subSteps: { name: string; status: WorkflowStep['status'] }[];
  type: string;
}

const stepTypes: StepType[] = [
  {
    id: 'content-creation',
    name: 'Content Creation',
    description: 'Create content for your campaign',
    icon: MessageSquare,
    subSteps: [
      { name: 'Creating social media posts', status: 'pending' },
      { name: 'Designing social media graphics', status: 'pending' },
      { name: 'Writing social media captions', status: 'pending' }
    ],
    type: 'content-creation'
  },
  {
    id: 'target-audience',
    name: 'Target Audience',
    description: 'Define your target audience',
    icon: Target,
    subSteps: [
      { name: 'Defining target audience', status: 'pending' },
      { name: 'Configuring target demographic', status: 'pending' },
      { name: 'Selecting relevant ad platforms', status: 'pending' }
    ],
    type: 'target-audience'
  },
  {
    id: 'social-schedule',
    name: 'Social Schedule',
    description: 'Create posting schedule',
    icon: Calendar,
    subSteps: [
      { name: 'Scheduling social media posts', status: 'pending' },
      { name: 'Publishing social media posts', status: 'pending' }
    ],
    type: 'social-schedule'
  },
  {
    id: 'performance-tracking',
    name: 'Performance Tracking',
    description: 'Set up tracking metrics',
    icon: LineChart,
    subSteps: [
      { name: 'Setting up tracking metrics', status: 'pending' },
      { name: 'Monitoring campaign performance', status: 'pending' }
    ],
    type: 'performance-tracking'
  },
  {
    id: 'distribution',
    name: 'Distribution',
    description: 'Configure content distribution',
    icon: Share2,
    subSteps: [
      { name: 'Configuring content distribution', status: 'pending' },
      { name: 'Publishing content', status: 'pending' }
    ],
    type: 'distribution'
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Configure workflow settings',
    icon: Settings,
    subSteps: [
      { name: 'Configuring workflow settings', status: 'pending' },
      { name: 'Saving changes', status: 'pending' }
    ],
    type: 'settings'
  }
] as const;

const getThemeClasses = (theme: string) => {
  if (theme === 'light') {
    return {
      background: 'min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50',
      text: 'text-gray-900',
      subText: 'text-gray-600',
      card: 'bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow',
      cardHeader: 'bg-gray-50 border-b border-gray-200',
      cardTitle: 'text-gray-900 font-semibold text-lg',
      cardDescription: 'text-gray-600 mt-1',
      button: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm',
      buttonOutline: 'bg-[#2D1B69]/30 hover:bg-[#2D1B69] text-purple-200 border border-purple-500/20',
      input: 'bg-white border-gray-300 focus:border-purple-500 text-gray-900 placeholder:text-gray-500',
      textarea: 'w-full px-3 py-2 bg-white border border-gray-300 focus:border-purple-500 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none rounded-md',
      select: 'bg-white border-gray-300 text-gray-900',
      dialog: 'bg-white shadow-lg',
      dialogHeader: 'bg-gray-50 border-b border-gray-200',
      flowBackground: 'bg-gray-50',
      nodeBackground: 'bg-white',
      nodeBorder: 'border-gray-300',
      nodeText: 'text-gray-900',
      edgeStroke: '#4B5563',
      controlsBackground: 'bg-white shadow-md border border-gray-200',
      controlsButton: 'text-gray-700 hover:text-purple-600',
      statusBadge: {
        waiting: 'bg-gray-100 text-gray-700',
        running: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        error: 'bg-red-100 text-red-700'
      },
      heading: 'text-gray-900 font-semibold',
      link: 'text-purple-600 hover:text-purple-700',
      progressBar: 'bg-gray-200',
      progressBarFill: 'bg-purple-600',
      breadcrumb: 'text-gray-700 hover:text-purple-600 font-medium flex items-center',
      breadcrumbIcon: 'text-gray-400',
      selectContent: 'bg-white border-gray-200',
      selectItem: 'bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200'
    };
  }
  return {
    background: 'min-h-screen bg-gradient-to-b from-[#0F0720] via-[#1A0B2E] to-[#0F0720]',
    text: 'text-purple-200',
    subText: 'text-purple-300/70',
    card: 'bg-[#1A0B2E] border border-purple-900 shadow-purple-900/20 hover:shadow-purple-900/30',
    cardHeader: 'bg-transparent',
    cardTitle: 'text-purple-200 font-semibold text-lg',
    cardDescription: 'text-purple-300/70 mt-1',
    button: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-900/30',
    secondaryButton: 'bg-purple-900/30 hover:bg-purple-900/50 text-purple-200',
    input: 'bg-[#150923] border-purple-900 focus:border-purple-500 text-purple-200 placeholder:text-purple-400/50',
    textarea: 'w-full px-3 py-2 bg-[#150923] border border-purple-900 focus:border-purple-500 text-purple-200 placeholder:text-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none rounded-md',
    select: 'bg-[#150923] border-purple-900 text-purple-200',
    dialog: 'bg-[#1A0B2E] shadow-purple-900/20',
    dialogHeader: 'bg-[#150923] border-b border-purple-900/50',
    flowBackground: 'bg-[#150923]',
    nodeBackground: 'bg-[#1A0B2E]',
    nodeBorder: 'border-purple-900',
    nodeText: 'text-purple-200',
    edgeStroke: '#9333ea',
    controlsBackground: 'bg-[#150923] shadow-purple-900/20 border border-purple-900/50',
    controlsButton: 'text-purple-200 hover:text-purple-400',
    statusBadge: {
      waiting: 'bg-purple-400/5 text-purple-400/50',
      running: 'bg-purple-400/10 text-purple-400',
      completed: 'bg-green-400/10 text-green-400',
      error: 'bg-red-400/10 text-red-400'
    },
    heading: 'text-purple-200 font-semibold',
    link: 'text-purple-400 hover:text-purple-300',
    progressBar: 'bg-purple-900/50',
    progressBarFill: 'bg-purple-500',
    breadcrumb: 'text-purple-200 hover:text-purple-300 font-medium flex items-center',
    breadcrumbIcon: 'text-purple-300/60',
    selectContent: 'bg-[#1A0B2E] border-purple-900/50',
    selectItem: 'bg-[#2D1B69]/40 hover:bg-[#2D1B69] text-purple-200 border border-purple-500/20'
  };
};

type WorkflowStepStatus = 'pending' | 'running' | 'completed' | 'error';

interface WorkflowStep {
  name: string;
  status: WorkflowStepStatus;
  subSteps: { name: string; status: WorkflowStepStatus }[];
  type: string;
}

interface WorkflowCardProps {
  workflow: Workflow;
}

const WorkflowCard = ({ workflow }: WorkflowCardProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [currentSteps, setCurrentSteps] = useState<WorkflowStep[]>(defaultSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [currentSubStepIndex, setCurrentSubStepIndex] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [nodePositions, setNodePositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [countdown, setCountdown] = useState<number>(10);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showAddStepDialog, setShowAddStepDialog] = useState(false);

  React.useEffect(() => {
    if (isReviewDialogOpen && !isPaused && countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handlePublishCampaign();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isReviewDialogOpen, isPaused, countdown]);

  const [creativeAssets, setCreativeAssets] = useState<{images: CreativeAsset[]}>({
    images: [
      {
        url: 'https://via.placeholder.com/400x400',
        aspectRatio: '1:1',
        type: 'image'
      },
      {
        url: 'https://via.placeholder.com/400x400',
        aspectRatio: '1:1',
        type: 'image'
      },
      {
        url: 'https://via.placeholder.com/400x400',
        aspectRatio: '1:1',
        type: 'image'
      }
    ]
  });

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({
    headlines: [
      'Experience Innovation Today',
      'Transform Your Business Now',
      'Unlock Your Potential'
    ],
    descriptions: [
      'Discover cutting-edge solutions that drive growth and innovation for your business needs.',
      'Transform your workflow with our advanced AI-powered tools and solutions.',
      'Take your business to the next level with our comprehensive suite of services.'
    ],
    captions: [
      'Innovation at its finest',
      'Future of business is here',
      'Excellence in every pixel'
    ]
  });

  const [campaignConfig, setCampaignConfig] = useState<CampaignConfig>({
    name: 'Sample Campaign',
    brandPersona: 'Professional and Innovative',
    targetDemographic: {
      ageRange: { min: 18, max: 65 },
      gender: ['male', 'female'],
      locations: ['New York', 'Los Angeles', 'Chicago']
    },
    adPlatforms: {
      meta: { selected: true, budget: 40 },
      google: { selected: true, budget: 35 },
      linkedin: { selected: true, budget: 25 }
    },
    budget: {
      total: 1000,
      currency: 'USD'
    },
    dates: {
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  });

  const handleAddStep = (stepType: StepType) => {
    const newStep: WorkflowStep = {
      name: stepType.name,
      status: 'pending' as WorkflowStepStatus,
      subSteps: stepType.subSteps.map(step => ({
        ...step,
        status: 'pending' as WorkflowStepStatus
      })),
      type: stepType.type
    };
    setCurrentSteps([...currentSteps, newStep]);
    setShowAddStepDialog(false);
  };

  // Initialize steps from workflow prop
  React.useEffect(() => {
    if (workflow.steps) {
      setCurrentSteps(workflow.steps);
    }
  }, [workflow.steps]);

  // Initialize node positions if not set
  React.useEffect(() => {
    const spacing = 250; // Increased spacing between nodes
    const startY = 100; // Starting Y position
    const initialPositions: { [key: string]: { x: number; y: number } } = {};
    currentSteps.forEach((_, index) => {
      if (!nodePositions[index]) {
        initialPositions[index] = { x: spacing * index, y: startY };
      }
    });
    if (Object.keys(initialPositions).length > 0) {
      setNodePositions(prev => ({ ...prev, ...initialPositions }));
    }
  }, [currentSteps.length]);

  // Calculate zoom level based on number of steps
  const calculateZoom = (numSteps: number) => {
    // Base zoom levels
    if (numSteps <= 3) return 0.9;
    if (numSteps <= 5) return 0.75;
    if (numSteps <= 7) return 0.6;
    return 0.5;
  };

  // Create flow nodes and edges based on workflow steps
  const getFlowElements = React.useCallback(() => {
    const nodes: Node[] = currentSteps.map((step, index) => ({
      id: `${index}`,
      type: 'custom',
      position: nodePositions[index] || { x: 250 * index, y: 100 },
      data: { 
        label: step.name,
        status: step.status === 'pending' ? 'waiting' :
                step.status === 'completed' ? 'completed' :
                step.status === 'error' ? 'error' : 'running',
        type: index === 0 ? 'start' :
              index === currentSteps.length - 1 ? 'end' :
              'process',
        onDelete: (id: string) => {
          const nodeIndex = parseInt(id);
          if (!isRunning) {
            const newSteps = [...currentSteps];
            newSteps.splice(nodeIndex, 1);
            setCurrentSteps(newSteps);
            
            // Clear the position of the deleted node
            setNodePositions(prev => {
              const newPositions = { ...prev };
              delete newPositions[id];
              // Shift remaining positions
              for (let i = nodeIndex + 1; i < currentSteps.length; i++) {
                if (newPositions[i]) {
                  newPositions[i - 1] = newPositions[i];
                  delete newPositions[i];
                }
              }
              return newPositions;
            });

            // Remove edges connected to the deleted node
            setEdges(prev => 
              prev.filter(edge => 
                edge.source !== id && edge.target !== id
              )
            );
            setSelectedEdge(null);
          }
        }
      },
      draggable: true
    }));

    return { nodes };
  }, [currentSteps, nodePositions, isRunning]);

  const { nodes } = getFlowElements();

  // Initialize edges when steps change
  React.useEffect(() => {
    // Create default sequential connections
    const defaultEdges: Edge[] = currentSteps.slice(0, -1).map((_, index) => ({
      id: `e${index}-${index + 1}`,
      source: `${index}`,
      target: `${index + 1}`,
      type: 'bezier',
      animated: currentSteps[index].status === 'running',
      style: { 
        stroke: theme === "light" ? '#6B7280' : 
                currentSteps[index].status === 'completed' ? '#9333ea' : 
                currentSteps[index].status === 'running' ? '#7e22ce' : 
                '#a855f7',
        strokeWidth: 1.5
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: theme === "light" ? '#6B7280' : 
               currentSteps[index].status === 'completed' ? '#9333ea' : 
               currentSteps[index].status === 'running' ? '#7e22ce' : 
               '#a855f7',
        width: 20,
        height: 20
      }
    }));

    // Keep any custom edges that don't conflict with default edges
    const customEdges = edges.filter(edge => 
      !defaultEdges.some(defaultEdge => 
        defaultEdge.source === edge.source && defaultEdge.target === edge.target
      )
    );

    setEdges([...defaultEdges, ...customEdges]);
  }, [currentSteps]);

  // Function to handle substep execution
  const handleSubStep = React.useCallback((stepIndex: number, subStepIndex: number) => {
    const currentStep = currentSteps[stepIndex];
    
    // If we're in Campaign Planning step, update configuration
    if (stepIndex === 0) {
      if (subStepIndex === 0) { // Campaign name
        setCampaignConfig(prev => ({ ...prev, name: 'Summer Sale Campaign 2025' }));
      } else if (subStepIndex === 1) { // Brand persona
        setCampaignConfig(prev => ({ ...prev, brandPersona: 'Modern, Professional, Innovative' }));
      } else if (subStepIndex === 2) { // Target demographic
        setCampaignConfig(prev => ({
          ...prev,
          targetDemographic: {
            ageRange: { min: 25, max: 45 },
            gender: ['male', 'female'],
            locations: ['New York', 'Los Angeles', 'Chicago']
          }
        }));
      } else if (subStepIndex === 3) { // Ad platforms
        setCampaignConfig(prev => ({
          ...prev,
          adPlatforms: {
            meta: { selected: true, budget: 40 },
            google: { selected: true, budget: 35 },
            linkedin: { selected: true, budget: 25 }
          }
        }));
      } else if (subStepIndex === 4) { // Total budget
        setCampaignConfig(prev => ({
          ...prev,
          budget: {
            total: 1000,
            currency: 'USD'
          }
        }));
      } else if (subStepIndex === 6) { // Campaign dates
        setCampaignConfig(prev => ({
          ...prev,
          dates: {
            start: new Date().toISOString().split('T')[0],
            end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        }));
      }
    }

    // If we're in Ad Copy step, generate content
    if (stepIndex === 2) {
      // Simulate generating content for headlines, descriptions, and captions
      if (subStepIndex === 0) { // Headlines
        setGeneratedContent(prev => ({
          ...prev,
          headlines: [
            "Transform Your Brand Today",
            "Unlock Your Potential",
            "Experience Innovation"
          ]
        }));
      } else if (subStepIndex === 1) { // Captions
        setGeneratedContent(prev => ({
          ...prev,
          captions: [
            "Discover the difference",
            "Your journey starts here",
            "Join the revolution"
          ]
        }));
      } else if (subStepIndex === 2) { // Descriptions
        setGeneratedContent(prev => ({
          ...prev,
          descriptions: [
            "Experience our cutting-edge solutions designed to elevate your business to new heights.",
            "Join thousands of satisfied customers who have transformed their operations with our platform.",
            "Innovative solutions tailored to your needs, backed by industry-leading technology and support."
          ]
        }));
      }
    }

    // If we're starting the User Review step, show the review dialog
    if (stepIndex === 3 && subStepIndex === 0) {
      setIsReviewDialogOpen(true);
      return; // Don't continue until user reviews and approves
    }

    // If all substeps are completed, move to next step
    if (subStepIndex >= currentStep.subSteps.length) {
      if (stepIndex >= currentSteps.length - 1) {
        setIsRunning(false);
        setCurrentStepIndex(null);
        setCurrentSubStepIndex(null);
        return;
      }
      setCurrentStepIndex(stepIndex + 1);
      setCurrentSubStepIndex(0);
      handleSubStep(stepIndex + 1, 0);
      return;
    }

    // Update current substep status
    setCurrentSteps(steps => 
      steps.map((step, sIndex) => ({
        ...step,
        status: sIndex === stepIndex ? 'running' :
                sIndex < stepIndex ? 'completed' :
                'pending',
        subSteps: step.subSteps.map((subStep, ssIndex) => ({
          ...subStep,
          status: sIndex === stepIndex ? 
                  (ssIndex === subStepIndex ? 'running' :
                   ssIndex < subStepIndex ? 'completed' :
                   'pending') :
                  sIndex < stepIndex ? 'completed' :
                  'pending'
        }))
      }))
    );

    // Simulate substep execution time (2-3 seconds)
    const executionTime = 2000 + Math.random() * 1000;
    
    setTimeout(() => {
      // Complete current substep and move to next
      setCurrentSteps(steps => 
        steps.map((step, sIndex) => ({
          ...step,
          status: sIndex < stepIndex ? 'completed' :
                  sIndex === stepIndex ? 'running' :
                  'pending',
          subSteps: step.subSteps.map((subStep, ssIndex) => ({
            ...subStep,
            status: sIndex < stepIndex ? 'completed' :
                    sIndex === stepIndex ? 
                    (ssIndex <= subStepIndex ? 'completed' :
                     'pending') :
                    'pending'
          }))
        }))
      );
      
      setCurrentSubStepIndex(subStepIndex + 1);
      handleSubStep(stepIndex, subStepIndex + 1);
    }, executionTime);
  }, [currentSteps, campaignConfig]);

  // Handle running workflow
  const runWorkflow = React.useCallback(() => {
    if (!currentSteps.length || isRunning) return;
    
    setIsRunning(true);
    setCurrentStepIndex(0);
    setCurrentSubStepIndex(0);
    
    // Reset all steps to pending
    setCurrentSteps(steps => 
      steps.map(step => ({
        ...step,
        status: 'pending',
        subSteps: step.subSteps.map(subStep => ({
          ...subStep,
          status: 'pending'
        }))
      }))
    );

    handleSubStep(0, 0);
  }, [currentSteps.length, isRunning, handleSubStep]);

  const handlePublishCampaign = () => {
    setIsReviewDialogOpen(false);
    // Add any campaign publishing logic here
    
    // Redirect to campaigns page
    navigate('/campaigns');
  };

  const CircularTimer = ({ timeLeft }: { timeLeft: number }) => {
    const circumference = 2 * Math.PI * 18; // radius = 18
    const strokeDashoffset = ((10 - timeLeft) / 10) * circumference;

    return (
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="transform -rotate-90 w-12 h-12">
          <circle
            cx="24"
            cy="24"
            r="18"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-purple-500/20"
          />
          <circle
            cx="24"
            cy="24"
            r="18"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-purple-500 transition-all duration-1000 ease-linear"
          />
        </svg>
        <span className="absolute text-sm font-medium text-purple-200">{timeLeft}</span>
      </div>
    );
  };

  return (
    <>
      <Card className={getThemeClasses(theme).card}>
        <CardHeader className={getThemeClasses(theme).cardHeader}>
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-1">
              <CardTitle className={getThemeClasses(theme).cardTitle}>
                {workflow.name}
              </CardTitle>
              <div className={getThemeClasses(theme).cardDescription}>
                {workflow.description}
              </div>
            </div>
            {/* Metrics moved to top right, made smaller */}
            <div className="flex space-x-4 text-right">
              <div className="space-y-0.5">
                <div className={getThemeClasses(theme).subText}>
                  Active
                </div>
                <div className={`${getThemeClasses(theme).text} flex justify-center`}>
                  {workflow.activeInstances}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className={getThemeClasses(theme).subText}>
                  Success
                </div>
                <div className={`${getThemeClasses(theme).text} flex justify-center`}>
                  {workflow.successRate}%
                </div>
              </div>
              <div className="space-y-0.5">
                <div className={getThemeClasses(theme).subText}>
                  Done
                </div>
                <div className={`${getThemeClasses(theme).text} flex justify-center`}>
                  {workflow.completedCount}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-purple-400" />
                <span className={getThemeClasses(theme).text}>
                  Workflow Diagram
                </span>
              </div>
              <Button
                variant="outline"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-4 glow-effect",
                  theme === "light"
                    ? "bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-900 border-purple-300 hover:border-purple-400"
                    : "bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50"
                )}
                onClick={runWorkflow}
                disabled={isRunning || currentSteps.length === 0}
              >
                {isRunning ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Workflow
                  </>
                )}
              </Button>
            </div>

            {/* Flow diagram with add step capability */}
            <div className={cn(
              "relative w-full h-[180px] rounded-lg border",
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-[#1A0B2E] border-purple-500/20"
            )}>
              <ReactFlow
                nodes={nodes}
                edges={edges.map(edge => ({
                  ...edge,
                  style: { 
                    stroke: theme === "light" ? '#6B7280' : 
                            edge.animated ? '#7e22ce' : 
                            edge.target === 'end' ? '#9333ea' : 
                            '#a855f7',
                    strokeWidth: 1.5
                  },
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: theme === "light" ? '#6B7280' : 
                           edge.animated ? '#7e22ce' : 
                           edge.target === 'end' ? '#9333ea' : 
                           '#a855f7',
                    width: 20,
                    height: 20
                  }
                }))}
                nodeTypes={{ custom: CustomNode }}
                fitView
                minZoom={0.5}
                maxZoom={1.5}
                defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
                fitViewOptions={{
                  padding: 0.2,
                  duration: 800,
                  minZoom: 0.85,
                  maxZoom: 0.85
                }}
                panOnDrag={true}
                panOnScroll={false}
                zoomOnScroll={true}
                zoomOnPinch={true}
                zoomOnDoubleClick={false}
                preventScrolling={true}
                nodesDraggable={true}
                nodesConnectable={true}
                elementsSelectable={true}
                onNodesChange={(changes) => {
                  changes.forEach(change => {
                    if (change.type === 'position' && change.position) {
                      setNodePositions(prev => ({
                        ...prev,
                        [change.id]: change.position
                      }));
                    }
                  });
                }}
                onConnect={(params) => {
                  const newEdge: Edge = {
                    id: `e${params.source}-${params.target}`,
                    source: params.source,
                    target: params.target,
                    type: 'bezier',
                    animated: currentSteps[parseInt(params.source)].status === 'running',
                    style: { 
                      stroke: theme === "light" ? '#6B7280' : 
                              currentSteps[parseInt(params.source)].status === 'running' ? '#7e22ce' : 
                              '#a855f7',
                      strokeWidth: 1.5
                    },
                    markerEnd: {
                      type: MarkerType.ArrowClosed,
                      color: theme === "light" ? '#6B7280' : 
                             currentSteps[parseInt(params.source)].status === 'running' ? '#7e22ce' : 
                             '#a855f7',
                      width: 20,
                      height: 20
                    }
                  };
                  setEdges(prev => [...prev, newEdge]);
                }}
                onEdgeClick={(event, edge) => {
                  setSelectedEdge(edge.id);
                }}
                onPaneClick={() => {
                  setSelectedEdge(null);
                }}
                onEdgesDelete={(edgesToDelete) => {
                  setEdges(prev => 
                    prev.filter(edge => !edgesToDelete.find(e => e.id === edge.id))
                  );
                  setSelectedEdge(null);
                }}
                proOptions={{ hideAttribution: true }}
              >
                <div className={`grid-background ${theme === "light" ? "grid-background--light" : "grid-background--dark"}`} />
                <Controls 
                  className="react-flow__controls"
                />
                {/* Add Step Button */}
                <div className="absolute bottom-4 right-4 z-10">
                  <button
                    onClick={() => setShowAddStepDialog(true)}
                    className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#1A0B2E]"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </ReactFlow>
            </div>

            {/* Processing step - only show current running step */}
            {isRunning && currentStepIndex !== null && currentSubStepIndex !== null && (
              <div className="space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className={getThemeClasses(theme).text}>
                    Current Progress
                  </div>
                  <div className={getThemeClasses(theme).subText}>
                    Step {currentStepIndex + 1} of {currentSteps.length}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-[#2D1B69]/30 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <RotateCw className="w-4 h-4 text-purple-400 animate-spin" />
                      <div>
                        <div className={getThemeClasses(theme).text}>
                          {currentSteps[currentStepIndex].name}
                        </div>
                        <div className={getThemeClasses(theme).subText}>
                          {currentSteps[currentStepIndex].subSteps[currentSubStepIndex].name}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Substeps progress with connecting lines */}
                  <div className="space-y-1.5 mt-3">
                    <div className="relative">
                      {/* Connecting lines */}
                      {currentSteps[currentStepIndex].subSteps.map((subStep, index) => (
                        index < currentSteps[currentStepIndex].subSteps.length - 1 && (
                          <div 
                            key={index}
                            className="absolute"
                            style={{ 
                              left: '2.025rem',
                              top: `${(index * 48) + 24}px`,
                              width: '2px',
                              height: '48px',
                              backgroundColor: currentSteps[currentStepIndex].subSteps[index].status === 'completed' 
                                ? '#8B5CF6' 
                                : 'rgba(109, 40, 217, 0.2)',
                              transition: 'background-color 0.3s ease'
                            }}
                          />
                        )
                      ))}
                      
                      {/* Step Items with enhanced layout */}
                      {currentSteps[currentStepIndex].subSteps.map((subStep, index) => (
                        <div 
                          key={index}
                          className={cn(
                            "flex items-center justify-between p-2.5 rounded-lg transition-colors duration-200",
                            theme === "light" 
                              ? subStep.status === 'running' 
                                ? 'bg-purple-100/70 shadow-lg shadow-purple-500/10' 
                                : subStep.status === 'completed' 
                                ? 'bg-green-50' 
                                : 'bg-gray-50'
                              : subStep.status === 'running' 
                                ? 'bg-[#2D1B69]/70 shadow-lg shadow-purple-500/10' 
                                : subStep.status === 'completed' 
                                ? 'bg-green-900/20' 
                                : 'bg-[#2D1B69]/20'
                          )}
                        >
                          <div className="flex items-center min-w-0 gap-3">
                            <div className="relative flex items-center justify-center w-[3rem] flex-shrink-0">
                              <div className={cn(
                                "w-5 h-5 rounded-full transition-all duration-300 border-2 flex items-center justify-center",
                                theme === "light"
                                  ? subStep.status === 'running'
                                    ? 'border-purple-500 bg-white shadow-lg shadow-purple-500/20'
                                    : subStep.status === 'completed'
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-gray-300 bg-white'
                                  : subStep.status === 'running'
                                    ? 'border-purple-400 bg-[#1A0B2E] shadow-lg shadow-purple-500/20'
                                    : subStep.status === 'completed'
                                    ? 'border-green-400 bg-green-400'
                                    : 'border-purple-500/20 bg-[#1A0B2E]'
                              )}>
                                {subStep.status === 'running' && (
                                  <RotateCw className={cn(
                                    "w-2.5 h-2.5",
                                    theme === "light" ? "text-purple-600" : "text-purple-400",
                                    "animate-spin"
                                  )} />
                                )}
                                {subStep.status === 'completed' && (
                                  <div className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    theme === "light" ? "bg-white" : "bg-[#1A0B2E]"
                                  )} />
                                )}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={cn(
                                theme === "light"
                                  ? subStep.status === 'running'
                                    ? 'text-purple-900 font-medium'
                                    : subStep.status === 'completed'
                                    ? 'text-green-800'
                                    : 'text-gray-600'
                                  : subStep.status === 'running'
                                    ? 'text-purple-200 font-medium'
                                    : subStep.status === 'completed'
                                    ? 'text-green-300'
                                    : 'text-purple-300/70'
                              )}>{subStep.name}</p>
                            </div>
                          </div>
                          <span className={cn(
                            "text-xs px-2.5 py-1 rounded-full flex-shrink-0 ml-4 font-medium",
                            theme === "light"
                              ? subStep.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : subStep.status === 'running'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-600'
                              : subStep.status === 'completed'
                                ? 'bg-green-400/10 text-green-400'
                                : subStep.status === 'running'
                                ? 'bg-purple-400/10 text-purple-400'
                                : 'bg-purple-400/5 text-purple-400/50'
                          )}>
                            {subStep.status.charAt(0).toUpperCase() + subStep.status.slice(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Review Dialog */}
            <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
              <DialogContent className={cn(
                "max-w-[1400px] h-[95vh] flex flex-col p-0",
                theme === "light" ? "bg-white" : getThemeClasses(theme).dialog
              )}>
                <DialogHeader className={cn(
                  "flex-none px-3 py-1.5 border-b",
                  theme === "light" ? "bg-white border-gray-200" : "bg-[#1A0B2E] border-purple-500/20"
                )}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-purple-600" />
                      <DialogTitle className={cn(
                        "text-base font-semibold",
                        theme === "light" ? "text-gray-900" : getThemeClasses(theme).heading
                      )}>
                        Campaign Review
                      </DialogTitle>
                    </div>
                  </div>
                </DialogHeader>

                <div className={cn(
                  "flex-1 p-3 overflow-y-auto min-h-0",
                  theme === "light" ? "bg-gray-50" : "bg-[#0F0225]"
                )}>
                  <div className="grid grid-cols-2 gap-3 max-w-[1300px] mx-auto">
                    {/* Left Column - Campaign Details */}
                    <div className="space-y-2 h-full flex flex-col">
                      {/* Campaign Configuration Section */}
                      <div className={cn(
                        "rounded-lg p-2",
                        theme === "light" ? "bg-white border border-gray-200" : "bg-[#1A0B2E] border border-purple-500/20"
                      )}>
                        <div className="space-y-2">
                          {/* Basic Info */}
                          <div>
                            <h3 className={cn(
                              "text-sm font-semibold mb-1.5 flex items-center gap-1.5",
                              theme === "light" ? "text-gray-900" : "text-purple-200"
                            )}>
                              <Info className="w-3.5 h-3.5 text-purple-500" />
                              Basic Information
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                              <div className={cn(
                                "p-1.5 rounded-lg",
                                theme === "light" ? "bg-gray-50" : "bg-[#2D1B69]/30"
                              )}>
                                <label className={cn(
                                  "block text-xs font-medium",
                                  theme === "light" ? "text-gray-600" : "text-purple-300/70"
                                )}>
                                  Campaign Name
                                </label>
                                <p className={cn(
                                  "text-sm mt-0.5",
                                  theme === "light" ? "text-gray-900" : "text-purple-200"
                                )}>
                                  {campaignConfig.name}
                                </p>
                              </div>
                              <div className={cn(
                                "p-1.5 rounded-lg",
                                theme === "light" ? "bg-gray-50" : "bg-[#2D1B69]/30"
                              )}>
                                <label className={cn(
                                  "block text-xs font-medium",
                                  theme === "light" ? "text-gray-600" : "text-purple-300/70"
                                )}>
                                  Brand Persona
                                </label>
                                <p className={cn(
                                  "text-sm mt-0.5",
                                  theme === "light" ? "text-gray-900" : "text-purple-200"
                                )}>
                                  {campaignConfig.brandPersona}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Target Demographic */}
                          <div>
                            <h3 className={cn(
                              "text-sm font-semibold mb-1.5 flex items-center gap-1.5",
                              theme === "light" ? "text-gray-900" : "text-purple-200"
                            )}>
                              <Users className="w-3.5 h-3.5 text-purple-500" />
                              Target Demographic
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                              <div className={cn(
                                "p-1.5 rounded-lg",
                                theme === "light" ? "bg-gray-50" : "bg-[#2D1B69]/30"
                              )}>
                                <label className={cn(
                                  "block text-xs font-medium",
                                  theme === "light" ? "text-gray-600" : "text-purple-300/70"
                                )}>
                                  Age Range
                                </label>
                                <p className={cn(
                                  "text-sm mt-0.5",
                                  theme === "light" ? "text-gray-900" : "text-purple-200"
                                )}>
                                  {campaignConfig.targetDemographic.ageRange.min} - {campaignConfig.targetDemographic.ageRange.max} years
                                </p>
                              </div>
                              <div className={cn(
                                "p-1.5 rounded-lg",
                                theme === "light" ? "bg-gray-50" : "bg-[#2D1B69]/30"
                              )}>
                                <label className={cn(
                                  "block text-xs font-medium",
                                  theme === "light" ? "text-gray-600" : "text-purple-300/70"
                                )}>
                                  Gender
                                </label>
                                <p className={cn(
                                  "text-sm mt-0.5",
                                  theme === "light" ? "text-gray-900" : "text-purple-200"
                                )}>
                                  {campaignConfig.targetDemographic.gender.join(', ')}
                                </p>
                              </div>
                              <div className={cn(
                                "p-1.5 rounded-lg",
                                theme === "light" ? "bg-gray-50" : "bg-[#2D1B69]/30"
                              )}>
                                <label className={cn(
                                  "block text-xs font-medium",
                                  theme === "light" ? "text-gray-600" : "text-purple-300/70"
                                )}>
                                  Locations
                                </label>
                                <p className={cn(
                                  "text-sm mt-0.5",
                                  theme === "light" ? "text-gray-900" : "text-purple-200"
                                )}>
                                  {campaignConfig.targetDemographic.locations.join(', ')}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Budget & Timeline */}
                          <div>
                            <h3 className={cn(
                              "text-sm font-semibold mb-1.5 flex items-center gap-1.5",
                              theme === "light" ? "text-gray-900" : "text-purple-200"
                            )}>
                              <DollarSign className="w-3.5 h-3.5 text-purple-500" />
                              Budget & Timeline
                            </h3>
                            <div className="space-y-2">
                              {/* Total Budget and Daily Budget */}
                              <div className={cn(
                                "p-1.5 rounded-lg",
                                theme === "light" ? "bg-gray-50" : "bg-[#2D1B69]/30"
                              )}>
                                <label className={cn(
                                  "block text-xs font-medium",
                                  theme === "light" ? "text-gray-600" : "text-purple-300/70"
                                )}>
                                  Total Budget
                                </label>
                                <p className={cn(
                                  "text-sm mt-0.5",
                                  theme === "light" ? "text-gray-900" : "text-purple-200"
                                )}>
                                  {campaignConfig.budget.currency} {campaignConfig.budget.total}
                                </p>
                                <div className="mt-1">
                                  <p className={cn(
                                    "text-xs",
                                    theme === "light" ? "text-gray-600" : "text-purple-300/70"
                                  )}>
                                    Daily Budget:
                                    <span className="ml-1">
                                      {campaignConfig.budget.currency} {(campaignConfig.budget.total / 30).toFixed(2)}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {/* Platform Budget Distribution */}
                              <div className="grid grid-cols-3 gap-2">
                                {Object.entries(campaignConfig.adPlatforms).map(([platform, data]) => (
                                  data.selected && (
                                    <div key={platform} className={cn(
                                      "p-1.5 rounded-lg",
                                      theme === "light" ? "bg-gray-50" : "bg-[#2D1B69]/30"
                                    )}>
                                      <label className={cn(
                                        "block text-xs font-medium",
                                        theme === "light" ? "text-gray-600" : "text-purple-300/70"
                                      )}>
                                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                      </label>
                                      <div className="space-y-1">
                                        <p className={cn(
                                          "text-sm",
                                          theme === "light" ? "text-gray-900" : "text-purple-200"
                                        )}>
                                          {data.budget}% of budget
                                        </p>
                                        <p className={cn(
                                          "text-xs",
                                          theme === "light" ? "text-gray-600" : "text-purple-300/70"
                                        )}>
                                          {campaignConfig.budget.currency} {(campaignConfig.budget.total * data.budget / 100).toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                ))}
                              </div>

                              {/* Campaign Duration */}
                              <div className={cn(
                                "p-1.5 rounded-lg",
                                theme === "light" ? "bg-gray-50" : "bg-[#2D1B69]/30"
                              )}>
                                <label className={cn(
                                  "block text-xs font-medium",
                                  theme === "light" ? "text-gray-600" : "text-purple-300/70"
                                )}>
                                  Campaign Duration
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <p className={cn(
                                      "text-xs mb-1",
                                      theme === "light" ? "text-gray-600" : "text-purple-300/70"
                                    )}>
                                      Start Date
                                    </p>
                                    <p className={cn(
                                      "text-sm",
                                      theme === "light" ? "text-gray-900" : "text-purple-200"
                                    )}>
                                      {new Date(campaignConfig.dates.start).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className={cn(
                                      "text-xs mb-1",
                                      theme === "light" ? "text-gray-600" : "text-purple-300/70"
                                    )}>
                                      End Date
                                    </p>
                                    <p className={cn(
                                      "text-sm",
                                      theme === "light" ? "text-gray-900" : "text-purple-200"
                                    )}>
                                      {new Date(campaignConfig.dates.end).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Creative Assets Section */}
                      <div className={cn(
                        "rounded-lg p-2 mt-auto",
                        theme === "light" ? "bg-white border border-gray-200" : "bg-[#1A0B2E] border border-purple-500/20"
                      )}>
                        <h3 className={cn(
                          "text-sm font-semibold mb-1.5 flex items-center gap-1.5",
                          theme === "light" ? "text-gray-900" : "text-purple-200"
                        )}>
                          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                          Creative Assets
                        </h3>
                        <div className="grid grid-cols-3 gap-2 h-[160px]">
                          {creativeAssets.images.map((image, index) => (
                            <div key={index} className="group relative h-full">
                              <div className={cn(
                                "h-full rounded-lg overflow-hidden",
                                theme === "light" ? "bg-gray-100" : "bg-[#2D1B69]/30"
                              )}>
                                <img 
                                  src={image.url} 
                                  alt={`Creative ${index + 1}`}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="absolute bottom-0 left-0 right-0 p-1">
                                    <p className="text-white/90 text-[10px]">
                                      Aspect Ratio: {image.aspectRatio}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Ad Copy */}
                    <div className={cn(
                      "rounded-lg p-2 h-full",
                      theme === "light" ? "bg-white border border-gray-200" : "bg-[#1A0B2E] border border-purple-500/20"
                    )}>
                      <h3 className={cn(
                        "text-sm font-semibold mb-1.5 flex items-center gap-1.5",
                        theme === "light" ? "text-gray-900" : "text-purple-200"
                      )}>
                        <Mail className="w-3.5 h-3.5 text-purple-500" />
                        Ad Copy
                      </h3>
                      
                      <div className="space-y-2">
                        {/* Headlines */}
                        <div>
                          <h4 className={cn(
                            "text-xs font-medium mb-1",
                            theme === "light" ? "text-gray-600" : "text-purple-300/70"
                          )}>
                            Headlines
                          </h4>
                          <div className="grid gap-2">
                            {generatedContent.headlines.slice(0, 3).map((headline, index) => (
                              <div key={index} className={cn(
                                "p-1.5 rounded-lg",
                                theme === "light" ? "bg-gray-50" : "bg-[#2D1B69]/30"
                              )}>
                                <p className={cn(
                                  "text-sm",
                                  theme === "light" ? "text-gray-900" : "text-purple-200"
                                )}>
                                  {headline}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={cn(
                                    "text-[10px] py-0.5 px-1.5 rounded",
                                    theme === "light" 
                                      ? "bg-gray-100 text-gray-600" 
                                      : "bg-[#2D1B69] text-purple-300/70"
                                  )}>
                                    {headline.length}/30 chars
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Descriptions */}
                        <div>
                          <h4 className={cn(
                            "text-xs font-medium mb-1",
                            theme === "light" ? "text-gray-600" : "text-purple-300/70"
                          )}>
                            Descriptions
                          </h4>
                          <div className="grid gap-2">
                            {generatedContent.descriptions.slice(0, 3).map((desc, index) => (
                              <div key={index} className={cn(
                                "p-1.5 rounded-lg",
                                theme === "light" ? "bg-gray-50" : "bg-[#2D1B69]/30"
                              )}>
                                <p className={cn(
                                  "text-sm",
                                  theme === "light" ? "text-gray-900" : "text-purple-200"
                                )}>
                                  {desc}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={cn(
                                    "text-[10px] py-0.5 px-1.5 rounded",
                                    theme === "light" 
                                      ? "bg-gray-100 text-gray-600" 
                                      : "bg-[#2D1B69] text-purple-300/70"
                                  )}>
                                    {desc.length}/90 chars
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Captions */}
                        <div>
                          <h4 className={cn(
                            "text-xs font-medium mb-1",
                            theme === "light" ? "text-gray-600" : "text-purple-300/70"
                          )}>
                            Captions
                          </h4>
                          <div className="grid gap-2">
                            {generatedContent.captions.slice(0, 3).map((caption, index) => (
                              <div key={index} className={cn(
                                "p-1.5 rounded-lg",
                                theme === "light" ? "bg-gray-50" : "bg-[#2D1B69]/30"
                              )}>
                                <p className={cn(
                                  "text-sm",
                                  theme === "light" ? "text-gray-900" : "text-purple-200"
                                )}>
                                  {caption}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={cn(
                                    "text-[10px] py-0.5 px-1.5 rounded",
                                    theme === "light" 
                                      ? "bg-gray-100 text-gray-600" 
                                      : "bg-[#2D1B69] text-purple-300/70"
                                  )}>
                                    {caption.length}/30 chars
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className={cn(
                  "flex-none px-3 py-1.5 border-t",
                  theme === "light" ? "bg-white border-gray-200" : "bg-[#1A0B2E] border border-purple-500/20"
                )}>
                  <div className="flex items-center justify-end gap-3">
                    <div className="flex items-center gap-2 mr-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPaused(!isPaused)}
                        className={cn(
                          "text-xs px-3 py-1 h-7",
                          theme === "light" ? "hover:bg-gray-100" : "hover:bg-purple-500/10"
                        )}
                      >
                        {isPaused ? (
                          <>
                            <Play className="w-3 h-3 mr-1" />
                            Resume
                          </>
                        ) : (
                          <>
                            <Pause className="w-3 h-3 mr-1" />
                            Pause
                          </>
                        )}
                      </Button>
                      <span className={cn(
                        "text-sm font-medium",
                        countdown <= 3 ? "text-red-500" : theme === "light" ? "text-gray-700" : "text-purple-200"
                      )}>
                        Auto-publishing in {countdown}s
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsReviewDialogOpen(false)}
                      className={cn(
                        "text-xs",
                        theme === "light" ? "hover:bg-gray-100" : "hover:bg-purple-500/10"
                      )}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={handlePublishCampaign}
                      className={cn(
                        "text-xs bg-purple-600 hover:bg-purple-700",
                        theme === "light" ? "text-white" : "text-purple-100"
                      )}
                    >
                      Confirm & Start
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Add Step Dialog */}
            <Dialog open={showAddStepDialog} onOpenChange={setShowAddStepDialog}>
              <DialogContent className={cn(
                "max-w-lg",
                theme === "light" ? "bg-white" : "bg-[#1A0B2E]"
              )}>
                <DialogHeader>
                  <DialogTitle className={theme === "light" ? "text-gray-900" : "text-purple-200"}>
                    Add Step
                  </DialogTitle>
                  <DialogDescription className={theme === "light" ? "text-gray-500" : "text-purple-200/70"}>
                    Choose a step type to add to your workflow
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2 py-4">
                  {stepTypes.map((type, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleAddStep(type)}
                      className={cn(
                        "justify-start text-left font-normal",
                        theme === "light" 
                          ? "hover:bg-gray-100 border-gray-200" 
                          : "hover:bg-purple-500/10 border-purple-500/20"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-1 rounded",
                          theme === "light" ? "bg-gray-100" : "bg-purple-500/20"
                        )}>
                          {React.createElement(type.icon, {
                            className: theme === "light" ? "text-gray-600" : "text-purple-200"
                          })}
                        </div>
                        <div>
                          <div className={theme === "light" ? "text-gray-900" : "text-purple-200"}>
                            {type.name}
                          </div>
                          <div className={cn(
                            "text-xs",
                            theme === "light" ? "text-gray-500" : "text-purple-200/70"
                          )}>
                            {type.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default function AIWorkflows() {
  const { theme } = useTheme();
  const [workflows] = useState<Workflow[]>(workflowTemplates);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isCustomWorkflowDialogOpen, setIsCustomWorkflowDialogOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [customWorkflowName, setCustomWorkflowName] = useState('');
  const [customWorkflowDescription, setCustomWorkflowDescription] = useState('');
  const [selectedProcess, setSelectedProcess] = useState<string>('');
  const [customNodes, setCustomNodes] = useState<Node[]>([]);
  const [customEdges, setCustomEdges] = useState<Edge[]>([]);
  const [countdown, setCountdown] = useState<number>(10);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isCustomWorkflowDialogOpen && !isPaused && countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsCustomWorkflowDialogOpen(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isCustomWorkflowDialogOpen, isPaused, countdown]);

  const handleSaveWorkflow = () => {
    if (!customWorkflowName.trim()) {
      // Show error message
      return;
    }

    const newWorkflow: Workflow = {
      id: `custom-${Date.now()}`,
      name: customWorkflowName,
      description: customWorkflowDescription,
      activeInstances: 0,
      successRate: 0,
      completedCount: 0,
      steps: []
    };

    workflows.push(newWorkflow);
    
    setCustomWorkflowName('');
    setCustomWorkflowDescription('');
    setCustomNodes([]);
    setCustomEdges([]);
    setIsCustomWorkflowDialogOpen(false);
  };

  return (
    <div className={getThemeClasses(theme).background}>
      <style>{`
        .react-flow__attribution {
          display: none !important;
        }
        .react-flow__controls {
          background: transparent;
          border: none;
          box-shadow: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 6px;
          margin-bottom: 6px;
          margin-left: 6px;
        }
        .react-flow__controls-button {
          background: #7E22CE !important;
          border: none !important;
          border-radius: 6px !important;
          width: 20px !important;
          height: 20px !important;
          color: white !important;
          transition: all 0.2s ease-out !important;
          padding: 3px !important;
          margin: 0 !important;
        }
        .react-flow__controls-button:hover {
          background: #9333EA !important;
          color: white !important;
        }
        .react-flow__controls-button svg {
          fill: currentColor;
          width: 10px;
          height: 10px;
        }
        .react-flow__controls-button + .react-flow__controls-button {
          margin-top: 6px !important;
        }
        .grid-background {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .grid-background--light {
          background-image: 
            linear-gradient(to right, #E5E7EB 1px, transparent 1px),
            linear-gradient(to bottom, #E5E7EB 1px, transparent 1px),
            linear-gradient(to right, #F3F4F6 1px, transparent 1px),
            linear-gradient(to bottom, #F3F4F6 1px, transparent 1px);
          background-size: 20px 20px, 20px 20px, 100px 100px, 100px 100px;
        }
        .grid-background--dark {
          background-image: 
            linear-gradient(to right, rgba(109, 40, 217, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(109, 40, 217, 0.2) 1px, transparent 1px),
            linear-gradient(to right, rgba(109, 40, 217, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(109, 40, 217, 0.1) 1px, transparent 1px);
          background-size: 20px 20px, 20px 20px, 100px 100px, 100px 100px;
        }
        @keyframes subtle-glow {
          0%, 100% {
            box-shadow: 0 0 8px rgba(168, 85, 247, 0.4);
          }
          50% {
            box-shadow: 0 0 16px rgba(168, 85, 247, 0.6);
          }
        }
        .glow-effect {
          animation: subtle-glow 2s ease-in-out infinite;
        }
      `}</style>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link 
                  to="/" 
                  className={getThemeClasses(theme).breadcrumb}
                >
                  <Home className={cn("w-4 h-4 mr-2", getThemeClasses(theme).breadcrumbIcon)} />
                  Home
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRight className={getThemeClasses(theme).breadcrumbIcon} />
                  <span className={getThemeClasses(theme).breadcrumb}>
                    AI Workflows
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className={getThemeClasses(theme).heading}>
              AI Workflows
            </h1>
            <div className="flex justify-between items-center">
              <p className={getThemeClasses(theme).subText}>
                Manage and monitor your AI-powered workflows
              </p>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className={cn(
                    "transition-all duration-300 hover:scale-105",
                    theme === "light"
                      ? "bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-900 border-purple-300 hover:border-purple-400"
                      : "bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50"
                  )}
                  onClick={() => setIsCustomWorkflowDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add custom workflow
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "transition-all duration-300 hover:scale-105",
                    theme === "light"
                      ? "bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-900 border-purple-300 hover:border-purple-400"
                      : "bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50"
                  )}
                  onClick={() => setIsGoalDialogOpen(true)}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Don't know where to start?
                </Button>
              </div>
            </div>
          </div>

          {/* Business Goal Dialog */}
          <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
            <DialogContent className={getThemeClasses(theme).dialog}>
              <DialogHeader>
                <DialogTitle className={getThemeClasses(theme).heading}>
                  Tell us about your workflow goal
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className={getThemeClasses(theme).subText}>
                    Business Goal
                  </label>
                  <textarea
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    placeholder="E.g., Increase brand awareness, drive website traffic, generate leads..."
                    className={cn("h-32", getThemeClasses(theme).textarea)}
                  />
                </div>

                <div className={getThemeClasses(theme).subText}>
                  <p>Some examples of business goals:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Launch a new product line to existing customers</li>
                    <li>Increase social media engagement by 30%</li>
                    <li>Generate qualified leads for B2B services</li>
                    <li>Boost online store sales during holiday season</li>
                  </ul>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsGoalDialogOpen(false)}
                    className={getThemeClasses(theme).buttonOutline}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setIsGoalDialogOpen(false);
                      // You can pass the business goal to the selected workflow here
                    }}
                    className={cn(
                      "transition-all duration-300 hover:scale-105",
                      theme === "light"
                        ? "bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-900 border-purple-300 hover:border-purple-400"
                        : "bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50"
                    )}
                  >
                    Get Started
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Custom Workflow Dialog */}
          <Dialog open={isCustomWorkflowDialogOpen} onOpenChange={setIsCustomWorkflowDialogOpen}>
            <DialogContent className={cn(
              "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-w-4xl h-screen",
              theme === "light"
                ? "bg-white border-gray-200 text-gray-900" 
                : "bg-[#1A0B2E] border-[#6D28D9]/20 text-purple-50"
            )}>
              <button 
                type="button" 
                className={cn(
                  "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground h-10 px-4 py-2",
                  theme === "light" ? "text-gray-500" : "text-purple-200"
                )}
                onClick={() => setIsCustomWorkflowDialogOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x h-4 w-4">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
                <span className="sr-only">Close</span>
              </button>
              <div className="flex flex-col text-center sm:text-left space-y-2 pb-4 border-b">
                <DialogTitle className={cn(
                  "tracking-tight text-xl font-semibold",
                  theme === "light"
                    ? "text-gray-900" 
                    : "text-purple-50"
                )}>
                  Create Custom Workflow
                </DialogTitle>
                <DialogDescription className={cn(
                  "text-sm",
                  theme === "light" 
                    ? "text-gray-500" 
                    : "text-purple-200/70"
                )}>
                  Create a new workflow by adding steps and configuring their sequence.
                </DialogDescription>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                {/* Workflow Name Input */}
                <div>
                  <label 
                    htmlFor="workflowName"
                    className={cn(
                      "text-sm font-medium flex items-center gap-0.5",
                      theme === "light" ? "text-gray-900" : "text-purple-50"
                    )}
                  >
                    Workflow Name
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="workflowName"
                    value={customWorkflowName}
                    onChange={(e) => setCustomWorkflowName(e.target.value)}
                    required
                    placeholder="Enter workflow name"
                    className={cn(
                      "mt-1.5 flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                      !customWorkflowName.trim() && "border-red-500",
                      theme === "light"
                        ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-purple-500/30" 
                        : "bg-[#2D1B69]/40 border-purple-500/20 text-purple-50 placeholder:text-purple-200/30 focus:ring-2 focus:ring-purple-500/30"
                    )}
                  />
                  {!customWorkflowName.trim() && (
                    <p className={cn(
                      "text-xs mt-1",
                      theme === "light" ? "text-red-500" : "text-red-400"
                    )}>
                      Workflow name is required
                    </p>
                  )}
                </div>

                {/* Process Selection */}
                <div>
                  <label 
                    htmlFor="process"
                    className={cn(
                      "text-sm font-medium",
                      theme === "light" ? "text-gray-900" : "text-purple-50"
                    )}
                  >
                    Select Process
                  </label>
                  <Select
                    value={selectedProcess}
                    onValueChange={(value) => {
                      setSelectedProcess(value);
                      const selectedType = stepTypes.find(p => p.id === value);
                      if (selectedType) {
                        const newNode = {
                          id: `custom-step-${customNodes.length + 1}`,
                          type: 'custom',
                          position: { 
                            x: 100 + (customNodes.length * 180),
                            y: 100
                          },
                          data: { 
                            label: selectedType.name,
                            status: 'waiting',
                            type: 'process',
                            onDelete: (id: string) => {
                              setCustomNodes((nds) => nds.filter(node => node.id !== id));
                              setCustomEdges((eds) => eds.filter(edge => 
                                edge.source !== id && edge.target !== id
                              ));
                            }
                          }
                        };
                        setCustomNodes((nds) => [...nds, newNode]);
                      }
                    }}
                  >
                    <SelectTrigger className={cn(
                      "mt-1.5 flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-[#1A0B2E]",
                      theme === "light" 
                        ? "bg-white border-gray-200 text-gray-900" 
                        : "bg-[#2D1B69]/40 border-purple-500/20 text-purple-50"
                    )}>
                      <SelectValue placeholder="Select a process type" />
                    </SelectTrigger>
                    <SelectContent className={cn(
                      theme === "light" 
                        ? "bg-white border-gray-200" 
                        : "bg-[#1A0B2E] border-purple-500/20"
                    )}>
                      {stepTypes.map((type) => (
                        <SelectItem 
                          key={type.id} 
                          value={type.id}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer",
                            theme === "light" 
                              ? "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300" 
                              : "bg-[#2D1B69]/70 hover:bg-[#2D1B69] text-purple-100 border border-purple-500/30"
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <span>{type.name}</span>
                            {React.createElement(type.icon, { 
                              className: cn(
                                "w-4 h-4",
                                theme === "light" ? "text-gray-700" : "text-purple-300"
                              )
                            })}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* ReactFlow Canvas */}
              <div className={cn(
                "flex-1 rounded-lg border min-h-[400px] relative",
                theme === "light"
                  ? "bg-gray-200/90 border-gray-200"
                  : "bg-[#2D1B69]/20 border-purple-500/20"
              )}>
                <ReactFlow
                  nodes={customNodes}
                  edges={customEdges}
                  nodeTypes={{ custom: CustomNode }}
                  fitView
                  minZoom={0.5}
                  maxZoom={1.5}
                  defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
                  fitViewOptions={{
                    padding: 0.2,
                    duration: 800,
                    minZoom: 0.85,
                    maxZoom: 0.85
                  }}
                  panOnDrag={true}
                  panOnScroll={false}
                  zoomOnScroll={true}
                  zoomOnPinch={true}
                  zoomOnDoubleClick={false}
                  preventScrolling={true}
                  nodesDraggable={true}
                  nodesConnectable={true}
                  elementsSelectable={true}
                  onNodesChange={(changes) => {
                    setCustomNodes((nds) => applyNodeChanges(changes, nds));
                  }}
                  onEdgesChange={(changes) => {
                    setCustomEdges((eds) => applyEdgeChanges(changes, eds));
                  }}
                  onConnect={(params) => {
                    const newEdge = {
                      ...params,
                      type: 'smoothstep',
                      animated: true,
                      style: { 
                        stroke: theme === "light" ? '#6B7280' : '#6D28D9', 
                        strokeWidth: 2 
                      },
                      markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: theme === "light" ? '#6B7280' : '#6D28D9'
                      }
                    };
                    setCustomEdges((eds) => addEdge(newEdge, eds));
                  }}
                >
                  <div className={`grid-background ${theme === "light" ? "grid-background--light" : "grid-background--dark"}`} />
                  <Controls className="react-flow__controls" />
                </ReactFlow>
              </div>

              <DialogFooter className={cn(
                "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-6 border-t",
                theme === "light" ? "border-gray-200" : "border-purple-500/20"
              )}>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsCustomWorkflowDialogOpen(false)}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground h-10 px-4 py-2",
                      theme === "light"
                        ? "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                        : "bg-[#2D1B69]/30 hover:bg-[#2D1B69] text-purple-200 border border-purple-500/20"
                    )}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveWorkflow}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2",
                      "bg-purple-600 hover:bg-purple-700 text-white"
                    )}
                    disabled={!customWorkflowName.trim()}
                  >
                    Create Workflow
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Workflow Templates Grid */}
          <div className="space-y-4">
            {workflows.map((template) => (
              <WorkflowCard 
                key={template.id} 
                workflow={template} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
