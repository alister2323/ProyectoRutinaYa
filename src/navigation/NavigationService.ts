// Crea una referencia global para poder navegar desde servicios y contextos.
import { createNavigationContainerRef } from "@react-navigation/native";
import { RootStackParamList } from "./StackNavigator";

// La referencia se conecta con NavigationContainer en App.tsx.
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Referencia global para navegar desde servicios que no reciben la prop navigation.