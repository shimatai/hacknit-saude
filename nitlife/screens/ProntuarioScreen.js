import React from 'react';
import {
    View, 
    StyleSheet,
    Alert,
    Image,
    TouchableOpacity,
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
  Form,
  Item
} from "native-base";
import { getProportionalSize } from '@constants/Util';
import Spinner from 'react-native-loading-spinner-overlay';
import ApiFetcher from '@constants/ApiFetcher';
import Constants from '@constants/Constants';
import moment from 'moment';
import "moment/locale/pt-br";
import CameraWidget from "@components/CameraWidget";
//import ImageProgress from 'react-native-image-progress';
//import * as Progress from 'react-native-progress';

export default class ProntuarioScreen extends React.Component {
  static navigationOptions = {
    title: 'Prontuário',
  };

  constructor(props) {
    super(props);
    let prontuario = props.navigation.state.params.prontuario;
    this.state = {
        loading: false,
        showCamera: false,
        cpf: prontuario && prontuario.paciente && prontuario.paciente.cpf ? prontuario.paciente.cpf : '',
        prontuario: prontuario,
        nome: prontuario && prontuario.paciente && prontuario.paciente.nome ? prontuario.paciente.nome : '',
        nomeSocial: prontuario && prontuario.paciente && prontuario.paciente.nomeSocial ? prontuario.paciente.nomeSocial : '',
        dataNascimento: prontuario && prontuario.paciente && prontuario.paciente.dataNascimento ? moment(prontuario.paciente.dataNascimento, "YYYY-MM-DD").format('DD/MM/YYYY') : '',
        sexo: prontuario && prontuario.paciente && prontuario.paciente.sexo ? prontuario.paciente.sexo : '',
        celular: prontuario && prontuario.paciente && prontuario.paciente.telefone ? prontuario.paciente.telefone : ''
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

  salvarProntuario() {

      if (this.state.nome == '') {
          this.exibirMsgAviso('Prontuário', 'Preencha o nome completo');
          return;
      }

      if (this.state.nomeSocial == '') {
        this.exibirMsgAviso('Prontuário', 'Preencha o nome social');
        return;
      }

      if (this.state.cpf == '') {
        this.exibirMsgAviso('Prontuário', 'Preencha o CPF');
        return;
      }

      if (this.state.dataNascimento == '') {
        this.exibirMsgAviso('Prontuário', 'Preencha a data de nascimento');
        return;
      }

      if (this.state.cpf != '') {
            ApiFetcher.post(Constants.URL.API + '/prontuario/cadastro')
            .then((response) => {
                console.log('Prontuario - response', response);
                this.setState({ prontuario: response });
                
            }).catch((error) => {
                console.log('Erro ao buscar prontuario do paciente', error);
                this.exibirMsgAviso('Consulta por CPF', 'Paciente não encontrado!');
                this.setState({ cpf: "" });
            });
       } else {
            this.exibirMsgAviso('Consulta por CPF', 'Informe o CPF do paciente');
       }
  }

  async exibirCamera() {
    this.setState({ showModal: false }, async () => {
        AsyncStorage.getItem('statusAcessoCamera').then((value) => {
            if (!value || value == '' || value != 'granted') {
                setTimeout(() => {
                    this.setState({ showModalPermissao: true, 
                        pendencias: [],
                        permissao: {
                            key: 'statusAcessoCamera',
                            id: Permissions.CAMERA, name: 'Câmera',
                            icon: <MaterialIcons name="camera-alt" size={getProportionalSize('h', 8.02)} color="#1f6048" />,
                            description: LocaleUtil.getMessage('camera_permission_info'),
                            onGranted: () => { this.setState({ showCamera: true }); }
                        }
                    });
                }, 500);
            } else {
                this.setState({ showCamera: true });
            }
        });
    });

  }

  render() {
    return (
      <Container padder style={styles.container}>
        <Spinner visible={this.state.loading} textContent={"Cadastrando prontuário..."} textStyle={{color: '#FFF'}} />
        <Content padder>
            { this.state.showCamera ? 
                 <View style={{ flex: 1 }}>
                    <CameraWidget 
                        timerDefault={false}
                        shooted={(photo) => {
                            console.log('Shooted photo', photo);
                            this.setState({ showCamera: false });
                            this.uploadAvatar(photo.uri);
                        }}
                        showClose={true}
                        closeAction={() => {
                            this.setState({ showCamera: false });
                        }}
                    />
                </View>    
            :
            <Form style={{ marginTop: 16 }}>
                {/* <View style={{ flex: 1, alignItems: "center", marginTop: getProportionalSize('h', 2.3), marginBottom: getProportionalSize('h', 2.3) }}>
                    <TouchableOpacity onPress={() => this.exibirCamera()}>
                        <ImageProgress 
                            borderRadius={getProportionalSize('h', 9.17)}
                            source={this.state.avatar} 
                            indicator={Progress.Pie}
                            indicatorProps={{
                                size: getProportionalSize('h', 8.6),
                                borderWidth: 0,
                                color: '#ffffff',
                                unfilledColor: 'rgba(200, 200, 200, 0.5)'
                            }}
                            style={{
                                width: getProportionalSize('h', 18),
                                height: getProportionalSize('h', 18),
                                borderRadius: getProportionalSize('h', 9.17)
                            }}
                            renderError={(err) => {
                                return <Thumbnail circular style={{ width: getProportionalSize('h', 18), height: getProportionalSize('h', 18) }} borderRadius={getProportionalSize('h', 9.17)} source={require("@images/newuser.png")} />;
                            }}
                        />
                    </TouchableOpacity>
                </View> */}

                <Text style={{ marginBottom: 16 }}>Preencha o prontuário do paciente:</Text>

                <Item rounded regular style={{ marginBottom: getProportionalSize('h', 1.14), paddingLeft: getProportionalSize('h', 2.3), paddingRight: getProportionalSize('h', 2.3) }}>
                    <Input placeholder={"Nome completo"} placeholderTextColor="#4ba1d6" onChangeText={(value) => this.setState({nome: value})} style={styles.inputField} value={this.state.nome} />
                </Item>

                <Item rounded regular style={{ marginBottom: getProportionalSize('h', 1.14), paddingLeft: getProportionalSize('h', 2.3), paddingRight: getProportionalSize('h', 2.3) }}>
                    <Input placeholder={"Nome social"} placeholderTextColor="#4ba1d6" onChangeText={(value) => this.setState({nomeSocial: value})} style={styles.inputField} value={this.state.nomeSocial} />
                </Item>

                <Item rounded regular style={{ marginBottom: getProportionalSize('h', 1.14), paddingLeft: getProportionalSize('h', 2.3), paddingRight: getProportionalSize('h', 2.3) }}>
                    <Input keyboardType="numeric" placeholder="CPF" placeholderTextColor="#4ba1d6" maxLength={11} onChangeText={(value) => this.setState({cpf: value})} style={styles.inputField} value={this.state.cpf} />
                </Item>

                <Item rounded regular style={{ marginBottom: getProportionalSize('h', 1.14) }}>
                    <Input keyboardType="numeric" placeholder="Data de nascimento" maxLength={10} placeholderTextColor="#4ba1d6" style={styles.inputField}
                        value={this.state.dataNascimento}
                        onChangeText={(value) => {
                            if (value.length == 0) {
                                this.setState({ dataAutoCompleted: false });
                            }

                            let digits = value.replace(/[^0-9]/g, '').split('');
                            if (value.substr(-1).match(/[0-9\/]/)) {
                                if (value.length == 3 && value.substr(-1) != '/') {
                                    value = digits[0] + digits[1] + '/' + digits[2];
                                } else if (value.length == 6 && value.substr(-1) != '/') {
                                    value = digits[0] + digits[1] + '/' + digits[2] + digits[3] + '/' + digits[4];
                                }

                                if (value.length == 7) {
                                    this.setState({ dataAutoCompleted: false });
                                }

                                if (value.length == 8 && !this.state.dataAutoCompleted) {
                                    let year = new Date().getFullYear() - 2000 - 18;
                                    if (parseInt(value.substr(-2)) >= year && parseInt(value.substr(-2)) != 19) {
                                        value = value.substring(0, value.length - 2) + '19' + value.substr(-2);
                                    } else if (parseInt(value.substr(-2)) != 19) {
                                        value = value.substring(0, value.length - 2) + '20' + value.substr(-2);
                                    }

                                    this.setState({ dataAutoCompleted: true });
                                }
                            } else {
                                value = value.substring(0, value.length - 1);
                            }

                            this.setState({dataNascimento: value});
                        }} />
                </Item>

                <Item rounded regular style={{ marginBottom: getProportionalSize('h', 1.14), paddingLeft: getProportionalSize('h', 2.3), paddingRight: getProportionalSize('h', 2.3) }}>
                    <Input keyboardType="numeric" maxLength={15} placeholder={"Celular"} placeholderTextColor="#4ba1d6" style={styles.inputField}
                        value={this.state.celular}
                        onChangeText={(value) => { // (21) 98182-7124
                            let digits = value.replace(/[^0-9]/g, '').split('');
                            if (value.substr(-1).match(/[0-9\(\)\-]/)) {
                                if (value.length == 1 && value.substr(-1) != '(') {
                                    value = '(' + digits[0];
                                } else if (value.length == 4 && value.substr(-1) != ')') {
                                    value = '(' + digits[0] + digits[1] + ') ' + digits[2];
                                } else if (value.length == 11 && value.substr(-1) != '-') {
                                    value = '(' + digits[0] + digits[1] + ') ' + digits[2] + digits[3] + digits[4] + digits[5] + digits[6] + '-' + digits[7];
                                }
                            } else {
                                value = value.substring(0, value.length - 1);
                            }

                            this.setState({celular: value});
                        }} />
                </Item>

                <Button rounded primary onPress={() => { this.salvarProntuario(); }} style={{ width: '100%', marginTop: getProportionalSize('h', 2.29), marginBottom: getProportionalSize('h', 4.58), backgroundColor: '#4ba1d6', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ width: '100%', color: '#ffffff', fontSize: getProportionalSize('h', 2.58), textAlign: 'center' }}>Salvar prontuário</Text>
                </Button>

            </Form>
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
