import { ScrollView, View, Text } from "react-native";
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


    const categoryPhrase = () => {
        if (numCategories === 1) {
            return 'category.';
        } else {
            return 'categories!';

        }
    }

    const favoritePhrase = () => {
        if (numFavorites === 1) {
            return 'liked book';
        } else {
            return 'liked books';
        }
    };

    const bookPhrase = () => {
        if (numBooks === 1) {
            return 'book.';
        } else {
            return 'total books!';
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>


            <View className="flex-1 justify-center items-center px-1">
                {(numFavorites === 0) ? <Text className="text-2xl font-bold text-white py-2 text-center">You have no liked books ...</Text> : ((<Text className="text-2xl font-bold text-white py-2 text-center">You have {numFavorites} {favoritePhrase()}</Text>)
                )}
                <Text className="text-2xl font-bold text-white py-2 text-center">You have {numCategories} {categoryPhrase()}</Text>
                {(numBooks === 0) ? <Text className="text-2xl font-bold text-white py-2 text-center">You have no books ...</Text> : ((<Text className="text-2xl font-bold text-white py-2 text-center">You have {numBooks} {bookPhrase()}</Text>)
                )}

                {
                    mostBookCategory !== '' && (<Text className="text-2xl font-bold text-white py-2 text-center max-w-sm">Your category with the most books is {mostBookCategory}!</Text>

                    )}
                <Image source={require("@/assets/icons/app/adaptive-icon.png")} className="w-64 h-64" testID="settings-image" />
            </View>
        </ScrollView>
    )
}

export default Settings;
