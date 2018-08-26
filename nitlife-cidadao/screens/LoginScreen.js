import React from 'react';
import { 
    StyleSheet, 
    Alert,
    AsyncStorage,
    Image,
    ImageBackground,
    Platform,
    View,
    TouchableOpacity
} from 'react-native';
import {
  Container,
  Header,
  Form,
  Item,
  Input,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Footer,
  Left,
  Right,
  Body
} from "native-base";
import { Permissions, Notifications, Facebook } from 'expo';
import IconFeather from '@expo/vector-icons/Feather';
import { getProportionalSize } from '@constants/Util';
import Spinner from 'react-native-loading-spinner-overlay';
import Constants from '@constants/Constants';
import { Feather } from '@expo/vector-icons';

export default class LoginScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            loading: false,
            showPassword: false,
            iconPassword: 'eye',
            cpf: '08172348703',
            senha: '123',
            expoToken: '',
            pendencias: []
        };
    }

    erroAutenticacao() {
        Alert.alert(
            'Login',
            'Credencial inválida!',
            [
            //{text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
        );
    }

    navegarHome() {
        console.log('navegarHome - CPF', this.state.cpf);
        AsyncStorage.setItem('cpf', this.state.cpf).then((value) => {
            this.props.callback();
        });
    }

    autenticarUsuario() {
        if (this.state.cpf != '' && this.state.senha != '') {
            this.setState({loading: true});
            //console.log(`##### Autenticando com credencial: ${this.state.cpf} | ${this.state.senha}`);

            this.navegarHome();
        } else {
            this.exibirMsgAviso('Credencial requerida', 'Informe CPF e senha!');
        }
    }

    exibirMsgAviso(titulo, msg) {
        setTimeout(() => {
            Alert.alert(
                titulo,
                msg,
                [
                    //{text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
            );
        }, 100);
    }

    componentWillMount() {

        AsyncStorage.getItem('cpf').then((cpf) => {
            //if (cpf != '') this.navegarHome();
            this.setState({ cpf: cpf });
        });
    }

    componentDidMount() {

    }

    render() {
        return (
            <Container style={styles.container}>
                <Spinner visible={this.state.loading} textContent={"Acessando..."} textStyle={{color: '#FFF'}} />
                { this.state.show ? 
                    <Content padder>

                        <Image source={require('../assets/images/icon.png')} style={styles.imgLogo} />

                        <Form style={{ padding: getProportionalSize('h', 2.3) }}>
                            <Item rounded regular last style={{ marginBottom: getProportionalSize('h', 2.3), backgroundColor: 'rgba(255, 255, 255, 0.35)' }} >
                                <IconFeather active name="user" style={{ fontSize: getProportionalSize('h', 3.15), marginLeft: getProportionalSize('h', 1.14), marginRight: getProportionalSize('h', 1.43), color: '#000000' }} />
                                <Input keyboardType="numeric" placeholder={"CPF"} placeholderTextColor="#000000" onChangeText={(value) => this.setState({cpf: value.toLowerCase()})} style={{ color: '#000000' }} value={this.state.cpf} />
                            </Item>

                            <Item rounded regular last style={{ marginBottom: getProportionalSize('h', 4.58), backgroundColor: 'rgba(255, 255, 255, 0.35)', paddingLeft: getProportionalSize('h', 2.3), paddingRight: getProportionalSize('h', 2.3) }}>
                                <IconFeather active name="lock" style={{ fontSize: getProportionalSize('h', 3.15), marginLeft: getProportionalSize('h', 1.14), marginRight: getProportionalSize('h', 1.43), color: '#000000' }} />
                                <Input secureTextEntry={!this.state.showPassword} placeholder={"Senha"} placeholderTextColor="#000000" onChangeText={(value) => this.setState({senha: value})} style={{ color: '#000000' }} />
                                <TouchableOpacity onPress={() => { this.setState({ showPassword: !this.state.showPassword, iconPassword: this.state.showPassword ? 'eye': 'eye-off' }); }}><Feather active name={this.state.iconPassword} size={getProportionalSize('h', 2.86)} color="#4ba1d6" /></TouchableOpacity>
                            </Item>

                            <Button rounded primary onPress={() => { this.autenticarUsuario(); }} style={{ width: '100%', backgroundColor: '#4ba1d6', alignItems: 'center', alignSelf: 'center' }}>
                                <Text style={{ width: '100%', color: '#ffffff', fontSize: getProportionalSize('h', 2.3), textAlign: 'center' }}>Acessar</Text>
                            </Button>

                        </Form>

                    </Content>
                    : 
                    <Content />
                }
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff"
    },
    imgLogo: {
        width: getProportionalSize('h', 18), 
        height: getProportionalSize('h', 18), 
        marginTop: getProportionalSize('h', 3),
        marginBottom: getProportionalSize('h', 3),
        alignSelf: 'center'
    },
    pageTitle: {
        //fontFamily: 'zeronero-regular',
        color: '#000000',
        fontSize: getProportionalSize('h', 4.58),
        textAlign: 'center',
        alignSelf: 'center',
        marginTop: getProportionalSize('h', 3),
        marginBottom: getProportionalSize('h', 3)
    },
    recuperarSenha: {
        alignItems: 'center',
        alignSelf: 'center', 
        marginTop: getProportionalSize('h', 4), 
        fontSize: getProportionalSize('h', 2.0),
        color: '#000000',
        backgroundColor: 'rgba(0,0,0, 0)',
        textDecorationLine: 'underline'
    },
    cadastro: {
        alignItems: 'center',
        alignSelf: 'center', 
        //marginTop: 12,
        //marginBottom: 16,
        fontSize: getProportionalSize('h', 2.3),
        color: '#000000',
        backgroundColor: 'rgba(0,0,0, 0)'
    },
    cadastro2: {
        alignItems: 'center',
        alignSelf: 'center', 
        //marginTop: 12,
        //marginBottom: 16,
        fontSize: getProportionalSize('h', 2.3),
        color: '#000000',
        backgroundColor: 'rgba(0,0,0, 0)',
        textDecorationLine: 'underline'
    },
    versao: {
        fontSize: getProportionalSize('h', 1.43),
        color: '#000000'
    }
});