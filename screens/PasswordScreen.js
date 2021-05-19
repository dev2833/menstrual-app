import React, {useRef, useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,Alert, Dimensions, ImageBackground} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import PINCode, { hasUserSetPinCode, resetPinCodeInternalStates, deleteUserPinCode } from '@haskkor/react-native-pincode'; 
import AsyncStorage from '@react-native-community/async-storage';
import { TestIds, BannerAd, BannerAdSize, InterstitialAd, AdEventType} from '@react-native-firebase/admob';
import config from '../settings/config'

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;


export default function PasswordScreen({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const language = useSelector(state => state.language);
  const[showPinLock, setShowPinLock] = useState(true)
  const[pinStatus, setPinStatus] = useState("choose")

  React.useEffect(() => { 
    const bootstrapAsync = async () => {
        try {
          const hasPin = await hasUserSetPinCode();
          if(hasPin){
              setShowPinLock(false)
          }
        } catch (e) {
          console.log(e)
        }
    };
    bootstrapAsync();

  }, []);


  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>
        <View style={{flex:1, margin: 10, }}>
            {showPinLock?(
                <PINCode 
                    status={pinStatus} 
                    touchIDDisabled={true} 
                    finishProcess={()=> finishProcess()}
                /> 
            ):(
                <TouchableOpacity style={{padding: 10, borderBottomColor: '#d1c8c8', borderBottomWidth:1}} 
                    onPress={()=> clearPassword()}>
                    <Text style={{fontSize: 18}}>{config.Labels[language].pass_clear}</Text>
                </TouchableOpacity>
            )}
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

  async function finishProcess(){
    const hasPin = await hasUserSetPinCode();
    if(hasPin){
        Alert.alert(null, "You have successfully set your pin.", [
            {
              title: "Ok",
              onPress: () => {
                // do nothing
              },
            },
          ]);
        setShowPinLock(false)
        await AsyncStorage.setItem("isPasswordSet", "true");
        navigation.navigate("dashboard")
    }
    
  }

  async function clearPassword(){
    await deleteUserPinCode();
    await resetPinCodeInternalStates();
    await AsyncStorage.setItem("isPasswordSet", "false");
    Alert.alert(null, "You have cleared your pin.", [
      {
        title: "Ok",
        onPress: () => {
            setShowPinLock(true)
        },
      },
    ]);
  }
}

const styles= StyleSheet.create({
    
});