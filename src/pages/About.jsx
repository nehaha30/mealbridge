import { Link } from "react-router-dom";
import { ArrowLeft, Leaf, Users, Globe } from "lucide-react";

const About = () => {
  

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Back Link */}
        <Link 
          to="/"
          className="mb-8 inline-flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">
              About MealBridge
            </h1>
            <p className="text-xl text-muted-foreground">
              Connecting surplus meals with those who need them most
            </p>
          </div>

          {/* Mission Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-primary flex items-center gap-3">
              <Users className="h-8 w-8" />
              Our Mission
            </h2>
            <div className="bg-card p-8 rounded-xl shadow-card">
              <p className="text-lg text-muted-foreground leading-relaxed">
                MealBridge exists to eliminate food waste while addressing hunger in our communities. 
                We believe that no meal should go to waste when there are people in need. Our platform 
                connects restaurants, cafes, and food businesses with surplus meals to individuals and 
                families who can benefit from them.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                By creating a simple, efficient bridge between food donors and receivers, we're building 
                a more sustainable and caring community where everyone has access to nutritious meals.
              </p>
            </div>
          </div>

          {/* Impact Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-primary flex items-center gap-3">
              <Globe className="h-8 w-8" />
              The Impact of Food Waste
            </h2>
            <div className="bg-card p-8 rounded-xl shadow-card">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-4">Global Food Waste Crisis</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Leaf className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span>1.3 billion tons of food is wasted globally each year</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Leaf className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Food waste contributes to 8-10% of global greenhouse gas emissions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Leaf className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Meanwhile, 828 million people go to bed hungry every night</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-4">Our Solution</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Leaf className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Real-time connection between food donors and receivers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Leaf className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Reducing environmental impact one meal at a time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Leaf className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Building stronger, more sustainable communities</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-6 bg-primary/5 p-8 rounded-xl">
            <h2 className="text-2xl font-semibold text-primary">
              Ready to Make a Difference?
            </h2>
            <p className="text-muted-foreground">
              Join our community of food heroes and help us bridge the gap between surplus and need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Get Started Today
              </Link>
              <Link 
                to="/login"
                className="border-2 border-primary text-primary hover:bg-primary/10 text-lg px-8 py-6 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shadow-sm"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;