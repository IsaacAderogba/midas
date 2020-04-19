require("cross-fetch/polyfill");
const { gql } = require("apollo-boost");
const { getApolloClient } = require("../../../services/jest/getApolloClient");
const { seedDatabase, seededUser } = require("../../../services/jest/seeds");
const UserAPI = require("../userDataSource");

const client = getApolloClient();

const User = {
  fragments: {
    attributes: gql`
      fragment userAttributes on User {
        id
        firstName
        lastName
        email
        avatarURL
        isVerified
        photoId
      }
    `,
  },
};

const REGISTER_USER = gql`
  mutation registerUser($registerInput: RegisterInput) {
    registerUser(registerInput: $registerInput) {
      token
      user {
        ...userAttributes
      }
    }
  }
  ${User.fragments.attributes}
`;

const LOGIN_USER = gql`
  mutation loginUser($loginInput: LoginInput) {
    loginUser(loginInput: $loginInput) {
      token
      user {
        ...userAttributes
      }
    }
  }
  ${User.fragments.attributes}
`;

const USER = gql`
  query user {
    user {
      ...userAttributes
    }
  }
  ${User.fragments.attributes}
`;

describe("User resolvers integration testing", () => {
  beforeEach(seedDatabase);

  test("Should register a new user", async () => {
    const userToRegister = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@email.com",
      password: "password",
    };

    const response = await client.mutate({
      mutation: REGISTER_USER,
      variables: {
        registerInput: userToRegister,
      },
    });

    const user = await UserAPI.readUser({
      email: response.data.registerUser.user.email,
    });

    expect(user.email).toBe(userToRegister.email);
  });

  test("Should log in an existing user", async () => {
    const response = await client.mutate({
      mutation: LOGIN_USER,
      variables: {
        loginInput: {
          email: seededUser.input.email,
          password: seededUser.input.password,
        },
      },
    });

    expect(response.data.loginUser.user.email).toBe(seededUser.input.email);
  });

  test("Should fetch user details", async () => {
    const client = getApolloClient(`null ${seededUser.user.token}`);
    const response = await client.mutate({ mutation: USER });
    expect(response.data.user.email).toBe(seededUser.input.email);
  });
});
