import React from 'react';
import {
    View, 
    StyleSheet
} from 'react-native';
import {
  Card,
  CardItem,
  Text,
  Body
} from "native-base";
import { getProportionalSize } from '@constants/Util';
import moment from 'moment';
import "moment/locale/pt-br";

const naoVacinado = "---";

export default class CartaoVacinaWidget extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            prontuario: props.prontuario
        };
    }

    render() {
        return (
            <Card style={{ borderRadius: getProportionalSize('h', 2.3), padding: getProportionalSize('h', 2.3) }}>
                <CardItem bordered>
                    <Body>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Carteira de Vacinação</Text>
                        <Text style={{ fontWeight: 'bold' }}>{this.state.prontuario.paciente.nomeSocial}</Text>
                        <Text note style={{ width: "100%" }}>Data de nascimento: {moment(this.state.prontuario.paciente.dataNascimento, "YYYY-MM-DD").format('DD/MM/YYYY')}</Text>
                    </Body>
                </CardItem> 
                <CardItem cardBody>
                    <View style={{ marginTop: getProportionalSize('h', 1.45), flex: 1, flexDirection: 'column' }}>
                        <Text style={{ fontSize: 14, fontStyle: 'italic', fontWeight: 'bold' }}>A importância da vacinação (em todas as idades)</Text>
                        <Text style={{ fontSize: 12, marginBottom: 8, marginTop: 4, textAlign: 'justify' }}>Quem não se vacina não coloca apenas a própria saúde em risco, mas também a de seus familiares e outras pessoas com quem tem contato, além de contribuir para aumentar a circulação de doenças. Tomar vacinas é a melhor maneira de se proteger de uma variedade de doenças graves e de suas complicações, que podem até levar à morte.</Text>

                        <Text style={styles.tituloIdadeVacina}>A partir do nascimento Dose Única (até 30 dias)</Text>
                        <Text>BCG ID: {this.state.prontuario.bcgId != "" ? moment(this.state.prontuario.bcgId, "YYYY-MM-DD").format('DD/MM/YYYY') : naoVacinado }</Text>
                        <Text>Hepatite B: {this.state.prontuario.hepatiteB != "" ? moment(this.state.prontuario.hepatiteB, "YYYY-MM-DD").format('DD/MM/YYYY') : naoVacinado }</Text>

                        <Text style={styles.tituloIdadeVacina}>2 Meses (1ª dose)</Text>
                        <Text>PNM 10: {this.state.prontuario.pnm101 != "" ? moment(this.state.prontuario.pnm101, "YYYY-MM-DD").format('DD/MM/YYYY') : naoVacinado }</Text>
                        <Text>VIP: {this.state.prontuario.vip1 != "" ? moment(this.state.prontuario.vip1, "YYYY-MM-DD").format('DD/MM/YYYY') : naoVacinado }</Text>
                        <Text>Pentavalente: {this.state.prontuario.pentavalente1 != "" ? moment(this.state.prontuario.pentavalente1, "YYYY-MM-DD").format('DD/MM/YYYY') : naoVacinado }</Text>
                        <Text>Rotavírus: {this.state.prontuario.rotavirus1 != "" ? moment(this.state.prontuario.rotavirus1, "YYYY-MM-DD").format('DD/MM/YYYY') : naoVacinado }</Text>

                        <Text style={styles.tituloIdadeVacina}>3 meses (1ª dose)</Text>
                        <Text>MNG C: {this.state.prontuario.mngC1 != "" ? moment(this.state.prontuario.mngC1, "YYYY-MM-DD").format('DD/MM/YYYY') : naoVacinado }</Text>
                        
                        <Text style={styles.tituloIdadeVacina}>4 Meses (2ª dose)</Text>
                        <Text>PNM10: {this.state.prontuario.pnm102 != "" ? moment(this.state.prontuario.pnm102, "YYYY-MM-DD").format('DD/MM/YYYY') : naoVacinado }</Text>
                        <Text>VIP: {this.state.prontuario.vip2 != "" ? moment(this.state.prontuario.pnm102, "YYYY-MM-DD").format('DD/MM/YYYY') : naoVacinado }</Text>
                        <Text>Pentavalente: {this.state.prontuario.pentavalente2 != "" ? moment(this.state.prontuario.pnm102, "YYYY-MM-DD").format('DD/MM/YYYY') : naoVacinado }</Text>
                        <Text>Rotavírus: {this.state.prontuario.rotavirus2 != "" ? moment(this.state.prontuario.pnm102, "YYYY-MM-DD").format('DD/MM/YYYY') : naoVacinado }</Text>

                        <Text style={styles.tituloIdadeVacina}>5 Meses (2ª dose)</Text>
                        <Text>MNG C: {this.state.prontuario.mngC2 != "" ? moment(this.state.prontuario.mngC2, "YYYY-MM-DD").format('DD/MM/YYYY') : naoVacinado }</Text>
                        
                        <Text style={styles.tituloIdadeVacina}>6 meses (3ª dose)</Text>
                        <Text>VIP: {this.state.prontuario.vip3 != "" ? moment(this.state.prontuario.vip3, "YYYY-MM-DD").format('DD/MM/YYYY') : naoVacinado }</Text>
                        <Text>Pentavalente: {this.state.prontuario.pentavalente3 != "" ? moment(this.state.prontuario.pentavalente3, "YYYY-MM-DD").format('DD/MM/YYYY') : naoVacinado }</Text>
                        
                        <Text style={styles.tituloIdadeVacina}>9 meses (Dose Única)</Text>
                        <Text>Febre amarela: {this.state.prontuario.febreAmarela != "" ? moment(this.state.prontuario.febreAmarela, "YYYY-MM-DD").format('DD/MM/YYYY') : naoVacinado }</Text>

                        <Text style={styles.tituloIdadeVacina}>12 meses</Text>
                        <Text>Tríplice viral (1ª dose): {this.state.prontuario.tripliceViral1 != "" ? moment(this.state.prontuario.tripliceViral1, "YYYY-MM-DD").format('DD/MM/YYYY') : naoVacinado }</Text>
                        <Text>MNG C (1º reforço): {this.state.prontuario.mngCReforco != "" ? moment(this.state.prontuario.mngCReforco, "YYYY-MM-DD").format('DD/MM/YYYY') : naoVacinado }</Text>
                        <Text>PNM 10 (Reforço): {this.state.prontuario.pnm10Reforco != "" ? moment(this.state.prontuario.pnm10Reforco, "YYYY-MM-DD").format('DD/MM/YYYY') : naoVacinado }</Text>
                        
                    </View>
                </CardItem>
                {/* <CardItem>
                    <Left>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Prontuario', { prontuario: this.state.prontuario }); }}>
                            <Image source={require("@images/vacinar2.png")} style={{ width: 48, height: 48 }} />
                        </TouchableOpacity>
                    </Left>
                    <Right />
                </CardItem> */}
            </Card>
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