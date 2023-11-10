import * as React from 'react';
import {
  View,
  Button,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as FileSystem from 'expo-file-system';
import {EventRegister} from 'react-native-event-listeners';


let newData;
const SetValues = () => {
  const [subject, setSubject] = React.useState('');
  const [selWeight, setWeight] = React.useState(null);
  newData = {
      subject: {
        name: subject,
        weight: selWeight,
      },
    };

  const weight = [
    {id: 0, label: 'Primary', value: 'Primary'},
    {id: 1, label: 'Secondary', value: 'Secondary'},
    {id: 2, label: 'None', value: "empty"}, // cannot set to null
  ];
  const placeholder = {
    label: 'Select...',
    value: null,
    color: '#9EA0A4',
  };

  const styles = StyleSheet.create({
    input: {
      borderColor: 'gray',
      width: '100%',
      borderWidth: 2,
      borderRadius: 10,
      padding: 10,
      marginVertical: 10,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
    },
    buttonContainer: {
      backgroundColor: '#EFB810FF',
      borderRadius: 10,
      padding: 10,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowRadius: 10,
      shadowOpacity: 0.25,
    },
  });


  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Subject"
        style={styles.input}
        onChangeText={text => setSubject(text)}
      />
      <View paddingVertical={5} />
      <View style={styles.input}>
        <RNPickerSelect
          placeholder={placeholder}
          items={weight}
          onValueChange={value => setWeight(value)}
          value={selWeight}
        />
      </View>
      {Platform.OS === 'ios' && (
        <View style={styles.buttonContainer}>
          <Button
            title="OK"
            color="#464648FF"
            onPress={addValuesToJSONFile}
          />
        </View>
      )}
      {Platform.OS === 'android' && (
        <Button
            title="OK"
            color="#EFB810FF"
            onPress={addValuesToJSONFile}
        />
      )}
      {/*<Button onPres={wipeData} color={"red"} title={"Wipe Data"}></Button>*/}
    </View>
  );
}

const jsonFileName = 'database.json';
const fileURI = `${FileSystem.documentDirectory}${jsonFileName}`;

async function addValuesToJSONFile() {
  // Check if the required values are set
  if (!newData.subject.name || !newData.subject.weight) {
    Alert.alert('Error', 'Please fill all the required fields.');
    return;
  }

  try {
    // Check if the file exists
    const fileInfo = await FileSystem.getInfoAsync(fileURI);
    let existingData = [];
    if (fileInfo.exists) {
      // Read the existing JSON file
      const fileContent = await FileSystem.readAsStringAsync(fileURI);
      existingData = JSON.parse(fileContent);
    }
    newData.index = existingData.length
    newData.subject.exams = []
    newData.average = null

    // Add the new data
    existingData.push(newData);

    // Write back the updated data
    await FileSystem.writeAsStringAsync(fileURI, JSON.stringify(existingData, null, 2));
    EventRegister.emit('goBackHome')
  } catch (error) {
    Alert.alert('Error', 'Failed to update the JSON file.');
    console.error(error);
  }
}


export default SetValues;
