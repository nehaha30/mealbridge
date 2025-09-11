import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "receiver"
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    console.log("Form submitted:", formData);
  
    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      console.log("Error: Passwords don't match");
      return;
    }
  
    // Check password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      console.log("Error: Password too short");
      return;
    }
  
    // Prepare data to send to backend
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password, // send password too
      role: formData.role
    };
  
    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });
  
      const data = await response.json();
      console.log("Backend response:", data);
  
      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }
  
      // Success
      console.log("Registration complete for:", userData.name);
      alert("Registration successful. Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Error sending data to backend:", err);
      setError("Server error. Please try again.");
    }
  };

  

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">Join MealBridge</h2>
          <p className="mt-2 text-muted-foreground">Create your account</p>
        </div>

        <div>
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

          
        </div>
      </div>
    </div>
  );
};

export default Register;