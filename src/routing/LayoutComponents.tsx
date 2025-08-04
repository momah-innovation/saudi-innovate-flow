// Navigation Layout Components for New Routing Structure
// Provides consistent navigation across different route types

import React from 'react';
import { Outlet } from 'react-router-dom';

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
              <a href="/about" className="text-sm hover:text-primary">About</a>
              <a href="/campaigns" className="text-sm hover:text-primary">Campaigns</a>
              <a href="/challenges" className="text-sm hover:text-primary">Challenges</a>
              <a href="/events" className="text-sm hover:text-primary">Events</a>
              <a href="/marketplace" className="text-sm hover:text-primary">Marketplace</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/pricing" className="text-sm hover:text-primary">Pricing</a>
            <a href="/auth" className="btn btn-primary">Get Started</a>
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
                <a href="/campaigns" className="block hover:text-primary">Campaigns</a>
                <a href="/challenges" className="block hover:text-primary">Challenges</a>
                <a href="/events" className="block hover:text-primary">Events</a>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">Platform</h4>
              <div className="space-y-2 text-sm">
                <a href="/pricing" className="block hover:text-primary">Pricing</a>
                <a href="/about" className="block hover:text-primary">About</a>
                <a href="/help" className="block hover:text-primary">Help</a>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">Connect</h4>
              <div className="space-y-2 text-sm">
                <a href="/auth" className="block hover:text-primary">Sign In</a>
                <a href="/auth" className="block hover:text-primary">Register</a>
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
                <a href="/dashboard" className="text-sm hover:text-primary">Dashboard</a>
                <a href="/ideas" className="text-sm hover:text-primary">My Ideas</a>
                <a href="/saved" className="text-sm hover:text-primary">Saved</a>
              </>
            )}
            {workspaceType === 'expert' && (
              <>
                <a href="/expert-dashboard" className="text-sm hover:text-primary">Dashboard</a>
                <a href="/evaluations" className="text-sm hover:text-primary">Evaluations</a>
                <a href="/challenges" className="text-sm hover:text-primary">Assigned Challenges</a>
              </>
            )}
            {workspaceType === 'admin' && (
              <>
                <a href="/admin/dashboard" className="text-sm hover:text-primary">Dashboard</a>
                <a href="/admin/challenges" className="text-sm hover:text-primary">Challenges</a>
                <a href="/admin/users" className="text-sm hover:text-primary">Users</a>
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
            <a href="/settings/subscription" className="text-sm hover:text-primary">My Plan</a>
            <a href="/billing" className="text-sm hover:text-primary">Billing</a>
            <a href="/pricing" className="text-sm hover:text-primary">Upgrade</a>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};