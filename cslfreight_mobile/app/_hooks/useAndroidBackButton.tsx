import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';

/**
 * Custom hook to handle Android hardware back button
 * This automatically navigates back to the previous screen when the back button is pressed
 */
export const useAndroidBackButton = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const backAction = () => {
            // If navigation can go back, go back
            if (navigation.canGoBack()) {
                navigation.goBack();
                return true; // Prevent default back behavior
            }
            // If we can't go back, allow default behavior (exit app)
            return false;
        };

        // Subscribe to the hardware back press
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        // Cleanup the listener when component unmounts
        return () => backHandler.remove();
    }, [navigation]);
};
