import React from "react";
import { useAuthStore } from "../stores/auth.store";
import { AuthError } from "../modules/error.module";

type Props = {
  auth?: boolean;
  error?: boolean;
  children?: React.ReactNode;
};

const Protection: React.FC<Props> = ({ auth, error = false, children }) => {
  const { isAuth } = useAuthStore();

  if (auth && !isAuth) {
    if (!error) return null;

    throw new AuthError(
      "Jelentkezzen be az oldal tartalmának megtekintéséhez."
    );
  }

  return children;
};

export default Protection;
