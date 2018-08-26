import React from 'react';
import {
    View, 
    StyleSheet,
    Alert,
    AsyncStorage
} from 'react-native';
import {
    Container,
    Content,
    Card,
    CardItem,
    Text,
    Body
  } from "native-base";
import { getProportionalSize } from '@constants/Util';
import Spinner from 'react-native-loading-spinner-overlay';
import ApiFetcher from '@constants/ApiFetcher';
import Constants from '@constants/Constants';
import moment from 'moment';
import "moment/locale/pt-br";
import { Notifications } from 'expo';

export default class CalendarioVacinasScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
        loading: false,
        cpf: '',
        prontuario: null
    };
  }

  notificarUsuario(title, body) {
    Notifications.presentLocalNotificationAsync({
        title: title,
        body: body,
        data: {
            title: title,
            body: body,
            tipo: 'notif'
        }
    });
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

  exibirPrompt(titulo, msg, okText, cancelText, okCallback, cancelCallback) {
    setTimeout(() => {
        Alert.alert(
            titulo,
            msg,
            [
                {text: cancelText, onPress: cancelCallback ? cancelCallback : () => {}, style: 'cancel'},
                {text: okText, onPress: okCallback ? okCallback : () => {}}
            ],
            { cancelable: false }
        );
    }, 100);
  }

  consultarCPF(cpf) {
        ApiFetcher.get(Constants.URL.API + '/prontuario/cpf/' + cpf)
        .then((response) => {
            console.log('Prontuario - response', response);
            this.setState({ prontuario: response });
            
        }).catch((error) => {
            this.setState({ cpf: "" });
        });
  }

  componentWillMount() {
      AsyncStorage.getItem('cpf').then((cpf) => {
          console.log('Consultando pelo CPF', cpf);
          this.consultarCPF(cpf);
      });

      // Simula a notificacao para o usuario sobre campanha de vacinacao
      setTimeout(() => {
          this.notificarUsuario('Próxima vacinação', 'Próxima campanha: 07/09. Saiba mais...');
      }, 5000);
  }

  render() {
    return (
      <Container padder style={styles.container}>
        <Spinner visible={this.state.loading} textContent={"Carregando..."} textStyle={{color: '#FFF'}} />
        <Content padder>
            { this.state.prontuario == null ? <View></View> :
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Card style={{ borderRadius: getProportionalSize('h', 2.3), padding: getProportionalSize('h', 2.3) }}>
                <CardItem bordered>
                    <Body>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Calendário de Vacinação</Text>
                        <Text note style={{ width: "100%" }}>Confira as datas das próximas campanhas de vacinação</Text>
                    </Body>
                </CardItem> 
                <CardItem cardBody>
                    <View style={{ marginTop: getProportionalSize('h', 1.45), flex: 1, flexDirection: 'column' }}>
                        <Text style={{ lineHeight: 32 }}>
                            08/03 - Campanha de vacinação contra Sarampo{'\n'}
                            13/03 - Campanha de vacinação contra Meningite C e HPV{'\n'}
                            24/04 - Campanha de vacinação contra Malária{'\n'}
                            18/04 - Campanha de vacinação contra Influenza{'\n'}
                            01/08 - Campanha de vacinação contra sarampo e poliomielite{'\n'}
                            07/09 - Campanha de vacinação contra gripe{'\n'}
                        </Text>

                    </View>
                </CardItem>
            </Card>
                </View>
            }
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20
  },
  inputField: {
    marginLeft: getProportionalSize('h', 2.3) 
  },
  tituloIdadeVacina: {
    fontWeight: 'bold',
    marginTop: 16
  }
});
