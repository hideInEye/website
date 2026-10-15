export { AccountDashboard } from "./components/account-dashboard";
export * as userLoaders from "./loaders";
export const userPages = {
  account: () => import("./pages/account/page").then((module) => ({ Component: module.default })),
  profile: () => import("./pages/profile/page").then((module) => ({ Component: module.default }))
};
export type {
  IAccountOverview,
  IMyComment,
  IPrivateProfile,
  IProfileMutation,
  IPublicProfile,
  IUserCommentSummary
} from "./types";
