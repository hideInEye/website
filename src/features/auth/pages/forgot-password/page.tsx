import { AuthForm } from "@/features/auth";
export default function ForgotPasswordPage() {
  return (
    <div className="flex justify-center">
      <AuthForm mode="forgot" />
    </div>
  );
}
