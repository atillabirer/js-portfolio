import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import SpinningOverlay from "react-native-loading-spinner-overlay";
import { AuthorListItem } from './AuthorListItem';
import { AuthorData, RootStackParamList } from './types';

import {getUnique} from "./utils"
  

const AuthorList = ({navigation}: StackScreenProps<RootStackParamList,"Authors">) => {

    const [page, setPage] = useState(1);
    const [pagedata, setPageData] = useState<AuthorData[]>([])
    const [loading, setLoading] = useState(false);
    let totalPages = 5;

    async function fetchMoreData() {

        //stop fetching if we reached max pages
        if(page == totalPages) return;


        try {
            setLoading(true);
            //es7 string parsing syntax
            let data = await fetch(`https://jsonmock.hackerrank.com/api/articles?page=${page}`);


            //get page object
            let parsed = await data.json()
            totalPages = parsed.total_pages;
            //get data prop from object, append page id to authors (arrayizing for Flatlist)
            let curatedArray = getUnique(parsed.data,"author");
            let newDataArray = curatedArray.map((single: AuthorData) => ({ ...single, page }))
            //remove dupes

            //update with  the curated (unique authors)
            setPageData([...pagedata,...newDataArray]);


            setPage((page) => (page + 1));

            setLoading(false);


        }
        catch (error) {
            console.log(error)
        }
    }

    function flipPage() {
        fetchMoreData()
    }

    useEffect(() => {
        fetchMoreData();
        
    }, []) //need once
    if(!pagedata) {
        return <Text>No pages.</Text>
    }


    return (

        <SafeAreaView style={styles.parent}>
            <FlatList data={pagedata}
                renderItem={({ item }) => (<AuthorListItem {...item} navigation={navigation}/>)}
                keyExtractor={item => item.created_at as string}
                onEndReached={flipPage}
                onEndReachedThreshold={0.4}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={() => 1}/> 
                }
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    parent: {
        flex: 1,
        height: Dimensions.get("window").height,
        padding: 10
    },
    child: {
        height: 100,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "lightgrey",
        margin: 10,
        color: "black",
    },
    childText: {
        fontSize: 24
    }

})


export default AuthorList

