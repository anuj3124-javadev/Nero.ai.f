import React from 'react';

// Mock Provider bypasses the need for any keys
export const ClerkProvider = ({ children }) => <>{children}</>;

// Mock Hooks
export const useAuth = () => ({
  getToken: async () => "mock_token",
  isLoaded: true,
  isSignedIn: true,
});

export const useUser = () => ({
  user: {
    id: "local_dev_user_123",
    fullName: "Local Developer",
    imageUrl: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
  },
  isLoaded: true,
  isSignedIn: true,
});

export const useClerk = () => ({
  openUserProfile: () => alert("User profile is mocked locally"),
  signOut: () => alert("Sign out mocked locally"),
});

// Mock Components
export const SignInButton = ({ children }) => <div onClick={() => console.log('Mock Sign In')}>{children || <button>Sign In</button>}</div>;
export const SignUpButton = ({ children }) => <div onClick={() => console.log('Mock Sign Up')}>{children || <button>Sign Up</button>}</div>;
export const UserButton = () => <div title="Mock User" style={{width: 32, height: 32, background: '#ccc', borderRadius: '50%'}}></div>;
export const Protect = ({ children }) => <>{children}</>;

// Prevent import errors from remaining unused imports in your codebase
export const PricingTable = () => <div>Pricing is Free!</div>;
export const SignIn = () => <div>Sign In logic is fully bypassed.</div>;
