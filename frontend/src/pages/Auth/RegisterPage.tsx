import { useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { MyAxiosError } from "../../modules/axios.module";
import { getErrorMessage } from "../../modules/error.module";
import ForgeAxios from "../../modules/axios.module";
import { FaShieldHalved } from "react-icons/fa6";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import Button from "../../components/button/Button";

const RegisterPage = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleRegister = async () => {
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!name || !email || !password) {
      toast.warn("Kérjük, töltse ki az összes mezőt!");
      return;
    }

    try {
      const res = await ForgeAxios({ method: "POST", url: "/auth/register", data: { name, email, password } });
      toast.success(res.data.message || "Sikeres regisztráció! Most már bejelentkezhetsz.");
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
      console.log((error as MyAxiosError).response?.data.message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <FaShieldHalved />
          </div>
          <h1 className="auth-brand-name">TestForge</h1>
        </div>

        <h2 className="auth-title">Fiók létrehozása</h2>
        <p className="auth-subtitle">Regisztrálj az első lépéshez.</p>

        <div className="auth-fields">
          <div className="auth-field">
            <label className="auth-label">Teljes név</label>
            <div className="auth-input-wrap">
              <MdPerson className="auth-input-icon" />
              <input
                type="text"
                ref={nameRef}
                placeholder="Kovács János"
                onKeyDown={handleKeyDown}
                className="auth-input"
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Email cím</label>
            <div className="auth-input-wrap">
              <MdEmail className="auth-input-icon" />
              <input
                type="email"
                ref={emailRef}
                placeholder="pelda@email.com"
                onKeyDown={handleKeyDown}
                className="auth-input"
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Jelszó</label>
            <div className="auth-input-wrap">
              <MdLock className="auth-input-icon" />
              <input
                type="password"
                ref={passwordRef}
                placeholder="••••••••"
                onKeyDown={handleKeyDown}
                className="auth-input"
              />
            </div>
          </div>
        </div>

        <Button onClick={handleRegister}>
          Regisztráció
        </Button>

        <p className="auth-switch">
          Már van fiókod?{" "}
          <Link to="/auth/login" className="auth-link">
            Bejelentkezés
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
