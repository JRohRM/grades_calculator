import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
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
  return (
    <View style={styles.container}>
      {/*<Text>Settings</Text>*/}
      <Button onPress={wipeData} color={"red"} title={"Wipe Data"}></Button>
      {/*<Switch*/}
      {/*    trackColor={{false: '#767577', true: '#639aff'}}*/}
      {/*    thumbColor={isEnabled ? '#efb810' : '#f4f3f4'}*/}
      {/*    ios_backgroundColor="#3e3e3e"*/}
      {/*    onValueChange={toggleSwitch}*/}
      {/*    value={isEnabled}*/}
      {/*/>*/}
      {/*<Switch*/}

      {/*    trackColor={{false: '#767577', true: '#639aff'}}*/}
      {/*    thumbColor={isEnabled ? '#efb810' : '#f4f3f4'}*/}
      {/*    ios_backgroundColor="#3e3e3e"*/}
      {/*    onValueChange={toggleSwitch}*/}
      {/*    value={isEnabled}*/}
      {/*/>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Settings;
