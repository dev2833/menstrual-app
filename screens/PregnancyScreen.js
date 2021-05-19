import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions, Platform} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { TestIds, BannerAd, BannerAdSize, InterstitialAd, AdEventType} from '@react-native-firebase/admob';
import FlipToggle from 'react-native-flip-toggle-button'
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment-timezone'
import config from '../settings/config'
import Modal from 'react-native-modal';
import RadioForm from 'react-native-simple-radio-button';

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const interstitial = InterstitialAd.createForAdRequest(config.admob_env=="dev"?TestIds.INTERSTITIAL:config.admob_id, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

export default function PregnancyScreen({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const users = useSelector(state => state.users);
  const language = useSelector(state => state.language);
  const currentUser = useSelector(state => state.currentUser);
  const [pregnancy, setPregnancy] = useState(false)
  const [date, setDate] = useState(new Date())
  const [dateDue, setDateDue] = useState(new Date())
  const [pregStartDate, setPregStartDate] = useState(new Date())
  const [show, setShow] = useState(false);
  const [showdue, setShowdue] = useState(false);
  const [showMiscarriage, setShowMiscarriage] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [lIndex, setLindex] = useState(1)
  const [display, setDisplay] = useState("2")
  const dashboardRerender = useSelector(state => state.dashboardRerender);

  React.useEffect(() => {  
    const userDetails = users[currentUser];
    setPregnancy(userDetails.pregnancy)
    if(userDetails.hasOwnProperty('pregnancyStart'))
        setPregStartDate(userDetails.pregnancyStart)
    if(userDetails.hasOwnProperty('pregnancyDisplay')){
        setDisplay(userDetails.pregnancyDisplay)
        setLindex(userDetails.pregnancyDisplay=="1"?0:1)
    }
    if(userDetails.hasOwnProperty('pregnancyDueStart')){
        setDateDue(moment(userDetails.pregnancyDueStart).toDate())
    }else{
        setDateDue(moment(new Date()).add(9, 'M').toDate())
    }

    
  }, []);
  
  function setValue(){
    Alert.alert(
        '',
        config.Labels[language].preg_congrat,
        [
          {text: 'CANCEL', onPress: () => console.log('NO Pressed'), style: 'cancel'},
          {text: 'CONTINUE', onPress: async () => {
            users[currentUser].pregnancy = true;
            users[currentUser].pregnancyStart = pregStartDate;
            users[currentUser].pregnancyDueStart = dateDue;
            users[currentUser].pregnancyDisplay = display;
            dispatch({ type: 'SET_USER', data: users });
            dispatch({ type: 'DASHBOARD_RERENDER', data: !dashboardRerender });
            await AsyncStorage.setItem("users", JSON.stringify(users));
            setPregnancy(!pregnancy)
          }},
        ]
      );
  }

  function miscarriage(){
    Alert.alert(
        '',
        'If you belong to the following situation: \n\n *Delivery \n * Miscarriage \n * Abortion \n\n Please click No longer pregnant ',
        [
          {text: 'CANCEL', onPress: () => console.log('NO Pressed'), style: 'cancel'},
          {text: 'NO LONGER PREGNANT', onPress: async () => {
            setShowMiscarriage(true)
          }},
        ]
      );
  }

  function turnOff(){
    Alert.alert(
        '',
        config.Labels[language].preg_mistake,
        [
          {text: 'CANCEL', onPress: () => console.log('NO Pressed'), style: 'cancel'},
          {text: 'TURN OFF', onPress: async () => {
            users[currentUser].pregnancy = false;
            dispatch({ type: 'SET_USER', data: users });
            dispatch({ type: 'DASHBOARD_RERENDER', data: !dashboardRerender });
            await AsyncStorage.setItem("users", JSON.stringify(users));
            setPregnancy(!pregnancy)
          }},
        ]
      );
  }

  async function onChange(event, selectedDate){
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    users[currentUser].pregnancyStart = currentDate;
    dispatch({ type: 'SET_USER', data: users });
    dispatch({ type: 'DASHBOARD_RERENDER', data: !dashboardRerender });
    await AsyncStorage.setItem("users", JSON.stringify(users));
    setPregStartDate(currentDate)
  }

  async function onChangeDue(event, selectedDate){
    const currentDate = selectedDate || date;
    setShowdue(Platform.OS === 'ios');
    users[currentUser].pregnancyDueStart = currentDate;
    dispatch({ type: 'SET_USER', data: users });
    dispatch({ type: 'DASHBOARD_RERENDER', data: !dashboardRerender });
    await AsyncStorage.setItem("users", JSON.stringify(users));
    setDateDue(moment(currentDate).toDate())
  }

  async function onChangeMiscarriage(event, selectedDate){
    const currentDate = selectedDate || date;
    setShowMiscarriage(Platform.OS === 'ios');
    users[currentUser].miscarriageDate = currentDate;
    users[currentUser].pregnancy = false;
    dispatch({ type: 'SET_USER', data: users });
    dispatch({ type: 'DASHBOARD_RERENDER', data: !dashboardRerender });
    await AsyncStorage.setItem("users", JSON.stringify(users));
    setPregnancy(!pregnancy)
  }

  async function setDisplayData(value){
    setDisplay(value) 
    users[currentUser].pregnancyDisplay = value;
    dispatch({ type: 'SET_USER', data: users });
    dispatch({ type: 'DASHBOARD_RERENDER', data: !dashboardRerender });
    await AsyncStorage.setItem("users", JSON.stringify(users));
    setModal1(false)
    setLindex(value=="1"?0:1)
  }

  var display_props = [
    {label: "XXX DAYS TO BABY", value: '1' },
    {label: "X Week X Day since pregnancy", value: '2' }
  ];
    
  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>
        <Modal isVisible={modal1} style={{alignItems: 'center'}} 
        onBackdropPress={()=> setModal1(false)} 
        onBackButtonPress={()=> setModal1(false)}>
          <View style={styles.modalContent}>
              <Text style={{fontSize: 18, margin: 10, textAlign: 'center', fontWeight: 'bold' ,color: config.THEME[theme].period_text}}>{config.Labels[language].preg_choose}</Text>
             <View style={{flexDirection: 'column', width: '100%', margin:10}}>
                
                <RadioForm
                  style={{}}
                  radio_props={display_props}
                  buttonColor= {config.THEME[theme].cycle_text}
                  selectedButtonColor = {config.THEME[theme].cycle_text}
                  initial={lIndex}
                  animation={true}
                  buttonSize={12}
                  radioStyle={{margin: 10}}
                  labelStyle={{ fontSize: 18, color: config.THEME[theme].period_text, marginRight: 3,}}
                  onPress={(value) => {
                    setDisplayData(value)
                  }}
                  />
             </View>
          </View>
      </Modal>
        <View style={{flex:1, margin: 10, }}>
            {pregnancy?(
                <>
                {display=="2"?(<>
                    <TouchableOpacity style={{padding: 10, borderBottomColor: '#d1c8c8', borderBottomWidth:1}} 
                        onPress={()=> setShow(true)}>
                        <Text style={{fontSize: 18, color: '#605e5e'}}>{config.Labels[language].preg_est}</Text>
                        <Text style={{fontSize: 14, color: '#bab2b2'}}>{moment(pregStartDate).format('MMM Do, yyyy')}</Text>
                    </TouchableOpacity>
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
                </>):(<>
                <TouchableOpacity style={{padding: 10, borderBottomColor: '#d1c8c8', borderBottomWidth:1}} 
                    onPress={()=> setShowdue(true)}>
                    <Text style={{fontSize: 18, color: '#605e5e'}}>{config.Labels[language].preg_est_due}</Text>
                    <Text style={{fontSize: 14, color: '#bab2b2'}}>{moment(dateDue).format('MMM Do, yyyy')}</Text>
                </TouchableOpacity>
                {showdue && (
                    <DateTimePicker
                    testID="estimateDue"
                    value={dateDue}
                    mode={'date'}
                    display="default"
                    onChange={onChangeDue}
                    timeZoneOffsetInSeconds={60}
                    />
                )}
                </>)}
                <TouchableOpacity style={{padding: 10, borderBottomColor: '#d1c8c8', borderBottomWidth:1}} 
                    onPress={()=> setModal1(true)}>
                    <Text style={{fontSize: 18, color: '#605e5e'}}>{config.Labels[language].preg_display}</Text>
                    <Text style={{fontSize: 14, color: '#bab2b2'}}>{display=="1"?"XXX DAYS TO BABY":"X Week X Day since pregnancy"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{padding: 10, borderBottomColor: '#d1c8c8', borderBottomWidth:1}} 
                    onPress={()=> miscarriage()}>
                    <Text style={{fontSize: 18, color: '#605e5e'}}>{config.Labels[language].preg_misc}</Text>
                    <Text style={{fontSize: 14, color: '#bab2b2'}}>{config.Labels[language].preg_im_no}</Text>
                </TouchableOpacity>
                {showMiscarriage && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={new Date()}
                    mode={'date'}
                    display="default"
                    maximumDate={new Date()}
                    onChange={onChangeMiscarriage}
                    timeZoneOffsetInSeconds={60}
                    />
                )}
                <TouchableOpacity style={{padding: 10, borderBottomColor: '#d1c8c8', borderBottomWidth:1}} 
                    onPress={()=> turnOff()}>
                    <Text style={{fontSize: 18, color: '#605e5e'}}>{config.Labels[language].preg_my_mis}</Text>
                    <Text style={{fontSize: 14, color: '#bab2b2'}}>{config.Labels[language].preg_turn_off}</Text>
                </TouchableOpacity>
                </>
            ):(
                <>
                <TouchableOpacity style={{padding: 10, borderBottomColor: '#d1c8c8', borderBottomWidth:1}}>
                    <Text style={{fontSize: 18, color: '#605e5e'}}>{config.Labels[language].preg_tap_i}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{padding: 10, flexDirection: 'row', width: '100%'}} 
                    onPress={()=> setValue()}>
                    <Text style={{fontSize: 18, width: '50%', color: '#605e5e'}}>{config.Labels[language].preg_im}</Text>
                    <View style={{width: '50%', alignItems: 'flex-end'}}>
                        <FlipToggle
                            value={pregnancy}
                            buttonWidth={50}
                            buttonHeight={25}
                            buttonRadius={20}
                            sliderWidth={20}
                            sliderHeight={20}
                            sliderRadius={50}
                            buttonOnColor="red"
                            buttonOffColor="#aeaeaf"
                            sliderOffColor="#fff"
                            onToggle={(newState) => setValue()}
                            onToggleLongPress={() => console.log('toggle long pressed!')}
                        />
                    </View>
                </TouchableOpacity>
                </>
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