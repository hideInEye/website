export { logout, submitAuth, verifyEmail } from "./api";
export type { AuthMode, IAuthSubmission } from "./api";
export { AuthForm } from "./components/auth-form";
export { EmailVerification } from "./components/email-verification";
export const authPages = {
  login: () => import("./pages/login/page").then((module) => ({ Component: module.default })),
  register: () => import("./pages/register/page").then((module) => ({ Component: module.default })),
  forgotPassword: () =>
    import("./pages/forgot-password/page").then((module) => ({ Component: module.default })),
  resetPassword: () =>
    import("./pages/reset-password/page").then((module) => ({ Component: module.default })),
  verifyEmail: () =>
    import("./pages/verify-email/page").then((module) => ({ Component: module.default }))
};
