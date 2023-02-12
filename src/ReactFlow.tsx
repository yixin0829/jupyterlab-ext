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
  Position
} from "reactflow";


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

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Node 1" },
    position: { x: 250, y: 50 }
  },
  { id: "2", data: { label: "Node 2" }, position: { x: 100, y: 150 } },
  { id: "3", data: { label: "Node 3" }, position: { x: 400, y: 150 } },
  // {
  //   id: "4",
  //   type: "custom",
  //   data: { label: "Node 4" },
  //   position: { x: 400, y: 200 }
  // }
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" }
];

const nodeTypes = {
  custom: CustomNode
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