import React, { Suspense } from 'react';
import { View, Pressable, Text } from 'react-native';
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

// Container styling for full screen
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
    return (
        <SafeAreaProvider testID="SafeAreaProvider">
            {/* Status bar with light appearance */}
            <StatusBar style="light" backgroundColor="#1E1E1E" />
            <Container testID="RootLayoutContainer">
                <Suspense fallback={<Fallback />}>
                    <SQLiteProvider databaseName="bookCollection.db" onInit={migrateDbIfNeeded} useSuspense >
                        <ContentContainer testID="ContentContainer">
                            {!isWelcomePage && (

                                <View className="flex-row justify-start items-center space-x-5 pb-1" style={{ paddingTop: insets.top }} >
                                    <BackButton />
                                    <Text className="text-white text-2xl font-bold">Tabby</Text>
                                </View>
                            )}
                            <Slot />
                        </ContentContainer>
                        {!isWelcomePage &&
                            <View testID="FooterNavBar" style={{ paddingBottom: insets.bottom }}>
                                <FooterNavBar />
                            </View>}
                    </SQLiteProvider>
                </Suspense>
            </Container>
        </SafeAreaProvider>
    );
}
