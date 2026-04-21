import React, { useRef } from "react";
import { toast } from "react-toastify";
import ForgeAxios from "../../modules/axios.module";
import { useAuthStore } from "../../stores/auth.store";
import { getErrorMessage } from "../../modules/error.module";
import Button from "../../components/button/Button";
import InputHolder from "../../components/input/InputHolder";
import { FaSave } from "react-icons/fa";
import type { User } from "../../types/user.type";

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();

  const nameRef = useRef<HTMLInputElement>(null);
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const handleNameUpdate = async () => {
    const name = nameRef.current?.value?.trim();
    if (!name) {
      toast.warn("A név nem lehet üres!");
      return;
    }

    try {
      const res = await ForgeAxios({ method: "PUT", url: "/auth/profile", data: { name } });
      updateUser(res.data.user as User);
      toast.success("Név sikeresen módosítva!");
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
    }
  };

  const handlePasswordUpdate = async () => {
    const currentPassword = currentPasswordRef.current?.value;
    const newPassword = newPasswordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warn("Kérlek töltsd ki az összes jelszó mezőt!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.warn("Az új jelszavak nem egyeznek!");
      return;
    }

    try {
      const res = await ForgeAxios({
        method: "PUT",
        url: "/auth/profile",
        data: { currentPassword, newPassword },
      });
      updateUser(res.data.user as User);
      currentPasswordRef.current!.value = "";
      newPasswordRef.current!.value = "";
      confirmPasswordRef.current!.value = "";
      toast.success("Jelszó sikeresen módosítva!");
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
    }
  };

  const cardStyle: React.CSSProperties = {
    padding: "var(--content-padding)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--border-radius)",
    backgroundColor: "rgba(0,0,0,0.15)",
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    marginBottom: "var(--content-padding)",
  };

  return (
    <div className="page">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--content-padding)", maxWidth: "480px", margin: "0 auto" }}>
        <div style={cardStyle}>
          <p style={sectionTitleStyle}>Névmódosítás</p>
          <InputHolder text="Teljes név">
            <input type="text" ref={nameRef} defaultValue={user?.name} />
          </InputHolder>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--input-padding)" }}>
            <Button icon={<FaSave />} onClick={handleNameUpdate} style={{ width: "auto" }}>
              Mentés
            </Button>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={sectionTitleStyle}>Jelszóváltoztatás</p>
          <InputHolder text="Jelenlegi jelszó">
            <input type="password" ref={currentPasswordRef} placeholder="••••••••" />
          </InputHolder>
          <InputHolder text="Új jelszó">
            <input type="password" ref={newPasswordRef} placeholder="••••••••" />
          </InputHolder>
          <InputHolder text="Új jelszó megerősítése">
            <input type="password" ref={confirmPasswordRef} placeholder="••••••••" />
          </InputHolder>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--input-padding)" }}>
            <Button icon={<FaSave />} onClick={handlePasswordUpdate} style={{ width: "auto" }}>
              Mentés
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
