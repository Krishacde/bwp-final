import React from "react";
import { Routes, Route } from "react-router-dom";

/* Government Pages */
import GovernmentDashboard from "../pages/government/Dashboard";
import CreateChallenge from "../pages/government/CreateChallenge";
import ChallengeDetails from "../pages/government/ChallengeDetails";
import FinalDecision from "../pages/government/FinalDecision";

/* Startup Pages */
import StartupDashboard from "../pages/startup/Dashboard";
import BrowseChallenges from "../pages/startup/BrowseChallenges";
import ApplyChallenge from "../pages/startup/ApplyChallenge";
import StartupProfile from "../pages/startup/StartupProfile";
import Milestones from "../pages/startup/Milestones";

/* Evaluator Pages */
import EvaluatorDashboard from "../pages/evaluator/Dashboard";
import ScoreApplications from "../pages/evaluator/ScoreApplications";
import Shortlist from "../pages/evaluator/Shortlist";
import VerifyMilestones from "../pages/evaluator/VerifyMilestones";

/* Admin Pages */
import AdminDashboard from "../pages/admin/Dashboard";
import UserManagement from "../pages/admin/UserManagement";
import ChallengeManagement from "../pages/admin/ChallengeManagement";
import Reports from "../pages/admin/Reports";
import Settings from "../pages/admin/Settings";

/* Public View Portal Page */
import PublicChallengeView from "../pages/public/PublicChallengeView";

// Auth & Fallback
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ResetPassword from "../pages/auth/ResetPassword";
import ForgotPassword from "../pages/auth/ForgotPassword";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";

const protectedPage = (roles, page) => <ProtectedRoute roles={roles}>{page}</ProtectedRoute>;

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Government Routes */}
      <Route path="/government/dashboard" element={protectedPage(["government"], <GovernmentDashboard />)} />
      <Route path="/government/create-challenge" element={protectedPage(["government"], <CreateChallenge />)} />
      <Route path="/government/challenge-details" element={protectedPage(["government"], <ChallengeDetails />)} />
      <Route path="/government/final-decision" element={protectedPage(["government"], <FinalDecision />)} />

      {/* Startup Routes */}
      <Route path="/startup/dashboard" element={protectedPage(["startup"], <StartupDashboard />)} />
      <Route path="/startup/challenges" element={protectedPage(["startup"], <BrowseChallenges />)} />
      <Route path="/startup/apply" element={protectedPage(["startup"], <ApplyChallenge />)} />
      <Route path="/startup/profile" element={protectedPage(["startup"], <StartupProfile />)} />
      <Route path="/startup/milestones" element={protectedPage(["startup"], <Milestones />)} />

      {/* Evaluator Routes */}
      <Route path="/evaluator/dashboard" element={protectedPage(["evaluator"], <EvaluatorDashboard />)} />
      <Route path="/evaluator/score" element={protectedPage(["evaluator"], <ScoreApplications />)} />
      <Route path="/evaluator/shortlist" element={protectedPage(["evaluator"], <Shortlist />)} />
      <Route path="/evaluator/verify" element={protectedPage(["evaluator"], <VerifyMilestones />)} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={protectedPage(["admin"], <AdminDashboard />)} />
      <Route path="/admin/users" element={protectedPage(["admin"], <UserManagement />)} />
      <Route path="/admin/challenges" element={protectedPage(["admin"], <ChallengeManagement />)} />
      <Route path="/admin/reports" element={protectedPage(["admin"], <Reports />)} />
      <Route path="/admin/settings" element={protectedPage(["admin"], <Settings />)} />

      {/* Public View Portal Routes */}
      <Route path="/public/challenges" element={<PublicChallengeView />} />
      <Route path="/public/challenges/:id" element={<PublicChallengeView />} />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
