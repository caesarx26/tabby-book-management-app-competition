// moved all files to my laptop and pushing from my laptop because no wifi at my house
import { useState, useEffect, useCallback } from "react";
import {
    FlatList,
    Pressable,
    View,
    Text,
    Alert,
    TextInput,
    Modal,
    ScrollView,
    Keyboard
} from "react-native";
import BookPreview from "@/components/BookPreview";
import FavoriteButtonIcon from "@/components/FavoriteButtonIcon";
import BookIcon from "@/components/BookIcon";
import { SearchBar } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import {
    getAllUserBooksByCategory,
    addUserBook,
    updateUserBook,
    getUserBookById,
    updateMultipleUserBooksToHaveCategoryPassed,
    addMultipleUserBooksWithCategoryName,
    deleteMultipleUserBooksByIds,
    getAllCategories,
} from "@/database/databaseOperations";
import { Book } from "@/types/book";
import PlusIcon from "@/assets/menu-icons/plus-icon.svg";
import DeleteIcon from "@/assets/menu-icons/delete-icon.svg";
import AddSquareIcon from "@/assets/menu-icons/add-square-icon.svg";
import CancelIcon from "@/assets/menu-icons/cancel-icon.svg";
import SelectIcon from "@/assets/menu-icons/select-icon.svg";
import MenuIcon from "@/components/book/MenuIcon";
import DeleteBooksModal from "@/components/DeleteBooksModal";
import AddBooksOrMoveBooksToCategoryModal from "@/components/AddBooksOrMoveBooksToCategoryModal";
import LoadingSpinner from "@/components/LoadingSpinner";


type SelectableBook = {
    book: Book;
    isSelected: boolean;
};

interface NewCustomBook {
    title: string;
    author: string;
    summary: string;
    excerpt: string;
    pageCount: number | null;
    notes: string;
}

type FieldData = {
    key: string;
    placeholder: string;
    field: keyof NewCustomBook; // Ensures this matches the fields in NewCustomBook
    isMultiline: boolean;
    validation?: (value: string) => boolean;
};

const data: FieldData[] = [
    { key: "Add Title", placeholder: "title", field: "title", isMultiline: false, validation: (value: string) => value.trim() !== "" },
    { key: "Add Author", placeholder: "author", field: "author", isMultiline: false },
    { key: "Add Summary", placeholder: "summary", field: "summary", isMultiline: true },
    { key: "Add Excerpt", placeholder: "excerpt", field: "excerpt", isMultiline: true },
    {
        key: "Add Page Count", placeholder: "Page Count", field: "pageCount", isMultiline: false,
    },
    { key: "Add Notes", placeholder: "Notes", field: "notes", isMultiline: true } // Optional field, no validation required
];

const size = 36;

const CategoryPage: React.FC = () => {
    const { category } = useLocalSearchParams();
    const [selectableBooks, setSelectableBooks] = useState<SelectableBook[]>(
        []
    );
    const [errorCustomBookMessage, setErrorCustomBookMessage] = useState("");
    const [
        isAddingOrMovingBookModalVisible,
        setIsAddingOrMovingBookModalVisible,
    ] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [loadingInitialBooks, setLoadingInitialBooks] = useState(false);

    /* New custom book state for */
    const [newCustomBook, setNewCustomBook] = useState<NewCustomBook>({
        title: '',
        author: '',
        summary: '',
        excerpt: '',
        pageCount: null,
        notes: ''
    });

    const handleInputChange = (field: keyof NewCustomBook, value: string) => {
        if (field === "title" && value.trim() !== "") {
            setErrorCustomBookMessage("");
        }
        if (field === "title" && value.trim() === "") {
            setErrorCustomBookMessage("Title cannot be empty");
        }

        setNewCustomBook((prevState) => ({ ...prevState, [field]: value }));
    };

    // state to track if filtering by favorite
    const [isFilteringByFavorite, setIsFilteringByFavorite] = useState(false);
    const [isFilteringByCustom, setIsFilteringByCustom] = useState(false);
    const [isSortingByTitle, setIsSortingByTitle] = useState(false);
    const [isSortingByAuthor, setIsSortingByAuthor] = useState(false);
    const [isSortingByRating, setIsSortingByRating] = useState(false);

    // function to sort books
    const sortBooks = (books: SelectableBook[]) => {
        if (isSortingByTitle) {
            books = books.sort(
                (a, b) => (a.book.title < b.book.title) ? -1 : 1
            );
        }
        if (isSortingByAuthor) {
            books = books.sort(
                (a, b) => (a.book.author < b.book.author) ? -1 : 1
            );
        }
        if (isSortingByRating) {
            books = books.sort(
                (a, b) => {
                    const ratingA = a.book.rating ?? -Infinity; // Default to -Infinity if undefined
                    const ratingB = b.book.rating ?? -Infinity; // Default to -Infinity if undefined
                    return ratingA < ratingB ? 1 : -1;
                }
            );

        }

        return books;
    };

    // function to handle filtering books by custom or favorite or both
    const handleFilteringBooksByFavorite = () => {
        setLoadingSearch(true);

        const filteredBooksByFlags = filteredBooksForSearch.filter((currentSelectableBook) => {
            // favorite flag set so return true if favorite
            if (currentSelectableBook.book.isFavorite) {
                return true;
            }

            return false;
        });



        setFilteredBooksForSearch(filteredBooksByFlags);
        setLoadingSearch(false);

    }

    // handle resetting filtering by favorite
    const handleResetFilteringByFavorite = () => {

        console.log("isFilteringByFavorite toggle: ", isFilteringByFavorite);

        // set current filtered books with just search phrase
        updateSearch(search);

        // check if not filtering by custom if so can just return early
        if (!isFilteringByCustom) {
            // setIsFilteringByFavorite(false);
            return
        }


    }

    const handleFilteringBooksByCustom = () => {

        const filteredBooksByFlags = filteredBooksForSearch.filter((currentSelectableBook) => {
            // favorite flag set so return true if favorite
            if (currentSelectableBook.book.isCustomBook) {
                return true;
            } return false;
        });
        setFilteredBooksForSearch(filteredBooksByFlags);

    }

    const handleResetFilteringByCustom = () => {


        // set current filtered books with just search phrase
        updateSearch(search);

        // check if not filtering by favorite if so can just return early
        if (!isFilteringByFavorite) {
            return
        }




    }

    // effect to handle filtering by favorite
    useEffect(() => {
        if (isFilteringByFavorite) {
            handleFilteringBooksByFavorite();
        } else {
            console.log("\n\n else isFilteringByFavorite toggle: ", isFilteringByFavorite);
            handleResetFilteringByFavorite();

        }

    }, [isFilteringByFavorite])

    // effect to handle filtering by custom
    useEffect(() => {
        if (isFilteringByCustom) {
            handleFilteringBooksByCustom();
        } else {
            handleResetFilteringByCustom();
        }
    }, [isFilteringByCustom])

    // effect to sort books
    //     useEffect(() => {
    //         if (isSortingByTitle) {
    //             const sorted = filteredBooksForSearch.sort(
    //                 (a, b) => (a.book.title < b.book.title) ? -1 : 1
    //             );
    //             setFilteredBooksForSearch(sorted);
    //         }
    //     }, [isSortingByTitle]);
    //     useEffect(() => {
    //         if (isSortingByAuthor) {
    //             const sorted = filteredBooksForSearch.sort(
    //                 (a, b) => (a.book.author < b.book.author) ? -1 : 1
    //             );
    //             setFilteredBooksForSearch(sorted);
    //         }
    //     }, [isSortingByAuthor]);
    //     useEffect(() => {
    //         if (isSortingByRating) {
    //             const sorted = filteredBooksForSearch.sort(
    //                 (a, b) => (a.book.rating < b.book.rating) ? 1 : -1
    //             );
    //             setFilteredBooksForSearch(sorted);
    //         }
    //     }, [isSortingByRating]);


    const toggleFilteringByFavorite = () => {
        if (isFilteringByFavorite) {
            setIsFilteringByFavorite(false);
        } else {
            setIsFilteringByFavorite(true);
        }
    }

    const toggleFilteringByCustom = () => {
        if (isFilteringByCustom) {
            setIsFilteringByCustom(false);
        } else {
            setIsFilteringByCustom(true);
        }
    }

    const handleConfirmForAddingCustomBook = useCallback(async () => {
        Keyboard.dismiss(); // Dismiss keyboard to ensure no pending state changes
        // Rest of your logic
        const success = await handleAddCustomBook();
        if (!success) {
            console.error("Failed to confirm adding custom book");
        }
    }, [newCustomBook]);



    // function to check if any books are selected
    const areAnyFilteredBooksSelected = () => {
        return filteredBooksForSearch.some((book) => book.isSelected);
    };

    // get all selectable books that are selected
    const getSelectedFilteredSelectableBooks = () => {
        return filteredBooksForSearch.filter(
            (currentSelectableBook) => currentSelectableBook.isSelected
        );
    };

    // function to get all selected book ids
    const getAllSelectedFilteredBookIds = () => {
        return filteredBooksForSearch
            .filter((book) => book.isSelected)
            .map((book) => book.book.id);
    };

    // get all unselected book objects from selectable books
    const getUnselectedSelectableBooks = () => {
        return selectableBooks.filter(
            (currentSelectableBook) => !currentSelectableBook.isSelected
        );
    };

    // will fetch books from database on mount
    useEffect(() => {
        const fetchingBooksFromCategory = async () => {
            try {
                if (!category) {
                    throw new Error("No category found");
                }
                setLoadingInitialBooks(true);
                // getting initial books and categories
                const initialBooks = await getAllUserBooksByCategory(
                    category as string
                );
                const allCategories = await getAllCategories();
                if (!allCategories) {
                    throw new Error("No categories in db");
                }
                // setting categories
                const allCategoriesExceptCurrentCategory = allCategories.filter(
                    (currentCategory) => currentCategory.name !== (category as string)
                );
                setCategories(
                    allCategoriesExceptCurrentCategory.map(
                        (currentCategory) => currentCategory.name
                    )
                );

                // check if initialBooks is an array of books
                if (Array.isArray(initialBooks)) {
                    // setting selectable books initially
                    setSelectableBooks(
                        initialBooks.map((currentBook) => ({
                            book: currentBook,
                            isSelected: false,
                        }))
                    );
                    // will also set filtered books for search
                    setFilteredBooksForSearch(
                        initialBooks.map((currentBook) => ({
                            book: currentBook,
                            isSelected: false,
                        }))
                    )

                }
            } catch (error) {
                console.error("Failed to load categories:", error);
            } finally {
                setLoadingInitialBooks(false);
            }
        };

        fetchingBooksFromCategory();
    }, [category]);


    const [addCustomBookModalVisible, setAddCustomBookModalVisible] = useState(false);

    const [sortModalVisible, setSortModalVisible] = useState(false);


    const [search, setSearch] = useState("");
    const [filteredBooksForSearch, setFilteredBooksForSearch] = useState(selectableBooks);
    const [loadingSearch, setLoadingSearch] = useState(false);

    const handleFavoritePress = async (bookId: string) => {
        // get user book by id
        const userBook = await getUserBookById(bookId);
        if (!userBook) {
            console.error("Failed to get user book");
            return;
        }
        // update user book
        const updatedUserBook = { ...userBook, isFavorite: !userBook.isFavorite };

        const resultOfUpdatingUserBook = await updateUserBook(updatedUserBook);
        if (!resultOfUpdatingUserBook) {
            console.error("Failed to update user book");
            return;
        }

        const getBookObjectWithTogglingFavorite = (tempBookObject: Book) => {
            const favoriteStatus = tempBookObject.isFavorite || false;
            return { ...tempBookObject, isFavorite: !favoriteStatus };
        };

        // update selectable state of local books
        setSelectableBooks((prevSelectableBooks) =>
            prevSelectableBooks.map((currentSelectableBook) =>
                currentSelectableBook.book.id === bookId
                    ? {
                        book: getBookObjectWithTogglingFavorite(
                            currentSelectableBook.book
                        ),
                        isSelected: false,
                    }
                    : currentSelectableBook
            )
        );

        // update selectable state of filtered books for search
        setFilteredBooksForSearch((prevSelectableBooks) =>
            prevSelectableBooks.map((currentSelectableBook) =>
                currentSelectableBook.book.id === bookId
                    ? {
                        book: getBookObjectWithTogglingFavorite(
                            currentSelectableBook.book
                        ),
                        isSelected: false,
                    }
                    : currentSelectableBook
            )
        );

    };

    // handle adding selected books to categories
    const handleAddSelectedBooksToCategories = async (categories: string[]) => {
        const selectedBookObjects = getBookObjectsFromSelectableBookArrayPassed(
            getSelectedFilteredSelectableBooks()
        );
        let wasAbleToAddBooksToAllCategories = true;

        // for each category add the selected books
        for (const category of categories) {
            const resultOfAddingBooksToCurrentCategory = await addMultipleUserBooksWithCategoryName(
                selectedBookObjects,
                category
            );
            if (!resultOfAddingBooksToCurrentCategory) {
                console.error("Failed to add books to current category: ", category);
                wasAbleToAddBooksToAllCategories = false;
            }
        }

        if (wasAbleToAddBooksToAllCategories) {
            //reset local state of selectable books
            setIsAddingOrMovingBookModalVisible(false);
            Alert.alert("Successfully added selected books to all selected categories");
        } else {
            console.error("Failed to add selected books to all categories");
        }
    };

    // handle moving selected books to categories
    const handleMovingSelectedBooksToCategories = async (
        categories: string[]
    ) => {
        const selectedBookObjects = getBookObjectsFromSelectableBookArrayPassed(
            getSelectedFilteredSelectableBooks()
        );
        let wasAbleToAddBooksToAllCategories = true;
        const onlyOneSelectedCategory = categories.length === 1;

        // if there is only one category we can just update the user books to have that one category
        if (onlyOneSelectedCategory) {
            const resultOfUpdatingUserBooks = await updateMultipleUserBooksToHaveCategoryPassed(
                selectedBookObjects,
                categories[0]
            )

            if (!resultOfUpdatingUserBooks) {
                console.error("Failed to update user books to have category: ", categories[0]);
                wasAbleToAddBooksToAllCategories = false;
            }

        }
        // otherwise we need to add the selected books to each category
        else if (categories.length > 1) {
            // for each category add the selected books
            for (const category of categories) {
                const resultOfAddingBooksToCurrentCategory = await addMultipleUserBooksWithCategoryName(
                    selectedBookObjects,
                    category
                );
                if (!resultOfAddingBooksToCurrentCategory) {
                    console.error("Failed to add books to current category: ", category);
                    wasAbleToAddBooksToAllCategories = false;
                }
            }

        }



        if (wasAbleToAddBooksToAllCategories) {

            // delete selected books from current category only if there were more than one category
            if (!onlyOneSelectedCategory) {
                const resultOfDeletingSelectedBooks = await deleteMultipleUserBooksByIds(
                    getAllSelectedFilteredBookIds()
                )
                if (!resultOfDeletingSelectedBooks) {
                    Alert.alert("Failed to delete selected books in current category");
                }
            }



            // set local state of selectable books to not have the selected book objects as they have been moved from current category
            const unselectedSelectableBooks = getUnselectedSelectableBooks();
            setSelectableBooks(unselectedSelectableBooks);
            //set local state of filtered books for search to not have the selected book objects as they have been moved from current category
            setFilteredBooksForSearch(unselectedSelectableBooks);
            setSearch("");

            setIsAddingOrMovingBookModalVisible(false);
            Alert.alert("Successfully moved selected books to all selected categories");
        } else {
            Alert.alert("Failed to add selected books to all categories");
        }
    };

    const handleShowAddOrMoveBooksModal = () => {
        if (categories.length === 0) {
            Alert.alert("No other categories to move or add books to!");
        } else {
            setIsAddingOrMovingBookModalVisible(true);
        }
    };

    // get book objects array from selectableBooks array
    const getBookObjectsFromSelectableBookArrayPassed = (
        tempBooks: SelectableBook[]
    ) => {
        return tempBooks.map(
            (currentSelectableBook) => currentSelectableBook.book
        );
    };

    const renderBookButton = (currentSelectableBook: SelectableBook) => (
        <Pressable
            onPress={() => handleFavoritePress(currentSelectableBook.book.id)}
            className="ml-4"
        >
            <FavoriteButtonIcon
                isFavorite={currentSelectableBook.book.isFavorite || false}
            />
        </Pressable>
    );

    const updateSearch = (search: string) => {
        const trimmedSearch = search.trim();
        setSearch(search);
        setLoadingSearch(true);
        deselectAllBooks();
        console.log(`(search, favorite, custom): ${search}, ${isFilteringByFavorite}, ${isFilteringByCustom}`);

        /*
        let sortedBooks: SelectableBook[] = selectableBooks;
        if (isSortingByTitle) {
            console.log("Sorting by title");
            sortedBooks = sortedBooks.sort((a, b) => (a.book.title < b.book.title) ? -1 : 1);
        }
        if (isSortingByAuthor) {
            console.log("Sorting by author");
            sortedBooks = sortedBooks.sort((sb) => sb.book.author);
        }
        console.log("Sorted books:");
        for (let i = 0; i < sortedBooks.length; i++) {
            console.log(`  ${sortedBooks[i].book.title}`);
        }
        */
        const filteredBooks = selectableBooks.filter((currentSelectableBook) => {
            const genresAsArray = currentSelectableBook.book.genres?.split(",") || [];
            const searchAsLowerCase = trimmedSearch.toLowerCase();
            const filteredStringWithOnlyNumbers = trimmedSearch.replace(/\D/g, '');
            // search by title, author, genre, isbn, or genre
            if (
                search === "" ||
                currentSelectableBook.book.title.toLowerCase().includes(searchAsLowerCase) ||
                currentSelectableBook.book.author.toLowerCase().includes(searchAsLowerCase) ||
                genresAsArray.some((genre) => genre.toLowerCase().includes(searchAsLowerCase)) ||
                currentSelectableBook.book.isbn === filteredStringWithOnlyNumbers
            ) {
                // check if filtering by favorite
                if (isFilteringByFavorite && !currentSelectableBook.book.isFavorite) {
                    return false;

                }

                // check if filtering by custom
                if (isFilteringByCustom && !currentSelectableBook.book.isCustomBook) {
                    return false;
                }

                return true;
            }
            return false;
        });

        const filteredBooksThatAreNotSelected = filteredBooks.map((currentFilteredBook) => {
            return {
                ...currentFilteredBook,
                isSelected: false
            }
        }
        )

        setFilteredBooksForSearch(filteredBooksThatAreNotSelected);

        setLoadingSearch(false);

    };

    const toggleSelectedBook = (bookId: string) => {
        setSelectableBooks((prevSelectableBooks) =>
            prevSelectableBooks.map((currentSelectableBook) =>
                currentSelectableBook.book.id === bookId
                    ? {
                        ...currentSelectableBook,
                        isSelected: !currentSelectableBook.isSelected,
                    } // Toggle selected status
                    : currentSelectableBook
            )
        );

        setFilteredBooksForSearch((prevSelectableBooks) =>
            prevSelectableBooks.map((currentSelectableBook) =>
                currentSelectableBook.book.id === bookId
                    ? {
                        ...currentSelectableBook,
                        isSelected: !currentSelectableBook.isSelected,
                    } // Toggle selected status
                    : currentSelectableBook
            )
        );

    };

    // set all books to be deselected
    const deselectAllBooks = () => {
        // set all books to be deselected
        setSelectableBooks((prevSelectableBooks) =>
            prevSelectableBooks.map((currentSelectableBook) => ({
                ...currentSelectableBook,
                isSelected: false,
            }))
        );
        setFilteredBooksForSearch((prevSelectableBooks) =>
            prevSelectableBooks.map((currentSelectableBook) => ({
                ...currentSelectableBook,
                isSelected: false,
            }))
        );
    };

    // delete selected books
    const deleteSelectedBooks = async () => {
        const selectedBookIds = getAllSelectedFilteredBookIds();
        const unselectedSelectableBooks = getUnselectedSelectableBooks();
        const result = await deleteMultipleUserBooksByIds(selectedBookIds);
        if (result) {
            setSelectableBooks(unselectedSelectableBooks);
            setFilteredBooksForSearch(unselectedSelectableBooks);
            setIsDeleteModalVisible(false);
            setSearch("");
            Alert.alert("Successfully deleted selected books");
        } else {
            console.error("Failed to delete user books that were selected");
        }
    };

    const selectAllFilteredBooksAndUpdateSelectableBooksToSelectTheFilteredBooks = () => {
        // set all books to selected
        const updatedFilteredBooksForSearch = filteredBooksForSearch.map((book) => ({
            ...book,
            isSelected: true,
        }))

        const shouldSelectBook = (tempBook: SelectableBook) => {
            if (updatedFilteredBooksForSearch.some((filteredBook) => filteredBook.book.id === tempBook.book.id)) {
                return true;
            }
            return false;
        }

        // update selectable books
        const selectableBooksWithFilteredBooksSelected = selectableBooks.map((book) => ({
            ...book,
            isSelected: shouldSelectBook(book)

        }))
        setSelectableBooks(selectableBooksWithFilteredBooksSelected);
        setFilteredBooksForSearch(updatedFilteredBooksForSearch);
    }

    const handleAddCustomBook = async () => {
        if (newCustomBook.title.trim() === "") {
            setErrorCustomBookMessage("Title cannot be empty");
            return false;
        }


        const newCustomBookDataThatWillBeAdded: Book = {
            id: (selectableBooks.length + 1).toString() + newCustomBook.title,
            title: newCustomBook.title,
            author: newCustomBook.author || "",
            summary: newCustomBook.summary || "",
            excerpt: newCustomBook.excerpt || "",
            image: "",
            rating: 0,
            pageCount: newCustomBook.pageCount || 0,
            notes: newCustomBook.notes || "",
            genres: "",
            category: category as string,
            isFavorite: false,
            isCustomBook: true,
        };
        const resultOfAddingCustomBook = await addUserBook(
            newCustomBookDataThatWillBeAdded
        );
        if (!resultOfAddingCustomBook) {
            console.error("Failed to add custom book");
            Alert.alert("Failed to add custom book");
            return false;
        }
        // add new book to books has to be done after adding to database as the book object that is returned from database has the proper uuid
        setSelectableBooks([
            { book: resultOfAddingCustomBook, isSelected: false },
            ...selectableBooks,
        ]);
        setFilteredBooksForSearch([
            { book: resultOfAddingCustomBook, isSelected: false },
            ...filteredBooksForSearch,
        ])
        // resetting custom book if added
        setNewCustomBook({ title: '', author: '', summary: '', excerpt: '', pageCount: null, notes: '' });
        Alert.alert("Custom book added successfully!");
        // reset new custom book state
        setAddCustomBookModalVisible(false);
        return true;
    };

    // function to handle when sorting states change
    const handleResettingFiltering = () => {
        updateSearch(search);
    }

    return (

        <View className="flex-1">
            {loadingInitialBooks ? <View className="w-full h-full">
                <LoadingSpinner />
            </View> : <>
                <View className="flex-row items-center justify-between">
                    <View className="w-[90%] h-16 mx-auto">
                        <SearchBar
                            placeholder="Search by title, author, genre, or isbn"
                            onChangeText={updateSearch}
                            value={search}
                        />
                    </View>

                    <Pressable
                        className="p-1"
                        onPress={() => setAddCustomBookModalVisible(true)}
                    >
                        {<PlusIcon height={35} width={35} />}
                    </Pressable>
                </View>

                <View className="flex-row items-center pt-4 pl-4">
                    <ScrollView className="max-h-8">
                        <Text className="text-white text-xl font-bold text-left">{category}</Text>
                    </ScrollView>



                    <View className="flex-row justify-end">
                        <Pressable className="mr-5" onPress={() => setSortModalVisible(true)} >
                            <MenuIcon isSelected={sortModalVisible} />
                        </Pressable>

                        <Pressable className="mr-5 p-1" onPress={() => toggleFilteringByFavorite()} >
                            <FavoriteButtonIcon isFavorite={isFilteringByFavorite} StrokeColor="white" size={36} />
                        </Pressable>

                        <Pressable className="mr-5 p-1" onPress={() => toggleFilteringByCustom()}>
                            <BookIcon isCustom={isFilteringByCustom} size={36} />
                        </Pressable>


                        <Pressable className="mr-5 p-1" onPress={() => selectAllFilteredBooksAndUpdateSelectableBooksToSelectTheFilteredBooks()}><SelectIcon height={36} width={36} /></Pressable>
                    </View>

                </View>

                {/* Book List */}
                {loadingSearch ? (<View className="w-full">
                    <LoadingSpinner />
                </View>
                ) : (
                    <FlatList
                        data={sortBooks(filteredBooksForSearch)}
                        keyExtractor={(item) => item.book.id}
                        renderItem={({ item }) => (
                            <BookPreview
                                book={item.book}
                                button={renderBookButton(item)}
                                toggleSelected={toggleSelectedBook}
                                selectedBooks={getAllSelectedFilteredBookIds()}
                            />
                        )}
                    />
                )}

                {areAnyFilteredBooksSelected() && (
                    <View className="flex-row justify-around bg-[#161f2b] w-full border-t border-blue-500">
                        <View className="">
                            <Pressable
                                className="flex-col items-center"
                                onPress={() => setIsDeleteModalVisible(true)}
                            >
                                <DeleteIcon height={size} width={size} />
                                <Text className="text-white text-sm">Delete </Text>
                            </Pressable>
                        </View>

                        <View>
                            <Pressable
                                className="flex-col items-center"
                                onPress={() => handleShowAddOrMoveBooksModal()}
                            >
                                <AddSquareIcon height={size} width={size} />
                                <Text className="text-white text-sm">Add</Text>
                            </Pressable>
                        </View>

                        <View>
                            <Pressable
                                className="flex-col items-center"
                                onPress={() => deselectAllBooks()}
                            >
                                <CancelIcon height={size} width={size} />
                                <Text className="text-white text-sm">Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                )}

                {/* Delete Books Modal */}
                <DeleteBooksModal
                    visible={isDeleteModalVisible}
                    onClose={() => setIsDeleteModalVisible(false)}
                    booksToDelete={getBookObjectsFromSelectableBookArrayPassed(
                        getSelectedFilteredSelectableBooks()
                    )}
                    onConfirm={deleteSelectedBooks}
                />

                {/* Add Books to Category Modal */}
                <AddBooksOrMoveBooksToCategoryModal
                    visible={isAddingOrMovingBookModalVisible}
                    onClose={() => setIsAddingOrMovingBookModalVisible(false)}
                    booksToAdd={getBookObjectsFromSelectableBookArrayPassed(
                        getSelectedFilteredSelectableBooks()
                    )}
                    categories={categories}
                    onConfirmAddBooks={handleAddSelectedBooksToCategories}
                    onConfirmMoveBooks={handleMovingSelectedBooksToCategories}
                />

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={sortModalVisible}
                    onRequestClose={() => setSortModalVisible(false)}
                >
                    {/* close modal on background tap */}
                    <Pressable className="flex-1" onPress={() => setSortModalVisible(false)}></Pressable>
                    <View className="flex-1 justify-center items-center">
                        <View className="w-4/5 p-6 bg-white rounded-lg">

                            <View className="mt-4">
                                {!isSortingByTitle && <Pressable
                                    className="bg-blue-500 rounded p-2 mb-4"
                                    onPress={() => setIsSortingByTitle(true)}
                                >
                                    <Text className="text-white text-center">Sort by Title</Text>
                                </Pressable>}
                                {isSortingByTitle && <Pressable
                                    className="bg-green-500 rounded p-2 mb-4"
                                    onPress={() => setIsSortingByTitle(false)}
                                >
                                    <Text className="text-white text-center">Currently sorting by Title</Text>
                                </Pressable>}
                                {!isSortingByAuthor && <Pressable
                                    className="bg-blue-500 rounded p-2 mb-4"
                                    onPress={() => setIsSortingByAuthor(true)}
                                >
                                    <Text className="text-white text-center">Sort by Author</Text>
                                </Pressable>}
                                {isSortingByAuthor && <Pressable
                                    className="bg-green-500 rounded p-2 mb-4"
                                    onPress={() => setIsSortingByAuthor(false)}
                                >
                                    <Text className="text-white text-center">Currently sorting by Author</Text>
                                </Pressable>}
                                {!isSortingByRating && <Pressable
                                    className="bg-blue-500 rounded p-2 mb-4"
                                    onPress={() => setIsSortingByRating(true)}
                                >
                                    <Text className="text-white text-center">Sort by Rating</Text>
                                </Pressable>}
                                {isSortingByRating && <Pressable
                                    className="bg-green-500 rounded p-2 mb-4"
                                    onPress={() => setIsSortingByRating(false)}
                                >
                                    <Text className="text-white text-center">Currently sorting by Rating</Text>
                                </Pressable>}

                                <Pressable className="bg-red-500 rounded p-2" onPress={() => { setIsSortingByTitle(false); setIsSortingByAuthor(false); setIsSortingByRating(false); handleResettingFiltering(); }}>
                                    <Text className="text-white text-center">Reset</Text>
                                </Pressable>
                            </View>

                        </View>
                    </View>
                    {/* close modal on background tap */}
                    <Pressable className="flex-1" onPress={() => setSortModalVisible(false)}></Pressable>
                </Modal>

                {/* Add Custom Book Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={addCustomBookModalVisible}
                    onRequestClose={() => setAddCustomBookModalVisible(false)}
                >
                    <View className="flex-1 bg-black/50">
                        <Pressable className="flex-1" onPress={() => setAddCustomBookModalVisible(false)}></Pressable>
                        <View className="flex-1 justify-center items-center">
                            <View className="w-4/5 p-6 bg-white rounded-lg">
                                <FlatList
                                    extraData={newCustomBook} // Ensures FlatList updates when newCustomBook changes
                                    data={data}
                                    renderItem={({ item }) => (
                                        <View className="mb-4">
                                            <Text className="text-lg font-medium mb-2">{item.key}</Text>

                                            <TextInput
                                                placeholder={item.placeholder}
                                                placeholderTextColor="#C0C0C0"
                                                value={String(newCustomBook[item.field] ?? "")}  // Ensures it's a string
                                                onChangeText={(text) => handleInputChange(item.field, text)}
                                                className="border-b border-gray-300 p-2"
                                                multiline={item.isMultiline}
                                                numberOfLines={item.isMultiline ? 4 : 1}
                                            />
                                        </View>
                                    )}
                                    keyExtractor={(item) => item.key}
                                    className="max-h-52"
                                />
                                {errorCustomBookMessage && <Text className="text-red-500">{errorCustomBookMessage}</Text>}
                                <View className="mt-4">
                                    <Pressable
                                        className="bg-blue-500 rounded p-2 mb-4"
                                        disabled={errorCustomBookMessage !== ""}
                                        onPress={() => handleConfirmForAddingCustomBook()}
                                    >
                                        <Text className="text-white text-center">Confirm</Text>
                                    </Pressable>
                                    <Pressable
                                        className="bg-red-500 rounded p-2"
                                        onPress={() => setAddCustomBookModalVisible(false)}
                                    >
                                        <Text className="text-white text-center">Cancel</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                        {/* close modal on background tap */}
                        <Pressable className="flex-1" onPress={() => setAddCustomBookModalVisible(false)}></Pressable>
                    </View>
                    {/* close modal on background tap */}

                </Modal>
            </>}


        </View>
    );
};

export default CategoryPage;