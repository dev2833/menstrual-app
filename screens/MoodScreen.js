import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import CheckBox from '@react-native-community/checkbox';
import { TestIds, BannerAd, BannerAdSize} from '@react-native-firebase/admob';
import AsyncStorage from '@react-native-community/async-storage';
import config from '../settings/config'

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

export default function MoodScreen({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const users = useSelector(state => state.users);
  const currentUser = useSelector(state => state.currentUser);
  const language = useSelector(state => state.language);

  const moods = users[currentUser].moods;

  const[assertive, setAssetive] = useState(moods.hasOwnProperty("assertive")?moods['assertive']:true)
  const[bashful, setBashful] = useState(moods.hasOwnProperty("bashful")?moods['bashful']:true)
  const[angelic, setAngelic] = useState(moods.hasOwnProperty("angelic")?moods['angelic']:true)
  const[angry, setAngry] = useState(moods.hasOwnProperty("angry")?moods['angry']:true)
  const[anxious, setAnxious] = useState(moods.hasOwnProperty("anxious")?moods['anxious']:true)
  const[ashamed, setAshamed] = useState(moods.hasOwnProperty("ashamed")?moods['ashamed']:true)
  const[blue, setBlue] = useState(moods.hasOwnProperty("blue")?moods['blue']:true)
  const[bored, setBored] = useState(moods.hasOwnProperty("bored")?moods['bored']:true)
  const[confident, setConfident] = useState(moods.hasOwnProperty("confident")?moods['confident']:true)

  async function setMoods(){
    dispatch({ type: 'SET_USER', data: users });
    await AsyncStorage.setItem("users", JSON.stringify(users));
  }
    
  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>
        <View style={{flex:1, margin: 10, }}>
            <TouchableOpacity style={{flexDirection: 'row', width: '100%',borderBottomColor: '#d1c8c8', borderBottomWidth:1, paddingBottom: 10}}>
                <Text style={{width: '70%', fontWeight: 'bold'}}>{config.Labels[language].mood_name}</Text>
                <Text style={{width: '30%', textAlign: 'right', fontWeight: 'bold'}}>{config.Labels[language].mood_sh}</Text>
            </TouchableOpacity>
                <TouchableOpacity style={styles.itemView}>
                    <View style={styles.itemView1}>
                        <Image source={require('../assets/moods/assertive.jpg')} 
                            style={{width:30, 
                                    height: 30, 
                                    resizeMode:'stretch', marginRight: 10}}/>
                        <Text style={{}}>Assertive</Text>
                    </View>
                    <View style={styles.checkboxView}>
                        <CheckBox
                                disabled={false}
                                value={assertive}
                                tintColor={'#0057b5'}
                                onCheckColor={'#0057b5'}
                                onFillColor={'#0057b5'}
                                onTintColor={'#0057b5'}
                                onValueChange={(newValue) => {
                                    setAssetive(newValue)
                                    users[currentUser].moods['assertive'] = newValue;
                                    setMoods()
                                }}
                            />
                    </View>    
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemView}>
                    <View style={styles.itemView1}>
                        <Image source={require('../assets/moods/bashful.jpg')} 
                            style={{width:30, 
                                    height: 30, 
                                    resizeMode:'stretch', marginRight: 10}}/>
                        <Text style={{}}>Bashful</Text>
                    </View>
                    <View style={styles.checkboxView}>
                        <CheckBox
                                disabled={false}
                                value={bashful}
                                tintColor={'#0057b5'}
                                onCheckColor={'#0057b5'}
                                onFillColor={'#0057b5'}
                                onTintColor={'#0057b5'}
                                onValueChange={(newValue) => {
                                    setBashful(newValue)
                                    users[currentUser].moods['bashful'] = newValue;
                                    setMoods()
                                }}
                            />
                    </View>    
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemView}>
                    <View style={styles.itemView1}>
                        <Image source={require('../assets/moods/angelic.jpg')} 
                            style={{width:30, 
                                    height: 30, 
                                    resizeMode:'stretch', marginRight: 10}}/>
                        <Text style={{}}>Angelic</Text>
                    </View>
                    <View style={styles.checkboxView}>
                        <CheckBox
                                disabled={false}
                                value={angelic}
                                tintColor={'#0057b5'}
                                onCheckColor={'#0057b5'}
                                onFillColor={'#0057b5'}
                                onTintColor={'#0057b5'}
                                onValueChange={(newValue) => {
                                    setAngelic(newValue)
                                    users[currentUser].moods['angelic'] = newValue;
                                    setMoods()
                                }}
                            />
                    </View>    
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemView}>
                    <View style={styles.itemView1}>
                        <Image source={require('../assets/moods/angry.jpg')} 
                            style={{width:30, 
                                    height: 30, 
                                    resizeMode:'stretch', marginRight: 10}}/>
                        <Text style={{}}>Angry</Text>
                    </View>
                    <View style={styles.checkboxView}>
                        <CheckBox
                                disabled={false}
                                value={angry}
                                tintColor={'#0057b5'}
                                onCheckColor={'#0057b5'}
                                onFillColor={'#0057b5'}
                                onTintColor={'#0057b5'}
                                onValueChange={(newValue) => {
                                    setAngry(newValue)
                                    users[currentUser].moods['angry'] = newValue;
                                    setMoods()
                                }}
                            />
                    </View>    
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemView}>
                    <View style={styles.itemView1}>
                        <Image source={require('../assets/moods/anxious.jpg')} 
                            style={{width:30, 
                                    height: 30, 
                                    resizeMode:'stretch', marginRight: 10}}/>
                        <Text style={{}}>Anxious</Text>
                    </View>
                    <View style={styles.checkboxView}>
                        <CheckBox
                                disabled={false}
                                value={anxious}
                                tintColor={'#0057b5'}
                                onCheckColor={'#0057b5'}
                                onFillColor={'#0057b5'}
                                onTintColor={'#0057b5'}
                                onValueChange={(newValue) => {
                                    setAnxious(newValue)
                                    users[currentUser].moods['anxious'] = newValue;
                                    setMoods()
                                }}
                            />
                    </View>    
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemView}>
                    <View style={styles.itemView1}>
                        <Image source={require('../assets/moods/ashamed.jpg')} 
                            style={{width:30, 
                                    height: 30, 
                                    resizeMode:'stretch', marginRight: 10}}/>
                        <Text style={{}}>Ashamed</Text>
                    </View>
                    <View style={styles.checkboxView}>
                        <CheckBox
                                disabled={false}
                                value={ashamed}
                                tintColor={'#0057b5'}
                                onCheckColor={'#0057b5'}
                                onFillColor={'#0057b5'}
                                onTintColor={'#0057b5'}
                                onValueChange={(newValue) => {
                                    setAshamed(newValue)
                                    users[currentUser].moods['ashamed'] = newValue;
                                    setMoods()
                                }}
                            />
                    </View>    
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemView}>
                    <View style={styles.itemView1}>
                        <Image source={require('../assets/moods/blue.jpg')} 
                            style={{width:30, 
                                    height: 30, 
                                    resizeMode:'stretch', marginRight: 10}}/>
                        <Text style={{}}>Blue</Text>
                    </View>
                    <View style={styles.checkboxView}>
                        <CheckBox
                                disabled={false}
                                value={blue}
                                tintColor={'#0057b5'}
                                onCheckColor={'#0057b5'}
                                onFillColor={'#0057b5'}
                                onTintColor={'#0057b5'}
                                onValueChange={(newValue) => {
                                    setBlue(newValue)
                                    users[currentUser].moods['blue'] = newValue;
                                    setMoods()
                                }}
                            />
                    </View>    
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemView}>
                    <View style={styles.itemView1}>
                        <Image source={require('../assets/moods/bored.jpg')} 
                            style={{width:30, 
                                    height: 30, 
                                    resizeMode:'stretch', marginRight: 10}}/>
                        <Text style={{}}>Bored</Text>
                    </View>
                    <View style={styles.checkboxView}>
                        <CheckBox
                                disabled={false}
                                value={bored}
                                tintColor={'#0057b5'}
                                onCheckColor={'#0057b5'}
                                onFillColor={'#0057b5'}
                                onTintColor={'#0057b5'}
                                onValueChange={(newValue) => {
                                    setBored(newValue)
                                    users[currentUser].moods['bored'] = newValue;
                                    setMoods()
                                }}
                            />
                    </View>    
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemView}>
                    <View style={styles.itemView1}>
                        <Image source={require('../assets/moods/confident.jpg')} 
                            style={{width:30, 
                                    height: 30, 
                                    resizeMode:'stretch', marginRight: 10}}/>
                        <Text style={{}}>Confident</Text>
                    </View>
                    <View style={styles.checkboxView}>
                        <CheckBox
                                disabled={false}
                                value={confident}
                                tintColor={'#0057b5'}
                                onCheckColor={'#0057b5'}
                                onFillColor={'#0057b5'}
                                onTintColor={'#0057b5'}
                                onValueChange={(newValue) => {
                                    setConfident(newValue)
                                    users[currentUser].moods['confident'] = newValue;
                                    setMoods()
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