import React from "react"
import { StyleSheet, Text } from "react-native"
import { TouchableHighlight } from "react-native-gesture-handler"

export const BooksListItem = ({title,story_title}: any) => {
    return (
        <TouchableHighlight style={styles.child}>
            <Text style={styles.childText}>
                {
                    (title) ? title : 
                    (story_title) ? story_title : "N/A"
                }
            </Text>
        </TouchableHighlight>
    )
}

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