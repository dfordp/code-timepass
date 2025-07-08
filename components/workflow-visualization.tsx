import { useCallback, useEffect, useState } from 'react';
import type { Edge, Node } from '@xyflow/react';
import {
  Background,
  BackgroundVariant,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import ELK from 'elkjs/lib/elk.bundled.js';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';


import '@xyflow/react/dist/style.css';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Workflow } from '@/types';

type ButterflowWorkflowContent = Workflow;

type ProjectStatus =
  | 'todo'
  | 'in_progress'
  | 'done'
  | 'closed'
  | 'awaiting_trigger'
  | 'is_bot_processing';

type ButterflowTask = {
  id: string;
  name: string;
  status: ProjectStatus;
  workflowStepId: string;
};

const proOptions = { hideAttribution: true };

interface ButterflowNodeData {
  name: string;
  nodeStatus: ProjectStatus;
  nodeTasks: ButterflowTask[];
  hoveredNodeId?: string;
  setHoveredNodeId?: (id: string | undefined) => void;
  selectedNodeId?: string | null;
}

// Custom Node Component
function ButterflowNode({
  data,
  id,
}: {
  data: ButterflowNodeData;
  id: string;
}) {

  const {
    name,
    nodeStatus,
    nodeTasks,
    hoveredNodeId,
    setHoveredNodeId,
    selectedNodeId,
  } = data;

  // Map status to color
  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'done':
        return 'bg-green-500';
      case 'in_progress':
      case 'is_bot_processing':
        return 'bg-blue-500';
      case 'awaiting_trigger':
        return 'bg-yellow-500';
      case 'closed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-theme-accent-1" />
      <div
        className={cn(
          'rounded-lg border border-theme-accent-1/30 bg-white p-0 shadow-md transition-all',
          'hover:border-theme-accent-1 hover:shadow-lg',
          hoveredNodeId === id && 'border-theme-accent-2 shadow-lg',
          selectedNodeId === id && 'border-theme-accent-3 shadow-lg'
        )}
      >
        <div
          className="flex items-center justify-between gap-2 px-4 py-3 text-left"
          onMouseEnter={() => setHoveredNodeId?.(id)}
          onMouseLeave={() => setHoveredNodeId?.(undefined)}
        >
          <div className="flex items-center gap-3">
            <div className={cn('h-3 w-3 rounded-full', getStatusColor(nodeStatus))} />
            <div className="flex flex-col gap-1">
              <strong className="max-w-[200px] truncate text-sm font-medium text-theme-dark">
                {name}
              </strong>
              {nodeTasks.length > 0 && (
                <Badge variant="secondary" className="mt-1 w-fit bg-theme-accent-1/20 text-xs text-theme-dark">
                  {nodeTasks.length} {nodeTasks.length === 1 ? 'task' : 'tasks'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-theme-accent-1" />
    </>
  );
}


function NodeDetailsPanel({ 
  selectedNode, 
  onClose 
}: { 
  selectedNode: any | null,
  onClose: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'code'>('overview');
  const [copied, setCopied] = useState(false);

  if (!selectedNode) return null;

  const handleCopyCode = () => {
    if (selectedNode.code_snippet) {
      navigator.clipboard.writeText(selectedNode.code_snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="absolute bottom-0 right-0 z-30 w-full max-w-md rounded-tl-lg border border-theme-accent-1/30 bg-white shadow-lg md:bottom-4 md:right-4 md:max-h-[500px] md:rounded-lg">
      <div className="flex items-center justify-between border-b border-theme-accent-1/10 bg-theme-light p-3">
        <h3 className="font-medium text-theme-dark">{selectedNode.name}</h3>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 w-7 rounded-full text-theme-dark/70 hover:bg-theme-accent-1/10"
          >
            {isExpanded ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronUp className="h-4 w-4" />
            }
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-7 w-7 rounded-full text-theme-dark/70 hover:bg-theme-accent-1/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <>
          <div className="border-b border-theme-accent-1/10 bg-white p-3">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as 'overview' | 'code')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-theme-accent-1/10">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="max-h-[350px] overflow-auto p-4">
            {activeTab === 'overview' ? (
              <div className="space-y-4">
                <div>
                  <h4 className="mb-1 text-sm font-medium text-theme-dark/70">Description</h4>
                  <p className="text-sm text-theme-dark">{selectedNode.description}</p>
                </div>
                
                {selectedNode.depends_on && selectedNode.depends_on.length > 0 && (
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-theme-dark/70">Dependencies</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedNode.depends_on.map((dep: string) => (
                        <Badge key={dep} variant="default" className="bg-theme-accent-2/70">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="mb-1 text-sm font-medium text-theme-dark/70">Type</h4>
                  <Badge 
                    variant={selectedNode.type === 'automatic' ? 'default' : 'secondary'}
                    className={selectedNode.type === 'automatic' 
                      ? 'bg-theme-accent-1' 
                      : 'bg-theme-accent-2/70'
                    }
                  >
                    {selectedNode.type}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="relative">
                <pre className="overflow-x-auto rounded-md bg-theme-dark/5 p-3 text-sm">
                  <code className="text-xs">{selectedNode.code_snippet || 'No code available'}</code>
                </pre>
                
                {selectedNode.code_snippet && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-2 bg-white/90 text-xs shadow-sm hover:bg-white"
                    onClick={handleCopyCode}
                  >
                    {copied ? (
                      <>
                        <Check className="mr-1 h-3 w-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-3 w-3" />
                        Copy
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-end border-t border-theme-accent-1/10 bg-theme-light p-3">
            <Button 
              variant="outline" 
              size="sm"
              className="mr-2 text-xs"
              onClick={() => {
                // Trigger download of code as file
                const element = document.createElement("a");
                const file = new Blob([selectedNode.code_snippet || ''], {type: 'text/plain'});
                element.href = URL.createObjectURL(file);
                element.download = `${selectedNode.id}.js`;
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
            >
              <Download className="mr-1 h-3 w-3" />
              Download
            </Button>
            <Button 
              size="sm"
              className="bg-theme-accent-1 text-xs hover:bg-theme-accent-2"
            >
              <Eye className="mr-1 h-3 w-3" />
              Preview
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// Add these imports at the top of the file:
import { 
  ChevronDown, ChevronUp, Download, X, Copy, Check, Eye 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Node types definition for ReactFlow
const nodeTypes = {
  butterflowNode: ButterflowNode,
};

const transformButterflowToElements = (
  workflow: { workflow: ButterflowWorkflowContent },
  tasks: ButterflowTask[],
  {
    hoveredNodeId,
    setHoveredNodeId,
    selectedNodeId,
  }: {
    hoveredNodeId?: string;
    setHoveredNodeId?: (id: string | undefined) => void;
    selectedNodeId?: string | null;
  }
) => {
  if (!workflow?.workflow?.nodes?.length) {
    console.error('Invalid workflow structure:', workflow);
    return { nodes: [], edges: [] };
  }

  const nodes = workflow.workflow.nodes.map<Node>((node) => {
    // For butterflow workflows, the tasks are linked to nodes instead of steps
    const nodeTasks = tasks.filter((task) => task.workflowStepId === node.id);

    // Get consolidated status for the node based on its tasks
    let nodeStatus: ProjectStatus = 'todo';
    if (nodeTasks.length > 0) {
      if (
        nodeTasks.some(
          (t) => t.status === 'in_progress' || t.status === 'is_bot_processing'
        )
      ) {
        nodeStatus = 'in_progress';
      } else if (nodeTasks.every((t) => t.status === 'done')) {
        nodeStatus = 'done';
      } else if (nodeTasks.some((t) => t.status === 'closed')) {
        nodeStatus = 'closed';
      } else if (nodeTasks.some((t) => t.status === 'awaiting_trigger')) {
        nodeStatus = 'awaiting_trigger';
      }
    }

    return {
      id: node.id,
      type: 'butterflowNode',
      data: {
        name: node.name,
        nodeStatus,
        nodeTasks,
        hoveredNodeId,
        setHoveredNodeId,
        selectedNodeId,
      },
      draggable: false,
      connectable: false,
      position: { x: 0, y: 0 }, // This will be calculated by ELK
    };
  });

  const edges = workflow.workflow.nodes
    .filter((node) => node.depends_on && node.depends_on.length > 0)
    .flatMap(
      (node) =>
        node.depends_on?.map<Edge>((dep) => ({
          id: `e${dep}-${node.id}`,
          type: 'smoothstep',
          source: dep,
          target: node.id,
          markerEnd: {
            type: MarkerType.Arrow,
            strokeWidth: 2,
            color: '#1C2326',
          },
          style: { stroke: '#1C2326', strokeWidth: 2 },
          className: 'react-flow__edge-path',
        })) ?? []
    );

  return { nodes, edges };
};

export function ButterflowWorkflowVisualization({
  workflow,
  tasks = [],
  hoveredNodeId,
  setHoveredNodeId,
  selectedNodeId,
  onNodeSelect,
}: {
  workflow: { workflow: ButterflowWorkflowContent };
  tasks: ButterflowTask[];
  hoveredNodeId?: string;
  setHoveredNodeId?: (id: string | undefined) => void;
  selectedNodeId?: string | null;
  onNodeSelect?: (id: string) => void;
}) {
  const [nodes, setNodes] = useNodesState<Node>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);
  const [isLayouting, setIsLayouting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null);


  // Add debugging
  console.log("Workflow data:", workflow);
  
  const onNodeClick = useCallback(
  (_event: React.MouseEvent, node: Node) => {
    onNodeSelect?.(node.id);
    // Find the full node data to display details
    const fullNodeData = workflow.workflow.nodes.find(n => n.id === node.id);
    setSelectedNodeData(fullNodeData || null);
  },
  [onNodeSelect, workflow]
);


  useEffect(() => {
    try {
      console.log("Running layout effect with workflow:", workflow);
      
      // Safety check for workflow structure
      if (!workflow?.workflow?.nodes) {
        setError('Invalid workflow structure');
        setIsLayouting(false);
        return;
      }
      
      const { nodes: initialNodes, edges: initialEdges } = transformButterflowToElements(workflow, tasks, {
        hoveredNodeId,
        setHoveredNodeId,
        selectedNodeId,
      });
      
      console.log("Initial nodes created:", initialNodes);
      console.log("Initial edges created:", initialEdges);
      
      if (initialNodes.length === 0) {
        setError('No nodes found in workflow');
        setIsLayouting(false);
        return;
      }

      // Set nodes immediately with default positions for quicker rendering
      const tempNodes = initialNodes.map((node, index) => ({
        ...node,
        position: { 
          x: 100 + (index % 3) * 300, 
          y: 100 + Math.floor(index / 3) * 150 
        },
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
      }));
      
      setNodes(tempNodes);
      setEdges(initialEdges);
      
      const elk = new ELK();
      setIsLayouting(true);

      // Create the ELK layout calculation
      elk.layout({
        id: 'root',
        layoutOptions: {
          'elk.algorithm': 'layered',
          'elk.direction': 'DOWN',
          'elk.spacing.nodeNode': '50',
          'elk.layered.spacing.nodeNodeBetweenLayers': '80',
        },
        children: initialNodes.map((node) => ({
          id: node.id,
          width: 250,  // Set fixed width for consistent layout
          height: 70,  // Set fixed height for consistent layout
        })),
        edges: initialEdges.map((edge) => ({
          id: edge.id,
          sources: [edge.source],
          targets: [edge.target],
        })),
      })
      .then((layout) => {
        if (!layout.children) {
          throw new Error('ELK layout calculation returned no children');
        }
        
        console.log("ELK layout calculated:", layout);

        // Map the layout positions back to the nodes
        const layoutedNodes = initialNodes.map((node) => {
          const layoutNode = layout.children?.find((n) => n.id === node.id);
          return {
            ...node,
            position: { 
              x: (layoutNode?.x ?? 0) + Math.random() * 0.0001, // Add tiny random offset to force re-render
              y: (layoutNode?.y ?? 0) + Math.random() * 0.0001
            },
            targetPosition: Position.Top,
            sourcePosition: Position.Bottom,
          };
        });
        
        console.log("Setting layouted nodes:", layoutedNodes);
        
        setNodes(layoutedNodes);
        setEdges(initialEdges);
        setError(null);
      })
      .catch((error) => {
        console.error('ELK layout error:', error);
        setError('Error calculating layout');
      })
      .finally(() => {
        setIsLayouting(false);
      });
    } catch (error) {
      console.error('Workflow visualization error:', error);
      setError('Failed to visualize workflow');
      setIsLayouting(false);
    }
  }, [
    workflow,
    tasks,
    hoveredNodeId,
    setHoveredNodeId,
    selectedNodeId,
    setNodes,
    setEdges
  ]);

  const theme = useTheme();

  const handleCloseDetails = () => {
  setSelectedNodeData(null);
};

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="rounded-md bg-red-50 p-4 text-red-600">
          <p className="font-medium">Error: {error}</p>
          <p className="mt-2 text-sm">Please check the workflow structure and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full" style={{ minHeight: "400px", position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}>
      {isLayouting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-theme-accent-1/20 border-t-theme-accent-1"></div>
            <p className="text-sm text-theme-dark/70">Visualizing workflow...</p>
          </div>
        </div>
      )}
      
      <ReactFlowProvider>
        <div style={{ width: '100%', height: '100%' }}>
          <NodeDetailsPanel 
            selectedNode={selectedNodeData} 
            onClose={handleCloseDetails} 
          />
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{
              padding: 0.2,
              includeHiddenNodes: false,
            }}
            minZoom={0.5}
            maxZoom={1.5}
            onNodeClick={onNodeClick}
            proOptions={proOptions}
            style={{ background: "#f8f9fa" }}
          >
            <Background
              color="#1C2326"
              variant={BackgroundVariant.Dots}
              gap={16}
              size={1}
              style={{ opacity: 0.05 }}
            />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
}