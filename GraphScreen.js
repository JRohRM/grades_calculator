import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Text, TextInput, Keyboard, TouchableWithoutFeedback} from 'react-native';
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from '@react-navigation/native';
import GraphCard from "./GraphCard"
import Carousel from 'react-native-reanimated-carousel';

const jsonFileName = 'database.json';
const fileURI = `${FileSystem.documentDirectory}${jsonFileName}`;

const GraphScreen = () => {

    const [JSONData, setJSONData] = useState([]);
    const [goals, setGoals] = useState({});
    const [nrExam, setNrExam] = useState({});
    const [objectives, setObjectives] = useState({})

    const refreshData = useCallback(async () => {
        const fileInfo = await FileSystem.getInfoAsync(fileURI);
        if (fileInfo.exists) {
            const fileContent = await FileSystem.readAsStringAsync(fileURI);
            const parsedData = JSON.parse(fileContent);

            // Update state with fetched data
            setJSONData(parsedData);

            const initialGoals = {};
            const initialNrExams = {};
            const updatedData = parsedData.map((data) => {
                initialGoals[data.index] = data.subject.goal.toString() || '';
                initialNrExams[data.index] = data.subject.goalRange.toString() || '';

                // Call calculateGoal here for each item and immediately use the returned data
                return calculateGoal(data.index, data.subject.goal, data.subject.goalRange, data);
            });

            setGoals(initialGoals);
            setNrExam(initialNrExams);

            setJSONData(updatedData);
        }
    }, [calculateGoal]);




    useFocusEffect(
        useCallback(() => {
            const fetchDataAndCalculateGoals = async () => {
                await refreshData();
            };
            fetchDataAndCalculateGoals();
        }, [refreshData])
    );



    useEffect(() => {
        const saveDataToFile = async () => {
            const jsonDataString = JSON.stringify(JSONData);
            await FileSystem.writeAsStringAsync(fileURI, jsonDataString);
        };

        if (JSONData.length > 0) {
            saveDataToFile();
        }
    }, [JSONData]);

    const calculateGoal = (subjectId, newGoal, newNrExam, item) => {
        let coeff = 0;
        item.subject.exams.forEach(exam => {
            coeff += parseInt(exam.examCoefficient, 10);
        });

        let myObjective = (newNrExam * newGoal + coeff * newGoal - coeff * item.subject.average) / newNrExam;
        myObjective = parseFloat(myObjective.toFixed(1));
        // console.log(`${item.subject.name}: ${myObjective}`);
        myObjective = myObjective > 6 || myObjective < 1 ? 'It\'s unfortunately impossible :(' : myObjective;

        setObjectives(prevObjectives => ({
            ...prevObjectives,
            [subjectId]: myObjective
        }));

        // Return updated item with new values
        return {
            ...item,
            subject: {
                ...item.subject,
                goal: newGoal,
                goalRange: newNrExam
            }
        };
    };


    const handleGoalChange = (value, subjectId) => {
        const cleanedText = value.replace(/\./g, '');
        let newValue = cleanedText;
        if (cleanedText.length >= 2) {
            newValue = cleanedText.substring(0, 1) + '.' + cleanedText.substring(1);
        }

        const floatValue = parseFloat(newValue);
        if (!isNaN(floatValue) && floatValue <= 6.0) {
            setGoals(prevGoals => ({
                ...prevGoals,
                [subjectId]: newValue
            }));
            JSONData.forEach((data) => {
                if (data.index === subjectId) {
                    calculateGoal(subjectId, floatValue, parseInt(nrExam[subjectId], 10), data);
                }
            })
        } else if (cleanedText.length === 0) {
            setGoals(prevGoals => ({
                ...prevGoals,
                [subjectId]: ''
            }));
            JSONData.forEach((data) => {
                if (data.index === subjectId) {
                    calculateGoal(subjectId, 0, parseInt(nrExam[subjectId], 10), data);
                }
            })
        }
        setJSONData(currentData =>
            currentData.map(item => {
                if (item.index === subjectId) {
                    return calculateGoal(subjectId, floatValue, parseInt(nrExam[subjectId], 10), item);
                }
                return item;
            })
        );
    };

    const handleNrExamChange = (value, subjectId) => {
        if (!isNaN(parseInt(value, 10)) && parseInt(value, 10) <= 9) {
            setNrExam(prevNrExam => ({
                ...prevNrExam,
                [subjectId]: value
            }));
            JSONData.forEach((data) => {
                if (data.index === subjectId) {
                    calculateGoal(subjectId, parseFloat(goals[subjectId]), parseInt(value, 10), data);
                }
            })
        } else if (value.length === 0) {
            setNrExam(prevNrExam => ({
                ...prevNrExam,
                [subjectId]: ''
            }));
                JSONData.forEach((data) => {
                    if (data.index === subjectId) {
                        calculateGoal(subjectId, parseFloat(goals[subjectId]), 0, data);
                    }
                })
        }
        setJSONData(currentData =>
            currentData.map(item => {
                if (item.index === subjectId) {
                    return calculateGoal(subjectId, parseFloat(goals[subjectId]), parseInt(value, 10), item);
                }
                return item;
            })
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            alignSelf: 'center',
            justifyContent: 'center',
        },
        elevatedBox: {
            marginVertical: 20,
            marginHorizontal: 10,
            padding: 20,
            borderRadius: 10,
            backgroundColor: '#fff',
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        },
        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
        },
        cardBody: {
            flexDirection: 'row',
            paddingVertical: 20,
        },
        titleText: {
            fontSize: 20,
            fontWeight: 'bold',
            paddingBottom: 8,
        },
    })
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
        <View style={{padding: 20}}>
            <GraphCard/>
        </View>
        <Carousel
            style={{ width: '100%', height: 300}}
            data={JSONData}
            renderItem={({ item }) => (
                <View style={styles.elevatedBox} key={item.index.toString()}>
                    <View style={{flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10}}>
                    <Text style={styles.titleText}>{item.subject.name}</Text>
                    <Text>Average: {item.subject.average}</Text>
                    </View>
                    <View style={styles.cardHeader}>
                        <View style={{flexDirection: "row", alignItems: 'center'}}>
                        <Text nativeID="goal">Goal: </Text>
                        <TextInput
                            aria-labelledby="goal"
                            placeholder="x"
                            onChangeText={(goal) => handleGoalChange(goal, item.index)}
                            value={goals[item.index]}
                            keyboardType="numeric"
                            maxLength={3}
                        />
                        </View>
                        <View style={{flexDirection: "row", alignItems: 'center'}}>
                            <Text>On </Text>
                            <TextInput
                                placeholder="x"
                                onChangeText={(exam) => handleNrExamChange(exam, item.index)}
                                value={nrExam[item.index]}
                                maxLength={1}
                                keyboardType="numeric"
                            />
                            <Text> exam(s)</Text>
                        </View>
                    </View>
                    <View style={styles.cardBody}>
                        {
                            typeof objectives[item.index] === 'string' ?
                                <Text>{objectives[item.index]}</Text> : <Text>On {nrExam[item.index]} exam(s) you should do a {objectives[item.index]} to reach your goal.</Text>
                        }
                    </View>
                </View>
            )}
            loop={false}
            width={300}
            height={300}
            autoPlay={false}
        />
    </View>
        </TouchableWithoutFeedback>
    );
};

export default GraphScreen;
