import React, { useCallback, useMemo, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  Position,
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";
import { type BuildingDef } from "./data";
import { Sidebar } from "./Sidebar";


// --- Custom Node ---

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function BuildingNode({ id, data }: { id: string; data: any }) {
  const def: BuildingDef = data.def;
  const label: string = data.label;
  const onChangeLabel: (id: string, v: string) => void = data.onChangeLabel;

  const inHandles = useMemo(() => {
    const count = def.inPorts;
    return Array.from({ length: count }, (_, i) => {
      const topPct = (i + 1) / (count + 1);
      return (
        <div
          key={`in-${i}`}
          style={{
            position: "absolute",
            left: -6,
            top: `${topPct * 100}%`,
            transform: "translateY(-50%)",
          }}
        >
          {/* React Flow Handle via CSS-only div works, but proper Handle gives better UX */}
        </div>
      );
    });
  }, [def.inPorts]);

  const outHandles = useMemo(() => {
    const count = def.outPorts;
    return Array.from({ length: count }, (_, i) => {
      const topPct = (i + 1) / (count + 1);
      return (
        <div
          key={`out-${i}`}
          style={{
            position: "absolute",
            right: -6,
            top: `${topPct * 100}%`,
            transform: "translateY(-50%)",
          }}
        />
      );
    });
  }, [def.outPorts]);

  return (
    <div
      style={{
        width: 190,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(17,24,39,0.9)",
        color: "white",
        boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
        padding: 12,
        position: "relative",
      }}
    >
      {/* IN handles */}
      {Array.from({ length: def.inPorts }, (_, i) => {
        const topPct = (i + 1) / (def.inPorts + 1);
        return (
          <Handle
            key={`in-${i}`}
            type="target"
            position={Position.Left}
            id={`in-${i}`}
            style={{
              top: `${topPct * 100}%`,
              background: "#93c5fd",
              width: 10,
              height: 10,
              border: "1px solid rgba(0,0,0,0.35)",
            }}
          />
        );
      })}

      {/* OUT handles */}
      {Array.from({ length: def.outPorts }, (_, i) => {
        const topPct = (i + 1) / (def.outPorts + 1);
        return (
          <Handle
            key={`out-${i}`}
            type="source"
            position={Position.Right}
            id={`out-${i}`}
            style={{
              top: `${topPct * 100}%`,
              background: "#86efac",
              width: 10,
              height: 10,
              border: "1px solid rgba(0,0,0,0.35)",
            }}
          />
        );
      })}

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "rgba(255,255,255,0.08)",
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
          }}
          title={def.type}
        >
          {def.type.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, opacity: 0.75 }}>{def.label}</div>
          <input
            value={label}
            onChange={(e) => onChangeLabel(id, e.target.value)}
            style={{
              width: "100%",
              marginTop: 6,
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(0,0,0,0.25)",
              color: "white",
              outline: "none",
              fontSize: 14,
            }}
            placeholder="Nom du bloc"
          />
        </div>
      </div>

      <div style={{ marginTop: 10, display: "flex", gap: 8, opacity: 0.8 }}>
        <span style={pillStyle}>In: {def.inPorts}</span>
        <span style={pillStyle}>Out: {def.outPorts}</span>
      </div>

      {/* (Optional placeholders; kept from earlier memo) */}
      {inHandles}
      {outHandles}
    </div>
  );
}

const pillStyle: React.CSSProperties = {
  fontSize: 12,
  padding: "4px 8px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.10)",
};

const nodeTypes = { building: BuildingNode };

// --- App ---

function makeNodeId() {
  return `n_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export default function App() {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: false }, eds)),
    [setEdges]
  );

  const onDragStartPalette = useCallback((evt: React.DragEvent, def: BuildingDef) => {
    evt.dataTransfer.setData("application/sat-building", JSON.stringify(def));
    evt.dataTransfer.effectAllowed = "move";
  }, []);

  const onDragOver = useCallback((evt: React.DragEvent) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (evt: React.DragEvent) => {
      evt.preventDefault();
      const raw = evt.dataTransfer.getData("application/sat-building");
      if (!raw) return;
      const def: BuildingDef = JSON.parse(raw);

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds) return;

      // Convert screen -> flow coords (approx; ReactFlow also provides a projection API via instance)
      const x = evt.clientX - bounds.left;
      const y = evt.clientY - bounds.top;

      const id = makeNodeId();
      const newNode: Node = {
        id,
        type: "building",
        position: {
          x: clamp(x - 90, -5000, 5000),
          y: clamp(y - 40, -5000, 5000),
        },
        data: {
          def,
          label: def.label,
          onChangeLabel: (nodeId: string, v: string) => {
            setNodes((nds) =>
              nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, label: v } } : n))
            );
          },
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const exportJSON = useCallback(() => {
    const payload = { nodes, edges, v: 1 };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "satisfactory-diagram.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const importJSON = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      const parsed = JSON.parse(text);

      // Rebind onChangeLabel callback after import
      const importedNodes: Node[] = (parsed.nodes ?? []).map((n: any) => ({
        ...n,
        data: {
          ...n.data,
          onChangeLabel: (nodeId: string, v: string) => {
            setNodes((nds) =>
              nds.map((nn) => (nn.id === nodeId ? { ...nn, data: { ...nn.data, label: v } } : nn))
            );
          },
        },
      }));

      setNodes(importedNodes);
      setEdges(parsed.edges ?? []);
    };
    input.click();
  }, [setNodes, setEdges]);

  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex", background: "#0b1020" }}>
      {/* Sidebar */}
      <Sidebar onDragStart={onDragStartPalette} onExport={exportJSON} onImport={importJSON} />

      {/* Canvas */}
      <main ref={reactFlowWrapper} style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Background gap={18} size={1} />
          <MiniMap pannable zoomable />
          <Controls />
        </ReactFlow>
      </main>
    </div>
  );
}
