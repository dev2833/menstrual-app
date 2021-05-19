import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { TestIds, BannerAd, BannerAdSize, InterstitialAd, AdEventType} from '@react-native-firebase/admob';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import moment from 'moment-timezone'
import LinearGradient from 'react-native-linear-gradient';
import config from '../settings/config'
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
var cellWidth = (width-40)/30;
var cellWidthCommon = (width-60)/30;


export default function BarComponent({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const users = useSelector(state => state.users);
  const language = useSelector(state => state.language);
  const currentUsername = useSelector(state => state.currentUser);
  const[firstPeriod, setFirstPeriod] = useState("")
  const[lastPeriod, setLastPeriod] = useState("")
  const[periodMaker, setPeriodMaker] = useState([])
  const[commonBar, setCommonBar] = useState([])
  const[periodTab, setPeriodTab] = useState("past")
  const[predictionArray, setPredictionArray] = useState([])
  const[todayNumber, setTodayNumber] = useState(2)
  const [pregnancy, setPregnancy] = useState(false)  

  const [date, setDate] = useState(new Date())
  const [show, setShow] = useState(false);
  const [updatePage, setUpdatePage] = useState(false);
  const dashboardRerender = useSelector(state => state.dashboardRerender);

  React.useEffect(() => {
    setInitial(); 
  }, [updatePage]);

  function setInitial(){
    const currentUser = users[currentUsername];
    const cycle = parseInt(currentUser.cycleLength);
    const period = parseInt(currentUser.periodLength);
    const luteal = parseInt(currentUser.luteal);
    setPregnancy(currentUser.pregnancy)

    cellWidth = (width-40)/cycle;
    cellWidthCommon = (width-60)/cycle;

    var start = currentUser.startDate;
    for(var i=0; i<13; i++){
        const nextMonth = moment(currentUser.startDate).add(i*cycle, 'days');

        start = new Date(nextMonth);
        const end   = new Date();
        const differnceD = moment(end).diff(start, 'days')
        if(differnceD<=cycle){
            break;
        }
    }

    const firstDay = moment(start).format('MMM Do');
    const LastPeriod = moment(start).add(period-1, 'days').format('MMM Do');

    setFirstPeriod(firstDay)
    setLastPeriod(LastPeriod)

    const today = moment(new Date()).format('yyyy-MM-DD');

    var periodMaker = [];
    for(let i = 0; i < period; i++){
        const nextDay = moment(start).add(i, 'days').format('yyyy-MM-DD');
        if(today==nextDay){
            setTodayNumber(i+1)
            periodMaker.push(<View key={i} style={i==0 ? styles.back_first : styles.back}><Ionicons name="egg" size={10} color="#822e0d" /></View>);
        }else{
            periodMaker.push(<View key={i} style={i==0 ? styles.back_first : styles.back}></View>)
        }
    }

    var fertDiff = cycle-parseInt(luteal)-5;
    // if(cycle>28){
    //   fertDiff = fertDiff + cycle-28;
    // }else if (cycle<28){
    //   fertDiff = fertDiff - (28-cycle);
    // }

    console.log(fertDiff)

    for(let i = period+1; i < cycle; i++){
        const nextDay = moment(start).add(i, 'days').format('yyyy-MM-DD');
        if(today==nextDay){
            setTodayNumber(i+1)
            if(!(i>=fertDiff && i<fertDiff+7)){
                periodMaker.push(
                    <View key={i} style={styles.back1}>
                        <Ionicons name="egg" size={10} color="#822e0d" />
                    </View>
                );
            }
        }else if(!currentUser.pregnancy){
            if(i>=fertDiff && i<fertDiff+7){
                periodMaker.push(<View key={i} style={styles.back2}>
                    {i==(fertDiff+5)?(
                        <Ionicons name="egg" size={10} color="#fff" />
                    ):null}
                </View>)
            }else{
                periodMaker.push(<View key={i} style={styles.back1}></View>)
            }
        }
    }
    commonPeriods(cycle, period);
    setPeriodMaker(periodMaker)
    if(!currentUser.pregnancy){
        predictNext(start, cycle, period, firstDay, LastPeriod);
    }
  }

  function commonPeriods(cycle, period){
    setCommonBar([])
    for(let i = 0; i < cycle; i++){
        if(i>=0 && i<period){
            commonBar.push(<View key={i} style={i==0 ? styles.back_first_common : styles.back_common}></View>);
        }else{
            commonBar.push(<View key={i} style={styles.back1_common}></View>)
        }
    }
    setCommonBar(commonBar)
  }

  function predictNext(start,cycle,period, first, last){
    const arry = [];
    arry.push(first+" - "+last)
    for(let i = 1; i < 6; i++){
        const nextMonthStart = moment(start).add(i*cycle, 'days');
        const firstDayMonth = moment(nextMonthStart).format('MMM Do');
        const LastPeriodMonth = moment(nextMonthStart).add(period-1, 'days').format('MMM Do');
        arry.push(firstDayMonth+" - "+LastPeriodMonth)
    }
    console.log(arry)
    setPredictionArray(arry)
  }

  async function onChange(event, selectedDate){
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');

    users[currentUsername].startDate = currentDate;
    dispatch({ type: 'SET_USER', data: users });
    await AsyncStorage.setItem("users", JSON.stringify(users));
    setUpdatePage(!updatePage)
    dispatch({ type: 'DASHBOARD_RERENDER', data: !dashboardRerender });
  }

  function addPeriod(){
    const currentUser = users[currentUsername];
    setDate(moment(currentUser.startDate).toDate())
    setShow(true)
  }

  return (
    <View style={{flex:1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
        <View style={{flex:1, width: width-40, marginTop: 30}}>
            
            <Text style={{marginBottom: 5, fontSize: 10, color: '#FF6666'}}>{firstPeriod} - {lastPeriod}</Text>
            <TouchableOpacity style={{flexDirection: 'row', 
                width: width-40, height: 13, 
                borderColor: '#d3cfcb', 
                borderWidth: 1, backgroundColor: '#d3cfcb',
                borderRadius: 10, }}>
        
                {periodMaker}
            </TouchableOpacity>
            <View style={{alignItems: 'flex-end', flexDirection: 'row', marginTop: 10}}>
                <Ionicons name="egg" size={12} color="#822e0d" />
                <Text style={{fontSize: 12, color: '#822e0d', marginLeft: 5}}>{config.Labels[language].bar_today}</Text>
                
                {pregnancy?null:(<>
                    <View style={{backgroundColor: '#fab913', marginLeft: 10}}><Ionicons name="egg" size={12} color="#fff" /></View>
                    <Text style={{fontSize: 12, color: '#822e0d', marginLeft: 5}}>{config.Labels[language].bar_ovul}</Text>
                </>)}
            </View>
            {pregnancy?null:(
            <LinearGradient colors={config.THEME[theme].submenu_button_color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{width: width-40, borderRadius: 10, marginTop: 20}}>
                <TouchableOpacity style={{width: width-40, height: 40, justifyContent: 'center', alignItems:'center', borderRadius: 10}} 
                    onPress={()=> addPeriod()}>
                    <Text style={{color: '#fff', fontSize: 16}}>{config.Labels[language].bar_add_p}</Text>
                </TouchableOpacity>
            </LinearGradient>
            )}

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

            <View style={{width: '100%', marginTop: 20}}>
                <View style={{flexDirection: 'row'}}>
                    <LinearGradient colors={periodTab=="past"?config.THEME[theme].menu_button_color: ["#e0d9d9","#e0d9d9"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                        style={{height: 45, width: '50%', justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity  
                            onPress={()=> setPeriodTab("past")}>
                            <Text style={{color: '#fff', fontSize: 16}}>{config.Labels[language].bar_past}</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient colors={periodTab=="prediction"?config.THEME[theme].menu_button_color: ["#e0d9d9","#e0d9d9"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                        style={{height: 45, width: '50%', justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity  
                            onPress={()=> setPeriodTab("prediction")}>
                            <Text style={{color: '#fff', fontSize: 16}}>{config.Labels[language].bar_pred}</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
                {periodTab=="past"?(
                    <View style={{marginTop: 10, alignItems: 'center'}}>
                        <Text style={{width: width-60, marginBottom: 5, fontSize: 10, color: '#FF6666'}}>{firstPeriod} - {lastPeriod}</Text>
                        {commonBar.length!=0?(
                            <TouchableOpacity style={{flexDirection: 'row', 
                                width: width-60, height: 13, 
                                borderColor: '#d3cfcb', alignSelf: 'center',
                                borderWidth: 1, backgroundColor: '#d3cfcb',
                                borderRadius: 10, marginBottom: 20}}>
                        
                                {commonBar}
                            </TouchableOpacity>
                        ):null}
                    </View>
                ):(
                    <View style={{width: '100%', height: 200}}>
                        
                            {pregnancy?null: (
                                predictionArray.map((value, key) => {
                                return (
                                    <View key={key} style={{marginTop: 5, alignItems: 'center'}}>
                                        <Text style={{width: width-60,fontSize: 10, color: '#FF6666'}}>{value}</Text>
                                        <TouchableOpacity style={{flexDirection: 'row', 
                                            width: width-60, height: 13, 
                                            borderColor: '#d3cfcb', alignSelf: 'center',
                                            borderWidth: 1, backgroundColor: '#d3cfcb',
                                            borderRadius: 10, marginBottom: 10}}>
                                    
                                            {commonBar}
                                        </TouchableOpacity>
                                    </View>
                                )
                            }))} 
                        
                        </View>
                   
                )}
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
    back: {backgroundColor: '#FF6666', height: '100%', width: cellWidth+0.1,},
    back1: {backgroundColor: '#d3cfcb', height: '100%', width: cellWidth},
    back2: {backgroundColor: '#fab913', height: '100%', width: cellWidth},
    back3: {backgroundColor: '#822e0d', height: '100%', width: cellWidth},
    back_first: {backgroundColor: '#FF6666', height: '100%', width: cellWidth+0.1, borderTopLeftRadius: 5, borderBottomLeftRadius: 5},
    back1_first: {backgroundColor: '#d3cfcb', height: '100%', width: cellWidth+0.1, borderTopRightRadius: 5, borderBottomRightRadius: 5},
    tab_active: {backgroundColor: '#fab913', height: 50, width: '50%', justifyContent: 'center', alignItems: 'center'},
    tab_inactive: {backgroundColor: '#e0d9d9', height: 50, width: '50%', justifyContent: 'center', alignItems: 'center'},
    
    back_common: {backgroundColor: '#FF6666', height: '100%', width: cellWidthCommon+0.1,},
    back1_common: {backgroundColor: '#d3cfcb', height: '100%', width: cellWidthCommon},
    back_first_common: {backgroundColor: '#FF6666', height: '100%', width: cellWidthCommon+0.1, borderTopLeftRadius: 5, borderBottomLeftRadius: 5},

});