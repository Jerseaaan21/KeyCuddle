import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput, Modal, Button } from 'react-native';

export default function App() {
  const [passwords, setPasswords] = useState([
    { id: '1', title: 'Google', username: 'user@gmail.com', password: '********', tags: 'Work', notes: 'basta dito yung notes' },
    { id: '2', title: 'Facebook', username: 'user@facebook.com', password: '********', tags: 'Social', notes: 'basta dito yung notes' },
    { id: '3', title: 'Twitter', username: 'user@twitter.com', password: '********', tags: 'Social', notes: 'basta dito yung notes' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState({ title: '', username: '', password: '', tags: '', notes: '' });

  const handlePress = (id) => {
    alert(`Password details for ID: ${id}`);
  };

  const handleViewPassword = (password) => {
    alert(`Password: ${password}`);
  };

  const handleAddPassword = () => {
    setPasswords([
      ...passwords,
      { ...newPassword, id: (passwords.length + 1).toString(), password: '********' },
    ]);
    setModalVisible(false);
    setNewPassword({ title: '', username: '', password: '', tags: '', notes: '' }); // Reset the form
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KeyCuddle</Text>

      <FlatList
        data={passwords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text>Username: {item.username}</Text>
                <Text>Password: {item.password}</Text>
                <Text>Tags: {item.tags}</Text>
                <Text>Notes: {item.notes}</Text>
              </View>
              <TouchableOpacity style={styles.viewButton} onPress={() => handleViewPassword(item.password)}>
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add New Information</Text>
      </TouchableOpacity>

      {/* Modal for adding new password */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Information</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newPassword.title}
              onChangeText={(text) => setNewPassword({ ...newPassword, title: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={newPassword.username}
              onChangeText={(text) => setNewPassword({ ...newPassword, username: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              value={newPassword.password}
              onChangeText={(text) => setNewPassword({ ...newPassword, password: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Tags"
              value={newPassword.tags}
              onChangeText={(text) => setNewPassword({ ...newPassword, tags: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Notes"
              value={newPassword.notes}
              onChangeText={(text) => setNewPassword({ ...newPassword, notes: text })}
            />

            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Add Information" onPress={handleAddPassword} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  viewButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
