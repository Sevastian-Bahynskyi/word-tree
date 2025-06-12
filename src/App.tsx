import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { FaPlus } from 'react-icons/fa';

const nodeWidth = 180;
const nodeHeight = 80;

const ACCENT = 'from-purple-500 via-blue-500 to-cyan-400';

function getLayoutedElements(nodes: Node[], edges: Edge[]) {
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
    const pos = dagreGraph.node(node.id);
    return {
      ...node,
      position: { x: pos.x - nodeWidth / 2, y: pos.y - nodeHeight / 2 },
      draggable: false,
    };
  });
}

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Root' },
    position: { x: 0, y: 0 },
    type: 'default',
    draggable: false,
  },
];
const initialEdges: Edge[] = [];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Layout nodes on mount and whenever nodes/edges change
  useEffect(() => {
    setNodes((nds) => getLayoutedElements(nds, edges));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edges.length, nodes.length]);

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const handleAddNode = () => {
    if (!selectedNode) return;
    const newId = (nodes.length + 1).toString();
    const newNode: Node = {
      id: newId,
      data: { label: `Node ${newId}` },
      position: { x: 0, y: 0 },
      type: 'default',
      draggable: false,
    };
    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, { id: `${selectedNode.id}-${newId}`, source: selectedNode.id, target: newId }]);
    setSelectedNode(null);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100 relative overflow-hidden">
      <header className="absolute top-0 left-0 w-full z-40 flex items-center justify-between px-10 py-6 bg-white/70 backdrop-blur-md shadow-md">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 drop-shadow-lg tracking-tight">Word Tree</h1>
        <span className="text-base text-gray-500 font-medium">by YourName</span>
      </header>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        className="w-full h-full pt-24"
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={true}
      >
        <MiniMap />
        <Controls />
        <Background gap={16} />
      </ReactFlow>
      <button
        className={`fixed right-20 top-1/2 transform -translate-y-1/2 bg-gradient-to-br ${ACCENT} text-white rounded-full w-36 h-36 flex items-center justify-center text-7xl border-4 border-white/60 transition-all duration-300 z-50 backdrop-blur-md bg-opacity-80 animate-neon
          hover:-rotate-6 hover:scale-110 active:scale-90 focus:outline-none focus:ring-8 focus:ring-purple-300/40 disabled:bg-gray-400`}
        style={{ boxShadow: '0 0 30px rgba(139,92,246,0.6), 0 0 60px rgba(139,92,246,0.4)' }}
        onClick={handleAddNode}
        disabled={!selectedNode}
        title={selectedNode ? 'Add node' : 'Select a node to add'}
      >
        <FaPlus className="drop-shadow-lg" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-400 text-xs opacity-80 select-none">Select a node to add a child</div>
    </div>
  );
}

export default App;