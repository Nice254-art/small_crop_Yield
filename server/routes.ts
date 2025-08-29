import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertFieldSchema,
  insertSatelliteDataSchema,
  insertWeatherDataSchema,
  insertYieldPredictionSchema,
  insertAlertSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Field management routes
  app.get("/api/fields", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userFields = await storage.getFieldsByUserId(userId);
      res.json(userFields);
    } catch (error) {
      console.error("Error fetching fields:", error);
      res.status(500).json({ message: "Failed to fetch fields" });
    }
  });

  app.post("/api/fields", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const fieldData = insertFieldSchema.parse({
        ...req.body,
        userId,
      });
      const field = await storage.createField(fieldData);
      res.json(field);
    } catch (error) {
      console.error("Error creating field:", error);
      res.status(500).json({ message: "Failed to create field" });
    }
  });

  app.get("/api/fields/:id", isAuthenticated, async (req: any, res) => {
    try {
      const field = await storage.getField(req.params.id);
      if (!field) {
        return res.status(404).json({ message: "Field not found" });
      }
      res.json(field);
    } catch (error) {
      console.error("Error fetching field:", error);
      res.status(500).json({ message: "Failed to fetch field" });
    }
  });

  app.put("/api/fields/:id", isAuthenticated, async (req: any, res) => {
    try {
      const fieldData = insertFieldSchema.partial().parse(req.body);
      const field = await storage.updateField(req.params.id, fieldData);
      res.json(field);
    } catch (error) {
      console.error("Error updating field:", error);
      res.status(500).json({ message: "Failed to update field" });
    }
  });

  app.delete("/api/fields/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteField(req.params.id);
      res.json({ message: "Field deleted successfully" });
    } catch (error) {
      console.error("Error deleting field:", error);
      res.status(500).json({ message: "Failed to delete field" });
    }
  });

  // Satellite data routes
  app.get("/api/satellite-data/:fieldId/latest", isAuthenticated, async (req, res) => {
    try {
      const data = await storage.getLatestSatelliteData(req.params.fieldId);
      res.json(data);
    } catch (error) {
      console.error("Error fetching satellite data:", error);
      res.status(500).json({ message: "Failed to fetch satellite data" });
    }
  });

  app.get("/api/satellite-data/:fieldId", isAuthenticated, async (req, res) => {
    try {
      const data = await storage.getSatelliteDataByField(req.params.fieldId);
      res.json(data);
    } catch (error) {
      console.error("Error fetching satellite data:", error);
      res.status(500).json({ message: "Failed to fetch satellite data" });
    }
  });

  // Weather data routes
  app.get("/api/weather/:fieldId/latest", isAuthenticated, async (req, res) => {
    try {
      const data = await storage.getLatestWeatherData(req.params.fieldId);
      res.json(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  app.get("/api/weather/:fieldId", isAuthenticated, async (req, res) => {
    try {
      const data = await storage.getWeatherDataByField(req.params.fieldId);
      res.json(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  // Yield prediction routes
  app.get("/api/predictions/:fieldId/latest", isAuthenticated, async (req, res) => {
    try {
      const prediction = await storage.getLatestYieldPrediction(req.params.fieldId);
      res.json(prediction);
    } catch (error) {
      console.error("Error fetching yield prediction:", error);
      res.status(500).json({ message: "Failed to fetch yield prediction" });
    }
  });

  app.get("/api/predictions/:fieldId", isAuthenticated, async (req, res) => {
    try {
      const predictions = await storage.getYieldPredictionsByField(req.params.fieldId);
      res.json(predictions);
    } catch (error) {
      console.error("Error fetching yield predictions:", error);
      res.status(500).json({ message: "Failed to fetch yield predictions" });
    }
  });

  // Alert routes
  app.get("/api/alerts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userAlerts = await storage.getAlertsByUserId(userId);
      res.json(userAlerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.get("/api/alerts/unread", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const unreadAlerts = await storage.getUnreadAlerts(userId);
      res.json(unreadAlerts);
    } catch (error) {
      console.error("Error fetching unread alerts:", error);
      res.status(500).json({ message: "Failed to fetch unread alerts" });
    }
  });

  app.patch("/api/alerts/:id/read", isAuthenticated, async (req, res) => {
    try {
      await storage.markAlertAsRead(req.params.id);
      res.json({ message: "Alert marked as read" });
    } catch (error) {
      console.error("Error marking alert as read:", error);
      res.status(500).json({ message: "Failed to mark alert as read" });
    }
  });

  // Dashboard stats route
  app.get("/api/dashboard/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userFields = await storage.getFieldsByUserId(userId);
      
      const totalFields = userFields.length;
      const totalAcres = userFields.reduce((sum, field) => sum + Number(field.size || 0), 0);
      
      // Calculate healthy fields based on latest satellite data
      let healthyFields = 0;
      let totalPredictedYield = 0;
      
      for (const field of userFields) {
        const latestData = await storage.getLatestSatelliteData(field.id);
        if (latestData && Number(latestData.ndvi) > 0.6) {
          healthyFields++;
        }
        
        const latestPrediction = await storage.getLatestYieldPrediction(field.id);
        if (latestPrediction) {
          totalPredictedYield += Number(latestPrediction.predictedYield || 0);
        }
      }
      
      res.json({
        totalFields,
        healthyFields,
        totalAcres,
        predictedYield: totalPredictedYield,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Mock satellite data endpoint for testing
  app.post("/api/mock/satellite-data", isAuthenticated, async (req, res) => {
    try {
      const { fieldId } = req.body;
      
      // Generate mock satellite data
      const mockData = {
        fieldId,
        date: new Date(),
        ndvi: (Math.random() * 0.4 + 0.5).toFixed(3), // 0.5-0.9
        evi: (Math.random() * 0.3 + 0.4).toFixed(3), // 0.4-0.7
        sarvi: (Math.random() * 0.3 + 0.5).toFixed(3), // 0.5-0.8
      };
      
      const data = await storage.createSatelliteData(mockData);
      res.json(data);
    } catch (error) {
      console.error("Error creating mock satellite data:", error);
      res.status(500).json({ message: "Failed to create mock satellite data" });
    }
  });

  // Mock weather data endpoint
  app.post("/api/mock/weather-data", isAuthenticated, async (req, res) => {
    try {
      const { fieldId } = req.body;
      
      const mockWeather = {
        fieldId,
        date: new Date(),
        temperature: (Math.random() * 15 + 15).toFixed(1), // 15-30°C
        humidity: (Math.random() * 40 + 40).toFixed(1), // 40-80%
        rainfall: (Math.random() * 50).toFixed(1), // 0-50mm
        windSpeed: (Math.random() * 20 + 5).toFixed(1), // 5-25 km/h
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain'][Math.floor(Math.random() * 5)],
      };
      
      const data = await storage.createWeatherData(mockWeather);
      res.json(data);
    } catch (error) {
      console.error("Error creating mock weather data:", error);
      res.status(500).json({ message: "Failed to create mock weather data" });
    }
  });

  // Mock yield prediction endpoint
  app.post("/api/mock/yield-prediction", isAuthenticated, async (req, res) => {
    try {
      const { fieldId } = req.body;
      
      const mockPrediction = {
        fieldId,
        predictionDate: new Date(),
        predictedYield: (Math.random() * 3 + 1).toFixed(1), // 1-4 tonnes
        confidence: (Math.random() * 20 + 70).toFixed(1), // 70-90%
        modelVersion: 'v1.0',
      };
      
      const prediction = await storage.createYieldPrediction(mockPrediction);
      res.json(prediction);
    } catch (error) {
      console.error("Error creating mock yield prediction:", error);
      res.status(500).json({ message: "Failed to create mock yield prediction" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
