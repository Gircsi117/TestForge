import { toast } from "react-toastify";
import { getErrorMessage } from "../../modules/error.module";
import ForgeAxios from "../../modules/axios.module";
import { useEffect, useState } from "react";
import type { Test } from "../../types/test.type";
import { Link } from "react-router-dom";
import Button from "../../components/button/Button";
import { FaPen, FaPlus } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";

const TestPage = () => {
  const [tests, setTests] = useState<Test[]>([]);

  const getTests = async () => {
    try {
      const res = await ForgeAxios({
        method: "GET",
        url: "/test",
      });

      console.log("Tests:", res.data.tests);
      setTests(res.data.tests || []);
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error as Error));
    }
  };

  useEffect(() => {
    getTests();
  }, []);

  return (
    <div className="page">
      <Link to="/tests/new" style={{ display: "inline-block" }}>
        <Button
          icon={<FaPlus />}
          style={{ marginBottom: "var(--content-padding)" }}
        >
          Új Teszt
        </Button>
      </Link>
      <div className="card-grid">
        {tests.map((test) => (
          <div key={test.id} className="card">
            <div className="card-content">
              <h3>{test.name}</h3>
              <p>Kérdés szám: {test.questionCount}</p>
              <p>
                Kategória: [
                <Link
                  to={`/categories/edit/${test.category.id}`}
                  title="Ugrás a kategória szerkesztéséhez"
                >
                  {test.category.name}
                </Link>
                ]
              </p>
            </div>
            <Link to={`/tests/edit/${test.id}`}>
              <Button
                icon={<FaGear />}
                style={{ marginTop: "var(--content-padding)", width: "100%" }}
              >
                Teszt módosítása
              </Button>
            </Link>
            <Link to={`/tests/${test.id}`}>
              <Button
                icon={<FaPen />}
                style={{ marginTop: "var(--content-padding)", width: "100%" }}
              >
                Teszt kitöltése
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestPage;
