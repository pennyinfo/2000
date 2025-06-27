
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminUser {
  id: string;
  username: string;
  role: "super" | "local" | "user";
  is_active: boolean;
}

export const useAdminAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session in localStorage
    const storedAdmin = localStorage.getItem('adminSession');
    if (storedAdmin) {
      try {
        const admin = JSON.parse(storedAdmin);
        setCurrentAdmin(admin);
        setIsLoggedIn(true);
      } catch (error) {
        localStorage.removeItem('adminSession');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // For demo purposes, we'll use simple password checking
      // In production, you should hash passwords properly
      const { data: adminUsers, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .single();

      if (error || !adminUsers) {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
        return false;
      }

      // Simple password check (in production, use proper hashing)
      let validPassword = false;
      if (username === 'evaadmin' && password === 'elife919123') validPassword = true;
      else if (username === 'admin' && password === 'elifesociety90094') validPassword = true;
      else if (username === 'useradmin' && password === 'admin9094') validPassword = true;

      if (!validPassword) {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
        return false;
      }

      const adminSession = {
        id: adminUsers.id,
        username: adminUsers.username,
        role: adminUsers.role as "super" | "local" | "user",
        is_active: adminUsers.is_active
      };

      setCurrentAdmin(adminSession);
      setIsLoggedIn(true);
      localStorage.setItem('adminSession', JSON.stringify(adminSession));

      toast({
        title: "Login Successful",
        description: `Welcome ${adminSession.role} admin!`,
      });

      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setCurrentAdmin(null);
    setIsLoggedIn(false);
    localStorage.removeItem('adminSession');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  return {
    isLoggedIn,
    currentAdmin,
    isLoading,
    login,
    logout
  };
};
