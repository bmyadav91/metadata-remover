import React from 'react';
import RNBootSplash from "react-native-bootsplash";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './navigationRef';

// service 
import { TelemetryService } from '@/services/TelemetryService';

//  Import Routes and Types
import { APP_ROUTES } from './routes';

// home feature ============> 
import { HomeScreen } from '@/features/home/HomeScreen';

// file feature ================> 
import { FileListScreen } from '@/features/file/screens/List';
import { FileDetailScreen } from '@/features/file/screens/Details';
import { DownloadSettingsScreen } from '@/features/file/screens/DownloadSettings';
import { DownloadReportScreen } from '@/features/file/screens/DownloadReport';

// privacy feature ====================> 
import { PrivacySettingsScreen } from '@/features/policy/PrivacyPolicy';



const Stack = createNativeStackNavigator();

export const RootNavigator = () => {

    return (
        <NavigationContainer
            ref={navigationRef}

            onReady={() => {
                try {
                    const route = navigationRef?.getCurrentRoute();
                    if (route?.name) {
                        TelemetryService.logScreen(route?.name);
                    }
                } catch (e) {
                    console.warn('Screen tracking onReady failed', e);
                }

                RNBootSplash.hide({ fade: true });
            }}

            onStateChange={() => {
                try {
                    const route = navigationRef?.getCurrentRoute();
                    if (route?.name) {
                        TelemetryService.logScreen(route?.name);
                    }
                } catch (e) {
                    console.warn('Screen tracking onStateChange failed', e);
                }
            }}
        >
            <Stack.Navigator screenOptions={{ headerShown: false }}>

                {/* ================= home feature =================  */}

                <Stack.Screen
                    name={APP_ROUTES.HOME_FEATURE.HOME_MAIN}
                    component={HomeScreen}
                />


                {/* ===================== file feature =============== */}

                <Stack.Screen
                    name={APP_ROUTES.FILE_FEATURE.FILE_LIST}
                    component={FileListScreen}
                />
                <Stack.Screen
                    name={APP_ROUTES.FILE_FEATURE.FILE_DETAILS}
                    component={FileDetailScreen}
                />
                <Stack.Screen
                    name={APP_ROUTES.FILE_FEATURE.DOWNLOAD_SETTINGS}
                    component={DownloadSettingsScreen}
                />
                <Stack.Screen
                    name={APP_ROUTES.FILE_FEATURE.DOWNLOAD_REPORT}
                    component={DownloadReportScreen}
                />


                {/* ======================== privacy feature =================  */}

                <Stack.Screen
                    name={APP_ROUTES.PRIVACY_FEATURE.PRIVACY_POLICY_TERMS}
                    component={PrivacySettingsScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};