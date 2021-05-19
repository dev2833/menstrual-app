import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, TextInput} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { TestIds, BannerAd, BannerAdSize, InterstitialAd, AdEventType} from '@react-native-firebase/admob';
import PushNotification from 'react-native-push-notification'
import FlipToggle from 'react-native-flip-toggle-button'
import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import moment from 'moment-timezone'
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-community/async-storage';
import RadioForm from 'react-native-simple-radio-button';
import config from '../settings/config'

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;


export default function ReminderScreen({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const users = useSelector(state => state.users);
  const currentUser = useSelector(state => state.currentUser);
  const [isPeriod, setIsPeriod] = useState(false)
  const [isFertile, setIsFertile] = useState(false)
  const [isOvulation, setIsOvulation] = useState(false)
  const [isWater, setIsWater] = useState(false)
  const [modal1, setModal1] = useState(false)
  const [modal2, setModal2] = useState(false)
  const [days, setDays] = useState(1)
  const [noteEnter, setNoteEnter] = useState("Your text here")
  const [noteWater, setNoteWater] = useState("It's time to drink water")
  const [header, setHeader] = useState("")
  const [text1, setText1] = useState("")
  const [selectedTime, setSelectedTime] = useState(new Date())
  const [show, setShow] = useState(false)
  const [date, setDate] = useState(new Date())
  const [intervalVal, setIntervalVal] = useState("0.5")
  const [intervalModal, setIntervalModal] = useState(false)
  const [lIndex, setIindex] = useState(0)
  const [reminderType, setReminderType] = useState("")

  useEffect(()=> {
    PushNotification.getScheduledLocalNotifications(function(allnotify){
      allnotify.forEach(element => {
        if(element.id=="period_notify"){
          setIsPeriod(true)
        }else if(element.id=="fertile_notify"){
          setIsFertile(true)
        }else if(element.id=="ovulation_notify"){
          setIsOvulation(true)
        }else if(element.id=="drink_notify"){
          setIsWater(true)
        }
      });
    });
    
  }, [])

  async function periodClick(type){
      setReminderType(type)
      PushNotification.getScheduledLocalNotifications(function(allnotify){
        var currentScheduler = {};
        var message = "";
        var selectedDay = 1;
        var header = "";
        var text1 = "";
        
        allnotify.forEach(element => {
          if(element.id=="period_notify"){
            currentScheduler = element;
          }else if(element.id=="fertile_notify"){
            currentScheduler = element;
          }else if(element.id=="ovulation_notify"){
            currentScheduler = element;
          }
        });

        if(type=="period"){
          message = `Your period is expected to start in 1 days`
          selectedDay = users[currentUser]['notification'].periodDay;
          header = "Period Reminder"
          text1 = "How many days would you like to remind yourself before your period";
        }else if(type=="fertile"){
          message = `Fertility is expected to start in 1 days`
          selectedDay = users[currentUser]['notification'].fertileDay;
          header = "Fertility Reminder"
          text1 = "How many days would you like to remind yourself before fertile day";
        }else if(type=="ovulation"){
          message = `Ovulation is expected to start in 1 days`
          selectedDay = users[currentUser]['notification'].ovulationDay;
          header = "Ovulation Reminder"
          text1 = "How many days would you like to remind yourself before ovulation day";
        }
        
        var time = moment(moment(new Date()).format("yyyy-MM-DD") + " 17:59").toDate();
        //var message = `Your period is expected to start in 1 days`
        if(currentScheduler.hasOwnProperty("date")){
          time = moment(currentScheduler.date).toDate();
          message = currentScheduler.message
        }
        
        setDays(selectedDay)
        setSelectedTime(time)
        setHeader(header);
        setText1(text1)
        setNoteEnter(message)
        
        var isDisableClicked = true;
        if(isPeriod && type=="period"){
          PushNotification.cancelLocalNotifications({id: 'period_notify'});
          setIsPeriod(false)
          isDisableClicked = false
        }else if(isFertile && type=="fertile"){
          PushNotification.cancelLocalNotifications({id: 'fertile_notify'});
          setIsFertile(false)
          setModal1(false)
          isDisableClicked = false
        }else if(isOvulation && type=="ovulation"){
          PushNotification.cancelLocalNotifications({id: 'ovulation_notify'});
          setIsOvulation(false)
          setModal1(false)
          isDisableClicked = false
        }

        if(isDisableClicked){
          setModal1(true)
        }
      });
    
  }

  async function waterClick(){
    PushNotification.getScheduledLocalNotifications(function(allnotify){
      var currentScheduler = {};
      var message = "It's time to drink water";
      var index = 1;
      
      allnotify.forEach(element => {
        if(element.id=="drink_notify"){
          currentScheduler = element;
        }
      });

      if(currentScheduler.hasOwnProperty("message")){
        index = currentScheduler.number;
        message = currentScheduler.message
      }

      if(isWater){
        PushNotification.cancelLocalNotifications({id: 'drink_notify'});
        setIsWater(false)
      }else{
        setModal2(true)
      }

      setIindex(index-1)
      setNoteWater(message)
      

    });
  }

  async function addPeriodnotification(){
    const userDetails = users[currentUser];
    const cycle = parseInt(userDetails.cycleLength);
    const startDate = getStartDate(userDetails.startDate, cycle)


    if(reminderType=="period"){
      PushNotification.cancelLocalNotifications({id: 'period_notify'});
      PushNotification.localNotificationSchedule({
        id: "period_notify",
        channelId: "period_channel",
        title:"Prior period notification",
        message: noteEnter, // (required)
        date: moment(startDate).add(cycle-1, 'days').toDate(), // in 60 secs
        repeatType: "day",
        number:cycle,
        allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
      });
      setIsPeriod(true);
      users[currentUser].notification.periodDay = days;
    }else if(reminderType=="fertile"){
      PushNotification.cancelLocalNotifications({id: 'period_notify'});
      PushNotification.localNotificationSchedule({
        id: "period_notify",
        channelId: "period_channel",
        title:"Prior period notification",
        message: noteEnter, // (required)
        date: moment(startDate).add(cycle-1, 'days').toDate(), // in 60 secs
        repeatType: "day",
        number:cycle,
        allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
      });
      setIsFertile(true)
      users[currentUser].notification.fertileDay = days;
    }else if(reminderType=="ovulation"){
      PushNotification.cancelLocalNotifications({id: 'period_notify'});
      PushNotification.localNotificationSchedule({
        id: "period_notify",
        channelId: "period_channel",
        title:"Prior period notification",
        message: noteEnter, // (required)
        date: moment(startDate).add(cycle-1, 'days').toDate(), // in 60 secs
        repeatType: "day",
        number:cycle,
        allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
      });
      setIsOvulation(true)
      users[currentUser].notification.ovulationDay = days;
    }
    
    setModal1(false)
    dispatch({ type: 'SET_USER', data: users });
    await AsyncStorage.setItem("users", JSON.stringify(users));
    
  }

  async function addWaterNotification(){
    const userDetails = users[currentUser];

    PushNotification.cancelLocalNotifications({id: 'drink_notify'});
    PushNotification.localNotificationSchedule({
      id: "drink_notify",
      channelId: "drink_channel",
      title:"Drink Water notification",
      message: noteWater, // (required)
      date: new Date(Date.now()), // in 60 secs
      repeatType: "hour",
      number:lIndex+1,
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    });
    
    setIsWater(true);
    setModal2(false)
  }

  function getStartDate(periodStartDate, cycle){
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
    return periodStartDate;
  }

  function onChange(event, selectedDate){
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setSelectedTime(currentDate)
  }

  const interval = [
    {"label": "Every 1 hours", "value": "1"},
    {"label": "Every 2 hours", "value": "2"},
    {"label": "Every 3 hours", "value": "3"},
    {"label": "Every 4 hours", "value": "4"},
  ]
    
  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>
        <Modal isVisible={modal1} style={{alignItems: 'center'}} 
          onBackdropPress={()=> setModal1(false)} 
          onBackButtonPress={()=> setModal1(false)}
        >
          <View style={styles.modalContent}>
              <Text style={{textAlign: 'center', fontSize: 18, marginBottom: 10}}>{header}</Text>
                <View style={{backgroundColor: '#f2efef'}}>
                  <Text style={{marginTop: 10, fontSize: 14, textAlign: 'center'}}>{text1}</Text>
                  <View style={{flexDirection: 'row', width: '100%', marginTop: 5}}>
                    <View style={{width: '100%', flexDirection: 'row' ,height: 60, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity style={{width: '20%', justifyContent: 'center', alignItems: 'center'}} 
                            onPress={()=> {days==1?setDays(days):setDays(days-1)}}>
                            <Entypo name="circle-with-minus" size={40} color="#ff6666" />
                        </TouchableOpacity>
                        <View style={{width: '60%', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 20}}>{days}</Text>
                        </View>
                        <TouchableOpacity style={{width: '20%', justifyContent: 'center', alignItems: 'center'}} 
                            onPress={()=> setDays(days+1)}>
                            <Entypo name="circle-with-plus" size={40} color="#ff6666" />
                        </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={{backgroundColor: '#f2efef', marginTop: 10, paddingBottom:10, justifyContent: 'center', alignItems: 'center', }}>
                  <Text style={{marginTop: 10}}>Notification time</Text>
                  <View style={{flexDirection: 'row', width: '100%', marginTop: 5, alignSelf: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity style={{width: '90%', height: 50, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}} 
                      onPress={()=> setShow(true)}>
                      <Text>{moment(selectedTime).format('HH:mm')}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={{alignSelf: 'flex-end', marginRight: 20}}>Tap to edit</Text>
                </View>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={selectedTime}
                    mode={'time'}
                    display="spinner"
                    maximumDate={new Date()}
                    onChange={onChange}
                    timeZoneOffsetInSeconds={60}
                  />
                )}

                <View style={{backgroundColor: '#f2efef', marginTop: 10, paddingBottom:10, justifyContent: 'center', alignItems: 'center', }}>
                  <Text style={{marginTop: 10}}>Notification text</Text>
                  <View style={{flexDirection: 'row', width: '90%', marginTop: 5, alignSelf: 'center', justifyContent: 'center'}}>
                    <TextInput
                      style={{
                          borderColor: '#fff',
                          borderWidth: 1,
                          padding: 10,
                          width: '100%',
                          height: 70,
                          backgroundColor: '#fff'
                      }}
                      value={noteEnter}
                      underlineColorAndroid="transparent"
                      placeholderTextColor="gray"
                      numberOfLines={2}
                      multiline={true}
                      onChangeText={(val)=> setNoteEnter(val)}
                      />
                  </View>
                  <Text style={{alignSelf: 'flex-end', marginRight: 20}}>Tap to edit</Text>
                </View>
                

                

                <TouchableOpacity onPress={()=> addPeriodnotification()}
                      style={{width: '100%',height: 40,justifyContent: 'center', alignItems:'center',borderRadius: 5, marginTop: 10, alignSelf: 'flex-end', backgroundColor: '#ff6666'}}>
                      <Text style={{color: '#fff', fontSize: 16}}>Add</Text>
                  </TouchableOpacity>
              
              
          </View>
      </Modal>
        <Modal isVisible={modal2} style={{alignItems: 'center'}} 
            onBackdropPress={()=> setModal2(false)} 
            onBackButtonPress={()=> setModal2(false)}
          >
            <View style={styles.modalContent}>
                <Text style={{textAlign: 'center', fontSize: 18, marginBottom: 10}}>Drink Water Reminder</Text>

                  <View style={{backgroundColor: '#f2efef', marginTop: 10, paddingBottom:10, justifyContent: 'center', alignItems: 'center', zIndex: 0}}>
                    <Text style={{marginTop: 10}}>Interval</Text>
                    <TouchableOpacity style={{width: '90%', backgroundColor: '#fff', justifyContent: 'center', alignItems:'center', height: 50, marginTop: 5}} 
                      onPress={()=> setIntervalModal(true)}>
                      <Text>{interval[lIndex].label}</Text>
                    </TouchableOpacity>
                    <Text style={{alignSelf: 'flex-end', marginRight: 20}}>Tap to edit</Text>
                  </View>
                  

                  <View style={{backgroundColor: '#f2efef', marginTop: 10, paddingBottom:10, justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{marginTop: 10}}>Notification text</Text>
                    <View style={{flexDirection: 'row', width: '90%', marginTop: 5, alignSelf: 'center', justifyContent: 'center'}}>
                      <TextInput
                        style={{
                            borderColor: '#fff',
                            borderWidth: 1,
                            padding: 10,
                            width: '100%',
                            height: 70,
                            backgroundColor: '#fff'
                        }}
                        value={noteWater}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="gray"
                        numberOfLines={2}
                        multiline={true}
                        onChangeText={(val)=> setNoteWater(val)}
                        />
                    </View>
                    <Text style={{alignSelf: 'flex-end', marginRight: 20}}>Tap to edit</Text>
                  </View>
                  

                  

                  <TouchableOpacity onPress={()=> addWaterNotification()}
                        style={{width: '100%',height: 40,justifyContent: 'center', alignItems:'center',borderRadius: 5, marginTop: 10, alignSelf: 'flex-end', backgroundColor: '#ff6666'}}>
                        <Text style={{color: '#fff', fontSize: 16}}>Add</Text>
                    </TouchableOpacity>
                
                
            </View>
        </Modal>
        <Modal isVisible={intervalModal} style={{alignItems: 'center'}} 
          onBackdropPress={()=> setIntervalModal(false)} 
          onBackButtonPress={()=> setIntervalModal(false)}>
          <View style={styles.modalContent}>
             <View style={{flexDirection: 'column', width: '100%', margin:10}}>
                
                <RadioForm
                  style={{}}
                  radio_props={interval}
                  buttonColor= {config.THEME[theme].cycle_text}
                  selectedButtonColor = {config.THEME[theme].cycle_text}
                  initial={lIndex}
                  animation={true}
                  buttonSize={12}
                  radioStyle={{margin: 10}}
                  labelStyle={{ fontSize: 18, color: config.THEME[theme].period_text, marginRight: 3,}}
                  onPress={(value) => {
                    console.log(value)
                    setIntervalVal(value)
                    setIntervalModal(false)
                    const index = parseInt(value)-1;
                    setIindex(index)
                  }}
                  />
             </View>
          </View>
      </Modal>
        
        <View style={{flex:1, margin: 10, }}>
          <Text style={{color: '#c9c6c3', fontSize: 14, fontWeight: 'bold', marginBottom: 5}}>Active reminders</Text>
          <View style={{borderBottomColor: '#f2f2f2',borderBottomWidth: 2, }}/>
          {isPeriod?(
            <TouchableOpacity style={{padding: 10, flexDirection: 'row', width: '100%'}} 
              onPress={()=> periodClick("period")}>
              <Text style={{fontSize: 18, width: '50%', color: '#605e5e'}}>Period reminder</Text>
              <View style={{width: '50%', alignItems: 'flex-end'}}>
                  <FlipToggle
                      value={isPeriod}
                      buttonWidth={50}
                      buttonHeight={25}
                      buttonRadius={20}
                      sliderWidth={20}
                      sliderHeight={20}
                      sliderRadius={50}
                      buttonOnColor="red"
                      buttonOffColor="#aeaeaf"
                      sliderOffColor="#fff"
                      onToggle={(newState) => periodClick("period")}
                      onToggleLongPress={() => console.log('toggle long pressed!')}
                  />
              </View>
            </TouchableOpacity>
          ):null}
          {isFertile?(
            <TouchableOpacity style={{padding: 10, flexDirection: 'row', width: '100%'}} 
                onPress={()=> periodClick("fertile")}>
                <Text style={{fontSize: 18, width: '50%', color: '#605e5e'}}>Fertility reminder</Text>
                <View style={{width: '50%', alignItems: 'flex-end'}}>
                    <FlipToggle
                        value={isFertile}
                        buttonWidth={50}
                        buttonHeight={25}
                        buttonRadius={20}
                        sliderWidth={20}
                        sliderHeight={20}
                        sliderRadius={50}
                        buttonOnColor="red"
                        buttonOffColor="#aeaeaf"
                        sliderOffColor="#fff"
                        onToggle={(newState) => periodClick("fertile")}
                        onToggleLongPress={() => console.log('toggle long pressed!')}
                    />
                </View>
            </TouchableOpacity>
          ):null}
          {isOvulation?(
            <TouchableOpacity style={{padding: 10, flexDirection: 'row', width: '100%'}} 
                onPress={()=> periodClick("ovulation")}>
                <Text style={{fontSize: 18, width: '50%', color: '#605e5e'}}>Ovulation reminder</Text>
                <View style={{width: '50%', alignItems: 'flex-end'}}>
                    <FlipToggle
                        value={isOvulation}
                        buttonWidth={50}
                        buttonHeight={25}
                        buttonRadius={20}
                        sliderWidth={20}
                        sliderHeight={20}
                        sliderRadius={50}
                        buttonOnColor="red"
                        buttonOffColor="#aeaeaf"
                        sliderOffColor="#fff"
                        onToggle={(newState) => periodClick("ovulation")}
                        onToggleLongPress={() => console.log('toggle long pressed!')}
                    />
                </View>
            </TouchableOpacity>
          ):null}
          {isWater?(
            <TouchableOpacity style={{padding: 10, flexDirection: 'row', width: '100%'}} 
              onPress={()=> waterClick()}>
              <Text style={{fontSize: 18, width: '50%', color: '#605e5e'}}>Drink water reminder</Text>
              <View style={{width: '50%', alignItems: 'flex-end'}}>
                  <FlipToggle
                      value={isWater}
                      buttonWidth={50}
                      buttonHeight={25}
                      buttonRadius={20}
                      sliderWidth={20}
                      sliderHeight={20}
                      sliderRadius={50}
                      buttonOnColor="red"
                      buttonOffColor="#aeaeaf"
                      sliderOffColor="#fff"
                      onToggle={(newState) => waterClick()}
                      onToggleLongPress={() => console.log('toggle long pressed!')}
                  />
              </View>
          </TouchableOpacity>
          ):null}

          <Text style={{color: '#c9c6c3', fontSize: 14, fontWeight: 'bold', marginBottom: 5}}>Inactive reminders</Text>
          <View style={{borderBottomColor: '#f2f2f2',borderBottomWidth: 2, }}/>
          {!isPeriod?(
            <TouchableOpacity style={{padding: 10, flexDirection: 'row', width: '100%'}} 
              onPress={()=> periodClick("period")}>
              <Text style={{fontSize: 18, width: '50%', color: '#605e5e'}}>Period reminder</Text>
              <View style={{width: '50%', alignItems: 'flex-end'}}>
                  <FlipToggle
                      value={isPeriod}
                      buttonWidth={50}
                      buttonHeight={25}
                      buttonRadius={20}
                      sliderWidth={20}
                      sliderHeight={20}
                      sliderRadius={50}
                      buttonOnColor="red"
                      buttonOffColor="#aeaeaf"
                      sliderOffColor="#fff"
                      onToggle={(newState) => periodClick("period")}
                      onToggleLongPress={() => console.log('toggle long pressed!')}
                  />
              </View>
            </TouchableOpacity>
          ):null}
          {!isFertile?(
            <TouchableOpacity style={{padding: 10, flexDirection: 'row', width: '100%'}} 
                onPress={()=> periodClick("fertile")}>
                <Text style={{fontSize: 18, width: '50%', color: '#605e5e'}}>Fertility reminder</Text>
                <View style={{width: '50%', alignItems: 'flex-end'}}>
                    <FlipToggle
                        value={isFertile}
                        buttonWidth={50}
                        buttonHeight={25}
                        buttonRadius={20}
                        sliderWidth={20}
                        sliderHeight={20}
                        sliderRadius={50}
                        buttonOnColor="red"
                        buttonOffColor="#aeaeaf"
                        sliderOffColor="#fff"
                        onToggle={(newState) => periodClick("fertile")}
                        onToggleLongPress={() => console.log('toggle long pressed!')}
                    />
                </View>
            </TouchableOpacity>
          ):null}
          {!isOvulation?(
            <TouchableOpacity style={{padding: 10, flexDirection: 'row', width: '100%'}} 
                onPress={()=> periodClick("ovulation")}>
                <Text style={{fontSize: 18, width: '50%', color: '#605e5e'}}>Ovulation reminder</Text>
                <View style={{width: '50%', alignItems: 'flex-end'}}>
                    <FlipToggle
                        value={isOvulation}
                        buttonWidth={50}
                        buttonHeight={25}
                        buttonRadius={20}
                        sliderWidth={20}
                        sliderHeight={20}
                        sliderRadius={50}
                        buttonOnColor="red"
                        buttonOffColor="#aeaeaf"
                        sliderOffColor="#fff"
                        onToggle={(newState) => periodClick("ovulation")}
                        onToggleLongPress={() => console.log('toggle long pressed!')}
                    />
                </View>
            </TouchableOpacity>
          ):null}
          {!isWater?(
            <TouchableOpacity style={{padding: 10, flexDirection: 'row', width: '100%'}} 
              onPress={()=> waterClick()}>
              <Text style={{fontSize: 18, width: '50%', color: '#605e5e'}}>Drink water reminder</Text>
              <View style={{width: '50%', alignItems: 'flex-end'}}>
                  <FlipToggle
                      value={isWater}
                      buttonWidth={50}
                      buttonHeight={25}
                      buttonRadius={20}
                      sliderWidth={20}
                      sliderHeight={20}
                      sliderRadius={50}
                      buttonOnColor="red"
                      buttonOffColor="#aeaeaf"
                      sliderOffColor="#fff"
                      onToggle={(newState) => waterClick()}
                      onToggleLongPress={() => console.log('toggle long pressed!')}
                  />
              </View>
          </TouchableOpacity>
          ):null}
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
    width: '100%',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
}
});