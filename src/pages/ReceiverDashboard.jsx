import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, X, AlertCircle, User } from "lucide-react";
import Navbar from "@/components/Navbar";


const ReceiverDashboard = () => {
  const [user, setUser] = useState(null);
  const [availableFood, setAvailableFood] = useState([]);
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    loadAvailableFood();
    loadMyRequests();

    // Listen for cancel events
    const handlePickupCancelled = (event) => {
      loadAvailableFood();
      loadMyRequests();
    };

    window.addEventListener('pickupCancelled', handlePickupCancelled);
    
    return () => {
      window.removeEventListener('pickupCancelled', handlePickupCancelled);
    };
  }, []);

  const loadAvailableFood = () => {
    const allPosts = JSON.parse(localStorage.getItem('foodPosts') || '[]');
    const available = allPosts.filter((post) => post.status === "available");
    setAvailableFood(available);
  };

  const loadMyRequests = () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.email) return;

    const allRequests = JSON.parse(localStorage.getItem('pickupRequests') || '[]');
    const userRequests = allRequests.filter((request) => 
      request.requestedBy === userData.email
    );
    setMyRequests(userRequests);
  };

  const getExpiryStatus = (hours) => {
    const hoursNum = parseInt(hours);
    if (hoursNum <= 2) return { color: "text-destructive", label: "Urgent", icon: AlertCircle };
    if (hoursNum <= 4) return { color: "text-orange-600", label: "Soon", icon: Clock };
    return { color: "text-primary", label: "Fresh", icon: Clock };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "requested":
        return "bg-primary-light text-primary-dark";
      case "approved":
        return "bg-secondary-light text-secondary-dark";
      case "completed":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleConfirmPickup = (postId) => {
    if (!user?.email) return;
    
    const post = availableFood.find(p => p.id === postId);
    if (!post) return;

    // Create pickup request
    const pickupRequest = {
      id: Date.now().toString(),
      foodTitle: post.foodName,
      donorName: post.donorName,
      pickupLocation: post.pickupLocation,
      requestStatus: "requested",
      requestedBy: user.email,
      requestedAt: "Just now"
    };
    
    // Get existing requests and add new one
    const existingRequests = JSON.parse(localStorage.getItem('pickupRequests') || '[]');
    localStorage.setItem('pickupRequests', JSON.stringify([pickupRequest, ...existingRequests]));
    
    // Update post status
    const allPosts = JSON.parse(localStorage.getItem('foodPosts') || '[]');
    const updatedPosts = allPosts.map((p) => 
      p.id === postId ? { ...p, status: "claimed" } : p
    );
    localStorage.setItem('foodPosts', JSON.stringify(updatedPosts));
    
    // Reload data
    loadAvailableFood();
    loadMyRequests();
  };

  const handleCancelRequest = (requestId) => {
    // Remove the request from localStorage
    const updatedRequests = myRequests.filter(request => request.id !== requestId);
    localStorage.setItem('pickupRequests', JSON.stringify(updatedRequests));
    setMyRequests(updatedRequests);
    
    // Find the corresponding food post and make it available again
    window.dispatchEvent(new CustomEvent('pickupCancelled', { detail: { requestId } }));
    
    // Reload available food
    loadAvailableFood();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Welcome to Receiver Dashboard</h1>
            <p className="text-muted-foreground">Please login to access available food donations.</p>
            <div className="space-x-4">
              <Link 
                to="/login"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Available Food Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                Available Food
              </h1>
              <p className="text-muted-foreground mt-2">Browse and request food donations from local donors</p>
            </div>

            {availableFood.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No food available right now</h3>
                <p className="text-muted-foreground">Check back later for new donations!</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availableFood.map((post) => {
                  const expiryStatus = getExpiryStatus(post.expiryHours);
                  const ExpiryIcon = expiryStatus.icon;
                  
                  return (
                    <div key={post.id} className="border border-border shadow-card hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-card rounded-lg p-4">
                      <div className="pb-4">
                        <div className="w-full h-48 bg-muted rounded-lg mb-4 flex items-center justify-center">
                          <img 
                            src={post.imageUrl} 
                            alt={post.foodName}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="hidden text-muted-foreground">
                            <span className="text-4xl">🍽️</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">{post.foodName}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{post.donorName}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-sm text-foreground">{post.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <ExpiryIcon className={`h-4 w-4 ${expiryStatus.color}`} />
                            <span className={`text-sm font-medium ${expiryStatus.color}`}>
                              {post.expiryHours}h - {expiryStatus.label}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-foreground bg-muted px-2 py-1 rounded-full">
                            {post.quantity}
                          </span>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{post.pickupLocation}</span>
                        </div>
                        
                        <button 
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          onClick={() => handleConfirmPickup(post.id)}
                        >
                          Request Pickup
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* My Pickup Requests Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">My Pickup Requests</h2>
              <p className="text-muted-foreground mt-1">Track your requested food pickups</p>
            </div>
            
            {myRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">You haven't made any pickup requests yet.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myRequests.map((request) => (
                  <div key={request.id} className="border border-border bg-card rounded-lg p-4">
                    <div className="pb-3">
                      <h3 className="text-lg font-semibold text-foreground">{request.foodTitle}</h3>
                      <p className="text-sm text-muted-foreground">By {request.donorName}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{request.pickupLocation}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Requested {request.requestedAt}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.requestStatus)}`}>
                          {request.requestStatus.charAt(0).toUpperCase() + request.requestStatus.slice(1)}
                        </span>
                        {request.requestStatus === "requested" && (
                          <button
                            onClick={() => handleCancelRequest(request.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 px-2 py-1 rounded-md text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiverDashboard;