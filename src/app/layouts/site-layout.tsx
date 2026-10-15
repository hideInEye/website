import { Outlet } from "react-router-dom";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function SiteLayout() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </div>
  );
}
