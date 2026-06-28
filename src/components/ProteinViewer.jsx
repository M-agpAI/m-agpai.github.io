import { useEffect, useRef } from "react";
import * as $3Dmol from "3dmol";

export default function ProteinViewer({ structureUrl }) {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!viewerRef.current || !structureUrl) return;

    const viewer = $3Dmol.createViewer(viewerRef.current, {
      backgroundColor: "black",
    });

    viewer.clear();

    fetch(structureUrl)
      .then((response) => response.text())
      .then((data) => {
        viewer.addModel(data, "cif");
        viewer.setStyle({}, { cartoon: { color: "spectrum" } });
        viewer.zoomTo();
        viewer.render();
      })
      .catch((error) => {
        console.error("Viewer failed:", error);
      });

    return () => {
      viewer.clear();
    };
  }, [structureUrl]);

  return <div ref={viewerRef} style={{ width: "100%", height: "100%" }} />;
}