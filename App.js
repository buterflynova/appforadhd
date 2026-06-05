import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { CheckCircle, MessageSquarePlus, Trash2, Calendar } from 'lucide-react-native';

export default function App() {
  // Sample initial data
  const [friends, setFriends] = useState([
    { id: '1', name: 'Alex', interval: 7, lastContacted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }, // 5 days ago
    { id: '2', name: 'Taylor', interval: 14, lastContacted: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) }, // 15 days ago (Overdue!)
  ]);

  const [name, setName] = useState('');
  const [interval, setInterval] = useState('');

  // Add a new friend to the list
  const addFriend = () => {
    if (!name.trim() || !interval.trim()) return;
    
    const newFriend = {
      id: Date.now().toString(),
      name: name.trim(),
      interval: parseInt(interval) || 7,
      lastContacted: new Date(), // Starts as contacted today
    };

    setFriends([...friends, newFriend]);
    setName('');
    setInterval('');
  };

  // Reset the reminder timer (You texted them!)
  const markAsTexted = (id) => {
    setFriends(friends.map(friend => {
      if (friend.id === id) {
        return { ...friend, lastContacted: new Date() };
      }
      return friend;
    }));
  };

  // Delete a friend from the list
  const deleteFriend = (id) => {
    setFriends(friends.filter(friend => friend.id !== id));
  };

  // Helper helper to calculate days remaining
  const getDaysStatus = (lastContacted, interval) => {
    const today = new Date();
    const timeDiff = today.getTime() - new Date(lastContacted).getTime();
    const daysSinceContact = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const daysLeft = interval - daysSinceContact;
    
    return {
      daysLeft,
      isOverdue: daysLeft <= 0
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ReplyGuy 💬</Text>
          <Text style={styles.headerSubtitle}>Don't ghost your favorite people.</Text>
        </View>

        {/* Friends List */}
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No friends added yet. Start adding some below!</Text>
          }
          renderItem={({ item }) => {
            const { daysLeft, isOverdue } = getDaysStatus(item.lastContacted, item.interval);
            
            return (
              <View style={[styles.card, isOverdue && styles.cardOverdue]}>
                <View style={styles.cardInfo}>
                  <Text style={styles.friendName}>{item.name}</Text>
                  <Text style={styles.friendMeta}>Every {item.interval} days</Text>
                  
                  <Text style={[styles.statusText, isOverdue ? styles.textOverdue : styles.textSafe]}>
                    {isOverdue 
                      ? `Overdue by ${Math.abs(daysLeft)} days!` 
                      : `${daysLeft} days left to text back`}
                  </Text>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.actionButtonCheck} 
                    onPress={() => markAsTexted(item.id)}
                  >
                    <CheckCircle color="#fff" size={20} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButtonDelete} 
                    onPress={() => deleteFriend(item.id)}
                  >
                    <Trash2 color="#ff4d4d" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />

        {/* Input Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Add a Friend</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 2 }]}
              placeholder="Friend's Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Days (e.g. 7)"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={interval}
              onChangeText={setInterval}
            />
            <TouchableOpacity style={styles.addButton} onPress={addFriend}>
              <MessageSquarePlus color="#fff" size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Dark theme background
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  listContainer: {
    padding: 20,
  },
  emptyText: {
    color: '#64748b',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: '#10b981', // Green indicator for safe
  },
  cardOverdue: {
    borderLeftColor: '#ef4444', // Red indicator for overdue
    backgroundColor: '#2d1f2d',
  },
  cardInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  friendMeta: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  textSafe: {
    color: '#10b981',
  },
  textOverdue: {
    color: '#ef4444',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonCheck: {
    backgroundColor: '#10b981',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  actionButtonDelete: {
    padding: 10,
  },
  formContainer: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#6366f1', // Indigo accent
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});