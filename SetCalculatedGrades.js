import React, {useEffect, useState} from 'react';
import {Alert, Button, Platform, ScrollView, StyleSheet, Text, TextInput, View,} from 'react-native';
import * as FileSystem from 'expo-file-system';
import RNPickerSelect from 'react-native-picker-select';
const jsonFileName = 'database.json';
const fileURI = `${FileSystem.documentDirectory}${jsonFileName}`;
let newData


function SetCalculatedGrades({navigation, route}) {

    const { grade } = route.params;
    const [JSONData, setJSONData] = useState([]);
    const [selSubject, setSubject] = useState([null])
    const [examName, setExamName] = useState("");
    const [examGrade, setExamGrade] = useState(grade);
    const [examCoefficient, setExamCoefficient] = useState(null);

    const handleGradeChange = (value) => {

        const cleanedText = value.replace(/\./g, '');

        let newValue = cleanedText;
        if (cleanedText.length >= 2) {
            newValue = cleanedText.substring(0, 1) + '.' + cleanedText.substring(1);
        }

        const floatValue = parseFloat(newValue);
        if (!isNaN(floatValue) && floatValue <= 6.0) {
            setExamGrade(newValue);
        } else if (cleanedText.length === 0) {
            setExamGrade('');
        }
    };

    const fetchJSONData = async () => {
        const fileInfo = await FileSystem.getInfoAsync(fileURI);
        if (fileInfo.exists) {
            const fileContent = await FileSystem.readAsStringAsync(fileURI);
            const parsedData = JSON.parse(fileContent);
            setJSONData(parsedData);
        }
    };
    useEffect(() => {
        setExamGrade(grade)
        fetchJSONData()
    }, [])

    newData = {
        examName: examName,
        examGrade: examGrade,
        examCoefficient: examCoefficient,
    };

    let coefficient = 0
    async function calculateAverage() {
        const fileInfo = await FileSystem.getInfoAsync(fileURI);
        let existingData = [];
        if (fileInfo.exists) {
            // Read the existing JSON file
            const fileContent = await FileSystem.readAsStringAsync(fileURI);
            existingData = JSON.parse(fileContent);
        }
        try {
            let average = 0
            existingData[selSubject].subject.exams.forEach(exam => {
                average += (parseFloat(exam.examGrade) * parseFloat(exam.examCoefficient))
                coefficient += parseFloat(exam.examCoefficient) - 1
            })
            average = average / (existingData[selSubject].subject.exams.length + coefficient)
            average = Math.round(average * 10) / 10
            existingData[selSubject].subject.average = average
            await FileSystem.writeAsStringAsync(fileURI, JSON.stringify(existingData, null, 2));
        } catch (error) {
            console.error(error)
            Alert.alert('Error', 'Could not calculate your average.');
        }
    }

    async function addValuesToJSONFile() {
        if (!newData.examName || !newData.examGrade || !newData.examCoefficient) {
            Alert.alert('Error', 'Please fill all the required fields.');
            return;
        }
        if (newData.examGrade > 6 || newData.examGrade < 1) {
            Alert.alert('Error', 'Please choose a valid grade')
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
            newData.examId = existingData[selSubject].subject.exams.length

            // Add the new data
            existingData[selSubject].subject.exams.push(newData);

            calculateAverage()

            // Write back the updated data
            await FileSystem.writeAsStringAsync(fileURI, JSON.stringify(existingData, null, 2));
            setExamName("");
            setExamGrade(null);
            setExamCoefficient(null);
            navigation.navigate('Grade Calculator')
        } catch (error) {
            Alert.alert('Error', 'Failed to update the JSON file.');
            console.error(error);
        }
    }


    const styles = StyleSheet.create({
        input: {
            borderColor: 'gray',
            ...(Platform.OS === 'android' && {height: 50}),
            width: '100%',
            borderWidth: 2,
            borderRadius: 10,
            padding: 10,
            marginVertical: 10,
        },
        container: {
            flex: 1,
            justifyContent: 'flex-start',
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
        elevatedBox: {
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
        cell: {
            flex: 1,
            justifyContent: "center"
        },
        trash: {
            flex: 1,
            justifyContent: "flex-end"
        },
    });

    const subject = []
    JSONData.forEach(data => {
        subject.push({
            id: data.index,
            label: data.subject.name,
            value: data.index,
        })
    })

    return (
        <View style={styles.container}>
            <View style={styles.elevatedBox}>
                <Text style={{fontSize: 22}}>Type in a new exam:</Text>
                <View style={{...(Platform.OS === 'android' && {marginBottom: 35}), ...styles.input}}>
                    <RNPickerSelect
                        placeholder={{
                            label: 'Select...',
                            value: null,
                            color: '#9EA0A4',}}
                        items={subject}
                        onValueChange={value => setSubject(value)}
                        value={selSubject}
                    />
                </View>
                <TextInput
                    placeholder="Exam name"
                    style={styles.input}
                    onChangeText={text => setExamName(text)}
                    value={examName}
                />
                <TextInput
                    placeholder="Grade"
                    keyboardType="numeric"
                    style={styles.input}
                    onChangeText={(text) => handleGradeChange(text)}
                    maxLength={3}
                    value={String(examGrade)}
                />
                <TextInput
                    placeholder="Coefficient (By default 1 or 2)"
                    keyboardType="numeric"
                    style={styles.input}
                    onChangeText={number => setExamCoefficient(number)}
                    value={examCoefficient}
                />
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
            <View paddingVertical={8} />
        </View>
    )
}


export default SetCalculatedGrades;
