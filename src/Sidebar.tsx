import { useState } from "react";
import { BUILDING_CATEGORIES, type BuildingDef } from "./data";
import { btnPrimary, btnGhost, paletteCard, paletteIcon } from "./style";

export function Sidebar({
  onDragStart,
  onExport,
  onImport,
}: {
  onDragStart: (evt: React.DragEvent, def: BuildingDef) => void;
  onExport: () => void;
  onImport: () => void;
}) {
  const [search, setSearch] = useState("");
  const [openCategories, setOpenCategories] = useState<string[]>(
    BUILDING_CATEGORIES.map((c) => c.name) // ouvertes par défaut
  );

  const toggleCategory = (name: string) => {
    setOpenCategories((open) =>
      open.includes(name) ? open.filter((n) => n !== name) : [...open, name]
    );
  };

  const q = search.trim().toLowerCase();

  return (
    <aside
      style={{
        width: 320,
        padding: 16,
        borderRight: "1px solid rgba(255,255,255,0.08)",
        color: "white",
        overflow: "auto",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 800 }}>Satisfactory — Diagrammer</div>
      <div style={{ marginTop: 6, opacity: 0.75, fontSize: 13 }}>
        Glisse un bâtiment dans le canvas, connecte les ports, renomme.
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={onExport} style={btnPrimary}>
          Export JSON
        </button>
        <button onClick={onImport} style={btnGhost}>
          Import
        </button>
      </div>

      <div style={{ marginTop: 14 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un bâtiment…"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(0,0,0,0.25)",
            color: "white",
            outline: "none",
            fontSize: 13,
          }}
        />
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        {BUILDING_CATEGORIES.map((cat) => {
          const buildings = cat.buildings.filter((b) => {
            if (!q) return true;
            return (
              b.label.toLowerCase().includes(q) || b.type.toLowerCase().includes(q)
            );
          });
          if (buildings.length === 0) return null;

          const isOpen = openCategories.includes(cat.name);

          return (
            <div
              key={cat.name}
              style={{
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.04)",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => toggleCategory(cat.name)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.04)",
                  border: "none",
                  color: "white",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>{cat.name}</span>
                <span style={{ opacity: 0.75 }}>{isOpen ? "▼" : "►"}</span>
              </button>

              {isOpen && (
                <div
                  style={{
                    padding: 12,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  {buildings.map((b) => (
                    <div
                      key={b.type}
                      draggable
                      onDragStart={(e) => onDragStart(e, b)}
                      style={paletteCard}
                      title={b.label}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={paletteIcon}>{b.type.slice(0, 2).toUpperCase()}</div>
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 800,
                              fontSize: 12,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {b.label}
                          </div>
                          <div style={{ fontSize: 11, opacity: 0.7 }}>
                            In {b.inPorts} • Out {b.outPorts}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}