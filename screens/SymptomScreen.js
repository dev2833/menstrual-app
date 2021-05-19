import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import CheckBox from '@react-native-community/checkbox';
import { TestIds, BannerAd, BannerAdSize} from '@react-native-firebase/admob';
import AsyncStorage from '@react-native-community/async-storage';
import config from '../settings/config'

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

export default function SymptomScreen({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const language = useSelector(state => state.language);
  const users = useSelector(state => state.users);
  const currentUser = useSelector(state => state.currentUser);
  const symptoms = users[currentUser].symptoms;

  const[headache, setHeadache] = useState(symptoms.hasOwnProperty("headache")?symptoms['headache']:true)
  const[migraines, setMigraines] = useState(symptoms.hasOwnProperty("migraines")?symptoms['migraines']:true)
  const[dizziness, setDizziness] = useState(symptoms.hasOwnProperty("dizziness")?symptoms['dizziness']:true)
  const[acne, setAcne] = useState(symptoms.hasOwnProperty("acne")?symptoms['acne']:true)
  const[hecticFever, setHecticFever] = useState(symptoms.hasOwnProperty("hecticFever")?symptoms['hecticFever']:true)
  const[neckAches, setNeckAches] = useState(symptoms.hasOwnProperty("neckAches")?symptoms['neckAches']:true)
  const[shoulderAches, setShoulderAches] = useState(symptoms.hasOwnProperty("shoulderAches")?symptoms['shoulderAches']:true)
  const[tenderBreasts, setTenderBreasts] = useState(symptoms.hasOwnProperty("tenderBreasts")?symptoms['tenderBreasts']:true)
  const[breastSens, setBreastSens] = useState(symptoms.hasOwnProperty("breastSens")?symptoms['breastSens']:true)

    async function setSymptoms(){
        dispatch({ type: 'SET_USER', data: users });
        await AsyncStorage.setItem("users", JSON.stringify(users));
    }
    
  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>
        <View style={{flex:1, margin: 10, }}>
            <TouchableOpacity style={{flexDirection: 'row', width: '100%',borderBottomColor: '#d1c8c8', borderBottomWidth:1, paddingBottom: 10}}>
                <Text style={{width: '70%', fontWeight: 'bold'}}>{config.Labels[language].symp_name}</Text>
                <Text style={{width: '30%', textAlign: 'right', fontWeight: 'bold'}}>{config.Labels[language].mood_sh}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.itemView}>
                <View style={styles.itemView1}>
                    <Image source={require('../assets/symptoms/headache.jpg')} 
                        style={{width:30, 
                                height: 30, 
                                resizeMode:'stretch', marginRight: 10}}/>
                    <Text style={{}}>Headache</Text>
                </View>
                <View style={styles.checkboxView}>
                    <CheckBox
                            disabled={false}
                            value={headache}
                            tintColor={'#0057b5'}
                            onCheckColor={'#0057b5'}
                            onFillColor={'#0057b5'}
                            onTintColor={'#0057b5'}
                            onValueChange={(newValue) => {
                                setHeadache(newValue)
                                users[currentUser].symptoms['headache'] = newValue;
                                setSymptoms()
                            }}
                        />
                </View>    
            </TouchableOpacity>

            <TouchableOpacity style={styles.itemView}>
                <View style={styles.itemView1}>
                    <Image source={require('../assets/symptoms/migrane.png')} 
                        style={{width:30, 
                                height: 30, 
                                resizeMode:'stretch', marginRight: 10}}/>
                    <Text style={{}}>Migraines</Text>
                </View>
                <View style={styles.checkboxView}>
                    <CheckBox
                            disabled={false}
                            value={migraines}
                            tintColor={'#0057b5'}
                            onCheckColor={'#0057b5'}
                            onFillColor={'#0057b5'}
                            onTintColor={'#0057b5'}
                            onValueChange={(newValue) => {
                                setMigraines(newValue)
                                users[currentUser].symptoms['migraines'] = newValue;
                                setSymptoms()
                            }}
                        />
                </View>    
            </TouchableOpacity>

            <TouchableOpacity style={styles.itemView}>
                <View style={styles.itemView1}>
                    <Image source={require('../assets/symptoms/dizziness1.png')} 
                        style={{width:30, 
                                height: 30, 
                                resizeMode:'stretch', marginRight: 10}}/>
                    <Text style={{}}>Dizziness</Text>
                </View>
                <View style={styles.checkboxView}>
                    <CheckBox
                            disabled={false}
                            value={dizziness}
                            tintColor={'#0057b5'}
                            onCheckColor={'#0057b5'}
                            onFillColor={'#0057b5'}
                            onTintColor={'#0057b5'}
                            onValueChange={(newValue) => {
                                setDizziness(newValue)
                                users[currentUser].symptoms['dizziness'] = newValue;
                                setSymptoms()
                            }}
                        />
                </View>    
            </TouchableOpacity>

            <TouchableOpacity style={styles.itemView}>
                <View style={styles.itemView1}>
                    <Image source={require('../assets/symptoms/acne.png')} 
                        style={{width:30, 
                                height: 30, 
                                resizeMode:'stretch', marginRight: 10}}/>
                    <Text style={{}}>Acne</Text>
                </View>
                <View style={styles.checkboxView}>
                    <CheckBox
                            disabled={false}
                            value={acne}
                            tintColor={'#0057b5'}
                            onCheckColor={'#0057b5'}
                            onFillColor={'#0057b5'}
                            onTintColor={'#0057b5'}
                            onValueChange={(newValue) => {
                                setAcne(newValue)
                                users[currentUser].symptoms['acne'] = newValue;
                                setSymptoms()
                            }}
                        />
                </View>    
            </TouchableOpacity>

            <TouchableOpacity style={styles.itemView}>
                <View style={styles.itemView1}>
                    <Image source={require('../assets/symptoms/hacticfiver.jpg')} 
                        style={{width:30, 
                                height: 30, 
                                resizeMode:'stretch', marginRight: 10}}/>
                    <Text style={{}}>Hectic fever</Text>
                </View>
                <View style={styles.checkboxView}>
                    <CheckBox
                            disabled={false}
                            value={hecticFever}
                            tintColor={'#0057b5'}
                            onCheckColor={'#0057b5'}
                            onFillColor={'#0057b5'}
                            onTintColor={'#0057b5'}
                            onValueChange={(newValue) => {
                                setHecticFever(newValue)
                                users[currentUser].symptoms['hecticFever'] = newValue;
                                setSymptoms()
                            }}
                        />
                </View>    
            </TouchableOpacity>

            <TouchableOpacity style={styles.itemView}>
                <View style={styles.itemView1}>
                    <Image source={require('../assets/symptoms/neckache.png')} 
                        style={{width:30, 
                                height: 30, 
                                resizeMode:'stretch', marginRight: 10}}/>
                    <Text style={{}}>Neck aches</Text>
                </View>
                <View style={styles.checkboxView}>
                    <CheckBox
                            disabled={false}
                            value={neckAches}
                            tintColor={'#0057b5'}
                            onCheckColor={'#0057b5'}
                            onFillColor={'#0057b5'}
                            onTintColor={'#0057b5'}
                            onValueChange={(newValue) => {
                                setNeckAches(newValue)
                                users[currentUser].symptoms['neckAches'] = newValue;
                                setSymptoms()
                            }}
                        />
                </View>    
            </TouchableOpacity>

            <TouchableOpacity style={styles.itemView}>
                <View style={styles.itemView1}>
                    <Image source={require('../assets/symptoms/shoulderache.png')} 
                        style={{width:30, 
                                height: 30, 
                                resizeMode:'stretch', marginRight: 10}}/>
                    <Text style={{}}>Shoulder aches</Text>
                </View>
                <View style={styles.checkboxView}>
                    <CheckBox
                            disabled={false}
                            value={shoulderAches}
                            tintColor={'#0057b5'}
                            onCheckColor={'#0057b5'}
                            onFillColor={'#0057b5'}
                            onTintColor={'#0057b5'}
                            onValueChange={(newValue) => {
                                setShoulderAches(newValue)
                                users[currentUser].symptoms['shoulderAches'] = newValue;
                                setSymptoms()
                            }}
                        />
                </View>    
            </TouchableOpacity>

            <TouchableOpacity style={styles.itemView}>
                <View style={styles.itemView1}>
                    <Image source={require('../assets/symptoms/tenderbreast.png')} 
                        style={{width:30, 
                                height: 30, 
                                resizeMode:'stretch', marginRight: 10}}/>
                    <Text style={{}}>Tender Breasts</Text>
                </View>
                <View style={styles.checkboxView}>
                    <CheckBox
                            disabled={false}
                            value={tenderBreasts}
                            tintColor={'#0057b5'}
                            onCheckColor={'#0057b5'}
                            onFillColor={'#0057b5'}
                            onTintColor={'#0057b5'}
                            onValueChange={(newValue) => {
                                setTenderBreasts(newValue)
                                users[currentUser].symptoms['tenderBreasts'] = newValue;
                                setSymptoms()
                            }}
                        />
                </View>    
            </TouchableOpacity>

            <TouchableOpacity style={styles.itemView}>
                <View style={styles.itemView1}>
                    <Image source={require('../assets/symptoms/breast_sensitive.jpg')} 
                        style={{width:30, 
                                height: 30, 
                                resizeMode:'stretch', marginRight: 10}}/>
                    <Text style={{}}>Breast sensitivity</Text>
                </View>
                <View style={styles.checkboxView}>
                    <CheckBox
                            disabled={false}
                            value={breastSens}
                            tintColor={'#0057b5'}
                            onCheckColor={'#0057b5'}
                            onFillColor={'#0057b5'}
                            onTintColor={'#0057b5'}
                            onValueChange={(newValue) => {
                                setBreastSens(newValue)
                                users[currentUser].symptoms['breastSens'] = newValue;
                                setSymptoms()
                            }}
                        />
                </View>    
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
    itemView:{
        flexDirection: 'row', 
        width: '100%',
        padding: 10
    },
    itemView1:{
        flexDirection: 'row', 
        width: '70%', 
        alignItems: 'center'
    },
    checkboxView:{
        width: '30%', 
        alignItems: 'flex-end'
    }
});