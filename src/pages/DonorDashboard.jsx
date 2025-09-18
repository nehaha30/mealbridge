import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Clock, MapPin, Users, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";


const DonorDashboard = () => {
  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    foodName: "",
    quantity: "",
    expiryHours: "",
    pickupLocation: "",
    description: "",
    imageUrl: ""
  });
  const [claimedInfoByFoodId, setClaimedInfoByFoodId] = useState({});

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    loadMyPosts();
  }, []);

  const loadMyPosts = async () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const donorId = userData.id || userData.userId || userData.ID || userData.user_id;
    if (!donorId) return;

    try {
      const response = await fetch('/fetchpost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donor_id: donorId })
      });
      const data = await response.json().catch(() => ([]));
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to load posts');
      }

      // Map backend shape to UI shape if necessary
      const mapped = (Array.isArray(data) ? data : []).map(item => ({
        id: (item.food_id || item.id || item.foodId || Date.now()).toString(),
        foodName: item.food_name || item.foodName || '',
        quantity: item.quantity || '',
        expiryHours: item.expiry_time || '',
        pickupLocation: item.pickup_location || '',
        description: item.description || '',
        imageUrl: item.image_url || '',
        donorName: userData.name || userData.email,
        donorEmail: userData.email,
        status: (item.status || 'available').toLowerCase(),
        postedAt: 'Just now'
      }));
      setMyPosts(mapped);

      // Fetch receiver name for claimed posts
      const claimed = mapped.filter(p => p.status === 'claimed');
      if (claimed.length > 0) {
        const results = await Promise.allSettled(
          claimed.map(async (p) => {
            const resp = await fetch('/claimedname', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ food_id: parseInt(p.id, 10) })
            });
            const info = await resp.json().catch(() => null);
            return { id: p.id, info };
          })
        );
        const map = {};
        results.forEach(r => {
          if (r.status === 'fulfilled' && r.value) {
            map[r.value.id] = r.value.info;
          }
        });
        setClaimedInfoByFoodId(map);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async () => {
    if (!user?.email || !newPost.foodName || !newPost.quantity) return;

    try {
      const parsedHours = parseInt(newPost.expiryHours, 10);
      const hasExpiry = Number.isFinite(parsedHours) && parsedHours > 0;
      const expiryLabel = hasExpiry ? `${parsedHours} ${parsedHours === 1 ? 'hour' : 'hours'}` : null;
      const donorId = user.id || user.userId || user.ID || user.user_id || null;

      if (!donorId) {
        alert('Your session is missing an id. Please log in again.');
        window.location.href = '/login';
        return;
      }

      const response = await fetch('/foodposts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donor_id: donorId,
          food_name: newPost.foodName,
          description: newPost.description || '',
          quantity: newPost.quantity,
          image_url: newPost.imageUrl || '',
          pickup_location: newPost.pickupLocation || '',
          
          expiry_time: expiryLabel
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to create post');
      }

      alert('Food post created successfully');

      // Update state from response or re-fetch for consistency
      const post = {
        id: (data.foodId || Date.now()).toString(),
        ...newPost,
        donorName: user.name || user.email,
        donorEmail: user.email,
        status: "available",
        postedAt: "Just now"
      };
      setMyPosts([post, ...myPosts]);
      setIsCreateDialogOpen(false);
      setNewPost({
        foodName: "",
        quantity: "",
        expiryHours: "",
        pickupLocation: "",
        description: "",
        imageUrl: ""
      });
    } catch (err) {
      alert(err.message || 'An error occurred while creating the post');
    }
  };

  const handleCancelPost = async (postId) => {
    try {
      const response = await fetch('/deletepost', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to delete post');
      }

      setMyPosts(myPosts.filter(post => post.id !== postId));
      alert('Post deleted successfully');
    } catch (err) {
      alert(err.message || 'An error occurred while deleting the post');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-primary-light text-primary-dark";
      case "claimed":
        return "bg-secondary-light text-secondary-dark";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <Clock className="h-4 w-4" />;
      case "claimed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatExpiryLabel = (value) => {
    const text = String(value || "");
    const num = parseInt(text.replace(/\D/g, ""), 10);
    if (!Number.isFinite(num)) return text || "N/A";
    return `${num} ${num === 1 ? "hour" : "hours"}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Welcome to Donor Dashboard</h1>
            <p className="text-muted-foreground">Please login to manage your food donations.</p>
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
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                My Food Donations
              </h1>
              <p className="text-muted-foreground mt-2">Manage your posted food items and track their status</p>
            </div>
            
            <button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Food Donation
            </button>
          </div>

          {myPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No donations yet</h3>
              <p className="text-muted-foreground mb-4">Start making a difference by sharing your excess food</p>
              <button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Donation
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myPosts.map((post) => (
                <div key={post.id} className="border border-border bg-card hover:shadow-lg transition-all duration-300 rounded-lg p-4">
                  <div className="pb-3">
                    <div className="w-full h-32 bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {post.imageUrl ? (
                        <img 
                          src={post.imageUrl} 
                          alt={post.foodName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={post.imageUrl ? "hidden" : "text-muted-foreground"}>
                        <span className="text-3xl">🍽️</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{post.foodName}</h3>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{post.quantity}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Expires in {formatExpiryLabel(post.expiryHours)}</span>
                    </div>

                    {post.status === 'claimed' && (
                      <div className="text-sm bg-secondary/20 border border-secondary/40 rounded-md p-3 space-y-1">
                        <div className="font-medium text-foreground">Claimed by</div>
                        <div className="text-muted-foreground">
                          {(() => {
                            const info = claimedInfoByFoodId[post.id];
                            if (!info) return 'Fetching receiver name...';
                            const name = info?.receiver_name || 'Unknown';
                            return name;
                          })()}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{post.pickupLocation}</span>
                    </div>
                    
                     <div className="flex justify-between items-center pt-2">
                       <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(post.status)}`}>
                         {getStatusIcon(post.status)}
                         <span>{post.status === "available" ? "Available" : "Claimed"}</span>
                       </span>
                       <div className="flex items-center space-x-2">
                         <span className="text-xs text-muted-foreground">{post.postedAt}</span>
                         {post.status === "available" && (
                           <button 
                             onClick={() => handleCancelPost(post.id)}
                             className="text-xs px-2 py-1 h-6 border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                           >
                             Cancel
                           </button>
                         )}
                       </div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Dialog */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">Create New Food Donation</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Food Name</label>
                <input
                  value={newPost.foodName}
                  onChange={(e) => setNewPost({...newPost, foodName: e.target.value})}
                  placeholder="e.g., Fresh Pasta & Sauce"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Quantity</label>
                <input
                  value={newPost.quantity}
                  onChange={(e) => setNewPost({...newPost, quantity: e.target.value})}
                  placeholder="e.g., 5 portions"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Expiry (hours)</label>
                <input
                  type="number"
                  value={newPost.expiryHours}
                  onChange={(e) => setNewPost({...newPost, expiryHours: e.target.value})}
                  placeholder="e.g., 4"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Pickup Location</label>
                <input
                  value={newPost.pickupLocation}
                  onChange={(e) => setNewPost({...newPost, pickupLocation: e.target.value})}
                  placeholder="e.g., 123 Main St, Downtown"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  value={newPost.description}
                  onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                  placeholder="Describe the food..."
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Image URL (optional)</label>
                <input
                  value={newPost.imageUrl}
                  onChange={(e) => setNewPost({...newPost, imageUrl: e.target.value})}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={handleCreatePost}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                  disabled={!newPost.foodName || !newPost.quantity}
                >
                  Create Donation
                </button>
                <button 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;