import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Modal,
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch} from 'react-redux';
import {RNToasty} from 'react-native-toasty';
import {useTranslation} from 'react-i18next';
import CheckBox from '@react-native-community/checkbox';
import ImagePicker from 'react-native-image-crop-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DropDownPicker from 'react-native-dropdown-picker';

import {
  SmallText,
  RegularText,
  LoaderModal,
  CustomButton,
  PoppinsMedium,
  CustomTextInput,
} from '../../components';
import {FontSize, Spacing, colors} from '../../constants';
import {getWallet} from '../../redux/actions/walletActions';
import {storeRegistrationFormData} from '../../redux/actions/authActions';
import {apiGetWards} from '../../redux/api';

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
  freeStyleCropEnabled: true,
};

const profilePickerConfigs = {...imagePickerConfigs, width: 400, height: 400};
const idPickerConfigs = {
  ...imagePickerConfigs,
  width: wp(90),
  height: hp(35),
};

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

const RenderPageIndicator = ({activePage}) => (
  <View style={styles().activePageIndicatorView}>
    <DotIndicator step={0} activePage={activePage} />
    <LineIndicator step={1} activePage={activePage} />
    <DotIndicator step={1} activePage={activePage} />
    <LineIndicator step={2} activePage={activePage} />
    <DotIndicator step={2} activePage={activePage} />
  </View>
);

const SignupScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [activePage, setActivePage] = useState(0);
  const [pageTitle, setPageTitle] = useState('');
  const [agreeTC, setAgreeTC] = useState(false);
  const [open, setOpen] = useState(false);
  const [wardNum, setWardNum] = useState(null);
  const [items, setItems] = useState([]);
  const [wardCheckErr, setWardCheckErr] = useState(false);

  const inputRef = useRef([]);

  const [values, setValues] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    ward: '',
    profileImageUrl: '',
    idFrontImageUrl: '',
    idBackImageUrl: '',
    registerErrorFlag: 0,
    showModal: false,
    imageType: '',
  });

  const {
    name,
    address,
    email,
    phone,
    ward,
    profileImageUrl,
    idFrontImageUrl,
    idBackImageUrl,
    registerErrorFlag,
    showModal,
    imageType,
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
    async function getWards() {
      let {data: wards} = await apiGetWards();
      wards = wards.map(wrd => {
        return {label: wrd, value: wrd};
      });
      setItems(wards);
    }
    getWards();
  }, [open]);

  const handleSubmit = () => {
    LoaderModal.show({message: 'Creating your wallet. Please wait...'});
    setTimeout(() => {
      dispatch(getWallet('create', onWalletCreateSuccess, onWalletCreateError));
    }, 500);
  };

  const onWalletCreateSuccess = wallet => {
    LoaderModal.hide();
    const wallet_address = wallet.address;

    const data = {
      name,
      phone,
      wallet_address,
      email,
      ward,
      address,
      govt_id_image: idFrontImageUrl,
      photo: profileImageUrl,
    };

    dispatch(storeRegistrationFormData({registrationFormData: data}));
    navigation.replace('LinkAgencyScreen', {
      data,
      from: 'signup',
    });
  };

  const onWalletCreateError = e => {
    LoaderModal.hide();
    alert(String(e), 'wallet create error');
  };

  const handleTextChange = (value, name) => {
    if (name === 'ward') {
      setWardCheckErr(false);
    }
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
      ward === '' ||
      ward === null ||
      !email.includes('@')
    ) {
      setValues({...values, registerErrorFlag: 1});
      setWardCheckErr(true);
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
            `${t('Phone Number')} ${t('is required')}`
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
          returnKeyType="done"
          onChangeText={value => handleTextChange(value, 'address')}
          error={
            registerErrorFlag === 1 &&
            address === '' &&
            `${t('Address')} ${t('is required')}`
          }
        />

        <DropDownPicker
          open={open}
          value={wardNum}
          items={items}
          setOpen={setOpen}
          setValue={setWardNum}
          setItems={setItems}
          placeholder={t('Ward')}
          textStyle={{
            fontSize: FontSize.medium,
            color: colors.gray,
            paddingHorizontal: 7.5,
          }}
          style={{borderColor: colors.gray}}
          returnKeyType="next"
          autoCapitalize="none"
          blurOnSubmit={false}
          onChangeValue={value => handleTextChange(value, 'ward')}
        />
        {wardCheckErr ? (
          <SmallText
            noPadding
            color={colors.danger}
            style={{paddingHorizontal: Spacing.hs, paddingTop: Spacing.vs / 5}}>
            {`${t('Ward')} ${t('is required')}`}
          </SmallText>
        ) : null}
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
          1. Vendor will use the Rahat vendor application to provide goods to
          the beneficiaries.
        </SmallText>
        <SmallText noPadding>
          2. The vendor will be reimbursed only after redeeming the tokens back
          to aid agency.
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
          <SmallText noPadding>I accept all terms and conditions.</SmallText>
        </View>
        <View style={styles().buttonsView}>
          <CustomButton
            title={t('Continue')}
            onPress={handleSubmit}
            disabled={!agreeTC ? true : false}
          />
          <CustomButton
            title={t('Previous')}
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
