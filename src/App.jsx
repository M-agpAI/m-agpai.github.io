import React, { useMemo, useState } from "react";
import {
  Upload,
  Cpu,
  Atom,
  Download,
  CheckCircle2,
  Loader2,
  FileText,
  Sparkles
} from "lucide-react";
import ProteinViewer from "./components/ProteinViewer";

const metals = ["Zn²⁺", "Fe²⁺", "Mg²⁺", "Cu²⁺", "Ni²⁺", "Co²⁺"];

// const demoStructures = [
//   { rank: 1, name: "design_rank_1.pdb", energy: -18.7, confidence: 0.96 },
//   { rank: 2, name: "design_rank_2.pdb", energy: -17.9, confidence: 0.94 },
//   { rank: 3, name: "design_rank_3.pdb", energy: -16.8, confidence: 0.91 },
//   { rank: 4, name: "design_rank_4.pdb", energy: -15.6, confidence: 0.89 },
//   { rank: 5, name: "design_rank_5.pdb", energy: -14.8, confidence: 0.86 }
// ];


const demoStructures = [
  { rank: 1, name: "design_1.cif" },
  { rank: 2, name: "design_2.cif" },
  { rank: 3, name: "design_3.cif" },
  { rank: 4, name: "design_4.cif" },
  { rank: 5, name: "design_5.cif" },
  { rank: 6, name: "design_6.cif" },
  { rank: 7, name: "design_7.cif" },
  { rank: 8, name: "design_8.cif" },
  { rank: 9, name: "design_9.cif" },
  { rank: 10, name: "design_10.cif" }
];


function Step({ number, title, active, done, icon: Icon }) {
  return (
    <div className={`step-card ${active ? "active" : ""} ${done ? "done" : ""}`}>
      <div className="step-icon">
        {done ? <CheckCircle2 size={20} /> : <Icon size={20} />}
      </div>

      <div>
        <div className="step-number">Step {number}</div>
        <div className="step-title">{title}</div>
      </div>
    </div>
  );
}

export default function App() {

  // const [selectedStructure, setSelectedStructure] = useState(
  //     `${import.meta.env.BASE_URL}demo_structures/design_1.cif`
  //   );
  

//   const [selectedStructure, setSelectedStructure] = useState(
//     `${import.meta.env.BASE_URL}demo_structures/design_1.cif`
// );


  const [inputMode, setInputMode] = useState("pdb");
  const [sequence, setSequence] = useState(
    "MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQ..."
  );
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("input");
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedStructure, setSelectedStructure] = useState(null);


  const activeStep = useMemo(() => {
    if (status === "input") return 1;
    if (status === "ready") return 2;
    if (status === "running") return 3;
    if (status === "results") return 4;
    return 1;
  }, [status]);

  const chooseMetal = (metal) => {
    setSelectedMetal(metal);
    setStatus("ready");
  };

  // const runBindingSiteAlgorithm = () => {
  //   if (!selectedMetal) return;

  //   setStatus("running");

  //   // MOCK: replace this with your real backend call later
  //   setTimeout(() => {
  //     setStatus("results");
  //   }, 1600);
  // };

  const runBindingSiteAlgorithm = async () => {
    if (!selectedMetal) {
      alert("Please choose a metal first.");
      return;
    }

    if (!selectedFile) {
      alert("Please upload a CIF file first.");
      return;
    }

    setStatus("running");

    const formData = new FormData();
    formData.append("metal", selectedMetal);
    formData.append("cif_file", selectedFile);

    try {
      const response = await fetch(
        "https://dkumar-magpai.hf.space/run-magpai",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Magpai backend failed");
      }

      const data = await response.json();

      setResults(data.results || []);

      if (data.results?.length > 0) {
        setSelectedStructure(data.results[0].url);
      }

      setStatus("results");
    } catch (error) {
      console.error(error);
      alert(error.message);
      setStatus("input");
    }
  };

  // const payload = JSON.stringify(
  //   {
  //     input_type: inputMode,
  //     input: inputMode === "pdb" ? fileName || "uploaded_protein.pdb" : sequence,
  //     metal: selectedMetal,
  //     return_top_k: 5
  //   },
  //   null,
  //   2
  // );

  return (
    <div className="app">
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />
      <div className="background-orb orb-three" />
      <div className="grid-background" />

      <div className="page">
        <header className="hero">
          <div>
            <div className="badge">
              <Sparkles size={16} />
              AI-assisted metal-binding protein design
            </div>

            <h1>
              Mag<span>pai</span>
            </h1>

            <p>
              Upload a PDB or paste a protein sequence, choose a metal, and let
              Magpai run the binding-site algorithm to generate the top five
              designed structures.
            </p>
          </div>
        </header>

        <section className="steps">
          <Step
            number="1"
            title="Input protein"
            icon={Upload}
            active={activeStep === 1}
            done={activeStep > 1}
          />

          <Step
            number="2"
            title="Choose metal"
            icon={Atom}
            active={activeStep === 2}
            done={!!selectedMetal}
          />

          <Step
            number="3"
            title="Run algorithm"
            icon={Cpu}
            active={activeStep === 3}
            done={status === "results"}
          />

          <Step
            number="4"
            title="Top 10 structures"
            icon={Download}
            active={activeStep === 4}
            done={false}
          />
        </section>

        <main className="main-layout">
          <section className="left-column">
            <div className="panel">
              <h2>
                <FileText size={24} />
                Input protein
              </h2>

              <div className="mode-buttons">
                <button
                  className={inputMode === "pdb" ? "selected" : ""}
                  onClick={() => {
                    setInputMode("pdb");
                    setStatus("input");
                    setSelectedMetal(null);
                  }}
                >
                  CIF file
                </button>

                <button
                  className={inputMode === "sequence" ? "selected" : ""}
                  onClick={() => {
                    setInputMode("sequence");
                    setStatus("input");
                    setSelectedMetal(null);
                  }}
                >
                  Sequence
                </button>
              </div>

              {inputMode === "pdb" ? (
                <label className="upload-box">
                  <Upload size={48} />
                  <strong>Drop or select a .cif file</strong>
                  <span>{fileName || "No CIF selected"}</span>

                  <input
                    type="file"
                    accept=".cif,.mmcif"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setSelectedFile(file);
                      setFileName(file?.name || "");
                      setStatus("input");
                      setSelectedMetal(null);
                      setResults([]);
                      setSelectedStructure(null);
                    }}
                  />
                </label>
              ) : (
                <textarea
                  className="sequence-box"
                  wrap="soft"
                  value={sequence}
                  onChange={(e) => {
                    setSequence(e.target.value);
                    setStatus("input");
                    setSelectedMetal(null);
                  }}
                />
              )}
            </div>

          </section>

          <section className="right-column">
            <div className="panel">
              <div className="section-header">
                <div>
                  <h2>Choose metal</h2>

                  <p className="muted">
                    Select the metal first. Magpai then runs the binding-site
                    algorithm using this metal and returns the top designs.
                  </p>
                </div>
              </div>

              <div className="metal-grid">
                {metals.map((metal) => (
                  <button
                    key={metal}
                    className={selectedMetal === metal ? "selected" : ""}
                    disabled={status === "running"}
                    onClick={() => chooseMetal(metal)}
                  >
                    {metal}
                  </button>
                ))}
              </div>

              {/* <div className="protein-viewer">
                <div className="viewer-label">Protein viewer mock-up</div>

                <svg viewBox="0 0 100 100" className="protein-svg">
                  <path
                    d="M12,55 C25,20 38,22 46,42 C56,66 70,17 83,38 C94,55 78,87 56,78 C35,72 24,90 14,70 C10,62 9,59 12,55"
                    fill="none"
                    stroke="#67e8f9"
                    strokeWidth="3"
                  />

                  <path
                    d="M18,60 C31,32 42,35 50,54 C58,74 70,31 78,45 C86,58 73,77 56,70 C38,64 30,80 20,66"
                    fill="none"
                    stroke="#a7f3d0"
                    strokeWidth="1.7"
                    opacity="0.75"
                  />

                  <path
                    d="M25,40 C45,12 58,31 44,53 C36,68 62,82 79,57"
                    fill="none"
                    stroke="#bfdbfe"
                    strokeWidth="1.2"
                    opacity="0.55"
                  />
                </svg>

                {status === "input" && (
                  <div className="viewer-message">
                    Choose a metal, then run the binding-site algorithm.
                  </div>
                )}

                {status === "ready" && (
                  <div className="viewer-message">
                    Ready to run Magpai for <strong>{selectedMetal}</strong>.
                  </div>
                )}

                {status === "running" && (
                  <div className="viewer-overlay">
                    <Loader2 className="spin" size={46} />
                    <strong>
                      Running binding-site algorithm for {selectedMetal}...
                    </strong>
                  </div>
                )}

                {status === "results" && (
                  <div className="viewer-message">
                    Binding-site search complete. Top designs are ready.
                  </div>
                )}
              </div> */}

              {/* <div className="protein-viewer">
                <ProteinViewer structureUrl={selectedStructure} />
              </div> */}

              <div className="protein-viewer">
                {selectedStructure ? (
                  <ProteinViewer structureUrl={selectedStructure} />
                ) : (
                  <div className="viewer-message">
                    Upload a CIF, choose a metal, and run Magpai.
                  </div>
                )}
              </div>

              <button
                className="success-button"
                disabled={!selectedMetal || !selectedFile || status === "running"}
                onClick={runBindingSiteAlgorithm}
              >
                {status === "running" ? (
                  <Loader2 className="spin" size={20} />
                ) : (
                  <Cpu size={20} />
                )}
                Run Magpai
              </button>
            </div>

            <div className="panel">
              <h2>Top 10 structures</h2>

              {status !== "results" ? (
                <div className="empty-results">
                  Results appear here after Magpai runs.
                </div>
              ) : (
                <div className="results-list">
                  {results.map((structure) => (
                    <div
                      className="result-card clickable"
                      key={structure.rank}
                      onClick={() => setSelectedStructure(structure.url)}
                    >
                      <div>
                        <strong>
                          #{structure.rank} {structure.name}
                        </strong>

                        <span>
                          Metal: {structure.metal || selectedMetal}
                          {structure.score !== undefined && ` · Score: ${structure.score}`}
                        </span>
                      </div>

                      <div className="result-actions">
                        <a
                          href={structure.download_url || structure.url}
                          download
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button>
                            <Download size={16} />
                            CIF
                          </button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}