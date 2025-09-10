import * as React from "react";
import { Link, Navigate } from "react-router-dom";
import { LogOut, User, Home, Heart, Info } from "lucide-react";

const Navbar = () => {
  const [user, setUser] = React.useState(null);
  const [didLogout, setDidLogout] = React.useState(false);

  React.useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setDidLogout(true);
  };

  return (
    didLogout ? <Navigate to="/" replace /> : (
    <nav className="bg-white shadow-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">
              MealBridge
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {user && (
              <Link 
                to={user.role === 'donor' ? "/donor-dashboard" : "/receiver-dashboard"}
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors duration-300"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}
            {user && user.role !== 'donor' && (
              <Link 
                to="/pickup"
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors duration-300"
              >
                <Heart className="h-4 w-4" />
                <span>Self-Pickup</span>
              </Link>
            )}
            <Link 
              to="/profile"
              className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors duration-300"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.name}
                </span>
                <button 
                  onClick={handleLogout} 
                  className="border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login"
                  className="hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
    )
  );
};

export default Navbar;