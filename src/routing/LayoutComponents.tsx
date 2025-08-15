// Navigation Layout Components for New Routing Structure
// Provides consistent navigation across different route types

import React from 'react';
import { Outlet, Link } from 'react-router-dom';

// Public Layout (for landing, about, pricing, etc.)
export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Public Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Ruwād</h1>
            <nav className="hidden md:flex space-x-6">
              <Link to="/about" className="text-sm hover:text-primary">About</Link>
              <Link to="/campaigns" className="text-sm hover:text-primary">Campaigns</Link>
              <Link to="/challenges" className="text-sm hover:text-primary">Challenges</Link>
              <Link to="/events" className="text-sm hover:text-primary">Events</Link>
              <Link to="/marketplace" className="text-sm hover:text-primary">Marketplace</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/pricing" className="text-sm hover:text-primary">Pricing</Link>
            <Link to="/auth" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </header>
      
      {/* Public Content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Public Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Ruwād Platform</h3>
              <p className="text-sm text-muted-foreground">
                Empowering innovation across Saudi Arabia's government ministries.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Discover</h4>
              <div className="space-y-2 text-sm">
                <Link to="/campaigns" className="block hover:text-primary">Campaigns</Link>
                <Link to="/challenges" className="block hover:text-primary">Challenges</Link>
                <Link to="/events" className="block hover:text-primary">Events</Link>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">Platform</h4>
              <div className="space-y-2 text-sm">
                <Link to="/pricing" className="block hover:text-primary">Pricing</Link>
                <Link to="/about" className="block hover:text-primary">About</Link>
                <Link to="/help" className="block hover:text-primary">Help</Link>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">Connect</h4>
              <div className="space-y-2 text-sm">
                <Link to="/auth" className="block hover:text-primary">Sign In</Link>
                <Link to="/auth" className="block hover:text-primary">Register</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Authenticated Layout (for dashboard, profile, etc.)
export const AuthenticatedLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Will use existing AppShell for authenticated routes */}
      <Outlet />
    </div>
  );
};

// Workspace Layout (for user/expert/org/admin workspaces)
export const WorkspaceLayout: React.FC<{ workspaceType: string; children: React.ReactNode }> = ({ workspaceType, children }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Workspace-specific header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">
              {workspaceType === 'user' && 'My Workspace'}
              {workspaceType === 'expert' && 'Expert Workspace'}
              {workspaceType === 'org' && 'Organization Workspace'}
              {workspaceType === 'admin' && 'Admin Workspace'}
            </h1>
          </div>
          
          {/* Workspace navigation */}
          <nav className="flex space-x-6">
            {workspaceType === 'user' && (
              <>
                <Link to="/dashboard" className="text-sm hover:text-primary">Dashboard</Link>
                <Link to="/ideas" className="text-sm hover:text-primary">My Ideas</Link>
                <Link to="/saved" className="text-sm hover:text-primary">Saved</Link>
              </>
            )}
            {workspaceType === 'expert' && (
              <>
                <Link to="/expert-dashboard" className="text-sm hover:text-primary">Dashboard</Link>
                <Link to="/evaluations" className="text-sm hover:text-primary">Evaluations</Link>
                <Link to="/challenges" className="text-sm hover:text-primary">Assigned Challenges</Link>
              </>
            )}
            {workspaceType === 'admin' && (
              <>
                <Link to="/admin/dashboard" className="text-sm hover:text-primary">Dashboard</Link>
                <Link to="/admin/challenges" className="text-sm hover:text-primary">Challenges</Link>
                <Link to="/admin/users" className="text-sm hover:text-primary">Users</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

// Subscription Layout (for billing, plans, etc.)
export const SubscriptionLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">Subscription Management</h1>
          <nav className="flex space-x-6">
            <Link to="/settings/subscription" className="text-sm hover:text-primary">My Plan</Link>
            <Link to="/billing" className="text-sm hover:text-primary">Billing</Link>
            <Link to="/pricing" className="text-sm hover:text-primary">Upgrade</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};