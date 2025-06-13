import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './index.css';

import dagre from 'dagre';

import AddNodeButton from './components/AddNodeButton';
import AddNodeModal, { type NodeStyle } from './components/AddNodeModal';
import StyledNode from './components/StyledNode';

const nodeWidth = 180;
const nodeHeight = 80;

type StyledData = NodeStyle;

function getLayoutedElements(nodes: Node<StyledData>[], edges: Edge[]) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 40, ranksep: 100 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const pos = dagreGraph.node(node.id)!;
    return {
      ...node,
      position: { x: pos.x - nodeWidth / 2, y: pos.y - nodeHeight / 2 },
      draggable: false,
    };
  });
}

const initialNodes: Node<StyledData>[] = [
  {
    id: '1',
    data: { text: 'Root Node', bold: true, italic: false, glow: false },
    position: { x: 0, y: 0 },
    type: 'styled',
    draggable: false,
  },
];
const initialEdges: Edge[] = [];

// Define nodeTypes outside the component
const nodeTypes = { styled: StyledNode };

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<StyledData> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Re-layout on structure changes
  useEffect(() => {
    setNodes((nds) => getLayoutedElements(nds, edges));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edges.length, nodes.length]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Track clicks on nodes
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<StyledData>) => {
    console.log('Node clicked:', node);
    setSelectedNode(node);
  }, []);

  // Update selection when React Flow selection changes
  const onSelectionChange = useCallback(
    ({ nodes: selNodes }: { nodes: Node<StyledData>[]; edges: Edge[] }) => {
      console.log('Selection changed:', selNodes);
      if (selNodes.length > 0) {
        setSelectedNode(selNodes[0]);
      } else {
        setSelectedNode(null);
      }
    },
    []
  );

  // Clear selection when clicking on canvas
  const onPaneClick = useCallback(() => {
    console.log('Canvas clicked, clearing selection');
    setSelectedNode(null);
  }, []);

  const handleAddClick = () => {
    console.log('Add button clicked, selectedNode:', selectedNode);
    if (selectedNode) {
      console.log('Opening modal');
      setModalOpen(true);
    }
  };

  const handleCreateNode = (style: NodeStyle) => {
    if (!selectedNode) return;
    const newId = (nodes.length + 1).toString();
    const newNode: Node<StyledData> = {
      id: newId,
      data: style,
      position: { x: 0, y: 0 },
      type: 'styled',
      draggable: false,
    };
    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [
      ...eds,
      {
        id: `${selectedNode.id}-${newId}`,
        source: selectedNode.id,
        target: newId,
        animated: false,
        style: { stroke: '#8b5cf6', strokeWidth: 2 },
      },
    ]);
    setSelectedNode(null);
    setModalOpen(false);
  };

  const onNodeMouseEnter = useCallback(
    (_: unknown, node: Node) => {
      setEdges((eds) =>
        eds.map((e) =>
          e.source === node.id || e.target === node.id
            ? { ...e, animated: true, className: 'edge-animated' }
            : e
        )
      );
    },
    []
  );

  const onNodeMouseLeave = useCallback(
    (_: unknown, node: Node) => {
      setEdges((eds) =>
        eds.map((e) =>
          e.source === node.id || e.target === node.id
            ? { ...e, animated: false, className: '' }
            : e
        )
      );
    },
    []
  );

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 relative overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-40 flex items-center justify-between px-10 py-6 bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">W</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Word Tree
          </h1>
        </div>
        <div className="text-sm text-gray-500 font-medium">
          Visual Mind Mapping
        </div>
      </header>

      {/* React Flow */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onSelectionChange={onSelectionChange}
        onPaneClick={onPaneClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        fitView
        className="w-full h-full pt-20"
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        zoomOnDoubleClick
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          style: { stroke: '#8b5cf6', strokeWidth: 2 },
          type: 'smoothstep',
        }}
      >
        <MiniMap
          nodeColor={(n) => (n.selected ? '#8b5cf6' : '#e5e7eb')}
          maskColor="rgba(255, 255, 255, 0.8)"
          className="border border-gray-200 rounded-lg"
        />
        <Controls
          className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-lg shadow-lg"
        />
        <Background gap={20} size={1} color="#e5e7eb" />
      </ReactFlow>

      {/* Add Node Button */}
      <AddNodeButton onClick={handleAddClick} disabled={!selectedNode} />

      {/* Add Node Modal */}
      <AddNodeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateNode}
      />

      {/* Instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/20">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
          <span>
            {selectedNode
              ? `Selected: "${selectedNode.data.text}" - Click the + button to add a child node`
              : 'Click on a node to select it, then add child nodes'
            }
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
