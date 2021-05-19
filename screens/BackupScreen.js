import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Alert} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { TestIds, BannerAd, BannerAdSize, InterstitialAd, AdEventType} from '@react-native-firebase/admob';
import { GoogleSignin, GoogleSigninButton,statusCodes } from 'react-native-google-signin';
import moment from 'moment-timezone'
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import config from '../settings/config'
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

export default function BackupScreen({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const language = useSelector(state => state.language);
  const users = useSelector(state => state.users);
  const dashboardRerender = useSelector(state => state.dashboardRerender);
  const[isLogin, setIsLogin] = useState(false);
  const[userDetails, setUserDetails] = useState({});
  const[imageURL, setImageUrl] = useState("");
  const[firstText, setFirstText] = useState("Sign in and synchronize your data")
  const[secondText, setSecondText] = useState("So your data won't be lost when your device changed.")
  const[btnText, setBtnText] = useState("Google Acount")
  const [spinnerEnabled, setSpinnerEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(()=> {
    initialise()
  }, [])

  async function initialise(){
    const isSignedIn = await GoogleSignin.isSignedIn();
    setIsLogin(isSignedIn)
    if(isSignedIn){
      const currentUser = await GoogleSignin.getCurrentUser();
      const user = currentUser.user
      setImageUrl(user.photo)
      setFirstText(user.email)
      setBtnText(config.Labels[language].back_sync)
      setUserDetails(user)
      setSecondText(config.Labels[language].back_last_sync + moment(new Date()).format('MMM Do HH:mm'))
    }

    GoogleSignin.configure({
        webClientId: '85937389431-2e19pacl8e4ouc1vobb3hg3p2ch5sodh.apps.googleusercontent.com', // client ID of type WEB for your server(needed to verify user ID and offline access)
        offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
        accountName: '', // [Android] specifies an account name on the device that should be used
    });
  }

  async function signIn() {
    try {
      if(isLogin){
        syncData(userDetails.email, "refresh");
      }else{
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        if(userInfo!=null && userInfo.hasOwnProperty("user")){
          const user = userInfo.user;
          console.log(user)
          setImageUrl(user.photo)
          setFirstText(user.email)
          setBtnText(config.Labels[language].back_sync)
          setIsLogin(true)
          syncData(user.email, "fresh");
          setSecondText(config.Labels[language].back_last_sync + moment(new Date()).format('MMM Do HH:mm'))
        }
      }
      
      
    } catch (error) {
      console.log(error)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  async function syncData(email, type){
    setSpinnerEnabled(true)
    var data = users;
    console.log("data-", JSON.stringify(data))
    await fetch('http://srijanacademy.net/api_live/menstrual.php', {
        method: 'POST',
        body: "data="+JSON.stringify(data)+"&email="+email+"&type="+type,
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      if(responseJson.result=="success"){
        updateUser(responseJson);
      }
      setSpinnerEnabled(false)
    })
    .catch((error) => {
        console.error(error);
        setSpinnerEnabled(false);
    })
  }

  async function updateUser(response){
    if(response.data!="" 
      && response.data!=null 
      && response.data!="undefined" 
      && Object.keys(response.data).length != 0){
      dispatch({ type: 'SET_USER', data: response.data });
      await AsyncStorage.setItem("users", JSON.stringify(response.data));

      dispatch({ type: 'CURRENT_USER', data: Object.keys(response.data)[0] });
      await AsyncStorage.setItem("currentUser", Object.keys(response.data)[0]);
      dispatch({ type: 'DASHBOARD_RERENDER', data: !dashboardRerender });
      console.log("upadted---", response.data)
      console.log(Object.keys(response.data)[0])
    }else{
      Alert.alert(
        '',
        'Sorry! No data is associated with this account.',
        [
          {text: 'OK', onPress: () => {
            dispatch({ type: 'DASHBOARD_RERENDER', data: !dashboardRerender });
            navigation.navigate("dashboard")
          }},
        ]
      );
    }
  }

  async function signout(){
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setImageUrl("")
      setFirstText(config.Labels[language].back_signin)
      setSecondText(config.Labels[language].back_lost_msg)
      setBtnText("Google Account")
      setIsLogin(false)
    } catch (error) {
      console.error(error);
    }
  }
    
  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>
        <Spinner
            visible={spinnerEnabled}
            textContent={'Syncing...'}
            textStyle={{color: '#000'}}
        />
        <View style={{flex:1, margin: 30, }}>
            <View style={{alignItems:'center'}}>
              {imageURL==""?(
                <Image source={require('../assets/profile.png')} 
                style={{width: 100, height: 100, resizeMode: 'stretch', marginBottom: 20}}/>
              ):(
              <Image source={{ uri: imageURL }} 
                      style={{width: 100, height: 100, resizeMode: 'stretch', marginBottom: 20, borderRadius: 100}}/>
              )}
              <Text style={{fontSize: 20, color: '#000', fontWeight: 'bold',textAlign: 'center'}}>{firstText}</Text>
              <Text style={{fontSize: 14, textAlign: 'center', marginBottom: 30}}>{secondText}</Text>
              {/* <GoogleSigninButton
                style={{ width: 300, height: 55 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={()=> signIn()}/> */}
                <TouchableOpacity style={{flexDirection: 'row', backgroundColor: config.THEME[theme].period_text, width: '90%', height: 50,justifyContent: 'center', alignItems: 'center', borderRadius: 10}} 
                  onPress={()=> signIn()}>
                  <FontAwesome name="google" size={40} color="#fff" style={{width: '30%', marginLeft: 20}}/>
                  <Text style={{width: '70%', color: '#fff', fontSize: 18}}>{btnText}</Text>
                </TouchableOpacity>
            </View>
            {isLogin?(
              <TouchableOpacity style={{flexDirection: 'row',padding: 15, borderBottomColor: '#f2f2f2', borderBottomWidth:1, width: '100%', marginTop: 20}} 
                  onPress={()=> signout()}>
                  <View style={{flexDirection: 'row', width: '70%'}}>
                    <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].back_signout}</Text>
                  </View>
              </TouchableOpacity>
            ):(null)}
        </View>
        <View>
            <BannerAd
                unitId={config.admob_banner}
                size={BannerAdSize.SMART_BANNER}
                requestOptions={{
                requestNonPersonalizedAdsOnly: true,}}
                onAdLoaded={() => {
                console.log('Advert loaded');}}
                onAdFailedToLoad={(error) => {
                console.error('Advert failed to load: ', error);}}
                />
        </View>
    </View>
  );
}

const styles= StyleSheet.create({
    
});