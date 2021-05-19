import React, {useRef, useEffect, useState} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, Alert} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { TestIds, BannerAd, BannerAdSize, InterstitialAd, AdEventType} from '@react-native-firebase/admob';
import Modal from 'react-native-modal';
import config from '../settings/config'
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;


export default function AddUserScreen({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const language = useSelector(state => state.language);
  const [addmodal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editDeleteModal, setEditDeleteModal] = useState(false)
  
  const [name, setName] = useState("")
  const [editName, setEditName] = useState("")
  const users = useSelector(state => state.users);
  const currentUser = useSelector(state => state.currentUser);
  const [userList, setUserList] = useState(users)
  const dashboardRerender = useSelector(state => state.dashboardRerender);
  const [deleteRequired, setDeleteRequired] = useState(false)
  const [longPressUsername, setLongPressUsername] = useState("")

  async function addNewUser(){
      if(name==""){
          alert("Please enter the name!")
      }else{
        users[name] = {};    
        dispatch({ type: 'SET_USER', data: users });
        await AsyncStorage.setItem("users", JSON.stringify(users));
        dispatch({ type: 'CURRENT_USER', data: name });
        await AsyncStorage.setItem("currentUser", name);
        setUserList(users)
        dispatch({ type: 'DASHBOARD_RERENDER', data: !dashboardRerender });
        navigation.navigate("dashboard")
      }
      setAddModal(false)
  }

  async function switchUser(switchUsername){
    Alert.alert(
        'Tip',
        'Are you sure you want to switch to '+ switchUsername + " user's account",
        [
          {text: 'CANCEL', onPress: () => console.log('NO Pressed'), style: 'cancel'},
          {text: 'SWITCH', onPress: async () => {
            dispatch({ type: 'CURRENT_USER', data: switchUsername });
            await AsyncStorage.setItem("currentUser", switchUsername);
            dispatch({ type: 'DASHBOARD_RERENDER', data: !dashboardRerender });
            navigation.navigate("dashboard")
          }},
        ]
      );
    
  }

  function longPress(selectedUser){
    setLongPressUsername(selectedUser)
    if(selectedUser=="default" || selectedUser==currentUser){
        setDeleteRequired(false)
    }else{
        setDeleteRequired(true)
    }
    setEditDeleteModal(true)
  }

  async function editExistingUser(){
    if(editName==""){
        alert("Please enter the name!")
    }else{
        const userValue = users[longPressUsername];
        users[editName] = userValue;


        if(currentUser==longPressUsername){
            dispatch({ type: 'CURRENT_USER', data: editName });
            await AsyncStorage.setItem("currentUser", editName);
        }
        delete users[longPressUsername];

        dispatch({ type: 'SET_USER', data: users });
        await AsyncStorage.setItem("users", JSON.stringify(users));

        setUserList({})
        setUserList(users)
        setEditModal(false)
    }
  }

  function deleteUser(){
    Alert.alert(
        'Tip',
        'Are you sure you want to delete '+ longPressUsername + " user's account",
        [
          {text: 'CANCEL', onPress: () => console.log('NO Pressed'), style: 'cancel'},
          {text: 'DELETE', onPress: async () => {
            delete users[longPressUsername];

            dispatch({ type: 'SET_USER', data: users });
            await AsyncStorage.setItem("users", JSON.stringify(users));
            
            setUserList({})
            setUserList(users)
            setEditModal(false)
          }},
        ]
      );
  }
    
  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>
        <Modal isVisible={addmodal} style={{alignItems: 'center'}} 
        onBackdropPress={()=> setAddModal(false)} 
        onBackButtonPress={()=> setAddModal(false)}>
          <View style={styles.modalContent}>
             <Text style={{fontSize: 18, margin: 10, textAlign: 'center', fontWeight: 'bold' ,color: config.THEME[theme].period_text}}>{config.Labels[language].user_add}</Text>
             <View style={{flexDirection: 'column', width: '100%'}}>
                <TextInput 
                    value={name}
                    keyboardType={"default"}
                    onChangeText={(text) => setName(text)}  
                    style={{width: '100%', height: 50, backgroundColor: '#efe3d7', borderWidth: 1, borderColor: '#fff', textAlign: 'center', fontSize: 20}}/>
             </View>
             <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10}}>
                <Text style={{fontSize: 16, color: '#000', padding: 10}} onPress={()=> setAddModal()}>{config.Labels[language].user_cancel}</Text>
                <Text style={{fontSize: 16, color: '#000', padding: 10}} onPress={()=> addNewUser()}>{config.Labels[language].user_add_text}</Text>
             </View>
          </View>
      </Modal>

      <Modal isVisible={editModal} style={{alignItems: 'center'}} 
        onBackdropPress={()=> setEditModal(false)} 
        onBackButtonPress={()=> setEditModal(false)}>
          <View style={styles.modalContent}>
             <Text style={{fontSize: 18, margin: 10, textAlign: 'center', fontWeight: 'bold' ,color: config.THEME[theme].period_text}}>{config.Labels[language].user_add}</Text>
             <View style={{flexDirection: 'column', width: '100%'}}>
                <TextInput 
                    value={editName}
                    keyboardType={"default"}
                    onChangeText={(text) => setEditName(text)}  
                    style={{width: '100%', height: 50, backgroundColor: '#efe3d7', borderWidth: 1, borderColor: '#fff', textAlign: 'center', fontSize: 20}}/>
             </View>
             <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10}}>
                <Text style={{fontSize: 16, color: '#000', padding: 10}} onPress={()=> setEditModal()}>{config.Labels[language].user_cancel}</Text>
                <Text style={{fontSize: 16, color: '#000', padding: 10}} onPress={()=> editExistingUser()}>{config.Labels[language].user_update_btn}</Text>
             </View>
          </View>
      </Modal>

      <Modal isVisible={editDeleteModal} style={{alignItems: 'center'}} 
        onBackdropPress={()=> setEditDeleteModal(false)} 
        onBackButtonPress={()=> setEditDeleteModal(false)}>
          <View style={styles.modalContent}>
             <View style={{justifyContent: 'center', marginTop: 10}}>
                <Text style={{fontSize: 16, color: '#000', padding: 10}} onPress={()=> {
                    setEditName(longPressUsername)
                    setEditModal(true)
                    setEditDeleteModal(false)
                }}>{config.Labels[language].user_edit}</Text>
                {deleteRequired?(
                    <Text style={{fontSize: 16, color: '#000', padding: 10}} onPress={()=> {
                        setEditName(longPressUsername)
                        setEditDeleteModal(false)
                        deleteUser()
                    }}>{config.Labels[language].user_delete}</Text>
                ):null}
             </View>
          </View>
      </Modal>
      
        <View style={{flex:1, margin: 10, }}>
            <TouchableOpacity style={{padding: 10,  width: '100%'}} 
                onPress={()=> setAddModal(true)}>
                <View style={{flexDirection: 'row', width: '70%'}}>
                    <TouchableOpacity onPress={()=> setAddModal(true)}>
                        <Text style={{fontSize: 16, color: '#605e5e'}}>+ {config.Labels[language].user_add}</Text>
                        <Text style={{fontSize: 12,textAlign: 'left', color: '#898989'}}>{config.Labels[language].user_tap}</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>

            {Object.keys(userList).map(function(keyName, keyIndex) {
                return (
                    <TouchableOpacity key={keyIndex} style={{flexDirection: 'row',padding: 10, borderBottomColor: '#d1c8c8', borderBottomWidth:1, width: '100%'}} 
                        onPress={()=> switchUser(keyName)} 
                        onLongPress={()=> longPress(keyName)}>
                        <View style={{flexDirection: 'row', width: '80%'}}>
                            <Text style={{fontSize: 16, color: '#605e5e'}}>{keyName}</Text>
                        </View>
                        {currentUser==keyName?(
                            <FontAwesome name="check" size={25} color='#605e5e' style={{marginLeft: 10, width: '20%'}}/>
                        ):null}
                    </TouchableOpacity>
                )
            })}
            
            
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