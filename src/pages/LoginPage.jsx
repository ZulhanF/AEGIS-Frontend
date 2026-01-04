import React from "react";
import LoginInput from "@/components/LoginInput";

function LoginPage({ login, isLoading }) {
  return (
    <div className="auth-page">
      <LoginInput login={login} isLoading={isLoading} />
    </div>
  );
}

export default LoginPage;
