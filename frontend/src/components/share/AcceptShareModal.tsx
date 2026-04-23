import { useRef, useState } from "react";
import { toast } from "react-toastify";
import ForgeAxios from "../../modules/axios.module";
import { getErrorMessage } from "../../modules/error.module";
import Button from "../button/Button";
import { FaKey } from "react-icons/fa6";
import InputHolder from "../input/InputHolder";

type Props = {
  onAccepted?: () => void;
};

const AcceptShareModal: React.FC<Props> = ({ onAccepted }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);

  const accept = async () => {
    const code = codeRef.current?.value.trim();
    if (!code) {
      toast.error("Kérem adja meg a megosztási kódot!");
      return;
    }

    setLoading(true);
    try {
      const res = await ForgeAxios({
        method: "POST",
        url: "/share/accept",
        data: { code },
      });
      toast.success(res.data.message || "Sikeresen hozzáadva!");
      setOpen(false);
      onAccepted?.();
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button icon={<FaKey />} onClick={() => setOpen(true)} style={{ width: "auto" }}>
        Kód beváltása
      </Button>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            style={{
              backgroundColor: "var(--input-color)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--border-radius)",
              padding: "24px",
              width: "100%",
              maxWidth: "420px",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>
              Megosztott tartalom beváltása
            </h3>
            <InputHolder text="Megosztási kód">
              <input
                ref={codeRef}
                type="text"
                placeholder="36 karakteres kód..."
                maxLength={36}
                style={{ fontFamily: "monospace", letterSpacing: "0.04em" }}
                onKeyDown={(e) => { if (e.key === "Enter") accept(); }}
              />
            </InputHolder>
            <div style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "flex-end" }}>
              <Button
                onClick={() => setOpen(false)}
                style={{ width: "auto", background: "var(--input-color)", border: "1px solid var(--border-color)" }}
              >
                Mégse
              </Button>
              <Button icon={<FaKey />} onClick={accept} style={{ width: "auto" }} disabled={loading}>
                Beváltás
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AcceptShareModal;
