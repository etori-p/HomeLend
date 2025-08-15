// app/forgotpassword/layout.jsx

// This is a Server Component, so it can export metadata.
export const metadata = {
  title: 'Forgot Password | HomeLend',
  description: "Request a password reset link for your HomeLend account.",
};

export default function ForgotPasswordLayout({ children }) {
  return <>{children}</>;
}
