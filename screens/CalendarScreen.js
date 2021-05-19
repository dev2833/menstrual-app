import React, {useRef, useState} from 'react';
import { View, Text, ScrollView} from 'react-native';
import {Calendar} from 'react-native-calendars';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment-timezone'
import { TestIds, BannerAd, BannerAdSize, InterstitialAd, AdEventType} from '@react-native-firebase/admob';
import config from '../settings/config'


export default function CalendarScreen({navigation}) {
    const users = useSelector(state => state.users);
    const currentUsername = useSelector(state => state.currentUser);
    const theme = useSelector(state => state.theme);
    const [bloodDays, setBloodDays] = useState({})
    const[dateClicked, setDateClicked] = useState("")
    const[dateMessage, setDateMessage] = useState("")
    const[prdStart, setPrdStart] = useState(null)

    const[noteObj, setNoteObj] = useState({})

    React.useEffect(() => {
        setInitial(); 
    }, []);

    function setInitial(){
        const currentUser = users[currentUsername];
        const cycle = parseInt(currentUser.cycleLength);
        const luteal = parseInt(currentUser.luteal);
        console.log(currentUser.startDate)
        setPrdStart(currentUser.startDate)
        var start = currentUser.startDate;
        for(var i=0; i<13; i++){
            const nextMonth = moment(currentUser.startDate).add(i*cycle, 'days');
      
            start = new Date(nextMonth);
            const end   = new Date();
            const differnceD = moment(end).diff(start, 'days')
            if(differnceD<=cycle){
              setPrdStart(start)
              break;
            }
          }

        console.log("FIrst date before--", start)
        const firstDay = moment(start).format('yyyy-MM-DD');
        bloodDays[firstDay] = {startingDay: true, color: '#f082ac', textColor: 'white'};
        for(var i=1; i<parseInt(currentUser.periodLength); i++){
            const next = moment(firstDay).add(i, 'days');
            const fomratNext = moment(next).format('yyyy-MM-DD');

            if(i==parseInt(currentUser.periodLength)-1){
                bloodDays[fomratNext] = {endingDay: true, color: '#f082ac', textColor: 'white'};
            }else{
                bloodDays[fomratNext] = {color: '#f082ac', textColor: 'white'};
            }
        }
        setBloodDays(JSON.parse(JSON.stringify(bloodDays)))
        var fertDiff = cycle-parseInt(luteal)-5;
        
        // if(cycle>28){
        //     fertDiff = fertDiff + cycle-28;
        // }else if (cycle<28){
        //     fertDiff = fertDiff - (28-cycle);
        // }
        console.log("firstDay--",firstDay)
        console.log("fertDiff--",fertDiff)
        const fertDate = moment(firstDay).add(fertDiff, 'days');
        const fertDateFrmt = moment(fertDate).format('yyyy-MM-DD');
        for(var i=0; i<7; i++){
            const next = moment(fertDateFrmt).add(i, 'days'); 
            const fomratNext = moment(next).format('yyyy-MM-DD');
            bloodDays[fomratNext] = {marked: true, dotColor: 'red',iconPath: i==5?'ovulation':'fertile'};
        } 

        setBloodDays(JSON.parse(JSON.stringify(bloodDays)))
    }

    function dayClick(day){
        const currentUser = users[currentUsername];
        const prd = parseInt(currentUser.periodLength)
        const cycle = parseInt(currentUser.cycleLength)
        const luteal = parseInt(currentUser.luteal)
        const dt = moment(new Date(prdStart)).format('yyyy-MM-DD')
        const fomattedDt = moment(new Date(day.dateString)).format('Do MMM yyyy')
        setDateClicked(fomattedDt);
        const difference = moment(day.dateString).diff(dt, 'days')

        var fertDiff = cycle-parseInt(luteal)-5;;
        
        setDateMessage("")
        if(difference>=0 && difference<prd){
            // No messsage as period days
            setDateMessage("")
        }else if (difference>=prd && difference<fertDiff){
            setDateMessage("LOW - Chance of getting pregnant")
        }else if (difference>=fertDiff && difference<fertDiff+3){
            setDateMessage("Fertility window, MEDIUM - Chance of getting pregnant")
        }else if (difference>=fertDiff+3 && difference<fertDiff+5){
            setDateMessage("Fertility window, HIGH - Chance of getting pregnant")
        }else if (difference>=fertDiff+5 && difference<fertDiff+6){
            setDateMessage("Ovulation Day, HIGH - Chance of getting pregnant")
        }else if (difference>=fertDiff+6 && difference<fertDiff+7){
            setDateMessage("Fertility window, MEDIUM - Chance of getting pregnant")
        }else if(difference>=fertDiff+7 && difference<fertDiff+10){
            setDateMessage("MEDIUM - Chance of getting pregnant")
        }else if(difference>=fertDiff+10 && difference<cycle){
            setDateMessage("LOW - Chance of getting pregnant")
        }

        const noteArray = users[currentUsername].noteArray
        console.log(noteArray)
        
        
        if(noteArray.hasOwnProperty(day.dateString)){
            console.log(noteArray[day.dateString])
            setNoteObj(noteArray[day.dateString])
        }else{
            console.log("No note found...")
            setNoteObj({})
        }
    }

    function monthChange(month){
        const currentUser = users[currentUsername];
        const prd = parseInt(currentUser.periodLength)
        const cycle = parseInt(currentUser.cycleLength)
        const dt = moment(new Date(prdStart)).format('yyyy-MM-DD')

        const start = new Date(dt);
        const end   = new Date(month.dateString);
        const differnce = moment(end).diff(start, 'months')
        if(differnce>0){
            const nextMonthStart = moment(dt).add(cycle * differnce, 'days').format('yyyy-MM-DD');
            console.log(nextMonthStart)
            bloodDays[nextMonthStart] = {startingDay: true, color: '#f7adc8', textColor: 'white'};
            for(var i=1; i<prd; i++){
                const next = moment(nextMonthStart).add(i, 'days');
                const fomratNext = moment(next).format('yyyy-MM-DD');

                if(i==prd-1){
                    bloodDays[fomratNext] = {endingDay: true, color: '#f7adc8', textColor: 'white'};
                }else{
                    bloodDays[fomratNext] = {color: '#f7adc8', textColor: 'white'};
                }
            }
            setBloodDays(JSON.parse(JSON.stringify(bloodDays)))
        }
    }

    return (
        <>
        <View style={{flex:1, marginTop: 0, backgroundColor: config.THEME[theme].calendar_back}}>
            <Calendar
                // Initially visible month. Default = Date()
                current={new Date()}
                // Handler which gets executed on day press. Default = undefined
                onDayPress={(day) => {console.log('selected day', day)}}
                theme={{
                    calendarBackground: '#fff',
                    todayTextColor: '#1156E9',
                    arrowColor: '#1156E9',
                }}
                enableSwipeMonths={true}
                markingType={'period-icon'}
                markedDates={bloodDays}
                onDayPress={(day) => {dayClick(day)}}
                onMonthChange={(month) => {monthChange(month)}}
                refreshing={true}
                style={{marginBottom: 10}}
            />

            <View style={{marginTop: 0, flexDirection: 'row', marginLeft: 10}}>
                <Text>{dateClicked}</Text>
            </View>
            <View style={{marginTop: 5, flexDirection: 'row', marginLeft: 10}}>
                <Text>{dateMessage}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{marginLeft: 10}}>
                    {
                        Object.keys(noteObj).map(function(key) {
                            return (
                                <View style={{flexDirection: 'row', width: 300, marginRight: 10}}>
                                    <Text>{key} - </Text>
                                    {key=="intercourse"?(
                                        <Text >Condum use({noteObj[key].condom_use}), Orgasm({noteObj[key].orgasm}), No Of times({noteObj[key].nooftimes})</Text>
                                    ):(
                                        key=="symptoms"?(
                                            <Text>{noteObj[key].flow}</Text>
                                        ):(
                                            <Text>{noteObj[key]}</Text>
                                        )
                                    )}
                                    
                                </View>
                            )
                        })
                    }
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
        </>
    )
}
