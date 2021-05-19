import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { TestIds, BannerAd, BannerAdSize, InterstitialAd, AdEventType} from '@react-native-firebase/admob';
import config from '../settings/config'

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;


export default function ThemeScreen({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const language = useSelector(state => state.language);
  

  async function changeTheme(theme){
    dispatch({ type: 'CHANGE_THEME', data: theme });
    await AsyncStorage.setItem("themme", theme);
  }
    
  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>
        <View style={{flex:1, margin: 10, flexDirection: 'row', }}>
            <TouchableOpacity style={{alignItems: 'center', width: width/2, height: height/2-50}} onPress={()=> changeTheme("blue_dark")}>
                <ImageBackground source={require('../assets/theme_blue.png')} 
                    style={{width:width/2-30, 
                            height: height/2-120, 
                            resizeMode:'stretch', 
                            borderRadius: 30}}>
                    {theme=="blue_dark"?(<Image source={require('../assets/check.png')} 
                        style={{width:30, 
                                height: 30, 
                                resizeMode:'stretch',}}/>):null}
                </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity style={{alignItems: 'center', width: width/2, height: height/2-50}} onPress={()=> changeTheme("orange_dark")}>
                <ImageBackground source={require('../assets/theme_orange.png')} 
                    style={{width:width/2-30, 
                            height: height/2-120, 
                            resizeMode:'stretch', 
                            borderRadius: 30, marginRight: 10}} >
                    {theme=="orange_dark"?(<Image source={require('../assets/check.png')} 
                        style={{width:30, 
                                height: 30, 
                                resizeMode:'stretch',}}/>):null}
                </ImageBackground>
            </TouchableOpacity>
        </View>
        {/* <View style={{flex:0.5, margin: 10, flexDirection: 'row', }}>
            <TouchableOpacity style={{alignItems: 'center', width: width/2, height: height/2-50}} onPress={()=> changeTheme("gray")}>
                <ImageBackground source={require('../assets/theme_gray.jpg')} 
                    style={{width:width/2-30, 
                            height: height/2-120, 
                            resizeMode:'stretch', 
                            borderRadius: 30}}>
                    {theme=="gray"?(<Image source={require('../assets/check.png')} 
                        style={{width:30, 
                                height: 30, 
                                resizeMode:'stretch',}}/>):null}
                </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity style={{alignItems: 'center', width: width/2, height: height/2-50}} onPress={()=> changeTheme("black")}>
                <ImageBackground source={require('../assets/theme_black.jpg')} 
                    style={{width:width/2-30, 
                            height: height/2-120, 
                            resizeMode:'stretch', 
                            borderRadius: 30, marginRight: 10}} >
                    {theme=="black"?(<Image source={require('../assets/check.png')} 
                        style={{width:30, 
                                height: 30, 
                                resizeMode:'stretch',}}/>):null}
                </ImageBackground>
            </TouchableOpacity>
        </View> */}
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