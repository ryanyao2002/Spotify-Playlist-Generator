import React, { useEffect } from 'react';
import axios from 'axios';
const querystring = require('querystring');

function App() {

  const redirect_uri = "https://playlist-generator-for-spotify.herokuapp.com"


  const getToken = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.get('code'));
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')
        },
        body: querystring.stringify({
          'grant_type' : 'authorization_code',
          'code': urlParams.get('code'),
          'redirect_uri' : "https://playlist-generator-for-spotify.herokuapp.com"
        })
      })
      console.log(data);
      console.log("does this work");
      let data = await result;
       return data.data.access_token;

  }


  function  createPlaylist (data, token){
    console.log(data);
      fetch("https://api.spotify.com/v1/me" ,{
      headers: {
        'Authorization' : 'Bearer ' + token
      }
    }).then(function(res){
        return res.json();
    }).then(function(res){
      fetch(res.href +"/playlists", {
        method: 'POST',
        headers:{
          'Authorization' : 'Bearer ' + token,
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
          'name' : 'New Random Playlist',
        })
      }).then(function(res){
        return res.json();
    }).then(function(res){
      searchAndAddRelatedItems(res.id, token, data);
    })
    })
  }


  function searchAndAddRelatedItems(playlistIDURL, token, searchData){
    let searchquery = ""+ searchData.items[0].name;

    fetch("https://api.spotify.com/v1/search?q=artist:" + searchquery +"&type=track", {
      headers:{
        'Authorization': 'Bearer ' + token
      } 
    }).then(function(res){
      return res.json();
  }).then(function(res){
    let itemsArr = res.tracks.items;
    itemsArr = itemsArr.map(function(e){
      return e.uri
    })
    console.log(itemsArr);

    fetch("https://api.spotify.com/v1/playlists/"+ playlistIDURL + "/tracks", {
        method:'POST',
        headers:{
          'Authorization': 'Bearer ' + token
        },
        body:JSON.stringify({
          'uris': itemsArr
        })
      })
  })
  }

  const  handleClick1 = async () =>{

        const token = await getToken();
          fetch("https://api.spotify.com/v1/me/top/artists?limit=1" ,{
          headers: {
            'Authorization' : 'Bearer ' + token
          }
        }).then(function(res){
            return res.json();
        }).then(function(res){
          createPlaylist(res, token);
        })
      }

  



  
  function handleClick(){
    window.location = 'https://playlist-generator-for-spotify.herokuapp.com/login';  
  }


  useEffect(function(){
      handleClick1();
  }, []);





  return (
    <div className="App">
    <h1> Playlist Generator for Spotify</h1>
        <p>
          Click to be able to generate a randomized track based on your most listened to genres!
        </p>
        <button  className="btn btn-success" onClick={handleClick}> Generate New Playlist!</button>
    </div>
  );
}

export default App;
