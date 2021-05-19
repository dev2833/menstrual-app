import React, {useState, useEffect} from 'react';
import { View, Image } from 'react-native';
import AppContainer from './AppContainer';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import FlashMessage from "react-native-flash-message";

export default function App() {
  console.disableYellowBox = true;
  const initialState = {
    users: {},
    currentUser: null,
    theme: "orange_dark",
    language: "en",
    langIndex: 0,
    passLock: false,
    currentMonthStart: null,
    dashboardRerender: false
  }
  
  function reducer(state = initialState, action){
    switch(action.type){
      case "SET_USER":
        return {...state, users:action.data};
      case "CURRENT_USER":
        return {...state, currentUser:action.data};
      case "CHANGE_THEME":
        return {...state, theme:action.data};
      case "CHANGE_LANG":
        return {...state, language:action.data};
      case "SHOW_PASS_LOCK":
        return {...state, passLock:action.data};
      case "LANG_INDEX":
        return {...state, langIndex:action.data};
      case "MONTH_START":
        return {...state, currentMonthStart:action.data};
      case "DASHBOARD_RERENDER":
        return {...state, dashboardRerender:action.data};
      default:
        return state;
    }
  }

  const store = createStore(reducer);

  return (
    <Provider store={store}>
      <View style={{flex:1}}> 
        <AppContainer/>
        <FlashMessage position="top" />
      </View>
    </Provider>
  );
}
