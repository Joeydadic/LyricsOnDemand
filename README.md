# LyricsOnDemand
LyricsOnDemand is from a personal school project in which we were required to take two API's ( any form of Auth ), and make them work together with one another. I personally chose to use Google Drive API with OAuth 2.0 requirements paired with lyricsovh API

The user is first asked to login to their Google Drive account, and is then asked to enter a Song Title paired with the songs Artist. The client then creates a new document in the users Google Drive account with the Song Title , and appropriate lyrics for the song inside of the document.

# Google Drive API
https://developers.google.com/drive is one of the API's used for this project. Google Drive API is authorized by the usage of OAuth 2.0. My client uses the users request to place the song lyrics of their choice into their Google Drive account.

# Lyricsovh API
https://lyricsovh.docs.apiary.io is the other API used for this project. It has been synchronized with the Google Drive API to allow the user to enter the necessary data to have the song lyrics of their choice uploaded to their Google Drive account.
