// Create an analytics service
import * as Analytics from 'expo-firebase-analytics';

class AnalyticsService {
  // Track screen views
  static trackScreenView = async (screenName, screenClass) => {
    try {
      await Analytics.logScreenView({
        screen_name: screenName,
        screen_class: screenClass,
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  // Track user actions
  static trackEvent = async (eventName, params = {}) => {
    try {
      await Analytics.logEvent(eventName, params);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  // Track user properties
  static setUserProperties = async (properties) => {
    try {
      Object.entries(properties).forEach(async ([key, value]) => {
        await Analytics.setUserProperty(key, value);
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };
}

export default AnalyticsService;