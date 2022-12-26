import { gql } from "graphql-request";

export const GET_LOGGED_IN_USER = gql`
    query QueryUser {
        me {
            address,
            id,
            role,
            email,
            firstname,
            lastname
        }
    }
`;