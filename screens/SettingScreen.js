import React, {useRef, useState} from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions, ScrollView, Linking} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { TestIds, BannerAd, BannerAdSize, InterstitialAd, AdEventType} from '@react-native-firebase/admob';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import config from '../settings/config'
import Modal from 'react-native-modal';
import RadioForm from 'react-native-simple-radio-button';
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const interstitial = InterstitialAd.createForAdRequest(config.admob_env=="dev"?TestIds.INTERSTITIAL:config.admob_id, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

export default function SettingScreen({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const language = useSelector(state => state.language);
  const lIndex = useSelector(state => state.langIndex);
  const[langModal, setLangModal] = useState(false)
  const users = useSelector(state => state.users);
  const currentUser = useSelector(state => state.currentUser);
  const periodLength = route.params.period;
  const cycleLength = route.params.cycle;
  const dashboardRerender = useSelector(state => state.dashboardRerender);
  const [loaded, setLoaded] = useState(false);

  React.useEffect(() => {
      const eventListener = interstitial.onAdEvent(type => {
          if (type === AdEventType.LOADED) {
              setLoaded(true);
          }else if (type === AdEventType.CLOSED) {
              console.log('InterstitialAd => adClosed');
              interstitial.load();
          }
      });

      // Start loading the interstitial straight away
      interstitial.load();

      // Unsubscribe from events on unmount
      return () => {
        eventListener();
      };
  }, []);
  
  
  async function changeLang(lang){
    console.log(lang)
    dispatch({ type: 'CHANGE_LANG', data: lang });
    dispatch({ type: 'LANG_INDEX', data: lang==="en"?0:1 });
    await AsyncStorage.setItem("language", lang);
    setLangModal(false)
  }

  var lang_props = [
    {label: "English", value: 'en' },
    {label: "Spanish", value: 'sp' }
  ];
    
  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>
        <Modal isVisible={langModal} style={{alignItems: 'center'}} 
        onBackdropPress={()=> setLangModal(false)} 
        onBackButtonPress={()=> setLangModal(false)}>
          <View style={styles.modalContent}>
            <Text style={{fontSize: 18, margin: 10, textAlign: 'center', fontWeight: 'bold' ,color: config.THEME[theme].period_text}}>{config.Labels[language].dash_select_lang}</Text>
             <View style={{flexDirection: 'column', width: '100%', margin:10}}>
                
                <RadioForm
                  style={{}}
                  radio_props={lang_props}
                  buttonColor= {config.THEME[theme].cycle_text}
                  selectedButtonColor = {config.THEME[theme].cycle_text}
                  initial={lIndex}
                  animation={true}
                  buttonSize={12}
                  radioStyle={{margin: 10}}
                  labelStyle={{ fontSize: 18, color: config.THEME[theme].period_text, marginRight: 3,}}
                  onPress={(value) => {
                    changeLang(value)
                  }}
                  />
             </View>
          </View>
      </Modal>
        <View style={{flex:1, margin: 10, }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                <Text style={{color: '#c9c6c3', fontSize: 14, fontWeight: 'bold', marginBottom: 5}}>{config.Labels[language].set_period}</Text>
                <View style={{borderBottomColor: '#f2f2f2',borderBottomWidth: 2, }}/>
                <TouchableOpacity style={{flexDirection: 'row',padding: 15, borderBottomColor: '#f2f2f2', borderBottomWidth:1, width: '100%'}} 
                    onPress={()=> {
                      interstitial.show()
                      navigation.navigate("period")
                    }}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                      <FontAwesome5 name="egg" size={25} color="#515151" style={{marginRight: 20}}/>
                      <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].set_period_l}</Text>
                    </View>
                    <Text style={{fontSize: 12, width: '30%', textAlign: 'right', color: '#898989'}}>{periodLength} {config.Labels[language].ovu_days}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection: 'row',padding: 15, borderBottomColor: '#f2f2f2', borderBottomWidth:1, width: '100%'}} 
                    onPress={()=> {
                      interstitial.show()
                      navigation.navigate("cycle")
                    }}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                      <Entypo name="back-in-time" size={25} color="#515151" style={{marginRight: 20}}/>
                      <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].set_cycle_l}</Text>
                    </View>
                    <Text style={{fontSize: 12, width: '30%', textAlign: 'right', color: '#898989'}}>{cycleLength} {config.Labels[language].ovu_days}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection: 'row',padding: 15, borderBottomColor: '#f2f2f2', borderBottomWidth:1, width: '100%'}} 
                    onPress={()=> {
                      interstitial.show()
                      navigation.navigate("ovulation")
                    }}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                      <Entypo name="grooveshark" size={25} color="#515151" style={{marginRight: 20}}/>
                      <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].set_ovu}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection: 'row',padding: 15,  width: '100%'}} 
                    onPress={()=> {
                      interstitial.show()
                      navigation.navigate("pregnancy")
                    }}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                      <MaterialIcons name="pregnant-woman" size={25} color="#515151" style={{marginRight: 20}}/>
                      <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].set_preg}</Text>
                    </View>
                </TouchableOpacity>
              </View>
              <View style={{marginTop: 10}}>
                <Text style={{color: '#c9c6c3', fontSize: 14, fontWeight: 'bold', marginBottom: 5}}>{config.Labels[language].set_remind_head}</Text>
                <View style={{borderBottomColor: '#f2f2f2',borderBottomWidth: 2, }}/>
                <TouchableOpacity style={{padding: 15,  width: '100%'}} 
                    onPress={()=> {
                      interstitial.show()
                      navigation.navigate("reminder")
                    }}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                    <MaterialIcons name="notifications" size={25} color="#515151" style={{marginRight: 20}}/>
                      <View>
                        <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].set_remind}</Text>
                        <Text style={{fontSize: 12,textAlign: 'left', color: '#898989'}}>{config.Labels[language].set_remind_text}</Text>
                      </View>
                    </View>
                </TouchableOpacity>
              </View>
              <View style={{marginTop: 10}}>
              <Text style={{color: '#c9c6c3', fontSize: 14, fontWeight: 'bold', marginBottom: 5}}>{config.Labels[language].set_person}</Text>
              <View style={{borderBottomColor: '#f2f2f2',borderBottomWidth: 2, }}/>
              <TouchableOpacity style={{padding: 15, borderBottomColor: '#f2f2f2', borderBottomWidth:1, width: '100%'}} 
                  onPress={()=> {
                    interstitial.show()
                    navigation.navigate("theme")
                  }}>
                  <View style={{flexDirection: 'row', width: '70%'}}>
                    <Entypo name="colours" size={25} color="#515151" style={{marginRight: 20}}/>
                    <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].set_theme}</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity style={{padding: 15, borderBottomColor: '#f2f2f2', borderBottomWidth:1, width: '100%'}} 
                  onPress={()=> {
                    interstitial.show()
                    navigation.navigate("calendar")
                  }}>
                  <View style={{flexDirection: 'row', width: '70%'}}>
                    <FontAwesome name="calendar" size={25} color="#515151" style={{marginRight: 20}}/>
                    <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].set_cal}</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity style={{padding: 15,  width: '100%'}} 
                  onPress={()=> {
                    interstitial.show()
                    navigation.navigate("symptomood")
                  }}>
                  <View style={{flexDirection: 'row', width: '70%'}}>
                    <FontAwesome5 name="disease" size={25} color="#515151" style={{marginRight: 20}}/>
                    <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].sub_symptomood}</Text>
                  </View>
              </TouchableOpacity>
            </View>
            
              <View style={{marginTop: 10}}>
                <Text style={{color: '#c9c6c3', fontSize: 14, fontWeight: 'bold', marginBottom: 5}}>{config.Labels[language].set_data}</Text>
                <View style={{borderBottomColor: '#f2f2f2',borderBottomWidth: 2, }}/>
                <TouchableOpacity style={{padding: 15, borderBottomColor: '#f2f2f2', borderBottomWidth:1, width: '100%'}} 
                    onPress={()=> {
                      interstitial.show()
                      navigation.navigate("backup")
                    }}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                      <MaterialCommunityIcons name="backup-restore" size={25} color="#515151" style={{marginRight: 20}}/>
                      <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].sub_backup}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{padding: 15, borderBottomColor: '#f2f2f2', borderBottomWidth:1, width: '100%'}} 
                    onPress={()=> {
                      interstitial.show()
                      navigation.navigate("password")
                    }}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                      <FontAwesome5 name="key" size={25} color="#515151" style={{marginRight: 20}}/>
                      <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].sub_pass}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{padding: 15, width: '100%'}} 
                    onPress={()=> {
                      interstitial.show()
                      navigation.navigate("adduser")
                    }}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                      <FontAwesome name="user-plus" size={25} color="#515151" style={{marginRight: 20}}/>
                      <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].set_add_another}</Text>
                    </View>
                </TouchableOpacity>
              </View>

              <View style={{marginTop: 10}}>
                <Text style={{color: '#c9c6c3', fontSize: 14, fontWeight: 'bold', marginBottom:5}}>{config.Labels[language].set_gen}</Text>
                <View style={{borderBottomColor: '#f2f2f2',borderBottomWidth: 2, }}/>
                <TouchableOpacity style={{padding: 15, borderBottomColor: '#f2f2f2', borderBottomWidth:1, width: '100%'}} 
                    onPress={()=> setLangModal(true)}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                      <FontAwesome5 name="language" size={25} color="#515151" style={{marginRight: 20}}/>
                      <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].sub_lang}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{padding: 15, width: '100%'}} 
                    onPress={()=> {
                      interstitial.show()
                      navigation.navigate("metric")
                    }}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                      <FontAwesome5 name="thermometer" size={25} color="#515151" style={{marginRight: 20}}/>
                      <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].sub_metric}</Text>
                    </View>
                </TouchableOpacity>
                {/* <TouchableOpacity style={{padding: 10, borderBottomColor: '#d1c8c8', borderBottomWidth:1, width: '100%'}} 
                    onPress={()=> navigation.navigate("symptomood")}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                      <MaterialCommunityIcons name="circle-slice-4" size={25} color={config.THEME[theme].icon_color} style={{marginRight: 10}}/>
                      <Text style={{fontSize: 16, color: '#605e5e'}}>Show / Hide Options</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{padding: 10,  width: '100%'}} 
                    onPress={()=> console.log("backup click....")}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                      <FontAwesome5 name="plus-circle" size={25} color={config.THEME[theme].icon_color} style={{marginRight: 10}}/>
                      <Text style={{fontSize: 16, color: '#605e5e'}}>Export document to Doctor</Text>
                    </View>
                </TouchableOpacity> */}
              </View>

              <View style={{marginTop: 10}}>
                <Text style={{color: '#c9c6c3', fontSize: 14, fontWeight: 'bold', marginBottom:5}}>{config.Labels[language].set_other}</Text>
                <View style={{borderBottomColor: '#f2f2f2',borderBottomWidth: 2, }}/>
                {/* <TouchableOpacity style={{padding: 10, borderBottomColor: '#d1c8c8', borderBottomWidth:1, width: '100%'}} 
                    onPress={()=> console.log("backup click....")}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                      <MaterialIcons name="report" size={25} color={config.THEME[theme].icon_color} style={{marginRight: 10}}/>
                      <Text style={{fontSize: 16, color: '#605e5e'}}>Bug report & Feedback</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{padding: 10, borderBottomColor: '#d1c8c8', borderBottomWidth:1, width: '100%'}} 
                    onPress={()=> console.log("request click")}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                      <MaterialIcons name="create-new-folder" size={25} color={config.THEME[theme].icon_color} style={{marginRight: 10}}/>
                      <Text style={{fontSize: 16, color: '#605e5e'}}>Request a new feature</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{padding: 10, borderBottomColor: '#d1c8c8', borderBottomWidth:1, width: '100%'}} 
                    onPress={()=> console.log("request click")}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                      <Entypo name="google-play" size={25} color={config.THEME[theme].icon_color} style={{marginRight: 10}}/>
                      <Text style={{fontSize: 16, color: '#605e5e'}}>Rate us on Google Play</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{padding: 10, borderBottomColor: '#d1c8c8', borderBottomWidth:1, width: '100%'}} 
                    onPress={()=> console.log("request click")}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                      <FontAwesome5 name="share-alt" size={25} color={config.THEME[theme].icon_color} style={{marginRight: 10}}/>
                      <Text style={{fontSize: 16, color: '#605e5e'}}>Share with friends</Text>
                    </View>
                </TouchableOpacity> */}
                <TouchableOpacity style={{padding: 15, width: '100%'}} 
                    onPress={()=> deleteAll()}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                      <MaterialIcons name="delete-forever" size={25} color="#515151" style={{marginRight: 10}}/>
                      <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].set_delete}</Text>
                    </View>
                </TouchableOpacity>
                {/* <TouchableOpacity style={{padding: 10, width: '100%'}} 
                    onPress={()=> console.log("req click")}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                      <MaterialIcons name="policy" size={25} color={config.THEME[theme].icon_color} style={{marginRight: 10}}/>
                      <Text style={{fontSize: 16, color: '#605e5e'}}>Privacy policy</Text>
                    </View>
                </TouchableOpacity> */}
              </View>
            </ScrollView>
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

  async function deleteAll(){
    Alert.alert(
      'Tip',
      'Are you sure to reset app and delete all data?',
      [
        {text: 'CANCEL', onPress: () => console.log('NO Pressed'), style: 'cancel'},
        {text: 'OK', onPress: async () => {
          
          dispatch({ type: 'SET_USER', data: {} });
          dispatch({ type: 'CURRENT_USER', data: null });
          dispatch({ type: 'DASHBOARD_RERENDER', data: !dashboardRerender });
          await AsyncStorage.removeItem("users");
          navigation.navigate("dashboard")
        }},
      ]
    );
  }
}

const styles= StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        width: '90%',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    }
});