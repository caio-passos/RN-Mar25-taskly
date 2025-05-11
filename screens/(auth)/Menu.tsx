import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  StyleProp,
  TextStyle,
  Pressable,
  BackHandler,
} from 'react-native';
import MenuCarrousel from '../../components/carrousel/MenuCarrousel';
import IconRightArrow from '../../assets/icons/lightmode/rightArrow.svg';
import ModalAlert from '../Modal/Alert';
import { useUserStore, useAuthStore } from '../../services/cache/stores/storeZustand';
import { AppContext } from '../../App';
import { RootStackParamList } from '../../types/routingTypes';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Terms from '../../screens/(auth)/Terms';
import Theme from '../../screens/(auth)/Theme';
import { MMKV } from 'react-native-mmkv';
import AvatarDisplay from '../../components/AvatarDisplay';
import { useThemedIcons } from '../../components/carrousel/carrouselIcons';
import Avatar from './Avatar';
import EditProfile from '../../components/editProfile';

interface MenuProps {
  navigation: NativeStackScreenProps<RootStackParamList, 'Login', 'Menu'>;
}

const Menu = ({ navigation }: MenuProps) => {
  const { colors, darkMode } = useContext(AppContext)!;
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [biometria, setBiometria] = useState(false);
  const [control, setControl] = useState(false);
  const [controlTheme, setControlTheme] = useState(false);

  const themedIcons = useThemedIcons();

  useEffect(() => {
    const storage = new MMKV();
    console.log('All MMKV keys:', storage.getAllKeys());
    const userData = storage.getString('user-storage');
    console.log('MMKV read:', userData);
  }, []);

  useEffect(() => {
    function backAction() {
      setControl(false);
      setControlTheme(false);
      return true;
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleOpenModal = (modalId: string) => {
    setActiveModal(activeModal === modalId ? null : modalId);
  };

  const handleDisableBiometria = () => {
    setBiometria(true);
  };
  const handleLogout = () => {
    useUserStore.getState().partialUpdate({
      loggedIn: false,
    });
    navigation.navigate('Login');
    console.log('Navigation reset to Login');
  };
  const HandleDeleteAccount = () => {
    useUserStore.getState().clearUserData();
    useAuthStore.getState().setAvatar();
    navigation.navigate('Login');
  };


  const styles = StyleSheet.create({
    Container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: colors.Background,
      
    },
    Header: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: 40,
      paddingBottom: 32,
      color: colors.MainText,
    },
    ContainerTitle: {
      paddingTop: 12,
      color: colors.MainText,
    },
    ContainerCarrousel: {
      flex: 2,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      backgroundColor: colors.Background,
    },
    Title: {
      fontWeight: 'bold',
      fontSize: 18,
      color: colors.MainText,

    },
    EmailAndPhone: {
      color: colors.MainText,
      fontFamily: 'Roboto-Regular',

    },
    ContainerBottom: {
      flex: 3,
      gap: 16,
      justifyContent: 'flex-start',
      paddingHorizontal: 32,

    },
    ShadowContainer: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.46,
      shadowRadius: 11.14,
    },
    ContainerPressables: {
      flexDirection: 'row',
      height: 72,
      borderRadius: 8,
      elevation: 2,
      backgroundColor: colors.SecondaryBG,
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingHorizontal: 16,
    },
    PressablesText: {
      fontSize: 18,
      fontWeight: 'bold',
      flex: 1,
      color: colors.MainText,
    },
    RightArrow: {
      marginRight: 8,
    },
  });

  const { userData } = useUserStore();

  return (
    <View style={styles.Container}>
      {activeModal === 'Edit' ? (
        <EditProfile onCloseEdit={() => setActiveModal(null)} />
      ) : (
        <>
          {!control && !controlTheme && (
            <>
              <View style={styles.Header}>
                <AvatarDisplay style={{ width: 150, height: 150 }} />
                <View style={styles.ContainerTitle}>
                  <Text style={styles.Title}>{userData?.nome}</Text>
                </View>
                <View>
                  <Text style={styles.EmailAndPhone}>{userData?.email}</Text>
                </View>
                <View>
                  <Text style={styles.EmailAndPhone}>{userData?.telefone}</Text>
                </View>
              </View>
              <View style={styles.ContainerCarrousel}>
                <MenuCarrousel
                  height={131}
                  width={134}
                  items={[
                    {
                      id: 'Edit',
                      icon: <themedIcons.IconEditar height={131} width={134} />,
                      onPress: () => {
                        console.log('Edit pressed'); // Debug log
                        handleOpenModal('Edit');
                      },
                    },
                    {
                      id: 'Biometria',
                      icon: <themedIcons.IconBiometria height={131} width={134} />,
                      onPress: () => {
                        console.log('Biometria pressed');
                        handleOpenModal('Biometria');
                      },
                    },
                    {
                      id: 'Sair',
                      icon: <themedIcons.IconSair height={131} width={134} />,
                      onPress: () => {
                        console.log('Sair pressed');
                        handleOpenModal('Sair');
                      },
                    },
                    {
                      id: 'Excluir',
                      icon: <themedIcons.IconExcluir height={131} width={134} />,
                      onPress: () => {
                        console.log('Excluir pressed');
                        handleOpenModal('Excluir');
                      },
                    },
                  ]}
                />
              </View>
            </>
          )}
          {activeModal === 'Biometria' &&
            (biometria ? (
              <ModalAlert
                visible={true}
                onClose={() => {
                  setActiveModal(null);
                  setBiometria(false);
                }}
                title="Ativar biometria"
                description="Use sua impressão digital para acessar seu app de tarefas com rapidez e segurança. Se preferir, você ainda poderá usar sua senha sempre que quiser."
                leftButtonText="Agora não"
                rightButtonText="HABILITAR"
                rightButtonStyle={{ backgroundColor: colors.SecondaryAccent }}
                styleFont={{fontFamily: 'Roboto-Regular'}}
              />
            ) : (
              <ModalAlert
                visible={true}
                onClose={() => {
                  setActiveModal(null);
                  handleDisableBiometria();
                }}
                title="Desabilitar biometria"
                description="Tem certeza que deseja desabilitar a autenticação por biometria? Você precisará usar seu login e senha para acessar o app."
                leftButtonText="Agora não"
                rightButtonText="DESABILITAR"
                rightButtonStyle={{ backgroundColor: colors.Error }}
                styleFont={{fontFamily: 'Roboto-Regular'}}
              />
            ))}

          <ModalAlert
            visible={activeModal === 'Sair'}
            onClose={() => {
              console.log('Close modal triggered');
              console.log('Current activeModal:', activeModal);
              setActiveModal(null);
            }}
            title="Deseja sair?"
            description="Tem certeza que deseja sair do aplicativo? Você poderá se conectar novamente a qualquer momento."
            leftButtonText="Agora não"
            rightButtonText="SAIR"
            onRightButtonPress={() => {
              console.log('Right button pressed in Sair modal');
              handleLogout();
            }}
            rightButtonStyle={{ backgroundColor: colors.Error }}
            styleFont={{fontFamily: 'Roboto-Medium'}}
            colorFont={{color: colors.Primary}}
          />
          {activeModal === 'Excluir' && (
            <ModalAlert
              visible={true}
              onClose={() => {
                setActiveModal(null);
              }}
              onRightButtonPress={() => HandleDeleteAccount()}
              title="Excluir conta"
              description="Tem certeza que deseja excluir sua conta? Essa ação é permanente e todos os seus dados serão perdidos."
              leftButtonText="Agora não"
              rightButtonText="EXCLUIR"
              rightButtonStyle={{ backgroundColor: colors.Error }}
              style={{ backgroundColor: colors.Background}}
              styleFont={{fontFamily:'Roboto-Regular'}}
            />
          )}

          {!control && !controlTheme && (
            <View style={styles.ContainerBottom}>
              <View style={styles.ShadowContainer}>
                <Pressable onPress={() => setControlTheme(true)}>
                  <View style={styles.ContainerPressables}>
                    <Text style={styles.PressablesText}>Preferências</Text>
                    <View style={styles.RightArrow}>
                      <IconRightArrow height={24} width={24} />
                    </View>
                  </View>
                </Pressable>
              </View>
              <View style={styles.ShadowContainer}>
                <Pressable onPress={() => setControl(true)}>
                  <View style={styles.ContainerPressables}>
                    <Text style={styles.PressablesText}>Termos e regulamentos</Text>
                    <View style={styles.RightArrow}>
                      <IconRightArrow height={24} width={24} />
                    </View>
                  </View>
                </Pressable>
              </View>
            </View>
          )}
          {control && (
            <Terms setControl={setControl} />
          )}
          {controlTheme && (
            <Theme setControlTheme={setControlTheme} />
          )}
        </>
      )}
    </View>
  );
};
export default Menu;
