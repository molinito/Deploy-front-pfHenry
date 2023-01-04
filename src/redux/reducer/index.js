import {
  CLEAN,
  GET_ALL_PRODUCTS,
  GET_PRODUCT_DETAIL,
  SEARCH_NAME,
  GET_CATEGORIES,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  ORDERBYAZ,
  FILTER_CATEGORY,
  GET_PRODUCT_RATING,
  PRICE_FILTER,
  ADD_FAVORITE,
  REMOVE_FAVORITE,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  PAYMENT_STRIPE,
  ADD_TO_CART,
  INCREASE_QUANTITY,
  DELETE_ONE_FROM_CART,
  DELETE_ALL_FROM_CART,
  CLEAR_CART,
  LOGIN_USER,
  GET_FAVORITES,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  GET_USER_PROFILE,
  DECREMENT_STOCK,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  CREATE_CATEGORIES,
  CREATE_USER,
} from "../actions";

const initialState = {
  products: [],
  detail: [],
  copyProducts: [],
  categories: [],
  rating: [],
  favorites: [],
  users: [],
  userDetail: [],
  stripe: [],
  cart: JSON.parse(localStorage.getItem("cart")) || [],
  login: [],
  user: {},
  isLoading: false,
  isAuthenticated: false,
  error: "",
  userProfile: [],
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        copyProducts: action.payload,
      };
    case GET_PRODUCT_DETAIL:
      return {
        ...state,
        detail: action.payload,
      };
    case SEARCH_NAME: {
      const all = state.products;
      const search = all.filter((f) =>
        f.name.toLowerCase().includes(action.payload.toLowerCase())
      );

      return {
        ...state,
        copyProducts: search,
      };
    }
    case CLEAN:
      return {
        ...state,
        detail: [],
      };

    case "CREATE_PRODUCT":
      return { ...state };

    case GET_CATEGORIES:
      return { ...state, categories: action.payload };

    case UPDATE_PRODUCT:
      return action.payload;

    case DELETE_PRODUCT:
      return action.payload;

    // CASE para traer el rating desde el reduce/index y poder ordenarlos de mayor a menor y de menor a mayor
    case GET_PRODUCT_RATING: {
      let filterorderrating = [...state.products];
      let filterproductrating = [...state.copyProducts];
      if (action.payload === "all") {
        return {
          ...state,
          copyProducts: filterorderrating,
        };
      }
      if (action.payload === "asc") {
        const data = filterproductrating.sort((a, b) =>
          a.rating > b.rating ? 1 : -1
        );
        return {
          ...state,
          copyProducts: data,
        };
      }

      const data = filterproductrating.sort((a, b) =>
        a.rating > b.rating ? -1 : 1
      );
      return {
        ...state,
        copyProducts: data,
      };
    }

    // CASE para traer el precio desde el reduce/index y poder ordenarlos de mayor a menor y de menor a mayor
    case PRICE_FILTER: {
      let filterorderprice = [...state.products];
      let filterproductprice = [...state.copyProducts];
      if (action.payload === "all") {
        return {
          ...state,
          copyProducts: filterorderprice,
        };
      }
      if (action.payload === "asc") {
        const data = filterproductprice.sort((a, b) => {
          let priceA = parseInt(a.price);
          let priceB = parseInt(b.price);
          if (priceA > priceB) return 1;
          if (priceA < priceB) return -1;
          else return 0;
        });
        return {
          ...state,
          copyProducts: data,
        };
      }

      const data = filterproductprice.sort((a, b) => {
        let pesoA = parseInt(a.price);
        let pesoB = parseInt(b.price);
        if (pesoA > pesoB) return -1;
        if (pesoA < pesoB) return 1;
        else return 0;
      });
      return {
        ...state,
        copyProducts: data,
      };
    }

    /* case PRICE_FILTER: {
      let filterorder = [...state.products]
      let filterproduct = [...state.copyProducts]
      if (action.payload === "all") {
                return {
                    ...state,
          copyProducts: filterorder 
                }
            }
            if (action.payload === 'asc') {
                const data =  filterproduct.sort((a, b) => (a.price > b.price ? 1 : -1))
                return {
                    ...state,
                    copyProducts: data
                }
            }

            const data = filterproduct.sort((a, b) => (a.price > b.price ? -1 : 1))
            return {
                ...state,
                copyProducts: data
            }
        }  */

    case ORDERBYAZ: {
      let filterorder = [...state.products];
      let filterproduct = [...state.copyProducts];
      if (action.payload === "all") {
        return {
          ...state,
          copyProducts: filterorder,
        };
      }

      if (action.payload === "asc") {
        const data = filterproduct.sort((a, b) =>
          a.name?.toUpperCase() > b.name?.toUpperCase() ? 1 : -1
        );
        return {
          ...state,
          copyProducts: data,
        };
      }

      const data = filterproduct.sort((a, b) =>
        a.name?.toUpperCase() > b.name?.toUpperCase() ? -1 : 1
      );

      return {
        ...state,
        copyProducts: data,
      };
    }

    case FILTER_CATEGORY: {
      let allTemperaments = state.products;
      let aux2 =
        action.payload === "all"
          ? allTemperaments
          : allTemperaments.filter((el) =>
              el.CategoryProduct[0].name?.includes(action.payload)
            );
      return {
        ...state,
        copyProducts: aux2,
      };
    }
    case GET_FAVORITES: {
      return {
        ...state,
        favorites: action.payload,
      };
    }

    case ADD_FAVORITE: {
      return {
        ...state,
        favorites: action.payload,
      };
    }
    case REMOVE_FAVORITE: {
      return {
        ...state,
        favorites: action.payload,
      };
    }

    case GET_ALL_USERS: {
      return {
        ...state,
        users: action.payload,
      };
    }

    case GET_USER_BY_ID: {
      return {
        ...state,
        userDetail: action.payload,
      };
    }

    case PAYMENT_STRIPE: {
      return {
        ...state,
        stripe: action.payload,
      };
    }
    case ADD_TO_CART: {
      let newItem = state.products.find(
        (product) => product.id === action.payload
      );
      let itemInCart = state.cart.find((item) => item.id == newItem.id);
      return itemInCart
        ? {
            ...state,
            cart: state.cart.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          }
        : {
            ...state,
            cart: [...state.cart, { ...newItem, quantity: 1 }],
          };
    }
    case DELETE_ONE_FROM_CART: {
      let itemToDelete = state.cart.find((item) => item.id === action.payload);
      return itemToDelete.quantity > 1
        ? {
            ...state,
            cart: state.cart.map((item) =>
              item.id === action.payload
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
          }
        : {
            ...state,
            cart: state.cart.filter((item) => item.id !== action.payload),
          };
    }

    case DELETE_ALL_FROM_CART: {
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    }

    case INCREASE_QUANTITY: {
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }

    case CLEAR_CART: {
      return {
        ...state,
        cart: [],
      };
    }

    case DECREMENT_STOCK: {
    }

    // case LOGIN_USER:
    //   let user = action.payload.data.user;
    //   let loginUser = action.payload.data.jwt || action.payload.data;
    //   let name;
    //   if (user) {
    //     name = user.firstname + " " + user.lastname;
    //     return {
    //       ...state,
    //       login: loginUser,
    //       user: {
    //         id: user.id,
    //         username: user.username,
    //         name: name,
    //         email: user.email,
    //         admin: user.admin,
    //       },
    //     };
    //   } else {
    //     return {
    //       ...state,
    //       login: loginUser,
    //     };
    //   }

    case LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: {},
      };

    case GET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
      };

    case UPDATE_CATEGORY:
      return action.payload;

    case DELETE_CATEGORY:
      return action.payload;

    case CREATE_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };

    case CREATE_USER: {
      return {
        ...state,
        users: [...users, action.payload],
      };
    }

    default:
      return { ...state };
  }
}

export default rootReducer;
