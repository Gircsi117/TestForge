import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ForgeAxios from "../../modules/axios.module";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../modules/error.module";
import ShareSection from "../../components/share/ShareSection";
import Button from "../../components/button/Button";
import { FaArrowLeft } from "react-icons/fa";
import type { Category } from "../../types/category.type";
import type { Test } from "../../types/test.type";

type Props = {
  type: "category" | "test";
};

const SharePage: React.FC<Props> = ({ type }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [resource, setResource] = useState<Category | Test | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchResource = async () => {
    try {
      const url = type === "category" ? `/category/${id}` : `/test/${id}`;
      const res = await ForgeAxios({ method: "GET", url });
      setResource(type === "category" ? res.data.category : res.data.test);
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResource();
  }, []);

  const backPath =
    type === "category" ? `/categories/edit/${id}` : `/tests/edit/${id}`;

  if (loading) return <main>Loading...</main>;

  if (!resource || !resource.isOwner) {
    return (
      <div className="page">
        <p style={{ color: "#94a3b8" }}>Nincs hozzáférésed ehhez az oldalhoz.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--input-padding)",
          marginBottom: "var(--content-padding)",
        }}
      >
        <Button
          icon={<FaArrowLeft />}
          onClick={() => navigate(backPath)}
          style={{ width: "auto" }}
        >
          Vissza
        </Button>
        <p style={{ fontSize: "16px", fontWeight: 600, color: "#f1f5f9" }}>
          {resource.name} — Megosztás kezelése
        </p>
      </div>

      <ShareSection type={type} id={id!} />
    </div>
  );
};

export default SharePage;
