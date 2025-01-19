import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { View, Pressable, Text, Platform, Keyboard, Animated, KeyboardEvent } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SQLiteProvider } from 'expo-sqlite';
import FooterNavBar from '@/components/FooterNavBar';
import { styled } from 'nativewind';
import LoadingSpinner from '@/components/LoadingSpinner';
import { migrateDbIfNeeded } from '@/database/migration';
import ArrowBackIcon from '@/assets/menu-icons/arrow-back-icon.svg';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Container = styled(View, 'flex-1 bg-[#1E1E1E]');
const ContentContainer = styled(View, 'flex-grow');

function Fallback() {
    return (
        <View testID="LoadingSpinner">
            <LoadingSpinner />
        </View>
    );
}

function BackButton() {
    const router = useRouter();
    return (
        <Pressable onPress={() => router.back()} className='p-2'>
            <ArrowBackIcon height={36} width={36} />
        </Pressable>
    );
}

export default function RootLayout() {
    const insets = useSafeAreaInsets();
    const pathname = usePathname();
    const isWelcomePage = pathname === '/';
    const [footerHeight] = useState(new Animated.Value(70)); // footer's actual height
    const [footerOpacity] = useState(new Animated.Value(1));

    const animateFooter = useCallback((show: boolean, duration: number) => {
        const heightValue = show ? 70 : 0; // footer's actual height
        Animated.parallel([
            Animated.timing(footerHeight, {
                toValue: heightValue,
                duration,
                useNativeDriver: false // Height animation cannot use native driver
            }),
            Animated.timing(footerOpacity, {
                toValue: show ? 1 : 0,
                duration: duration * 0.8,
                useNativeDriver: false
            })
        ]).start();
    }, [footerHeight, footerOpacity]);

    useEffect(() => {
        const keyboardWillShow = (event: KeyboardEvent) => {
            const duration = Platform.OS === 'ios' ? event.duration : 220;
            animateFooter(false, duration);
        };

        const keyboardWillHide = (event: KeyboardEvent) => {
            const duration = Platform.OS === 'ios' ? event.duration : 220;
            animateFooter(true, duration);
        };

        const showSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            keyboardWillShow
        );
        const hideSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            keyboardWillHide
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [animateFooter]);

    return (
        <SafeAreaProvider testID="SafeAreaProvider">
            <StatusBar style="light" backgroundColor="#1E1E1E" />
            <Container testID="RootLayoutContainer">
                <Suspense fallback={<Fallback />}>
                    <SQLiteProvider databaseName="bookCollection.db" onInit={migrateDbIfNeeded} useSuspense>
                        <ContentContainer testID="ContentContainer">
                            {!isWelcomePage && (
                                <View
                                    className="flex-row justify-start items-center space-x-5 pb-1"
                                    style={{ paddingTop: insets.top }}
                                >
                                    <BackButton />
                                    <Text className="text-white text-2xl font-bold">Tabby</Text>
                                </View>
                            )}
                            <Slot />
                        </ContentContainer>
                    </SQLiteProvider>
                </Suspense>

                {!isWelcomePage && (
                    <Animated.View
                        testID="FooterNavBar"
                        style={{
                            height: footerHeight,
                            opacity: footerOpacity,
                            overflow: 'hidden',
                            paddingBottom: insets.bottom,
                        }}
                    >
                        <FooterNavBar />
                    </Animated.View>
                )}
            </Container>
        </SafeAreaProvider>
    );
}