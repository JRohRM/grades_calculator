import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Switch,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const GradeCalculatorScreen = () => {
  const [maxPoints, setMaxPoints] = useState('');
  const [obtainedPoints, setObtainedPoints] = useState('');
  const [grade, setGrade] = useState(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const calculateGrade = () => {
    if (isNaN(parseFloat(maxPoints)) || isNaN(parseFloat(obtainedPoints))) {
      if (!maxPoints || !obtainedPoints) {
        alert('Please input both maximum and obtained points.');
        return;
      } else {
        alert('Please input valid numbers.');
        return;
      }
    } else if (parseFloat(maxPoints) < parseFloat(obtainedPoints)) {
      console.log('obt:' + obtainedPoints + ' max:' + maxPoints);
      alert('Obtained points cannot be greater than maximum points.');
      return;
    }

    let notRoundedCalculatedGrade =
      Math.round(
        ((parseFloat(obtainedPoints) / parseFloat(maxPoints)) * 5 + 1) * 10000,
      ) / 10000;
    let calculatedGrade = Math.round(notRoundedCalculatedGrade * 10) / 10;

    setGrade(isEnabled ? calculatedGrade : notRoundedCalculatedGrade);
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView style={{flex: 1}}>
        <View style={styles.elevatedBox}>
        <View style={styles.switch}>
          {Platform.OS === 'ios' && (
          <Text style={styles.switchTxt}>Rounded</Text>
              )}
          {Platform.OS === 'android' && (
              <Text style={styles.switchTxtAndroid}>Rounded</Text>
          )}
          <Switch
            trackColor={{false: '#767577', true: '#5a9dcd'}}
            thumbColor={isEnabled ? '#efb810' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <TextInput
          placeholder="Max points"
          keyboardType="numeric"
          value={maxPoints}
          onChangeText={setMaxPoints}
          style={styles.input}
        />

        <TextInput
          placeholder="Obtained points"
          keyboardType="numeric"
          value={obtainedPoints}
          onChangeText={setObtainedPoints}
          style={styles.input}
        />
        {Platform.OS === 'ios' && (
          <View style={styles.buttonContainer}>
            <Button
              title="Calculate Grade"
              color="#464648FF"
              onPress={calculateGrade}
            />
          </View>
        )}
        {Platform.OS === 'android' && (
            <View style={{marginVertical: 10}}>
          <Button
            title="Calculate Grade"
            color="#efb810"
            onPress={calculateGrade}
          />
            </View>
        )}

        {grade && <Text style={styles.gradeText}>Your Grade: {grade}</Text>}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  switchTxtAndroid: {
    paddingTop: 13,
    fontSize: 15,
  },
  switchTxt: {
    padding: 6,
    fontSize: 15,
  },
  switch: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    padding: 5,
  },
  title: {
    textAlign: 'center',
    justifyContent: 'flex-start',
    fontSize: 28,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 2,
    width: '100%',
    borderColor: 'gray',
    padding: 8,
    borderRadius: 10,
    marginVertical: 10,
  },
  gradeText: {
    marginTop: 20,
    fontSize: 24,
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
    // Pour donner l'effet de surélévation
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default GradeCalculatorScreen;
