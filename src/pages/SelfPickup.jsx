import { useState, useEffect } from "react";
import { Clock, MapPin, User, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";


const SelfPickup = () => {
  const [foodPosts, setFoodPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch available posts from backend
    const fetchAvailable = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch('/foodposts');
        const data = await res.json().catch(() => ([]));
        if (!res.ok) {
          throw new Error(data.error || data.message || 'Failed to load available posts');
        }
        const mapped = (Array.isArray(data) ? data : []).map(item => ({
          id: (item.food_id || item.id || item.foodId || Date.now()).toString(),
          foodName: item.food_name || item.foodName || '',
          quantity: item.quantity || '',
          expiryHours: (item.expiry_time || '').toString().replace(/\D/g, '') || '',
          pickupLocation: item.pickup_location || '',
          description: item.description || '',
          imageUrl: item.image_url || '',
          donorName: item.donor_name || `Donor #${item.donor_id}`,
          status: (item.status || 'available').toLowerCase(),
          postedAt: 'Just now'
        }));
        setFoodPosts(mapped);
      } catch (e) {
        setError(e.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailable();

    // Listen for cancel events from dashboard
    const handlePickupCancelled = (event) => {
      // On cancel, simply refresh available posts from backend
      fetchAvailable();
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

  const handleConfirmPickup = async (postId) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const post = foodPosts.find(p => p.id === postId);
    
    if (post && user.email) {
      // Update backend status to claimed, then create pickup and persist with pickupId
      let pickupIdFromServer = null;
      try {
        await fetch('/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ food_id: Number(postId) })
        });
        // Also create a pickup record in backend
        const receiverId = user.id || user.userId || user.ID || user.user_id || null;
        if (receiverId) {
          const res = await fetch('/pickups', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ food_id: Number(postId), receiver_id: Number(receiverId) })
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && (data.pickupId || data.id)) {
            pickupIdFromServer = (data.pickupId || data.id).toString();
          }
        }
      } catch (e) {
        // ignore and rely on optimistic update
      }

      // Create pickup request locally (store backend pickupId if available)
      const pickupRequest = {
        id: Date.now().toString(),
        pickupId: pickupIdFromServer || undefined,
        foodId: postId,
        foodTitle: post.foodName,
        donorName: post.donorName,
        pickupLocation: post.pickupLocation,
        requestStatus: "requested",
        requestedBy: user.email,
        requestedAt: "Just now"
      };
      const existingRequests = JSON.parse(localStorage.getItem('pickupRequests') || '[]');
      localStorage.setItem('pickupRequests', JSON.stringify([pickupRequest, ...existingRequests]));

      // Optimistic update
      setFoodPosts(prev => prev.map(p => p.id === postId ? { ...p, status: 'claimed' } : p));
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

          {error && (
            <div className="text-center text-destructive">{error}</div>
          )}

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading available posts...</div>
          ) : (
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
          )}
          
          {!loading && foodPosts.filter(post => post.status === "available").length === 0 && (
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