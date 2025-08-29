// Common types and interfaces for the CropSight application

export interface DashboardStats {
  totalFields: number;
  healthyFields: number;
  totalAcres: number;
  predictedYield: number;
}

export interface WeatherCondition {
  id: string;
  fieldId: string;
  date: string;
  temperature: string;
  humidity: string;
  rainfall: string;
  windSpeed: string;
  condition: string;
}

export interface SatelliteReading {
  id: string;
  fieldId: string;
  date: string;
  ndvi: number;
  evi: number;
  sarvi: number;
}

export interface YieldPredictionData {
  id: string;
  fieldId: string;
  predictionDate: string;
  predictedYield: number;
  confidence: number;
  modelVersion: string;
}

export interface AlertNotification {
  id: string;
  userId: string;
  fieldId?: string;
  type: 'health' | 'weather' | 'yield';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  isRead: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface FieldHealthStatus {
  status: 'Healthy' | 'Needs Attention' | 'Critical';
  variant: 'default' | 'secondary' | 'destructive';
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface MapField {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  ndvi: number;
  health: 'healthy' | 'warning' | 'critical';
}

export interface MockDataRequest {
  fieldId: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ErrorResponse {
  message: string;
  error?: string;
  statusCode: number;
}

// Form validation types
export interface FieldFormErrors {
  name?: string;
  latitude?: string;
  longitude?: string;
  size?: string;
  cropType?: string;
  location?: string;
  plantingDate?: string;
  expectedHarvestDate?: string;
}

// Navigation types
export interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType;
  badge?: number;
}

// User session types
export interface UserSession {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
    userType?: string;
  };
}

// Chart configuration types
export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      tension?: number;
      fill?: boolean;
    }>;
  };
  options: {
    responsive: boolean;
    maintainAspectRatio: boolean;
    plugins?: {
      legend?: {
        display: boolean;
      };
    };
    scales?: {
      y?: {
        beginAtZero?: boolean;
        min?: number;
        max?: number;
        grid?: {
          color: string;
        };
      };
      x?: {
        grid?: {
          color: string;
        };
      };
    };
  };
}
