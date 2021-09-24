# Polygram: Rest API

Official Rest api of [Polygram](https://polygram.netlify.app)

## Setup

### Requirements

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)

### Installation

Clone the repo locally then install all the dependencies using [NPM](https://npmjs.org/)

```bash
git clone https://github.com/aromalanil/polygram-backend.git
cd polygram-backend
npm install
```

### Local Development

1. Create a `.env` file in the project root and add all the environment variables mentioned [here](#environment-variables)
2. Execute the following command.

```bash
npm run dev
```

This will start a local server at [http://localhost:5000](http://localhost:5000)

### Production

1. Create a `.env` file in the project root and add all the envrionment variables mentioned [here](#environment-variables)
2. Execute the following command.

```bash
npm start
```

## Environment Variables

| Variable                     | Description                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------- |
| `PORT`                       | The port in which the server should run                                           |
| `NODE_ENV`                   | `development` or `production`                                                     |
| `HOSTNAME`                   | The url to which the server is deployed                                           |
| `GOOGLE_OAUTH_CLIENT_SECRET` | OAuth secret from Google                                                          |
| `JWT_SECRET`                 | A long random string, to sign the JWT                                             |
| `GOOGLE_OAUTH_CLIENT_ID`     | Client ID from Google                                                             |
| `ALLOWED_ORIGINS`            | All origins to which CORS will be enabled. (Origins should be seperated by space) |
| `GOOGLE_REFRESH_TOKEN`       | Refresh token from Google                                                         |
| `VAPID_PUBLIC_KEY`           | Public key generated using `webpush` library                                      |
| `VAPID_PRIVATE_KEY`          | Private key generated using `webpush` library                                     |
| `GOOGLE_REFRESH_TOKEN`       | Refresh token from Google                                                         |
| `MASTER_PASSWORD`            | Master password for adding topics                                                 |
| `DATABASE_URL`               | Connection link for mongoDB                                                       |

## Documentation

## User

- Every user related routes falls here

### Register `POST`

    /api/users/register

Register a user to Poly by providing the necessary details. This route will send an OTP to the given email id, which can be used to verify the user

<details>
  <summary>▶️ Example</summary>
  
##### <img src="https://i.pinimg.com/originals/b0/88/54/b08854e2b29c5ee86876790884b406a9.gif" width="18" height="18" /> EXAMPLE REQUEST  BODY 
```json
{
    "email":"aromalanilkannan@gmail.com",
    "first_name":"Aromal",
    "last_name":"Anil",
    "password":"Passw0rd1@3",
    "username":"aromalanil"
}
```
#####  <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" />  EXAMPLE RESPONSE

```json
{
  "msg": "User created successfully"
}
```

</details>    
    
###  Verify `POST`
	
	/api/users/verify
	
After the user registration is completed, use this route to verify the user. OTP send to the user must also be included in the request.

<details>
  <summary>▶️ Example</summary>

##### <img src="https://i.pinimg.com/originals/b0/88/54/b08854e2b29c5ee86876790884b406a9.gif" width="18" height="18" /> EXAMPLE REQUEST BODY

```json
{
  "username": "aromalanil",
  "otp": "060690"
}
```

##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE

```json
{
  "message": "Account verified & Logged In"
}
```

</details>

### Login `POST`

    /api/users/login

Use this route to make the user login.

<details>
  <summary>▶️ Example</summary>

##### <img src="https://i.pinimg.com/originals/b0/88/54/b08854e2b29c5ee86876790884b406a9.gif" width="18" height="18" /> EXAMPLE REQUEST BODY

```json
{
  "username": "aromalanil",
  "password": "Passw0rd1@3"
}
```

##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE

```json
{
  "message": "Successfully Logged In"
}
```

</details>

### Logout `POST`

    /api/users/logout

Use this route to logout the user

<details>
  <summary>▶️ Example</summary>

##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE

```json
{
  "message": "Successfully Logged Out"
}
```

</details>

### Send OTP `POST`

    /api/users/send-otp

Verified users can use this send an OTP to their email. This OTP may be used for functions like change password etc

<details>
  <summary>▶️ Example</summary>

##### <img src="https://i.pinimg.com/originals/b0/88/54/b08854e2b29c5ee86876790884b406a9.gif" width="18" height="18" /> EXAMPLE REQUEST BODY

```json
{
  "email": "aromalanilkannan@gmail.com"
}
```

##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE

```json
{
  "message": "OTP send"
}
```

</details>

### Forgot Password `POST`

    /api/users/forgot-password

If you forgot your password, first generate an OTP (POST request to/users/send-otp). Then provide the new password along with the generated OTP to this route to change your password

<details>
  <summary>▶️ Example</summary>

##### <img src="https://i.pinimg.com/originals/b0/88/54/b08854e2b29c5ee86876790884b406a9.gif" width="18" height="18" /> EXAMPLE REQUEST BODY

```json
{
  "otp": "678668",
  "new_password": "1@qwerty",
  "username": "aromalanil"
}
```

##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE

```json
{
  "message": "Password changed successfully"
}
```

</details>

### Change Password `POST`

    /api/users/change-password

Use this route to change your password. Provide your old password so that we can verify it's really you 😉

<details>
  <summary>▶️ Example</summary>
  
##### <img src="https://i.pinimg.com/originals/b0/88/54/b08854e2b29c5ee86876790884b406a9.gif" width="18" height="18" /> EXAMPLE REQUEST  BODY 
```json
{
    "old_password":"1@qwerty",
    "new_password":"Passw0rd1@3"
}
```
##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE
```json
{
  "message": "Password changed successfully"
}
```
</details>

### Edit Details `POST`

    /api/users/edit

Logged in user can use this route to change their details.

<details>
  <summary>▶️ Example</summary>

##### <img src="https://i.pinimg.com/originals/b0/88/54/b08854e2b29c5ee86876790884b406a9.gif" width="18" height="18" /> EXAMPLE REQUEST BODY

```json
{
  "first_name": "Tony"
}
```

##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE

```json
{
  "msg": "User details updated successfully"
}
```

</details>

### Find Single User `GET`

    /api/users/aromalanil

Use this route to get details of a single user

<details>
  <summary>▶️ Example</summary>

##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE

```json
{
  "msg": "User Found",
  "data": {
    "user": {
      "_id": "608419f19c5d2720bc6118da",
      "followed_topics": [],
      "email": "aromalanilkannan@gmail.com",
      "username": "aromalanil",
      "last_name": "Anil",
      "first_name": "Aromal",
      "profile_picture": "https://avatar.oxro.io/avatar.png?name=Aromal&background=2D2D2D&caps=3"
    }
  }
}
```

</details>

### Google OAuth `POST`

    /api/users/auth/google

Use this route to register you as a new user/ login if you are an existing user

<details>
  <summary>▶️ Example</summary>

##### <img src="https://i.pinimg.com/originals/b0/88/54/b08854e2b29c5ee86876790884b406a9.gif" width="18" height="18" /> EXAMPLE REQUEST BODY

```json
{
  "token": "<TOKEN GENERATED BY GOOGLE CLIENT>"
}
```

</details>

### Add Profile Picture `POST`

    /api/users/profile_picture

Update the profile picture of the user

<details>
  <summary>▶️ Example</summary>

##### <img src="https://i.pinimg.com/originals/b0/88/54/b08854e2b29c5ee86876790884b406a9.gif" width="18" height="18" /> EXAMPLE REQUEST BODY

```json
{
  "image": "<Image as Base64 encoded string>"
}
```

</details>

## Question

Every question related routes falls here

### Create Question `POST`

    /api/questions

Logged in user can use this route to create a new question.

<details>
  <summary>▶️ Example</summary>

##### <img src="https://i.pinimg.com/originals/b0/88/54/b08854e2b29c5ee86876790884b406a9.gif" width="18" height="18" /> EXAMPLE REQUEST BODY

```json
{
  "title": "Who is best? Sachin or Dhoni?",
  "content": "Even though this may seem like a silly question for many, I'm just curious to find out",
  "topics": ["Cricket", "Celebrity"],
  "options": ["Sachin", "Dhoni"]
}
```

##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE

```json
{
  "msg": "Question successfully created"
}
```

</details>

### Find Questions `GET`

    /api/questions

Get questions posted, by default the latest question comes first

<details>
  <summary>▶️ Example</summary>

##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE

```json
{
  "msg": "Questions found",
  "questions": [
    {
      "options": ["Sachin", "Dhoni"],
      "opinions": [],
      "topics": ["Cricket", "Celebrity"],
      "_id": "6084240e4ec3ff27d2439a8e",
      "title": "Who is best? Sachin or Dhoni?",
      "author": "608419f19c5d2720bc6118da",
      "content": "Even though this may seem like a silly question for many, I'm just curious to find out",
      "created_at": "2021-04-24T13:58:38.152Z",
      "__v": 0
    }
  ]
}
```

#### PARAMETERS

| Parameters | Description                                                                                   |
| ---------- | --------------------------------------------------------------------------------------------- |
| following  | Set this to true to show questions from the topics you follow (Only valid for Logged in user) |
| topic      | Get topics which falls under this topic                                                       |
| page_size  | Limit the number of entries in a response                                                     |
| before_id  | Show questions posted after the question with this id                                         |
| after_id   | Show questions posted before the question with this id                                        |
| search     | Only include questions having this keyword in it's title/content                              |

</details>

### Find Single Question `GET`

     /api/questions/6084240e4ec3ff27d2439a8e

Find details of a single question using question ID

- The result will also contain the percentages of each options based on the opinions received

<details>
  <summary>▶️ Example</summary>

##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE

```json
{
  "msg": "Question Found",
  "question": {
    "_id": "6084240e4ec3ff27d2439a8e",
    "options": [
      {
        "option": "Sachin",
        "percentage": 0
      },
      {
        "option": "Dhoni",
        "percentage": 0
      }
    ],
    "opinions": [],
    "topics": ["Cricket", "Celebrity"],
    "title": "Who is best? Sachin or Dhoni?",
    "author": "608419f19c5d2720bc6118da",
    "content": "Even though this may seem like a silly question for many, I'm just curious to find out",
    "created_at": "2021-04-24T13:58:38.152Z",
    "__v": 0
  }
}
```

</details>

### Remove Question `DEL`

    /api/questions/6084280a8ab5f82bdb3bbb54

The user can delete a question that they posted using this route

<details>
  <summary>▶️ Example</summary>

##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE

```json
{
  "msg": "Question deleted successfully"
}
```

</details>

## Topics

Every topic related routes falls here

### Get Topics `GET`

    /api/topics

Get details of topics

<details>
  <summary>▶️ Example</summary>

#### PARAMETERS

| Parameters | Description                                                                         |
| ---------- | ----------------------------------------------------------------------------------- | --- |
| count      | Set count to true to get the total number of questions posted under this topic      |     |
| search     | Search for certain topics using search. Note: Search & count cannot be used at once |     |

##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE

```json
{
  "topics": [
    {
      "_id": "608420c9d8d31f24dba51d13",
      "name": "Cricket"
    },
    {
      "_id": "608420c9d8d31f24dba51d14",
      "name": "Tech"
    },
    {
      "_id": "608420c9d8d31f24dba51d15",
      "name": "Art"
    },
    {
      "_id": "608420c9d8d31f24dba51d16",
      "name": "Fiction"
    },
    {
      "_id": "608420c9d8d31f24dba51d17",
      "name": "Celebrity"
    }
  ]
}
```

</details>

### Follow Topic `POST`

    /api/topics/follow

Logged in user can use this route to follow a list of topics

<details>
  <summary>▶️ Example</summary>

##### <img src="https://i.pinimg.com/originals/b0/88/54/b08854e2b29c5ee86876790884b406a9.gif" width="18" height="18" /> EXAMPLE REQUEST BODY

```json
'{
    "topics":["Cricket","Fiction"]
}'
```

##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE

```json
{
  "msg": "Updated followed topics successfully"
}
```

</details>

### Unfollow Topic `POST`

    /api/topics/unfollow

Logged in user can use this route to unfollow a list of topics

<details>
  <summary>▶️ Example</summary>

##### <img src="https://i.pinimg.com/originals/b0/88/54/b08854e2b29c5ee86876790884b406a9.gif" width="18" height="18" /> EXAMPLE REQUEST BODY

```json
'{
    "topics":["Fiction"]
}'
```

##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE

```json
{
  "msg": "Updated followed topics successfully"
}
```

</details>

### Get Single Topic `GET`

    /api/topics/608420c9d8d31f24dba51d14

The above route is used to get information of a single topic

<details>
  <summary>▶️ Example</summary>

##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE

```javascript
{
  "msg": "Topic Found",
  "data": {
    "topic": {
      "_id": "608420c9d8d31f24dba51d14",
      "name": "Tech",
      "created_at": "2021-04-24T13:44:41.620Z"
    }
  }
}
```

</details>

## Opinions

Every opinion related routes falls here

### Find Opinions `GET`

    /api/opinions?question_id=607fbf0ca30d471a8e48b621

<details>
  <summary>▶️ Example</summary>

#### PARAMETERS

| Parameters  | Description              |
| ----------- | ------------------------ |
| question_id | 607fbf0ca30d471a8e48b621 |

</details>

### Create Opinion `POST`

    /api/opinions/

Use this route to add your opinion to a question

<details>
  <summary>▶️ Example</summary>

##### <img src="https://i.pinimg.com/originals/b0/88/54/b08854e2b29c5ee86876790884b406a9.gif" width="18" height="18" /> EXAMPLE REQUEST BODY

```json
 '{
    "question_id":"6084282a8ab5f82bdb3bbb55",
    "content":"Sachin is the god of cricket",
    "option":"Sachin"
}'
```

##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE

```json
{
  "msg": "Opinion created successfully",
  "data": {
    "opinion": {
      "upvotes": ["608419f19c5d2720bc6118da"],
      "downvotes": [],
      "_id": "60842a368ab5f82bdb3bbb56",
      "option": "Sachin",
      "content": "Sachin is the god of cricket",
      "question_id": "6084282a8ab5f82bdb3bbb55",
      "author": "608419f19c5d2720bc6118da",
      "created_at": "2021-04-24T14:24:54.539Z",
      "__v": 0,
      "upvote_count": 1,
      "downvote_count": 0,
      "id": "60842a368ab5f82bdb3bbb56"
    }
  }
}
```

</details>

### Add Upvote `POST`

    /api/opinions/60842a368ab5f82bdb3bbb56/upvote

Add upvote to an opinion

- This will remove your downvote to the opinion, if it exist

<details>
  <summary>▶️ Example</summary>

##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE

```json
{
  "msg": "Upvote added successfully",
  "data": {
    "upvote_count": 1,
    "downvote_count": 0
  }
}
```

</details>

### Add Downvote `POST`

    /api/opinions/60842a368ab5f82bdb3bbb56/downvote

Add downvote to an opinion

- This will remove your upvote to the opinion, if it exist

### Remove Downvote `DEL`

    /api/opinions/60842a368ab5f82bdb3bbb56/downvote

Remove your downvote from an opinion

<details>
  <summary>▶️ Example</summary>

##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE

```json
{
  "msg": "Downvote removed successfully",
  "data": {
    "downvote_count": 0
  }
}
```

</details>

### Remove Upvote `DEL`

    /api/opinions/60842a368ab5f82bdb3bbb56/upvote

Remove your upvote from an opinion

<details>
  <summary>▶️ Example</summary>

##### <img src="https://socialinfluencerarmy.com/hosted/images/90/b13b70564011e8923bbfd19afa32a1/RedDownArrow.gif" width="12" height="12" /> EXAMPLE RESPONSE

```json
{
  "msg": "Upvote removed successfully",
  "data": {
    "upvote_count": 0
  }
}
```

</details>

## Pictures

Every picture related routes falls here

### Find Picture `GET`

    /api/pictures/608428b8853d53307a7bc169

Get picture based on the id

## License

This project is licensed under [GNU GPL v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html) - see the [`LICENSE`](https://github.com/aromalanil/polygram-backend/blob/main/LICENSE) file for details.
