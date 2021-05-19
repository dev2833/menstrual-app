import { StyleSheet, Dimensions } from 'react-native';

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

export default StyleSheet.create({
    headerView: { 
        width:'100%',
        flexDirection: 'row', 
        marginTop: 30, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    headerIcon: {
        width: '20%', 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    profileView: {
        width: '100%', 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    profile: {
        width:120, 
        height: 120, 
        resizeMode:'stretch', 
        borderRadius: 100
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        width: '90%',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    menuTab:{
        flexDirection: 'row', 
        width: '100%', 
        height: 40, 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    menuText:{
        marginLeft: 2, 
        padding: 2, 
        fontSize: 14, 
        fontFamily: 'neosans_pro_regular', 
        fontWeight: 'bold'
    },
    textDayLeft:{
        fontSize: 40, 
        fontFamily: 'neosans_pro_medium',
        fontWeight: 'bold'
    },
    otherText:{
        fontSize: 20, 
        fontFamily: 'neosans_pro_medium', 
        fontWeight: 'bold'
    },
    otherText1:{
        fontSize: 12, 
        fontWeight: '100',
        fontWeight: 'bold'
    },
    subMenu1:{
        flexDirection:'row',
        backgroundColor: '#e8f1f7', 
        width: '100%', 
        height: 60, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 2
    },
    subMenu2:{
        flexDirection:'row',
        width: '100%', 
        height: 60, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    subMenu3:{
        width: '95%', 
        alignItems:'flex-start',
        marginLeft: 10,
        borderRadius:30
    },
    subMenuHead:{
        fontSize: 18, 
        fontFamily: 'neosans_pro_medium', 
        fontWeight: 'bold',
    },
    subMenuHead2:{
        fontSize: 13, 
        fontFamily: 'neosans_pro_medium',
        fontWeight: 'bold'
    },
    adsView:{
        margin: 10, 
        flexDirection: 'row', 
        width: width, 
        height: 260,
    },
    adsView1:{
        width: width/2-10, 
        height: 260, 
        marginRight:5, 
        borderRadius: 10,
        justifyContent: 'center'
    },
    adsView2:{
        width: width/2-10, 
        height: 200
    },
    adsImage1:{
        width: '100%', 
        height: '100%', 
        resizeMode: 'stretch',
        borderRadius: 10,
    },
    adsImage2:{
        width: '100%', 
        height: '49%', 
        resizeMode: 'stretch',
        borderRadius: 10, 
        marginBottom: 5
    },
    adsImage3:{
        width: '100%', 
        height: '49%', 
        resizeMode: 'stretch',
        borderRadius: 10
    }
});