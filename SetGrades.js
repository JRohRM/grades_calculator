import React, {useState, useEffect} from 'react';
import {
    View,
    Button,
    StyleSheet,
    TextInput,
    Alert,
    Platform, Text, ScrollView,
} from 'react-native';
import {DataTable} from 'react-native-paper';
import {currentIndex} from './HomeScreen'
import * as FileSystem from 'expo-file-system';
import {Ionicons} from "@expo/vector-icons";

const jsonFileName = 'database.json';
const fileURI = `${FileSystem.documentDirectory}${jsonFileName}`;


function SetGrades() {

    const [JSONData, setJSONData] = useState([]);

    useEffect(() => {
        const fetchJSONData = async () => {
            const fileInfo = await FileSystem.getInfoAsync(fileURI);
            if (fileInfo.exists) {
                const fileContent = await FileSystem.readAsStringAsync(fileURI);
                const parsedData = JSON.parse(fileContent);
                // console.log(parsedData)
                setJSONData(parsedData);
            }
        };
    })


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
    });

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 22}}>Type in a new exam</Text>
            <TextInput
                placeholder="Exam name"
                style={styles.input}
                // onChangeText={text => setSubject(text)}
            />
            <TextInput
                placeholder="Grade"
                style={styles.input}
                // onChangeText={text => setSubject(text)}
            />
            <TextInput
                placeholder="Coefficient"
                style={styles.input}
                // onChangeText={text => setSubject(text)}
            />
            {/*<Text>{currentIndex}</Text>*/}
            <Text style={{fontSize: 22}}>Previous exams:</Text>
            <ScrollView>
                <DataTable>
                    {/*{JSONData.length > 0 && JSONData.map((item) => (*/}
                    {/*    <DataTable.Row key={item.index}>*/}
                    {/*        <DataTable.Cell>{item.subject.name}</DataTable.Cell>*/}
                    {/*        <DataTable.Cell style={styles.cell} >{item.subject.weight}</DataTable.Cell>*/}
                    {/*        <DataTable.Cell style={styles.cell}><Ionicons*/}
                    {/*            name={"trash-outline"}*/}
                    {/*            size={20}*/}
                    {/*            color="black"*/}
                    {/*            onPress={() => {deleteRow(item.index)}}*/}
                    {/*        />*/}
                    {/*        </DataTable.Cell>*/}
                    {/*    </DataTable.Row>*/}
                    {/*))}*/}
                </DataTable>
            </ScrollView>
        </View>
    )
}
export default SetGrades;
