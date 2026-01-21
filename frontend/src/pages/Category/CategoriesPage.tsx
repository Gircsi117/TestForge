import { useEffect, useState } from "react";
import ForgeAxios from "../../modules/axios.module";
import type { Category } from "../../types/category.type";
import Button from "../../components/button/Button";
import { FaGear, FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);

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

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <main>
      <Link to="/categories/new" style={{ display: "inline-block" }}>
        <Button
          icon={<FaPlus />}
          style={{ marginBottom: "var(--content-padding)" }}
        >
          Új kategória
        </Button>
      </Link>
      <div className="card-grid">
        {categories.map((category) => (
          <div key={category.id} className="card">
            <div className="card-content">
              <h2>{category.name}</h2>
              <p>{category.description}</p>
            </div>

            <Link to={`/categories/edit/${category.id}`}>
              <Button
                icon={<FaGear />}
                style={{ marginTop: "var(--content-padding)", width: "100%" }}
              >
                Kategória módosítása
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
};

export default CategoriesPage;
