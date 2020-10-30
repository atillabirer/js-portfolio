import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BooksListItem } from './BooksListItem';
import { AuthorData, RootStackParamList } from './types';

type BookListParamList = {
    author: string
}



//get all books for author
//set title from parameters given from AuthorList
const BooksList = ({ route, navigation }: StackScreenProps<RootStackParamList,"BooksList">) => {

    //get books for author
    const [books, setBooks] = useState<AuthorData[]>([]);

    async function fetchBooksForAuthor(author: string) {
        try {
            let rawData = await fetch(`https://jsonmock.hackerrank.com/api/articles?&author=${author}`);

            let parsedData = await rawData.json()

            setBooks(parsedData.data);



        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {

        navigation.setOptions({title: `Books by ${route.params.author}`})
    fetchBooksForAuthor(route.params.author);
        
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={books}
                renderItem={({ item }) => (<BooksListItem {...item}/>)}
                keyExtractor={item => item.created_at as string}
                
            />
        </SafeAreaView>
    )
}

export default BooksList

const styles = StyleSheet.create({
    child: {
        height: 100,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "lightgrey",
        margin: 10,
        color: "black"
    },
    childText: {
        fontSize: 24
    }
})
