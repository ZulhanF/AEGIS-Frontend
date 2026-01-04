import RegisterInput from "@/components/RegisterInput";

function RegisterPage({ register }) {
  return (
    <div className="auth-page">
      <RegisterInput register={register} />
    </div>
  );
}

export default RegisterPage;
