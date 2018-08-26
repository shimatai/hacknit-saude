import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Dimensions,
    ImageBackground
} from 'react-native';
import {
    Text
} from "native-base";
import { Camera, Permissions, Type } from 'expo';
import { MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { getProportionalSize } from '@constants/Util';

export default class CameraWidget extends Component{
    constructor(props) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            type: Camera.Constants.Type.back,
            cameraIcon: "camera-rear",
            cameraFlash: "flash-off",
            flashMode: 'off',
            timerIcon: props.timerDefault ? 'timer' : 'timer-off',
            showTimer: true,
            firstTimeLoad: true,
            segundos: '3s',
            bgColor: 'transparent',
            showClose: props.showClose || false,
            orientationStatus: '',
            showConfirmation: true,
            showPhoto: false
        };
    }

    setFlashMode() {
        if (this.state.flashMode == 'off') {
            this.setState({ flashMode: 'on', cameraFlash: 'flash-on' });
        } else if (this.state.flashMode == 'on') {
            this.setState({ flashMode: 'auto', cameraFlash: 'flash-auto' });
        } else if (this.state.flashMode == 'auto') {
            this.setState({ flashMode: 'off', cameraFlash: 'flash-off' });
        }
    }

    shootPhoto() {
        if (this.state.timerIcon == 'timer') {
            this.setState({ showTimer: true, segundos: '3s', firstTimeLoad: false });
            this.shootCounter(3);
        } else {
            this.takePicture();
        }
    }

    shootCounter(segs) {
        setTimeout(() => {
            this.setState({ segundos: segs + 's' });
            segs--;
            if (segs >= 0) {
                this.shootCounter(segs);
            } else {
                this.setState({ showTimer: false });
                this.takePicture();
            }
        }, 400);
    }

    async takePicture() {
        if (this.camera) {
            this.setState({ bgColor: '#fff' });

            let photo = await this.camera.takePictureAsync({ quality: 1.0 });

            setTimeout(() => {
                this.setState({ bgColor: 'transparent', showTimer: false });
            }, 250);

            //console.log(this.state.token, 'Flash mode: ' + this.state.flashMode, photo);

            if (!this.state.showConfirmation) {
                this.props.shooted(photo);
            } else {
                this.setState({ showPhoto: true, picture: { uri: photo.uri }, photo: photo });
            }
        }
    }

    detectOrientation() {
        let dimensions = Dimensions.get('window');
        //console.log('Window Dimensions:', dimensions);

        if (dimensions.height > dimensions.width) {  
            this.setState({ orientationStatus: 'PORTRAIT' });
            //console.log('detectOrientation: PORTRAIT');
        } else {
            this.setState({ orientationStatus: 'LANDSCAPE' });
            //console.log('detectOrientation: LANDSCAPE');
        }
    }

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    render() {
        return (
            this.state.showPhoto ?
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <ImageBackground source={this.state.picture} style={{width: '100%', height: '100%'}}>
                        <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center', alignItems: 'flex-end', justifyContent: 'flex-end', marginBottom: getProportionalSize('h', 2.3) }}>
                            <TouchableOpacity onPress={() => { this.setState({ showPhoto: false, photo: null }); }} style={{ marginRight: getProportionalSize('w', 25) }}>
                                <Feather name="x-circle" size={getProportionalSize('h', 9.16)} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { 
                                this.props.shooted(this.state.photo);
                                this.setState({ showPhoto: false, photo: null });
                            }}>
                                <Feather name="check-circle" size={getProportionalSize('h', 9.16)} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>
            : 
            <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => { this.camera = ref; }}
                flashMode={this.state.flashMode}>
                <View style={{
                    flex: 1,
                    backgroundColor: this.state.bgColor,
                    flexDirection: 'column',
                    padding: getProportionalSize('h', 2.3),
                }}
                onLayout={(event) => this.setState({
                    widthLayout : event.nativeEvent.layout.width,
                    heightLayout : event.nativeEvent.layout.height
                   }, () => this.detectOrientation())}>

                { this.state.showClose ?
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            style={{ alignSelf: 'flex-start', alignItems: 'center' }}
                            onPress={() => {
                                let timerIcon = this.state.timerIcon;
                                //let showTimer = this.state.showTimer;
                                this.setState({ timerIcon: timerIcon == 'timer-off' ? 'timer' : 'timer-off',
                                                firstTimeLoad: false });
                                if (this.state.timerIcon == 'timer') {
                                    // Exibe label 3s
                                    var self = this;
                                    this.setState({ showTimer: true, segundos: '3s' });
                                    setTimeout(() => {
                                        self.setState({ showTimer: false });
                                    }, 500);
                                } else {
                                    this.setState({ showTimer: true, segundos: 'Timer desligado' });
                                    setTimeout(() => {
                                        self.setState({ showTimer: false });
                                    }, 500);
                                }    
                            }}>
                            <MaterialIcons name={this.state.timerIcon} size={getProportionalSize('h', 4.01)} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ alignSelf:'flex-start', alignItems: 'center' }}
                            onPress={() => {
                                if (this.props.closeAction) {
                                    this.props.closeAction();
                                }
                            }}>
                            <MaterialCommunityIcons name="close-circle" size={getProportionalSize('h', 4.01)} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            style={{ alignSelf: 'flex-start', alignItems: 'center' }}
                            onPress={() => {
                                let timerIcon = this.state.timerIcon;
                                //let showTimer = this.state.showTimer;
                                this.setState({ timerIcon: timerIcon == 'timer-off' ? 'timer' : 'timer-off',
                                                firstTimeLoad: false });
                                if (this.state.timerIcon == 'timer') {
                                    // Exibe label 3s
                                    var self = this;
                                    this.setState({ showTimer: true, segundos: '3s' });
                                    setTimeout(() => {
                                        self.setState({ showTimer: false });
                                    }, 500);
                                }                
                            }}>
                            <MaterialIcons name={this.state.timerIcon} size={getProportionalSize('h', 4.01)} color="#fff" />
                        </TouchableOpacity>
                        { this.state.orientationStatus == 'LANDSCAPE' ?
                            <View style={{ alignSelf:'flex-start', alignItems: 'center' }} />
                            : null
                        }
                    </View>
                }

                    { this.state.showTimer && !this.state.firstTimeLoad ? 
                        <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
                            {/* <Animatable.View animation="fadeOut"> */}
                                <Text style={{ color: '#fff', fontSize: 52, fontWeight: 'bold' }}>{this.state.segundos}</Text>
                            {/* </Animatable.View> */}
                        </View>
                    : null }

                    { this.state.orientationStatus == 'LANDSCAPE' ?
                        <TouchableOpacity
                                style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}
                                onPress={() => {
                                    this.shootPhoto();
                                }}>
                                <MaterialIcons name="camera-alt" size={getProportionalSize('w', 9.16)} color="#fff" />
                        </TouchableOpacity>
                        : null
                    }

                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'transparent',
                                    justifyContent: 'space-between',
                                    paddingLeft: getProportionalSize('h', 2.3),
                                    paddingRight: getProportionalSize('h', 2.3),
                                    paddingBottom: getProportionalSize('h', 2.3) }}>
                        <TouchableOpacity 
                            style={{ alignSelf: 'flex-end', alignItems: 'center', }}
                            onPress={() => {
                                let type = this.state.type;
                                this.setState({
                                    type: type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back,
                                    cameraIcon: this.state.cameraIcon === "camera-rear" ? "camera-front" : "camera-rear"
                                });
                            }}>
                            <MaterialIcons name={this.state.cameraIcon} size={getProportionalSize('h', 4.01)} color="#fff" />
                        </TouchableOpacity>

                        { this.state.orientationStatus != 'LANDSCAPE' ?
                            <TouchableOpacity
                                style={{ alignSelf: 'flex-end', alignItems: 'center' }}
                                onPress={() => {
                                    this.shootPhoto();
                                }}>
                                <MaterialIcons name="camera-alt" size={getProportionalSize('h', 9.16)} color="#fff" />
                            </TouchableOpacity>
                            : null
                        }

                        <TouchableOpacity
                            style={{ alignSelf: 'flex-end', alignItems: 'center' }}
                            onPress={() => {
                                this.setFlashMode();
                            }}>
                            <MaterialIcons name={this.state.cameraFlash} size={getProportionalSize('h', 4.01)} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Camera>);
    }
}
