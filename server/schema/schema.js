const graphql = require("graphql");

const Movies = require("../models/movie");
const Directors = require("../models/director");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean
} = graphql;

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: new GraphQLNonNull(GraphQLString) },
    watched: { type: new GraphQLNonNull(GraphQLBoolean) },
    rate: {
      type: GraphQLInt
    },
    directorId: { type: GraphQLID },
    director: {
      type: DirectorType,
      resolve({ directorId }, args) {
        return Directors.findById(directorId);
      }
    }
  })
});
const DirectorType = new GraphQLObjectType({
  name: "Director",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    movies: {
      type: new GraphQLList(MovieType),
      resolve({ id }, args) {
        return Movies.find({ directorId: id });
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, { name, age }) {
        const director = new Directors({
          name,
          age
        });
        return director.save();
      }
    },

    deleteDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Directors.findByIdAndRemove(args.id);
      }
    },

    updateDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, { name, age }) {
        return Directors.findByIdAndUpdate(
          args.id,
          { $set: { name, age } },
          { new: true }
        );
      }
    },

    //-------------------Movie-------------

    addMovie: {
      type: MovieType,
      args: {
        genre: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
        rate: {
          type: GraphQLInt
        }
      },
      resolve(parent, { name, genre, directorId, watched, rate }) {
        const movie = new Movies({
          name,
          genre,
          directorId,
          watched,
          rate
        });
        return movie.save();
      }
    },

    deleteMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Movies.findByIdAndRemove(args.id);
      }
    },

    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
        rate: {
          type: GraphQLInt
        }
      },
      resolve(parent, args) {
        return Movies.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name,
              genre,
              directorId,
              watched,
              rate
            }
          },
          { new: true }
        );
      }
    }
  }
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Movies.findById(args.id);
      }
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Directors.findById(args.id);
      }
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve() {
        return Movies.find({});
      }
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve() {
        return Directors.find({});
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
