import React, { useCallback } from "react";
// for converting a react component to a react widget in JL
import { ReactWidget } from '@jupyterlab/apputils';

import "reactflow/dist/style.css";

import ReactFlow, {
  Node,
  addEdge,
  Background,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  Handle,
  NodeProps,
  Position,
  MiniMap,
  Controls,
} from "reactflow";
import initialNodes from './Nodes'
import initialEdges from './Edges'


const CustomNode = ({
  data,
  isConnectable,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom
}: NodeProps) => {
  return (
    <>
      <Handle
        type="target"
        position={targetPosition}
        isConnectable={isConnectable}
      />
      {data?.label}
      <Handle
        type="source"
        position={sourcePosition}
        isConnectable={isConnectable}
      />
    </>
  );
};

CustomNode.displayName = "CustomNode";

const nodeTypes = {
  custom: CustomNode
};

// for node colouring
const nodeColor = (node: Node) => {
  switch (node.type) {
    case 'dataframe':
      return '#6ede87';
    case 'variable':
      return '#6865A5';
    case 'plot':
      return '#ff0072';
    case 'insight':
      return '#3e4959'
    default:
      return '#000000';
  }
};

const FlowComponent = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
    >
      <Background />
      <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
      <Controls/>
    </ReactFlow>
  );
};

/**
 * A Lumino Widget that wraps a FlowComponent.
 */
export class FlowWidget extends ReactWidget {
  /**
   * Constructs a new FlowWidget.
   */
  constructor() {
    super();
  }

  render(): JSX.Element {
    return <FlowComponent />;
  }
}