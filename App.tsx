import React, { useEffect } from 'react';
import { withIAPContext, requestPurchase, useIAP } from 'react-native-iap';
import {
  Platform,
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

const skus = Platform.select({
  ios: ['TreatmentAppointment2', 'TreatmentAppointmentExtend2'],
  android: ['telemedicine.reservation.150000won'],
});

const App = () => {
  const {
    initConnectionError,
    currentPurchase,
    currentPurchaseError,
    products,
    getProducts,
    finishTransaction,
  } = useIAP();

  useEffect(() => {
    if (initConnectionError) {
      console.log(Platform.OS, 'initConnectionError', initConnectionError);
    }
    if (currentPurchaseError) {
      console.log(Platform.OS, 'currentPurchaseError', currentPurchaseError);
    }
  }, [initConnectionError, currentPurchaseError]);

  useEffect(() => {
    if (currentPurchase) {
      console.log(currentPurchase);
    }
  }, [currentPurchase]);

  const handlePurchase = async (sku: string) => {
    await requestPurchase({ sku });
  };

  return (
    <SafeAreaView style={styles.backgroundContainer}>
      <Text style={styles.bold}>OKDOC 인앱결제 테스트</Text>

      {!products.length && (
        <Button
          title="Get the products"
          onPress={async () => {
            if (skus) {
              try {
                await getProducts({ skus });
              } catch (err) {
                console.log('err', err);
              }
            }
          }}
        />
      )}

      {products.map(product => (
        <View key={product.productId}>
          <Text>{product.productId}</Text>

          <Button
            title="Buy"
            onPress={() => handlePurchase(product.productId)}
          />
        </View>
      ))}

      {currentPurchase && (
        <Button
          title="finishTransaction"
          onPress={async () => {
            console.log(
              '====================finishTransaction start====================',
            );
            try {
              const result = await finishTransaction({
                purchase: currentPurchase,
                isConsumable: true,
                developerPayloadAndroid: undefined,
              });
              console.log('finishTransaction', result);
            } catch (err) {
              console.log('err', err);
            }
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default withIAPContext(App);

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bold: {
    fontSize: 20,
    fontWeight: '700',
  },
});
