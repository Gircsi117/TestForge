import { useEffect, useState } from "react";
import ForgeAxios from "../../modules/axios.module";
import type { Category } from "../../types/category.type";
import Button from "../../components/button/Button";
import { FaGear, FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { getMonogram } from "../../modules/monogram.module";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const getCategories = async () => {
    try {
      const res = await ForgeAxios({ method: "GET", url: "/category" });
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
          Új Kategória
        </Button>
      </Link>
      <div className="card-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className="card"
            style={{ borderTop: "3px solid var(--button-background)", gap: 0 }}
          >
            <div className="card-content">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <div className="monogram">{getMonogram(category.name)}</div>
                <h2 style={{ fontSize: "18px", fontWeight: 700 }}>
                  {category.name}
                </h2>
              </div>
              {category.description && (
                <p
                  style={{
                    fontSize: "14px",
                    color: "#94a3b8",
                    lineHeight: "1.5",
                  }}
                >
                  {category.description}
                </p>
              )}
            </div>

            <div
              style={{
                borderTop: "1px solid var(--border-color)",
                marginTop: "16px",
                paddingTop: "12px",
              }}
            >
              <Link to={`/categories/edit/${category.id}`}>
                <Button icon={<FaGear />} style={{ width: "100%" }}>
                  Kategória módosítása
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default CategoriesPage;
