import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

interface PasswordEntry {
  title: string;
  username: string;
  password: string;
  isPasswordVisible: boolean;
  url: string;
  note: string;
}

const KeyCuddle: React.FC = () => {
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [groupFilter, setGroupFilter] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsername, setModalUsername] = useState('');
  const [modalPassword, setModalPassword] = useState('');
  const [modalUrl, setModalUrl] = useState('');
  const [modalNote, setModalNote] = useState('');
  
  // Adding a state to handle login
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Assuming the user is logged in by default
  
  // Use the navigation hook
  const navigation = useNavigation();

  const addPassword = () => {
    if (title && username && password && url && note) {
      const newPassword: PasswordEntry = {
        title,
        username,
        password,
        isPasswordVisible: false,
        url,
        note,
      };

      setPasswords([...passwords, newPassword]);
      clearForm();
    } else {
      alert('Please fill in all fields.');
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const deletePassword = (index: number) => {
    const updatedPasswords = passwords.filter((_, i) => i !== index);
    setPasswords(updatedPasswords);
  };

  const clearFilters = () => {
    setGroupFilter('');
  };

  const clearForm = () => {
    setTitle('');
    setUsername('');
    setPassword('');
    setUrl('');
    setNote('');
  };

  const filteredPasswords = groupFilter
    ? passwords.filter((p) => p.title.includes(groupFilter) || p.username.includes(groupFilter))
    : passwords;

  const openModal = (password: PasswordEntry) => {
    setSelectedPassword(password);
    setModalVisible(true);

    // Set modal states for editing
    setModalTitle(password.title);
    setModalUsername(password.username);
    setModalPassword(password.password);
    setModalUrl(password.url);
    setModalNote(password.note);

    setIsPasswordVisible(password.isPasswordVisible);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPassword(null);
  };

  const updatePassword = () => {
    if (selectedPassword) {
      const updatedPasswords = passwords.map((item) =>
        item === selectedPassword
          ? {
              ...item,
              title: modalTitle || item.title,
              username: modalUsername || item.username,
              password: modalPassword || item.password,
              url: modalUrl || item.url,
              note: modalNote || item.note,
              isPasswordVisible,
            }
          : item
      );
      setPasswords(updatedPasswords);
      closeModal();
    }
  };

  const removePassword = () => {
    if (selectedPassword) {
      const updatedPasswords = passwords.filter((item) => item !== selectedPassword);
      setPasswords(updatedPasswords);
      closeModal();
    }
  };

  const handleModalPasswordVisibilityToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Logout function to clear session or user info
  const logout = () => {
    setIsLoggedIn(false);
    alert('You have been logged out');
    // Navigate to Login screen
    navigation.navigate('login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KeyCuddle</Text>

      {/* Only show the logout button if the user is logged in */}
      {isLoggedIn && (
        <Button title="Logout" onPress={logout} color="red" />
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
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
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
        <Button title="Add Information" onPress={addPassword} />
      </View>

      <View style={styles.groupContainer}>
        <View style={styles.filterContainer}>
          <Text>Filter by Title or Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Filter"
            value={groupFilter}
            onChangeText={setGroupFilter}
          />
        </View>

        <Button title="Clear Filters" onPress={clearFilters} />
      </View>

      {/* Table Layout */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Title</Text>
          <Text style={styles.tableHeaderText}>Username</Text>
          <Text style={styles.tableHeaderText}>Action</Text>
        </View>

        <FlatList
          data={filteredPasswords}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.titleColumn]}>{item.title}</Text>
              <Text style={[styles.tableCell, styles.usernameColumn]}>{item.username}</Text>
              <View style={styles.viewButtonContainer}>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => openModal(item)}
                >
                  <Text style={styles.viewText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {/* Modal to show and edit full password details */}
      {selectedPassword && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>View/Edit {selectedPassword.title}</Text>

              <TextInput
                style={styles.input}
                placeholder="Title"
                value={modalTitle}
                onChangeText={setModalTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={modalUsername}
                onChangeText={setModalUsername}
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  value={modalPassword}
                  secureTextEntry={!isPasswordVisible}
                  onChangeText={setModalPassword}
                />
                <TouchableOpacity onPress={handleModalPasswordVisibilityToggle} style={styles.eyeIcon}>
                  <Icon name={isPasswordVisible ? 'eye-slash' : 'eye'} size={20} color="#888" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="URL"
                value={modalUrl}
                onChangeText={setModalUrl}
              />
              <TextInput
                style={styles.input}
                placeholder="Note"
                value={modalNote}
                onChangeText={setModalNote}
              />

              <Button title="Save Changes" onPress={updatePassword} />
              <Button title="Remove Information" onPress={removePassword} color="red" />
              <Button title="Close" onPress={closeModal} />
            </View>
          </View>
        </Modal>
      )}
    </View>
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
    fontSize: 24,
    marginBottom: 30,
    alignSelf: 'center',
  },
  formContainer: {
    marginBottom: 20,
    width: '100%',
  },
  input: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    marginBottom: 8,
  },
  passwordInput: {
    padding: 10,
    width: '90%',
  },
  eyeIcon: {
    padding: 10,
  },
  groupContainer: {
    marginBottom: 20,
    width: '100%',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tableContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    padding: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
  },
  tableCell: {
    textAlign: 'center',
    padding: 5,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  titleColumn: {
    width: 50,
  },
  usernameColumn: {
    width: 75,
  },
  viewButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  viewButton: {
    backgroundColor: '#3498db',
    padding: 6,
    borderRadius: 3,
  },
  viewText: {
    color: 'white',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    alignSelf: 'center',
    fontSize: 12,
    color: '#777',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'flex-start',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default KeyCuddle;
