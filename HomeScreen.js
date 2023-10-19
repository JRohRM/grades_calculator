import React, {useState, useEffect} from 'react';
import {ScrollView, View, Button, StyleSheet, Alert, Text} from 'react-native';
import {DataTable} from 'react-native-paper';
import {Ionicons} from '@expo/vector-icons';
import {EventRegister} from 'react-native-event-listeners';
import * as FileSystem from 'expo-file-system';

const jsonFileName = 'database.json';
const fileURI = `${FileSystem.documentDirectory}${jsonFileName}`;

let currentIndex

function Home({ navigation }) {
    const [JSONData, setJSONData] = useState([]);

    useEffect(() => {

        EventRegister.addEventListener('goBackHome', () => {
            fetchJSONData();
            navigation.navigate('Home')
        });
        const fetchJSONData = async () => {
            const fileInfo = await FileSystem.getInfoAsync(fileURI);
            if (fileInfo.exists) {
                const fileContent = await FileSystem.readAsStringAsync(fileURI);
                const parsedData = JSON.parse(fileContent);
                // console.log(parsedData)
                setJSONData(parsedData);
            }
        };

        fetchJSONData()

        EventRegister.addEventListener('goToSetValues', () => {
            navigation.navigate('Set Values');
        });

    }, [navigation]);

    const goToSetGrades = (index) => {
        navigation.navigate('Grades')
        currentIndex = index
    }

    const deleteRow = async (id) => {
        // filter out the item with the given id
        const updatedData = JSONData.filter(item => item.index !== id);
        JSONData.forEach(data => {
            if (data.index > id) {
                data.index -= 1
            }
            console.log(data)
        })


        // save the updated data back to the file
        await FileSystem.writeAsStringAsync(fileURI, JSON.stringify(updatedData, null, 2));

        // update the local state
        setJSONData(updatedData);
    }

    return (
        <View style={styles.container}>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Subject</DataTable.Title>
                    {/*<DataTable.Title style={styles.cell} numeric>Average</DataTable.Title>*/}
                    <DataTable.Title style={styles.cell}>Coefficient</DataTable.Title>
                    <DataTable.Title></DataTable.Title>
                </DataTable.Header>
                {JSONData.length > 0 && JSONData.map((item) => (
                    <DataTable.Row key={item.index} onPress={() => {goToSetGrades(item.index)}}>
                        <DataTable.Cell>{item.subject.name}</DataTable.Cell>
                        {/*<DataTable.Cell style={styles.cell} numeric>unknown</DataTable.Cell>*/}
                        <DataTable.Cell style={styles.cell} >{item.subject.weight}</DataTable.Cell>
                        <DataTable.Cell style={styles.cell}><Ionicons
                            name={"trash-outline"}
                            size={20}
                            color="black"
                            onPress={() => {deleteRow(item.index)}}
                        />
                        </DataTable.Cell>
                    </DataTable.Row>
                ))}
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
    }
});

export { currentIndex }

export default Home;
