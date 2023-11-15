import React, {useState, useEffect, useCallback} from 'react';
import {ScrollView, View, Button, StyleSheet, Alert, Text} from 'react-native';
import {DataTable} from 'react-native-paper';
import {Ionicons} from '@expo/vector-icons';
import {EventRegister} from 'react-native-event-listeners';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';


const jsonFileName = 'database.json';
const fileURI = `${FileSystem.documentDirectory}${jsonFileName}`;

let currentIndex

function Home({ navigation }) {
    const [JSONData, setJSONData] = useState([]);
    let primaryExists = false
    let secondaryExists = false
    let noneExists = false


    useEffect(() => {

        EventRegister.addEventListener('goBackHome', () => {
            navigation.navigate('Home')
        });

        EventRegister.addEventListener('goToSetValues', () => {
            navigation.navigate('Set Values');
        });

    }, [navigation]);

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
            return () => {
                // Optional: Any cleanup logic goes here
            };
        }, [refreshData])
    );

    const goToSetGrades = (index) => {
        navigation.navigate('Grades')
        currentIndex = index
    }

    const deleteRow = async (id) => {
        const updatedData = JSONData.filter(item => item.index !== id);
        JSONData.forEach(data => {
            if (data.index > id) {
                data.index -= 1
            }
        })

        await FileSystem.writeAsStringAsync(fileURI, JSON.stringify(updatedData, null, 2));

        setJSONData(updatedData);
    }
    const showConfirmDialog = (index) => {
        return Alert.alert(
            "Are your sure?",
            "Are you sure you want to delete this row?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        deleteRow(index);
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
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Subject</DataTable.Title>
                    {/*<DataTable.Title style={styles.cell}>Weight</DataTable.Title>*/}
                    <DataTable.Title style={styles.cell} numeric>Average</DataTable.Title>
                    <DataTable.Title></DataTable.Title>
                </DataTable.Header>
                <ScrollView flexBasis={500}>
                    <DataTable.Header style={styles.weight}>
                        <DataTable.Title style={styles.weightTitle}>Primary</DataTable.Title>
                    </DataTable.Header>
                    {
                        JSONData.length > 0 && JSONData.map((item) => (
                            item.subject.weight === 'Primary' && (
                                <DataTable.Row key={item.index} onPress={() => { goToSetGrades(item.index) }}>
                                    <DataTable.Cell>{item.subject.name}</DataTable.Cell>
                                    {/*<DataTable.Cell style={styles.cell}>{item.subject.weight}</DataTable.Cell>*/}
                                    <DataTable.Cell style={styles.cell} numeric>{item.subject.average}</DataTable.Cell>
                                    <DataTable.Cell style={styles.trash}>
                                        <Ionicons
                                            name={"trash-outline"}
                                            size={20}
                                            color="black"
                                            onPress={() => { showConfirmDialog(item.index) }}
                                        />
                                    </DataTable.Cell>
                                </DataTable.Row>
                            )

                        ))
                    }
                    <DataTable.Header style={styles.weight}>
                        <DataTable.Title style={styles.weightTitle}>Secondary</DataTable.Title>
                    </DataTable.Header>
                    {
                        JSONData.length > 0 && JSONData.map((item) => (
                            item.subject.weight === 'Secondary' && (
                                <DataTable.Row key={item.index} onPress={() => { goToSetGrades(item.index) }}>
                                    <DataTable.Cell>{item.subject.name}</DataTable.Cell>
                                    {/*<DataTable.Cell style={styles.cell}>{item.subject.weight}</DataTable.Cell>*/}
                                    <DataTable.Cell style={styles.cell} numeric>{item.subject.average}</DataTable.Cell>
                                    <DataTable.Cell style={styles.trash}>
                                        <Ionicons
                                            name={"trash-outline"}
                                            size={20}
                                            color="black"
                                            onPress={() => { showConfirmDialog(item.index) }}
                                        />
                                    </DataTable.Cell>
                                </DataTable.Row>
                            )

                        ))
                    }
                </ScrollView>
            </DataTable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    cell: {
        flex: 1,
        justifyContent: "center",
    },
    weight: {
        backgroundColor: '#c5c5c5',
        height: 25,
    },
    weightTitle: {
        fontSize: 10,
        position: 'absolute',
        top: -11,
        left: 15,
        right: 0,
    },
    trash: {
        flex: 1,
        justifyContent: "flex-end"
    },
});

export { currentIndex }

export default Home;
