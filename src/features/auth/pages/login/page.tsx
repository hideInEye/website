import { useSearchParams } from "react-router-dom";
import { AuthForm } from "@/features/auth";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next");
  const nextPath =
    next?.startsWith("/") && !next.startsWith("//") && !next.includes("\\") ? next : "/account";
  return (
    <div className="flex justify-center">
      <AuthForm mode="login" nextPath={nextPath} />
    </div>
  );
}
