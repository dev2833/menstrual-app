import React, {useRef, useState} from 'react';
import { View, Text, StyleSheet,Alert, Image, ScrollView, TextInput, TouchableOpacity, ImageBackground, Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import styles from '../styles/dashboard_style'
import DatePicker from 'react-native-date-picker'
import DateTimePicker from '@react-native-community/datetimepicker';
import { showMessage } from "react-native-flash-message";
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment-timezone'
import AsyncStorage from '@react-native-community/async-storage';
import { TestIds, BannerAd, BannerAdSize, InterstitialAd, AdEventType} from '@react-native-firebase/admob';
import config from '../settings/config'
import PINCode, { hasUserSetPinCode} from '@haskkor/react-native-pincode'; 
import Spinner from 'react-native-loading-spinner-overlay';
import RadioForm from 'react-native-simple-radio-button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import PushNotification from 'react-native-push-notification'

const interstitial = InterstitialAd.createForAdRequest(config.admob_env=="dev"?TestIds.INTERSTITIAL:config.admob_id, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

export default function DashboardScreen({navigation}) {
  const dispatch = useDispatch();
  const users = useSelector(state => state.users);
  const currentUser = useSelector(state => state.currentUser);
  const theme = useSelector(state => state.theme);
  const language = useSelector(state => state.language);
  const lIndex = useSelector(state => state.langIndex);
  const passLock = useSelector(state => state.passLock);
  const dashboardRerender = useSelector(state => state.dashboardRerender);

  const[period, setPeriod] = useState("4")
  const[cycle, setCycle] = useState("28")
  const[periodStartDate, setPeriodStartDate] = useState("")
  const[firstModal, setFirstModal] = useState(false)
  const[langModal, setLangModal] = useState(false)
  const[showCancle, setShowCancle] = useState(false)
  const[showPinLock, setShowPinLock] = useState(passLock)
  const [spinnerEnabled, setSpinnerEnabled] = useState(false);
  const [userModal, setUserModal] = useState(false)
  
  const [date, setDate] = useState(moment.tz(new Date(),'Asia/Kolkata').toDate())
  
  const [show, setShow] = useState(false);

  const [periodError, setPeriodError] = useState(false)
  const [cycleError, setCycleError] = useState(false)
  const [dateError, setDateError] = useState(false)

  const [periodDay, setPeriodDay] = useState("")
  const [periodDayText, setPeriodDayText] = useState("")
  const [nextPeriod, setNextPeriod] = useState("")
  const [fertile, setFertile] = useState("")  
  const [pregnancy, setPregnancy] = useState(false)  
  const [pregnancyMessage, setPregnancyMessage] = useState("")  
  const [pregnancyData, setPregnancyData] = useState("")  

  const[langIndex, setLangIndex] = useState(lIndex)
  const [loaded, setLoaded] = useState(false);

  React.useEffect(() => {  
    const bootstrapAsync = async () => {
        try {
          //PushNotification.cancelAllLocalNotifications()
          PushNotification.getScheduledLocalNotifications(function(allnotify){
            console.log(allnotify)
          });
          var savedUsersStr = await AsyncStorage.getItem("users");
          var savedUsername = await AsyncStorage.getItem("currentUser");
          
          if(savedUsersStr==null || savedUsersStr=="undefined" || savedUsersStr==""){
            setUserModal(true)
          }else{
            var savedUsers = JSON.parse(savedUsersStr);
            if(Object.keys(savedUsers[savedUsername]).length == 0){
              setFirstModal(true)
              return;
            }
            dispatch({ type: 'SET_USER', data: savedUsers });
            dispatch({ type: 'CURRENT_USER', data: savedUsername });
            setPregnancy(savedUsers[savedUsername].pregnancy)
            calculatePeriod(savedUsers[savedUsername].startDate, savedUsers[savedUsername].cycleLength, savedUsers[savedUsername].periodLength, savedUsers[savedUsername].luteal)
            
            // If pregnancy enabled then message prepared below.
            if(savedUsers[savedUsername].pregnancy){
              const displayType = savedUsers[savedUsername].pregnancyDisplay
              console.log("displayType", displayType)
              if(displayType=="1"){
                // XXX days to baby message
                const due = savedUsers[savedUsername].pregnancyDueStart;
                const differnceD = moment(due).diff(new Date(), 'days')
                setPregnancyMessage(config.Labels[language].dash_daysbaby)
                setPregnancyData(differnceD)
              }else{
                // 0W2D since pregnancy
                const pregStart = savedUsers[savedUsername].pregnancyStart;
                const differnceW = moment(new Date()).diff(pregStart, 'weeks')
                var differnceD = moment(new Date()).diff(pregStart, 'days')
                differnceD = differnceD - differnceW*7
                setPregnancyMessage(config.Labels[language].dash_preg)
                setPregnancyData(differnceW+"W"+differnceD+"D")
              }
            }
          }
        } catch (e) {
          console.log(e)
        }
    };
    bootstrapAsync();

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

  }, [dashboardRerender]);

  async function saveInitial(){
    setPeriodError(false);
    setCycleError(false)
    setDateError(false)
    
    if(period==""){
      setPeriodError(true);
    }else if(cycle==""){
      setCycleError(true)
    }else if(periodStartDate==""){
      setDateError(true)
    }else{
      //store all the data.
      var luteal = "14";
      if(users!=null && currentUser!=null &&
        users[currentUser].hasOwnProperty('luteal')){
          
        luteal = users[currentUser].luteal;
      }
      console.log(users[currentUser])

      var username = currentUser;
      var data = {
        periodLength: period,
        cycleLength: cycle,
        startDate: periodStartDate,
        luteal: luteal,
        weight: "lb",
        height: "inch",
        body: "C",
        pregnancy: false,
        moods: {},
        symptoms: {},
        noteArray: {},
        notification: {
          "periodDay": 1, 
          "fertileDay":1, 
          "ovulationDay":1
        }
      }

      if(currentUser==null){
        username = "default";
        dispatch({ type: 'CURRENT_USER', data: username });
        await AsyncStorage.setItem("currentUser", username);
      }
        
      saveUser(data, username)
      calculatePeriod(periodStartDate, cycle, period, luteal)
      setFirstModal(false)
      createNotificationChannel(periodStartDate, cycle, period, luteal)
    }
  }

  async function saveUser(data, username){
    users[username] = data;     
    console.log(users)
    dispatch({ type: 'SET_USER', data: users });
    await AsyncStorage.setItem("users", JSON.stringify(users));
  }

  function calculatePeriod(periodStartDate, cycle, period, luteal){
    var prdStart = periodStartDate;
    for(var i=0; i<13; i++){
      const nextMonth = moment(prdStart).add(i*cycle, 'days');

      const start = new Date(nextMonth);
      const end   = new Date();
      const differnceD = moment(end).diff(start, 'days')
      if(differnceD<=parseInt(cycle)){
        console.log("if-",differnceD)
        periodStartDate = start;
        break;
      }
    }
    console.log("periodStartDate-", periodStartDate)
    dispatch({ type: 'MONTH_START', data: periodStartDate });

    const differnce = moment(new Date()).diff(periodStartDate, 'days')+1;
    const next = moment(periodStartDate).add(cycle, 'days');
    
    var fertDiff = cycle-parseInt(luteal)-5
    const fert = moment(periodStartDate).add(fertDiff, 'days');
    
    if(differnce <= period){
      setPeriodDay(differnce)
      if(differnce==1)
        setPeriodDayText(config.Labels[language].period_text1)
      else if(differnce==2)
        setPeriodDayText(config.Labels[language].period_text2)
      else if(differnce==3)
        setPeriodDayText(config.Labels[language].period_text3)
      else
        setPeriodDayText(config.Labels[language].period_text4)
    }else{
      setPeriodDay(cycle - differnce + 1)
      setPeriodDayText(config.Labels[language].cycle_text)
      // cycle - difference days left
    }

    console.log(differnce)
    setNextPeriod(moment(next).format('MMM Do'))
    setFertile(moment(fert).format('MMM Do'))
  }

  function onChange(event, selectedDate){
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setPeriodStartDate(currentDate)
  }

  async function changeLang(lang){
    dispatch({ type: 'CHANGE_LANG', data: lang });
    dispatch({ type: 'LANG_INDEX', data: lang==="en"?0:1 });
    await AsyncStorage.setItem("language", lang);
    setLangModal(false)
  }

  async function finishProcess(){
    const hasPin = await hasUserSetPinCode();
    if(hasPin){
      dispatch({ type: 'SHOW_PASS_LOCK', data: false });
    }
  }

  async function createNotificationChannel(startDate, cycle, period, luteal){
    cycle = parseInt(cycle);
    for(var i=0; i<13; i++){
      const nextMonth = moment(startDate).add(i*cycle, 'days');

      const start = new Date(nextMonth);
      const end   = new Date();
      const differnceD = moment(end).diff(start, 'days')
      if(differnceD<=parseInt(cycle)){
        startDate = start;
        break;
      }
    }

    var fertDiff = cycle-parseInt(luteal)-5
    const fert = moment(startDate).add(fertDiff, 'days');

    PushNotification.channelExists("period_channel", function (exists) {
      if(!exists){
        PushNotification.createChannel(
          {
            channelId: "period_channel", // (required)
            channelName: "Period Reminder", // (required)
            channelDescription: "A channel for period reminder", // (optional) default: undefined.
            soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
            importance: 4, // (optional) default: 4. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
          },
          (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
      }
    });

    PushNotification.channelExists("fertile_channel", function (exists) {
      if(!exists){
        PushNotification.createChannel(
          {
            channelId: "fertile_channel", // (required)
            channelName: "Fertile Reminder", // (required)
            channelDescription: "A channel for fertile reminder", // (optional) default: undefined.
            soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
            importance: 4, // (optional) default: 4. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
          },
          (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
      }
    });

    PushNotification.channelExists("ovulation_channel", function (exists) {
      if(!exists){
        PushNotification.createChannel(
          {
            channelId: "ovulation_channel", // (required)
            channelName: "Ovulation Reminder", // (required)
            channelDescription: "A channel for ovulation reminder", // (optional) default: undefined.
            soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
            importance: 4, // (optional) default: 4. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
          },
          (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
      }
    });

    PushNotification.channelExists("drink_channel", function (exists) {
      if(!exists){
        PushNotification.createChannel(
          {
            channelId: "drink_channel", // (required)
            channelName: "Drink water reminder", // (required)
            channelDescription: "A channel for drink water reminder", // (optional) default: undefined.
            soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
            importance: 4, // (optional) default: 4. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
          },
          (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
      }
    });

    PushNotification.cancelLocalNotifications({id: 'period_notify'});
    PushNotification.localNotificationSchedule({
      id: "period_notify",
      channelId: "period_channel",
      title:"Prior period notification",
      message: "Your period is expected to start in 1 day.", // (required)
      date: moment(startDate).add(cycle-1, 'days').toDate(), // in 60 secs
      repeatType: "day",
      number:cycle,
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    });

    PushNotification.cancelLocalNotifications({id: 'fertile_notify'});
    PushNotification.localNotificationSchedule({
      id: "fertile_notify",
      channelId: "fertile_channel",
      title:"Prior fertile notification",
      message: "Fertility is expected to start in 1 day.", // (required)
      date: moment(fert).subtract(1, 'days').toDate(), // in 60 secs
      repeatType: "day",
      number:cycle,
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    });

    PushNotification.cancelLocalNotifications({id: 'ovulation_notify'});
    PushNotification.localNotificationSchedule({
      id: "ovulation_notify",
      channelId: "ovulation_channel",
      title:"Prior ovulation notification",
      message: "Ovulation is expected to start in 1 day.", // (required)
      date: moment(fert).add(5, 'days').toDate(), // in 60 secs
      repeatType: "day",
      number:cycle,
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    });
    console.log("ee-",users[currentUser])
    //users[currentUser].notification = {"periodDay": 1, "fertileDay":1, "ovulationDay":1}
    //dispatch({ type: 'SET_USER', data: users });
    //await AsyncStorage.setItem("users", JSON.stringify(users));
  }

  var lang_props = [
    {label: "English", value: 'en' },
    {label: "Spanish", value: 'sp' }
  ];

  return (
    <View style={{flex:1}}>
      <Spinner
            visible={spinnerEnabled}
            textContent={'Loading...'}
            textStyle={{color: '#000'}}
        />
      <Modal isVisible={firstModal} style={{alignItems: 'center'}}>
          <View style={styles.modalContent}>
            <View style={{alignItems: 'center'}}>
  <Text style={{paddingBottom:5, fontSize: 20, color: '#F89B9E',fontFamily: 'neosans_pro_medium'}}>{config.Labels[language].dash_title_details}</Text>
            </View>
            <View>
              <Text style={{fontSize: 16,fontFamily: 'neosans_pro_medium'}}>{config.Labels[language].dash_length_of} <Text style={{fontSize: 18, color: '#F89B9E'}}>{config.Labels[language].dash_period_t}</Text>?</Text>
              <Text style={{fontSize: 12, color: 'gray',fontFamily: 'neosans_pro_medium'}}>{config.Labels[language].dash_bleed_bet}</Text>
              <TextInput
                style={{ paddingLeft: 10, height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 8 }}
                onChangeText={text => setPeriod(text)}
                value={period}
                keyboardType="number-pad"
              />
              {periodError?<Text style={{color: 'red'}}>{config.Labels[language].dash_cannot_empty}</Text>:null}
            </View>
            <View style={{marginTop: 5}}>
              <Text style={{fontSize: 16,fontFamily: 'neosans_pro_medium'}}>{config.Labels[language].dash_length_mens}</Text>
              <Text style={{fontSize: 12, color: 'gray',fontFamily: 'neosans_pro_medium'}}>{config.Labels[language].dash_duration_of}</Text>
              <TextInput
                style={{ paddingLeft: 10, height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 8 }}
                onChangeText={text => setCycle(text)}
                value={cycle}
                keyboardType="number-pad"
              />
              {cycleError?<Text style={{color: 'red'}}>{config.Labels[language].dash_cannot_empty}</Text>:null}
            </View>
            <View style={{marginTop: 5}}>
              <Text style={{fontSize: 16,fontFamily: 'neosans_pro_medium'}}>{config.Labels[language].dash_start_period}</Text>
              <TouchableOpacity style={{height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 8, alignItems: 'center', justifyContent: 'center'}} 
                onPress={()=> setShow(true)}>
                <Text>{periodStartDate==""?"Tap here to set":(moment(periodStartDate).format('Do MMM yyyy'))}</Text>
              </TouchableOpacity>
              {dateError?<Text style={{color: 'red'}}>{config.Labels[language].dash_date_valid}</Text>:null}
            </View>

              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={'date'}
                  display="default"
                  maximumDate={new Date()}
                  onChange={onChange}
                  timeZoneOffsetInSeconds={60}
                />
              )}

            <View style={{marginTop: 10,flexDirection: 'row', alignSelf: 'flex-end'}}>
              {showCancle?<Text style={{fontSize: 16, marginRight: 10, backgroundColor: '#F89B9E', padding: 6, borderRadius: 5, color: '#fff'}} onPress={()=> {setFirstModal(false); setShowCancle(false)}}>{config.Labels[language].dash_btn_cancel}</Text>:null}
              <Text style={{fontSize: 16, marginRight: 10, backgroundColor: '#F89B9E', padding: 6, borderRadius: 5, color: '#fff'}} onPress={()=> {saveInitial(); setShowCancle(false)}}>{config.Labels[language].dash_btn_done}</Text>
            </View>
          </View>
      </Modal>

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

      <Modal isVisible={userModal} style={{alignItems: 'center'}}>
          <View style={styles.modalContent}>
             <View style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
              <Text style={{color: '#fc6767', fontSize: 18, textAlign: 'center', fontWeight: 'bold'}}>{config.Labels[language].dash_welcome}</Text>
              <TouchableOpacity style={{marginTop: 10, width: '90%', height: 40, backgroundColor: '#fc6767', borderRadius: 20,justifyContent: 'center', alignItems: 'center'}} 
                onPress={()=> {
                  setUserModal(false);
                  setFirstModal(true)
                }}>
                <Text style={{color: '#fff', fontSize: 14}}>{config.Labels[language].dash_new_user}</Text>
              </TouchableOpacity>

              <Text style={{color: '#079e20', fontSize: 18, textAlign: 'center', marginTop: 10, fontWeight: 'bold'}}>{config.Labels[language].dash_used_before}</Text>
              <TouchableOpacity style={{marginTop: 10, width: '90%', height: 40, backgroundColor: '#079e20', borderRadius: 20,justifyContent: 'center', alignItems: 'center'}} 
                onPress={()=> {
                  setUserModal(false)
                  navigation.navigate("backup")
                }}>
                <Text style={{color: '#fff', fontSize: 14}}>{config.Labels[language].dash_restore}</Text>
              </TouchableOpacity>
             </View>
          </View>
      </Modal>

      {passLock?(
         <View style={{flex:1, margin: 10, }}>
            <PINCode 
                status={'enter'} 
                touchIDDisabled={true} 
                finishProcess={()=> finishProcess()}
            /> 
            </View>
        ):(
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={{flex:1, backgroundColor: '#fff'}}>
            <View style={{flex:0.40, alignItems: 'center'}}>
            <ImageBackground 
                        source={
                          theme=="blue_dark" ? 
                          require('../assets/back1.png') : 
                          ( require('../assets/back2.png') )
                        } 
                        style={{flex:1, width: '100%', height: '100%'}}>
              <View style={styles.headerView}>
                {/* <View style={styles.headerIcon}>
                  <Ionicons name="menu" size={30} color="#fff" />
                </View> */}
                <View style={styles.profileView}>
                  {language=="en"?(
                    <Image source={require('../assets/profile.png')} 
                      style={styles.profile}/>
                    ):(
                      <Image source={require('../assets/profile_sp.png')} 
                      style={styles.profile}/>
                    )}
                </View>
                {/* <View style={styles.headerIcon}>
                  <Ionicons name="ellipsis-vertical" size={30} color="#fff" />
                </View> */}
              </View>
              <View style={{alignItems: 'center', marginTop: 10}}>
                <View style={{flexDirection: 'row'}}>
                  <LinearGradient colors={config.THEME[theme].menu_button_color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{width: 100, borderRadius: 10, marginRight: 10}}>
                    <TouchableOpacity style={styles.menuTab} onPress={()=> {
                      interstitial.show()
                      navigation.navigate("calendar")
                    }}>
                        <FontAwesome5 name="calendar-alt" size={14} color={config.THEME[theme].menu_text} />
                        <Text style={{...styles.menuText, color: config.THEME[theme].menu_text}}>{config.Labels[language].tab_calendar}</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                  <LinearGradient colors={config.THEME[theme].menu_button_color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{width: 100, borderRadius: 10, marginRight: 10}}>
                    <TouchableOpacity style={styles.menuTab} onPress={()=> {
                      interstitial.show()
                      navigation.navigate("log")
                    }}>
                        <FontAwesome5 name="book" size={14} color={config.THEME[theme].menu_text} />
                        <Text style={{...styles.menuText, color: config.THEME[theme].menu_text}}>{config.Labels[language].tab_log}</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                  <LinearGradient colors={config.THEME[theme].menu_button_color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{width: 100, borderRadius: 10, marginRight: 10}}>
                    <TouchableOpacity style={styles.menuTab} onPress={()=> {
                      interstitial.show()
                      navigation.navigate("chart")
                    }}>
                        <FontAwesome5 name="chart-line" size={14} color={config.THEME[theme].menu_text} />
                        <Text style={{...styles.menuText, color: config.THEME[theme].menu_text}}>{config.Labels[language].tab_chart}</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  
                  <LinearGradient colors={config.THEME[theme].menu_button_color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{width: 100, borderRadius: 10, marginRight: 10}}>
                    <TouchableOpacity style={styles.menuTab} onPress={()=> {
                      interstitial.show()
                      navigation.navigate("setting", {period: users[currentUser].periodLength, cycle: users[currentUser].cycleLength})
                    }}>
                        <Ionicons name="settings" size={14} color={config.THEME[theme].menu_text} />
                        <Text style={{...styles.menuText, color: config.THEME[theme].menu_text}}>{config.Labels[language].tab_setting}</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                  <LinearGradient colors={config.THEME[theme].menu_button_color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{width: 120, borderRadius: 10}}>
                    <TouchableOpacity style={styles.menuTab} onPress={()=> {
                      interstitial.show()
                      navigation.navigate("addnote")
                    }}>
                        <FontAwesome name="pencil-square" size={14} color={config.THEME[theme].menu_text} />
                        <Text style={{...styles.menuText, color: config.THEME[theme].menu_text}}>{config.Labels[language].tab_note}</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>
              {pregnancy?(
                <TouchableOpacity style={{alignItems: 'center', marginTop: 10}} onPress={()=> {
                  navigation.navigate("pregnancy")
                }}>
                  <Text style={{...styles.textDayLeft, color: config.THEME[theme].period_text}}>{pregnancyData}<Text style={{fontSize: 15}}>{pregnancyMessage}</Text></Text>
                </TouchableOpacity>
              ):(
                <TouchableOpacity style={{alignItems: 'center', marginTop: 10}} onPress={()=> {
                    setFirstModal(true) 
                    setShowCancle(true)
                  }}>
                    <Text style={{...styles.textDayLeft, color: config.THEME[theme].period_text}}>{periodDay}<Text style={{fontSize: 15}}>{periodDayText}</Text></Text>
                    <Text style={{...styles.otherText, color: config.THEME[theme].cycle_text}}>{nextPeriod} <Text style={{...styles.otherText1,color: config.THEME[theme].cycle_text}}>{config.Labels[language].next_period}</Text></Text>
                    <Text style={{...styles.otherText, color: config.THEME[theme].cycle_text}}>{fertile} <Text style={{...styles.otherText1,color: config.THEME[theme].cycle_text}}>{config.Labels[language].next_text}</Text></Text>
                </TouchableOpacity>
                )}
            </ImageBackground>
            </View>
            <View style={{flex:0.60, alignItems: 'center'}}>
              <View style={{flex: 1, width: '100%', marginTop: 15}}>
                <View style={styles.subMenu1}>
                  <LinearGradient colors={config.THEME[theme].submenu_button_color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{}} >
                      <View style={styles.subMenu2}>
                        <View style={styles.subMenu3}>
                          <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=> {
                            interstitial.show()
                            navigation.navigate("theme")
                          }}>
                              <Entypo name="colours" size={40} color={config.THEME[theme].icon_color} style={{marginRight: 5, marginTop: 3}}/>
                              <View style={{flexDirection: 'column', marginLeft: 5}}>
                                <Text style={{...styles.subMenuHead, color: config.THEME[theme].submenu_text1}}>{config.Labels[language].sub_theme}</Text>
                                <Text style={{...styles.subMenuHead2, color: config.THEME[theme].submenu_text2}}>{config.Labels[language].sub_theme_text}</Text>
                              </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                  </LinearGradient>
                </View>

                <View style={styles.subMenu1}>
                  <LinearGradient colors={config.THEME[theme].submenu_button_color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{}} >
                      <View style={styles.subMenu2}>
                        <View style={styles.subMenu3}>
                          <TouchableOpacity style={{flexDirection: 'row',}} onPress={()=> {
                            interstitial.show()
                            navigation.navigate("symptomood")
                          }}>
                              <FontAwesome5 name="disease" size={40} color={config.THEME[theme].icon_color} style={{marginRight: 5, marginTop: 3}}/>
                              <View style={{flexDirection: 'column', marginLeft: 5}}>
                                <Text style={{...styles.subMenuHead, color: config.THEME[theme].submenu_text1}}>{config.Labels[language].sub_symptomood}</Text>
                                <Text style={{...styles.subMenuHead2, color: config.THEME[theme].submenu_text2}} numberOfLines={1}>{config.Labels[language].sub_symptomood_text}</Text>
                              </View>
                            </TouchableOpacity>
                        </View>
                      </View>
                  </LinearGradient>
                </View>


                <View style={styles.subMenu1}>
                  <LinearGradient colors={config.THEME[theme].submenu_button_color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{}} >
                      <View style={styles.subMenu2}>
                        <View style={styles.subMenu3}>
                          <TouchableOpacity style={{flexDirection: 'row',}} onPress={()=> {
                            interstitial.show()
                            setLangModal(true)
                          }}>
                              <FontAwesome5 name="language" size={40} color={config.THEME[theme].icon_color} style={{marginRight: 5, marginTop: 3}}/>
                              <View style={{flexDirection: 'column', marginLeft: 5}}>
                                <Text style={{...styles.subMenuHead, color: config.THEME[theme].submenu_text1}}>{config.Labels[language].sub_lang}</Text>
                                <Text style={{...styles.subMenuHead2, color: config.THEME[theme].submenu_text2}} numberOfLines={1}>{config.Labels[language].sub_lang_text}</Text>
                              </View>
                            </TouchableOpacity>
                        </View>
                      </View>
                  </LinearGradient>
                </View>


                <View style={styles.subMenu1}>
                  <LinearGradient colors={config.THEME[theme].submenu_button_color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{}} >
                      <View style={styles.subMenu2}>
                        <View style={styles.subMenu3}>
                          <TouchableOpacity style={{flexDirection: 'row',}} 
                            onPress={()=> {
                              interstitial.show()
                              navigation.navigate("metric")
                            }}>
                              <FontAwesome5 name="thermometer" size={40} color={config.THEME[theme].icon_color} style={{marginRight: 5, marginTop: 3}}/>
                              <View style={{flexDirection: 'column', marginLeft: 5}}>
                                <Text style={{...styles.subMenuHead, color: config.THEME[theme].submenu_text1}}>{config.Labels[language].sub_metric}</Text>
                                <Text style={{...styles.subMenuHead2, color: config.THEME[theme].submenu_text2}} numberOfLines={1}>{config.Labels[language].sub_metric_text}</Text>
                              </View>
                            </TouchableOpacity>
                        </View>
                      </View>
                  </LinearGradient>
                </View>

                <View style={styles.subMenu1}>
                  <LinearGradient colors={config.THEME[theme].submenu_button_color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{}} >
                      <View style={styles.subMenu2}>
                        <View style={styles.subMenu3}>
                          <TouchableOpacity style={{flexDirection: 'row',}} 
                            onPress={()=> {
                              interstitial.show()
                              navigation.navigate("reminder")
                            }}>
                              <MaterialCommunityIcons name="reminder" size={40} color={config.THEME[theme].icon_color} style={{marginRight: 5, marginTop: 3}}/>
                              <View style={{flexDirection: 'column', marginLeft: 5}}>
                                <Text style={{...styles.subMenuHead, color: config.THEME[theme].submenu_text1}}>{config.Labels[language].sub_reminder}</Text>
                                <Text style={{...styles.subMenuHead2, color: config.THEME[theme].submenu_text2}} numberOfLines={1}>{config.Labels[language].sub_reminder_text}</Text>
                              </View>
                            </TouchableOpacity>
                            
                        </View>
                      </View>
                  </LinearGradient>
                </View>

                <View style={styles.subMenu1}>
                  <LinearGradient colors={config.THEME[theme].submenu_button_color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{}} >
                      <View style={styles.subMenu2}>
                        <View style={styles.subMenu3}>
                          <TouchableOpacity style={{flexDirection: 'row',}} 
                            onPress={()=> {
                              interstitial.show()
                              navigation.navigate("password")
                            }}>
                              <FontAwesome5 name="key" size={40} color={config.THEME[theme].icon_color} style={{marginRight: 5, marginTop: 3}}/>
                              <View style={{flexDirection: 'column', marginLeft: 5}}>
                                <Text style={{...styles.subMenuHead, color: config.THEME[theme].submenu_text1}}>{config.Labels[language].sub_pass}</Text>
                                <Text style={{...styles.subMenuHead2, color: config.THEME[theme].submenu_text2}} numberOfLines={1}>{config.Labels[language].sub_pass_text}</Text>
                              </View>
                            </TouchableOpacity>
                        </View>
                      </View>
                  </LinearGradient>
                </View>

                <View style={styles.subMenu1}>
                  <LinearGradient colors={config.THEME[theme].submenu_button_color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{}} >
                      <View style={styles.subMenu2}>
                        <View style={styles.subMenu3}>
                          <TouchableOpacity style={{flexDirection: 'row',}} 
                            onPress={()=> {
                              interstitial.show()
                              navigation.navigate("backup")
                            }}>
                              <MaterialCommunityIcons name="backup-restore" size={40} color={config.THEME[theme].icon_color} style={{marginRight: 5, marginTop: 3}}/>
                              <View style={{flexDirection: 'column', marginLeft: 5}}>
                                <Text style={{...styles.subMenuHead, color: config.THEME[theme].submenu_text1}}>{config.Labels[language].sub_backup}</Text>
                                <Text style={{...styles.subMenuHead2, color: config.THEME[theme].submenu_text2}} numberOfLines={1}>{config.Labels[language].sub_backup_text}</Text>
                              </View>
                            </TouchableOpacity>
                        </View>
                      </View>
                  </LinearGradient>
                </View>
              </View>
            </View>
        </View>
      </KeyboardAwareScrollView>
        )}
        

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