import { gql } from "apollo-boost";

export const addMovieMutation = gql`
  mutation addMovie(
    $name: String!
    $watched: Boolean!
    $directorId: ID
    $genre: String!
    $rate: Int
  ) {
    addMovie(
      name: $name
      genre: $genre
      directorId: $directorId
      watched: $watched
      rate: $rate
    ) {
      name
    }
  }
`;

export const updateMovieMutation = gql`
  mutation updateMovie(
    $id: ID
    $name: String!
    $watched: Boolean!
    $directorId: ID
    $genre: String!
    $rate: Int
  ) {
    updateMovie(
      id: $id
      name: $name
      genre: $genre
      directorId: $directorId
      watched: $watched
      rate: $rate
    ) {
      name
    }
  }
`;
