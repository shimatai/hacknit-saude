import React from 'react';
import {
    View, 
    StyleSheet,
    Alert,
    AsyncStorage
} from 'react-native';
import {
  Container,
  Content
} from "native-base";
import { getProportionalSize } from '@constants/Util';
import Spinner from 'react-native-loading-spinner-overlay';
import ApiFetcher from '@constants/ApiFetcher';
import Constants from '@constants/Constants';
import moment from 'moment';
import "moment/locale/pt-br";
import CartaoVacinaWidget from "@components/CartaoVacinaWidget";

export default class LinksScreen extends React.Component {
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
  }

  render() {
    return (
      <Container padder style={styles.container}>
        <Spinner visible={this.state.loading} textContent={"Consultando CPF..."} textStyle={{color: '#FFF'}} />
        <Content padder>
            { this.state.prontuario == null ? <View></View> :
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <CartaoVacinaWidget 
                        prontuario={this.state.prontuario}
                    />
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
