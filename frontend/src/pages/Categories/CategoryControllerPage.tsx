import { useParams } from "react-router-dom";
import ForgeAxios from "../../modules/axios.module";
import { useEffect, useRef, useState } from "react";
import type { Category } from "../../types/category.type";
import Button from "../../components/button/Button";
import { FaSave } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import InputHolder from "../../components/input/InputHolder";
import { getErrorMessage } from "../../modules/error.module";
import { toast } from "react-toastify";

type Props = {
  type: "new" | "edit";
};

const CategoryControllerPage: React.FC<Props> = ({ type }) => {
  const { id } = useParams();

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

  if (type === "edit" && !category) return <main>Loading...</main>;

  return (
    <main>
      <div
        style={{
          display: "flex",
          gap: "var(--input-padding)",
          justifyContent: "flex-end",
          position: "sticky",
          top: "0px",
        }}
      >
        {type === "new" && !category && (
          <Button icon={<FaSave />} onClick={addCategory}>
            Létrehozás
          </Button>
        )}
        {type === "edit" && (
          <>
            <Button icon={<FaSave />} onClick={updateCategory}>
              Módosítás
            </Button>
            <Button
              icon={<FaTrash />}
              onClick={deleteCategory}
              style={{ backgroundColor: "red" }}
            >
              Törlés
            </Button>
          </>
        )}
      </div>

      <InputHolder text="Kategória neve">
        <input type="text" ref={nameRef} />
      </InputHolder>

      <InputHolder text="Kategória leírása">
        <textarea rows={5} ref={descriptionRef}></textarea>
      </InputHolder>
    </main>
  );
};

export default CategoryControllerPage;
