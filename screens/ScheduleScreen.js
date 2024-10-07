import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { startOfWeek, addDays, format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// Function to get the days of the current week
const getDaysOfWeek = () => {
  const start = startOfWeek(new Date());
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

// Function to format dates
const formatDate = (date) => format(date, 'EEEE');

const TaskAppScreen = ({ route, navigation }) => {
  const [user_id, setUserId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [selectedHour, setSelectedHour] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [isSubmitting, setIsSubmitting] = useState(false); // Loader for add/edit/delete actions

  useEffect(() => {
    const retrieveUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('user_id');
        if (storedUserId) {
          setUserId(storedUserId);
        }
        setLoading(false);
      } catch (error) {
        console.log('Error retrieving user_id:', error);
        setLoading(false);
      }
    };

    retrieveUserId();
  }, []);

  useEffect(() => {
    if (!user_id) {
      return;
    }

    const q = query(collection(FIREBASE_DB, "tasks"), where("userId", "==", user_id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setTasks(tasksData);
      setLoading(false);
    }, (error) => {
      console.log('Error fetching tasks:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user_id]);

  const handleAddTask = async () => {
    if (input.trim()) {
      setIsSubmitting(true);
      const newTask = { 
        title: input, 
        time: selectedHour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
        date: selectedDate.toDateString(), 
        completed: false, 
        userId: user_id 
      };
      try {
        await addDoc(collection(FIREBASE_DB, "tasks"), newTask);
        setInput('');
        Alert.alert('Success', 'Task added successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to add task. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  const handleEditTask = async () => {
    if (input.trim()) {
      setIsSubmitting(true);
      const taskDoc = doc(FIREBASE_DB, "tasks", editingTaskId);
      try {
        await updateDoc(taskDoc, { 
          title: input, 
          time: selectedHour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
          date: selectedDate.toDateString() 
        });
        setEditingTaskId(null);
        setInput('');
        Alert.alert('Success', 'Task updated successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to update task. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (id) => {
    setIsSubmitting(true);
    const taskDoc = doc(FIREBASE_DB, "tasks", id);
    const task = tasks.find(task => task.id === id);
    try {
      await updateDoc(taskDoc, { completed: !task.completed });
      Alert.alert('Success', `Task marked as ${task.completed ? 'incomplete' : 'complete'}!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update task status. Please try again.');
    }
    setIsSubmitting(false);
  };

  const handleDeleteTask = async (id) => {
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(FIREBASE_DB, "tasks", id));
      Alert.alert('Success', 'Task deleted successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete task. Please try again.');
    }
    setIsSubmitting(false);
  };

  const startEditing = (task) => {
    setInput(task.title);
    setSelectedHour(new Date(`1970-01-01T${task.time}:00`));
    setSelectedDate(new Date(task.date));
    setEditingTaskId(task.id);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = (time) => {
    setSelectedHour(time);
    hideTimePicker();
  };

  const daysOfWeek = getDaysOfWeek();

  const getSortedTasks = () => {
    return tasks
      .filter(task => task.date === selectedDate.toDateString())
      .sort((a, b) => new Date(`1970-01-01T${a.time}:00`) - new Date(`1970-01-01T${b.time}:00`));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Schedule</Text>
      <Text style={styles.date}>{selectedDate.toDateString()}</Text>
      <ScrollView horizontal contentContainerStyle={styles.datePickerContainer}>
        {daysOfWeek.map((date, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedDate(date)}>
            <Text style={[
              styles.datePickerItem,
              selectedDate.toDateString() === date.toDateString() && styles.selectedDatePickerItem
            ]}>
              {formatDate(date)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={showTimePicker} style={styles.timeButton}>
        <Text style={styles.timeButtonText}>{selectedHour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideTimePicker}
      />
      <TextInput
        style={styles.input}
        onChangeText={setInput}
        value={input}
        placeholder="Enter your task"
        onSubmitEditing={editingTaskId ? handleEditTask : handleAddTask}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={editingTaskId ? handleEditTask : handleAddTask}
        disabled={isSubmitting} // Disable button while submitting
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.addButtonText}>{editingTaskId ? "Edit Task" : "Add Task"}</Text>
        )}
      </TouchableOpacity>
      <FlatList
        data={getSortedTasks()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <TouchableOpacity
              style={[styles.taskButton, item.completed && styles.completedButton]}
              onPress={() => handleToggleTask(item.id)}
              disabled={isSubmitting} // Disable toggle while submitting
            >
              <Text style={styles.item}>
                {item.completed ? '✓' : '✗'} {`${item.time} - ${item.title}`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => startEditing(item)}
              disabled={isSubmitting} // Disable editing while submitting
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteTask(item.id)}
              disabled={isSubmitting} // Disable delete while submitting
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  date: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginVertical: 12,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  datePickerItem: {
    padding: 12,
    marginHorizontal: 6,
    color: '#333',
    borderRadius: 8,
    backgroundColor: '#ddd',
    textAlign: 'center',
    fontSize: 16,
  },
  selectedDatePickerItem: {
    backgroundColor: '#4B636E',
    color: '#fff',
  },
  timeButton: {
    backgroundColor: '#4B636E',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
  },
  timeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#4B636E',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    marginVertical: 4,
    borderRadius: 8,
  },
  taskButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  completedButton: {
    backgroundColor: '#1E90FF',
  },
  item: {
    color: '#333',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TaskAppScreen;
