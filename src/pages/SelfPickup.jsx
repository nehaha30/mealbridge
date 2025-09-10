import { useState, useEffect } from "react";
import { Clock, MapPin, User, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";


const SelfPickup = () => {
  const [foodPosts, setFoodPosts] = useState([]);

  useEffect(() => {
    // Initialize food posts in localStorage if not exists
    const savedPosts = localStorage.getItem('foodPosts');
    if (savedPosts) {
      setFoodPosts(JSON.parse(savedPosts));
    } else {
      // Mock food posts for pickup
      const initialPosts = [
        {
          id: "1",
          foodName: "Fresh Pasta & Sauce",
          quantity: "5 portions",
          expiryHours: "4",
          pickupLocation: "123 Main St, Downtown",
          description: "Delicious homemade pasta with marinara sauce",
          imageUrl: "/placeholder.svg",
          donorName: "Mario's Italian Restaurant",
          status: "available",
          postedAt: "2 hours ago"
        },
        {
          id: "2",
          foodName: "Mixed Vegetables",
          quantity: "10 portions",
          expiryHours: "6",
          pickupLocation: "456 Oak Ave, Midtown",
          description: "Fresh mixed vegetables perfect for cooking",
          imageUrl: "/placeholder.svg",
          donorName: "Green Garden Cafe",
          status: "available",
          postedAt: "1 hour ago"
        },
        {
          id: "3",
          foodName: "Bread & Pastries",
          quantity: "8 items",
          expiryHours: "2",
          pickupLocation: "789 Elm St, Uptown",
          description: "Fresh baked bread and assorted pastries",
          imageUrl: "/placeholder.svg",
          donorName: "Sunrise Bakery",
          status: "available",
          postedAt: "30 minutes ago"
        },
        {
          id: "4",
          foodName: "Indian Curry Set",
          quantity: "12 portions",
          expiryHours: "8",
          pickupLocation: "321 Pine Rd, Eastside",
          description: "Authentic Indian curry with rice and naan",
          imageUrl: "/placeholder.svg",
          donorName: "Spice Palace",
          status: "available",
          postedAt: "45 minutes ago"
        }
      ];
      setFoodPosts(initialPosts);
      localStorage.setItem('foodPosts', JSON.stringify(initialPosts));
    }

    // Listen for cancel events from dashboard
    const handlePickupCancelled = (event) => {
      const pickupRequests = JSON.parse(localStorage.getItem('pickupRequests') || '[]');
      const cancelledRequest = pickupRequests.find((req) => req.id === event.detail.requestId);
      
      if (cancelledRequest) {
        // Find the food post that matches this request and make it available again
        const savedPosts = JSON.parse(localStorage.getItem('foodPosts') || '[]');
        const updatedPosts = savedPosts.map((post) => 
          post.foodName === cancelledRequest.foodTitle && 
          post.donorName === cancelledRequest.donorName
            ? { ...post, status: "available" }
            : post
        );
        localStorage.setItem('foodPosts', JSON.stringify(updatedPosts));
        setFoodPosts(updatedPosts);
      }
    };

    window.addEventListener('pickupCancelled', handlePickupCancelled);
    
    return () => {
      window.removeEventListener('pickupCancelled', handlePickupCancelled);
    };
  }, []);

  const getExpiryStatus = (hours) => {
    const hoursNum = parseInt(hours);
    if (hoursNum <= 2) return { color: "text-red-600", label: "Urgent", icon: AlertCircle };
    if (hoursNum <= 4) return { color: "text-orange-600", label: "Soon", icon: Clock };
    return { color: "text-green-600", label: "Fresh", icon: Clock };
  };

  const handleConfirmPickup = (postId) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const post = foodPosts.find(p => p.id === postId);
    
    if (post && user.email) {
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
      const updatedPosts = foodPosts.map(p => 
        p.id === postId ? { ...p, status: "claimed" } : p
      );
      setFoodPosts(updatedPosts);
      localStorage.setItem('foodPosts', JSON.stringify(updatedPosts));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-primary">
              Food Available for Pickup
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse available food donations in your area. Pick up fresh meals and help reduce food waste 
              while supporting your community.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {foodPosts
              .filter(post => post.status === "available")
              .map((post) => {
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
                        className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onClick={() => handleConfirmPickup(post.id)}
                      >
                        Confirm Pickup
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
          
          {foodPosts.filter(post => post.status === "available").length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No food available right now</h3>
              <p className="text-muted-foreground">Check back later for new donations!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelfPickup;