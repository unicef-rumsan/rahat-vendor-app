import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Spacing, colors} from '../../constants';
import {Card, CustomHeader, RegularText} from '../../components';

const CONNECTIPS_LOGO =
  'https://play-lh.googleusercontent.com/l2NwpHebHN7ZwsyqxMhe3Ke75VC-vN8o5Xyz9cVkE3ES-o_lviOiFStNrCeo_BUtsLo_';

const ESEWA_LOGO =
  'https://play-lh.googleusercontent.com/MRzMmiJAe0-xaEkDKB0MKwv1a3kjDieSfNuaIlRo750_EgqxjRFWKKF7xQyRSb4O95Y';

const KHALTI_LOGO =
  'https://play-lh.googleusercontent.com/Xh_OlrdkF1UnGCnMN__4z-yXffBAEl0eUDeVDPr4UthOERV4Fll9S-TozSfnlXDFzw';

const PAYMENT_METHODS = [
  {
    title: 'Connect IPS',
    imageUrl: CONNECTIPS_LOGO,
  },
  {
    title: 'Esewa',
    imageUrl: ESEWA_LOGO,
  },
  {
    title: 'Khalti',
    imageUrl: KHALTI_LOGO,
  },
];

const PaymentMethodScreen = ({navigation}) => {
  const PaymentMethodCard = ({imageUrl, title, onPress}) => (
    <Pressable onPress={onPress}>
      <Card style={{flexDirection: 'row'}}>
        <Image
          source={{uri: imageUrl}}
          style={{height: hp(4), width: wp(8), marginRight: Spacing.hs}}
        />
        <RegularText>{title}</RegularText>
      </Card>
    </Pressable>
  );

  return (
    <>
      <CustomHeader
        title="Payment Methods"
        onBackPress={() => navigation.pop()}
      />
      <View style={styles.container}>
        {PAYMENT_METHODS.map((item, index) => (
          <PaymentMethodCard
            key={index}
            title={item.title}
            imageUrl={item.imageUrl}
            onPress={() =>
              navigation.navigate('PaymentProcessScreen', {
                paymentMethod: item.title,
              })
            }
          />
        ))}
      </View>
    </>
  );
};

export default PaymentMethodScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
});
