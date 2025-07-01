import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/contexts/AuthContext';
import { supabase } from '../../../src/api/supabase';

const ScheduleScreen = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState(null);
  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];
  
  useEffect(() => {
    fetchSchedule();
  }, []);
  
  const fetchSchedule = async () => {
    try {
      // In a real app, fetch from Supabase
      // const { data, error } = await supabase
      //   .from('provider_profiles')
      //   .select('working_hours')
      //   .eq('id', user.id)
      //   .single();
      
      // if (error) throw error;
      // setSchedule(data.working_hours);
      
      // For prototype, using dummy data
      const dummySchedule = {
        Monday: { isOpen: true, slots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'] },
        Tuesday: { isOpen: true, slots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'] },
        Wednesday: { isOpen: true, slots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'] },
        Thursday: { isOpen: true, slots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'] },
        Friday: { isOpen: true, slots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'] },
        Saturday: { isOpen: true, slots: ['9:00 AM', '10:00 AM', '11:00 AM'] },
        Sunday: { isOpen: false, slots: [] },
      };
      
      setSchedule(dummySchedule);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      Alert.alert('Error', 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };
  
  const saveSchedule = async () => {
    try {
      setLoading(true);
      
      // In a real app, update in Supabase
      // const { error } = await supabase
      //   .from('provider_profiles')
      //   .update({ working_hours: schedule })
      //   .eq('id', user.id);
      
      // if (error) throw error;
      
      Alert.alert('Success', 'Schedule updated successfully');
    } catch (error) {
      console.error('Error saving schedule:', error);
      Alert.alert('Error', 'Failed to update schedule');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleDayAvailability = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen,
        slots: prev[day].isOpen ? [] : timeSlots // If closing, clear slots; if opening, add all slots
      }
    }));
  };
  
  const toggleTimeSlot = (day, time) => {
    setSchedule(prev => {
      const currentSlots = prev[day].slots || [];
      const newSlots = currentSlots.includes(time)
        ? currentSlots.filter(slot => slot !== time)
        : [...currentSlots, time];
      
      return {
        ...prev,
        [day]: {
          ...prev[day],
          slots: newSlots
        }
      };
    });
  };
  
  if (loading || !schedule) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading schedule...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Schedule</Text>
        <Text style={styles.headerSubtitle}>Set your working hours</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {daysOfWeek.map(day => (
          <View key={day} style={styles.dayContainer}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayName}>{day}</Text>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>{schedule[day].isOpen ? 'Open' : 'Closed'}</Text>
                <Switch
                  value={schedule[day].isOpen}
                  onValueChange={() => toggleDayAvailability(day)}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={schedule[day].isOpen ? '#0066CC' : '#f4f3f4'}
                />
              </View>
            </View>
            
            {schedule[day].isOpen && (
              <View style={styles.timeSlotsContainer}>
                {timeSlots.map(time => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlot,
                      schedule[day].slots.includes(time) && styles.selectedTimeSlot
                    ]}
                    onPress={() => toggleTimeSlot(day, time)}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      schedule[day].slots.includes(time) && styles.selectedTimeSlotText
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={saveSchedule}
        >
          <Text style={styles.saveButtonText}>Save Schedule</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  dayContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  dayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginRight: 10,
    fontSize: 14,
    color: '#666',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  timeSlot: {
    width: '30%',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#0066CC',
  },
  timeSlotText: {
    fontSize: 12,
    color: '#333',
  },
  selectedTimeSlotText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#0066CC',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScheduleScreen;