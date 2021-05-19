import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { TestIds, BannerAd, BannerAdSize} from '@react-native-firebase/admob';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import moment from 'moment-timezone'
import LinearGradient from 'react-native-linear-gradient';
import config from '../settings/config'

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
var cellWidth = (width-40)/30;
var cellWidthCommon = (width-60)/30;

export default function OvulationComponent({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const users = useSelector(state => state.users);
  const language = useSelector(state => state.language);
  const currentUsername = useSelector(state => state.currentUser);
  const[periodLength, setPeriodLength] = useState("4")
  const[cycleLength, setCycleLength] = useState("28")
  const[commonBar, setCommonBar] = useState([])
  const[periodTab, setPeriodTab] = useState("past")
  const[pastFert, setPastFert] = useState([])
  const[predFert, setPredFert] = useState([])
  const [pregnancy, setPregnancy] = useState(false)  


  React.useEffect(() => {
    setInitial(); 
  }, []);

  function setInitial(){
    const currentUser = users[currentUsername];
    const cycle = parseInt(currentUser.cycleLength);
    const period = parseInt(currentUser.periodLength);
    const luteal = parseInt(currentUser.luteal);
    setPeriodLength(currentUser.periodLength)
    setCycleLength(currentUser.cycleLength)
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

    const fertDiff = cycle-parseInt(luteal)-5;
    commonPeriods(cycle, period);
    past(start, cycle, fertDiff)
    if(!currentUser.pregnancy)
        predict(start, cycle, fertDiff)
    
    // setPeriodMaker(periodMaker)
    // predictNext(start, cycle, period, firstDay, LastPeriod);
        
  }

  function commonPeriods(cycle, period){
    var cArry = []
    setCommonBar(cArry)
    for(let i = 0; i < cycle; i++){
        if(i>=0 && i<period){
            cArry.push(<View key={i} style={i==0 ? styles.back_first : styles.back}></View>);
        }else{
            cArry.push(<View key={i} style={styles.back1}></View>)
        }
    }
    setCommonBar(cArry)
  }

  function past(start, cycle, fertDiff){
    
    console.log(fertDiff)
    const fert = moment(start).add(fertDiff+5, 'days');

    const diffFromToday = moment(new Date()).diff(fert, 'days');
    console.log(fert)
    setPastFert([])
    if(diffFromToday>0){
        //past
        const firstDay = moment(fert).format('MMM Do');
        setPastFert([firstDay])
    }
  }

  function predict(start, cycle, fertDiff){

    console.log(fertDiff)
    const fert = moment(start).add(fertDiff+5, 'days');

    const diffFromToday = moment(new Date()).diff(fert, 'days');
    console.log(fert)
    if(diffFromToday<0){
        //past
        var predArry = []
        setPredFert(predArry)
        for (let index = 0; index < 6; index++) {
            const startfertMonth = moment(fert).add(index*cycle, 'days')
            const firstDay = moment(startfertMonth).format('MMM Do');
            //const LastPeriod = moment(startfertMonth).add(6, 'days').format('MMM Do');
            predArry.push(firstDay)
        }
        setPredFert(predArry)
    }else{
        var predArry = []
        setPredFert(predArry)
        for (let index = 1; index < 6; index++) {
            const startfertMonth = moment(fert).add(index*cycle, 'days')
            const firstDay = moment(startfertMonth).format('MMM Do');
            //const LastPeriod = moment(startfertMonth).add(6, 'days').format('MMM Do');
            predArry.push(firstDay)
        }
        setPredFert(predArry)
    }
  }
  

  return (
    <View style={{flex:1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
        <View style={{flex:1, width: width-40, marginTop: 30}}>
            
            <Text style={{marginBottom: 5, fontSize: 14, color: '#FF6666'}}>{periodLength} days, Average period length</Text>
            <TouchableOpacity style={{flexDirection: 'row', 
                width: width-40, height: 13, 
                borderColor: '#d3cfcb', 
                borderWidth: 1, backgroundColor: '#d3cfcb',
                borderRadius: 10, }}>
        
                {commonBar}
            </TouchableOpacity>
            <Text style={{marginBottom: 5, fontSize: 14, color: '#FF6666', textAlign: 'right'}}>{cycleLength} days, Average cycle length</Text>
            
            <View style={{width: '100%', marginTop: 20}}>
                <View style={{flexDirection: 'row'}}>
                    <LinearGradient colors={periodTab=="past"?config.THEME[theme].menu_button_color: ["#c9c1c1","#c9c1c1"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                        style={{height: 45, width: '50%', justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity  
                            onPress={()=> setPeriodTab("past")}>
                            <Text style={{color: '#fff', fontSize: 16}}>{config.Labels[language].bar_past}</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient colors={periodTab=="prediction"?config.THEME[theme].menu_button_color: ["#c9c1c1","#c9c1c1"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                        style={{height: 45, width: '50%', justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity  
                            onPress={()=> setPeriodTab("prediction")}>
                            <Text style={{color: '#fff', fontSize: 16}}>{config.Labels[language].bar_pred}</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
                {periodTab=="past"?(
                    <View style={{marginTop: 10, alignItems: 'center', backgroundColor: '#f9d6d6'}}>
                        <View style={{flexDirection: 'row', width: '100%' ,justifyContent: 'center', alignItems: 'center', height: 30, backgroundColor: '#f4b0b0'}}>
                            <View style={{width: '34%', alignItems: 'center', borderRightColor: '#f7c5c5', borderRightWidth:1}}>
                                <Text style={{fontSize: 14, color: '#002664'}}>{config.Labels[language].fertile_start}</Text>
                            </View>
                            <View style={{width: '34%', alignItems: 'center'}}>
                                <Text style={{fontSize: 14, color: '#002664'}}>{config.Labels[language].fertile_end}</Text>
                            </View>
                            <View style={{width: '32%', alignItems: 'center'}}>
                                <Text style={{fontSize: 14, color: '#002664'}}>Length</Text>
                            </View>
                        </View>
                        {pastFert.length>0?(
                            <View style={{flexDirection: 'row', width: '100%' ,justifyContent: 'center', alignItems: 'center', height: 30, backgroundColor: '#f7c5c5', borderColor: "#f4b0b0", borderWidth:1}}>
                                <View style={{width: '34%', alignItems: 'center'}}>
                                    <Text style={{fontSize: 14, color: '#002664'}}>{pastFert[0]}</Text>
                                </View>
                                <View style={{width: '34%', alignItems: 'center'}}>
                                    <Text style={{fontSize: 14, color: '#002664'}}>{pastFert[0]}</Text>
                                </View>
                                <View style={{width: '32%', alignItems: 'center'}}>
                                    <Text style={{fontSize: 14, color: '#002664'}}>1</Text>
                                </View>
                            </View>
                        ):null}
                    </View>
                ):(
                    <View style={{marginTop: 10, alignItems: 'center', backgroundColor: '#f9d6d6'}}>
                        <View style={{flexDirection: 'row', width: '100%' ,justifyContent: 'center', alignItems: 'center', height: 30, backgroundColor: '#f4b0b0'}}>
                            <View style={{width: '34%', alignItems: 'center', borderRightColor: '#f7c5c5', borderRightWidth:1}}>
                                <Text style={{fontSize: 14, color: '#002664'}}>{config.Labels[language].fertile_start}</Text>
                            </View>
                            <View style={{width: '34%', alignItems: 'center'}}>
                                <Text style={{fontSize: 14, color: '#002664'}}>{config.Labels[language].fertile_end}</Text>
                            </View>
                            <View style={{width: '32%', alignItems: 'center'}}>
                                <Text style={{fontSize: 14, color: '#002664'}}>Length</Text>
                            </View>
                        </View>
                        {predFert.map((value, key) => {
                            return (
                                <View key={key} style={{flexDirection: 'row', width: '100%' ,justifyContent: 'center', alignItems: 'center', height: 30, backgroundColor: '#f7c5c5', borderColor: "#f4b0b0", borderWidth:1}}>
                                    <View style={{width: '34%', alignItems: 'center'}}>
                                        <Text style={{fontSize: 14, color: '#002664'}}>{value}</Text>
                                    </View>
                                    <View style={{width: '34%', alignItems: 'center'}}>
                                        <Text style={{fontSize: 14, color: '#002664'}}>{value}</Text>
                                    </View>
                                    <View style={{width: '32%', alignItems: 'center'}}>
                                        <Text style={{fontSize: 14, color: '#002664'}}>1</Text>
                                    </View>
                                </View>
                             )
                        })} 
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