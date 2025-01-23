import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from './firebaseConfig';
import { ref, set, push, onValue, update, remove } from 'firebase/database';

const KeyCuddle: React.FC = () => {
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');
  const [passwords, setPasswords] = useState<any[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<any[]>([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState<any | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const navigation = useNavigation();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      alert('User is not logged in');
      navigation.navigate('login');
    }
  }, [userId, navigation]);

  useEffect(() => {
    if (userId) {
      const passwordsRef = ref(db, `users/${userId}/passwords`);
      const unsubscribe = onValue(passwordsRef, (snapshot) => {
        const data = snapshot.val();
        const passwordsList = data
          ? Object.entries(data).map(([key, value]) => ({
              passwordId: key,
              ...value,
            }))
          : [];
        setPasswords(passwordsList);
        setFilteredPasswords(passwordsList);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  const addPassword = () => {
    if (title && username && password && url && note && userId) {
      const newPasswordRef = push(ref(db, `users/${userId}/passwords`));
      set(newPasswordRef, {
        title,
        username,
        password,
        url,
        note,
      })
        .then(() => {
          alert('Password added!');
          clearForm();
        })
        .catch((error) => {
          alert('Error adding password: ' + error.message);
        });
    } else {
      alert('Please fill in all fields.');
    }
  };

  const clearForm = () => {
    setTitle('');
    setUsername('');
    setPassword('');
    setUrl('');
    setNote('');
  };

  const deletePassword = (passwordId: string) => {
    if (userId) {
      const passwordRef = ref(db, `users/${userId}/passwords/${passwordId}`);
      remove(passwordRef)
        .then(() => {
          alert('Password deleted!');
        })
        .catch((error) => {
          alert('Error deleting password: ' + error.message);
        });
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    alert('You have been logged out');
    navigation.navigate('login');
  };

  const openPasswordModal = (password: any) => {
    setSelectedPassword(password);
    setModalVisible(true);
  };

  const closePasswordModal = () => {
    setModalVisible(false);
    setSelectedPassword(null);
  };

  const saveChanges = () => {
    if (selectedPassword && userId) {
      const passwordRef = ref(db, `users/${userId}/passwords/${selectedPassword.passwordId}`);
      update(passwordRef, {
        title: selectedPassword.title,
        username: selectedPassword.username,
        password: selectedPassword.password,
        url: selectedPassword.url,
        note: selectedPassword.note,
      })
        .then(() => {
          alert('Changes saved successfully!');
          setModalVisible(false);
        })
        .catch((error) => {
          alert('Error saving changes: ' + error.message);
        });
    }
  };

  const filterPasswords = () => {
    const filtered = passwords.filter((item) =>
      item.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
    setFilteredPasswords(filtered);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>KeyCuddle</Text>

        {isLoggedIn && (
          <TouchableOpacity style={[styles.logoutButton, { marginBottom: 20 }]} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              secureTextEntry={!isPasswordVisible}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}
            >
              <Icon name={isPasswordVisible ? 'eye-slash' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="URL"
            value={url}
            onChangeText={setUrl}
          />
          <TextInput
            style={styles.input}
            placeholder="Note"
            value={note}
            onChangeText={setNote}
          />
          <Button title="Add Information" onPress={addPassword} color="#3498db" />
          <View style={{ marginBottom: 20 }} />
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={[styles.input, styles.searchInput]}
              placeholder="Search Title"
              value={searchTitle}
              onChangeText={setSearchTitle}
            />
            <TouchableOpacity style={styles.filterButton} onPress={filterPasswords}>
              <Text style={styles.filterButtonText}>Filter</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Title</Text>
            <Text style={styles.tableHeaderText}>Username</Text>
            <Text style={styles.tableHeaderText}>Action</Text>
          </View>

          <FlatList
            data={filteredPasswords}
            keyExtractor={(item) => item.passwordId}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={[styles.cardText, styles.titleColumn]}>{item.title}</Text>
                <Text style={[styles.cardText, styles.usernameColumn]}>{item.username}</Text>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => openPasswordModal(item)}
                >
                  <Text style={styles.viewText}>View/Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deletePassword(item.passwordId)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        {selectedPassword && (
          <Modal
            visible={isModalVisible}
            transparent
            animationType="slide"
            onRequestClose={closePasswordModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Password Details</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Title"
                  value={selectedPassword.title}
                  onChangeText={(text) =>
                    setSelectedPassword((prev) => ({ ...prev, title: text }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={selectedPassword.username}
                  onChangeText={(text) =>
                    setSelectedPassword((prev) => ({ ...prev, username: text }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={selectedPassword.password}
                  onChangeText={(text) =>
                    setSelectedPassword((prev) => ({ ...prev, password: text }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="URL"
                  value={selectedPassword.url}
                  onChangeText={(text) =>
                    setSelectedPassword((prev) => ({ ...prev, url: text }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Note"
                  value={selectedPassword.note}
                  onChangeText={(text) =>
                    setSelectedPassword((prev) => ({ ...prev, note: text }))
                  }
                />
                <Button title="Save Changes" onPress={saveChanges} color="#27ae60" />
                <Button title="Close" onPress={closePasswordModal} color="#e74c3c" />
              </View>
            </View>
          </Modal>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 20,
    color: 'black',
    fontFamily: 'Comic Sans MS',
    alignSelf: 'center'
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  logoutText: {
    color: '#ecf0f1',
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    backgroundColor: '#ecf0f1',
    width: '100%',
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 15,
    width: '100%',
  },
  passwordInput: {
    padding: 15,
    marginBottom: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    backgroundColor: '#ecf0f1',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 17,
  },
  tableContainer: {
    marginTop: 30,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#bdc3c7',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#34495e',
  },
  tableHeaderText: {
    color: '#ecf0f1',
    fontWeight: 'bold',
    width: '30%',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#bdc3c7',
  },
  cardText: {
    fontSize: 16,
    color: 'black',
  },
  titleColumn: {
    width: '30%',
  },
  usernameColumn: {
    width: '30%',
  },
  viewButton: {
    backgroundColor: '#3498db',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  viewText: {
    color: '#ecf0f1',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  deleteText: {
    color: '#ecf0f1',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#ecf0f1',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  searchContainer: {
    width: '100%',
    marginBottom: 15,
  },
  searchInputContainer: {
    position: 'relative',
    width: '100%',
  },
  searchInput: {
    paddingRight: 70, // Add padding to accommodate the button
  },
  filterButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#27ae60',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  filterButtonText: {
    color: '#ecf0f1',
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
  },

});

export default KeyCuddle;
