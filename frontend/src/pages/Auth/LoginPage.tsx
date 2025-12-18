import { useRef } from "react";
import Button from "../../components/button/Button";
import InputHolder from "../../components/input/InputHolder";
import ForgeAxios from "../../modules/axios.module";
import { useAuthStore } from "../../stores/auth.store";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const { login, isAuth } = useAuthStore();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleLogin = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    console.log("Logging in with", { email, password });

    if (!email || !password) {
      console.log("Kérlek töltsd ki az összes mezőt!");
      return;
    }

    try {
      const res = await ForgeAxios({
        method: "POST",
        url: "/auth/login",
        data: {
          email,
          password,
        },
      });

      console.log("Login successful:", res.data);
      login(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  if (isAuth) return <Navigate to="/" />;

  return (
    <main className="page">
      <InputHolder text="Email">
        <input type="email" ref={emailRef} defaultValue={"test@tf.com"} />
      </InputHolder>
      <InputHolder text="Jelszó">
        <input type="password" ref={passwordRef} defaultValue={"test1234"} />
      </InputHolder>

      <Button icon onClick={handleLogin}>
        Bejelentkezés
      </Button>
    </main>
  );
};

export default LoginPage;
