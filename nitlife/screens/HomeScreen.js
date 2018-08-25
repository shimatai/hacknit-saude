import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  AsyncStorage
} from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Card,
  CardItem,
  Text,
  Body,
  Left,
  Right,
  Input,
  Form
} from "native-base";
import { WebBrowser, Icon } from 'expo';
import { MonoText } from '../components/StyledText';
import CameraWidget from "@components/CameraWidget";
import Spinner from 'react-native-loading-spinner-overlay';
import { Permissions } from 'expo';

import { Feather, FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            meio: null,
            permissao: {
                key: 'statusAcessoGaleria',
                id: Permissions.CAMERA, 
                name: 'Câmera'
            }
        };
    }

    exibirMsgAviso(titulo, msg, okCallback) {
        setTimeout(() => {
            Alert.alert(
                titulo,
                msg,
                [
                    //{text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: okCallback ? okCallback : () => {}}
                ],
                { cancelable: false }
            );
        }, 100);
    }

    async solicitarPermissao(permissao, nome, fnCallback) {
        const { Permissions } = Expo;
        let pendencias = this.state.pendencias;
        const { status } = await Permissions.askAsync(permissao);
        if (status != 'granted' && pendencias.filter((item) => { return item == nome; }).length == 0) {
            pendencias.push(nome);
        }
        this.setState({ pendencias: pendencias });
        if (fnCallback) fnCallback(status);
    }

    componentWillMount() {
        this.solicitarPermissao(this.state.permissao.id, this.state.permissao.name,
            (status) => {
                AsyncStorage.setItem(this.state.permissao.key, status);
                if (status == 'granted') {
                    this.setState({ showModalPermissao: false }, () => {
                        
                    });
                    return;
                }

                let pendencias = this.state.pendencias;
                if (pendencias.length > 0) {
                    let s = pendencias.length > 1 ? 's' : '';
                    let recursos = '';
                    pendencias.map((item) => {
                        recursos += '- ' + item + '\n';
                    });

                    this.exibirMsgAviso("Permissão", "Você precisa permitir o acesso a câmera!");
                }
            });
    }

  render() {
    return (
      <Container style={styles.container}>
        <Spinner visible={this.state.loading} textContent={"Identificando paciente..."} textStyle={{color: '#FFF'}} />
        <View style={{ flex: 1 }}>
            <CameraWidget 
                timerDefault={true}
                shooted={(photo) => {
                    //console.log('Shooted photo', photo);
                    this.setState({ loading: true });
                }}
                showClose={false}
            />
        </View>
      </Container>

      // <View style={styles.container}>
      //   <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      //     <View style={styles.welcomeContainer}>
      //       <Image
      //         source={
      //           __DEV__
      //             ? require('../assets/images/robot-dev.png')
      //             : require('../assets/images/robot-prod.png')
      //         }
      //         style={styles.welcomeImage}
      //       />
      //     </View>

      //     <View style={styles.getStartedContainer}>
      //       {this._maybeRenderDevelopmentModeWarning()}

      //       <Text style={styles.getStartedText}>Get started by opening</Text>

      //       <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
      //         <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
      //       </View>

      //       <Text style={styles.getStartedText}>
      //         Change this text and your app will automatically reload.
      //       </Text>
      //     </View>

      //     <View style={styles.helpContainer}>
      //       <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
      //         <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
      //       </TouchableOpacity>
      //     </View>
      //   </ScrollView>

      //   <View style={styles.tabBarInfoContainer}>
      //     <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

      //     <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
      //       <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
      //     </View>
      //   </View>
      // </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
