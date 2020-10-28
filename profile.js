import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import firebase from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit} from '@fortawesome/free-solid-svg-icons';


export default class Profile extends Component{
    constructor(props) {
        super(props);
        this.state = { 
            userName: '',
            profileImage: '',
        }
      }
     

    componentDidMount(){
        firebase.database().ref('account/'+firebase.auth().currentUser.uid)
        .on('value',(snapshot)=>{
            this.setState({
                userName: snapshot.val().name,
                profileImage: snapshot.val().profileImage,
            })
            
        });
    }
    render(){
        return(
            <View style={styles.container}>
                <View>
                    <Image style={{ width: 140, height: 140, borderRadius:140/2, marginTop:20}}
                   source={{uri: this.state.profileImage}} />
                </View>
                <TouchableOpacity
                     onPress={() => this.props.navigation.navigate('تعديل صفحة المستخدم')}
                     style={styles.iconStyle}>
                     <FontAwesomeIcon icon={ faEdit }size={30} color={"#69C4C6"}/>
                    </TouchableOpacity>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                    {this.state.userName}
                    </Text>
                </View>

                <View style={styles.Container4}>

                        <TouchableOpacity style={styles.button3}>
                            <Text style={styles.text2}>بلاغات </Text>
                        </TouchableOpacity>
                    
                        <TouchableOpacity style={styles.button3}>
                            <Text style={styles.text2}>عروض التبني</Text>
                        </TouchableOpacity>
                    
                        <TouchableOpacity style={styles.button3}>
                            <Text style={styles.text2}>عروض البيع</Text>
                        </TouchableOpacity>
                  
                        
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFCFC',
        alignItems: 'center',
        // justifyContent: 'center',
        flex: 1,
    },
    container2: {
      backgroundColor: '#FFFCFC',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      marginBottom:50,
  },
  container3: {
    backgroundColor: '#FFFCFC',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width:200,
    flexDirection: 'column',
    marginBottom: 100,
    padding:150,
},
    textStyle:{
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },
    text:{
        color:'black',
        fontSize: 30,
        // marginBottom: 80,
    },

    button: {
        backgroundColor: '#69C4C6',
        padding: 10,
        width: 185,
        alignItems: "center",
        marginTop: 5,
        marginBottom: 60,
        borderRadius: 20,

    },
    button2: {
      padding: 8,
      width: 125,
      marginLeft: 160,
      marginTop:50
  },
    text2: {
        textDecorationLine: 'underline',
        fontSize: 16
    },
    iconStyle: {
        position: 'absolute',
        padding:8,
        left: 30,
        marginLeft: 220,
        marginTop: 150
      },
      Container4:{
        flexDirection: 'row',
        alignContent: 'space-between',
        alignItems: 'baseline'
      },
      button3: {
        alignSelf: 'center',
        margin: 25,
        borderBottomColor: '#69C4C6',
    }
});