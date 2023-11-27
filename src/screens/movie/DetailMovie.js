
import * as React from 'react';
import { View, StyleSheet, SafeAreaView, Text, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { useRoute } from '@react-navigation/native';

const starLogo = require('../../assets/star.png');
const backLogo = require('../../assets/back-logo.png');
const netflixLogo = require('../../assets/netflix-logo.jpg');
const userLogo = require('../../assets/user-logo.png');

const DetailMovie = ({ navigation }) => {

    const renderForYou = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ marginRight: 10 }} onPress={() => {
                navigation.navigate('DetailMovie', {
                    videoUrl: item.video,
                    nameMovie: item.name,
                    ratingMovie: item.rating,
                    yearMovie: item.years,
                    descMovie: item.description,
                    dataAllMovies: dataAllMovies
                });
            }}>
                <Image source={{ uri: item.image }} style={{ width: 150, height: 220, borderRadius: 10 }} />
            </TouchableOpacity>
        );
    };

    const video = React.useRef(null);
    const route = useRoute();
    const [status, setStatus] = React.useState({});
    const { videoUrl, nameMovie, ratingMovie, yearMovie, descMovie, dataAllMovies } = route.params;
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Home')
                    }}>
                        <Image source={backLogo} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>

                    <Image source={netflixLogo} style={{ width: 150, height: 30 }} />
                    <TouchableOpacity onPress={() => { navigation.navigate('Profile') }}><Image source={userLogo} style={{ width: 30, height: 30 }} /></TouchableOpacity>
                </View>
                <Video
                    ref={video}
                    style={styles.video}
                    source={{
                        uri: videoUrl,
                    }}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                    shouldPlay={true}
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
                <View style={{ padding: 10 }}>
                    <Text style={{ color: 'white', fontSize: 30 }}>{nameMovie}</Text>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <Image source={starLogo} style={{ width: 20, height: 20, marginRight: 5 }} />
                        <Text style={{ color: 'white', fontSize: 20 }}>{ratingMovie}</Text>

                        <Text style={{ color: 'grey', fontSize: 18 }}> | </Text>
                        <Text style={{ color: 'grey', fontSize: 18 }}> {yearMovie} </Text>
                    </View>
                    <Text style={{ color: 'white', marginBottom: 30 }}>{descMovie}</Text>
                    <Text style={{ color: 'white', fontSize: 30, marginBottom: 20 }}>For You</Text>
                    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                        <FlatList
                            data={dataAllMovies}
                            renderItem={renderForYou}
                            keyExtractor={(item, index) => `item-name-${index}`}
                            horizontal={true}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    video: {
        alignSelf: 'center',
        width: 500,
        height: 250,
        backgroundColor: 'white'
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
});
export default DetailMovie;