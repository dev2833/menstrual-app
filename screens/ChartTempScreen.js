import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image,ScrollView,  TouchableOpacity, Dimensions, ImageBackground, processColor} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { TestIds, BannerAd, BannerAdSize} from '@react-native-firebase/admob';
import PureChart from 'react-native-pure-chart';
import moment from 'moment-timezone'
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import config from '../settings/config'
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
import NumericInput from 'react-native-numeric-input'
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

export default function ChartTempScreen({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const language = useSelector(state => state.language);
  const currentMonthStart = useSelector(state => state.currentMonthStart);
  const users = useSelector(state => state.users);
  const currentUsername = useSelector(state => state.currentUser);
  //const noteArrayDayWise = useSelector(state => state.noteArrayDayWise);
  const [chartArray, setChartArray] = useState([])
  const [currentMonth, setCurrentMonth] = useState("")
  const [monthRange, setMonthRange] = useState("")
  const [periodArray, setPeriodArray] = useState([])
  const [fertileArray, setFertileArray] = useState([])
  const[metricModal, setMetricModal] = useState(false)
  const[tempVal, setTempVal] = useState(99.5)
  const[noteArrayDayWise, setNoteArrayDayWise] = useState(users[currentUsername].noteArray)
  const[tempUnit, setTempUnit] = useState("C")
  const [pregnancy, setPregnancy] = useState(false) 

  
  React.useEffect(() => {  
      
      const currentUser = users[currentUsername];
      const periodLength = parseInt(currentUser.periodLength);
      const actualStartDate = currentUser.startDate;
      const cycle = parseInt(currentUser.cycleLength);
      const luteal = parseInt(currentUser.luteal);
      setTempUnit(currentUser.body)
      setPregnancy(currentUser.pregnancy)
      
      var fertDiff = cycle-parseInt(luteal)-5; 
      
      
      var actualStartDate1 = actualStartDate;
      var differnce = moment(new Date()).diff(actualStartDate1, 'months')
      
      if(!currentUser.pregnancy){
        for (let j = 0; j < differnce+8; j++) {
          for (let i = 0; i < cycle; i++) {
            const nextDay = moment(actualStartDate1).add(i, 'days').format('MMM DD')
            
            if(i>=0 && i<periodLength){
              periodArray.push(nextDay);
            }else if(i>=fertDiff && i<fertDiff+7){
              fertileArray.push(nextDay);
            }
          } 
          actualStartDate1 = moment(actualStartDate1).add(cycle, 'days')
        }
      }
      
      createChart()

  }, []);

  function createChart(){
    const noOfDays = moment(new Date()).daysInMonth()
    setCurrentMonth(new Date());

    const monthStartDay = moment(new Date()).startOf('month').format('YYYY-MM-DD')
    const monthEndDay = moment(new Date()).endOf('month').format('YYYY-MM-DD')
    setMonthRange(monthStartDay+" - "+monthEndDay)
    const localArray = [];

    for(var i=1; i<=noOfDays; i++){
      const nextDay = moment(monthStartDay).add(i-1, 'days').format('YYYY-MM-DD')
      var tempVal =  0;
      if(noteArrayDayWise.hasOwnProperty(nextDay)){
        
        const currentDayNote = noteArrayDayWise[nextDay];
        if(currentDayNote.hasOwnProperty("body")){
          tempVal = parseFloat(currentDayNote.body);
        }
      }
      
      const dayMonth = moment(nextDay).format('MMM DD')
      if(periodArray.includes(dayMonth)){
        localArray.push({x: dayMonth, y: tempVal, color: '#FF6666'});
      }else if(fertileArray.includes(dayMonth)){
        localArray.push({x: dayMonth, y: tempVal, color: '#f7b903'});
      }else{
        localArray.push({x: dayMonth, y: tempVal, color: '#fff'});
      }
    }
    
    console.log(localArray)
    setChartArray(JSON.parse(JSON.stringify(localArray)))
  }


  function changeMonth(type){
    const currentUser = users[currentUsername];
    const periodLength = parseInt(currentUser.periodLength);
    const luteal = parseInt(currentUser.luteal);
    const cycle = parseInt(currentUser.cycleLength);

    var nextPeriodStart = "";
    if(type=="next")
      nextPeriodStart = moment(currentMonth).add(30, 'days');
    else
      nextPeriodStart = moment(currentMonth).subtract(30, 'days');

    const noOfDays = moment(nextPeriodStart).daysInMonth()
    setCurrentMonth(nextPeriodStart);

    const monthStartDay = moment(nextPeriodStart).startOf('month').format('YYYY-MM-DD')
    const monthEndDay = moment(nextPeriodStart).endOf('month').format('YYYY-MM-DD')
    //const periodStartDay = parseInt(moment(nextPeriodStart).format('DD'));

    setMonthRange(monthStartDay+" - "+monthEndDay)
    const localArray = [];
    var fertDiff = cycle-parseInt(luteal)-5; 
    
    //const fertStart = periodStartDay+fertDiff;
    const month = moment(nextPeriodStart).format('MMM');
    for(var i=1; i<=noOfDays; i++){
      const nextDay = moment(monthStartDay).add(i-1, 'days').format('YYYY-MM-DD')
      var tempVal =  0;
      if(noteArrayDayWise.hasOwnProperty(nextDay)){
        const currentDayNote = noteArrayDayWise[nextDay];
        if(currentDayNote.hasOwnProperty("body")){
          tempVal = parseFloat(currentDayNote.body);
        }
      }
      
      const dayMonth = moment(nextDay).format('MMM DD')
      if(periodArray.includes(dayMonth)){
        localArray.push({x: dayMonth, y: tempVal, color: '#FF6666'});
      }else if(fertileArray.includes(dayMonth)){
        localArray.push({x: dayMonth, y: tempVal, color: '#f7b903'});
      }else{
        localArray.push({x: dayMonth, y: tempVal, color: '#fff'});
      }
    }
    
    console.log(localArray)
    setChartArray(JSON.parse(JSON.stringify(localArray)))
  }

  async function updateTemp(){
    var users1 = users;
    users1[currentUsername].body = tempUnit;

    const today = moment(new Date()).format('yyyy-MM-DD')
    var noteArry = noteArrayDayWise;
    if(noteArry.hasOwnProperty(today)){
      noteArry[today]['body'] = tempVal;
    }else{
      noteArry[today] = {body: tempVal}
    }
    
    users1[currentUsername].noteArray = noteArry;
    dispatch({ type: 'SET_USER', data: users1 });
    setNoteArrayDayWise(noteArry)
    await AsyncStorage.setItem("users", JSON.stringify(users1));
    createChart()
    setMetricModal(false)
  }
  
  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>
        <Modal isVisible={metricModal} style={{alignItems: 'center'}} 
            onBackdropPress={()=> setMetricModal(false)} 
            onBackButtonPress={()=> setMetricModal(false)}>
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
                  <Text style={{paddingRight: 15, paddingLeft: 15, color: config.THEME[theme].menu_text}}>{config.Labels[language].user_add_text}</Text>
                </TouchableOpacity>
               </LinearGradient>
            </View>
          </View>
        </Modal>
        <View style={{flex:1, margin: 10}}>
            <View style={{marginBottom: 10}}>
                {pregnancy?null:(
                <LinearGradient colors={config.THEME[theme].menu_button_color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{width:80, borderRadius: 10, marginLeft: -10, alignSelf: 'flex-end'}}>
                  <TouchableOpacity style={{width:80, height: 30,  justifyContent: 'center', alignItems: 'center'}} 
                    onPress={()=> setMetricModal(true)}>
                    <Text style={{paddingRight: 15, paddingLeft: 15, color: config.THEME[theme].menu_text}}></Text>
                  </TouchableOpacity>
                </LinearGradient>
               )}
            </View>
            <View style={{flexDirection: 'row', width:'100%',marginBottom: 10}}>
               <Text style={{textAlign: 'left', width:'10%', marginLeft: 10}}>{tempUnit}</Text>
            </View>
            <PureChart 
              data={[
                {
                  seriesName: 'series1',
                  data: chartArray,
                  color: '#297AB1'
                }
              ]} 
              type='bar' 
              numberOfYAxisGuideLine={2}
              showEvenNumberXaxisLabel={false}
              width={'100%'}
              height={300}
            />

            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
            <LinearGradient colors={config.THEME[theme].menu_button_color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{width: 250, borderRadius: 10}}>
              <TouchableOpacity style={{flexDirection: 'row', width: 250, height: 40,  justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={()=> changeMonth("pre")}>
                  <FontAwesome name="angle-left" size={40} color={config.THEME[theme].menu_text} />
                </TouchableOpacity>
                <Text style={{paddingRight: 15, paddingLeft: 15, color: config.THEME[theme].menu_text}}>{monthRange}</Text>
                <TouchableOpacity onPress={()=> changeMonth("next")}>
                  <FontAwesome name="angle-right" size={40} color={config.THEME[theme].menu_text}/>
                </TouchableOpacity>
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
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '100%',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  }
});