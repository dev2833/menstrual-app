import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

export default function SplashScreen({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const [spinnerEnabled, setSpinnerEnabled] = useState(false);

  React.useEffect(() => {  
    const bootstrapAsync = async () => {
        try {
          const storedTheme = await AsyncStorage.getItem("themme");
          if(storedTheme!=null && storedTheme!="undefined"){
            dispatch({ type: 'CHANGE_THEME', data: storedTheme });
          }

          const storedLanguage = await AsyncStorage.getItem("language");
          console.log("storedLanguage-", storedLanguage)
          if(storedLanguage!=null && storedLanguage!="undefined"){
            dispatch({ type: 'CHANGE_LANG', data: storedLanguage });
            dispatch({ type: 'LANG_INDEX', data: storedLanguage==="en"?0:1 });
          }

          var isPasswordSet = await AsyncStorage.getItem("isPasswordSet");
          if(isPasswordSet!=null && isPasswordSet!="undefined" && isPasswordSet=="true"){
            dispatch({ type: 'SHOW_PASS_LOCK', data: true });
          }
          navigation.navigate("dashboard")
          
        } catch (e) {
          console.log(e)
        }
    };
    bootstrapAsync();
  }, []);
    
  return (
    <View style={{flex:1, backgroundColor: '#fff'}}>
        <Spinner
            visible={spinnerEnabled}
            textContent={'Loading...'}
            textStyle={{color: '#000'}}
        />
        <View style={{flex:1, margin: 10, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('../assets/profile.png')} 
                    style={styles.profile}/>
        </View>
    </View>
  );
}

const styles= StyleSheet.create({
    profile: {
        width:150, 
        height: 150, 
        resizeMode:'stretch', 
        borderRadius: 50
    }
});