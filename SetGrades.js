import React, {useEffect, useState} from 'react';
import {Alert, Button, Platform, ScrollView, StyleSheet, Text, TextInput, View,} from 'react-native';
import {DataTable} from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import {currentIndex} from './HomeScreen'
import {Ionicons} from '@expo/vector-icons';

const jsonFileName = 'database.json';
const fileURI = `${FileSystem.documentDirectory}${jsonFileName}`;
let newData

function SetGrades() {

    const [JSONData, setJSONData] = useState([]);


    const fetchJSONData = async () => {
        const fileInfo = await FileSystem.getInfoAsync(fileURI);
        if (fileInfo.exists) {
            const fileContent = await FileSystem.readAsStringAsync(fileURI);
            const parsedData = JSON.parse(fileContent);
            setJSONData(parsedData);
        }
    };
    useEffect(() => {
        fetchJSONData()
        calculateAverage()
    }, [])

    const [examName, setExamName] = React.useState("");
    const [examGrade, setExamGrade] = React.useState(null);
    const [examCoefficient, setExamCoefficient] = React.useState(null);

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
            existingData[currentIndex].subject.exams.forEach(exam => {
                average += (parseFloat(exam.examGrade) * parseFloat(exam.examCoefficient))
                coefficient += parseFloat(exam.examCoefficient) - 1
            })
            average = average / (existingData[currentIndex].subject.exams.length + coefficient)
            average = Math.round(average * 10) / 10
            existingData[currentIndex].subject.average = average
            await FileSystem.writeAsStringAsync(fileURI, JSON.stringify(existingData, null, 2));
        } catch (error) {
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
            newData.examId = existingData[currentIndex].subject.exams.length

            // Add the new data
            existingData[currentIndex].subject.exams.push(newData);

            calculateAverage()

            // Write back the updated data
            await FileSystem.writeAsStringAsync(fileURI, JSON.stringify(existingData, null, 2));
            setExamName("");
            setExamGrade(null);
            setExamCoefficient(null);
            fetchJSONData();
        } catch (error) {
            Alert.alert('Error', 'Failed to update the JSON file.');
            console.error(error);
        }
    }

    const deleteRow = async (id) => {
        // Filter out the item with the given id
        const filteredExams = JSONData[currentIndex].subject.exams.filter(item => item.examId !== id);

        // Update the exams array in the original JSON structure
        JSONData[currentIndex].subject.exams = filteredExams.map(data => {
            if (data.examId > id) {
                return {
                    ...data,
                    examId: data.examId - 1
                };
            }
            return data;
        });

        // Save the updated entire JSONData back to the file
        await FileSystem.writeAsStringAsync(fileURI, JSON.stringify(JSONData, null, 2));

        // Update the local state with entire JSONData
        setJSONData(JSONData);
        fetchJSONData()
    }



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

    return (
        <View style={styles.container}>
                <View style={styles.elevatedBox}>
            <Text style={{fontSize: 22}}>Type in a new exam:</Text>
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
                onChangeText={number => handleGradeChange(number)}
                maxLength={3}
                value={examGrade}
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
            {/*<Text>{currentIndex}</Text>*/}
            <View paddingVertical={8} />
            <Text style={{fontSize: 22}}>Previous exams:</Text>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Exam name</DataTable.Title>
                        <DataTable.Title style={styles.cell}>Grade</DataTable.Title>
                        <DataTable.Title style={styles.cell} numeric>Coefficient</DataTable.Title>
                        <DataTable.Title></DataTable.Title>
                    </DataTable.Header>
                    <ScrollView flexBasis={500}>
                    {JSONData.length > 0 && JSONData[currentIndex].subject.exams.map((item) => (
                        <DataTable.Row key={item.examId}>
                            <DataTable.Cell>{item.examName}</DataTable.Cell>
                            <DataTable.Cell style={styles.cell} >{item.examGrade}</DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>{item.examCoefficient}</DataTable.Cell>
                            <DataTable.Cell style={styles.trash}><Ionicons
                                name={"trash-outline"}
                                size={20}
                                color="black"
                                onPress={() => {deleteRow(item.examId)}}
                            /></DataTable.Cell>
                        </DataTable.Row>
                    ))}
                    </ScrollView>
                </DataTable>
        </View>
    )
}


export default SetGrades;
