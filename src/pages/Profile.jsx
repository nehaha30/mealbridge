import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Mail, UserCheck, Gift, Heart, Edit } from "lucide-react";
import Navbar from "@/components/Navbar";


const Profile = () => {
  
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser({
        ...parsedUser,
        joinDate: "January 2024",
        stats: parsedUser.role === "donor" 
          ? { donations: 15, mealsShared: 84, impactScore: 92 }
          : { pickups: 8, mealsShared: 23, impactScore: 76 }
      });
    }
    
    // Mock activity data
    setActivities([
      {
        id: "1",
        type: "donation",
        description: "Donated fresh pasta & sauce (5 portions)",
        date: "2 hours ago",
        status: "completed"
      },
      {
        id: "2",
        type: "pickup",
        description: "Picked up vegetables from Green Garden Cafe",
        date: "1 day ago",
        status: "completed"
      },
      {
        id: "3",
        type: "donation",
        description: "Donated bread & pastries (8 items)",
        date: "3 days ago",
        status: "completed"
      }
    ]);
  }, []);

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role) => {
    return role === "donor" ? "bg-primary" : "bg-secondary";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Your Profile</h1>
            <p className="text-muted-foreground">Please login to view your profile and activity.</p>
            <div className="space-x-4">
              <Link 
                to="/login"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="border border-border shadow-card rounded-lg p-6">
            <div className="text-center pb-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-24 w-24 rounded-full flex items-center justify-center">
                  <div className={`h-24 w-24 rounded-full flex items-center justify-center text-2xl font-bold text-white ${getRoleColor(user.role)}`}>
                    {getInitials(user.name)}
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-foreground">{user.name || user.email || 'User'}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex flex-col items-center space-y-1">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground capitalize">
                      {user.role}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {user.role === 'donor' ? 'Food Donor - Sharing surplus meals with the community' : 'Food Receiver - Helping distribute meals to those in need'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;