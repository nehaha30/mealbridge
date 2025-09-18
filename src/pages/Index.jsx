import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import heroImage from "@/assets/mealbridge-hero.jpg";

const Index = () => {
  

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Logo and Title */}
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary rounded-full">
                <Heart className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-primary">
              MealBridge
            </h1>
            <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
              "Bridging surplus meals to hungry hearts."
            </p>
          </div>

          {/* Hero Image */}
          <div className="max-w-4xl mx-auto">
            <img 
              src={heroImage} 
              alt="MealBridge - Food sharing community" 
              className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-card"
            />
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Join our community of food heroes. Whether you're a restaurant with surplus meals 
              or someone in need, MealBridge connects you with your local community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Get Started
              </Link>
              <Link 
                to="/login"
                className="border-2 border-primary text-primary hover:bg-primary/10 text-lg px-8 py-6 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shadow-sm"
              >
                Login
              </Link>
              <Link 
                to="/about"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 py-6 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1,247</div>
              <div className="text-sm text-muted-foreground">Meals Shared</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">89</div>
              <div className="text-sm text-muted-foreground">Active Donors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">156</div>
              <div className="text-sm text-muted-foreground">Receivers Helped</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">98%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
