import React from "react";
import { useAuthStore } from "../stores/auth.store";

type Props = {
  auth?: boolean;
  error?: boolean;
  children?: React.ReactNode;
};

const Protection: React.FC<Props> = ({ auth, error = false, children }) => {
  const { isAuth } = useAuthStore();

  if (auth && !isAuth) {
    if (!error) return null;

    return <div>You must be logged in to view this content.</div>;
  }

  return children;
};

export default Protection;
