import { useRef } from "react";
import InputHolder from "../../components/input/InputHolder";
import Button from "../../components/button/Button";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { MyAxiosError } from "../../modules/axios.module";
import { getErrorMessage } from "../../modules/error.module";
import ForgeAxios from "../../modules/axios.module";

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
      const res = await ForgeAxios({
        method: "POST",
        url: "/auth/register",
        data: {
          name,
          email,
          password,
        },
      });

      toast.success(
        res.data.message || "Sikeres regisztráció! Most már bejelentkezhetsz.",
      );
    } catch (error) {
      toast.error(getErrorMessage(error as Error));
      console.log((error as MyAxiosError).response?.data.message);
    }
  };

  return (
    <main className="page">
      <InputHolder text="Név">
        <input type="text" ref={nameRef} />
      </InputHolder>
      <InputHolder text="Email">
        <input type="email" ref={emailRef} />
      </InputHolder>
      <InputHolder text="Jelszó">
        <input type="password" ref={passwordRef} />
      </InputHolder>

      <Button icon onClick={handleRegister}>
        Regisztráció
      </Button>
      <Link to="/auth/login">Bejelentkezés</Link>
    </main>
  );
};

export default RegisterPage;
