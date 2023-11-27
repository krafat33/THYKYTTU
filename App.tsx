import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listModal, setListModal] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedData, setSelectedData] = useState('');


  const filterPosts = text => {
    setSearchText(text);
    const filtered = posts.filter(posts =>
      posts.toLowerCase().includes(text.toLowerCase()),
    );
    setSelectedData(filtered);
  };

  const openModal = () => {
    setListModal(true);
  };

  const closeModal = () => {
    setListModal(false);
  };

  useEffect(() => {

    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const savedDataString = await AsyncStorage.getItem('selectedData');

      const response = await fetch('https://jsonplaceholder.typicode.com/posts',{
        method:'GET'
      });
      const data = await response.json();
      setPosts(data);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleBankSelection = async (selectedPost) => {
    try {
      // Save the selected post to AsyncStorage
      const selectedDataString = JSON.stringify(selectedPost);
      await AsyncStorage.setItem('selectedData', selectedDataString);
      setSelectedData(selectedPost);
    } catch (error) {
      console.error('Error saving selected data to AsyncStorage:', error);
    } finally {
      closeModal();
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }


  return (
    <>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            width: wp('80%'),
            height: hp('30%'),
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 8,
            shadowRadius: 6,
            elevation: 8,
            alignItems: 'center',
            paddingTop: 20,
          }}>
          <TextInput
            style={{
              width: wp('50'),
              height: hp('7%'),
              borderWidth: 1,
              borderColor: '#000',
              borderRadius: 15,
              paddingLeft: 20,
              color: '#3b82f6',
            }}
            placeholder="Search List"
           value={selectedData.title}
           
          />
          <TouchableOpacity onPress={openModal}
            style={{
              width: wp('30%'),
              height: hp('8%'),
              backgroundColor: '#d8bfd8',
              marginTop: 20,
              borderRadius: 17,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color:'#fff'}}>SET POSTS</Text>
          </TouchableOpacity>
          <TextInput
          editable={false}
          style={{
            marginTop:10,
            width: wp('50'),
            height: hp('7%'),
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 15,
            paddingLeft: 20,
            color: '#3b82f6',
          }}
          value={selectedData.title}
          ></TextInput>

        </View>
      </View>
      <Modal
        visible={listModal}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              padding: 20,
              width: wp('80%'),
              shadowOpacity: 10,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 1},
              shadowRadius: 10,
              elevation: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                alignItems: 'center',
                position: 'relative',
              }}>
              <Text
                style={{
                  fontSize: hp('2.2%'),
                  fontWeight: '400',
                  letterSpacing: 0.3,
                  color: '#0284c7',
                }}>
                Posts List
              </Text>
              <TouchableOpacity
                onPress={closeModal}
                style={{left: 90}}></TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <Icon
                name="search"
                size={24}
                color="#0284c7"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search Posts"
                placeholderTextColor="#000"
                value={searchText}
                onChangeText={filterPosts}
              />
            </View>
            <ScrollView>
              {posts.length > 0 ? (
                posts.map((bank, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleBankSelection(bank)}
                    style={{
                      marginTop: 10,
                      width: wp('70%'),
                      height: hp('18%'),
                      backgroundColor: '#fff',
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 1},
                      shadowOpacity: 0.1,
                      shadowRadius: 7,
                      elevation: 9,
                      borderRadius: 15,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: '#8a2be2'}}>{bank.title}</Text>
                    <Text style={styles.bankText}>{bank.body}</Text>
                  </Pressable>
                ))
              ) : (
                <Text style={{color: '#b91c1c', fontSize: 18}}>
                  No banks found
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default App;
const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.1,
    borderColor: '#3b82f6',
    borderRadius: 12,
    padding: 5,
    width: wp('70%'),
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: hp('2%'),
    color: '#000',
  },
  bankText: {
    alignSelf: 'center',
    fontSize: 14,
    color: '#000',
    letterSpacing: 0.2,
    fontWeight: '400',
  },
});
