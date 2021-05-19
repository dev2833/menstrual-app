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
const interstitial = InterstitialAd.createForAdRequest(config.admob_env=="dev"?TestIds.INTERSTITIAL:config.admob_id, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing'],
  });

export default function CycleLengthScreen({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const users = useSelector(state => state.users);
  const language = useSelector(state => state.language);
  const currentUser = useSelector(state => state.currentUser);
  const[cycleLength, setCycleLength] = useState("4")
  const dashboardRerender = useSelector(state => state.dashboardRerender);
  const [loaded, setLoaded] = useState(false);

  React.useEffect(() => { 
    setCycleLength(users[currentUser].cycleLength)
    
  }, []);


  function updatePeriod(type){
      if(type=="minus" && cycleLength!=1){
        const next = parseInt(cycleLength)-1
        setCycleLength(next+"")
      }else if(type=="plus"){
          const next = parseInt(cycleLength)+1
          setCycleLength(next+"")
      }
      dispatch({ type: 'DASHBOARD_RERENDER', data: !dashboardRerender });
  }

  async function updatePeriodDetails(){
    users[currentUser].cycleLength = cycleLength;
    console.log(users)
    dispatch({ type: 'SET_USER', data: users });
    await AsyncStorage.setItem("users", JSON.stringify(users));
    navigation.navigate("setting", {period: users[currentUser].periodLength, cycle: cycleLength})
  }
    
  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>
        <View style={{flex:1, margin: 10, }}>
            <Text style={{fontSize: 16, color: '#605e5e', marginBottom: 10, marginLeft: 20}}>{config.Labels[language].set_cycle_l}</Text>
            <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={{flexDirection: 'row', width: '50%', alignItems: 'center', justifyContent: 'center'}}>
                    <TextInput 
                        value={cycleLength}
                        keyboardType={"number-pad"}
                        onChangeText={(text) => setCycleLength(text)}  
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
                {config.Labels[language].cycle_predict}
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