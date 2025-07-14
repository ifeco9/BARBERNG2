// Create offline support service
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

class OfflineService {
  static isConnected = true;
  static pendingOperations = [];
  
  // Initialize network listener
  static init = () => {
    NetInfo.addEventListener(state => {
      const wasConnected = this.isConnected;
      this.isConnected = state.isConnected;
      
      // If we just came back online, process pending operations
      if (!wasConnected && this.isConnected) {
        this.processPendingOperations();
      }
    });
    
    // Load any pending operations from storage
    this.loadPendingOperations();
  };
  
  // Save an operation for later when offline
  static saveOperation = async (operation) => {
    this.pendingOperations.push(operation);
    await AsyncStorage.setItem('pendingOperations', JSON.stringify(this.pendingOperations));
  };
  
  // Load pending operations from storage
  static loadPendingOperations = async () => {
    try {
      const operations = await AsyncStorage.getItem('pendingOperations');
      if (operations) {
        this.pendingOperations = JSON.parse(operations);
      }
    } catch (error) {
      console.error('Failed to load pending operations:', error);
    }
  };
  
  // Process pending operations when back online
  static processPendingOperations = async () => {
    if (this.pendingOperations.length === 0) return;
    
    const operations = [...this.pendingOperations];
    this.pendingOperations = [];
    await AsyncStorage.removeItem('pendingOperations');
    
    for (const operation of operations) {
      try {
        // Execute the operation
        if (operation.type === 'booking') {
          // Process booking
          // ...
        } else if (operation.type === 'review') {
          // Process review
          // ...
        }
        // Add more operation types as needed
      } catch (error) {
        console.error('Failed to process operation:', error);
        // Put the operation back in the queue
        this.saveOperation(operation);
      }
    }
  };
}

export default OfflineService;