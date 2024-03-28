import React, {useState, useCallback} from 'react';
import { BarChart } from "react-native-gifted-charts";
import {View, StyleSheet, Dimensions} from 'react-native';
import * as FileSystem from "expo-file-system";
import {useFocusEffect} from "@react-navigation/native";

const jsonFileName = 'database.json';
const fileURI = `${FileSystem.documentDirectory}${jsonFileName}`;


const GraphCard = (props) => {
    const [JSONData, setJSONData] = useState([]);

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
            };
        }, [refreshData])
    );

    if (props.width) {
        // c'est que c'est un pourcentage
        if (typeof props.width == "string") {
            props.width = parseFloat(props.width) / 100
        }
    }


    const chosenWidth = props.width ?? Dimensions.get('window').width;

    const elevatedBoxWidth = chosenWidth * 0.9;
    const chartWidth = elevatedBoxWidth * 0.7;

    const barData = [];
    JSONData.forEach(data => {
        if (data.subject.average !== null) {
            barData.push({
                label: data.subject.name,
                value: data.subject.average,
                frontColor: data.subject.weight === 'Primary' ? '#efb810' : '#5a9dcd',
                spacing: 40
            })

        }
    })


    const styles = StyleSheet.create({
        elevatedBox: {
            width: elevatedBoxWidth,
            padding: 20,
            borderRadius: 10,
            backgroundColor: '#fff',
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        }
    })
    return (
                <View style={styles.elevatedBox}>
                    <BarChart
                        width={chartWidth}
                        maxValue={6}
                        noOfSections={6}
                        barWidth={22}
                        barBorderTopRightRadius={4}
                        barBorderTopLeftRadius={4}
                        frontColor="lightgray"
                        data={barData}
                        isAnimated
                        yAxisThickness={1}
                        xAxisThickness={1}
                        contentInset={{ right: 20 }}
                    />

                </View>
    );
};

export default GraphCard;
