import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { ToastProvider } from './components/ToastContext.jsx';
import { PageTransition } from './components/PageTransition.jsx';

const LandingPage = lazy(() => import('./pages/LandingPage.jsx').then((m) => ({ default: m.LandingPage })));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage.jsx').then((m) => ({ default: m.TemplatesPage })));
const CustomizePage = lazy(() => import('./pages/CustomizePage.jsx').then((m) => ({ default: m.CustomizePage })));
const PreviewPage = lazy(() => import('./pages/PreviewPage.jsx').then((m) => ({ default: m.PreviewPage })));
const GeneratedSitePage = lazy(() => import('./pages/GeneratedSitePage.jsx').then((m) => ({ default: m.GeneratedSitePage })));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx').then((m) => ({ default: m.AboutPage })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx').then((m) => ({ default: m.AdminDashboard })));
const SignupPage = lazy(() => import('./pages/SignupPage.jsx').then((m) => ({ default: m.SignupPage })));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx').then((m) => ({ default: m.LoginPage })));
const UserDashboard = lazy(() => import('./pages/UserDashboard.jsx').then((m) => ({ default: m.UserDashboard })));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage.jsx').then((m) => ({ default: m.AdminLoginPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage.jsx').then((m) => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage.jsx').then((m) => ({ default: m.ResetPasswordPage })));
const AccountPage = lazy(() => import('./pages/AccountPage.jsx').then((m) => ({ default: m.AccountPage })));

export default function App() {
  return (
    <ToastProvider>
      <Layout>
        <Suspense
          fallback={
            <div className="section mt-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500" />
            </div>
          }
        >
          <Routes>
          <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
          <Route path="/templates" element={<PageTransition><TemplatesPage /></PageTransition>} />
          <Route path="/create" element={<PageTransition><TemplatesPage /></PageTransition>} />
          <Route
            path="/customize/:templateId"
            element={<PageTransition><CustomizePage /></PageTransition>}
          />
          <Route path="/preview" element={<PageTransition><PreviewPage /></PageTransition>} />
          <Route path="/site/:slug" element={<PageTransition><GeneratedSitePage /></PageTransition>} />
          <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />

          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Layout>
  </ToastProvider>
  );
}

