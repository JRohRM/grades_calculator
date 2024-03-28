import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import * as FileSystem from "expo-file-system";

const Settings = () => {
  const jsonFileName = 'database.json';
  const fileURI = `${FileSystem.documentDirectory}${jsonFileName}`;
  async function wipeData() {
    try {

      // Write an empty array to the file
      await FileSystem.writeAsStringAsync(fileURI, JSON.stringify([], null, 2));
      console.log(JSON.parse(await FileSystem.readAsStringAsync(fileURI)))
      console.log("Data wiped successfully");
    } catch (error) {
      console.error("Error wiping the data:", error);
    }
  }

  const showConfirmDialog = (index) => {
    return Alert.alert(
        "Are your sure?",
        "This will wipe all your data.",
        [
          {
            text: "Yes",
            onPress: () => {
              wipeData();
            },
          },
          {
            text: "No",
          },
        ]
    );
  };
  return (
    <View style={styles.container}>
      <Button onPress={showConfirmDialog} color={"red"} title={"Wipe Data"}></Button>
      <View style={styles.comingSoon}>
        <Text>Some more languages are coming soon!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoon: {
    alignItems: 'center',
    margin: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 5, // elevation for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default Settings;
