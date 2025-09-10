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

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    loadMyPosts();
  }, []);

  const loadMyPosts = () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.email) return;

    const allPosts = JSON.parse(localStorage.getItem('foodPosts') || '[]');
    const userPosts = allPosts.filter((post) => 
      post.donorEmail === userData.email || post.donorName === userData.name
    );
    setMyPosts(userPosts);
  };

  const handleCreatePost = () => {
    if (!user?.email || !newPost.foodName || !newPost.quantity) return;

    const post = {
      id: Date.now().toString(),
      ...newPost,
      donorName: user.name || user.email,
      donorEmail: user.email,
      status: "available",
      postedAt: "Just now"
    };

    // Add to all food posts
    const allPosts = JSON.parse(localStorage.getItem('foodPosts') || '[]');
    const updatedPosts = [post, ...allPosts];
    localStorage.setItem('foodPosts', JSON.stringify(updatedPosts));
    
    // Update local state
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
  };

  const handleCancelPost = (postId) => {
    // Remove from localStorage
    const allPosts = JSON.parse(localStorage.getItem('foodPosts') || '[]');
    const updatedPosts = allPosts.filter((post) => post.id !== postId);
    localStorage.setItem('foodPosts', JSON.stringify(updatedPosts));

    // Update local state
    setMyPosts(myPosts.filter(post => post.id !== postId));
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
                      <span>Expires in {post.expiryHours}h</span>
                    </div>
                    
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