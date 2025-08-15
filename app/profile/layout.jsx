// app/profile/layout.jsx

// This is a Server Component, so it can export metadata.
export const metadata = {
  title: 'User Profile | HomeLend',
  description: "Manage and update your personal profile information.",
};

export default function ProfileLayout({ children }) {
  return <>{children}</>;
}
