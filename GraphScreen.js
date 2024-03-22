import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import * as FileSystem from "expo-file-system";
import GraphCard from "./GraphCard"

const GraphScreen = () => {


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignSelf: 'center',
            justifyContent: 'center',
        },
        comingSoon: {
            alignItems: 'center',
            margin: 20,
            padding: 10,
            backgroundColor: 'white',
            borderRadius: 4,
            elevation: 5, // elevation for Android
            shadowColor: '#000', // shadow for iOS
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
        }
    })
    return (
    <View style={styles.container}>
            <GraphCard></GraphCard>
        <View style={styles.comingSoon}>
            <Text>New Features Coming Soon</Text>
        </View>
    </View>
    );
};

export default GraphScreen;
