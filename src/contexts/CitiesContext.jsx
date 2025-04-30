import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import { supabase } from "../utils/supabase";
import { useAuth } from "./FakeAuthContext";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const { user, loading: authLoading } = useAuth();

  useEffect(
    function () {
      async function fetchCities() {
        dispatch({ type: "loading" });

        if (authLoading) {
          return;
        }

        if (!user) {
          return;
        }

        const { data, error } = await supabase
          .from("cities")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          dispatch({
            type: "rejected",
            payload: "There was an error loading cities...",
          });
        } else {
          dispatch({ type: "cities/loaded", payload: data });
        }
      }

      fetchCities();
    },
    [user, authLoading]
  );

  const getCity = useCallback(
    async function getCity(id) {
      if (currentCity?.id && Number(id) === currentCity.id) return;

      dispatch({ type: "loading" });

      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the city...",
        });
      } else {
        dispatch({ type: "city/loaded", payload: data });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });

    if (!user) {
      dispatch({
        type: "rejected",
        payload: "User not authenticated",
      });
      return;
    }

    const cityWithUser = {
      ...newCity,
      user_id: user.id,
    };

    console.log("Submitting to Supabase:", cityWithUser);

    const { data, error } = await supabase
      .from("cities")
      .insert([cityWithUser])
      .select()
      .single();

    if (error) {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city...",
      });
    } else {
      dispatch({ type: "city/created", payload: data });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    const { data, error } = await supabase
      .from("cities")
      .delete()
      .eq("id", id)
      .select(); // 👈 Will return deleted data if successful
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
