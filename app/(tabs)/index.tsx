import React, { useState } from 'react';
import { StyleSheet, Button, FlatList, Text, View, ActivityIndicator, Alert } from 'react-native';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [parkingData, setParkingData] = useState([]);
  const carparkList = ['A15', 'A4', 'A11', 'AM14', 'BLOCK', 'Carpark', 'a8'];

  // 访问 API 的函数
  const fetchParkingData = async () => {
    setLoading(true); // 显示加载指示器
    try {
      const response = await fetch(
        'https://api.data.gov.sg/v1/transport/carpark-availability'
      );
      const data = await response.json(); // 解析响应为 JSON
      const filteredData = data.items[0].carpark_data.filter((item) =>
        carparkList.includes(item.carpark_number)
      ); // 过滤匹配的停车场
      setParkingData(filteredData); // 设置过滤后的数据
      setLoading(false); // 隐藏加载指示器
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch parking data.'); // 错误处理
      setLoading(false);
    }
  };

  // 渲染停车场数据
  const renderParkingItem = ({ item }) => (
    <View style={styles.parkingItem}>
      <Text style={styles.parkingText}>Carpark: {item.carpark_number}</Text>
      <Text style={styles.parkingText}>Total lots: {item.carpark_info[0].total_lots}</Text>
      <Text style={styles.parkingText}>Lot type: {item.carpark_info[0].lot_type}</Text>
      <Text style={styles.parkingText}>Available lots: {item.carpark_info[0].lots_available}</Text>
      <Text style={styles.parkingText}>Last updated: {item.update_datetime}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Fetch Parking Data" onPress={fetchParkingData} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={parkingData}
          renderItem={renderParkingItem}
          keyExtractor={(item) => item.carpark_number.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  parkingItem: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 5,
  },
  parkingText: {
    fontSize: 16,
  },
});
