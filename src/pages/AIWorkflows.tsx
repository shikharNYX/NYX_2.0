import { useState, useCallback, useEffect } from 'react';
import * as React from 'react';
import ReactFlow, { 
  Node,
  Edge,
  Background, 
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Position,
  MarkerType,
  BackgroundVariant,
  Panel
} from 'reactflow';
import CustomNode from '@/components/CustomNode';
import { 
  Activity, 
  Play, 
  RotateCw, 
  Plus,
  HelpCircle,
  FileDown,
  Calendar,
  LineChart,
  Clock,
  Settings,
  MessageSquare,
  Target,
  Share2,
  Home,
  ChevronRight,
  Sparkles,
  Mail,
  DollarSign
} from 'lucide-react';
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

const stepTypes = [
  {
    id: 'content-creation',
    name: 'Content Creation',
    description: 'Create content for your campaign',
    icon: MessageSquare
  },
  {
    id: 'target-audience',
    name: 'Target Audience',
    description: 'Define your target audience',
    icon: Target
  },
  {
    id: 'social-schedule',
    name: 'Social Media Schedule',
    description: 'Create posting schedule',
    icon: Calendar
  },
  {
    id: 'performance-tracking',
    name: 'Performance Tracking',
    description: 'Set up tracking metrics',
    icon: LineChart
  },
  {
    id: 'distribution',
    name: 'Distribution',
    description: 'Configure content distribution',
    icon: Share2
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Configure workflow settings',
    icon: Settings
  }
];

const processTypes = [
  { id: 'content-creation', name: 'Content Creation', icon: MessageSquare },
  { id: 'target-audience', name: 'Target Audience', icon: Target },
  { id: 'social-schedule', name: 'Social Media Schedule', icon: Calendar },
  { id: 'performance-tracking', name: 'Performance Tracking', icon: LineChart },
  { id: 'distribution', name: 'Distribution', icon: Share2 },
  { id: 'settings', name: 'Settings', icon: Settings },
  { id: 'campaign-planning', name: 'Campaign Planning', icon: Activity },
  { id: 'email-marketing', name: 'Email Marketing', icon: Mail },
  { id: 'analytics', name: 'Analytics & Reporting', icon: LineChart },
  { id: 'budget-optimization', name: 'Budget Optimization', icon: DollarSign }
];

const WorkflowCard = ({ workflow }: WorkflowCardProps) => {
  const navigate = useNavigate();
  const [currentSteps, setCurrentSteps] = useState<WorkflowStep[]>(defaultSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [currentSubStepIndex, setCurrentSubStepIndex] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [nodePositions, setNodePositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  // Timer effect for review dialog
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isReviewDialogOpen && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsReviewDialogOpen(false);
      navigate('/campaigns');
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isReviewDialogOpen, timeLeft, navigate]);

  // Reset timer when review dialog opens
  useEffect(() => {
    if (isReviewDialogOpen) {
      setTimeLeft(10);
    }
  }, [isReviewDialogOpen]);

  const [campaignConfig, setCampaignConfig] = useState({
    name: '',
    brandPersona: '',
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
  const [creativeAssets, setCreativeAssets] = useState<{
    images: { url: string; aspectRatio: string }[];
  }>({
    images: [
      { url: 'https://via.placeholder.com/300x300', aspectRatio: '1:1' },
      { url: 'https://via.placeholder.com/300x400', aspectRatio: '3:4' },
      { url: 'https://via.placeholder.com/400x300', aspectRatio: '4:3' }
    ]
  });
  const [generatedContent, setGeneratedContent] = useState<{
    headlines: string[];
    descriptions: string[];
    captions: string[];
  }>({
    headlines: [],
    descriptions: [],
    captions: []
  });

  const [isAddStepDialogOpen, setIsAddStepDialogOpen] = useState(false);

  const handleAddStep = (stepType: typeof stepTypes[0]) => {
    const newNode = {
      id: `step-${nodes.length + 1}`,
      type: 'custom',
      position: { 
        x: Math.max(...nodes.map(n => n.position.x)) + 200,
        y: nodes[nodes.length - 1].position.y
      },
      data: { 
        label: stepType.name,
        status: 'pending',
        type: stepType.id,
        icon: stepType.icon,
        onDelete: (id: string) => {
          const nodeIndex = parseInt(id);
          if (!isRunning) {
            const newSteps = [...currentSteps];
            newSteps.splice(nodeIndex, 1);
            setCurrentSteps(newSteps);
            
            setNodePositions(prev => {
              const newPositions = { ...prev };
              delete newPositions[id];
              for (let i = nodeIndex + 1; i < currentSteps.length; i++) {
                if (newPositions[i]) {
                  newPositions[i - 1] = newPositions[i];
                  delete newPositions[i];
                }
              }
              return newPositions;
            });

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
    };
    
    const newEdge = {
      id: `e${nodes.length}-${nodes.length + 1}`,
      source: nodes[nodes.length - 1].id,
      target: newNode.id,
      type: 'bezier',
      animated: currentSteps[currentSteps.length - 1].status === 'running',
      style: { 
        stroke: '#9333ea',
        strokeWidth: 1.5
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#9333ea',
        width: 20,
        height: 20
      }
    };
    
    setNodePositions(prev => ({ ...prev, [newNode.id]: newNode.position }));
    setEdges(prev => [...prev, newEdge]);
    setCurrentSteps(prev => [...prev, { 
      name: stepType.name, 
      status: 'pending', 
      subSteps: [],
      type: stepType.id
    }]);
    setIsAddStepDialogOpen(false);
  };

  // Initialize steps from workflow prop
  useEffect(() => {
    if (workflow.steps) {
      setCurrentSteps(workflow.steps);
    }
  }, [workflow.steps]);

  // Initialize node positions if not set
  useEffect(() => {
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
  const getFlowElements = useCallback(() => {
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
  useEffect(() => {
    // Create default sequential connections
    const defaultEdges: Edge[] = currentSteps.slice(0, -1).map((_, index) => ({
      id: `e${index}-${index + 1}`,
      source: `${index}`,
      target: `${index + 1}`,
      type: 'bezier',
      animated: currentSteps[index].status === 'running',
      style: { 
        stroke: currentSteps[index].status === 'completed' ? '#9333ea' : 
                currentSteps[index].status === 'running' ? '#7e22ce' : 
                '#a855f7',
        strokeWidth: 1.5
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: currentSteps[index].status === 'completed' ? '#9333ea' : 
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
  const handleSubStep = useCallback((stepIndex: number, subStepIndex: number) => {
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
  const runWorkflow = useCallback(() => {
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
      <Card className="bg-[#1A0B2E] border-[#6D28D9]/20">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-1">
              <CardTitle>
                {workflow.name}
              </CardTitle>
              <div className="text-sm text-purple-200/80">
                {workflow.description}
              </div>
            </div>
            {/* Metrics moved to top right, made smaller */}
            <div className="flex space-x-4 text-right">
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-purple-200/60">Active</div>
                <div className="text-sm font-semibold text-purple-200">
                  {workflow.activeInstances}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-purple-200/60">Success</div>
                <div className="text-sm font-semibold text-purple-200">
                  {workflow.successRate}%
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-purple-200/60">Done</div>
                <div className="text-sm font-semibold text-purple-200">
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
                <span className="text-sm font-medium text-purple-200">Workflow Diagram</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="bg-[#2D1B69]/30 hover:bg-[#2D1B69] text-purple-200 border-purple-500/20"
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
            <div className="h-[170px] bg-[#1A0B2E] rounded-xl border border-[#6D28D9]/20 overflow-hidden relative">
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
                  margin-top: 55px;
                  margin-right: 6px;
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
                  background: #7C3AED !important;
                  color: white !important;
                }
                .react-flow__controls-button svg {
                  fill: currentColor;
                  width: 10px;
                  height: 10px;
                }
                .react-flow__controls-button[title="fit view"] svg {
                  transform: scale(0.8);
                }
                .react-flow__controls-button + .react-flow__controls-button {
                  margin-top: 6px !important;
                }
              `}</style>
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(109, 40, 217, 0.3) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(109, 40, 217, 0.3) 1px, transparent 1px),
                    linear-gradient(to right, rgba(109, 40, 217, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(109, 40, 217, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '24px 24px, 24px 24px, 8px 8px, 8px 8px',
                  opacity: 0.8,
                  pointerEvents: 'none'
                }}
              />
              <ReactFlow
                nodes={nodes}
                edges={edges}
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
                      stroke: '#9333ea',
                      strokeWidth: 1.5
                    },
                    markerEnd: {
                      type: MarkerType.ArrowClosed,
                      color: '#9333ea',
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
                <Background 
                  color="#475569"
                  variant={BackgroundVariant.Dots}
                  gap={20}
                  size={1}
                  style={{ opacity: 0.2 }}
                />
                <Controls 
                  showInteractive={false}
                  className="bg-[#2D1B69]/30 backdrop-blur-sm border-purple-500/20 text-purple-200" 
                />
                {/* Add Step Button */}
                <div className="absolute bottom-4 right-4 z-10">
                  <button
                    onClick={() => setIsAddStepDialogOpen(true)}
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
                  <div className="text-sm font-medium text-purple-200">Current Progress</div>
                  <div className="text-xs text-purple-400">Step {currentStepIndex + 1} of {currentSteps.length}</div>
                </div>
                <div className="p-4 rounded-lg bg-[#2D1B69]/30 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <RotateCw className="w-4 h-4 text-purple-400 animate-spin" />
                      <div>
                        <div className="text-sm font-medium text-purple-200">
                          {currentSteps[currentStepIndex].name}
                        </div>
                        <div className="text-xs text-purple-400 mt-1">
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
                          className={`flex items-center justify-between p-2.5 rounded-lg transition-colors duration-200 ${
                            subStep.status === 'running' ? 'bg-[#2D1B69]/50 shadow-lg shadow-purple-500/10' :
                            subStep.status === 'completed' ? 'bg-[#2D1B69]/30' :
                            'bg-[#2D1B69]/10'
                          }`}
                        >
                          <div className="flex items-center min-w-0 gap-3">
                            <div className="relative flex items-center justify-center w-[3rem] flex-shrink-0">
                              <div className={`w-5 h-5 rounded-full transition-all duration-300 border-2 flex items-center justify-center ${
                                subStep.status === 'running' ? 'border-purple-400 bg-[#1A0B2E] shadow-lg shadow-purple-500/20' :
                                subStep.status === 'completed' ? 'border-green-400 bg-green-400' :
                                'border-purple-500/20 bg-[#1A0B2E]'
                              }`}>
                                {subStep.status === 'running' && (
                                  <RotateCw className="w-2.5 h-2.5 text-purple-400 animate-spin" />
                                )}
                                {subStep.status === 'completed' && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A0B2E]" />
                                )}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-normal text-purple-200/90 truncate leading-tight">{subStep.name}</p>
                            </div>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ml-4 font-medium ${
                            subStep.status === 'completed' ? 'bg-green-400/10 text-green-400' :
                            subStep.status === 'running' ? 'bg-purple-400/10 text-purple-400' :
                            'bg-purple-400/5 text-purple-400/50'
                          }`}>
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
              <DialogContent className="bg-[#1A0B2E] border-[#6D28D9]/20 text-purple-200 max-w-[90%] w-[90%]">
                <DialogHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <DialogTitle className="text-xl font-semibold">Campaign Review</DialogTitle>
                    </div>
                  </div>
                </DialogHeader>

                <div className="grid grid-cols-12 gap-5 py-5 max-h-[72vh] overflow-y-auto">
                  {/* Left Column - Campaign Details */}
                  <div className="col-span-8 space-y-5">
                    {/* Campaign Configuration Section */}
                    <div className="space-y-5 bg-[#2D1B69]/10 rounded-lg p-5">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-purple-400" />
                        <h3 className="text-base font-medium text-purple-300">Campaign Configuration</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-5">
                        {/* Basic Info */}
                        <div className="space-y-2">
                          <label className="text-sm text-purple-400">Campaign Name</label>
                          <div className="p-4 bg-[#2D1B69]/30 rounded-lg">
                            <p className="text-sm font-medium">{campaignConfig.name}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-purple-400">Brand Persona</label>
                          <div className="p-4 bg-[#2D1B69]/30 rounded-lg">
                            <p className="text-sm font-medium">{campaignConfig.brandPersona}</p>
                          </div>
                        </div>
                      </div>

                      {/* Target Demographic */}
                      <div className="space-y-3">
                        <label className="text-sm text-purple-400">Target Demographic</label>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 bg-[#2D1B69]/30 rounded-lg">
                            <p className="text-xs text-purple-400 mb-1">Age Range</p>
                            <p className="text-sm font-medium">{campaignConfig.targetDemographic.ageRange.min} - {campaignConfig.targetDemographic.ageRange.max} years</p>
                          </div>
                          <div className="p-4 bg-[#2D1B69]/30 rounded-lg">
                            <p className="text-xs text-purple-400 mb-1">Gender</p>
                            <p className="text-sm font-medium capitalize">{campaignConfig.targetDemographic.gender.join(', ')}</p>
                          </div>
                          <div className="p-4 bg-[#2D1B69]/30 rounded-lg">
                            <p className="text-xs text-purple-400 mb-1">Locations</p>
                            <p className="text-sm font-medium">{campaignConfig.targetDemographic.locations.join(', ')}</p>
                          </div>
                        </div>
                      </div>

                      {/* Budget Distribution */}
                      <div className="space-y-3">
                        <label className="text-sm text-purple-400">Budget Distribution</label>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="p-4 bg-[#2D1B69]/30 rounded-lg">
                            <p className="text-xs text-purple-400 mb-1">Total Daily Budget</p>
                            <p className="text-sm font-medium">{campaignConfig.budget.currency} {campaignConfig.budget.total}</p>
                          </div>
                          {Object.entries(campaignConfig.adPlatforms).map(([platform, data]) => (
                            data.selected && (
                              <div key={platform} className="p-4 bg-[#2D1B69]/30 rounded-lg">
                                <p className="text-xs text-purple-400 mb-1 capitalize">{platform}</p>
                                <p className="text-sm font-medium">
                                  {data.budget}% 
                                  <span className="text-purple-400 text-xs ml-1">
                                    ({campaignConfig.budget.currency} {(campaignConfig.budget.total * data.budget / 100).toFixed(2)})
                                  </span>
                                </p>
                              </div>
                            )
                          ))}
                        </div>
                      </div>

                      {/* Campaign Duration */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm text-purple-400">Start Date</label>
                          <div className="p-4 bg-[#2D1B69]/30 rounded-lg">
                            <p className="text-sm font-medium">{new Date(campaignConfig.dates.start).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-purple-400">End Date</label>
                          <div className="p-4 bg-[#2D1B69]/30 rounded-lg">
                            <p className="text-sm font-medium">{new Date(campaignConfig.dates.end).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Creative Assets Section */}
                    <div className="space-y-5 bg-[#2D1B69]/10 rounded-lg p-5">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <h3 className="text-base font-medium text-purple-300">Creative Assets</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-5">
                        {creativeAssets.images.map((image, index) => (
                          <div key={index} className="group relative">
                            <div className="aspect-square bg-[#2D1B69]/30 rounded-lg overflow-hidden">
                              <img 
                                src={image.url} 
                                alt={`Creative ${index + 1}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                  <p className="text-xs text-center text-purple-200">
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
                  <div className="col-span-4 space-y-5 h-full">
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-5 space-y-5">
                        <section>
                          <h3 className="text-lg font-medium text-purple-50 mb-4">Ad Copy</h3>
                          <div className="space-y-5">
                            {/* Headlines */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-purple-200">Headlines</h4>
                              <div className="space-y-2">
                                {generatedContent.headlines.map((headline, index) => (
                                  <div key={index} className="p-3 bg-[#2D1B69]/30 rounded-lg">
                                    <p className="text-sm font-medium">{headline}</p>
                                    <div className="mt-1 flex items-center justify-between">
                                      <span className="text-xs text-purple-200/70">Headline {index + 1}</span>
                                      <span className="text-xs text-purple-200/70">{headline.length} chars</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Descriptions */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-purple-200">Descriptions</h4>
                              <div className="space-y-2">
                                {generatedContent.descriptions.map((desc, index) => (
                                  <div key={index} className="p-3 bg-[#2D1B69]/30 rounded-lg">
                                    <p className="text-sm font-medium">{desc}</p>
                                    <div className="mt-1 flex items-center justify-between">
                                      <span className="text-xs text-purple-200/70">Description {index + 1}</span>
                                      <span className="text-xs text-purple-200/70">{desc.length} chars</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Captions */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-purple-200">Captions</h4>
                              <div className="space-y-2">
                                {generatedContent.captions.map((caption, index) => (
                                  <div key={index} className="p-3 bg-[#2D1B69]/30 rounded-lg">
                                    <p className="text-sm font-medium">{caption}</p>
                                    <div className="mt-1 flex items-center justify-between">
                                      <span className="text-xs text-purple-200/70">Caption {index + 1}</span>
                                      <span className="text-xs text-purple-200/70">{caption.length} chars</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="border-t border-purple-500/20 pt-6">
                  <div className="flex items-center justify-between w-full">
                    <Button
                      variant="outline"
                      onClick={() => setIsReviewDialogOpen(false)}
                      className="bg-[#2D1B69]/30 hover:bg-[#2D1B69] text-purple-200 border border-purple-500/20"
                    >
                      Cancel Workflow
                    </Button>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-purple-500/10 px-4 py-2 rounded-lg">
                        <CircularTimer timeLeft={timeLeft} />
                        <span className="text-sm font-medium text-purple-300">Auto-publishing</span>
                      </div>
                      <Button
                        onClick={() => {
                          setIsReviewDialogOpen(false);
                          navigate('/campaigns');
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Approve and Publish
                      </Button>
                    </div>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Step Selection Dialog */}
            <Dialog open={isAddStepDialogOpen} onOpenChange={setIsAddStepDialogOpen}>
              <DialogContent className="bg-[#1A0B2E] border-[#6D28D9]/20 text-purple-50 max-w-md">
                <div className="border-b border-purple-500/20 px-4 py-3">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                      Add New Step
                    </DialogTitle>
                  </DialogHeader>
                </div>

                <div className="px-4 py-3 space-y-2 overflow-y-auto scrollbar-thin scrollbar-track-purple-500/10 scrollbar-thumb-purple-500/40 hover:scrollbar-thumb-purple-500/60 max-h-[calc(60vh-120px)]">
                  <div className="space-y-2">
                    {stepTypes.map((stepType) => (
                      <button
                        key={stepType.id}
                        className="w-full bg-[#3D2B79]/40 hover:bg-[#2D1B69] text-purple-200 border border-purple-500/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-3 transition-colors"
                        onClick={() => {
                          const TypeIcon = stepType.icon;
                          handleAddStep(stepType);
                          setIsAddStepDialogOpen(false);
                        }}
                      >
                        {React.createElement(stepType.icon, { className: "w-5 h-5 text-purple-400" })}
                        <div className="text-left">
                          <div className="font-medium">{stepType.name}</div>
                          <div className="text-sm text-purple-300/70">{stepType.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddStepDialogOpen(false)}
                      className="bg-[#2D1B69]/30 hover:bg-[#2D1B69] text-purple-200 border border-purple-500/20"
                    >
                      Cancel
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default function AIWorkflows() {
  const [workflows] = useState<Workflow[]>(workflowTemplates);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isCustomWorkflowDialogOpen, setIsCustomWorkflowDialogOpen] = useState(false);
  const [businessGoal, setBusinessGoal] = useState('');
  const [customWorkflowName, setCustomWorkflowName] = useState('');
  const [customWorkflowDescription, setCustomWorkflowDescription] = useState('');
  const [selectedProcess, setSelectedProcess] = useState<string>('');
  const [customNodes, setCustomNodes] = useState<Node[]>([]);
  const [customEdges, setCustomEdges] = useState<Edge[]>([]);

  const handleSaveWorkflow = () => {
    if (!customWorkflowName.trim()) {
      // You might want to add proper error handling/notification here
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

    // Add the new workflow to the list
    workflows.push(newWorkflow);
    
    // Reset form
    setCustomWorkflowName('');
    setCustomWorkflowDescription('');
    setCustomNodes([]);
    setCustomEdges([]);
    setIsCustomWorkflowDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0720] via-[#1A0B2E] to-[#0F0720]">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link 
                  to="/" 
                  className="inline-flex items-center text-sm text-purple-300/80 hover:text-purple-200"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-purple-300/60" />
                  <span className="ml-1 text-sm text-purple-200 md:ml-2">
                    AI Workflows
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 mb-2">
              AI Workflows
            </h1>
            <div className="flex justify-between items-center">
              <p className="text-purple-300/80">Manage and monitor your AI-powered workflows</p>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="bg-[#3D2B79]/40 hover:bg-[#2D1B69] text-purple-200 border border-purple-500/20 backdrop-blur-sm"
                  onClick={() => setIsCustomWorkflowDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add custom workflow
                </Button>
                <Button
                  variant="ghost"
                  className="bg-[#3D2B79]/40 hover:bg-[#2D1B69] text-purple-200 border border-purple-500/20 backdrop-blur-sm"
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
            <DialogContent className="bg-[#1A0B2E] border-[#6D28D9]/20 text-purple-50 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Tell us about your workflow goal</DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-purple-200/70">Business Goal</label>
                  <textarea
                    value={businessGoal}
                    onChange={(e) => setBusinessGoal(e.target.value)}
                    placeholder="E.g., Increase brand awareness, drive website traffic, generate leads..."
                    className="w-full h-32 px-3 py-2 bg-[#2D1B69]/30 border border-purple-500/20 rounded-lg text-purple-50 placeholder:text-purple-200/30 focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none"
                  />
                </div>

                <div className="text-sm text-purple-200/50">
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
                    className="bg-[#2D1B69]/30 hover:bg-[#2D1B69] text-purple-200 border border-purple-500/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setIsGoalDialogOpen(false);
                      // You can pass the business goal to the selected workflow here
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Get Started
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Custom Workflow Dialog */}
          <Dialog open={isCustomWorkflowDialogOpen} onOpenChange={setIsCustomWorkflowDialogOpen}>
            <DialogContent className="bg-[#1A0B2E] border-[#6D28D9]/20 text-purple-50 max-w-4xl h-[80vh] overflow-y-auto">
              <DialogHeader className="space-y-2 pb-4 border-b border-purple-500/20">
                <DialogTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-400">
                  Create Custom Workflow
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex flex-col space-y-6 py-6">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-purple-200">
                        Workflow Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter workflow name"
                        className="bg-[#2D1B69]/40 border-purple-500/20 text-purple-50 placeholder:text-purple-200/30 focus:ring-2 focus:ring-purple-500/30"
                        value={customWorkflowName}
                        onChange={(e) => setCustomWorkflowName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="process" className="text-sm font-medium text-purple-200">
                        Select Process
                      </Label>
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
                        <SelectTrigger className="bg-[#2D1B69]/40 border-purple-500/20 text-purple-50">
                          <SelectValue placeholder="Select a process type" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A0B2E] border-purple-500/20">
                          {stepTypes.map((type) => (
                            <SelectItem 
                              key={type.id} 
                              value={type.id}
                              className="bg-[#3D2B79]/40 hover:bg-[#2D1B69] text-purple-200 border border-purple-500/20 flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                {React.createElement(type.icon, { className: "w-4 h-4" })}
                                <span>{type.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* ReactFlow Canvas */}
                <div className="flex-1 bg-[#2D1B69]/20 rounded-lg border border-purple-500/20 min-h-[400px] relative">
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
                        style: { stroke: '#6D28D9', strokeWidth: 2 },
                        markerEnd: {
                          type: MarkerType.ArrowClosed,
                          color: '#6D28D9'
                        }
                      };
                      setCustomEdges((eds) => addEdge(newEdge, eds));
                    }}
                  >
                    <Background 
                      color="#475569"
                      variant={BackgroundVariant.Dots}
                      gap={20}
                      size={1}
                      style={{ opacity: 0.2 }}
                    />
                    <Controls className="bg-[#2D1B69]/40 border border-purple-500/20 rounded-lg" />
                  </ReactFlow>
                </div>
              </div>

              <DialogFooter className="pt-6 border-t border-purple-500/20">
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsCustomWorkflowDialogOpen(false)}
                    className="bg-[#2D1B69]/30 hover:bg-[#2D1B69] text-purple-200 border border-purple-500/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveWorkflow}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
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
