import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, X } from "lucide-react";
import Navbar from "@/components/Navbar";


const ReceiverDashboard = () => {
  const [user, setUser] = useState(null);
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    loadMyRequests();
  }, []);

  const loadMyRequests = async () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const receiverId = userData.id || userData.userId || userData.ID || userData.user_id;
    if (!receiverId) return;

    try {
      const res = await fetch('/pickupslist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiver_id: Number(receiverId) })
      });
      const data = await res.json().catch(() => ([]));
      const mapped = (Array.isArray(data) ? data : []).map(item => ({
        id: (item.pickup_id || Date.now()).toString(),
        pickupId: item.pickup_id,
        foodId: item.food_id,
        foodTitle: item.food_name,
        donorName: `Donor #${item.donor_id}`,
        pickupLocation: item.pickup_location,
        requestStatus: (item.status || 'Requested').toLowerCase(),
        requestedAt: 'Recently'
      }));
      setMyRequests(mapped);
    } catch (_) {
      // minimal handling per request
    }
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

  const handleCancelRequest = async (requestId) => {
    // Find the request to recover food_id and pickupId
    const request = myRequests.find(r => r.id === requestId);

    // Call backend to delete pickup if we have pickupId
    if (request?.pickupId) {
      try {
        await fetch('/pickups', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pickup_id: Number(request.pickupId) })
        });
      } catch (e) {
        // ignore network error; still proceed to update local view
      }
    }

    // Call backend to set post as available if we have a foodId
    if (request?.foodId) {
      try {
        await fetch('/available', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ food_id: Number(request.foodId) })
        });
      } catch (e) {
        // ignore network error; still proceed to update local view
      }
    }

    // Refresh list from DB
    loadMyRequests();
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
          {/* Available Food section removed (Self Pickup covers it) */}

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