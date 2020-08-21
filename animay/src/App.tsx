import React, { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import {DebounceInput} from "react-debounce-input";
import { mediaObject,mediaCollection,pageObject,searchVars, SearchViewProps, SearchInputProps } from "./interfaces";
import { Container, Grid, makeStyles, GridList, GridListTile, TextField, GridListTileBar } from "@material-ui/core";


const query = gql`
query Search($search: String!) {
  Page(page:0,perPage:20) {
     media(search: $search) {
         title {
             english
         }
         coverImage {
             large
         }
     }
  } 
}
`;

export function SearchInput({searchQuery, setsearchQuery} : SearchInputProps) {
    const setsearchQueryClosure = (e: React.ChangeEvent<HTMLInputElement>) => {
        setsearchQuery(e.target.value)
        console.log(e.target.value)
    }
    return (
        <DebounceInput element={TextField}  debounceTimeout={1000} onChange={setsearchQueryClosure} value={searchQuery}/>
    )
}


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: 500,
      height: 450,
    },
    icon: {
      color: 'rgba(255, 255, 255, 0.54)',
    },
  }));

export function SearchView({data} : SearchViewProps) {

    const classes = useStyles();

    return (
        <GridList component="div" cols={3}>
            
        
            {data.Page.media.filter((media) => media.title.english)
            .map((media) => (<GridListTile>{media.title.english}<img src={media.coverImage.large}/><GridListTileBar title={media.title.english}/></GridListTile>))}
        </GridList>
        
    )
}



export default function App() {

    const [searchQuery, setsearchQuery] = useState("test");

    const {loading,error,data} = useQuery<pageObject,searchVars>(query,{variables:{search:searchQuery}})
    
    console.log(data?.Page.media)

    return (
        <Container maxWidth="md">
            <Grid container>
                <Grid item>
                    
            <SearchInput searchQuery={searchQuery} setsearchQuery={setsearchQuery}/>
                </Grid>
                <Grid item container md={12}>
                  {error && <p>Error.</p>}
                  {loading && <p>Loading...</p>}
                  {data && <SearchView data={data}/>}
                </Grid>
            </Grid>
           
        </Container>
    );
}
