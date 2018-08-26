import React from 'react';
import {
    View,
    StyleSheet,
    AsyncStorage,
    TouchableOpacity,
    Modal
} from 'react-native';
import {
    Container,
    Text,
    Button
} from "native-base";
import Constants from '@constants/Constants';
import { getProportionalSize } from '@constants/Util';
import ApiFetcher from '@constants/ApiFetcher';
import { Notifications, Location, Permissions } from 'expo';
import MapView, { Marker, Callout, ProviderPropType } from 'react-native-maps';

export default class MapaScreen extends React.Component {
    static navigationOptions = {
        header: null
      };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            location: {
                coords: {
                    latitude: -22.886764,
                    longitude: -43.127016,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1
                }
            },
            region: {
                latitude: -22.886764,
                longitude: -43.127016,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1
            },
            markers: [],
            showModal: false,
            modalContent: null
        };
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            console.log('PERMISSÃO NEGADA: Localização!!!');
        } else {
            let location = await Location.getCurrentPositionAsync({});
            //alert(JSON.stringify(location));
            this.setState({ 
                location: location,
                region: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                }
            });
        }
    };

    listarRedePmf() {
        ApiFetcher.get(Constants.URL.API + '/rede-pmf/lista')
        .then((response) => {
            console.log('Rede PMF - response', response);
            let markers = this.state.markers;
            response.map((item, index) => {
                let location = {latitude: item.latitude, longitude: item.longitude};
                markers.push(<Marker key={"marker" + index} coordinate={location} title={item.nome} description={item.logradouro + ", " + item.numero} pinColor="#4ba1d6">
                                <Callout onPress={() => {
                                    this.setState({ modalContent: <View style={{ flex: 1, flexDirection: "column", alignSelf: 'center' }}>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                            {item.nome}
                                        </Text>
                                        <Text note style={{ marginBottom: 8 }}>{item.logradouro + ", " + item.numero}</Text>
                                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                                            Vacinas disponíveis:{'\n'}
                                        </Text>
                                        <Text style={{ fontSize: 12 }}>
                                            * BCG - ID{'\n'}
                                            * Hepatite B{'\n'}
                                            * PNM10{'\n'}
                                            * VIP{'\n'}
                                            * Pentavalente{'\n'}
                                            * Rotavírus{'\n'}
                                            * Febre Amarela
                                        </Text>
                                        <Button rounded primary onPress={() => { this.setState({ showModal: false }) }} style={{ width: '25%', marginTop: 16, backgroundColor: '#4ba1d6', alignItems: 'center', alignSelf: 'center' }}>
                                                <Text style={{ width: '100%', color: '#ffffff', fontSize: getProportionalSize('h', 2.3), textAlign: 'center' }}>OK</Text>
                                        </Button>

                                    </View> }, () => { this.setState({ showModal: true }); });
                                    }}>
                                    <Text style={{ fontWeight: 'bold'}}>{item.nome}</Text>
                                    <Text style={{ fontSize: 12, textAlign: 'center' }}>Clique aqui para mais informações</Text>
                                </Callout>
                            </Marker>);
                this.setState({ markers: markers });
            });
        }).catch((error) => {
            this.setState({ cpf: "" });
        });
    }

    componentWillMount() {
        this._getLocationAsync();

        AsyncStorage.getItem('cpf').then((cpf) => {
            this.setState({ 
                cpf: cpf
            });
        });

        this.listarRedePmf();
    }

    render() {
        return (
            <Container style={styles.container}>
                <View style={styles.mapWrapper}>
                    <MapView
                            style={[{ flex: 1 }, styles.map]}
                            //mapType={Platform.OS == "android" ? "none" : "standard"}
                            //onRegionChange={this.onRegionChange}
                            showsUserLocation={true}
                            showsMyLocationButton={true}
                            region={this.state.region}
                            initialRegion={{
                                latitude: this.state.location.coords.latitude,
                                longitude: this.state.location.coords.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01
                            }}>

                        {this.state.markers}
                    </MapView>
                </View>

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showModal}>
                    <View style={{marginTop: 8, padding: 8, flexDirection: 'column', height: '30%' }}>
                        {this.state.modalContent}
                    </View>
                </Modal>
            </Container>
        );
    }

}

//const mapStyle = Platform.OS == 'android' ? {...StyleSheet.absoluteFillObject} : {};
const styles = StyleSheet.create({
    mapWrapper: {
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center'
    },
    map: {
        marginTop: 1.5,
        ...StyleSheet.absoluteFillObject
    },
    container: {
        backgroundColor: '#f6f6f6',
    },
    headerTitle: {
        color: '#ffffff'
    },
    inputField: {
        marginTop: getProportionalSize('h', 2.3),
        borderRadius: getProportionalSize('h', 2.3),
        backgroundColor: '#fff'
    }
});