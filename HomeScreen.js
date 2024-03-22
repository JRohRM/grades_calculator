import React, {useState, useEffect, useCallback} from 'react';
import {ScrollView, View, ImageBackground, StyleSheet, Alert, Text, TouchableOpacity, Animated} from 'react-native';
import {DataTable} from 'react-native-paper';
import {Ionicons} from '@expo/vector-icons';
import {EventRegister} from 'react-native-event-listeners';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';
import GraphCard from "./GraphCard"


const jsonFileName = 'database.json';
const fileURI = `${FileSystem.documentDirectory}${jsonFileName}`;
const source = require('./assets/graph.png');

let currentIndex

function Home({ navigation }) {
    const [JSONData, setJSONData] = useState([]);
    const [primaryAvg, setPrimaryAvg] = useState("N/A");
    const [secondaryAvg, setSecondaryAvg] = useState("N/A");
    const [globalAvg, setGlobalAvg] = useState("N/A");


    const refreshData = useCallback(() => {
        const fetchJSONData = async () => {
            const fileInfo = await FileSystem.getInfoAsync(fileURI);
            if (fileInfo.exists) {
                const fileContent = await FileSystem.readAsStringAsync(fileURI);
                const parsedData = JSON.parse(fileContent);
                setJSONData(parsedData);
                calculateAverages(parsedData);
            }
        };
        fetchJSONData()
    }, []);

    useEffect(
        useCallback(() => {

        EventRegister.addEventListener('goBackHome', () => {
            navigation.navigate('Home')
        });

        EventRegister.addEventListener('goToSetValues', () => {
            navigation.navigate('Set Values');
            currentIndex = undefined
        });

    }, [navigation]));

    useFocusEffect(
        useCallback(() => {
            refreshData();
        }, [refreshData])
    );

    const calculateAverages = (data) => {
        let primaryTotal = 0;
        let secondaryTotal = 0;
        let globalTotal = 0;
        let primaryCount = 0;
        let secondaryCount = 0;
        let globalCount = 0;

        data.forEach(item => {
            let avg = item.subject.average ?? "N/A";
            if (item.subject.weight === 'Primary' && avg !== "N/A") {
                primaryTotal += avg;
                primaryCount++;
            }
            if (item.subject.weight === 'Secondary' && avg !== "N/A") {
                secondaryTotal += avg;
                secondaryCount++;
            }
            if (avg !== "N/A") {
                globalTotal += avg;
                globalCount++;
            }
        });

        setPrimaryAvg(primaryCount > 0 ? (primaryTotal / primaryCount).toFixed(2) : "N/A");
        setSecondaryAvg(secondaryCount > 0 ? (secondaryTotal / secondaryCount).toFixed(2) : "N/A");
        setGlobalAvg(globalCount > 0 ? (globalTotal / globalCount).toFixed(2) : "N/A");
    };

    const goToSetGrades = (index) => {
        navigation.navigate('Grades')
        currentIndex = index
    }
    const editSubject = (index) => {
        currentIndex = index
        navigation.navigate('Set Values')
    }
    const goToGraph = () => {
        navigation.navigate('Monitoring')
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

    let IconComponent = Ionicons;

    return (
        <View style={styles.container}>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Subject</DataTable.Title>
                    <DataTable.Title style={styles.cell} numeric>Average</DataTable.Title>
                    <DataTable.Title></DataTable.Title>
                </DataTable.Header>
                <ScrollView style={styles.scrollView}>
                    <DataTable.Header style={styles.weight}>
                        <DataTable.Title style={styles.weightTitle}>Primary</DataTable.Title>
                        <DataTable.Title style={styles.average}>{primaryAvg}</DataTable.Title>
                    </DataTable.Header>
                    {
                        JSONData.length > 0 && JSONData.map((item) => (
                            item.subject.weight === 'Primary' && (
                                <DataTable.Row key={item.index} onLongPress={() => {editSubject(item.index)}} onPress={() => { goToSetGrades(item.index) }}>
                                    <DataTable.Cell>{item.subject.name}</DataTable.Cell>
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
                        <DataTable.Title style={styles.average}>{secondaryAvg}</DataTable.Title>
                    </DataTable.Header>
                    {
                        JSONData.length > 0 && JSONData.map((item) => (
                            item.subject.weight === 'Secondary' && (
                                <DataTable.Row key={item.index} onLongPress={() => {editSubject(item.index)}} onPress={() => { goToSetGrades(item.index) }}>
                                    <DataTable.Cell>{item.subject.name}</DataTable.Cell>
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
                        <DataTable.Title style={styles.average}>{globalAvg}</DataTable.Title>
                    </DataTable.Header>
                </ScrollView>
            </DataTable>
            <View style={styles.linkToMonitoring}>
                <GraphCard width={350} ></GraphCard>
                <TouchableOpacity onPress={() => {goToGraph()}} /*style={styles.textContainer}*/>
                    <IconComponent name={"chevron-forward"} size={50}/>
                </TouchableOpacity>
            </View>
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
    average: {
        fontSize: 10,
        position: 'absolute',
        top: -11,
        // left: 0,
        right: 15,
    },
    trash: {
        flex: 1,
        justifyContent: "flex-end"
    },
    elevatedBox: {
        width: '90%',
        height: '35%',
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
    image: {
        width: '100%',
        height: '90%',
        radius: 10,
    },
    textContainer: {
        flex: 1,
        bottom: 0,
        backgroundColor: '#efb810',
        borderRadius: 10,
        width: '112.7%',
        height: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
    },
    scrollView: {
        height: '50%'
    },
    linkToMonitoring: {
        marginHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export { currentIndex }

export default Home;
