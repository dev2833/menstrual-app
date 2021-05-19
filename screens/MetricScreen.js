import React, {useRef, useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-native-modal';
import RadioForm from 'react-native-simple-radio-button';
import { TestIds, BannerAd, BannerAdSize, InterstitialAd, AdEventType} from '@react-native-firebase/admob';
import AsyncStorage from '@react-native-community/async-storage';
import config from '../settings/config'

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;


export default function MetricScreen({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const users = useSelector(state => state.users);
  const language = useSelector(state => state.language);
  const currentUser = useSelector(state => state.currentUser);
  const heightArray = ["cm", "m", "inch", "ft.+.in"]

  const[metricModal, setMetricModal] = useState(false)
  const[weightIndex, setWeightindex] = useState(users[currentUser].weight=="lb"?0:1)
  const[weight, setWeight] = useState(users[currentUser].weight)
  const[heightIndex, setHeightindex] = useState(heightArray.indexOf(users[currentUser].height))
  const[height, setHeight] = useState(users[currentUser].height)
  const[bodyIndex, setBodyindex] = useState(users[currentUser].body=="C"?0:1)
  const[body, setBody] = useState(users[currentUser].body)

  const[weightShow, setWeightShow] = useState(false)
  const[heightShow, setHeightShow] = useState(false)
  const[bodyShow, setBodyShow] = useState(false)


  var weight_props = [
    {label: "lb", value: 'lb' },
    {label: "kg", value: 'kg' }
  ];
    
  var height_props = [
    {label: "cm", value: 'cm' },
    {label: "m", value: 'm' },
    {label: "inch", value: 'inch' },
    {label: "ft.+.in", value: 'ft.+.in' }
  ];

  var body_props = [
    {label: "°C", value: 'C' },
    {label: "°F", value: 'F' }
  ];

  async function setData(from, data){
    if(from=="weight"){
        setWeight(data)
        setWeightindex(data=="lb"?0:1)
        users[currentUser].weight = data;
    }else if(from=="height"){
        setHeight(data)
        setHeightindex(heightArray.indexOf(data))
        users[currentUser].height = data;
    }else if(from=="body"){
        setBody(data)
        setBodyindex(data=="C"?0:1)
        users[currentUser].body = data;
    }

    dispatch({ type: 'SET_USER', data: users });
    await AsyncStorage.setItem("users", JSON.stringify(users));
    setMetricModal(false)
  }

  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>
        <Modal isVisible={metricModal} style={{alignItems: 'center'}} 
            onBackdropPress={()=> setMetricModal(false)} 
            onBackButtonPress={()=> setMetricModal(false)}>
          <View style={styles.modalContent}>
              {weightShow?(
                <View style={{padding: 5}}>
                    <Text style={{paddingBottom: 10, fontSize: 18}}>{config.Labels[language].met_weight_unit}</Text>
                    <RadioForm
                        style={{}}
                        radio_props={weight_props}
                        initial={weightIndex}
                        animation={true}
                        labelStyle={{fontSize: 15, color: '#0057b5', marginRight: 3,}}
                        onPress={(value) => {
                            setData("weight", value)
                        }}
                        />
                </View>
             ):(null)}

            {heightShow?(
             <View style={{padding: 5}}>
                 <Text style={{paddingBottom: 10, fontSize: 18}}>{config.Labels[language].met_height_unit}</Text>
                 <RadioForm
                    style={{}}
                    radio_props={height_props}
                    initial={heightIndex}
                    animation={true}
                    labelStyle={{fontSize: 15, color: '#0057b5', marginRight: 3,}}
                    onPress={(value) => {
                        setData("height", value)
                    }}
                    />
             </View>
             ):(null)}

            {bodyShow?(
             <View style={{padding: 5}}>
                 <Text style={{paddingBottom: 10, fontSize: 18}}>{config.Labels[language].met_temp_unit}</Text>
                 <RadioForm
                    style={{}}
                    radio_props={body_props}
                    initial={bodyIndex}
                    animation={true}
                    labelStyle={{fontSize: 15, color: '#0057b5', marginRight: 3,}}
                    onPress={(value) => {
                        setData("body", value)
                    }}
                    />
             </View>
             ):(null)}
          </View>
        </Modal>
        <View style={{flex:1, margin: 10, }}>
            <TouchableOpacity style={{padding: 10, borderBottomColor: '#d1c8c8', borderBottomWidth:1}} 
                onPress={()=> clickElement("weight")}>
                <Text style={{fontSize: 18}}>{config.Labels[language].met_weight_unit}</Text>
                <Text>{weight}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{padding: 10, borderBottomColor: '#d1c8c8', borderBottomWidth:1}} 
                onPress={()=> clickElement("height")}>
                <Text style={{fontSize: 18}}>{config.Labels[language].met_height_unit}</Text>
                <Text>{height}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{padding: 10, borderBottomColor: '#d1c8c8', borderBottomWidth:1}} 
                onPress={()=> clickElement("body")}>
                <Text style={{fontSize: 18}}>{config.Labels[language].met_temp_unit}</Text>
                <Text>{body}</Text>
            </TouchableOpacity>
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

  function clickElement(val){
    setWeightShow(false);
    setHeightShow(false);
    setBodyShow(false);

    if(val=="weight")
        setWeightShow(true);
    else if(val=="height")
        setHeightShow(true);
    else
        setBodyShow(true)
    
    setMetricModal(true)
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