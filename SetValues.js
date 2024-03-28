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
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {currentIndex} from './HomeScreen'
const jsonFileName = 'database.json';
const fileURI = `${FileSystem.documentDirectory}${jsonFileName}`;
import {useCallback, useEffect, useState} from "react";
import {useFocusEffect} from "@react-navigation/native";


let newData;
const SetValues = () => {
  const [subject, setSubject] = useState('');
  const [selWeight, setWeight] = useState(null);
  const [JSONData, setJSONData] = useState([]);

  const refreshData = useCallback(() => {
    const fetchJSONData = async () => {
      const fileInfo = await FileSystem.getInfoAsync(fileURI);
      if (fileInfo.exists) {
        const fileContent = await FileSystem.readAsStringAsync(fileURI);
        const parsedData = JSON.parse(fileContent);
        setJSONData(parsedData);
      }
    };
    fetchJSONData()
  }, []);

  useFocusEffect(
      useCallback(() => {
        refreshData();
      }, [refreshData])
  );

  useEffect(() => {
    if (currentIndex !== undefined && JSONData.length > 0) {
      updateSubjectAndWeight();
    }
  }, [JSONData, currentIndex]);  // Add JSONData and currentIndex as dependencies

  const updateSubjectAndWeight = () => {
    setWeight(JSONData[currentIndex].subject.weight);
    setSubject(JSONData[currentIndex].subject.name);
  };

  newData = {
      subject: {
        name: subject,
        weight: selWeight,
      },
    };

  const weight = [
    {id: 0, label: 'Primary', value: 'Primary'},
    {id: 1, label: 'Secondary', value: 'Secondary'},
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
    elevatedBox: {
      margin: 15,
      padding: 20,
      borderRadius: 10,
      backgroundColor: '#fff',
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  });


  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
      <View style={styles.elevatedBox}>
        <TextInput
            placeholder="Subject"
            placeholderTextColor='#c5c5c7'
            value={subject}
            style={{paddingLeft: 10, ...styles.input }}
            onChangeText={text => setSubject(text)}
        />
      <View paddingVertical={5} />
      <View style={{...(Platform.OS === 'android' && {marginBottom: 35}), ...styles.input}}>
        <RNPickerSelect
          placeholder={placeholder}
          items={weight}
          onValueChange={value => setWeight(value)}
          value={selWeight}
          useNativeAndroidPickerStyle={false}
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
      </View>
      </KeyboardAwareScrollView>
    </View>
  );
}


async function addValuesToJSONFile() {
  if (!newData.subject.name || !newData.subject.weight) {
    Alert.alert('Error', 'Please fill all the required fields.');
    return;
  }

  try {
    const fileInfo = await FileSystem.getInfoAsync(fileURI);
    let existingData = [];
    if (fileInfo.exists) {
      const fileContent = await FileSystem.readAsStringAsync(fileURI);
      existingData = JSON.parse(fileContent);
    }

    if (currentIndex !== undefined) {
      const existingSubject = existingData[currentIndex].subject;

      existingSubject.name = newData.subject.name;
      existingSubject.weight = newData.subject.weight;
    } else {
      newData.index = existingData.length;
      newData.subject.exams = [];
      newData.subject.goal = 4.5
      newData.subject.goalRange = 2
      newData.subject.average = null;
      existingData.push(newData);
    }

    await FileSystem.writeAsStringAsync(fileURI, JSON.stringify(existingData, null, 2));
    EventRegister.emit('goBackHome');
  } catch (error) {
    Alert.alert('Error', 'Failed to update the JSON file.');
    console.error(error);
  }
}


export default SetValues;
