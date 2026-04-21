import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ForgeAxios from "../../modules/axios.module";
import type { Category } from "../../types/category.type";
import Button from "../../components/button/Button";
import { FaSave } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import InputHolder from "../../components/input/InputHolder";
import { getErrorMessage } from "../../modules/error.module";
import { toast } from "react-toastify";
import Tasks from "../Task/Tasks";

type Props = {
  type: "new" | "edit";
};

const CategoryControllerPage: React.FC<Props> = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const getCategory = async () => {
    try {
      const res = await ForgeAxios({
        method: "GET",
        url: `/category/${id}`,
      });

      console.log(res.data);
      setCategory(res.data.category || null);
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
      console.log(error);
    }
  };

  const addCategory = async () => {
    const name = nameRef.current?.value;
    const description = descriptionRef.current?.value;

    try {
      const res = await ForgeAxios({
        method: "POST",
        url: "/category",
        data: { name, description },
      });

      console.log(res.data);
      navigate(`/categories/edit/${res.data.category.id}`);
      toast.success(res.data.message || "Kategória sikeresen létrehozva!");
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
      console.log(error);
    }
  };

  const updateCategory = async () => {
    const name = nameRef.current?.value;
    const description = descriptionRef.current?.value;

    try {
      const res = await ForgeAxios({
        method: "PUT",
        url: `/category/${category?.id}`,
        data: { name, description },
      });

      console.log(res.data);
      setCategory(res.data.category || null);
      toast.success(res.data.message || "Kategória sikeresen frissítve!");
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
      console.log(error);
    }
  };

  const deleteCategory = async () => {
    try {
      const res = await ForgeAxios({
        method: "DELETE",
        url: `/category/${category?.id}`,
      });

      console.log(res.data);
      toast.success(res.data.message || "Kategória sikeresen törlve!");
      navigate(-1);
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
      console.log(error);
    }
  };

  useEffect(() => {
    if (type != "edit") return;
    getCategory();
  }, []);

  useEffect(() => {
    if (!category) return;
    nameRef.current!.value = category.name;
    descriptionRef.current!.value = category.description;
  }, [category]);

  const cardStyle: React.CSSProperties = {
    padding: "var(--content-padding)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--border-radius)",
    backgroundColor: "rgba(0,0,0,0.15)",
    marginBottom: "var(--content-padding)",
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    marginBottom: "var(--content-padding)",
  };

  if (type === "edit" && !category) return <main>Loading...</main>;

  return (
    <div className="page">
      <div style={{ display: "flex", gap: "var(--input-padding)", justifyContent: "flex-end", marginBottom: "var(--content-padding)" }}>
        {type === "new" && !category && (
          <Button icon={<FaSave />} onClick={addCategory} style={{ width: "auto" }}>
            Létrehozás
          </Button>
        )}
        {(type === "edit" || category) && (
          <>
            <Button icon={<FaSave />} onClick={updateCategory} style={{ width: "auto" }}>
              Módosítás
            </Button>
            <Button
              icon={<FaTrash />}
              onClick={deleteCategory}
              style={{ width: "auto", background: "linear-gradient(180deg,#b91c1c,#991b1b)", boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
            >
              Törlés
            </Button>
          </>
        )}
      </div>

      <div style={cardStyle}>
        <p style={sectionTitleStyle}>Alapadatok</p>
        <InputHolder text="Kategória neve">
          <input type="text" ref={nameRef} />
        </InputHolder>
        <InputHolder text="Kategória leírása">
          <textarea rows={5} ref={descriptionRef}></textarea>
        </InputHolder>
      </div>

      {category && <Tasks categoryId={category.id} />}
    </div>
  );
};

export default CategoryControllerPage;
