import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions, TextInput} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { TestIds, BannerAd, BannerAdSize, InterstitialAd, AdEventType} from '@react-native-firebase/admob';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import StarRating from 'react-native-star-rating';
import Modal from 'react-native-modal';
import NumericInput from 'react-native-numeric-input'
import config from '../settings/config'
import DropDownPicker from 'react-native-dropdown-picker';
import LinearGradient from 'react-native-linear-gradient';

import CheckBox from '@react-native-community/checkbox';
import moment from 'moment-timezone'
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const interstitial = InterstitialAd.createForAdRequest(config.admob_env=="dev"?TestIds.INTERSTITIAL:config.admob_id, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing'],
  });

export default function AddNoteScreen({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const language = useSelector(state => state.language);
  const [periodStart, setPeriodStart] = useState(false);
  const [showPeriodStart, setShowPeriodStart] = useState(true);
  const [showPeriodEnd, setShowPeriodEnd] = useState(true);
  const [noteModal, setNoteModal] = useState(false);
  const [intercourseModal, setIntercourseModal] = useState(false);
  const [intercourse, setIntercourse] = useState(false);

  const [periodEnd, setPeriodEnd] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentDateDisplay, setCurrentDateDisplay] = useState("Today")
  const dashboardRerender = useSelector(state => state.dashboardRerender);
  const [flowRate, setFlowRate] = useState(0);
  const [note, setNote] = useState("");
  const [noteEnter, setNoteEnter] = useState("");
  const [condomUse, setCondomUse] = useState("unprotected");
  const [orgasm, setOrgasm] = useState("no");
  const [times, setTimes] = useState(1);

  const[metricModal, setMetricModal] = useState(false)
  const[weightVal, setWeightVal] = useState("")
  const[heightVal, setHeightVal] = useState(0.0)
  const[weightUnit, setWeightUnit] = useState("lb")
  const[heightUnit, setHeightUnit] = useState("inch")

  const[tempModal, setTempModal] = useState(false)
  const[tempVal, setTempVal] = useState("")
  const[tempUnit, setTempUnit] = useState("")

  const[waterModal, setWaterModal] = useState(false)
  const[drink, setDrink] = useState(0)

  const users = useSelector(state => state.users);
  const currentUser = useSelector(state => state.currentUser);
  const [loaded, setLoaded] = useState(false);

  React.useEffect(() => {  
    const userDetails = users[currentUser]
    const periodStartDate = userDetails.startDate;
    const cycle = userDetails.cycleLength;
    const notes = userDetails.noteArray;

    setWeightUnit(userDetails.weight)
    setHeightUnit(userDetails.height)
    setTempUnit(userDetails.body)
    
    const currentDtFormat = moment(currentDate).format('yyyy-MM-DD');
    console.log(moment(currentDate).format('yyyy-MM-DD')+"..."+moment(periodStartDate).format('yyyy-MM-DD'))
    if(!notes.hasOwnProperty(currentDtFormat)){
        notes[currentDtFormat] = {};
        users[currentUser].noteArray = notes;
        updateUser(users)
    }

    if(moment(currentDate).format('yyyy-MM-DD')
        ==(moment(periodStartDate).format('yyyy-MM-DD'))){
        setPeriodStart(true)
    }else{
        setPeriodStart(false)
    }

    if(moment(currentDate).add(userDetails.periodLength, 'days').format('yyyy-MM-DD')
        ==(moment(periodStartDate).format('yyyy-MM-DD'))){
        setPeriodEnd(true)
    }else{
        setPeriodEnd(false)
    }

    if(notes[currentDtFormat].hasOwnProperty('symptoms') 
        && notes[currentDtFormat].symptoms.hasOwnProperty('flow')){
        setFlowRate(notes[currentDtFormat].symptoms.flow)
    }
    
    if(notes[currentDtFormat].hasOwnProperty('note')){
        setNote(notes[currentDtFormat].note)
        setNoteEnter(notes[currentDtFormat].note)
    }else{
        setNote("")
        setNoteEnter("")
    }

    if(notes[currentDtFormat].hasOwnProperty('intercourse')){
        setCondomUse(notes[currentDtFormat].intercourse.condom_use)
        setOrgasm(notes[currentDtFormat].intercourse.orgasm)
        setTimes(notes[currentDtFormat].intercourse.nooftimes)
        setIntercourse(true)
    }else{
        setCondomUse("unprotected")
        setOrgasm("no")
        setTimes(1)
        setIntercourse(false)
    }

    if(notes[currentDtFormat].hasOwnProperty('weight')){
        setWeightVal(notes[currentDtFormat].weight)
    }else{
        setWeightVal("")
    }

    if(notes[currentDtFormat].hasOwnProperty('height')){
        setHeightVal(notes[currentDtFormat].height)
    }else{
        setHeightVal(0)
    }

    if(notes[currentDtFormat].hasOwnProperty('temp')){
        setTempVal(notes[currentDtFormat].temp)
    }else{
        setTempVal("")
    }

    if(notes[currentDtFormat].hasOwnProperty('water')){
        setDrink(notes[currentDtFormat].water)
    }else{
        setDrink(0)
    }

    console.log(noteEnter)
    console.log(note)
    
    
  }, [currentDate])
  
  async function updateUser(user){
    dispatch({ type: 'SET_USER', data: user });
    await AsyncStorage.setItem("users", JSON.stringify(user));
  }

  async function changePeriodStart(){
    if(periodStart){
        return;
    }
    users[currentUser].startDate = currentDate;
    console.log(users)
    dispatch({ type: 'SET_USER', data: users });
    await AsyncStorage.setItem("users", JSON.stringify(users));
    dispatch({ type: 'DASHBOARD_RERENDER', data: !dashboardRerender });
    setPeriodStart(!periodStart)
  }

  async function changePeriodEnd(){
    const differnceD = moment(currentDate).diff(moment(users[currentUser].startDate), 'days')
    if(differnceD<0){
        alert("You can not select period end date before period start date")
        return;
    }
    users[currentUser].periodLength = differnceD;
    console.log(users)
    dispatch({ type: 'SET_USER', data: users });
    await AsyncStorage.setItem("users", JSON.stringify(users));
    dispatch({ type: 'DASHBOARD_RERENDER', data: !dashboardRerender });
  }

  async function updateFlow(rate){
    setFlowRate(rate)
    const currentDtFormat = moment(currentDate).format('yyyy-MM-DD');
    const noteArray = users[currentUser].noteArray;

    if(noteArray[currentDtFormat].hasOwnProperty('symptoms')){
        noteArray[currentDtFormat].symptoms['flow'] = rate;
    }else{
        noteArray[currentDtFormat]['symptoms'] = {"flow": rate}
    }

    users[currentUser].noteArray = noteArray;
    console.log(users)
    dispatch({ type: 'SET_USER', data: users });
    await AsyncStorage.setItem("users", JSON.stringify(users));
    dispatch({ type: 'DASHBOARD_RERENDER', data: !dashboardRerender });

  }

  async function nextPrevDate(type){
    var dateToShow = ""
    var newDate = null;
    if(type=="next"){
        newDate = moment(currentDate).add(1, 'days').toDate();
        dateToShow = moment(newDate).format("MMM DD, yyyy")
    }else{
        newDate = moment(currentDate).subtract(1, 'days').toDate();
        dateToShow = moment(newDate).format("MMM DD, yyyy")
    }

    if(moment(newDate).format("yyyy-MM-DD") == (moment(new Date()).format("yyyy-MM-DD"))){
        dateToShow = "Today"
    }

    const periodStartDiff = moment(new Date()).diff(moment(newDate), 'days');
    if(periodStartDiff<0){
        setShowPeriodStart(false)
    }else{
        setShowPeriodStart(true)
    }

    const periodEndDiff = moment(newDate).diff(moment(users[currentUser].startDate), 'days');
    console.log(periodEndDiff)
    if(periodEndDiff>=0 && periodEndDiff<7){
        setShowPeriodEnd(true)
    }else{
        setShowPeriodEnd(false)
    }

    setCurrentDate(newDate)
    setCurrentDateDisplay(dateToShow);
  }

  async function noteSubmit(){
    if(noteEnter==""){
        alert("Please enter the note before click on add button!")
        return;
    }
    const currentDtFormat = moment(currentDate).format('yyyy-MM-DD');
    const noteArray = users[currentUser].noteArray;

    noteArray[currentDtFormat]['note'] = noteEnter;

    users[currentUser].noteArray = noteArray;
    console.log(users)
    setNote(noteEnter)
    dispatch({ type: 'SET_USER', data: users });
    await AsyncStorage.setItem("users", JSON.stringify(users));
    setNoteModal(false)
  }

  async function submitIntercourse(){
    const intercourseObj = {
        condom_use: condomUse,
        orgasm: orgasm,
        nooftimes: times
    }
    const currentDtFormat = moment(currentDate).format('yyyy-MM-DD');
    const noteArray = users[currentUser].noteArray;

    noteArray[currentDtFormat]['intercourse'] = intercourseObj;

    users[currentUser].noteArray = noteArray;
    dispatch({ type: 'SET_USER', data: users });
    await AsyncStorage.setItem("users", JSON.stringify(users));
    setIntercourseModal(false)
    setIntercourse(true)
  }
    
  async function updateWeight(){
    var users1 = users;
    users1[currentUser].weight = weightUnit;
    users1[currentUser].height = heightUnit;

    const today = moment(currentDate).format('yyyy-MM-DD')
    var noteArry = users[currentUser].noteArray;
    if(noteArry.hasOwnProperty(today)){
      noteArry[today]['weight'] = weightVal;
      noteArry[today]['height'] = heightVal;
    }else{
      noteArry[today] = {weight: weightVal, height: heightVal}
    }
    
    users1[currentUser].noteArray = noteArry;
    console.log(users1)
    dispatch({ type: 'SET_USER', data: users1 });
    await AsyncStorage.setItem("users", JSON.stringify(users1));
    setMetricModal(false)
  }

  async function updateTemp(){
    var users1 = users;
    users1[currentUser].body = tempUnit;

    const today = moment(currentDate).format('yyyy-MM-DD')
    var noteArry = users[currentUser].noteArray;
    if(noteArry.hasOwnProperty(today)){
      noteArry[today]['temp'] = tempVal;
    }else{
      noteArry[today] = {temp: tempVal}
    }
    
    users1[currentUser].noteArray = noteArry;
    console.log(users1)
    dispatch({ type: 'SET_USER', data: users1 });
    await AsyncStorage.setItem("users", JSON.stringify(users1));
    setTempModal(false)
  }

  async function updateDrink(){
    var users1 = users;

    const today = moment(currentDate).format('yyyy-MM-DD')
    var noteArry = users[currentUser].noteArray;
    if(noteArry.hasOwnProperty("water")){
      noteArry[today]['water'] = drink;
    }else{
      noteArry[today] = {"water": drink}
    }
    
    users1[currentUser].noteArray = noteArry;
    console.log(users1)
    dispatch({ type: 'SET_USER', data: users1 });
    await AsyncStorage.setItem("users", JSON.stringify(users1));
    setWaterModal(false)
  }

  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>
        <Modal isVisible={noteModal} style={{alignItems: 'center'}} 
            onBackdropPress={()=> setNoteModal(false)} 
            onBackButtonPress={()=> setNoteModal(false)}>
          <View style={styles.modalContent}>
            <Text style={{fontSize: 18, marginBottom: 10}}>{config.Labels[language].note_add_text}</Text>
            <TextInput
                style={{
                    borderColor: '#f2efed',
                    borderWidth: 1,
                    padding: 5
                }}
                value={noteEnter}
                underlineColorAndroid="transparent"
                placeholder="Enter note here"
                placeholderTextColor="gray"
                numberOfLines={5}
                multiline={true}
                onChangeText={(val)=> setNoteEnter(val)}
                />
                <TouchableOpacity onPress={()=> noteSubmit()}
                    style={{width: 80,height: 40,justifyContent: 'center', alignItems:'center',borderRadius: 5, marginTop: 10, alignSelf: 'flex-end', backgroundColor: '#ff6666'}}>
                    <Text style={{color: '#fff', fontSize: 16}}>{config.Labels[language].note_add_btn}</Text>
                </TouchableOpacity>
          </View>
      </Modal>
        <Modal isVisible={intercourseModal} style={{alignItems: 'center'}} 
                onBackdropPress={()=> setIntercourseModal(false)} 
                onBackButtonPress={()=> setIntercourseModal(false)}>
            <View style={styles.modalContent}>
               <Text>{config.Labels[language].note_condom}</Text>
               <View style={{flexDirection: 'row', width: '100%', marginTop: 5}}>
                    <TouchableOpacity style={condomUse=="unprotected"?styles.btn_active:styles.btn_inactive} 
                        onPress={()=> setCondomUse("unprotected")}>
                        <Text style={condomUse=="unprotected"?styles.text_active:styles.text_inactive}>{config.Labels[language].note_unprotect}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={condomUse=="protected"?styles.btn_active:styles.btn_inactive} 
                        onPress={()=> setCondomUse("protected")}>
                        <Text style={condomUse=="protected"?styles.text_active:styles.text_inactive}>{config.Labels[language].note_protect}</Text>
                    </TouchableOpacity>
               </View>

               <Text style={{marginTop: 10}}>{config.Labels[language].note_orgasm}</Text>
               <View style={{flexDirection: 'row', width: '100%', marginTop: 5}}>
                    <TouchableOpacity style={orgasm=="yes"?styles.btn_active:styles.btn_inactive} 
                        onPress={()=> setOrgasm("yes")}>
                        <Text style={orgasm=="yes"?styles.text_active:styles.text_inactive}>{config.Labels[language].note_yes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={orgasm=="no"?styles.btn_active:styles.btn_inactive} 
                        onPress={()=> setOrgasm("no")}>
                        <Text style={orgasm=="no"?styles.text_active:styles.text_inactive}>{config.Labels[language].note_no}</Text>
                    </TouchableOpacity>
               </View>

               <Text style={{marginTop: 10}}>{config.Labels[language].note_how_many}</Text>
               <View style={{flexDirection: 'row', width: '100%', marginTop: 5}}>
                    <View style={{width: '100%', flexDirection: 'row' ,height: 60, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity style={{width: '20%', justifyContent: 'center', alignItems: 'center'}} 
                            onPress={()=> {times==1?setTimes(times):setTimes(times-1)}}>
                            <Entypo name="circle-with-minus" size={40} color="#ff6666" />
                        </TouchableOpacity>
                        <View style={{width: '60%', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 20}}>{times}</Text>
                        </View>
                        <TouchableOpacity style={{width: '20%', justifyContent: 'center', alignItems: 'center'}} 
                            onPress={()=> setTimes(times+1)}>
                            <Entypo name="circle-with-plus" size={40} color="#ff6666" />
                        </TouchableOpacity>
                    </View>
               </View>

               <TouchableOpacity style={{...styles.btn_active, width: '100%', height: 40}} onPress={()=> submitIntercourse()}>
                    <Text style={styles.text_active}>{config.Labels[language].note_add_btn}</Text>
                </TouchableOpacity>
            </View>
        </Modal>
        <Modal isVisible={metricModal} style={{alignItems: 'center'}} 
            onBackdropPress={()=> setMetricModal(false)} 
            onBackButtonPress={()=> setMetricModal(false)}>
          <View style={styles.modalContent}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 20, marginBottom: 10}}>{config.Labels[language].note_weight}</Text>
                <View style={{flexDirection: 'row'}}>
                  <NumericInput 
                    value={weightVal} 
                    onChange={value => setWeightVal(value)} 
                    onLimitReached={(isMax,msg) => console.log(isMax,msg)}
                    totalWidth={150} 
                    totalHeight={50} 
                    iconSize={20}
                    step={0.2}
                    maxValue={200}
                    minValue={0}
                    valueType='real'
                    rounded 
                    textColor='#B0228C' 
                    iconStyle={{ color: 'white' }} 
                    rightButtonBackgroundColor='#EA3788' 
                    leftButtonBackgroundColor='#E56B70'/>
                    
                    <DropDownPicker
                      items={[
                          {label: 'lb', value: 'lb'},
                          {label: 'kg', value: 'kg'},
                      ]}
                      multiple={false}            
                      defaultValue={weightUnit}
                      containerStyle={{height: 50, width: 80, marginLeft: 10}}
                      itemStyle={{
                          justifyContent: 'flex-start'
                      }}
                      onChangeItem={item => setWeightUnit(item.value)}
                      />
                </View>
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
                <Text style={{fontSize: 20, marginBottom: 10}}>{config.Labels[language].note_height}</Text>
                <View style={{flexDirection: 'row'}}>
                  <NumericInput 
                    value={heightVal} 
                    onChange={value => setHeightVal(value)} 
                    onLimitReached={(isMax,msg) => console.log(isMax,msg)}
                    totalWidth={150} 
                    totalHeight={50} 
                    iconSize={20}
                    step={0.2}
                    maxValue={200}
                    minValue={0}
                    valueType='real'
                    rounded 
                    textColor='#B0228C' 
                    iconStyle={{ color: 'white' }} 
                    rightButtonBackgroundColor='#EA3788' 
                    leftButtonBackgroundColor='#E56B70'/>
                    
                    <DropDownPicker
                      items={[
                          {label: 'cm', value: 'cm'},
                          {label: 'm', value: 'm'},
                          {label: 'inch', value: 'inch'},
                          {label: 'ft.+in.', value: 'ft.+in.'},
                      ]}
                      multiple={false}            
                      defaultValue={heightUnit}
                      containerStyle={{height: 50, width: 80, marginLeft: 10}}
                      itemStyle={{
                          justifyContent: 'flex-start'
                      }}
                      onChangeItem={item => setHeightUnit(item.value)}
                      />
                </View>
              </View>
              <View style={{marginTop: 30, justifyContent: 'center', alignItems: 'center'}}>
               <LinearGradient colors={config.THEME[theme].menu_button_color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{width:'90%', borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity style={{width:150, height: 50,  justifyContent: 'center', alignItems: 'center'}} 
                  onPress={()=> updateWeight()}>
                  <Text style={{paddingRight: 15, paddingLeft: 15, color: config.THEME[theme].menu_text}}>{config.Labels[language].note_add_btn}</Text>
                </TouchableOpacity>
               </LinearGradient>
            </View>
          </View>
        </Modal>
        <Modal isVisible={tempModal} style={{alignItems: 'center'}} 
            onBackdropPress={()=> setTempModal(false)} 
            onBackButtonPress={()=> setTempModal(false)}>
          <View style={styles.modalContent}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 20, marginBottom: 10}}>{config.Labels[language].note_temp}</Text>
                <View style={{flexDirection: 'row'}}>
                  <NumericInput 
                    value={tempVal} 
                    onChange={value => setTempVal(value)} 
                    onLimitReached={(isMax,msg) => console.log(isMax,msg)}
                    totalWidth={150} 
                    totalHeight={50} 
                    iconSize={20}
                    step={0.2}
                    maxValue={200}
                    minValue={0}
                    valueType='real'
                    rounded 
                    textColor='#B0228C' 
                    iconStyle={{ color: 'white' }} 
                    rightButtonBackgroundColor='#EA3788' 
                    leftButtonBackgroundColor='#E56B70'/>
                    
                    <DropDownPicker
                      items={[
                          {label: "°C", value: 'C' },
                          {label: "°F", value: 'F' }
                      ]}
                      multiple={false}            
                      defaultValue={tempUnit}
                      containerStyle={{height: 50, width: 80, marginLeft: 10}}
                      itemStyle={{
                          justifyContent: 'flex-start'
                      }}
                      onChangeItem={item => setTempUnit(item.value)}
                      />
                </View>
              </View>
              <View style={{marginTop: 30, justifyContent: 'center', alignItems: 'center'}}>
               <LinearGradient colors={config.THEME[theme].menu_button_color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{width:'90%', borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity style={{width:150, height: 50,  justifyContent: 'center', alignItems: 'center'}} 
                  onPress={()=> updateTemp()}>
                  <Text style={{paddingRight: 15, paddingLeft: 15, color: config.THEME[theme].menu_text}}>{config.Labels[language].note_add_btn}</Text>
                </TouchableOpacity>
               </LinearGradient>
            </View>
          </View>
        </Modal>
        <Modal isVisible={waterModal} style={{alignItems: 'center'}} 
            onBackdropPress={()=> setWaterModal(false)} 
            onBackButtonPress={()=> setWaterModal(false)}>
          <View style={{...styles.modalContent, width: '100%'}}>
            <Text style={{marginTop: 10, fontSize: 22, alignSelf: 'center'}}>
                <Text style={{color: '#ff6666'}}>{drink}</Text>/2000 ml
            </Text>
            <Text style={{forntSize: 16, alignSelf: 'center', marginBottom: 20}}>{config.Labels[language].note_target}</Text>
            <View style={{flexDirection: 'row', width: '100%', marginBottom: 15}}>
                <View style={{width: '100%', flexDirection: 'row' ,height: 60, justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity style={{width: '20%', justifyContent: 'center', alignItems: 'center'}} 
                        onPress={()=> {drink==0?setDrink(drink):setDrink(drink-100)}}>
                        <Entypo name="circle-with-minus" size={40} color="#ff6666" />
                    </TouchableOpacity>
                    <View style={{width: '60%', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 20}}>{drink}</Text>
                    </View>
                    <TouchableOpacity style={{width: '20%', justifyContent: 'center', alignItems: 'center'}} 
                        onPress={()=> setDrink(drink+100)}>
                        <Entypo name="circle-with-plus" size={40} color="#ff6666" />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={{...styles.btn_active, width: '100%', height: 40}} onPress={()=> updateDrink()}>
                <Text style={styles.text_active}>{config.Labels[language].note_add_btn}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <View style={{flex:1, margin: 10, alignItems: 'center'}}>
            <View style={{width: '95%', backgroundColor: '#fff', alignItems: 'center'}}>
                <View style={{flexDirection: 'row', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', padding: 0, backgroundColor: config.THEME[theme].period_text}}>
                    <TouchableOpacity style={{width: '20%',justifyContent: 'center', alignItems: 'center'}} 
                        onPress={()=> nextPrevDate("prev")}>
                        <FontAwesome name="angle-left" size={40} color="#fff" />
                    </TouchableOpacity>
                    <View style={{width: '60%', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 18, color: '#fff'}}>{currentDateDisplay}</Text>
                    </View>
                    <TouchableOpacity style={{width: '20%', justifyContent: 'center', alignItems: 'center'}} 
                        onPress={()=> nextPrevDate("next")}>
                        <FontAwesome name="angle-right" size={40} color="#fff" />
                    </TouchableOpacity>
                </View>
                {showPeriodStart?(
                    <TouchableOpacity style={{flexDirection: 'row',padding: 10, borderColor: '#f2f2f2', borderWidth:1, width: '100%', justifyContent: 'center', alignItems: 'center'}} 
                        onPress={()=> changePeriodStart()}>
                        <View style={{flexDirection: 'row', width: '70%'}}>
                        <MaterialCommunityIcons name="restart" size={25} color="#ff6666" style={{marginRight: 20}}/>
                        <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].note_p_start}</Text>
                        </View>
                        <View style={{width: '30%', alignItems: 'flex-end'}}>
                            <CheckBox
                                disabled={false}
                                value={periodStart}
                                onFillColor="#ff6666"
                                onValueChange={(newValue) => changePeriodStart()}
                            />
                        </View>
                    </TouchableOpacity>
                ):null}
                <TouchableOpacity style={{flexDirection: 'row',padding: 10, borderColor: '#f2f2f2', borderWidth:1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                      <FontAwesome5 name="egg" size={25} color="#ff6666" style={{marginRight: 20}}/>
                      <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].note_flow}</Text>
                    </View>
                    <View style={{width: '30%', alignItems: 'flex-end'}}>
                        <StarRating
                            disabled={false}
                            maxStars={5}
                            rating={flowRate}
                            starSize={20}
                            buttonStyle={{padding:2}}
                            fullStarColor="#ff6666"
                            selectedStar={(rating) => updateFlow(rating)}
                        />
                    </View>
                </TouchableOpacity>
                {showPeriodEnd?(
                <TouchableOpacity style={{flexDirection: 'row',padding: 10, borderColor: '#f2f2f2', borderWidth:1, width: '100%', justifyContent: 'center', alignItems: 'center'}} 
                    onPress={()=> changePeriodEnd()}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                      <MaterialCommunityIcons name="restart-off" size={25} color="#ff6666" style={{marginRight: 20}}/>
                      <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].note_p_end}</Text>
                    </View>
                    <View style={{width: '30%', alignItems: 'flex-end'}}>
                        <CheckBox
                            disabled={false}
                            value={periodEnd}
                            onCheckColor={'#fff'}
                            onFillColor={'#FF6666'}
                            onValueChange={(newValue) => changePeriodEnd()}
                        />
                    </View>
                </TouchableOpacity>
                ):null}
                <TouchableOpacity style={{flexDirection: 'row',padding: 10, borderColor: '#f2f2f2', borderWidth:1, width: '100%', justifyContent: 'center', alignItems: 'center'}} 
                    onPress={()=> {
                        setNoteEnter("")
                        setNoteModal(true)
                    }}>
                    <View style={{flexDirection: 'row', width: '100%'}}>
                      <FontAwesome name="sticky-note" size={25} color="#ff6666" style={{marginRight: 20}}/>
                      <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].note_text}</Text>
                      <Text style={{fontSize: 14, color: '#515151', marginLeft: 5}} numberOfLines={1}>{note}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection: 'row',padding: 10, borderColor: '#f2f2f2', borderWidth:1, width: '100%', justifyContent: 'center', alignItems: 'center'}} 
                    onPress={()=> setIntercourseModal(true)}>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                    <FontAwesome name="heart" size={25} color="#ff6666" style={{marginRight: 20}}/>
                    <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].note_interc}</Text>
                    </View>
                    <View style={{width: '30%', alignItems: 'flex-end'}}>
                        <CheckBox
                            disabled={false}
                            value={intercourse}
                            onFillColor="#ff6666"
                            onValueChange={(newValue) => setIntercourseModal(true)}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection: 'row',padding: 10, borderColor: '#f2f2f2', borderWidth:1, width: '100%', justifyContent: 'center', alignItems: 'center'}} 
                    onPress={()=> setMetricModal(true)}>
                    <View style={{flexDirection: 'row', width: '100%'}}>
                        <FontAwesome5 name="weight" size={25} color="#ff6666" style={{marginRight: 20}}/>
                        <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].note_weight}</Text>
                        <Text style={{fontSize: 16, color: '#515151', marginLeft: 20}}>{weightVal} {weightVal==""?"":weightUnit}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection: 'row',padding: 10, borderColor: '#f2f2f2', borderWidth:1, width: '100%', justifyContent: 'center', alignItems: 'center'}} 
                    onPress={()=> setTempModal(true)}>
                    <View style={{flexDirection: 'row', width: '100%'}}>
                        <FontAwesome5 name="temperature-high" size={25} color="#ff6666" style={{marginRight: 20}}/>
                        <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].note_temp}</Text>
                        <Text style={{fontSize: 16, color: '#515151', marginLeft: 20}}>{tempVal} {tempVal==""?"":tempUnit}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection: 'row',padding: 10, borderColor: '#f2f2f2', borderWidth:1, width: '100%', justifyContent: 'center', alignItems: 'center'}} 
                    onPress={()=> setWaterModal(true)}>
                    <View style={{flexDirection: 'row', width: '100%'}}>
                        <Entypo name="cup" size={25} color="#ff6666" style={{marginRight: 20}}/>
                        <Text style={{fontSize: 16, color: '#515151'}}>{config.Labels[language].note_water}</Text>
                        <Text style={{fontSize: 16, color: '#515151', marginLeft: 20}}>{drink==0?"":drink+"/2000 ml"}</Text>
                    </View>
                </TouchableOpacity>
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
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        width: '90%',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    btn_inactive:{
        width: '50%', 
        height: 60, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderColor: '#ff6666',
        borderWidth: 1
    },
    btn_active:{
        width: '50%', 
        height: 60, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#ff6666',
    },
    text_active:{
        fontSize: 16,
        color: '#fff'
    },
    text_inactive:{
        fontSize: 16,
        color: '#000'
    }
});