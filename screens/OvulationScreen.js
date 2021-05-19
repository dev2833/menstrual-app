import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, ImageBackground} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { TestIds, BannerAd, BannerAdSize, InterstitialAd, AdEventType} from '@react-native-firebase/admob';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import config from '../settings/config'
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;


export default function OvulationScreen({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const users = useSelector(state => state.users);
  const language = useSelector(state => state.language);
  const currentUser = useSelector(state => state.currentUser);
  const[lutealLength, setLutealLength] = useState("14")

  React.useEffect(() => { 
    setLutealLength(users[currentUser].luteal)
    
  }, []);

  function updatePeriod(type){
      if(type=="minus" && lutealLength!=1){
        const next = parseInt(lutealLength)-1
        setLutealLength(next+"")
      }else if(type=="plus"){
          const next = parseInt(lutealLength)+1
          setLutealLength(next+"")
      }
  }

  async function updatePeriodDetails(){
    users[currentUser].luteal = lutealLength;
    console.log(users)
    dispatch({ type: 'SET_USER', data: users });
    await AsyncStorage.setItem("users", JSON.stringify(users));
    navigation.navigate("setting", {period: users[currentUser].periodLength, cycle: users[currentUser].cycleLength})
  }
    
  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>
        <View style={{flex:1, margin: 10, }}>
            <Text style={{fontSize: 16, color: '#605e5e', marginBottom: 10, marginLeft: 20}}>{config.Labels[language].ovu_luteal}</Text>
            <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={{flexDirection: 'row', width: '50%', alignItems: 'center', justifyContent: 'center'}}>
                    <TextInput 
                        value={lutealLength}
                        keyboardType={"number-pad"}
                        onChangeText={(text) => setLutealLength(text)}  
                        style={{width: 60, height: 60, backgroundColor: '#efe3d7', borderWidth: 1, borderColor: '#fff', textAlign: 'center', fontSize: 20}}/>
                    <View style={{width: 60, height: 60, backgroundColor: '#efe3d7', borderWidth: 1, borderColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 18}}>{config.Labels[language].ovu_days}</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', width: '50%', alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity onPress={()=> updatePeriod("plus")}
                        style={{width: 60, height: 60, backgroundColor: '#efe3d7', borderWidth: 1, borderColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                        <FontAwesome name="plus" size={25} color='#000'/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> updatePeriod("minus")} 
                        style={{width: 60, height: 60, backgroundColor: '#efe3d7', borderWidth: 1, borderColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                        <FontAwesome name="minus" size={25} color='#000'/>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={{fontSize: 14, color: '#605e5e', marginBottom: 5, marginTop: 20, marginLeft: 10}}>
                {config.Labels[language].ovu_we_use}
            </Text>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <LinearGradient colors={config.THEME[theme].menu_button_color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{width: '80%', borderRadius: 10, marginTop: 20}}>
                    <TouchableOpacity style={styles.menuTab} 
                        onPress={()=> updatePeriodDetails()}>
                        <Text style={{...styles.menuText, color: config.THEME[theme].menu_text}}>{config.Labels[language].ovu_update}</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
            
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
    menuTab:{
        width: '100%', 
        height: 40, 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    menuText:{
        marginLeft: 2, 
        padding: 2, 
        fontSize: 14, 
        fontFamily: 'neosans_pro_regular', 
        fontWeight: 'bold'
    }
});