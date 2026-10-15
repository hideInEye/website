import { AuthForm } from "@/features/auth";
export default function RegisterPage() {
  return (
    <div className="flex justify-center">
      <AuthForm mode="register" />
    </div>
  );
}
