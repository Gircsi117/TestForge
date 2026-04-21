import { useRef } from "react";
import ForgeAxios, { type MyAxiosError } from "../../modules/axios.module";
import { useAuthStore } from "../../stores/auth.store";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../modules/error.module";
import { FaShieldHalved } from "react-icons/fa6";
import { MdEmail, MdLock } from "react-icons/md";
import Button from "../../components/button/Button";

const LoginPage = () => {
  const { login, isAuth } = useAuthStore();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleLogin = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      toast.warn("Kérlek töltsd ki az összes mezőt!");
      return;
    }

    try {
      const res = await ForgeAxios({ method: "POST", url: "/auth/login", data: { email, password } });
      login(res.data.user);
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
      console.log((error as MyAxiosError).response?.data.message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  if (isAuth) return <Navigate to="/" />;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <FaShieldHalved />
          </div>
          <h1 className="auth-brand-name">TestForge</h1>
        </div>

        <h2 className="auth-title">Bejelentkezés</h2>
        <p className="auth-subtitle">Üdvözlünk vissza!</p>

        <div className="auth-fields">
          <div className="auth-field">
            <label className="auth-label">Email cím</label>
            <div className="auth-input-wrap">
              <MdEmail className="auth-input-icon" />
              <input
                type="email"
                ref={emailRef}
                defaultValue="test@tf.com"
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
                defaultValue="test1234"
                placeholder="••••••••"
                onKeyDown={handleKeyDown}
                className="auth-input"
              />
            </div>
          </div>
        </div>

        <Button onClick={handleLogin}>
          Bejelentkezés
        </Button>

        <p className="auth-switch">
          Még nincs fiókod?{" "}
          <Link to="/auth/register" className="auth-link">
            Regisztráció
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
