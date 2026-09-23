// Expo usa este archivo para arrancar el componente principal de la aplicación.
import { registerRootComponent } from 'expo';
// Se carga antes de App para ocultar avisos internos de react-native-web.
import './src/utils/suppressWebWarnings';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// Asegura que la aplicación se inicie correctamente en Expo Go o build nativo.
registerRootComponent(App);
