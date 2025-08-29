import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, MapPin, TrendingUp, AlertTriangle } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="gradient-bg p-2 rounded-lg">
              <Sprout className="text-primary-foreground text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">CropSight</h1>
          </div>
          <Button onClick={handleLogin} data-testid="button-login">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Smart Crop Yield
            <span className="text-primary"> Predictions</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Harness satellite data and machine learning to forecast maize yields, 
            monitor crop health, and make informed farming decisions.
          </p>
          <Button 
            onClick={handleLogin} 
            size="lg" 
            className="text-lg px-8 py-4"
            data-testid="button-get-started"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Empower Your Farm with Technology
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform combines satellite imagery, weather data, and advanced analytics 
            to help farmers maximize their crop yields.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="text-center">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
              <CardTitle>Field Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Real-time satellite monitoring of your fields with NDVI, EVI, and SARVI indices.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-2" />
              <CardTitle>Yield Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI-powered yield forecasting using Gaussian Process Regression models.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <AlertTriangle className="w-12 h-12 text-primary mx-auto mb-2" />
              <CardTitle>Early Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get alerts about crop health issues before they impact your harvest.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Sprout className="w-12 h-12 text-primary mx-auto mb-2" />
              <CardTitle>Farmer-First</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Simple, intuitive interface designed specifically for African farmers.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Farming?
          </h3>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join thousands of farmers already using CropSight to increase their yields 
            and reduce farming risks.
          </p>
          <Button 
            onClick={handleLogin} 
            variant="secondary" 
            size="lg"
            data-testid="button-join-now"
          >
            Join Now - It's Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>&copy; 2024 CropSight. Empowering African farmers with technology.</p>
      </footer>
    </div>
  );
}
