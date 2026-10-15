import { useSearchParams } from "react-router-dom";
import { AuthForm } from "@/features/auth";
export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? undefined;
  return (
    <div className="flex justify-center">
      <AuthForm mode="reset" token={token} />
    </div>
  );
}
