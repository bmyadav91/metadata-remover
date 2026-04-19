import { useEffect } from 'react';
import { enableScreens } from 'react-native-screens';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './navigation/RootNavigator';

// hooks 
import { useTheme } from '@/shared/theme/useTheme';

// services 
import { handleInstallReferrer } from '@/services/installReferrer';
import { TelemetryService } from '@/services/TelemetryService';

// components 
import { ConsentPopup } from '@/features/home/components/ConsentModal';




enableScreens();

function App() {
  const theme = useTheme();

  useEffect(() => {
    // calling only async service/function here 
    const start = async () => {
      await TelemetryService.init(); // wait hydration + consent
      await handleInstallReferrer(); // now safe
    };

    start();
  }, []); // dont put dependency here.




  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={theme.background === '#0f172a' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
        translucent
      />
      <RootNavigator />

      <ConsentPopup />
    </SafeAreaProvider>
  );
}

export default App;