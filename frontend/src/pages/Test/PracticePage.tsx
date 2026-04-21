import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../modules/error.module";
import { useCallback, useEffect, useMemo, useState } from "react";
import ForgeAxios from "../../modules/axios.module";
import Button from "../../components/button/Button";
import { usePracticeStore } from "../../stores/practice.store";
import {
  TaskType,
  type MatchOptions,
  type PickOptions,
  type SortOptions,
  type Task,
  type TaskOptions,
} from "../../types/task.type";
import EssayTask from "./Tasks/EssayTask";
import MatchTask from "./Tasks/MatchTask";
import PickTask from "./Tasks/PickTask";
import SortTask from "./Tasks/SortTask";
import { AiOutlineFileDone } from "react-icons/ai";
import { FaSave } from "react-icons/fa";
import { MdTimer } from "react-icons/md";

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const isTaskCorrect = (task: Task, answer: TaskOptions | string): boolean => {
  switch (task.type) {
    case TaskType.SINGLE_PICK:
    case TaskType.MULTI_PICK: {
      const correct = task.options as PickOptions;
      const userAnswer = answer as PickOptions;
      return correct.every((correctOpt) => {
        const userOpt = userAnswer.find((o) => o.text === correctOpt.text);
        return userOpt?.isCorrect === correctOpt.isCorrect;
      });
    }
    case TaskType.SORTING: {
      const userAnswer = answer as SortOptions;
      return userAnswer.every((item, position) => item.index === position);
    }
    case TaskType.MATCHING: {
      const correct = task.options as MatchOptions;
      const userAnswer = answer as MatchOptions;
      return correct.items.every((correctItem) => {
        const userItem = userAnswer.items.find((i) => i.text === correctItem.text);
        return userItem?.group === correctItem.group;
      });
    }
    case TaskType.ESSAY:
      return false;
    default:
      return false;
  }
};

const calculateScore = (
  tasks: Task[],
  answers: Map<string, TaskOptions | string>,
): number =>
  tasks.reduce((score, task) => {
    const answer = answers.get(task.id);
    if (answer === undefined) return score;
    return isTaskCorrect(task, answer) ? score + 1 : score;
  }, 0);

const PracticePage = () => {
  const { id } = useParams();

  const {
    tasks,
    setTasks,
    currentTask,
    setCurrentTask,
    answers,
    isDone,
    setIsDone,
    reset,
  } = usePracticeStore();

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const hasTimer = timeLeft !== null;

  const getTasks = async () => {
    try {
      const [practiceRes, testRes] = await Promise.all([
        ForgeAxios({ method: "GET", url: `/test/${id}/practice` }),
        ForgeAxios({ method: "GET", url: `/test/${id}` }),
      ]);

      setTasks(practiceRes.data.tasks || []);
      setCurrentTask(practiceRes.data.tasks[0] || null);

      const minutes: number = testRes.data.test?.time ?? 0;
      if (minutes > 0) setTimeLeft(minutes * 60);
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error as Error));
    }
  };

  useEffect(() => {
    reset();
    getTasks();
    return () => {
      reset();
    };
  }, [id, reset]);

  useEffect(() => {
    if (!hasTimer || isDone) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 0) return prev;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasTimer, isDone]);

  useEffect(() => {
    if (timeLeft === 0) {
      toast.error("Lejárt az idő!", { autoClose: false });
    }
  }, [timeLeft]);

  const score = useMemo(
    () => (isDone ? calculateScore(tasks, answers) : null),
    [isDone, tasks, answers],
  );

  const gradableCount = useMemo(
    () => tasks.filter((t) => t.type !== TaskType.ESSAY).length,
    [tasks],
  );

  const generateTask = useCallback(() => {
    switch (currentTask?.type) {
      case TaskType.ESSAY:
        return <EssayTask key={currentTask.id} />;
      case TaskType.MATCHING:
        return <MatchTask key={currentTask.id} />;
      case TaskType.SINGLE_PICK:
        return <PickTask key={currentTask.id} />;
      case TaskType.MULTI_PICK:
        return <PickTask key={currentTask.id} />;
      case TaskType.SORTING:
        return <SortTask key={currentTask.id} />;
      default:
        return null;
    }
  }, [currentTask]);

  if (!tasks.length || !currentTask)
    return <div className="page">Loading...</div>;

  return (
    <div className="page">
      {isDone && score !== null && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--input-padding)",
            padding: "var(--input-padding) var(--content-padding)",
            marginBottom: "var(--content-padding)",
            backgroundColor: "var(--input-color)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--border-radius)",
          }}
        >
          <span style={{ fontSize: "24px", fontWeight: "bold" }}>
            {score}/{gradableCount}
          </span>
          <span style={{ color: "gray" }}>pont</span>
          {tasks.some((t) => t.type === TaskType.ESSAY) && (
            <span style={{ color: "gray", fontSize: "14px" }}>
              (az esszé feladatok nem kerülnek automatikusan értékelésre)
            </span>
          )}
        </div>
      )}

      <div style={{ marginBottom: "var(--input-padding)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "4px",
          }}
        >
          <span style={{ fontSize: "14px", color: "gray" }}>Megválaszolt feladatok</span>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
              {answers.size}/{tasks.length}
            </span>
            {hasTimer && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: timeLeft! <= 60 ? "#ef4444" : "inherit" }}>
                <MdTimer style={{ fontSize: "16px" }} />
                <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>
                  {formatTime(timeLeft!)}
                </span>
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: "6px",
            backgroundColor: "var(--border-color)",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(answers.size / tasks.length) * 100}%`,
              backgroundColor: "var(--button-background)",
              borderRadius: "999px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
          width: "100%",
          marginBottom: "1rem",
        }}
      >
        {tasks.map((task, index) => {
          const isCurrent = currentTask?.id === task.id;
          const isAnswered = answers.has(task.id);
          return (
            <Button
              key={task.id}
              style={{
                minWidth: "40px",
                background: isCurrent
                  ? "linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)"
                  : isAnswered
                    ? "linear-gradient(180deg, #1e40af 0%, #1e3a5f 100%)"
                    : "var(--input-color)",
                outline: isCurrent ? "2px solid #60a5fa" : "none",
                outlineOffset: "2px",
              }}
              onClick={() => setCurrentTask(task)}
            >
              {index + 1}.
            </Button>
          );
        })}
      </div>
      <div style={{ marginBottom: "2rem" }}>
        {answers.size >= tasks.length && !isDone && (
          <Button
            onClick={() => {
              setIsDone(true);
              setCurrentTask(tasks[0]);
            }}
            style={{ marginLeft: "auto" }}
            icon={<AiOutlineFileDone />}
          >
            Leadás
          </Button>
        )}
        {isDone && (
          <Button
            onClick={() => toast.warn("Coming soon!")}
            style={{ marginLeft: "auto" }}
            icon={<FaSave />}
          >
            Mentés
          </Button>
        )}
      </div>
      {generateTask()}
    </div>
  );
};

export default PracticePage;
