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
    const pos = dagreGraph.node(node.id);
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
    data: { text: 'Root', bold: false, italic: false, glow: false },
    position: { x: 0, y: 0 },
    type: 'styled',
    draggable: false,
  },
];
const initialEdges: Edge[] = [];


const emojis = [
  { name: 'smile', path: '/src/assets/emoji/smile.svg' },
  { name: 'rocket', path: '/src/assets/emoji/rocket.svg' },
  { name: 'idea', path: '/src/assets/emoji/idea.svg' },
  { name: 'cool', path: '/src/assets/emoji/cool.svg' },
  { name: 'fire', path: '/src/assets/emoji/fire.svg' },
];


function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<StyledData> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setNodes((nds) => getLayoutedElements(nds, edges));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edges.length, nodes.length]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<StyledData>) => {
    setSelectedNode(node);
  }, []);

  const handleAddClick = () => {
    if (selectedNode) setModalOpen(true);
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
    setEdges((eds) => [...eds, { id: `${selectedNode.id}-${newId}`, source: selectedNode.id, target: newId }]);
    setSelectedNode(null);
    setModalOpen(false);
  };

  const nodeTypes = { styled: StyledNode };

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
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        <Background gap={16} />
      </ReactFlow>
      <AddNodeButton onClick={handleAddClick} disabled={!selectedNode} />
      <AddNodeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateNode}
        emojis={emojis}

      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-400 text-xs opacity-80 select-none">Select a node to add a child</div>
    </div>
  );
}

export default App;
