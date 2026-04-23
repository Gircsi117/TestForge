import { useEffect, useState } from "react";
import ForgeAxios from "../../modules/axios.module";
import type { Category } from "../../types/category.type";
import Button from "../../components/button/Button";
import { FaGear, FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { getMonogram } from "../../modules/monogram.module";
import AcceptShareModal from "../../components/share/AcceptShareModal";
import Label from "../../components/label/Label";
import { FaLock } from "react-icons/fa";

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
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "var(--content-padding)",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Link to="/categories/new" style={{ display: "inline-block" }}>
          <Button icon={<FaPlus />}>Új Kategória</Button>
        </Link>
        <AcceptShareModal onAccepted={getCategories} />
      </div>

      <div className="card-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className="card"
            style={{
              borderTop: `3px solid ${category.isOwner ? "var(--button-background)" : "#a78bfa"}`,
              gap: 0,
            }}
          >
            <div className="card-content">
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <div className="monogram">{getMonogram(category.name)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontSize: "18px", fontWeight: 700 }}>
                    {category.name}
                  </h2>
                  {!category.isOwner && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        marginTop: "2px",
                      }}
                    >
                      Létrehozta: {category?.creator?.name || ""}
                    </p>
                  )}
                </div>
                {!category.isOwner && (
                  <Label background="rgba(167,139,250,0.12)" color="#a78bfa">
                    {category.canEdit ? (
                      "Szerkesztő"
                    ) : (
                      <>
                        <FaLock style={{ fontSize: "10px" }} /> Csak olvasó
                      </>
                    )}
                  </Label>
                )}
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
              {(category.isOwner || category.canEdit) && (
                <Link to={`/categories/edit/${category.id}`}>
                  <Button icon={<FaGear />} style={{ width: "100%" }}>
                    Kategória módosítása
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default CategoriesPage;
