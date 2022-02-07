import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import ProgressBar from 'react-native-progress/Bar'
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseImageUser: null,
      styleImageUser: null,
      dataSource: null,
      loading: true
    }
  }
  goBackFunction() {
    this.setState({
      baseImageUser: null,
      styleImageUser: null
    })
  }

  goForAxios() {
    const { baseImageUser, styleImageUser } = this.state
    axios.request(
      {
        method: 'POST',
        url: 'https://ai-art-maker.p.rapidapi.com/art-remixer-api',
        headers: {
          'content-type': 'application/json',
          'x-rapidapi-host': 'ai-art-maker.p.rapidapi.com',
          'x-rapidapi-key': 'AnaAO5F8DtV86KC8d7D3vANFwCjLlyHA'
        },
        data: {
          base64ContentImage: baseImageUser,
          bas64StyleImageList: [styleImageUser],
          focusContent: true
        }
      }
    ).then(function (response) {
      console.log(response.data);
      this.setState({ loading: false, dataSource: response.data.base64Image })
    }).catch(function (error) {
      console.error(error);
    });
  }
  selectBaseImage() {
    const options = {
      includeBase64: true
    }
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("user canceled image")
      }
      else if (response.error) {
        console.log('image picker error' + response.error)
      }
      else if (response.customButton) {
        console.log('user pressed custom button')
      } else {
        this.setState({
          baseImageUser: response.base64
        })
      }
    })
  }

  selectStyleImage() {
    const options = {
      includeBase64: true
    }
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("user canceled image")
      }
      else if (response.error) {
        console.log('image picker error' + response.error)
      }
      else if (response.customButton) {
        console.log('user pressed custom button')
      } else {
        this.setState({
          styleImageUser: response.base64
        })
      }
    })
  }


  render() {
    const { baseImageUser, styleImageUser, loading, dataSource } = this.state
    return (
      baseImageUser == null || styleImageUser == null ? (
        < LinearGradient
          colors={['#ffe063', '#a061fe']}
          style={styles.linerarGradient} >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Neural Style Transfer</Text>
            <Text style={styles.subtitle}>Art style transfer generator</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image source={require('./assets/painting.png')} style={styles.paintingImage}></Image>
          </View>
          <View style={styles.buttonContainer}>
            {
              baseImageUser ? (
                <ProgressBar indeterminate={true}></ProgressBar>
              ) : (
                <Button
                  title="Select Base Image"
                  buttonStyle={styles.button}
                  onPress={this.selectBaseImage.bind(this)}
                ></Button>
              )
            }
            {
              styleImageUser ? (
                <ProgressBar indeterminate={true}></ProgressBar>
              ) : (
                <Button
                  title="Select Style Image"
                  buttonStyle={styles.button}
                  onPress={this.selectStyleImage.bind(this)}
                ></Button>
              )
            }
          </View>
        </LinearGradient >
      ) : < LinearGradient
        colors={['#ffe063', '#a061fe']}
        style={styles.linerarGradient} >
        <Button onPress={goBackFunction.bind(this)} title="Go to Menu" buttonStyle={styles.buttonBack} containerStyle={styles.buttonBackContainer}></Button>
        <Button onPress={this.goForAxios.bind(this)} title="Transfer Image" buttonStyle={styles.button} containerStyle={styles.buttonTransferContainer}></Button>
        {
          baseImageUser ? <Image style={styles.images} source={{ uri: `data:image/png;base64,${baseImageUser}` }} ></Image> :
            <ProgressBar indeterminate={true}></ProgressBar>
        }
        {
          !loading ? <Image style={styles.images} source={{ uri: `data:image/png;base64,${dataSource}` }} ></Image> :
            <ProgressBar indeterminate={true}></ProgressBar>
        }
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  linerarGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: 200,
    height: 57,
    backgroundColor: 'black',
    borderRadius: 8,
    margin: 5
  },
  titleContainer: {
    marginTop: 80,
    marginLeft: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },

  images: {
    width: 250,
    height: 250,
    resizeMode: 'stretch',
    margin: 2
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    paddingBottom: 40,
    alignItems: 'center'
  },
  inputContainer: {
    marginHorizontal: 10,
    marginTop: 90
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  paintingImage: {
    width: 260,
    height: 260,
  },
  output: {
    fontSize: 29,
    alignItems: 'center'
  },
  buttonBack: {
    width: 150,
    height: 50,
    backgroundColor: 'black',
    marginBottom: 8,
    borderRadius: 10
  },
  buttonBackContainer: {
    marginTop: 3
  },
  buttonTransferContainer: { margin: 10 }
})