import React, { useCallback, useEffect } from "react";
import type { ImportTask, Task } from "../../types/task.type";
import { getErrorMessage } from "../../modules/error.module";
import { toast } from "react-toastify/unstyled";
import ForgeAxios from "../../modules/axios.module";
import TaskCard from "./TaskCard";
import Button from "../../components/button/Button";
import { FaFileExport, FaFileImport, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ImportTasksModal from "./ImportTasksModal";

type Props = {
  categoryId: string;
};

const Tasks: React.FC<Props> = ({ categoryId }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [showImport, setShowImport] = React.useState(false);

  const getTasks = useCallback(async () => {
    try {
      const res = await ForgeAxios({
        method: "GET",
        url: `/task/${categoryId}`,
      });

      setTasks(res.data.tasks);
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error as Error));
    }
  }, [categoryId]);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const handleExport = () => {
    const exportData: ImportTask[] = tasks.map(
      ({ description, type, options }) => ({
        description,
        type,
        options,
      }),
    );
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feladatok-${categoryId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (importedTasks: ImportTask[]) => {
    let successCount = 0;
    for (const task of importedTasks) {
      try {
        await ForgeAxios({
          method: "POST",
          url: "/task/",
          data: { categoryId, ...task },
        });
        successCount++;
      } catch (error) {
        toast.error(
          `"${task.description}" mentése sikertelen: ${getErrorMessage(error as Error)}`,
        );
      }
    }
    if (successCount > 0) {
      toast.success(`${successCount} feladat sikeresen importálva.`);
      await getTasks();
    }
    setShowImport(false);
  };

  return (
    <div>
      <h2 style={{ marginBottom: "10px", marginTop: "50px" }}>Feladatok</h2>
      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
        <Button
          icon={<FaPlus />}
          onClick={() => navigate(`/tasks/${categoryId}`)}
        >
          Új feladat
        </Button>
        <Button
          icon={<FaFileImport />}
          btnType="secondary"
          onClick={() => setShowImport(true)}
        >
          Importálás JSON-ból
        </Button>
        <Button
          icon={<FaFileExport />}
          btnType="secondary"
          onClick={handleExport}
        >
          Exportálás JSON-ba
        </Button>
      </div>
      <div className="card-grid">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} categoryId={categoryId} />
        ))}
      </div>
      {showImport && (
        <ImportTasksModal
          categoryId={categoryId}
          onClose={() => setShowImport(false)}
          onImport={handleImport}
        />
      )}
    </div>
  );
};

export default Tasks;
