import React, { useEffect, useRef, useState, type RefObject } from "react";
import type { Category } from "../../types/category.type";
import ForgeAxios from "../../modules/axios.module";
import InputHolder from "../../components/input/InputHolder";
import Select from "react-select";
import type { SelectInstance } from "react-select";
import { selectStyles } from "../../modules/select.module";
import Button from "../../components/button/Button";
import { FaSave, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../modules/error.module";
import type { Test } from "../../types/test.type";
import { useNavigate, useParams } from "react-router-dom";

type Props = {
  type: "new" | "edit";
};

const TestControllerPage: React.FC<Props> = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [test, setTest] = useState<Test | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const questionCountRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<SelectInstance<{ value: string }>>(null);

  const getCategories = async () => {
    try {
      const res = await ForgeAxios({
        method: "GET",
        url: "/category",
      });

      console.log(res.data);
      setCategories(res.data.categories || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getTest = async () => {
    try {
      const res = await ForgeAxios({
        method: "GET",
        url: `/test/${id}`,
      });

      console.log(res.data);
      setTest(res.data.test || null);
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error as Error));
    }
  };

  useEffect(() => {
    getCategories();
    if (type === "edit") {
      getTest();
    }
  }, []);

  useEffect(() => {
    if (test) {
      nameRef.current!.value = test.name;
      questionCountRef.current!.value = test.questionCount.toString();
    }
  }, [test]);

  const createTest = async () => {
    try {
      const name = nameRef.current?.value;
      const questionCount = questionCountRef.current?.valueAsNumber || 0;
      const categoryId = selectRef.current?.getValue()[0]?.value;

      if (!name || !categoryId) {
        toast.error("Kérem töltse ki az összes mezőt!");
        return;
      }

      const res = await ForgeAxios({
        method: "POST",
        url: "/test",
        data: {
          name,
          questionCount,
          categoryId,
        },
      });

      console.log(res.data);
      toast.success(res.data.message || "Teszt sikeresen létrehozva!");
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error as Error));
    }
  };

  const updateTest = async () => {
    try {
      const name = nameRef.current?.value;
      const questionCount = questionCountRef.current?.valueAsNumber || 0;

      if (!name) {
        toast.error("Kérem töltse ki az összes mezőt!");
        return;
      }

      const res = await ForgeAxios({
        method: "PUT",
        url: `/test/${id}`,
        data: {
          name,
          questionCount,
        },
      });

      console.log(res.data);
      toast.success(res.data.message || "Teszt sikeresen módosítva!");
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error as Error));
    }
  };

  const deleteTest = async () => {
    try {
      const res = await ForgeAxios({
        method: "DELETE",
        url: `/test/${id}`,
      });

      console.log(res.data);
      toast.success(res.data.message || "Teszt sikeresen törölve!");
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error as Error));
    }
  };

  if (type === "edit" && !test) return <main>Loading...</main>;

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          gap: "var(--input-padding)",
          justifyContent: "flex-end",
          position: "sticky",
          top: "0px",
        }}
      >
        {type === "new" && (
          <Button icon={<FaSave />} onClick={createTest}>
            Létrehozás
          </Button>
        )}
        {type === "edit" && (
          <>
            <Button icon={<FaSave />} onClick={updateTest}>
              Módosítás
            </Button>
            <Button
              icon={<FaTrash />}
              style={{ backgroundColor: "red" }}
              onClick={deleteTest}
            >
              Törlés
            </Button>
          </>
        )}
      </div>
      <InputHolder text="Név">
        <input type="text" ref={nameRef} />
      </InputHolder>

      <InputHolder text="Kérdés szám">
        <input type="number" min={0} ref={questionCountRef} defaultValue={0} />
      </InputHolder>

      {type === "new" && (
        <InputHolder text="Kategória">
          <Select
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            styles={selectStyles}
            placeholder="Válassz kategóriát"
            ref={selectRef as unknown as RefObject<SelectInstance>}
          />
        </InputHolder>
      )}
    </div>
  );
};

export default TestControllerPage;
