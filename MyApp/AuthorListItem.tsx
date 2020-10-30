import React from "react"
import { StyleSheet, Text } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

export const AuthorListItem = ({ page, story_title, author, navigation }: any) => {
    return (
      <TouchableOpacity style={styles.child} onPress={() => navigation.navigate("BooksList",{author})}>
        <Text style={styles.childText}>{author} {page}</Text>
      </TouchableOpacity>
    )
  }

  const styles = StyleSheet.create({

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
