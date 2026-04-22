import React, { useCallback, useRef, useState } from "react";
import {
  TaskType,
  type ImportTask,
  type TaskOptions,
} from "../../types/task.type";
import Button from "../../components/button/Button";
import { FaCheck, FaFileImport, FaTimes, FaUpload } from "react-icons/fa";
import TaskPreview from "./TaskPreview";

type Props = {
  categoryId: string;
  onClose: () => void;
  onImport: (tasks: ImportTask[]) => Promise<void>;
};

const VALID_TYPES = Object.values(TaskType) as string[];

const ImportTasksModal: React.FC<Props> = ({ onClose, onImport }) => {
  const [tasks, setTasks] = useState<ImportTask[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateTasks = (raw: unknown): ImportTask[] => {
    if (!Array.isArray(raw))
      throw new Error("A JSON fájl tartalmának tömbnek kell lennie.");
    if (raw.length === 0)
      throw new Error("A tömb üres, nincs feltölthető feladat.");

    return raw.map((item, i) => {
      if (typeof item !== "object" || item === null)
        throw new Error(`${i + 1}. elem: nem objektum.`);

      const obj = item as Record<string, unknown>;

      if (typeof obj.description !== "string" || !obj.description.trim())
        throw new Error(
          `${i + 1}. elem: hiányzó vagy üres "description" mező.`,
        );

      if (!VALID_TYPES.includes(obj.type as string))
        throw new Error(
          `${i + 1}. elem: érvénytelen "type" érték: "${obj.type}". Érvényes értékek: ${VALID_TYPES.join(", ")}.`,
        );

      return {
        description: obj.description,
        type: obj.type as TaskType,
        options: (obj.options ?? null) as TaskOptions,
      };
    });
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith(".json")) {
      setError("Csak .json kiterjesztésű fájl fogadható el.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        const validated = validateTasks(parsed);
        setTasks(validated);
        setError(null);
      } catch (err) {
        setError(
          err instanceof SyntaxError
            ? "Érvénytelen JSON formátum."
            : (err as Error).message,
        );
        setTasks(null);
      }
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleConfirm = async () => {
    if (!tasks) return;
    setLoading(true);
    try {
      await onImport(tasks);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTasks(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div
      className="import-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="import-modal">
        <div className="import-modal-header">
          <div className="import-modal-title">
            <FaFileImport />
            <span>Feladatok importálása JSON-ból</span>
          </div>
          <button className="import-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="import-modal-body">
          {!tasks ? (
            <>
              <div
                className={`import-dropzone ${isDragging ? "dragging" : ""} ${error ? "has-error" : ""}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <FaUpload className="dropzone-icon" />
                <p className="dropzone-text">
                  Húzd ide a JSON fájlt, vagy kattints a tallózáshoz
                </p>
                <p className="dropzone-hint">
                  Csak .json kiterjesztés elfogadott
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>

              {error && <p className="import-error">{error}</p>}

              <div className="import-modal-format">
                <p className="import-format-title">Elvárt JSON formátum:</p>
                <pre className="import-format-example">{`[
  {
    "description": "Mi Magyarország fővárosa?",
    "type": "SINGLE_PICK",
    "options": [
      { "text": "Budapest", "isCorrect": true },
      { "text": "Debrecen", "isCorrect": false }
    ]
  }
]`}</pre>
              </div>
            </>
          ) : (
            <>
              <div className="import-preview-header">
                <span className="import-count">
                  {tasks.length} feladat előnézete
                </span>
                <button className="import-reset-btn" onClick={handleReset}>
                  Másik fájl
                </button>
              </div>
              <div className="import-preview-list">
                {tasks.map((task, i) => (
                  <TaskPreview key={i} task={task} index={i} />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="import-modal-footer">
          <Button btnType="secondary" onClick={onClose} disabled={loading}>
            Mégse
          </Button>
          {tasks && (
            <Button
              icon={<FaCheck />}
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Mentés..." : `${tasks.length} feladat mentése`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportTasksModal;
