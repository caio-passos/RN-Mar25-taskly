import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { AppContext } from "../App";

interface ProgressBarProps {
    progress: number;
}


const ProgressBar = ({ progress }: ProgressBarProps) => {
    const animatedStyles = useAnimatedStyle(() => {
        return {
            width: withTiming(`${progress}%`, { duration: 1000 }),
        };
    });

    const colors = useContext(AppContext)!.colors;
    const styles = StyleSheet.create({
        container: {
            width: '100%',
            height: 10,
            backgroundColor: colors.PrimaryLight,
            borderRadius: 5,
            overflow: 'hidden',
        },
        progressBar: {
            height: '100%',
            backgroundColor: colors.Primary
        },
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.progressBar, animatedStyles]} />
        </View>
    );
};

export default ProgressBar;