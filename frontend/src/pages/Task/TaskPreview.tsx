import { TASK_TYPE_META } from "../../constants/taskTypeMeta";
import { TaskType, type EssayOptions, type ImportTask, type MatchOptions, type PickOptions, type SortOptions } from "../../types/task.type";

const TaskPreview: React.FC<{ task: ImportTask; index: number }> = ({
  task,
  index,
}) => {
  const meta = TASK_TYPE_META[task.type];

  const renderOptions = () => {
    if (task.type === TaskType.ESSAY) {
      const opts = task.options as EssayOptions | null;
      if (!opts?.content) return null;
      return <div className="import-preview-essay">{opts.content}</div>;
    }
    if (
      task.type === TaskType.SINGLE_PICK ||
      task.type === TaskType.MULTI_PICK
    ) {
      const opts = task.options as PickOptions;
      if (!Array.isArray(opts)) return null;
      return (
        <div className="import-preview-options">
          {opts.map((o, i) => (
            <div
              key={i}
              className={`import-preview-pick-item ${o.isCorrect ? "correct" : ""}`}
            >
              <span>{o.isCorrect ? "✅" : "❌"}</span>
              <span>{o.text}</span>
            </div>
          ))}
        </div>
      );
    }
    if (task.type === TaskType.SORTING) {
      const opts = [...(task.options as SortOptions)].sort(
        (a, b) => a.index - b.index,
      );
      return (
        <div className="import-preview-options">
          {opts.map((o, i) => (
            <div key={i} className="import-preview-sort-item">
              <span className="sort-index">{i + 1}.</span>
              <span>{o.text}</span>
            </div>
          ))}
        </div>
      );
    }
    if (task.type === TaskType.MATCHING) {
      const opts = task.options as MatchOptions;
      return (
        <div className="import-preview-options">
          <div className="import-preview-groups">
            {opts.groups?.map((g, i) => (
              <span key={i} className="group-badge">
                {g}
              </span>
            ))}
          </div>
          {opts.items?.map((item, i) => (
            <div key={i} className="import-preview-match-item">
              <span>{item.text}</span>
              <span className="arrow">→</span>
              <span className="group-name">{item.group}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="import-preview-card">
      <div className="import-preview-card-header">
        <span className="task-index">#{index + 1}</span>
        <span className="task-description">{task.description}</span>
        <span
          className="task-type-badge"
          style={{
            backgroundColor: meta.bg,
            color: meta.color,
            borderColor: `${meta.color}40`,
          }}
        >
          {meta.label}
        </span>
      </div>
      {renderOptions()}
    </div>
  );
};

export default TaskPreview;