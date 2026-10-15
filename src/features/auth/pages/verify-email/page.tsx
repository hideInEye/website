import { useSearchParams } from "react-router-dom";
import { EmailVerification } from "@/features/auth";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? undefined;
  return <EmailVerification token={token} />;
}
