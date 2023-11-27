import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TextInput, View, SafeAreaView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

const userLogo = require('../../assets/user-logo.png');
const netflixLogo = require('../../assets/netflix-logo.jpg');
const searchLogo = require('../../assets/search.png');
const backLogo = require('../../assets/back-logo.png');
const Search = ({ navigation }) => {
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [data, setData] = useState([]);
    const [dataAll, setDataAll] = useState([]);

    useEffect(() => {
        setLoading(true);
        if (keyword.length > 1) {
            const filterData = data.filter((item, index) => {
                const keyword2 = keyword.toLowerCase();
                const name = item.name.toLowerCase();
                return name.includes(keyword2);
            });
            if (filterData.length === 0) {
                setNotFound(true);
            } else {
                setData(filterData);
                setNotFound(false);
            }
            setLoading(false);
        } else {
            setNotFound(false);
            setData(dataAll);
            setLoading(false);
        }
    }, [keyword]);

    async function getMovies(search) {
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        try {
            const response = await fetch(apiUrl + '/movies?name=' + search, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Test API');
            const data = await response.json();
            if (response.ok) {
                if (data.data) {
                    setDataAll(data.data);
                    setData(data.data);
                    setLoading(false);
                } else {
                    console.error("Data is missing in the response");
                }
            } else {
                getMovies(keyword)
            }
        } catch (error) {
            getMovies(keyword)
        }
        finally {
            setLoading(false)
        }
    }



    useEffect(() => {
        setLoading(true);
        getMovies('');
    }, []);

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => {
                navigation.navigate('DetailMovie', {
                    videoUrl: item.video,
                    nameMovie: item.name,
                    ratingMovie: item.rating,
                    yearMovie: item.years,
                    descMovie: item.description
                });
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={{ uri: item.image }} style={{ width: 150, height: 100, marginRight: 10, borderRadius: 10 }} />
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ color: 'white', fontSize: 20 }}>{item.name}</Text>
                        <Text style={{ color: 'white' }} numberOfLines={4}>{item.description}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={{ flex: 1, padding: 16, marginTop: 10 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Home')
                    }}>
                        <Image source={backLogo} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>

                    <Image source={netflixLogo} style={{ width: 150, height: 30 }} />
                    <TouchableOpacity onPress={() => { navigation.navigate('Profile') }}><Image source={userLogo} style={{ width: 30, height: 30 }} /></TouchableOpacity>
                </View>
                <View style={styles.search}>
                    <TextInput placeholder="Enter the name of the video.." placeholderTextColor={'grey'} value={keyword}
                        onChangeText={val => setKeyword(val)} style={{ color: 'white' }} />
                    <Image source={searchLogo} style={{ tintColor: 'white', width: 30, height: 30 }} />
                </View>
                {loading ? (
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <ActivityIndicator size="large" color="white" />
                    </View>
                ) : notFound ? (
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <Text style={{ color: 'grey', alignItems: 'center', justifyContent: 'center' }}>Not found data</Text>
                    </View>
                ) : (
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `item-name-${index}`}
                    />
                )}
            </View>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'black',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    search: {
        backgroundColor: '#0C1B2A',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 100,
        marginBottom: 20,
    },
});

export default Search;
