import React from 'react';
import {
    View, 
    StyleSheet,
    Alert,
    Image,
    TouchableOpacity
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
  Form,
  Item
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
    title: 'Consulta por CPF',
  };

  constructor(props) {
    super(props);
    let prontuario = props.navigation.state.params ? props.navigation.state.params.prontuario : null;
    this.state = {
        loading: false,
        cpf: '',
        prontuario: prontuario
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

  consultarCPF() {
      if (this.state.cpf != '') {
            ApiFetcher.get(Constants.URL.API + '/prontuario/cpf/' + this.state.cpf)
            .then((response) => {
                console.log('Prontuario - response', response);
                this.setState({ prontuario: response });
                
            }).catch((error) => {
                this.exibirPrompt('Consulta por CPF', 'Paciente não encontrado!\n\nDeseja cadastrar um novo paciente?', 'Sim', 'Não', 
                () => {
                    this.setState({ loading: false });
                    setTimeout(() => {
                        this.props.navigation.navigate('Prontuario', { prontuario: null });
                    }, 300);
                });

                this.setState({ cpf: "" });
            });
       } else {
            this.exibirMsgAviso('Consulta por CPF', 'Informe o CPF do paciente');
       }
  }

  render() {
    return (
      <Container padder style={styles.container}>
        <Spinner visible={this.state.loading} textContent={"Consultando CPF..."} textStyle={{color: '#FFF'}} />
        <Content padder>
          { this.state.prontuario == null ?
              <Form style={{ marginTop: 16 }}>
                <Text style={{ marginBottom: 16 }}>Informe o CPF do paciente:</Text>
                <Item rounded regular style={{ marginBottom: getProportionalSize('h', 1.14), paddingLeft: getProportionalSize('h', 2.3), paddingRight: getProportionalSize('h', 2.3) }}>
                    <Input keyboardType="numeric" placeholder="CPF" placeholderTextColor="#4ba1d6" maxLength={11} onChangeText={(value) => this.setState({cpf: value})} style={styles.inputField} value={this.state.cpf} />
                </Item>

                <Button rounded primary onPress={() => { this.consultarCPF(); }} style={{ width: '100%', marginTop: getProportionalSize('h', 2.29), marginBottom: getProportionalSize('h', 4.58), backgroundColor: '#4ba1d6', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ width: '100%', color: '#ffffff', fontSize: getProportionalSize('h', 2.58), textAlign: 'center' }}>Consultar CPF</Text>
                </Button>

              </Form>
            :
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <CartaoVacinaWidget 
                        prontuario={this.state.prontuario}
                        navigation={this.props.navigation}
                    />

                    <Button rounded primary onPress={() => { this.setState({ prontuario: null, cpf: '' }); }} style={{ width: '100%', marginTop: getProportionalSize('h', 2.29), marginBottom: getProportionalSize('h', 4.58), backgroundColor: '#4ba1d6', alignItems: 'center', alignSelf: 'center' }}>
                        <Text style={{ width: '100%', color: '#ffffff', fontSize: getProportionalSize('h', 2.58), textAlign: 'center' }}>Nova consulta</Text>
                    </Button>
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
  },
  inputField: {
    marginLeft: getProportionalSize('h', 2.3) 
  },
  tituloIdadeVacina: {
    fontWeight: 'bold',
    marginTop: 16
  }
});
