import { View, Text } from "react-native";
import { Image } from "react-native";
import { useEffect, useState } from 'react';
import { getAllFavoriteUserBooks, getAllCategories, getAllUserBooksByCategory } from "@/database/databaseOperations";

const Settings = () => {
    const [numFavorites, setNumFavorites] = useState(0);
    const [numCategories, setNumCategories] = useState(0);
    const [numBooks, setNumBooks] = useState(0);
    const [mostBookCategory, setMostBookCategory] = useState('');

    useEffect(() => {
        getAllFavoriteUserBooks().then(books => {
            if (books) {
                setNumFavorites(books.length);
            }
        });

        getAllCategories().then(categories => {
            if (categories) {
                setNumCategories(categories.length);

                let promises = categories.map(category =>
                    getAllUserBooksByCategory(category.name).then(books => ({
                        category: category.name,
                        bookCount: books ? books.length : 0
                    }))
                );

                Promise.all(promises).then(results => {
                    const totalBooks = results.reduce((sum, { bookCount }) => sum + bookCount, 0);
                    setNumBooks(totalBooks);

                    // Find the category with the most books
                    const maxCategory = results.reduce((max, current) =>
                        current.bookCount > max.bookCount ? current : max,
                        { category: '', bookCount: 0 }
                    );
                    setMostBookCategory(maxCategory.category);
                });
            }
        });
    }, []);

    return (
        <View className="flex-1">
            <View className="flex-1 justify-center items-center px-1">
                <Text className="text-2xl font-bold text-white py-2 text-center">You have {numFavorites} favorited books!</Text>
                <Text className="text-2xl font-bold text-white py-2 text-center">You have {numCategories} categories!</Text>
                <Text className="text-2xl font-bold text-white py-2 text-center">You have {numBooks} total books!</Text>
                <Text className="text-2xl font-bold text-white py-2 text-center">Your category with the most books is {mostBookCategory}!</Text>
                <Image source={require("@/assets/icons/app/adaptive-icon.png")} className="w-64 h-64" testID="settings-image" />
            </View>
        </View>
    )
}

export default Settings;
