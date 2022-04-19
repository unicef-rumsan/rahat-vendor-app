import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
  Pressable,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import colors from '../../../constants/colors';
import {FontSize, Spacing} from '../../../constants/utils';
import {
  PoppinsMedium,
  CustomButton,
  CustomTextInput,
  RegularText,
  SmallText,
} from '../../components';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CheckBox from '@react-native-community/checkbox';
import ImagePicker from 'react-native-image-crop-picker';
import {RNToasty} from 'react-native-toasty';
import {useDispatch} from 'react-redux';
import {getWallet} from '../../redux/actions/wallet';
import {registerVendor} from '../../redux/actions/auth';
import CustomLoader from '../../components/CustomLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const imagePickerConfigs = {
  cropping: true,
  cropperStatusBarColor: colors.blue,
  cropperToolbarColor: colors.blue,
  cropperToolbarTitle: 'Edit Image',
  cropperToolbarWidgetColor: colors.white,
  includeBase64: true,
};

const profilePickerConfigs = {...imagePickerConfigs, width: 400, height: 400};
const idPickerConfigs = {...imagePickerConfigs, width: wp(90), height: hp(35)};

const SignupHeader = ({pageTitle}) => (
  <SafeAreaView style={styles().header}>
    <PoppinsMedium style={{fontSize: FontSize.large}}>
      {pageTitle}
    </PoppinsMedium>
  </SafeAreaView>
);

const DotIndicator = ({step, activePage}) => (
  <View style={styles(activePage >= step ? 'active' : 'inactive').dot}>
    {activePage >= step + 1 && (
      <AntDesign name="check" color={colors.white} size={18} />
    )}
  </View>
);

const LineIndicator = ({step, activePage}) => (
  <View style={styles(activePage >= step ? 'active' : 'inactive').line} />
);

const RenderPageIndicator = ({activePage, agreeTC}) => (
  <View style={styles().activePageIndicatorView}>
    <DotIndicator step={0} activePage={activePage} />
    <LineIndicator step={1} activePage={activePage} />
    <DotIndicator step={1} activePage={activePage} />
    <LineIndicator step={2} activePage={activePage} />
    <DotIndicator step={2} activePage={activePage} />
    {/* <LineIndicator step={3} activePage={activePage} />
    <DotIndicator step={agreeTC ? 2 : 3} activePage={activePage} /> */}
  </View>
);

const SignupScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [activePage, setActivePage] = useState(0);
  const [pageTitle, setPageTitle] = useState('');
  const [agreeTC, setAgreeTC] = useState(false);

  const inputRef = useRef([]);

  const [values, setValues] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    govt_id: '',
    profileImageUrl: '',
    idFrontImageUrl: '',
    idBackImageUrl: '',
    registerErrorFlag: 0,
    showModal: false,
    imageType: '',
    isSubmitting: false,
    loaderMessage: '',
  });

  const {
    name,
    address,
    email,
    phone,
    govt_id,
    profileImageUrl,
    idFrontImageUrl,
    idBackImageUrl,
    registerErrorFlag,
    showModal,
    imageType,
    isSubmitting,
    loaderMessage,
  } = values;

  useEffect(() => {
    switch (activePage) {
      case 1:
        setPageTitle(`${t('Profile Photo')}`);
        break;
      case 2:
        setPageTitle(`${t('Identity Photo')}`);
        break;
      case 3:
        setPageTitle(`${t('Terms and Conditions')}`);
        break;
      default:
        setPageTitle(`${t('Register')}`);
        break;
    }
  }, [activePage]);

  useEffect(() => {
    if (isSubmitting) {
      setTimeout(() => {
        dispatch(
          getWallet('create', onWalletCreateSuccess, onWalletCreateError),
        );
      }, 500);
    }
  }, [isSubmitting]);

  const handleSubmit = () => {
    setValues({
      ...values,
      isSubmitting: true,
      loaderMessage: `${t('Creating your wallet.')} ${t('Please wait...')}`,
    });
  };

  const onWalletCreateSuccess = wallet => {
    const wallet_address = wallet.address;
    console.log('wallet created', wallet);

    const data = {
      name,
      phone,
      wallet_address,
      email,
      address,
      // govt_id,
      govt_id_image: idFrontImageUrl,
      photo: profileImageUrl,
    };

    navigation.replace('LinkAgencyScreen', {
      data,
      from: 'signup',
    });
  };

  const onWalletCreateError = e => {
    console.log(e);
    alert(e, 'wallet create error');
    setValues({...values, isSubmitting: false});
  };

  // const onRegisterSuccess = data => {
  //   console.log(data, 'data');
  //   navigation.replace('RegisterSuccessScreen', {data});
  // };

  // const onRegisterError = e => {
  //   AsyncStorage.clear()
  //     .then(() => {
  //       console.log(e.response);
  //       console.log(e);
  //       const errorMessage = e.response ? e.response : e.message;
  //       alert(errorMessage, 'register error');
  //       setValues({...values, isSubmitting: false});
  //     })
  //     .catch(e => {
  //       console.log(e, 'asycn clear error');
  //     });
  // };

  const handleTextChange = (value, name) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const onRegisterNext = () => {
    if (
      name === '' ||
      address === '' ||
      phone === '' ||
      email === '' ||
      // govt_id === '' ||
      !email.includes('@')
      // !!!phone.match(/9[0-9]{9}/)
    ) {
      setValues({...values, registerErrorFlag: 1});
      return;
    }
    setActivePage(prev => prev + 1);
  };

  const registerPage = () => (
    <View style={styles().pageView}>
      <View>
        <CustomTextInput
          placeholder={t('Name')}
          value={name}
          onChangeText={value => handleTextChange(value, 'name')}
          error={
            registerErrorFlag === 1 &&
            name === '' &&
            `${t('Name')} ${t('is required')}`
          }
          onSubmitEditing={() => inputRef.current['phone'].focus()}
          returnKeyType="next"
          blurOnSubmit={false}
        />
        <CustomTextInput
          placeholder={t('Phone Number')}
          keyboardType="phone-pad"
          value={phone}
          maxLength={15}
          onChangeText={value => handleTextChange(value, 'phone')}
          returnKeyType="next"
          ref={input => (inputRef.current['phone'] = input)}
          onSubmitEditing={() => inputRef.current['email'].focus()}
          blurOnSubmit={false}
          error={
            registerErrorFlag === 1 &&
            phone === '' &&
            // ?
            `${t('Phone Number')} ${t('is required')}`
            // :
            // registerErrorFlag === 1 &&
            //   phone.match(/9[0-9]{9}/) === null &&
            //   'Please enter valid phone number'
          }
        />

        <CustomTextInput
          placeholder={t('Email')}
          value={email}
          onChangeText={value => handleTextChange(value, 'email')}
          error={
            registerErrorFlag === 1 && email === ''
              ? `${t('Email')} ${t('is required')}`
              : registerErrorFlag === 1 &&
                !email.match(
                  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                ) &&
                `${t('Please enter valid email')}`
          }
          returnKeyType="next"
          autoCapitalize="none"
          blurOnSubmit={false}
          keyboardType={'email-address'}
          ref={input => (inputRef.current['email'] = input)}
          onSubmitEditing={() => inputRef.current['address'].focus()}
        />

        <CustomTextInput
          placeholder={t('Address')}
          value={address}
          ref={input => (inputRef.current['address'] = input)}
          // onSubmitEditing={() => inputRef.current['govt_id'].focus()}
          returnKeyType="done"
          // blurOnSubmit={false}
          onChangeText={value => handleTextChange(value, 'address')}
          error={
            registerErrorFlag === 1 &&
            address === '' &&
            `${t('Address')} ${t('is required')}`
          }
        />

        {/* <CustomTextInput
          placeholder="Government Issued Document No."
          value={govt_id}
          onChangeText={value => handleTextChange(value, 'govt_id')}
          error={
            registerErrorFlag === 1 &&
            govt_id === '' &&
            'Document No. is required'
          }
          returnKeyType="done"
          // blurOnSubmit={false}
          keyboardType={'email-address'}
          ref={input => (inputRef.current['govt_id'] = input)}
        /> */}
      </View>
      <CustomButton
        title={t('Next')}
        style={styles().button}
        onPress={onRegisterNext}
      />
    </View>
  );

  const CustomImageView = ({type, title, imageSource}) => {
    return (
      <Pressable
        style={[
          styles().imageView,
          {
            backgroundColor:
              values[`${type}Url`] === '' ? colors.whiteGray : colors.white,
            height: type === 'profileImage' ? hp(60) : hp(30),
          },
        ]}
        onPress={() =>
          setValues({...values, showModal: true, imageType: type})
        }>
        {values[`${type}Url`] === '' ? (
          <>
            <AntDesign
              name="pluscircleo"
              size={48}
              color={colors.blue}
              style={styles().uploadIcon}
            />
            <RegularText>{title}</RegularText>
          </>
        ) : (
          <Image source={{uri: imageSource}} style={styles(type).image} />
        )}
      </Pressable>
    );
  };

  const profilePicturePage = () => (
    <View style={styles().pageView}>
      <CustomImageView
        title={t('Upload Profile Picture')}
        type="profileImage"
        imageSource={profileImageUrl}
      />
      <View style={styles().buttonsView}>
        <CustomButton
          title={t('Next')}
          onPress={() => setActivePage(prev => prev + 1)}
          disabled={profileImageUrl !== '' ? false : true}
        />
        <CustomButton
          title={t('Previous')}
          color={colors.gray}
          outlined
          onPress={() => {
            setActivePage(prev => prev - 1);
            setValues({...values, registerErrorFlag: 0});
          }}
        />
      </View>
    </View>
  );

  const identityPicturePage = () => (
    <View style={styles().pageView}>
      <CustomImageView
        title={t('Upload Id Front Picture')}
        type="idFrontImage"
        imageSource={idFrontImageUrl}
      />
      <CustomImageView
        title={t('Upload Id Back Picture')}
        type="idBackImage"
        imageSource={idBackImageUrl}
      />
      <View style={styles().buttonsView}>
        <CustomButton
          title={t('Next')}
          onPress={() => setActivePage(prev => prev + 1)}
          disabled={idFrontImageUrl !== '' ? false : true}
        />
        <CustomButton
          title={t('Previous')}
          color={colors.gray}
          outlined
          onPress={() => setActivePage(prev => prev - 1)}
        />
      </View>
    </View>
  );

  const termsAndConditionsPage = () => (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <View>
        <SmallText noPadding>
          {t(
            '1. Vendor will use the Rahat vendor application to provide goods to the beneficiaries.',
          )}
        </SmallText>
        <SmallText noPadding>
          {t(
            '2. The vendor will be reimbursed only after redeeming the tokens back to aid agency.',
          )}
        </SmallText>
      </View>
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Spacing.vs,
          }}>
          <CheckBox
            value={agreeTC}
            onValueChange={value => setAgreeTC(value)}
            tintColor={colors.blue}
            tintColors={{true: colors.blue, false: colors.gray}}
          />
          <SmallText>{t('I accept all terms and conditions.')}</SmallText>
        </View>
        <View style={styles().buttonsView}>
          <CustomButton
            title={t('Continue')}
            onPress={handleSubmit}
            disabled={!agreeTC || isSubmitting ? true : false}
            // isSubmitting={isSubmitting}
          />
          <CustomButton
            title={t('Previous')}
            disabled={isSubmitting}
            outlined
            color={colors.gray}
            onPress={() => setActivePage(prev => prev - 1)}
          />
        </View>
      </View>
    </View>
  );

  const handleTakePhoto = () => {
    ImagePicker.openCamera(
      imageType === 'profileImage' ? profilePickerConfigs : idPickerConfigs,
    )
      .then(image => {
        setValues({
          ...values,
          [`${imageType}Url`]: `data:${image.mime};base64,` + image.data,
          showModal: !showModal,
          imageType: '',
        });
        // handleImageSelect(image);
      })
      .catch(e => {
        RNToasty.Show({title: `${e}`, duration: 0});
        // handleImageSelectError(e);
      });
  };
  const handleChooseFromGallery = () => {
    ImagePicker.openPicker(
      imageType === 'profileImage' ? profilePickerConfigs : idPickerConfigs,
    )
      .then(image => {
        setValues({
          ...values,
          [`${imageType}Url`]: `data:${image.mime};base64,` + image.data,
          showModal: !showModal,
          imageType: '',
        });
        // handleImageSelect(image);
      })
      .catch(e => {
        RNToasty.Show({title: `${e}`, duration: 0});
        // handleImageSelectError(e);
      });
  };

  const renderModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showModal}
      style={{marginHorizontal: Spacing.hs}}
      onRequestClose={() => {
        setValues({...values, showModal: false});
      }}>
      <View style={styles(showModal).centeredModalView}>
        <View style={styles().modalView}>
          <CustomButton
            title={t('Take a Photo')}
            color={colors.green}
            width={wp(80)}
            onPress={handleTakePhoto}
          />
          <CustomButton
            title={t('Choose from Gallery')}
            color={colors.green}
            width={wp(80)}
            onPress={handleChooseFromGallery}
          />
          <CustomButton
            title={t('Cancel')}
            outlined
            color={colors.gray}
            width={wp(80)}
            onPress={() => setValues({...values, showModal: false})}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles().container}>
      <SignupHeader pageTitle={pageTitle} />
      {activePage < 3 && (
        <RenderPageIndicator activePage={activePage} agreeTC={agreeTC} />
      )}
      {renderModal()}
      <CustomLoader message={loaderMessage} show={isSubmitting} />
      {activePage === 0 && registerPage()}
      {activePage === 1 && profilePicturePage()}
      {activePage === 2 && identityPicturePage()}
      {activePage === 3 && termsAndConditionsPage()}
    </View>
  );
};

export default SignupScreen;

const styles = props =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: Spacing.hs,
      backgroundColor: colors.white,
    },
    header: {
      paddingTop: androidPadding,
      marginVertical: Spacing.vs,
      backgroundColor: colors.white,
    },
    activePageIndicatorView: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: Spacing.vs * 2,
    },
    dot: {
      height: 20,
      width: 20,
      borderRadius: 10,
      backgroundColor: colors.blue,
      opacity: props === 'active' ? 1 : 0.2,
      justifyContent: 'center',
    },
    line: {
      height: 2,
      width: 50,
      backgroundColor: colors.blue,
      opacity: props === 'active' ? 1 : 0.2,
    },
    pageView: {
      flex: 1,
      justifyContent: 'space-between',
    },
    button: {
      marginBottom: Spacing.vs * 2,
    },
    imageView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      height: props === 'profileImage' ? hp(60) : hp(30),
      width: wp(90),
      resizeMode: 'contain',
    },
    buttonsView: {
      // flexDirection: 'row',
      // justifyContent: 'space-between',
      marginBottom: Spacing.vs * 2,
    },
    uploadIcon: {paddingVertical: Spacing.vs},
    modalView: {
      paddingHorizontal: Spacing.vs,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: Spacing.hs,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },

    centeredModalView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props ? 'rgba(0,0,0,0.6)' : colors.white,
    },
  });
