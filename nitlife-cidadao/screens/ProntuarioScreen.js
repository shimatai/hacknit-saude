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
  Item,
  Thumbnail,
  Icon
} from "native-base";
import { getProportionalSize } from '@constants/Util';
import Spinner from 'react-native-loading-spinner-overlay';
import ApiFetcher from '@constants/ApiFetcher';
import Constants from '@constants/Constants';
import moment from 'moment';
import "moment/locale/pt-br";
import CameraWidget from "@components/CameraWidget";
import ImageProgress from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { Permissions } from 'expo';

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
        editMode: prontuario && prontuario.paciente,
        cpf: prontuario && prontuario.paciente && prontuario.paciente.cpf ? prontuario.paciente.cpf : '',
        prontuario: prontuario,
        nome: prontuario && prontuario.paciente && prontuario.paciente.nome ? prontuario.paciente.nome : '',
        nomeSocial: prontuario && prontuario.paciente && prontuario.paciente.nomeSocial ? prontuario.paciente.nomeSocial : '',
        dataNascimento: prontuario && prontuario.paciente && prontuario.paciente.dataNascimento ? moment(prontuario.paciente.dataNascimento, "YYYY-MM-DD").format('DD/MM/YYYY') : '',
        sexo: prontuario && prontuario.paciente && prontuario.paciente.sexo ? prontuario.paciente.sexo : '',
        celular: prontuario && prontuario.paciente && prontuario.paciente.telefone ? prontuario.paciente.telefone : '',
        avatar: prontuario && prontuario.paciente && prontuario.paciente.urlFoto ? { uri: prontuario.paciente.urlFoto } : require("@images/newuser.png"),
        hasCameraPermission: false,
        fotoUri: null,
        fotoName: null,
        fotoType: null,
        paciente: null,
        campos: [],
        valores: [],
        //Vacinas
        bcgId: null,
        hepatiteB: null,
        pnm101: null,
        vip1: null,
        pentavalente1: null,
        rotavirus1: null,
        mngC1: null,
        pnm102: null,
        vip2: null,
        pentavalente2: null,
        rotavirus2: null,
        mngC2: null,
        vip3: null,
        pentavalente3: null,
        febreAmarela: null,
        tripliceViral1: null,
        mngCReforco: null,
        pnm10Reforco: null,
        vopBivalente1: null,
        dtp1: null,
        tripleViral2: null,
        varicela1: null,
        hepatiteA: null,
        vopBivalente2: null,
        dtp2: null,
        varicela2: null,
        hpv1: null,
        hpv2: null,
        hpv3: null,
        hpv4: null,
        mngCReforco2: null,
        mngCDoseUnica: null,
        dt1: null,
        dt2: null,
        dt3: null,
        dt4: null,
        dt5: null,
        dt6: null,
        dt7: null,
        dt8: null,
        dt9: null,
        dt10: null,
        tripliceViralDose1: null,
        tripliceViralDose2: null,
        hepatiteBDose1: null,
        hepatiteBDose2: null,
        hepatiteBDose3: null,
        influenza1: null,
        influenza2: null,
        influenza3: null,
        influenza4: null,
        influenza5: null,
    };
    this._textInput = [];
    this.index = 0;
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

  buscarDataVacina(id, valores) {
        return this.state.valores[id] && this.state.valores[id] != '' ? moment(this.state.valores[id], "DD.MM.YYYY").format('YYYY-MM-DD') : '';
  }

  salvarProntuario() {

      if (this.state.fotoUri == null && !this.state.editMode) {
        this.exibirMsgAviso('Prontuário', 'Tire uma foto do paciente');
        return;
      }

      if (this.state.nome == '') {
          this.exibirMsgAviso('Prontuário', 'Preencha o nome completo');
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
            this.setState({ loading: true });
            let formData = new FormData();
            formData.append('foto', !this.state.editMode ? { uri: this.state.fotoUri, name: this.state.fotoName, type: this.state.fotoType } : null);
            formData.append('id', this.state.prontuario && this.state.prontuario.paciente ? this.state.prontuario.paciente.id : '');
            formData.append('nome', this.state.nome);
            formData.append('nomeSocial', this.state.nomeSocial && this.state.nomeSocial != '' ? this.state.nomeSocial : this.state.nome);
            formData.append('cpf', this.state.cpf);
            formData.append('sexo', this.state.sexo);
            formData.append('telefone', this.state.celular);
            formData.append('dataNascimento', moment(this.state.dataNascimento, "DD/MM/YYYY").format('YYYY-MM-DD'));
            console.log('FormData', formData);

            fetch(Constants.URL.API + '/paciente/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            }).then((response) => {
                //console.log('##### Upload response', response);
                if (response.status == 200) {
                    response.json().then((data) => {
                        console.log('Paciente - data', data);
                        this.setState({ paciente: data, loading: false }, () => {
                            // PRONTUARIO - Cadastro
                            ApiFetcher.post(Constants.URL.API + '/prontuario/cadastro', {
                                idPaciente: data.id,
                                "bcgId" : this.buscarDataVacina('bcgId', this.state.valores), 
                                "hepatiteB" : this.buscarDataVacina('hepatiteB', this.state.valores),
                                "pnm101" : this.buscarDataVacina('pnm101', this.state.valores),
                                "vip1" : this.buscarDataVacina('vip1', this.state.valores),
                                "pentavalente1" : this.buscarDataVacina('pentavalente1', this.state.valores),
                                "rotavirus1" : this.buscarDataVacina('rotavirus1', this.state.valores),
                                "mngC1" : this.buscarDataVacina('mngC1', this.state.valores),
                                "pnm102" : this.buscarDataVacina('pnm102', this.state.valores),
                                "vip2" : this.buscarDataVacina('vip2', this.state.valores),
                                "pentavalente2" : this.buscarDataVacina('pentavalente2', this.state.valores),
                                "rotavirus2" : this.buscarDataVacina('rotavirus2', this.state.valores),
                                "mngC2" : this.buscarDataVacina('mngC2', this.state.valores),
                                "vip3" : this.buscarDataVacina('vip3', this.state.valores),
                                "pentavalente3" : this.buscarDataVacina('pentavalente3', this.state.valores),
                                "febreAmarela" : this.buscarDataVacina('febreAmarela', this.state.valores),
                                "tripliceViral1" : this.buscarDataVacina('tripliceViral1', this.state.valores),
                                "mngCReforco" : this.buscarDataVacina('mngCReforco', this.state.valores),
                                "pnm10Reforco" : this.buscarDataVacina('pnm10Reforco', this.state.valores),
                                "vopBivalente1" : this.buscarDataVacina('vopBivalente1', this.state.valores),
                                "dtp1" : this.buscarDataVacina('dtp1', this.state.valores),
                                "tripleViral2" : this.buscarDataVacina('tripleViral2', this.state.valores),
                                "varicela1" : this.buscarDataVacina('varicela1', this.state.valores),
                                "hepatiteA" : this.buscarDataVacina('hepatiteA', this.state.valores),
                                "vopBivalente2" : this.buscarDataVacina('vopBivalente2', this.state.valores),
                                "dtp2" : this.buscarDataVacina('dtp2', this.state.valores),
                                "varicela2" : this.buscarDataVacina('varicela2', this.state.valores),
                                "hpv1" : this.buscarDataVacina('hpv1', this.state.valores),
                                "hpv2" : this.buscarDataVacina('hpv2', this.state.valores),
                                "hpv3" : this.buscarDataVacina('hpv3', this.state.valores),
                                "hpv4" : this.buscarDataVacina('hpv4', this.state.valores),
                                "mngCReforco2" : this.buscarDataVacina('mngCReforco2', this.state.valores),
                                "mngCDoseUnica" : this.buscarDataVacina('mngCDoseUnica', this.state.valores),
                                "dt1" : this.buscarDataVacina('dt1', this.state.valores), 
                                "dt2" : this.buscarDataVacina('dt2', this.state.valores),
                                "dt3" : this.buscarDataVacina('dt3', this.state.valores),
                                "dt4" : this.buscarDataVacina('dt4', this.state.valores),
                                "dt5" : this.buscarDataVacina('dt5', this.state.valores),
                                "dt6" : this.buscarDataVacina('dt6', this.state.valores),
                                "dt7" : this.buscarDataVacina('dt7', this.state.valores),
                                "dt8" : this.buscarDataVacina('dt8', this.state.valores),
                                "dt9" : this.buscarDataVacina('dt9', this.state.valores),
                                "dt10" : this.buscarDataVacina('dt10', this.state.valores),
                                "tripliceViralDose1" : this.buscarDataVacina('tripliceViralDose1', this.state.valores),
                                "tripliceViralDose2" : this.buscarDataVacina('tripliceViralDose2', this.state.valores),
                                "hepatiteBDose1" : this.buscarDataVacina('hepatiteBDose1', this.state.valores),
                                "hepatiteBDose2" : this.buscarDataVacina('hepatiteBDose2', this.state.valores),
                                "hepatiteBDose3" : this.buscarDataVacina('hepatiteBDose3', this.state.valores),
                                "influenza1" : this.buscarDataVacina('influenza1', this.state.valores),
                                "influenza2" : this.buscarDataVacina('influenza2', this.state.valores),
                                "influenza3" : this.buscarDataVacina('influenza3', this.state.valores),
                                "influenza4" : this.buscarDataVacina('influenza4', this.state.valores),
                                "influenza5" : this.buscarDataVacina('influenza5', this.state.valores),
                            })
                            .then((response) => {
                                this.setState({loading: false});
                                if (response) {
                                    // Prontuario salvo
                                    this.exibirMsgAviso('Prontuário', 'Prontuário do paciente ' + data.nomeSocial + ' foi salvo com sucesso!');
                                }
                            }).catch((error) => {
                                console.log('Erro ao salvar prontuario', error);
                                this.setState({ loading: true });
                            });
                        });
                    });
                } else if (response.status == 400) {
                    this.setState({loading: false});
                    this.exibirMsgAviso('Paciente', 'Erro ao salvar prontuário!');
                }
            }).catch((error) => {
                console.log('Erro ao salvar prontuario', error);
            });
       }
  }

  async exibirCamera() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted', showCamera: status === 'granted' });

  }

  defineAvatar(photo) {
      console.log('defineAvatar', photo);

    let localUri = photo.uri;
    let filename = localUri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    this.setState({
        fotoUri: localUri,
        fotoName: filename,
        fotoType: type,
        avatar: { uri: localUri }
    });
  }

  adicionarVacina(id, placeHolder, valor, index, isTitle) {
    let campos = this.state.campos;
    let valores = this.state.valores;
    valores[index] = { id: null, rotulo: placeHolder, label: placeHolder, valor: valor };

    if (isTitle) {
        campos.push(<Text style={{ fontWeight: 'bold', marginTop: 16, marginBottom: 8, marginLeft: 8 }}>{placeHolder}</Text>);
    } else {
        campos.push(
            <Item key={"vacina-" + index} rounded regular style={{ marginBottom: getProportionalSize('h', 1.14) }}>
                <Input keyboardType="numeric" placeholder={placeHolder} maxLength={10} placeholderTextColor="#4ba1d6" style={styles.inputField}
                    defaultValue={valor && valor != ''  ? moment(valor, "YYYY-MM-DD").format('DD.MM.YYYY') : ''}
                    ref={component => this._textInput[index] = component}
                    onChangeText={(value) => {
                        let valores = this.state.valores;
                        valores[id] = value;
                        this.setState({ valores: valores });
                    }} />
            </Item>
        );
    }

    this.setState({ campos: campos, valores: valores  });
    this.index = index + 1;
  }

  componentWillMount() {
        this.adicionarVacina(null, 'A partir do Nascimento Dose única (até 30 dias)', '', this.index, true);
        this.adicionarVacina('bcgId', 'BCG ID', this.state.prontuario && this.state.prontuario.bcgId ? this.state.prontuario.bcgId : '', this.index, false);
        this.adicionarVacina('hepatiteB', 'Hepatite B', this.state.prontuario && this.state.prontuario.hepatiteB ? this.state.prontuario.hepatiteB : '', this.index, false);
        
        this.adicionarVacina(null, '2 Meses (1ª dose)', '', this.index, true);
        this.adicionarVacina('pnm101', 'PNM 10', this.state.prontuario && this.state.prontuario.pnm101 ? this.state.prontuario.pnm101 : '', this.index, false);
        this.adicionarVacina('vip1', 'VIP', this.state.prontuario && this.state.prontuario.vip1 ? this.state.prontuario.vip1 : '', this.index, false);
        this.adicionarVacina('pentavalente1', 'Pentavalente', this.state.prontuario && this.state.prontuario.pentavalente1 ? this.state.prontuario.pentavalente1 : '', this.index, false);
        this.adicionarVacina('rotavirus1', 'Rotavírus', this.state.prontuario && this.state.prontuario.rotavirus1 ? this.state.prontuario.rotavirus1 : '', this.index, false);

        this.adicionarVacina(null, '3 meses (1ª dose)', '', this.index, true);
        this.adicionarVacina('mngC1', 'MNG C', this.state.prontuario && this.state.prontuario.mngC1 ? this.state.prontuario.mngC1 : '', this.index, false);

        this.adicionarVacina(null, '4 Meses (2ª dose)', '', this.index, true);
        this.adicionarVacina('pnm102', 'PNM10', this.state.prontuario && this.state.prontuario.pnm102 ? this.state.prontuario.pnm102 : '', this.index, false);
        this.adicionarVacina('vip2', 'VIP', this.state.prontuario && this.state.prontuario.vip2 ? this.state.prontuario.vip2 : '', this.index, false);
        this.adicionarVacina('pentavalente2', 'Pentavalente', this.state.prontuario && this.state.prontuario.pentavalente2 ? this.state.prontuario.pentavalente2 : '', this.index, false);
        this.adicionarVacina('rotavirus2', 'Rotavírus', this.state.prontuario && this.state.prontuario.rotavirus2 ? this.state.prontuario.rotavirus2 : '', this.index, false);

        this.adicionarVacina(null, '5 Meses (2ª dose)', '', this.index, true);
        this.adicionarVacina('mngC2', 'MNG C', this.state.prontuario && this.state.prontuario.mngC2 ? this.state.prontuario.mngC2 : '', this.index, false);

        this.adicionarVacina(null, '6 meses (3ª dose)', '', this.index, true);
        this.adicionarVacina('vip3', 'VIP', this.state.prontuario && this.state.prontuario.vip3 ? this.state.prontuario.vip3 : '', this.index, false);
        this.adicionarVacina('pentavalente3', 'Pentavalente', this.state.prontuario && this.state.prontuario.pentavalente3 ? this.state.prontuario.pentavalente3 : '', this.index, false);

        this.adicionarVacina(null, '9 meses (Dose Única)', '', this.index, true);
        this.adicionarVacina('febreAmarela', 'Febre amarela', this.state.prontuario && this.state.prontuario.febreAmarela ? this.state.prontuario.febreAmarela : '', this.index, false);

        this.adicionarVacina(null, '12 meses', '', this.index, true);
        this.adicionarVacina('tripliceViral1', 'Tríplice viral (1ª dose)', this.state.prontuario && this.state.prontuario.tripliceViral1 ? this.state.prontuario.tripliceViral1 : '', this.index, false);
        this.adicionarVacina('mngCReforco', 'MNG C (1º reforço)', this.state.prontuario && this.state.prontuario.mngCReforco ? this.state.prontuario.mngCReforco : '', this.index, false);
        this.adicionarVacina('pnm10Reforco', 'PNM 10 (Reforço)', this.state.prontuario && this.state.prontuario.pnm10Reforco ? this.state.prontuario.pnm10Reforco : '', this.index, false);

  }

  render() {
    return (
      <Container padder style={styles.container}>
        <Spinner visible={this.state.loading} textContent={"Cadastrando prontuário..."} textStyle={{color: '#FFF'}} />
            { this.state.showCamera ? 
                 <View style={{ flex: 1 }}>
                    <CameraWidget 
                        timerDefault={false}
                        shooted={(photo) => {
                            console.log('Shooted photo', photo);
                            this.defineAvatar(photo);
                            this.setState({ showCamera: false, avatar: { uri: photo.uri } });
                        }}
                        showClose={true}
                        closeAction={() => {
                            this.setState({ showCamera: false });
                        }}
                    />
                </View>    
            :
            <Content padder>
                <Form style={{ marginTop: 16 }}>
                    <View style={{ flex: 1, alignItems: "center", marginTop: getProportionalSize('h', 2.3), marginBottom: getProportionalSize('h', 2.3) }}>
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
                                    return <Thumbnail circular style={{ width: getProportionalSize('h', 9), height: getProportionalSize('h', 9) }} borderRadius={getProportionalSize('h', 4.17)} source={require("@images/newuser.png")} />;
                                }}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={{ marginBottom: 16 }}>Preencha o prontuário do paciente:</Text>

                    <Item rounded regular style={{ marginBottom: getProportionalSize('h', 1.14) }}>
                        <Input placeholder={"Nome completo"} placeholderTextColor="#4ba1d6" onChangeText={(value) => this.setState({nome: value})} style={styles.inputField} value={this.state.nome} />
                    </Item>

                    <Item rounded regular style={{ marginBottom: getProportionalSize('h', 1.14) }}>
                        <Input placeholder={"Nome social"} placeholderTextColor="#4ba1d6" onChangeText={(value) => this.setState({nomeSocial: value})} style={styles.inputField} value={this.state.nomeSocial} />
                    </Item>

                    <Item rounded regular style={{ marginBottom: getProportionalSize('h', 1.14) }}>
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
                                    if (value.length == 3 && value.substr(-1) != '.') {
                                        value = digits[0] + digits[1] + '.' + digits[2];
                                    } else if (value.length == 6 && value.substr(-1) != '.') {
                                        value = digits[0] + digits[1] + '.' + digits[2] + digits[3] + '.' + digits[4];
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

                    <Item rounded regular style={{ marginBottom: getProportionalSize('h', 1.14) }}>
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

                    { this.state.campos.length > 0 ? this.state.campos.map((item, index) => { return item; }) : null }

                    <Button rounded primary onPress={() => { this.salvarProntuario(); }} style={{ width: '100%', marginTop: getProportionalSize('h', 2.29), marginBottom: getProportionalSize('h', 4.58), backgroundColor: '#4ba1d6', alignItems: 'center', alignSelf: 'center' }}>
                        <Text style={{ width: '100%', color: '#ffffff', fontSize: getProportionalSize('h', 2.58), textAlign: 'center' }}>Salvar prontuário</Text>
                    </Button>

                </Form>
                </Content>
            }
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
