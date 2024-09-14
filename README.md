# OnlyAuth Backend

## API Routes

## For OAuth
1. ### `POST` /o/grant
    `Header`:

        ```
            {
                Authorization: BEARER_AUTH
            }
        ```

    `Payload`:
        
        ```
            {
                scopes: ARRAY:STRING,
                cliend_id: STRING,
                redirect_url: STRING
            }
        ```
    `Response`:
        redirect with token to redirect url configured in db.
        ```
            code: 303
        ```

2. ### `POST` /o/token

    `Payload`:

        ```
            {
                token: STRING
            }
        ```

    `Response`:

        ```
            {
                access_token: STRING
            }
        ```

3. ### `GET` /u
    pass access token from #2 request into header inside authorization field
    `Header`:

        ```
            {
                Authorization: BEARER_AUTH
            }
        ```

    `Response`:

        ```
            {
                user_name: STRING,
                email: STRING,
                full_name: STRING,
                picture: STRING,
            }
        ```

    