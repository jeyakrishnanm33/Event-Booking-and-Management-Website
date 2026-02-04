import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'user' | 'organizer';
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string, isOrganizer: boolean) => Promise<void>;
  registerUser: (userData: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  registerOrganizer: (organizerData: { businessName: string; email: string; phone: string; serviceType: string; password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const registerUser = async (userData: { name: string; email: string; phone: string; password: string }) => {
    setLoading(true);
    try {
      console.log('Sending registration data:', userData);
      
      const response = await fetch(`${API_URL}/auth/register/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Registration failed');
      }

      // Check if the response structure matches what we expect
      if (!responseData.data || !responseData.data.user) {
        console.error('Unexpected response structure:', responseData);
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', responseData.token);
      setCurrentUser(responseData.data.user);
      
      console.log('Registration successful! User set:', responseData.data.user);
      
      // Return success to indicate registration was successful
      return responseData;
      
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerOrganizer = async (organizerData: { businessName: string; email: string; phone: string; serviceType: string; password: string }) => {
    setLoading(true);
    try {
      console.log('Sending organizer registration data:', organizerData);
      
      const response = await fetch(`${API_URL}/auth/register/organizer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organizerData),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Registration failed');
      }

      if (!responseData.data || !responseData.data.user) {
        console.error('Unexpected response structure:', responseData);
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', responseData.token);
      setCurrentUser(responseData.data.user);
      
      console.log('Organizer registration successful! User set:', responseData.data.user);
      
      return responseData;
      
    } catch (error) {
      console.error('Organizer registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, isOrganizer: boolean) => {
    setLoading(true);
    try {
      console.log('Sending login data:', { email, isOrganizer });
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, isOrganizer }),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Login failed');
      }

      if (!responseData.data || !responseData.data.user) {
        console.error('Unexpected response structure:', responseData);
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', responseData.token);
      setCurrentUser(responseData.data.user);
      
      console.log('Login successful! User set:', responseData.data.user);
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token found in localStorage:', token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      registerUser, 
      registerOrganizer, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};