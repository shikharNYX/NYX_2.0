import { 
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  Home,
  ImageIcon,
  Loader2,
  Pause,
  Play,
  Plus,
  Rocket,
  Target,
  Upload,
  Wand2,
  X,
  Pencil,
  Settings
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link, useParams } from 'react-router-dom';
import ReactFlow, { 
  Node, 
  Edge,
  MarkerType,
  Position,
  Panel,
  Background,
  Controls,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import 'reactflow/dist/style.css';
import { useState, useCallback } from 'react';
import CustomNode from '../components/CustomNode';
import { Slider } from "@/components/ui/slider";
import cn from 'classnames';

interface WorkflowNode {
  id: string;
  position: { x: number; y: number };
  data: {
    label: string;
    status: 'pending' | 'active' | 'completed' | 'error';
    type: 'start' | 'process' | 'decision' | 'end';
  };
  type: 'custom';
}

interface ProcessLog {
  id: string;
  message: string;
  status: 'running' | 'completed' | 'error' | 'waiting';
  timestamp: string;
  details?: string[];
  requiresInput?: boolean;
  inputProvided?: boolean;
  inputOptions?: {
    type: 'select' | 'text' | 'multiselect' | 'file' | 'form' | 'approval' | 'confirmation';
    options?: { value: string; label: string }[];
    placeholder?: string;
    fields?: { label: string; type: string; value: string }[];
    accept?: string;
    multiple?: boolean;
    placeholder?: { name: string; size: string; type: string }[];
    message?: string;
    warning?: string;
  };
  output?: {
    headlines: string[];
    captions: string[];
    descriptions: string[];
  };
}

const initialNodes: WorkflowNode[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 300, y: 0 },
    data: { 
      label: 'Brand Details',
      status: 'completed',
      type: 'start'
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 300, y: 200 },
    data: { 
      label: 'Campaign Planning',
      status: 'completed',
      type: 'process'
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 300, y: 400 },
    data: { 
      label: 'Content Generation',
      status: 'completed',
      type: 'process'
    },
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 300, y: 600 },
    data: { 
      label: 'Creative Review',
      status: 'completed',
      type: 'decision'
    },
  },
  {
    id: '5',
    type: 'custom',
    position: { x: 300, y: 800 },
    data: { 
      label: 'Campaign Review',
      status: 'completed',
      type: 'decision'
    },
  },
  {
    id: '6',
    type: 'custom',
    position: { x: 300, y: 1000 },
    data: { 
      label: 'Launch Setup',
      status: 'running',
      type: 'process'
    },
  },
  {
    id: '7',
    type: 'custom',
    position: { x: 300, y: 1200 },
    data: { 
      label: 'Campaign Launch',
      status: 'waiting',
      type: 'end'
    },
  },
];

const initialEdges: Edge[] = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    style: { 
      stroke: '#6D28D9', 
      strokeWidth: 2
    },
    type: 'bezier',
    markerEnd: {
      type: 'arrowclosed',
      width: 15,
      height: 15,
      color: '#6D28D9',
    }
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3', 
    style: { 
      stroke: '#6D28D9', 
      strokeWidth: 2
    },
    type: 'bezier',
    markerEnd: {
      type: 'arrowclosed',
      width: 15,
      height: 15,
      color: '#6D28D9',
    }
  },
  { 
    id: 'e3-4', 
    source: '3', 
    target: '4', 
    style: { 
      stroke: '#6D28D9', 
      strokeWidth: 2
    },
    type: 'bezier',
    markerEnd: {
      type: 'arrowclosed',
      width: 15,
      height: 15,
      color: '#6D28D9',
    }
  },
  { 
    id: 'e4-5', 
    source: '4', 
    target: '5', 
    style: { 
      stroke: '#6D28D9', 
      strokeWidth: 2
    },
    type: 'bezier',
    markerEnd: {
      type: 'arrowclosed',
      width: 15,
      height: 15,
      color: '#6D28D9',
    }
  },
  { 
    id: 'e5-6', 
    source: '5', 
    target: '6', 
    style: { 
      stroke: '#6D28D9', 
      strokeWidth: 2
    },
    type: 'bezier',
    markerEnd: {
      type: 'arrowclosed',
      width: 15,
      height: 15,
      color: '#6D28D9',
    }
  },
  { 
    id: 'e6-7', 
    source: '6', 
    target: '7', 
    style: { 
      stroke: '#6D28D9', 
      strokeWidth: 2
    },
    type: 'bezier',
    markerEnd: {
      type: 'arrowclosed',
      width: 15,
      height: 15,
      color: '#6D28D9',
    }
  },
];

const initialLogs: ProcessLog[] = [
  {
    id: '1',
    status: 'completed',
    message: 'Campaign Planning',
    timestamp: '2 mins ago',
    requiresInput: true,
    inputOptions: {
      type: 'form',
      fields: [
        { label: 'Campaign Type', type: 'select', options: ['Brand Awareness', 'Lead Generation', 'Website Traffic'] },
        { label: 'Primary Message', type: 'text', value: 'Revolutionize your workflow' },
        { label: 'Secondary Message', type: 'text', value: 'Cut operational costs by 40%' }
      ]
    }
  },
  {
    id: '2',
    status: 'completed',
    message: 'Content Generation',
    timestamp: '1 min ago',
    requiresInput: false,
    details: [
      'Generated Content Based on User Input',
      'Content will be shown in final review'
    ]
  },
  {
    id: '3',
    status: 'completed',
    message: 'Creative Upload',
    timestamp: '1 min ago',
    requiresInput: true,
    inputOptions: {
      type: 'file',
      accept: '.jpg,.png,.gif',
      placeholder: [
        { type: 'LinkedIn Banner', size: '1200x627px', name: 'linkedin.jpg' },
        { type: 'Meta Ad', size: '1080x1080px', name: 'meta.jpg' }
      ]
    }
  },
  {
    id: '4',
    status: 'completed',
    message: 'Campaign Review',
    timestamp: 'Just now',
    requiresInput: true,
    inputOptions: {
      type: 'approval'
    }
  },
  {
    id: '5',
    status: 'waiting',
    message: 'Campaign Launch',
    timestamp: 'Pending Review',
    requiresInput: true,
    inputOptions: {
      type: 'confirmation',
      message: 'Are you ready to launch the campaign?',
      warning: 'This action cannot be undone'
    }
  }
];

const campaignContent = {
  headlines: ['Headline 1', 'Headline 2', 'Headline 3'],
  captions: ['Caption 1', 'Caption 2', 'Caption 3'],
  descriptions: ['Description 1', 'Description 2'],
  selectedChannels: ['Google Ads', 'Meta Ads', 'LinkedIn Ads'],
  targeting: {
    ageRange: { min: 25, max: 45 },
    gender: 'All',
    locations: ['United States', 'Canada'],
  },
  budget: {
    total: 5000,
    dailyDistribution: {
      'LinkedIn Ads': 50,
      'Google Ads': 30,
      'Meta Ads': 20
    },
    split: {
      'LinkedIn Ads': 45,
      'Google Ads': 35,
      'Meta Ads': 20
    }
  },
  schedule: {
    startDate: '2024-03-01',
    endDate: '2024-03-31'
  }
};

const nodeTypes = {
  custom: CustomNode,
};

const getStatusIcon = (status: ProcessLog['status']) => {
  switch (status) {
    case 'running':
      return (
        <div className="relative">
          <div className="absolute animate-ping w-2.5 h-2.5 bg-blue-500 rounded-full" />
          <div className="relative w-2.5 h-2.5 bg-blue-500 rounded-full" />
        </div>
      );
    case 'completed':
      return <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />;
    case 'error':
      return <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />;
    case 'waiting':
      return <div className="w-2.5 h-2.5 bg-purple-500/40 rounded-full" />;
  }
};

const getStatusColor = (status: ProcessLog['status']) => {
  switch (status) {
    case 'running':
      return 'text-blue-400';
    case 'completed':
      return 'text-green-400';
    case 'error':
      return 'text-red-400';
    case 'waiting':
      return 'text-purple-300/60';
  }
};

const getNodeStyle = (status: string, type: string) => {
  const baseStyle = {
    padding: '15px',
    borderRadius: '12px',
    border: '1px solid',
    minWidth: '250px',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.3s ease',
  };

  let typeStyle = {};
  switch (type) {
    case 'start':
      typeStyle = {
        background: 'rgba(16, 185, 129, 0.1)',
        color: '#A7F3D0',
        borderColor: '#10B981',
        boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.1)',
      };
      break;
    case 'process':
      typeStyle = {
        background: 'rgba(59, 130, 246, 0.1)',
        color: '#BFDBFE',
        borderColor: '#3B82F6',
        boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1)',
      };
      break;
    case 'decision':
      typeStyle = {
        background: 'rgba(75, 85, 99, 0.1)',
        color: '#E5E7EB',
        borderColor: '#4B5563',
        boxShadow: '0 4px 6px -1px rgba(75, 85, 99, 0.1)',
      };
      break;
    case 'end':
      typeStyle = {
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#FECACA',
        borderColor: '#EF4444',
        boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.1)',
      };
      break;
    default:
      typeStyle = {
        background: 'rgba(107, 114, 128, 0.1)',
        color: '#F3F4F6',
        borderColor: '#6B7280',
      };
  }

  const statusStyle = {
    opacity: status === 'pending' ? 0.5 : 1,
    boxShadow: status === 'active' 
      ? `0 0 0 2px ${typeStyle.borderColor}, 0 0 20px ${typeStyle.borderColor}` 
      : typeStyle.boxShadow,
  };

  return {
    ...baseStyle,
    ...typeStyle,
    ...statusStyle,
  };
};

export default function WorkflowDetails() {
  const { id } = useParams();
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [logs, setLogs] = useState<ProcessLog[]>(initialLogs);
  const [selectedOutput, setSelectedOutput] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Enable node dragging
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // Enable edge modifications
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Handle new edge connections
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        type: 'bezier',
        style: { 
          stroke: '#6D28D9',
          strokeWidth: 2
        },
        markerEnd: {
          type: 'arrowclosed',
          width: 15,
          height: 15,
          color: '#6D28D9',
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Custom controls for the flow
  const controls = (
    <Panel position="top-right" className="bg-[#1A0B2E]/80 p-4 rounded-lg border border-[#6D28D9]/20 space-y-4">
      <div className="flex flex-col gap-2">
        <Button 
          onClick={() => setIsRunning(!isRunning)}
          className={`w-full ${
            isRunning 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-[#6D28D9] hover:bg-[#5B21B6]'
          }`}
        >
          {isRunning ? (
            <div className="flex items-center gap-2">
              <Pause className="w-4 h-4" />
              <span>Pause Workflow</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span>Start Workflow</span>
            </div>
          )}
        </Button>

        <Button 
          onClick={() => {
            const newNode = {
              id: `node-${nodes.length + 1}`,
              position: { x: 400, y: 100 },
              data: { 
                label: 'New Step',
                status: 'pending',
                type: 'process'
              },
              type: 'custom'
            };
            setNodes((nds) => [...nds, newNode]);
          }}
          className="w-full bg-[#2D1B69] hover:bg-[#3D2B79]"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Step</span>
          </div>
        </Button>

        {selectedNode && (
          <div className="space-y-2 p-3 bg-[#2D1B69]/50 rounded-lg">
            <h3 className="text-sm font-medium text-purple-200">Selected Node</h3>
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  setNodes(nodes.filter(n => n.id !== selectedNode.id));
                  setEdges(edges.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));
                  setSelectedNode(null);
                }}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300"
              >
                Delete
              </Button>
              <Select
                value={selectedNode.data.type}
                onValueChange={(value) => {
                  setNodes(nodes.map(n => 
                    n.id === selectedNode.id 
                      ? { ...n, data: { ...n.data, type: value } }
                      : n
                  ));
                }}
              >
                <SelectTrigger className="w-full bg-[#2D1B69]/50">
                  <SelectValue placeholder="Step Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="start">Start</SelectItem>
                  <SelectItem value="process">Process</SelectItem>
                  <SelectItem value="decision">Decision</SelectItem>
                  <SelectItem value="end">End</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );

  const handleInputSubmit = (logId: string, input: any) => {
    const updatedLogs = logs.map(log => {
      if (log.id === logId) {
        return {
          ...log,
          inputProvided: true,
          status: 'completed',
          details: getUpdatedDetails(log.message, input)
        };
      }
      if (parseInt(log.id) === parseInt(logId) + 1) {
        return {
          ...log,
          status: 'running'
        };
      }
      return log;
    });
    setLogs(updatedLogs);
  };

  const getUpdatedDetails = (step: string, input: any) => {
    switch (step) {
      case 'Creative Review':
        return [
          'Creative Assets Review',
          '',
          'Uploaded Assets:',
          `1. LinkedIn Banner (${input.files[0].name})`,
          '   Status: Approved',
          '   Feedback: "Strong visual hierarchy, clear value proposition"',
          '',
          `2. Meta Ad Creative (${input.files[1].name})`,
          '   Status: Approved',
          '   Feedback: "Engaging visuals, compelling CTA"',
          '',
          'Brand Compliance:',
          '- Color Schema: ✓ Compliant',
          '- Typography: ✓ Compliant',
          '- Logo Usage: ✓ Compliant',
          '- Image Guidelines: ✓ Compliant'
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0720] via-[#1A0B2E] to-[#0F0720]">
      <div className="p-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="inline-flex items-center text-sm text-purple-300/80 hover:text-purple-200">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-purple-300/60" />
                  <Link to="/ai-workflows" className="ml-1 text-sm text-purple-300/80 hover:text-purple-200 md:ml-2">
                    AI Workflows
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-purple-300/60" />
                  <span className="ml-1 text-sm text-purple-200 md:ml-2">
                    Traffic Campaign Setup and Launch Workflow
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
                Traffic Campaign Setup and Launch Workflow
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-6">
            {/* Flow Diagram */}
            <div className="col-span-4 bg-[#1A0B2E]/80 border border-[#6D28D9]/20 backdrop-blur-xl rounded-lg overflow-hidden" style={{ height: '800px' }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                snapToGrid
                snapGrid={[15, 15]}
                defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
                minZoom={0.2}
                maxZoom={1.5}
                defaultEdgeOptions={{
                  type: 'smoothstep',
                  style: { 
                    stroke: '#6D28D9', 
                    strokeWidth: 3,
                    opacity: 0.8
                  },
                  markerEnd: {
                    type: 'arrowclosed',
                    width: 20,
                    height: 20,
                    color: '#6D28D9',
                  },
                }}
                className="bg-[#110726]"
              >
                <Background 
                  color="#6D28D9" 
                  gap={20} 
                  size={1.5} 
                  style={{ opacity: 0.1 }}
                />
                <Controls className="bg-[#1A0B2E]/80 border border-[#6D28D9]/20 rounded-lg" />
                {controls}
              </ReactFlow>
            </div>

            {/* Right Panel with Process and Output */}
            <div className="col-span-3 space-y-6">
              {/* Process Steps */}
              <Card className="bg-[#1A0B2E]/80 border-[#6D28D9]/20 backdrop-blur-xl">
                <div className="p-4 border-b border-[#6D28D9]/20">
                  <h2 className="text-lg font-medium text-purple-200">Process Steps</h2>
                </div>
                <ScrollArea className="h-[940px]">
                  <div className="p-4 space-y-4">
                    {logs.map((log) => (
                      <div key={log.id} 
                        className={`bg-[#2D1B69]/20 rounded-lg overflow-hidden border transition-all duration-300 ${
                          log.status === 'running' ? 'border-[#6D28D9]' : 'border-[#6D28D9]/20'
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(log.status)}
                              <h3 className={`text-base font-medium ${getStatusColor(log.status)}`}>
                                {log.message}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2">
                              {log.status === 'completed' && (
                                <Button
                                  onClick={() => setSelectedOutput(selectedOutput === log.id ? null : log.id)}
                                  size="sm"
                                  variant="ghost"
                                  className={`text-xs transition-colors ${
                                    selectedOutput === log.id 
                                      ? 'text-purple-300 bg-[#6D28D9]/20' 
                                      : 'text-purple-300/60 hover:text-purple-300'
                                  }`}
                                >
                                  {selectedOutput === log.id ? (
                                    <div className="flex items-center gap-1">
                                      <ChevronDown className="w-3 h-3" />
                                      Hide Output
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1">
                                      <ChevronRight className="w-3 h-3" />
                                      View Output
                                    </div>
                                  )}
                                </Button>
                              )}
                              <span className="text-xs text-purple-300/60 bg-[#2D1B69]/30 px-2 py-1 rounded-full">
                                {log.timestamp}
                              </span>
                            </div>
                          </div>

                          {/* Show input fields only when step is waiting */}
                          {log.requiresInput && log.status === 'waiting' && (
                            <div className="mt-4">
                              {log.inputOptions?.type === 'text' && (
                                <div className="space-y-2">
                                  <textarea
                                    className="w-full px-3 py-2 bg-[#2D1B69]/30 border border-[#6D28D9]/30 rounded-md text-purple-200 placeholder-purple-300/40 focus:outline-none focus:border-[#6D28D9]"
                                    placeholder={log.inputOptions.placeholder}
                                    rows={4}
                                  />
                                  <Button className="w-full bg-[#6D28D9] hover:bg-[#5B21B6] transition-colors">
                                    Submit Goal
                                  </Button>
                                </div>
                              )}
                              {log.inputOptions?.type === 'file' && (
                                <div className="space-y-4">
                                  {/* Placeholder Images */}
                                  <div className="grid grid-cols-2 gap-4">
                                    {log.inputOptions.placeholder?.map((placeholder, index) => (
                                      <div key={index} className="bg-[#2D1B69]/30 rounded-lg p-4 border border-[#6D28D9]/20">
                                        <div className="aspect-video bg-[#1A0B2E] rounded-lg flex items-center justify-center mb-3">
                                          <Upload className="w-8 h-8 text-purple-400/40" />
                                        </div>
                                        <div className="text-sm text-purple-200">{placeholder.type}</div>
                                        <div className="text-xs text-purple-300/60">{placeholder.size}</div>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  {/* Upload Button - Simulates upload on click */}
                                  <Button 
                                    className="w-full bg-[#6D28D9] hover:bg-[#5B21B6] transition-colors"
                                    onClick={() => handleInputSubmit(log.id, {
                                      files: log.inputOptions.placeholder?.map(p => ({ name: p.name }))
                                    })}
                                  >
                                    Upload Images
                                  </Button>
                                </div>
                              )}
                              {log.inputOptions?.type === 'form' && (
                                <div className="space-y-2">
                                  {log.inputOptions.fields.map((field, index) => (
                                    <div key={index} className="flex flex-col gap-2">
                                      <label className="text-sm text-purple-300/70">{field.label}</label>
                                      {field.type === 'number' && (
                                        <input
                                          type="number"
                                          value={field.value}
                                          className="w-full px-3 py-2 bg-[#2D1B69]/30 border border-[#6D28D9]/30 rounded-md"
                                        />
                                      )}
                                      {field.type === 'select' && (
                                        <Select
                                          value={field.value}
                                          onValueChange={(value) => {
                                            // Update field value
                                          }}
                                        >
                                          <SelectTrigger className="w-full bg-[#2D1B69]/50">
                                            <SelectValue placeholder={field.label} />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {log.inputOptions.options?.map((option) => (
                                              <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      )}
                                      {field.type === 'text' && (
                                        <textarea
                                          className="w-full px-3 py-2 bg-[#2D1B69]/30 border border-[#6D28D9]/30 rounded-md text-purple-200 placeholder-purple-300/40"
                                          rows={4}
                                        />
                                      )}
                                    </div>
                                  ))}
                                  <Button className="w-full bg-[#6D28D9] hover:bg-[#5B21B6] transition-colors">
                                    Submit
                                  </Button>
                                </div>
                              )}
                              {log.inputOptions?.type === 'approval' && (
                                <div className="space-y-4">
                                  {/* Content Review */}
                                  <div className="bg-[#2D1B69]/30 p-4 rounded-lg border border-[#6D28D9]/20">
                                    <h3 className="text-sm font-medium text-purple-200 mb-3">Campaign Content</h3>
                                    <div className="space-y-4">
                                      {/* Selected Channels */}
                                      <div>
                                        <div className="text-xs text-purple-300/60 mb-2">Selected Channels</div>
                                        <div className="flex gap-2">
                                          {campaignContent.selectedChannels.map((channel, index) => (
                                            <div key={index} className="bg-[#2D1B69] px-2 py-1 rounded text-sm text-purple-200 border border-[#6D28D9]/20">
                                              {channel}
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Headlines */}
                                      <div>
                                        <div className="text-xs text-purple-300/60 mb-1">Headlines</div>
                                        <div className="space-y-1">
                                          {campaignContent.headlines.map((headline, index) => (
                                            <div key={index} className="text-sm text-purple-200">{headline}</div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Captions */}
                                      <div>
                                        <div className="text-xs text-purple-300/60 mb-1">Captions</div>
                                        <div className="space-y-1">
                                          {campaignContent.captions.map((caption, index) => (
                                            <div key={index} className="text-sm text-purple-200">{caption}</div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Descriptions */}
                                      <div>
                                        <div className="text-xs text-purple-300/60 mb-1">Descriptions</div>
                                        <div className="space-y-1">
                                          {campaignContent.descriptions.map((desc, index) => (
                                            <div key={index} className="text-sm text-purple-200">{desc}</div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Schedule */}
                                      <div>
                                        <div className="text-xs text-purple-300/60 mb-1">Schedule</div>
                                        <div className="text-sm text-purple-200">
                                          Start: {new Date(campaignContent.schedule.startDate).toLocaleDateString()}
                                        </div>
                                        <div className="text-sm text-purple-200">
                                          End: {new Date(campaignContent.schedule.endDate).toLocaleDateString()}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Budget Review */}
                                  <div className="bg-[#2D1B69]/30 p-4 rounded-lg border border-[#6D28D9]/20">
                                    <h3 className="text-sm font-medium text-purple-200 mb-3">Budget & Schedule</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <div className="text-xs text-purple-300/60 mb-1">Total Budget</div>
                                        <div className="text-sm text-purple-200">${campaignContent.budget.total}</div>
                                        
                                        <div className="mt-3">
                                          <div className="text-xs text-purple-300/60 mb-2">Daily Budget Distribution</div>
                                          <div className="space-y-2">
                                            {Object.entries(campaignContent.budget.dailyDistribution).map(([platform, amount]) => (
                                              <div key={platform} className="flex justify-between text-sm">
                                                <span className="text-purple-300/70">{platform}</span>
                                                <span className="text-purple-200">${amount}/day</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        <div className="mt-3">
                                          <div className="text-xs text-purple-300/60 mb-2">Platform Split</div>
                                          <div className="space-y-2">
                                            {Object.entries(campaignContent.budget.split).map(([platform, percentage]) => (
                                              <div key={platform} className="flex justify-between text-sm">
                                                <span className="text-purple-300/70">{platform}</span>
                                                <span className="text-purple-200">{percentage}%</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {/* Campaign Edit Modal */}
                              <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                                <DialogContent className="bg-[#1A0B2E] border border-[#6D28D9]/20 text-purple-100 p-6 max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle className="text-xl font-semibold text-purple-100">Campaign Settings</DialogTitle>
                                    <DialogDescription className="text-purple-300/70">
                                      Review and modify your campaign configuration
                                    </DialogDescription>
                                  </DialogHeader>

                                  <div className="space-y-6 mt-4">
                                    {/* Channels */}
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-purple-200">Selected Channels</label>
                                      <div className="flex gap-2">
                                        {campaignContent.selectedChannels.map((channel, index) => (
                                          <div key={index} className="bg-[#2D1B69] px-2 py-1 rounded text-sm text-purple-200 border border-[#6D28D9]/20">
                                            {channel}
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Budget Distribution */}
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-purple-200">Budget Distribution</label>
                                      <div className="grid grid-cols-2 gap-4 bg-[#2D1B69]/30 p-4 rounded-lg">
                                        <div>
                                          <div className="text-xs text-purple-300/60 mb-2">Total Budget</div>
                                          <div className="text-sm text-purple-200">${campaignContent.budget.total}</div>
                                          
                                          <div className="mt-3">
                                            <div className="text-xs text-purple-300/60 mb-2">Daily Budget</div>
                                            {Object.entries(campaignContent.budget.dailyDistribution).map(([platform, amount]) => (
                                              <div key={platform} className="flex justify-between text-sm">
                                                <span className="text-purple-300/70">{platform}</span>
                                                <span className="text-purple-200">${amount}/day</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-xs text-purple-300/60 mb-2">Platform Split</div>
                                          {Object.entries(campaignContent.budget.split).map(([platform, percentage]) => (
                                            <div key={platform} className="flex justify-between text-sm">
                                              <span className="text-purple-300/70">{platform}</span>
                                              <span className="text-purple-200">{percentage}%</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Generated Content */}
                                    <div className="space-y-4">
                                      <label className="text-sm font-medium text-purple-200">Generated Content</label>
                                      
                                      <div className="space-y-4 bg-[#2D1B69]/30 p-4 rounded-lg">
                                        {/* Headlines */}
                                        <div>
                                          <div className="text-xs text-purple-300/60 mb-2">Headlines</div>
                                          <div className="space-y-1">
                                            {campaignContent.headlines.map((headline, index) => (
                                              <div key={index} className="text-sm text-purple-200">{headline}</div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Captions */}
                                        <div>
                                          <div className="text-xs text-purple-300/60 mb-2">Captions</div>
                                          <div className="space-y-1">
                                            {campaignContent.captions.map((caption, index) => (
                                              <div key={index} className="text-sm text-purple-200">{caption}</div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Descriptions */}
                                        <div>
                                          <div className="text-xs text-purple-300/60 mb-2">Descriptions</div>
                                          <div className="space-y-1">
                                            {campaignContent.descriptions.map((desc, index) => (
                                              <div key={index} className="text-sm text-purple-200">{desc}</div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Schedule */}
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-purple-200">Schedule</label>
                                      <div className="grid grid-cols-2 gap-4 bg-[#2D1B69]/30 p-4 rounded-lg">
                                        <div>
                                          <div className="text-xs text-purple-300/60 mb-1">Start Date</div>
                                          <div className="text-sm text-purple-200">
                                            {new Date(campaignContent.schedule.startDate).toLocaleDateString()}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-xs text-purple-300/60 mb-1">End Date</div>
                                          <div className="text-sm text-purple-200">
                                            {new Date(campaignContent.schedule.endDate).toLocaleDateString()}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <DialogFooter className="mt-6">
                                    <Button
                                      className="bg-[#2D1B69] hover:bg-[#1A0B2E] border border-[#6D28D9]/40 transition-colors"
                                      onClick={() => setShowEditModal(false)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      className="bg-[#6D28D9] hover:bg-[#5B21B6] transition-colors ml-2"
                                      onClick={() => {
                                        setShowEditModal(false);
                                        handleInputSubmit(log.id, { approved: true });
                                      }}
                                    >
                                      Save & Launch
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}

                          {/* Show loading animation for running steps */}
                          {log.status === 'running' && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-purple-300/60">
                              <div className="animate-spin">
                                <Loader2 className="w-4 h-4" />
                              </div>
                              Processing...
                            </div>
                          )}

                          {/* Expandable Output Section */}
                          {selectedOutput === log.id && log.status === 'completed' && (
                            <div className="mt-4 p-4 bg-[#2D1B69]/30 rounded-lg border border-[#6D28D9]/20">
                              {log.message === 'Brand Details' && (
                                <div className="grid grid-cols-2 gap-4">
                                  {log.details?.slice(1).map((detail, index) => (
                                    <div key={index} className="bg-[#2D1B69]/20 p-3 rounded-lg">
                                      <div className="text-xs text-purple-300/70">
                                        {detail.split(': ')[0].replace('- ', '')}
                                      </div>
                                      <div className="text-sm text-purple-200 font-medium mt-1">
                                        {detail.split(': ')[1]}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {log.message === 'Campaign Planning' && (
                                <div className="space-y-4">
                                  {/* Strategy Card */}
                                  <div className="bg-[#2D1B69]/20 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                      <Target className="w-4 h-4 text-purple-400" />
                                      <h4 className="text-sm font-medium text-purple-200">Campaign Strategy</h4>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-purple-300/70">Campaign Name</span>
                                        <span className="text-purple-200 font-medium">Q1 Product Demo Drive</span>
                                      </div>
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-purple-300/70">Campaign Goal</span>
                                        <span className="text-purple-200 font-medium">Increase Website Traffic</span>
                                      </div>
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-purple-300/70">Target Audience</span>
                                        <span className="text-purple-200 font-medium">IT Decision Makers, CTOs</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Budget Card */}
                                  <div className="bg-[#2D1B69]/20 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                      <DollarSign className="w-4 h-4 text-purple-400" />
                                      <h4 className="text-sm font-medium text-purple-200">Budget Allocation</h4>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-purple-300/70">Total Daily</span>
                                        <span className="text-lg font-semibold text-purple-200">$500</span>
                                      </div>
                                      <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                          <span className="text-purple-300/70">LinkedIn Ads</span>
                                          <span className="text-purple-200">$250/day</span>
                                        </div>
                                        <div className="w-full bg-[#6D28D9]/20 rounded-full h-1.5">
                                          <div className="bg-[#6D28D9] h-1.5 rounded-full" style={{ width: '50%' }}></div>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                          <span className="text-purple-300/70">Google Search</span>
                                          <span className="text-purple-200">$150/day</span>
                                        </div>
                                        <div className="w-full bg-[#6D28D9]/20 rounded-full h-1.5">
                                          <div className="bg-[#6D28D9] h-1.5 rounded-full" style={{ width: '30%' }}></div>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                          <span className="text-purple-300/70">Meta Business</span>
                                          <span className="text-purple-200">$100/day</span>
                                        </div>
                                        <div className="w-full bg-[#6D28D9]/20 rounded-full h-1.5">
                                          <div className="bg-[#6D28D9] h-1.5 rounded-full" style={{ width: '20%' }}></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Schedule Card */}
                                  <div className="bg-[#2D1B69]/20 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                      <Calendar className="w-4 h-4 text-purple-400" />
                                      <h4 className="text-sm font-medium text-purple-200">Campaign Schedule</h4>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-purple-300/70">Duration</span>
                                        <span className="text-purple-200">Feb 1 - Mar 31, 2024</span>
                                      </div>
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-purple-300/70">Active Hours</span>
                                        <span className="text-purple-200">9 AM - 6 PM</span>
                                      </div>
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-purple-300/70">Test Period</span>
                                        <span className="text-purple-200">7 days</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {log.message === 'Content Generation' && (
                                <div className="space-y-2">
                                  {log.details?.map((detail, index) => (
                                    <div key={index} className="text-sm text-purple-300/70">{detail}</div>
                                  ))}
                                </div>
                              )}

                              {log.message === 'Campaign Review' && (
                                <div className="space-y-4">
                                  {/* Campaign Content Review */}
                                  <div className="bg-[#2D1B69]/30 p-4 rounded-lg border border-[#6D28D9]/20">
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-3">
                                        <Wand2 className="w-5 h-5 text-purple-400" />
                                        <h3 className="text-sm font-medium text-purple-200">Campaign Content</h3>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-purple-300/60 hover:text-purple-300"
                                        onClick={() => setActiveTab('content')}
                                      >
                                        <Pencil className="w-4 h-4 mr-1" />
                                        Edit
                                      </Button>
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <div className="text-xs text-purple-300/60 mb-2">Headlines</div>
                                        <div className="space-y-2">
                                          {campaignContent.headlines.map((headline, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-[#1A0B2E] p-2 rounded-md">
                                              <div className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-400/80 text-xs flex items-center justify-center">
                                                {index + 1}
                                              </div>
                                              <span className="text-sm text-purple-200">{headline}</span>
                                              <span className="ml-auto text-xs text-purple-300/40">{headline.length}/30</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-xs text-purple-300/60 mb-2">Descriptions</div>
                                        <div className="space-y-2">
                                          {campaignContent.descriptions.map((desc, index) => (
                                            <div key={index} className="bg-[#1A0B2E] p-2 rounded-md">
                                              <div className="flex items-center gap-2 mb-1">
                                                <div className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-400/80 text-xs flex items-center justify-center">
                                                  {index + 1}
                                                </div>
                                                <span className="text-xs text-purple-300/40">{desc.length}/90</span>
                                              </div>
                                              <p className="text-sm text-purple-200 pl-7">{desc}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Campaign Settings Review */}
                                  <div className="bg-[#2D1B69]/30 p-4 rounded-lg border border-[#6D28D9]/20">
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-3">
                                        <Settings className="w-5 h-5 text-purple-400" />
                                        <h3 className="text-sm font-medium text-purple-200">Campaign Settings</h3>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-purple-300/60 hover:text-purple-300"
                                        onClick={() => setActiveTab('settings')}
                                      >
                                        <Pencil className="w-4 h-4 mr-1" />
                                        Edit
                                      </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                      <div>
                                        <div className="text-xs text-purple-300/60 mb-2">Budget & Schedule</div>
                                        <div className="space-y-2">
                                          <div className="flex justify-between text-sm">
                                            <span className="text-purple-300/70">Total Budget</span>
                                            <span className="text-purple-200">${campaignContent.budget.total}</span>
                                          </div>
                                          <div className="flex justify-between text-sm">
                                            <span className="text-purple-300/70">Duration</span>
                                            <span className="text-purple-200">90 Days</span>
                                          </div>
                                          <div className="flex justify-between text-sm">
                                            <span className="text-purple-300/70">Start Date</span>
                                            <span className="text-purple-200">{new Date(campaignContent.schedule.startDate).toLocaleDateString()}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-xs text-purple-300/60 mb-2">Targeting</div>
                                        <div className="space-y-2">
                                          <div className="flex justify-between text-sm">
                                            <span className="text-purple-300/70">Age Range</span>
                                            <span className="text-purple-200">{campaignContent.targeting.ageRange.min}-{campaignContent.targeting.ageRange.max}</span>
                                          </div>
                                          <div className="flex justify-between text-sm">
                                            <span className="text-purple-300/70">Gender</span>
                                            <span className="text-purple-200">{campaignContent.targeting.gender}</span>
                                          </div>
                                          <div className="flex justify-between text-sm">
                                            <span className="text-purple-300/70">Locations</span>
                                            <span className="text-purple-200">{campaignContent.targeting.locations.join(', ')}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Creative Assets Review */}
                                  <div className="bg-[#2D1B69]/30 p-4 rounded-lg border border-[#6D28D9]/20">
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-3">
                                        <ImageIcon className="w-5 h-5 text-purple-400" />
                                        <h3 className="text-sm font-medium text-purple-200">Creative Assets</h3>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-purple-300/60 hover:text-purple-300"
                                        onClick={() => setActiveTab('creatives')}
                                      >
                                        <Pencil className="w-4 h-4 mr-1" />
                                        Edit
                                      </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      {campaignContent.creatives?.map((creative, index) => (
                                        <div key={index} className="bg-[#1A0B2E] p-3 rounded-lg">
                                          <div className="aspect-video bg-[#2D1B69]/30 rounded-md flex items-center justify-center mb-2">
                                            <ImageIcon className="w-8 h-8 text-purple-400/40" />
                                          </div>
                                          <div className="flex justify-between items-center">
                                            <div>
                                              <div className="text-sm text-purple-200">{creative.type}</div>
                                              <div className="text-xs text-purple-300/60">{creative.size}</div>
                                            </div>
                                            <CheckCircle2 className="w-5 h-5 text-purple-400" />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Targeting Review */}
                                  <div className="bg-[#2D1B69]/30 p-4 rounded-lg border border-[#6D28D9]/20">
                                    <h3 className="text-sm font-medium text-purple-200 mb-3">Targeting</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <div className="text-xs text-purple-300/60 mb-1">Demographics</div>
                                        <div className="text-sm text-purple-200">Age: {campaignContent.targeting.ageRange.min} - {campaignContent.targeting.ageRange.max}</div>
                                        <div className="text-sm text-purple-200">Gender: {campaignContent.targeting.gender}</div>
                                      </div>
                                      <div>
                                        <div className="text-xs text-purple-300/60 mb-1">Location</div>
                                        {campaignContent.targeting.locations.map((location, index) => (
                                          <div key={index} className="text-sm text-purple-200">{location}</div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex gap-3">
                                    <Button 
                                      className="flex-1 bg-[#6D28D9] hover:bg-[#5B21B6] transition-colors"
                                      onClick={() => handleInputSubmit(log.id, { approved: true })}
                                    >
                                      <Rocket className="w-4 h-4 mr-2" />
                                      Launch Campaign
                                    </Button>
                                    <Button 
                                      className="flex-1 bg-[#2D1B69] hover:bg-[#1A0B2E] border border-[#6D28D9]/40 transition-colors"
                                      onClick={() => setShowEditModal(true)}
                                    >
                                      <Settings className="w-4 h-4 mr-2" />
                                      Modify Settings
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
