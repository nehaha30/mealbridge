import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "receiver"
  });
  const [error, setError] = useState("");

  // Pre-configured demo users
  const demoUsers = {
    donors: [
      { name: "Mario's Italian Restaurant", email: "mario@restaurant.com", password: "demo123", role: "donor" },
      { name: "Green Garden Cafe", email: "info@greengarden.com", password: "demo123", role: "donor" },
      { name: "Sunrise Bakery", email: "hello@sunrisebakery.com", password: "demo123", role: "donor" }
    ],
    receivers: [
      { name: "Community Food Bank", email: "contact@foodbank.org", password: "demo123", role: "receiver" },
      { name: "Local NGO Helper", email: "help@localngo.org", password: "demo123", role: "receiver" },
      { name: "John Smith", email: "john.smith@email.com", password: "demo123", role: "receiver" }
    ]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Check if email already exists
    const existingUser = localStorage.getItem('user');
    if (existingUser) {
      const user = JSON.parse(existingUser);
      if (user.email === formData.email) {
        setError("Email already registered");
        return;
      }
    }

    // Save user
    const userData = {
      name: formData.name,
      email: formData.email,
      role: formData.role
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Redirect based on role
    // After register, user can click through to dashboards
  };

  const handleDemoLogin = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">
            Join MealBridge
          </h2>
          <p className="mt-2 text-muted-foreground">Create your account or try demo accounts</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Registration Form */}
          <div className="border border-border shadow-card rounded-lg p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground">Create Account</h3>
            </div>
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                    minLength={6}
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                    minLength={6}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">I want to:</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="receiver"
                        name="role"
                        value="receiver"
                        checked={formData.role === "receiver"}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="h-4 w-4 text-primary focus:ring-primary border-input"
                      />
                      <label htmlFor="receiver" className="text-sm font-medium text-foreground">Receive food donations</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="donor"
                        name="role"
                        value="donor"
                        checked={formData.role === "donor"}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="h-4 w-4 text-primary focus:ring-primary border-input"
                      />
                      <label htmlFor="donor" className="text-sm font-medium text-foreground">Donate excess food</label>
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="text-destructive text-sm">{error}</div>
                )}
                
                <button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  Create Account
                </button>
              </form>
              
              <div className="mt-4 text-center">
                <span className="text-sm text-muted-foreground">Already have an account? </span>
                <Link to="/login" className="text-primary hover:underline text-sm font-medium">
                  Login
                </Link>
              </div>
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="space-y-6">
            <div className="border border-border shadow-card rounded-lg p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-primary">Demo Donor Accounts</h3>
                <p className="text-sm text-muted-foreground mt-1">Try the platform as a food donor</p>
              </div>
              <div className="space-y-3">
                {demoUsers.donors.map((user, index) => (
                  <Link
                    key={index}
                    to="/donor-dashboard"
                    onClick={() => handleDemoLogin(user)}
                    className="block w-full text-left border border-input hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border border-border shadow-card rounded-lg p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-secondary">Demo Receiver Accounts</h3>
                <p className="text-sm text-muted-foreground mt-1">Try the platform as a food receiver</p>
              </div>
              <div className="space-y-3">
                {demoUsers.receivers.map((user, index) => (
                  <Link
                    key={index}
                    to="/receiver-dashboard"
                    onClick={() => handleDemoLogin(user)}
                    className="block w-full text-left border border-input hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;