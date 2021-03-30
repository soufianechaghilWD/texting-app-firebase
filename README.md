# Creating a Texting App 

In this project I built a texting app using Firebase and React.js

## Technologies I used

I didn't use any back end for this app I took advantage of firebase authentification and firebase realtime database . For the front end I used react , To manage the state I used React Context API and for navigating the App I used React Router . for the styling I used Material UI , emoji-picker-react , react-icons and CSS . In the file src/outils.js there's some functions I used to solve some problems (Getting an Id based on two ids (The id should be the same no matter the order of the inputs) to create a room for a new conversation, Getting the list of users based on an input for the search functionality ...)

### About the App

It's a texting app , Firstable it allows the user to sign up with email and password, then the user can search for other users by username, And send them a text (Including Emojis) and it's realtime, when the receiver sees the text the user gets notified (Seen functionality) , Also the user has the list of all his contacts ( Sorted by time ) and the last Text in theire conversation , When The user receives a new text it gets highlighted until he replies to it . And Finally the user can Log out and Log In again .

#### The Url 

https://textin-app.web.app/

### Picture

![screencapture-textin-app-web-app-home-2021-03-30-17_33_46](https://user-images.githubusercontent.com/59412279/113023998-27870900-917e-11eb-9bcc-d0d6e10820ab.png)
