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
  
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
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

  const logout = () => {
    setIsLoggedIn(false);
    alert('You have been logged out');
    navigation.navigate('login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KeyCuddle</Text>

      {isLoggedIn && (
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
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
        <Button title="Add Information" onPress={addPassword} color="#3498db" />
      </View>

      <View style={styles.groupContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by Title or Username"
          value={groupFilter}
          onChangeText={setGroupFilter}
        />
        <Button title="Clear Filters" onPress={clearFilters} color="#27ae60" />
      </View>

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
            <View style={styles.card}>
              <Text style={[styles.cardText, styles.titleColumn]}>{item.title}</Text>
              <Text style={[styles.cardText, styles.usernameColumn]}>{item.username}</Text>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => openModal(item)}
              >
                <Text style={styles.viewText}>View</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

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

              <Button title="Save Changes" onPress={updatePassword} color="#2980b9"  />
              <Button title="Remove Information" onPress={removePassword} color="tomato"  />
              <Button title="Close" onPress={closeModal} color="#34495e"  />
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
  groupContainer: {
    marginTop: 30,
    width: '100%',
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
  filterInput: {
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    backgroundColor: '#ecf0f1',
    width: '100%',
  },
  modalButton: {
    marginBottom: 15, 
  },
});

export default KeyCuddle;