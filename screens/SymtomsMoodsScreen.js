import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { TestIds, BannerAd, BannerAdSize, InterstitialAd, AdEventType} from '@react-native-firebase/admob';
import config from '../settings/config'

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

export default function SymtomsMoodsScreen({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const language = useSelector(state => state.language);
  

  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>
        <View style={{flex:1, margin: 10, }}>
            <TouchableOpacity style={{padding: 10, borderBottomColor: '#d1c8c8', borderBottomWidth:1}} 
                onPress={()=> navigation.navigate("symptom")}>
                <Text style={{fontSize: 18}}>{config.Labels[language].symp}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{padding: 10}} onPress={()=> navigation.navigate("mood")}>
                <Text style={{fontSize: 18}}>{config.Labels[language].mood}</Text>
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
}

const styles= StyleSheet.create({
    
});